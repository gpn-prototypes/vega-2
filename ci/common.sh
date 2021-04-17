#!/bin/bash

function check-input-params() {

  local paramsList=("$@")
  local noContinueFlag=

  for param in ${paramsList[*]}; do
    local paramName="$param"
    eval local paramVal="\$$param"
    if [ -z "$paramVal" ]; then
      echo "$paramName was not specified. FAIL!"
      noContinueFlag="1"
    else
      echo "$paramName: $paramVal; OK"   
    fi
  done

  if [ ! -z "$noContinueFlag" ]; then
    echo "ERROR! Check output^"
    exit 1;
  fi
}
