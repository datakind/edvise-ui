<p align="center">
<a href="https://github.com/datakind/sst-app-ui/actions"><img src="https://github.com/datakind/sst-app-ui/actions/workflows/laravel.yml/badge.svg" alt="Build Status"></a>
</p>

## About the Student Success Tool

## Frameworks Used

the Student Success Tool is built on:

- Laravel Framework. [Documentation](https://laravel.com/docs)

- Inertiajs. [Documentation](https://inertiajs.com)

- Reactjs. [Documentation](https://reactjs.org/docs/getting-started.html)

- Tailwindcss. [Documentation](https://v2.tailwindcss.com/docs)

## DO NOT DO THIS! It has already been done.

For the record: How to set-up an env from scratch
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

## Local Development Setup

You only have to do this once in your local development system.

1. `brew install composer` (Assuming you are on Mac, but install as you think best)
2. `brew install npm` (Assuming you are on Mac, but install as you think best)

## Local Development

If you use `npm run dev` it'll allow for realtime updates in the local site as you make changes.

1. Clone this project
2. <code>cd [project-name]</code>
3. <code>composer install</code>
4. Copy <code>.env.example</code> file to <code>.env</code> in the root of the repo folder.
5. <code>npm install</code> (and potentially clear your cache: `php artisan cache:clear`, `php artisan route:clear`, `php artisan view:clear`, `php artisan optimize:clear`, `composer dump-autoload` )
6. <code>php artisan key:generate</code>
7. <code>php artisan migrate</code>
8. <code>npm run dev</code>

Alternatively, you can also use ./local_run.sh which will perform the above actions (with the exceptions of cd'ing into the directory or copying the .env file so you should still do that first).

NOTE: if you've made any db changes and want to reload the db you will have to remove the database/database.sqlite file before running ./local_run.sh.

And in a separate terminal run:
<code>php artisan serve</code>

Optionally install the React Dev Tools: https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en

Use console.log() and fn+12 to open chrome dev panel.

## Other setup

You will need to spin up a local version of the backend.

- Git clone the [sst-app-api](https://github.com/datakind/sst-app-api) repo on the branch fellows-experimental
- In the root directory, run `fastapi dev src/webapp/main.py --port 8001`
- Go to 127.0.0.1:8001/docs, authorize with the LOCAL env credentials: username = tester@datakind.org, password = tester_password
- Then execute the /generate-api-key endpoint with the following request body:

```
{
  "access_type": "DATAKINDER",
  "allows_enduser": true,
  "valid": true
}
```

- Copy the resulting key to be the value for your frontend env file's variable `BACKEND_API_KEY=`
- In your frontend .env file set: `BACKEND_URL="http://127.0.0.1:8001/api/v1"`

To enable full API functionality locally, you'll need to create a user in the frontend and also create that user in the backend database OR just create the tester@datakind.org with the password tester_password user in the local frontend.

## Styling

Similar to Python's Black, you can use run `./vendor/bin/pint` to autoformat your PHP.

### Notes on files and locations of interest

- routes/web.php is the main entrypoint to define all routes and available functions.
- resources/js/Layouts/AppLayout.jsx contains the page layout and function renderNavLinks() modifies which links are available in the nav bar.
- resources/js/Pages/ contains all the separate page views (e.g. Welcome.jsx is the front page, Dashboard.jsx is what's shown when the Dashboard route is clicked etc.)

So for example, to add a new page, Foopage, which you'd like to be visible in the nav bar, you'd have to:

1. Add a Foopage route in web.php (include auth middleware if that page should require user login: `Route::middleware('auth')->get('/foopage', function () { return Inertia::render('Foopage'); })->name('foopage');`
2. In AppLayout.jsx add the Foopage item to route mapping in renderNavLinks(): `const renderNavLinks = () => (['home', 'FAQ', 'data-dictionary', 'dashboard', 'foopage'].map((routeName)...`
3. Add a Foopage.jsx file under resources/js/Pages/... subdirectory that contains the actual page rendering code.

### Notes on deploying to dev

When deploying to dev, make sure to also check the outcome of the associated migration job in Cloud Run > Jobs.

### General Notes

You can set lifecycle rules for a given GCS bucket similar to setting CORS policies. The rules have actions and conditions, whereby the actions will be taken once all the conditions are met.

Postgresql does not work with certs that are volume mounted secrets in GCP, so using mysql.
