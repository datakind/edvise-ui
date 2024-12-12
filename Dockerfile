# Use PHP with Apache as the base image
FROM php:8.2-apache as web

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

# Enable Apache mod_rewrite for URL rewriting
RUN a2enmod rewrite

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql zip

# Configure Apache DocumentRoot to point to Laravel's public directory
# and update Apache configuration files
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy the application code
COPY . /var/www/html

# Set the working directory
WORKDIR /var/www/html

# Install project dependencies
RUN composer install

# Install Node.js and npm

RUN curl -sL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - &&  apt-get install -y nodejs

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Install node
RUN npm install

# Build and version Vite assets for production
RUN npm run build
