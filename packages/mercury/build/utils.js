/*
* @Author: Just be free
* @Date:   2020-09-18 18:10:49
* @Last Modified by:   Just be free
* @Last Modified time: 2021-09-24 15:31:16
* @E-mail: justbefree@126.com
*/
const path = require("path");
const fs = require("fs");
const chalk = require('chalk');
const log = console.log;
const join = path.join;
const resolve = (dir) => path.join(__dirname, "../", dir);
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
  },
  resolve,
  getComponentEntries(path) {
    const exculde = [".DS_Store", "mixins", "modules", "theme", "index.less", "window-events.js"];
    let files = fs.readdirSync(resolve(path));
    const componentEntries = files.reduce((ret, item) => {
      console.log("item = ", item);
      if (!exculde.includes(item)) {
        const itemPath = join(path, item);
        const isDir = fs.statSync(itemPath).isDirectory();
        if (isDir) {
          ret[item] = resolve(join(itemPath, "index.js"));
        } else {
          const [ name ] = item.split(".");
          ret[name] = resolve(`${itemPath}`);
        }
        return ret;
      } else {
        return ret;
      }
    }, {});
    // console.dir(componentEntries);
    return componentEntries;
  }
};
