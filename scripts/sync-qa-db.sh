#!/bin/sh
# all_tables -> edvise_ui_qa over TCP. Same "web" image. Job: same VPC + DB env as db-migrate
# (DB_HOST, DB_PORT, DB_USERNAME/DB_USER, DB_PASSWORD, optional SSL_*). Command: /bin/sh, args this file.
set -eu

: "${DB_HOST:?Set DB_HOST (e.g. Cloud SQL private IP)}"
DB_PORT="${DB_PORT:-3306}"
U="${DB_USERNAME:-${DB_USER:-app_sync}}"
: "${DB_PASSWORD:?Set DB password (e.g. Secret Manager on the job)}"
: "${SOURCE_DB:=all_tables}"
: "${TARGET_DB:=edvise_ui_qa}"

export MYSQL_PWD="${DB_PASSWORD}"

SSLARGS=""
[ -n "${SSL_CA_PATH:-}" ] && SSLARGS="${SSLARGS} --ssl-ca=${SSL_CA_PATH}"
[ -n "${SSL_CERT_PATH:-}" ] && SSLARGS="${SSLARGS} --ssl-cert=${SSL_CERT_PATH}"
[ -n "${SSL_KEY_PATH:-}" ] && SSLARGS="${SSLARGS} --ssl-key=${SSL_KEY_PATH}"

echo "Checking DB connectivity to ${DB_HOST}:${DB_PORT}..."
# shellcheck disable=SC2086
mariadb -h "$DB_HOST" -P "$DB_PORT" -u "$U" $SSLARGS -e "SELECT 1" >/dev/null

echo "Copying ${SOURCE_DB} -> ${TARGET_DB} (this can take a while)..."
# shellcheck disable=SC2086
mariadb-dump -h "$DB_HOST" -P "$DB_PORT" -u "$U" $SSLARGS \
  --single-transaction \
  --routines \
  --triggers \
  "${SOURCE_DB}" \
  | mariadb -h "$DB_HOST" -P "$DB_PORT" -u "$U" $SSLARGS "${TARGET_DB}"

unset MYSQL_PWD
echo "Done."
