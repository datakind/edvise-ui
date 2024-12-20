<p align="center">
<a href="https://github.com/datakind/sst-app-ui/actions"><img src="https://github.com/datakind/sst-app-ui/actions/workflows/laravel.yml/badge.svg" alt="Build Status"></a>
</p>

## About the Student Success Tool


## Frameworks Used

the Student Success Tool is built on:

* Laravel Framework. [Documentation](https://laravel.com/docs)

* Inertiajs. [Documentation](https://inertiajs.com)

* Reactjs. [Documentation](https://reactjs.org/docs/getting-started.html)

* Tailwindcss. [Documentation](https://v2.tailwindcss.com/docs)

## One-time setup (if you were to set-up an env from scratch)
DO NOT DO THIS FOR fellows dev environment or local development as this has already been done
1. Create a Cloud Bucket to store the static files (the files we'll generate in the cloudbuild autodeploy flow)
2. Update the cors-config.json with allowed origin URLs
3. Run `gcloud storage buckets update gs://<BUCKET_NAME> --cors-file=cors-config.json`
4. Run `gsutil cors get gs://<BUCKET_NAME>` to check that the cors config applied to the bucket
5. Run `gcloud storage buckets add-iam-policy-binding gs://<BUCKET_NAME> --member=allUsers --role=roles/storage.objectViewer` to enable public internet access to the bucket

NOTE: DO NOT STORE SENSITIVE/SECRET INFO IN THIS BUCKET -- this bucket should be only used to store static vite generated files.


1. Static Asset Creation: handled automatically on push by Cloudbuild.yaml using npm install and npm build and cp to cloud bucket Cloud Build 
2. Database migrations: Cloud Run Job
3. Auto-deploy: orchestrated by Cloud Build (currently stored inline) on Github push

## Setup (one-time)

1. `brew install composer` (Assuming you are on Mac, but install as you think best)
2. `brew install npm` (Assuming you are on Mac, but install as you think best)


## Local Development 

1. Clone this project
2. <code>cd [project-name]</code>
3. <code>composer install</code>
4. Copy <code>.env.example</code> file to <code>.env</code> in the root of the repo folder.
5. <code>npm install</code> 
6. <code>npm run build</code>
7. <code>php artisan key:generate</code>
8. <code>php artisan migrate</code>
9. <code>php artisan serve</code>


