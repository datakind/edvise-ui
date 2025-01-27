#!/bin/bash

# This workaround required bc postgres enforces file permissions on the cert files.
cp -v "$SSL_CA_PATH" "${PWD}/certs/server-ca.pem"
cp -v "$SSL_KEY_PATH" "${PWD}/certs/client-key.pem"
cp -v "$SSL_CERT_PATH" "${PWD}/certs/client-cert.pem"


chmod -R 600 "${PWD}/certs"

export SSL_CA_PATH="${PWD}/certs/server-ca.pem"
export SSL_KEY_PATH="${PWD}/certs/client-key.pem"
export SSL_CERT_PATH="${PWD}/certs/client-cert.pem"

php artisan migrate --force
