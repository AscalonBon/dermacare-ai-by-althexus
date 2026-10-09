from __future__ import annotations

import io
import logging
import uuid
from typing import Any

import cv2
import numpy as np
import torch
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from PIL import Image, UnidentifiedImageError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.model import IMAGE_SIZE, ModelRunner

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("dermacare.ml")
MAX_IMAGE_BYTES = 10 * 1024 * 1024
MAX_IMAGE_PIXELS = 12_000_000
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}

app = FastAPI(title="DermaCare Image Analysis", version="1.0.0")
model_runner = ModelRunner()


@app.middleware("http")
async def request_id_middleware(request: Request, call_next: Any) -> Any:
    request_id = request.headers.get("X-Request-Id") or str(uuid.uuid4())
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-Id"] = request_id
    return response


def error_response(request: Request, status_code: int, code: str, message: str) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "error": {
                "code": code,
                "message": message,
                "requestId": getattr(request.state, "request_id", None),
            }
        },
    )


@app.exception_handler(StarletteHTTPException)
async def handle_http_error(request: Request, error: StarletteHTTPException) -> JSONResponse:
    message = error.detail if isinstance(error.detail, str) else "The request could not be processed."
    return error_response(request, error.status_code, "REQUEST_ERROR", message)


@app.exception_handler(RequestValidationError)
async def handle_validation_error(request: Request, error: RequestValidationError) -> JSONResponse:
    logger.info("Invalid request [%s]: %s", request.state.request_id, error)
    return error_response(request, 422, "INVALID_REQUEST", "The request is invalid.")


@app.exception_handler(Exception)
async def handle_unexpected_error(request: Request, error: Exception) -> JSONResponse:
    logger.exception("Unhandled error [%s]", request.state.request_id)
    return error_response(
        request, 500, "INTERNAL_SERVER_ERROR", "An unexpected analysis error occurred."
    )


def prepare_image(image_bytes: bytes, content_type: str) -> tuple[np.ndarray, torch.Tensor]:
    if content_type.split(";", maxsplit=1)[0].strip().lower() not in ALLOWED_CONTENT_TYPES:
        raise ValueError("Upload a JPG, PNG, or WEBP image.")
    if not image_bytes or len(image_bytes) > MAX_IMAGE_BYTES:
        raise ValueError("Image must be 10 MB or smaller.")

    try:
        with Image.open(io.BytesIO(image_bytes)) as image:
            if image.format not in {"JPEG", "PNG", "WEBP"}:
                raise ValueError("Upload a JPG, PNG, or WEBP image.")
            expected_format = {
                "image/jpeg": "JPEG",
                "image/png": "PNG",
                "image/webp": "WEBP",
            }[content_type.split(";", maxsplit=1)[0].strip().lower()]
            if image.format != expected_format:
                raise ValueError("The image content does not match its declared file type.")
            if image.width * image.height > MAX_IMAGE_PIXELS:
                raise ValueError("Image dimensions are too large to analyze.")
            rgb_image = image.convert("RGB")
            rgb_image.load()
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError) as error:
        raise ValueError("The uploaded file is not a valid image.") from error

    rgb_array = np.asarray(rgb_image)
    bgr_array = cv2.cvtColor(rgb_array, cv2.COLOR_RGB2BGR)
    resized = cv2.resize(rgb_array, (IMAGE_SIZE, IMAGE_SIZE), interpolation=cv2.INTER_AREA)
    tensor = torch.from_numpy(resized.copy()).permute(2, 0, 1).float().div_(255.0)
    return bgr_array, tensor


def image_metrics(bgr_image: np.ndarray) -> dict[str, Any]:
    height, width = bgr_image.shape[:2]
    gray = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2HSV)
    lab = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2LAB)

    brightness = float(np.mean(gray)) / 255.0
    sharpness = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    color_spread = float(np.mean(np.std(lab.astype(np.float32), axis=(0, 1))))

    notes: list[str] = []
    if min(width, height) < 256:
        notes.append("Use a higher-resolution image for more consistent visual measurements.")
    if brightness < 0.2:
        notes.append("The image may be too dark; try even, natural lighting.")
    elif brightness > 0.9:
        notes.append("The image may be overexposed; reduce glare and bright lighting.")
    if sharpness < 35:
        notes.append("The image may be blurry; keep the camera steady and refocus.")

    return {
        "image": {"width": width, "height": height},
        "quality": {
            "brightness": round(brightness, 4),
            "sharpness": round(sharpness, 2),
            "colorSpread": round(color_spread, 2),
            "notes": notes,
        },
        "visualMeasurements": {
            "meanHue": round(float(np.mean(hsv[:, :, 0])), 2),
            "meanSaturation": round(float(np.mean(hsv[:, :, 1])) / 255.0, 4),
            "meanBrightness": round(brightness, 4),
        },
        "disclaimer": (
            "These image-quality and color measurements are informational, can vary with "
            "lighting and skin tone, and do not detect or diagnose a medical condition."
        ),
    }


@app.get("/healthz")
async def health() -> dict[str, Any]:
    return {"status": "ok", "classifier": "available" if model_runner.model else "not_configured"}


@app.post("/analyze", response_model=None)
async def analyze(request: Request) -> dict[str, Any] | JSONResponse:
    content_type = request.headers.get("content-type", "")
    try:
        content_length = request.headers.get("content-length")
        if content_length:
            try:
                declared_length = int(content_length)
            except ValueError as error:
                raise ValueError("Invalid image request size.") from error
            if declared_length > MAX_IMAGE_BYTES:
                raise ValueError("Image must be 10 MB or smaller.")
        chunks: list[bytes] = []
        total_bytes = 0
        async for chunk in request.stream():
            total_bytes += len(chunk)
            if total_bytes > MAX_IMAGE_BYTES:
                raise ValueError("Image must be 10 MB or smaller.")
            chunks.append(chunk)
        image_bytes = b"".join(chunks)
        bgr_image, image_tensor = prepare_image(image_bytes, content_type)
    except ValueError as error:
        return error_response(request, 400, "INVALID_IMAGE", str(error))

    result = image_metrics(bgr_image)
    result["classifier"] = model_runner.predict(image_tensor) or {
        "status": "not_configured",
        "message": "Train a classifier with the project training script to enable labels.",
    }
    result["analysisType"] = "informational_image_analysis"
    return result
