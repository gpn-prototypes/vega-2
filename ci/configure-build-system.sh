#!/bin/bash

cbsRequiredParams=(CBS_CACHE_PATH, ENV_TO_BUILD)
check-input-params "${cbsRequiredParams[@]}"

BUILD_SYSTEM_PATH="$REPOROOT/ci/container-based-build-system"
source $BUILD_SYSTEM_PATH/build-js-base.sh
source $BUILD_SYSTEM_PATH/define-executors.sh
source $BUILD_SYSTEM_PATH/npmrc-hook.sh
