# DermaCare image analysis service

The Python service provides image-quality and basic color measurements using Pillow, OpenCV, and PyTorch. Measurements are informational, sensitive to lighting and skin tone, and are not a medical diagnosis. No classifier is enabled until a model is trained and configured.

## Run locally

From `backend/ml`:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Run the Express API from `backend/server` with `MONGO_URI` and `ML_SERVICE_URL` configured in `backend/server/.env` (or exported in the shell). The root `.env.example` shows the expected values. The frontend uses `VITE_API_BASE_URL` if configured in its Vite environment, otherwise it connects to `http://localhost:5000`.

## Train a classifier

Prepare labeled images in PyTorch ImageFolder format. Each class folder name becomes a model label:

```text
dataset/
  class-a/
    image-1.jpg
  class-b/
    image-2.jpg
```

From `backend/ml`, run:

```powershell
python train.py --data .\dataset --output .\models\skin_classifier.pt --epochs 10
```

Set `MODEL_PATH` to the resulting checkpoint before starting the service. Use only appropriately licensed, consented, representative, and clinically reviewed data. The included small CNN and training script are an integration baseline, not a validated dermatology model. Its labels and scores must not be presented as diagnosis or treatment guidance.

## API and storage

- `GET /healthz` reports service and optional classifier readiness.
- `POST /analyze` accepts the raw image bytes with a JPG, PNG, or WEBP `Content-Type`.
- Express stores accepted uploads in MongoDB and returns them from `GET /api/images/:imageId`.
- `POST /api/images/:imageId/analyze` sends the stored image to the ML service.
- Both services include a request ID and a consistent `{ "error": { "code", "message", "requestId" } }` error shape.

Uploads are limited to 10 MB. The current application does not implement user authentication or access control for image records; add those controls before handling private or production user data.
