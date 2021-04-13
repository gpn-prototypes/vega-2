#!/bin/bash

source $(pwd)/ci/prepare-fronted-bulder.sh

#remove all previous front-builder containers
docker 2>/dev/null 1>&2  rm -v $(docker ps -a -q -f "name=$NAME") || true

docker run \
  --name "$NAME" \
  -v "$(pwd):/app" \
  --env-file  $(pwd)/ci/.env \
  $VEGA2_FRONTEND_BUILDER_IMAGE_NAME \
  /app/ci/build-entrypoint.sh

