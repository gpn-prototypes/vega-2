#!/bin/bash

echo ">>> '.npmrc' rollout..."
[[ -z $REPOROOT ]] && return 1

echo "\t>>> backup existing '.npmrc'" 
cp -n $REPOROOT/.npmrc $REPOROOT/.npmrc.bak || true

echo "\t>>> rollout target '.npmrc'"
sed -e "s/\$NPM_URI/$NPM_URI/" $BUILD_SYSTEM_PATH/npmrc-template > $REPOROOT/.npmrc
