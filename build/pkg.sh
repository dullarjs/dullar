#!/bin/bash
# @Author: Just be free
# @Date:   2021-09-01 11:11:39
# @Last Modified by:   Just be free
# @Last Modified time: 2021-09-01 11:12:14
function build {
  cd packages/$1
  npm run build:components
}

componentName=""
while getopts "C:" arg
do
  case $arg in
    C)
      componentName=$OPTARG
      ;;
    ?)
      echo "unknown arguments"
      exit 1
      ;;
    esac
done

build "$componentName"