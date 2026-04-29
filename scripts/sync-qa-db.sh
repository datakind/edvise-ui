#!/bin/bash
# Refreshes TARGET_DB from SOURCE_DB on the same Cloud SQL instance.
# Same image as the web app; run as a Cloud Run Job with
#   --set-cloudsql-instances so /cloudsql/... exists, and
#   --command=/app/scripts/db-copy-same-instance.sh
set -euo pipefail

: "${CLOUDSQL_CONNECTION_NAME:?Set to project:region:instance, e.g. my-proj:us-east4:dev-db-instance}"
: "${SOURCE_DB:=all_tables}"
: "${TARGET_DB:=edvise_ui_qa}"
: "${DB_USER:?Set MySQL user with access to both databases}"
: "${DB_PASSWORD:?Set to DB password (use Secret Manager on the job)}"

SOCKET="/cloudsql/${CLOUDSQL_CONNECTION_NAME}"
export MYSQL_PWD="${DB_PASSWORD}"

echo "Checking socket and connectivity..."
test -S "$SOCKET" || { echo "Socket not found: $SOCKET (use --set-cloudsql-instances on the job)"; exit 1; }
mysql -S "${SOCKET}" -u "${DB_USER}" -e "SELECT 1" >/dev/null

echo "Copying ${SOURCE_DB} -> ${TARGET_DB} (this can take a while)..."
mysqldump -S "${SOCKET}" -u "${DB_USER}" \
  --single-transaction \
  --routines \
  --triggers \
  --set-gtid-purged=OFF \
  "${SOURCE_DB}" \
  | mysql -S "${SOCKET}" -u "${DB_USER}" "${TARGET_DB}"

unset MYSQL_PWD
echo "Done."
