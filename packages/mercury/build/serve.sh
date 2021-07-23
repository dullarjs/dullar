#!/bin/bash
# @Author: Just be free
# @Date:   2020-05-26 16:15:41
# @Last Modified by:   Just be free
# @Last Modified time: 2020-10-28 10:23:06

#获取系统类型
function getSystem {
  system=`uname`
  echo ${system}
}

# 字符串首字母转换成大写
toFirstLetterUpper() {
  str=$1
  firstLetter=`echo ${str:0:1} | awk '{print toupper($0)}'`
  otherLetter=${str:1}
  result=$firstLetter$otherLetter
  echo $result
}
# 字符串转驼峰命名法
function camelize {
  str=$1
  result=""
  array=(${str//-/ })
  for i in ${array[@]}; do
    upperCase=$(toFirstLetterUpper $i)
    result=$result$upperCase
  done
  echo $result
}
# name=name-age-hh-ddd-dddd
# camelize $name
# get prefix of the component lib name
function getPrefix {
  config_file="./.env.development"
  prefix=`sed -n 2p $config_file`
  echo ${prefix#*=}
}

# toFirstLetterUpper $prefix
prefix=$(toFirstLetterUpper `getPrefix`)
echo "======================================"
echo ""
echo "Prefix of this component lib = $prefix"
echo ""
echo "======================================"

function excludeArray {
  array=("modules" "mixins" "theme")
  result=false
  for i in ${array[*]}; do
    if [ $1 == $i ];then
      result=true
    fi
  done
  echo $result
}

function combine {
  cat build/.template/.index.js build/tmp.js > src/index.js
}
function callback {
  rm -rf build/tmp.js
  # rm -rf ../src/index.js
}
function init {
  # echo "" > build/tmp.js
  # dirArr=`ls $1`
  # prefix=$2
  # for i in $dirArr
  # do
  #   sub_dir="$1$i"
  #   exclude=$(excludeArray $i)
  #   if [[ -d "$sub_dir" && $exclude == false ]];then
  #     name=$(camelize $i)
  #     echo "$name component was compeleted!"
  #     echo "export { $name as $prefix$name };" >> build/tmp.js
  #   fi
  # done
  # combine
  # callback
  echo "======================================"
  echo ""
  echo "DONE !!!"
  echo ""
  echo "======================================"
}

function replacePrefix {
  # $1 代表之前的prefix
  # $2 代表当前的prefix
  # $3 要查找的目录
  if [ $1 == $2 ]; then
    echo "The prefix didn't change! No need replace."
    exit 0
  fi
  if [[ `getSystem` == "Darwin" ]]; then
    sed -i "" "s/$1/$2/g" `grep -rl "$1" $3`
  else
    sed -i "s/$1/$2/g" `grep -rl "$1" $3`
  fi
}

previousPrefix=""

while getopts "P:" arg
do
  case $arg in
    P)
      previousPrefix=$OPTARG
      ;;
    ?)
      echo "unknown arguments"
      exit 1
      ;;
    esac
done
exampleDir="examples/"
lowerCasePrefix=`getPrefix`
dir="src/"
init $dir $prefix
echo "The previous prefix was $previousPrefix and the current prefix is $lowerCasePrefix"
replacePrefix "$previousPrefix-" "$lowerCasePrefix-" $exampleDir



