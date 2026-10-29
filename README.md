# DemaQ LED Platform

React, TypeScript, and Vite frontend with an Express server, Firebase integration, and optional Gemini-powered features.

## Run locally

Install [Bun](https://bun.sh/), then run:

```sh
bun install --frozen-lockfile
bun run dev
```

Set `GEMINI_API_KEY` in a local `.env` file to enable Gemini features. Do not commit `.env` files.

Before opening a pull request, run the same checks as CI:

```sh
bun run lint
bun run build
```

## CI/CD

GitHub Actions type-checks and builds pull requests targeting `main`. A successful push to `main` builds a container, pushes it to Artifact Registry, and deploys it to Cloud Run. Firestore rules are not deployed by this workflow; review and deploy changes to `firestore.rules` separately.

### One-time Google Cloud setup

1. Enable the Cloud Run, Artifact Registry, and Secret Manager APIs in your Google Cloud project.
2. Create a Docker-format Artifact Registry repository in the region you will use.
3. Create a Secret Manager secret containing the Gemini API key. Grant the Cloud Run runtime service account access to that secret.
4. Configure Workload Identity Federation for GitHub Actions, restricted to this repository and the `main` branch. Grant its deployment service account `roles/artifactregistry.writer` on the repository, `roles/run.admin` on the project, `roles/iam.serviceAccountUser` on the Cloud Run runtime service account, and `roles/serviceusage.serviceUsageConsumer` on the project. Grant the runtime service account `roles/secretmanager.secretAccessor` on the Gemini secret.
5. In GitHub, open **Settings → Secrets and variables → Actions** and add these repository variables:

   - `GCP_PROJECT_ID`
   - `GCP_REGION`
   - `ARTIFACT_REGISTRY_REPOSITORY`
   - `CLOUD_RUN_SERVICE`
   - `CLOUD_RUN_RUNTIME_SERVICE_ACCOUNT`
   - `GEMINI_SECRET_NAME`

   Add these repository secrets:

   - `GCP_WIF_PROVIDER`: the full Workload Identity Provider resource name
   - `GCP_DEPLOYER_SERVICE_ACCOUNT`: the deployment service account email

The workflow deploys publicly (`--allow-unauthenticated`). Change that setting if the entire website should require Google Cloud authentication. For production releases, protect `main` with required pull-request reviews and passing CI checks.
