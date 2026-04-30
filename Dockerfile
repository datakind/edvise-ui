# Production image for Laravel (Vite + Inertia) on Cloud Run (nginx + PHP-FPM, same pattern as udts-api)

# -----------------------------------------------------------------------------
# Stage: builder — PHP + Node (Vite) + Composer
# -----------------------------------------------------------------------------
FROM php:8.4-cli-alpine AS builder
RUN apk add --no-cache nodejs npm curl git unzip \
    libzip-dev icu-dev oniguruma-dev linux-headers sqlite-dev $PHPIZE_DEPS \
    && docker-php-ext-configure intl \
    && docker-php-ext-install -j$(nproc) pdo_mysql pdo_sqlite intl zip \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && ln -sf /usr/local/bin/php /usr/bin/php

ENV PATH="/usr/local/bin:/usr/bin:$PATH"
WORKDIR /app

COPY composer.json composer.lock* ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist
COPY . .
RUN composer dump-autoload --optimize --classmap-authoritative
RUN set -eux; \
    cp .env.example .env; \
    php artisan key:generate --force --no-interaction; \
    php artisan config:clear --no-interaction || true; \
    rm -f .env

RUN npm ci && php -v && npm run build

# -----------------------------------------------------------------------------
# Stage: composer — vendor for runtime (no Node in final image)
# -----------------------------------------------------------------------------
FROM composer:2 AS composer
WORKDIR /app
COPY composer.json composer.lock* ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist
COPY . .
# Avoid loading artisan/config (database.php uses PDO::MYSQL_*) before pdo_mysql exists in this image
RUN composer dump-autoload --optimize --classmap-authoritative --no-scripts

# -----------------------------------------------------------------------------
# Stage: runtime — PHP-FPM + Nginx + Supervisor
# -----------------------------------------------------------------------------
FROM php:8.4-fpm-alpine AS runtime

RUN apk add --no-cache \
    nginx \
    supervisor \
    gettext \
    linux-headers \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    libpq-dev \
    sqlite \
    sqlite-dev \
    mariadb-client \
    $PHPIZE_DEPS

RUN docker-php-ext-configure intl \
    && docker-php-ext-configure pdo_mysql \
    && docker-php-ext-install -j$(nproc) \
    opcache \
    pdo_mysql \
    pdo_sqlite \
    pdo_pgsql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    intl \
    zip

COPY --from=composer /app/vendor /app/vendor
COPY --from=builder /app/public/build /app/public/build
COPY . /app

RUN set -eux; \
    mkdir -p /app/storage/framework/{sessions,views,cache/data} /app/storage/logs /app/bootstrap/cache; \
    chown -R www-data:www-data /app/storage /app/bootstrap/cache; \
    chmod -R 775 /app/storage /app/bootstrap/cache

COPY docker/nginx.conf.template /etc/nginx/nginx.conf.template
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
RUN chmod +x /app/scripts/*.sh

EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["/entrypoint.sh"]
