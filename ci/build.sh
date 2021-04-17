#!/bin/bash

set -e

REPOROOT=$(pwd)
BUILD_SYSTEM_PATH="$REPOROOT/ci/container-based-build-system"

source $REPOROOT/ci/common.sh

requiredParams=(NPM_AUTH_TOKEN BASE_URL BASE_API_URL VEGA_SCHEMA_PATH AUTH_TOKEN) #NPM_URI)
check-input-params "${requiredParams[@]}"

ENV_TO_BUILD="--env BASE_API_URL=$BASE_API_URL --env BASE_URL=$BASE_URL --env HOST_NAME=$HOST_NAME --env YC_DEPLOYMENT=$YC_DEPLOYMENT --env VEGA_ENV=$VEGA_ENV --env VEGA_SCHEMA_PATH=$VEGA_SCHEMA_PATH --env NPM_AUTH_TOKEN=$NPM_AUTH_TOKEN"

echo "$ENV_TO_BUILD"

cbsRequiredParams=(CBS_CACHE_PATH, ENV_TO_BUILD)
check-input-params "${cbsRequiredParams[@]}"

source $BUILD_SYSTEM_PATH/build-js-base.sh
source $BUILD_SYSTEM_PATH/define-executors.sh
source $BUILD_SYSTEM_PATH/npmrc-hook.sh


echo ">>>build started for $REPOROOT"
echo "TOKEN $NPM_AUTH_TOKEN"

$YARN config list
$YARN install --frozen-lockfile
$YARN generate:types
$YARN build
