# One-shot container for Cloud Run Job: pipe mysqldump SOURCE_DB -> mysql TARGET_DB on the same instance.
# Deploy with gcloud; see ../scripts/gcloud-deploy-qa-db-sync-job.sh
FROM alpine:3.20

RUN apk add --no-cache bash mariadb-client

COPY run.sh /run.sh
RUN chmod +x /run.sh

ENTRYPOINT ["/bin/bash", "/run.sh"]
