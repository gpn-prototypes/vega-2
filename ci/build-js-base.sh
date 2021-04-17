#!/bin/bash

source $REPOROOT/ci/common-vars.sh

if [[ -z `docker images -q $JS_BASE` ]]; then
  docker build -t $JS_BASE .
fi
