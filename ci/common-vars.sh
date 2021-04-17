#!/bin/bash

#image config

echo $DOCKER_REGISTRY
echo $OCP_NAMESPACE
[[ -z $DOCKER_REGISTRY ]] && DOCKER_REGISTRY="local"
[[ -z $OCP_NAMESPACE ]] && OCP_NAMESPACE="tech-vega"
echo $DOCKER_REGISTRY
echo $OCP_NAMESPACE



IMAGE_NAME="js-base"
VERSION="1"
export JS_BASE="${DOCKER_REGISTRY}/${OCP_NAMESPACE}/${IMAGE_NAME}:${VERSION}"

echo $NPM_URI
echo $O_NAMESPACE
#[[ -z $NPM_URI ]] && NPM_URI="npm.pkg.github.com"
[[ -z $O_NAMESPACE ]] && O_NAMESPACE="tech-vega"
