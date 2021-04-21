#!/bin/bash

set -e

REPOROOT=$(pwd)

export requiredBuildParams=(NPM_AUTH_TOKEN BASE_URL BASE_API_URL VEGA_SCHEMA_PATH AUTH_TOKEN NPM_URI)

###
source $REPOROOT/ci/container-based-build-system/mount-build-system.sh
###

echo ">>>build started for $REPOROOT"

$YARN install --frozen-lockfile
$YARN generate:types
$YARN build
