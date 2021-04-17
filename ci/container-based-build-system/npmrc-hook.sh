#!/bin/bash

echo ">>> '.npmrc' hook..."
[[ -z $REPOROOT ]] && REPOROOT="local"

echo "\t>>> backup default '.npmrc'" 
cp -n $REPOROOT/.npmrc $REPOROOT/.npmrc.bak

rollback-npmrc() {
  echo ">>> '.npmrc' hook..."
  echo "\t>>>restore default '.npmrc'"
  cp $REPOROOT/.npmrc.bak  $REPOROOT/.npmrc
  echo ">>>done"
}

trap "rollback-npmrc" EXIT SIGINT

echo "\t>>> rollout temporary '.npmrc'"
sed -e "s/\$NPM_URI/$NPM_URI/" $BUILD_SYSTEM_PATH/npmrc-template > $REPOROOT/.npmrc
echo ">>>done!"
