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

Run the Express API from `backend/server` with `MONGO_URI`, `AUTH_TOKEN_SECRET`, `GOOGLE_CLIENT_ID`, `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_TOKEN_SECRET` configured in `backend/server/.env` (or exported in the shell). The root `.env.example` shows the required variable names. The admin API authenticates the configured server-side account and issues expiring signed tokens; never use the example credentials outside local development. The frontend uses `VITE_API_URL` if configured, otherwise it connects to `http://localhost:5000` during development.

### Google sign-in setup

Create a **Web application** OAuth client in Google Cloud Console, configure the Google Auth Platform consent screen, and add the required test users while the app remains in Testing. Add `http://localhost:5173` as an authorized JavaScript origin for local development and add the production frontend origin when deploying. No redirect URI is used for the Google Identity Services button.

Use the same OAuth client ID in backend `GOOGLE_CLIENT_ID` and frontend `VITE_GOOGLE_CLIENT_ID`. The client ID is public; the backend independently verifies every Google ID token against this configured audience and requires a verified email. Set the corresponding Vercel environment variables and redeploy both projects when enabling production Google sign-in. The backend returns the app's own signed user token; Google tokens are never used to access application APIs.

### Run the frontend and backend locally

Use two terminals from the repository root:

```powershell
# Terminal 1: backend
Set-Location backend/server
npm run dev
```

```powershell
# Terminal 2: frontend
Set-Location frontend
npm run dev
```

Set the backend variables in `backend/server/.env` and ensure MongoDB is reachable through `MONGO_URI`. Open `http://localhost:5173/admin`, then sign in using `ADMIN_EMAIL` and `ADMIN_PASSWORD`. The dashboard shows real user and analysis counts from MongoDB.

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
- `POST /api/auth/register` creates a user account and `POST /api/auth/login` verifies credentials. Passwords are stored as scrypt hashes; set a strong server-only `AUTH_TOKEN_SECRET` to issue 7-day bearer tokens.
- `POST /api/auth/google` verifies a Google Identity Services ID token, creates or links a user account by verified email, and returns the same application bearer token as password login.
- Image upload, retrieval, and analysis require a valid user bearer token and are tied to that account.
- Express stores accepted uploads in MongoDB and returns them from `GET /api/images/:imageId`.
- `POST /api/images/:imageId/analyze` sends the stored image to the ML service.
- `POST /api/admin/login` authenticates the configured admin account; `GET /api/admin/dashboard` and `GET /api/admin/stats` are protected by its eight-hour signed bearer token.
- Both services include a request ID and a consistent `{ "error": { "code", "message", "requestId" } }` error shape.

Uploads are temporarily limited to 3 MB to stay below Vercel's 4.5 MB function request/response body limit after base64 encoding.

## Vercel and MongoDB Atlas deployment

Deploy the Express API and frontend as separate Vercel projects from this repository:

1. Set the API project's root directory to `backend/server`. Add `MONGO_URI`, `AUTH_TOKEN_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`, and `ADMIN_TOKEN_SECRET` as Vercel environment variables. Both token secrets must be unique random values of at least 32 characters; never commit them or place them in `VITE_` variables. Use a unique strong admin password. Redeploy the backend after changing its environment. Also set `ML_SERVICE_URL` for analysis. The API opens a cached Mongoose connection when a database route is called. Deploy and verify `https://<api-domain>/api/health`.
2. Set the frontend project's root directory to `frontend`. Add `VITE_API_URL` set to the API's HTTPS origin, without a trailing `/api` (for example, `https://<api-domain>`), then redeploy. Vite variables are embedded at build time. The Vite asset base is `/`, suitable for Vercel.
3. In Atlas, use a dedicated database user with only required permissions. Vercel Hobby deployments do not have a fixed outbound IP to allowlist, so Atlas Network Access must permit dynamic connections. Never put `MONGO_URI` in a `VITE_` variable or commit the URI.

The admin dashboard endpoints require a short-lived signed bearer token obtained from `/api/admin/login`. The image-analysis endpoint additionally requires `ML_SERVICE_URL` to point to a separately deployed Python service. Database-backed routes work independently of the ML service.

Images are stored in MongoDB documents for this prototype, so the small upload cap can consume Atlas storage. Move image bytes to object storage and keep only their metadata/object keys in MongoDB before accepting larger or frequent uploads. Image upload, retrieval, and analysis require authentication and are restricted to the owning account.
