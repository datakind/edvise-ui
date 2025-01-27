#!/bin/bash

# This workaround required bc postgres enforces file permissions on the cert files.

mkdir "/etc/ssl/private/pg_certs/"
cp -v "$SSL_CA_PATH" "/etc/ssl/private/pg_certs/server-ca.pem"
cp -v "$SSL_KEY_PATH" "/etc/ssl/private/pg_certs/client-key.pem"
cp -v "$SSL_CERT_PATH" "/etc/ssl/private/pg_certs/client-cert.pem"

chmod -R 600 "/etc/ssl/private/pg_certs"

export SSL_CA_PATH="/etc/ssl/private/pg_certs/server-ca.pem"
export SSL_KEY_PATH="/etc/ssl/private/pg_certs/client-key.pem"
export SSL_CERT_PATH="/etc/ssl/private/pg_certs/client-cert.pem"

exec "$@"