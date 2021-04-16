#!/bin/bash

set -e

#image config
[[ -z $DOCKER_REGISTRY ]] && DOCKER_REGISTRY="local"
[[ -z $OCP_NAMESPACE ]] && OCP_NAMESPACE="tech-vega"

IMAGE_NAME="js-base"
VERSION="1"
export JS_BASE="${DOCKER_REGISTRY}/${OCP_NAMESPACE}/${IMAGE_NAME}:${VERSION}"

export YARN_CACHE_HOST="/home/vega/vega-builder-automation/.cache/yarn"
export NPM_CACHE_HOST="/home/vega/vega-builder-automation/.cache/npm"

export YARN='eval docker run --rm --name yarn-executor -v $(pwd):/app -v $YARN_CACHE_HOST:/usr/local/share/.cache/yarn --env BASE_API_URL=$BASE_API_URL --env BASE_URL=$BASE_URL --env HOST_NAME=$HOST_NAME --env YC_DEPLOYMENT=$YC_DEPLOYMENT --env VEGA_ENV=$VEGA_ENV --env VEGA_SCHEMA_PATH=$VEGA_SCHEMA_PATH --env VERBOSE_KEY=$VERBOSE_KEY $JS_BASE yarn'

export NPM='eval docker run --rm --name npm-executor -v $(pwd):/app -v $YARN_CACHE_HOST:/usr/local/share/.cache/yarn --env BASE_API_URL=$BASE_API_URL --env BASE_URL=$BASE_URL --env HOST_NAME=$HOST_NAME --env YC_DEPLOYMENT=$YC_DEPLOYMENT --env VEGA_ENV=$VEGA_ENV --env VEGA_SCHEMA_PATH=$VEGA_SCHEMA_PATH --env VERBOSE_KEY=$VERBOSE_KEY $JS_BASE npm'

$YARN --version
set +e
$YARN cache
set -e
$NPM --version

