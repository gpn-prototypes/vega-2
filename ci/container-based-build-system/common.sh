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
      echo "$paramName; OK"   
    fi
  done

  if [ ! -z "$noContinueFlag" ]; then
    echo "ERROR! Check output^"
    return 1;
  fi
  return 0;
}

#"--env BASE_API_URL=$BASE_API_URL --env BASE_URL=$BASE_URL 

function generate-env-to-build-sequence {
  local paramsList=("$@")
  local result=""
  for param in ${paramsList[*]}; do
    local paramName="$param"
    eval local paramVal="\$$param"
    result="$result --env $paramName=$paramVal"
  done
  echo "$result"
}
