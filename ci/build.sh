#!/bin/bash

set -e

pushd ci
  source ./build-js-base.sh
  source ./define-executors.sh
  source ./npmrc-hook.sh
popd
