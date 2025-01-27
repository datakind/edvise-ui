#!/bin/bash

# This workaround required bc postgres enforces file permissions on the cert files.

chmod -R 600 "/var/www/html/certs"

php artisan migrate --force
