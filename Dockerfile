# Use PHP with Apache as the base image
FROM php:8.2-apache

# Set env vars
ENV NODE_VERSION=20

# Install Additional System Dependencies

RUN echo "Apt-get installing packages..."

RUN apt-get update && apt-get install -y \
    zip \
    curl \
    unzip \
    libonig-dev \
    libzip-dev \
    libpng-dev \
    git && \
    docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

RUN echo "Apt-get installed successfully"

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Add php.ini for production
COPY php/php.ini-production $PHP_INI_DIR/php.ini
COPY apache/apache2.conf /etc/apache2/apache2.conf

# Configure Apache DocumentRoot to point to Laravel's public directory
# and update Apache configuration files
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

EXPOSE 8080
# Copy the application code
COPY . /var/www/html

# Set the working directory
WORKDIR /var/www/html

# Add vendor binaries to PATH
ENV PATH=/var/www/html/vendor/bin:$PATH

COPY docker/000-default.conf /etc/apache2/sites-available/000-default.conf

#xxx?
COPY composer.json composer.lock ./

# Install project dependencies
RUN composer install

# Install Node.js and npm

RUN curl -sL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - &&  apt-get install -y nodejs

# Set permissions
RUN chown -R www-data:www-data ./
RUN chgrp -R www-data storage bootstrap/cache && \
    chmod -R ug+rwx storage bootstrap/cache

# Enable Apache mod_rewrite for URL rewriting
RUN a2enmod rewrite

RUN echo "Listen 8080" >> /etc/apache2/ports.conf

# Install node
RUN npm install

# Build and version Vite assets for production
RUN npm run build

# Make the file executable, or use "chmod 777" instead of "chmod +x"
# RUN chmod +x /var/www/html/db-migration.sh

# This will run the shell file at the time when container is up-and-running successfully (and NOT at the BUILD time)
# ENTRYPOINT ["/var/www/html/db-migration.sh"]


RUN php artisan optimize:clear
RUN php artisan config:cache
RUN php artisan route:cache
RUN php artisan view:cache

# Run the application.
CMD ["apache2-foreground"]
