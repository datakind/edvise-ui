#!/bin/sh
# Migrations for a Cloud Run Job (same "web" image as the app). Do not use the default
# image entrypoint. In the job, set: Command = /bin/sh, Arguments = /app/scripts/run-migrate.sh
# Give the job the same DB env, Cloud SQL attachment, and network as the app for that database.
set -eu
cd /app
exec php artisan migrate --force
