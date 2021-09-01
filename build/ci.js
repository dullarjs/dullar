/*
* @Author: Just be free
* @Date:   2021-06-29 13:43:20
* @Last Modified by:   Just be free
* @Last Modified time: 2021-09-01 11:38:54
* @E-mail: justbefree@126.com
*/
const args = process.argv.splice(2);
let fileName = "";
if (args.indexOf("type=examples") > -1) {
  fileName = "examples";
} else if (args.indexOf("type=pkg") > -1) {
  fileName = "pkg";
}
const { execFile } = require('child_process');
const fs = require("fs");
const path = require("path");
// const components = ["queen"];
const components = ["queen", "venus", "mercury", "earth"];

const ci = (components = []) => {
  if (components && Array.isArray(components) && components.length > 0) {
    const component = components.shift();
    console.log(`processing ${component}`);
    execFile(path.join(__dirname, `./${fileName}.sh`), ["-C", component], { shell: true }, (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
      console.log(stdout);
      ci(components);
    });
  }
}
fs.chmod(path.join(__dirname,  `./${fileName}.sh`), 0o775, (err) => {
  if (err) throw err;
  console.log(`The permissions for file ./${fileName}.sh have been changed!`);
  ci(components);
}); 