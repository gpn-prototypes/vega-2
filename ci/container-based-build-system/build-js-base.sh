#!/bin/bash

source $BUILD_SYSTEM_PATH/vars.sh

if [[ -z `docker images -q $JS_BASE` ]]
then 
 docker build -t $JS_BASE --file=$BUILD_SYSTEM_PATH/Dockerfile $BUILD_SYSTEM_PATH
fi

