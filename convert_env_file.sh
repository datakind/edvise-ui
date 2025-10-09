#!/bin/bash


# This script allows for converting a .env file from GCP secret compatible to .env file or vice versa.
# The output file will be overwritten or created.

set -e

if [ "$#" -ne 3 ]; then
    echo "Usage: ./convert_env_file.sh <file_path.txt> <output_file_path.txt> <to_secret|from_secret>"
    exit 2
fi

SOURCE_FILE=$1
DEST_FILE=$2
CONVERSION_DIRECTION=$3


if [ "$CONVERSION_DIRECTION" == "to_secret" ]; then
	# TODO
    echo "TODO: first option"
    exit 1
fi

if [ "$CONVERSION_DIRECTION" == "from_secret" ]; then
    cat $SOURCE_FILE > $DEST_FILE
    exit 1
fi

echo "Usage: ./convert_env_file.sh <file_path.txt> <output_file_path.txt> <to_secret|from_secret>"
exit 2