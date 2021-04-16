#!/bin/bash

source $(pwd)/common-vars.sh

if [[ -z `docker images -q $JS_BASE` ]]; then
  docker build -t $JS_BASE .
fi
