#!/bin/bash

set -e

pushd ci
  source ./build-js-base.sh
  echo "1"
  source ./define-executors.sh
  $YARN --version
  $YARN cache list
  $YARN cache
popd
