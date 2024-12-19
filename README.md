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

## TK (fellows)

CI/CD info TK

Cloud bucket

1. Static Asset Creation: npm install and npm build and cp to cloud bucket Cloud Build 
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


