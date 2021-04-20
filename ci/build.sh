#!/bin/bash

set -e

REPOROOT=$(pwd)
source $REPOROOT/ci/common.sh

requiredBuildParams=(NPM_AUTH_TOKEN BASE_URL BASE_API_URL VEGA_SCHEMA_PATH AUTH_TOKEN NPM_URI)
check-input-params "${requiredBuildParams[@]}"

#required param for container based build system 
ENV_TO_BUILD=`generate-env-to-build-sequence "${requiredBuildParams[@]}"`

###
source $REPOROOT/ci/configure-build-system.sh
###

echo ">>>build started for $REPOROOT"

$YARN install --frozen-lockfile
$YARN generate:types
$YARN build
