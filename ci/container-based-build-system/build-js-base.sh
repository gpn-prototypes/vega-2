#!/bin/bash

source $BUILD_SYSTEM_PATH/vars.sh

[[ -z `docker images -q $JS_BASE` ]] && docker build -t $JS_BASE .

return 0
