# DermaCare image analysis service

The Python service provides image-quality and basic color measurements using Pillow, OpenCV, and PyTorch. Measurements are informational, sensitive to lighting and skin tone, and are not a medical diagnosis. No classifier is enabled until a model is trained and configured.

## Run locally

From `backend/ai-service`:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Run the Express API from `backend/server` with `MONGO_URI`, `ML_SERVICE_URL`, and (for admin routes) `ADMIN_API_KEY` configured in `backend/server/.env` (or exported in the shell). The root `.env.example` shows example values. The frontend uses `VITE_API_BASE_URL` if configured in its Vite environment, otherwise it connects to `http://localhost:5000`.

## Train a classifier

Prepare labeled images in PyTorch ImageFolder format. Each class folder name becomes a model label:

```text
dataset/
  class-a/
    image-1.jpg
  class-b/
    image-2.jpg
```

From `backend/ai-service`, run:

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

Uploads are temporarily limited to 3 MB to stay below Vercel's 4.5 MB function request/response body limit after base64 encoding. The current application does not implement user authentication or access control for image records; add those controls before handling private or production user data.

## Vercel and MongoDB Atlas deployment

Deploy the Express API and frontend as separate Vercel projects from this repository:

1. Set the API project's root directory to `backend/server`. Add `MONGO_URI` as a Vercel environment variable for Production, Preview, and Development as needed. The API opens a cached Mongoose connection when a database route is called. Deploy and verify `https://<api-domain>/api/message`.
2. Set the frontend project's root directory to `frontend`. Add `VITE_API_BASE_URL` set to the API's HTTPS origin, without a trailing `/api` (for example, `https://<api-domain>`), then redeploy. The Vite asset base is `/`, suitable for Vercel.
3. In Atlas, use a dedicated database user with only required permissions. Vercel Hobby deployments do not have a fixed outbound IP to allowlist, so Atlas Network Access must permit dynamic connections. Never put `MONGO_URI` in a `VITE_` variable or commit the URI.

The API uses an `ADMIN_API_KEY` bearer token for the existing admin endpoints. Set a long random value in Vercel if you need those endpoints; otherwise they fail closed with a configuration error. The image-analysis endpoint additionally requires `ML_SERVICE_URL` to point to a separately deployed Python service. Database-backed routes work independently of the ML service.

Images are stored in MongoDB documents for this prototype, so the small upload cap can consume Atlas storage. Move image bytes to object storage and keep only their metadata/object keys in MongoDB before accepting larger or frequent uploads. The image retrieval endpoint currently has no authentication or ownership check; use only non-sensitive test images until access control is added.
