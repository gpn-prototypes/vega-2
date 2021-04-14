#!/bin/bash

set -e

if [ -z "$AUTH_TOKEN" ]
then
  echo "AUTH_TOKEN is required to continue. Abort."
  exit 1;
fi

if [ -z "$BASE_URL" ]
then
  echo "BASE_URL is required to continue. Abort."
  exit 1;
fi

if [ -z "$VEGA_SCHEMA_PATH" ]
then
  echo "VEGA_SCHEMA_PATH is required to continue. Abort."
  exit 1;
fi

$YARN install --frozen-lockfile $VERBOSE_KEY
$YARN generate:types $VERBOSE_KEY
$YARN build $VERBOSE_KEY


