#!/bin/bash

composer install

php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run Laravel migration (by force, since it would be a prod-environment)
php artisan migrate --force

