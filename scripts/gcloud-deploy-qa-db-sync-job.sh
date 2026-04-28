#!/usr/bin/env bash
# Deploy (or update) the Cloud Run Job and optionally run it once.
# Adjust PROJECT_ID, REGION, AR_REPO, CONNECTION_NAME, secrets, and SA before use.
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-dev-sst-02}"
REGION="${REGION:-us-east4}"
AR_REPO="${AR_REPO:-edvise-ui}"
IMAGE_NAME="${IMAGE_NAME:-qa-db-sync}"
JOB_NAME="${JOB_NAME:-qa-db-sync-all-tables-to-edvise-ui-qa}"
CONNECTION_NAME="${CONNECTION_NAME:-${PROJECT_ID}:${REGION}:dev-db-instance}"
# Service account the job runs as (must have roles/cloudsql.client and secret accessor if using secrets)
JOB_SA="${JOB_SA:-dev-cloudrun-sa@${PROJECT_ID}.iam.gserviceaccount.com}"
# Secret holding the MySQL password for DB_USER (create in Secret Manager first)
DB_PASSWORD_SECRET="${DB_PASSWORD_SECRET:-edvise-ui-qa-db-sync-mysql-password}"
DB_USER="${DB_USER:-app_sync}" # replace with a user that has permissions on both DBs

IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${AR_REPO}/${IMAGE_NAME}:latest"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Building ${IMAGE} ..."
docker build -t "${IMAGE}" -f "${ROOT_DIR}/docker/qa-db-sync/Dockerfile" "${ROOT_DIR}/docker/qa-db-sync"

echo "Pushing ${IMAGE} ..."
docker push "${IMAGE}"

echo "Deploying Cloud Run job ${JOB_NAME} ..."
gcloud run jobs deploy "${JOB_NAME}" \
  --project="${PROJECT_ID}" \
  --region="${REGION}" \
  --image="${IMAGE}" \
  --set-cloudsql-instances="${CONNECTION_NAME}" \
  --service-account="${JOB_SA}" \
  --set-env-vars="SOURCE_DB=all_tables,TARGET_DB=edvise_ui_qa,DB_USER=${DB_USER},CLOUDSQL_CONNECTION_NAME=${CONNECTION_NAME}" \
  --set-secrets="DB_PASSWORD=${DB_PASSWORD_SECRET}:latest" \
  --task-timeout=3600 \
  --max-retries=0 \
  --memory=1Gi

echo "To run once: gcloud run jobs execute ${JOB_NAME} --project ${PROJECT_ID} --region ${REGION} --wait"
echo "To schedule: Cloud Scheduler -> HTTP/Job target -> execute job"
