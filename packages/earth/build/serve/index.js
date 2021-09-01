/*
* @Author: Just be free
* @Date:   2020-05-27 13:53:17
* @Last Modified by:   Just be free
* @Last Modified time: 2020-05-27 15:16:30
* @E-mail: justbefree@126.com
*/
const fs = require("fs");
module.exports = {
  getPreviousPrefix(filePath) {
    const reg = /\<\/(\w+)-(\w+)\>/;
    const content = fs.readFileSync(filePath, "utf-8");
    const str = content.replace(/\s+/g, "");
    const result = str.match(reg);
    return result[1] || "";
  }
};