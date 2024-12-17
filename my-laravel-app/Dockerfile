FROM php:8.2-apache
# Set env vars
ENV NODE_VERSION=20
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    lua-zlib-dev \
    libmemcached-dev libonig-dev \
    libzip-dev

RUN docker-php-ext-install pdo_mysql mbstring zip exif pcntl
RUN docker-php-ext-configure gd --with-freetype --with-jpeg && docker-php-ext-install gd

RUN apt-get clean && rm -rf /var/lib/apt/lists/*
# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Configure Apache DocumentRoot to point to Laravel's public directory
# and update Apache configuration files
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

COPY . /var/www/html

WORKDIR /var/www/html
# Install project dependencies
RUN composer install

# Install Node.js and npm

RUN curl -sL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - &&  apt-get install -y nodejs

# Add vendor binaries to PATH
ENV PATH=/var/www/html/vendor/bin:$PATH
COPY composer.lock composer.json ./

#RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
#RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

RUN chown -R www-data:www-data ./
RUN chgrp -R www-data storage bootstrap/cache ./ && \
    chmod -R ug+rwx storage bootstrap/cache ./

RUN composer install #--no-dev --no-interaction --prefer-dist --optimize-autoloader

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install node
RUN npm install

# Build and version Vite assets for production
RUN npm run build
RUN php artisan config:clear

EXPOSE 8080

CMD ["apache2-foreground"]
