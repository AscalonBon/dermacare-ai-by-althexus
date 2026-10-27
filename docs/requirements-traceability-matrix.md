# Requirements Traceability Matrix

| ID | Requirement | Implementation / evidence | Status |
| --- | --- | --- | --- |
| RTM-01 | Redeploy backend and confirm health | Express `/healthz` checks MongoDB and the AI service; Compose includes health checks. No cloud deployment credentials or Docker executable are available in this workspace. | Code ready; live check pending |
| RTM-02 | E2E sign-up, login, upload, report, admin | Auth/API tests pass. Browser workflow against live MongoDB, AI, and admin account has not been run. | Partial; live E2E pending |
| RTM-03 | Require login for skin analysis | User-token middleware protects image and analysis APIs; the AI service separately checks `X-API-Key`. | Implemented; automated unauthenticated-route tests pass |
| RTM-04 | Persist each analysis and show dashboard history | Analysis results are stored by user; authenticated list/detail endpoints feed dashboard history and reports. | Implemented; database integration test pending |
| RTM-05 | Persist profile | Authenticated profile GET/PUT stores name, age, and avatar data; email remains read-only. | Implemented; database integration test pending |
| RTM-06 | Host AI service online | Python Docker image and private Compose service are defined; external hosting has not been provisioned. | Local deployment scaffold ready; hosting pending |
| RTM-07 | Rate limit and privacy consent | Express rate limits auth and analysis routes; registration and image upload require consent, with timestamp/version stored. | Implemented; production abuse/load test pending |
| RTM-08 | Finish or hide Feedback and Users screens | Feedback is removed from admin navigation; Users remains available because its protected listing screen/API are implemented. | Implemented |
| RTM-09 | Update RTM statuses | This matrix records implementation, evidence, and external blockers. | Complete |

## Verification

- `npm --prefix backend/server test`: 3 passing tests for signed tokens, password hashing, and unauthenticated route rejection.
- `npm --prefix frontend run build`: passing production build.
- `node --check backend/server/index.js`: passing.
- Python source syntax check: passing through Pylance. The selected Python interpreter does not have FastAPI installed, so Python runtime tests were not run.
- Docker Compose validation/build: not run; Docker is unavailable in the current environment.
