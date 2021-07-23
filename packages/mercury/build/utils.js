/*
* @Author: Just be free
* @Date:   2020-09-18 18:10:49
* @Last Modified by:   Just be free
* @Last Modified time: 2020-09-21 11:11:11
* @E-mail: justbefree@126.com
*/
const path = require("path");
const fs = require("fs");
const chalk = require('chalk');
const log = console.log;
module.exports = {
  capitalize: (str = "") => {
    return str.replace(/\B([A-Z])/g, "-$1").toLowerCase();
  },
  camelize: (str = "", upperCaseFirstLetter = false) => {
    let ca = str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
    if (upperCaseFirstLetter) {
      return ca.replace(/\b\w/g, (f) => f.toUpperCase());
    } else {
      return ca;
    }
  },
  genComponentLibs: (pathName, exculde = []) => {
    const components = [];
    const files = fs.readdirSync(pathName);
    Array.apply(null, files).map((file, key) => {
      const stat = fs.statSync(path.join(pathName, file));
      // in windows operating system file starts with "/"
      const fileName = file.replace("/", "");
      if (stat.isDirectory() && exculde.indexOf(fileName) < 0) {
        components.push(fileName);
      }
    });
    return components;
  },
  chalk: (str) => {
    log(chalk.green(str));
  }
};
