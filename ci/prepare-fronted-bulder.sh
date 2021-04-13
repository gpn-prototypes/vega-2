#!/bin/bash

set -e


if [ -z "$IMAGE_NAME" ]
then
  IMAGE_NAME="frontend-builder"
fi

if [ -z "$FE_BUILDER_VERSION" ]
then
  FE_BUILDER_VERSION="1"
fi


if [ -z "$VEGA2_FRONTEND_BUILDER_IMAGE_NAME" ]; then 
  VEGA2_FRONTEND_BUILDER_IMAGE_NAME="$IMAGE_NAME:$FE_BUILDER_VERSION"
fi

NAME="$IMAGE_NAME"

echo "VEGA2_FRONTEND_BUILDER_IMAGE_NAME: $VEGA2_FRONTEND_BUILDER_IMAGE_NAME"
echo "NAME: $NAME"

if [[ "$(docker images -q $VEGA2_FRONTEND_BUILDER_IMAGE_NAME 2> /dev/null)" == ""  ]];
then
  echo "Docker image build."
  docker build -t $VEGA2_FRONTEND_BUILDER_IMAGE_NAME ./ci
fi
