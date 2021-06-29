#!/bin/bash
# @Author: Just be free
# @Date:   2021-06-29 13:45:56
# @Last Modified by:   Just be free
# @Last Modified time: 2021-06-29 14:33:48


function build {
  cd packages/$1
  npm run build
  cd ../..
  mkdir docs/$1
  mv packages/$1/docs/* docs/$1
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

