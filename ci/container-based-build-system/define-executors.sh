#!/bin/bash

source $BUILD_SYSTEM_PATH/vars.sh

# CBS_CACHE_PATH -- a path of a dir to store a build system cache (may be any)
export YARN_CACHE_HOST="$CBS_CACHE_PATH/.cache/yarn"
export NPM_CACHE_HOST="$CBS_CACHE_PATH/.cache/npm"

# EXAMPLE
# ENV_TO_BUILD="--env BASE_API_URL=$BASE_API_URL --env BASE_URL=$BASE_URL --env HOST_NAME=$HOST_NAME --env YC_DEPLOYMENT=$YC_DEPLOYMENT --env VEGA_ENV=$VEGA_ENV --env VEGA_SCHEMA_PATH=$VEGA_SCHEMA_PATH --env NPM_AUTH_TOKEN=$NPM_AUTH_TOKEN"

export YARN='eval docker run --rm --name yarn-executor -v $(pwd):/app -v $YARN_CACHE_HOST:/usr/local/share/.cache/yarn $ENV_TO_BUILD $JS_BASE yarn'

export NPM='eval docker run --rm --name npm-executor -v $(pwd):/app -v $YARN_CACHE_HOST:/usr/local/share/.cache/yarn $ENV_TO_BUILD $JS_BASE npm'

echo "YARN & NPM executors was defined"
echo "Example:"
echo '$YARN --version'
$YARN --version
echo '$NPM --version'
$NPM --version
