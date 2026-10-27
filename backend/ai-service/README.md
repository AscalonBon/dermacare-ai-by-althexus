# DermaCare Services

The project has an Express API, a MongoDB database, and a Python image-analysis service. The analysis currently reports image quality and basic color measurements only; it does not diagnose skin conditions. The optional classifier is unavailable until a project-specific model is trained and configured.

## Local stack

1. Copy `.env.example` to `.env` and set three distinct random values for `AUTH_TOKEN_SECRET`, `ADMIN_TOKEN_SECRET`, and `ML_SERVICE_API_KEY` (each at least 32 characters).
2. Start Docker Compose from the repository root with `docker compose up --build`.
3. Check `http://localhost:5000/healthz`. It returns `200` only when MongoDB and the AI service are ready.
4. Configure the Vite frontend with `VITE_API_URL=http://localhost:5000` and start it from `frontend` using `npm run dev`.

The AI service is not published to a host port by Compose. Express calls it over the private Compose network and supplies `ML_SERVICE_API_KEY`. If hosting the AI service separately, set the same key on the AI and Express deployments and set Express `ML_SERVICE_URL` to the AI service's private HTTPS address.

## Admin bootstrap

Create the first admin once the API and MongoDB are available. Set `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in the API process environment for the command, with a password of at least 12 characters, then run `npm run create-admin` from `backend/server`. The command refuses to overwrite an existing account. Do not expose an admin-registration endpoint.

## Deployment

Deploy the AI service first and confirm `/healthz` returns `200`. Then deploy `backend/server` with `MONGO_URI`, `AUTH_TOKEN_SECRET`, `ADMIN_TOKEN_SECRET`, `ML_SERVICE_URL`, and `ML_SERVICE_API_KEY`. Set `FRONTEND_ORIGINS` to the exact HTTPS frontend origin. The Vercel frontend must have `VITE_API_URL` set to the HTTPS Express API origin and be redeployed after changing it.

The authenticated API routes include registration, login, profile, image upload/retrieval, and per-user analysis history. `/api/images/:imageId/analyze` is rate-limited and requires a user token; `/analyze` on the Python service separately requires the internal service key. `/healthz` is an unauthenticated readiness endpoint and does not reveal configuration values.

## API details

- `GET /healthz` reports MongoDB and AI-service readiness.
- `POST /analyze` accepts raw JPG, PNG, or WEBP bytes with a matching `Content-Type` and `X-API-Key` header.
- Express stores accepted images in MongoDB and returns them from `GET /api/images/:imageId` only to their owner.
- `POST /api/images/:imageId/analyze` calls the AI service and saves the result for the authenticated owner.
- `GET /api/analyses` and `GET /api/analyses/:analysisId` return only the authenticated user's history.
- Uploads are limited to 10 MB in the API and AI service.

The application stores sensitive image data. Use a private database, TLS-only service URLs, least-privilege credentials, backups with an explicit retention policy, and a reviewed privacy notice before production use. The classifier is not a validated medical model; do not present its output as diagnosis or treatment advice.
