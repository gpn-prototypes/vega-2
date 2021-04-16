#!/bin/bash

set -e

[[ -z $DOCKER_REGISTRY ]] && DOCKER_REGISTRY="local"
[[ -z $OCP_NAMESPACE ]] && OCP_NAMESPACE="tech-vega"

IMAGE_NAME="js-base"
VERSION="1"
JS_BASE="${DOCKER_REGISTRY}/${OCP_NAMESPACE}/${IMAGE_NAME}:${VERSION}"

if [[ -z `docker images -q $JS_BASE` ]]; then
  docker build -t $JS_BASE .
fi
