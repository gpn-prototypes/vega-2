#!/bin/bash

if [[ $HOST_DEFINED_BUILD_SYSTEM ]]
then
  return 0
fi

if [[ "${BASH_SOURCE[0]}" -ef "$0" ]]
then
  echo "==="
  echo "ERROR >> This script could be sourced, but not executed <<< ERROR"
  echo "==="
  exit 1
fi

if [[ -z $REPOROOT ]]
then
  echo "ERROR >>> REPOROOT must be defined <<< ERROR"
  return 1
fi


if [[ -z $requiredBuildParams ]]
then
  echo "==="
  echo "Configuration Error >>> parameter 'requiredBuildParams' must be set <<< Configuration Error"
  echo "==="
  echo "EXAMPLE: 'export requiredBuildParams=(BASE_API_URL BASE_URL HOST_NAME YC_DEPLOYMENT VEGA_ENV VEGA_SCHEMA_PATH NPM_AUTH_TOKEN AUTH_TOKEN NPM_URI)'"
  echo "Each build param must be also defined to build component"
  return 1;
fi

#To stop execution in case file was sourced without set -e, i.e. to user session
RETURN_ON_ERROR='eval if [[ $? > 0 ]]; then echo "RETURN_ON_ERROR >>> mount-build-system.sh:$LINENO <<< RETURN_ON_ERROR";return 1; fi'

export BUILD_SYSTEM_PATH="$REPOROOT/ci/container-based-build-system"

source $BUILD_SYSTEM_PATH/common.sh
$RETURN_ON_ERROR

check-input-params "${requiredBuildParams[@]}"
$RETURN_ON_ERROR

#required param for container based build system 
ENV_TO_BUILD=`generate-env-to-build-sequence "${requiredBuildParams[@]}"`
$RETURN_ON_ERROR

cbsRequiredParams=(CBS_CACHE_PATH ENV_TO_BUILD)
check-input-params "${cbsRequiredParams[@]}"
$RETURN_ON_ERROR

###
source $BUILD_SYSTEM_PATH/build-js-base.sh
$RETURN_ON_ERROR
source $BUILD_SYSTEM_PATH/define-executors.sh
$RETURN_ON_ERROR
source $BUILD_SYSTEM_PATH/npmrc-rollout.sh
$RETURN_ON_ERROR
###

return 0
