#!/bin/bash

if [ -z "$NPM_AUTH_TOKEN" ]
then
  echo "NPM_AUTH_TOKEN is required to continue. Abort."
  exit 1;
fi

if [ -z "$NPM_URI" ]
then
  NPM_URI="npm.pkg.github.com"
fi

$(pwd)/ci/prepare-fronted-bulder.sh

export YARN='eval docker run --rm --name yarn-executor -v $(pwd):/app -v /home/vega/vega-builder-automation/.cache/yarn:/usr/local/share/.cache/yarn --env NPM_URI=$NPM_URI --env NPM_AUTH_TOKEN=$NPM_AUTH_TOKEN --env BASE_API_URL=$BASE_API_URL --env BASE_URL=$BASE_URL --env HOST_NAME=$HOST_NAME --env YC_DEPLOYMENT=$YC_DEPLOYMENT --env VEGA_ENV=$VEGA_ENV --env VEGA_SCHEMA_PATH=$VEGA_SCHEMA_PATH --env VERBOSE_KEY=$VERBOSE_KEY frontend-builder:1 yarn'

#test
$YARN --version

#NPMRC_TEMP=$(cat .npmrc)

#rollback-npmrc() {
#  echo -e "$NPMRC_TEMP" > .npmrc
#}

#trap "rollback-npmrc" EXIT SIGINT

#sed -e "s/\$NPM_URI/$NPM_URI/" \
#    -e "s/\$NPM_AUTH_TOKEN/$NPM_AUTH_TOKEN/" ./ci/npmrc-template > .npmrc

./ci/build-entrypoint.sh

