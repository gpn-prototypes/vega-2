#!/bin/bash

echo "REPOROOT: $REPOROOT"

[[ -z $REPOROOT ]] && REPOROOT="local"

echo "REPOROOT: $REPOROOT"

cp -n $REPOROOT/.npmrc $REPOROOT/.npmrc.bak

rollback-npmrc() {
  cp $REPOROOT/.npmrc.bak  $REPOROOT/.npmrc
}

trap "rollback-npmrc" EXIT SIGINT

sed -e "s/\$NPM_URI/$NPM_URI/" $REPOROOT/ci/npmrc-template > $REPOROOT/.npmrc

