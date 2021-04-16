#!/bin/bash

set -e

source $(pwd)/common.sh

[ ! -z "$YARN" ] && YARN=yarn

requiredParams=(NPM_URI, NPM_AUTH_TOKEN, BASE_URL, VEGA_SCHEMA_PATH, AUTH_TOKEN)

$YARN install --frozen-lockfile $VERBOSE_KEY
$YARN generate:types $VERBOSE_KEY
$YARN build $VERBOSE_KEY


