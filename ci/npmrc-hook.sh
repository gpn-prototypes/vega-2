#!/bin/bash

cp -n ../.npmrc .npmrc.bak

rollback-npmrc() {
  cp .npmrc.bak  ../.npmrc
}

trap "rollback-npmrc" EXIT SIGINT

sed -e "s/\$NPM_URI/$NPM_URI/" ./ci/npmrc-template > ../.npmrc

