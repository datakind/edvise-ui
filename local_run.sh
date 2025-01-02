#!/bin/bash

set -e

composer install
npm install
php artisan cache:clear
php artisan route:clear 
php artisan view:clear 
php artisan optimize:clear
composer dump-autoload
php artisan key:generate
php artisan migrate
npm run dev