#!/bin/bash

curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

composer install

php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run Laravel migration (by force, since it would be a prod-environment)
php artisan migrate --force


# curl -sL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - &&  apt-get install -y nodejs
# npm install
# npm run build
