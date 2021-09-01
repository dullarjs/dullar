/*
* @Author: Just be free
* @Date:   2021-06-29 13:43:20
* @Last Modified by:   Just be free
* @Last Modified time: 2021-09-01 11:00:22
* @E-mail: justbefree@126.com
*/
const { execFile } = require('child_process');
const fs = require("fs");
const path = require("path");
// const components = ["queen"];
const components = ["queen", "venus", "mercury", "earth"];

const ci = (components = []) => {
  if (components && Array.isArray(components) && components.length > 0) {
    const component = components.shift();
    console.log(`processing ${component}`);
    execFile(path.join(__dirname, "./build.sh"), ["-C", component], { shell: true }, (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
      console.log(stdout);
      ci(components);
    });
  }
}
fs.chmod(path.join(__dirname, './build.sh'), 0o775, (err) => {
  if (err) throw err;
  console.log('The permissions for file "./build.sh" have been changed!');
  ci(components);
}); 