#!/bin/bash
#sudo

apt-get update && apt-get install -y \
    zip \
    curl \
    unzip \
    libonig-dev \
    libzip-dev \
    libpng-dev \
    git && \
    docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

apt-get clean && rm -rf /var/lib/apt/lists/*

curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
echo "xxxxxxxxxxxxxx$USER"
#chown -R $USER:$USER ./
#chgrp -R $USER storage bootstrap/cache && chmod -R ug+rwx storage bootstrap/cache

#composer install

#php artisan optimize:clear
#php artisan config:cache
#php artisan route:cache
#php artisan view:cache

# Run Laravel migration (by force, since it would be a prod-environment)
#php artisan migrate --force


# curl -sL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - &&  apt-get install -y nodejs
# npm install
# npm run build
