#!/bin/bash
# @Author: Just be free
# @Date:   2021-06-29 13:45:56
# @Last Modified by:   Just be free
# @Last Modified time: 2021-09-01 11:02:13


function build {
  cd packages/$1
  npm run build
  echo "build success"
  cd ../..
  if [ ! -d "docs/" ];then
    mkdir docs
    mkdir docs/$1
    # if [ ! -d "docs/$1" ];then
  else
    if [ ! -d "docs/$1" ];then
      # echo "文件夹不存在"
      mkdir docs/$1
    else
      rm -rf docs/$1
      mkdir docs/$1
      # echo "$1 folder exists, skip this message"
    fi
    # rm -rf docs/$1
  fi
  # rm -rf docs/$1
  # mkdir docs/$1
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

