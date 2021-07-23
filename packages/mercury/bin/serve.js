/*
* @Author: Just be free
* @Date:   2020-05-26 16:09:34
* @Last Modified by:   Just be free
* @Last Modified time: 2020-10-28 10:22:34
* @E-mail: justbefree@126.com
*/
const path = require("path");
const os=require('os');
const fs = require("fs");
const serve = require("../build/serve/index.js");
const previousPrefix = serve.getPreviousPrefix(path.join(__dirname, "../examples/layout/layout.vue"));
const servejs = require("../build/serve.js")();
const { write } = require("../build/genEntry");
console.log("The previous prefix was ", previousPrefix);
write();

if (os.platform() === "darwin") {
  const { execFile } = require('child_process');
  fs.chmod('build/serve.sh', 0o775, (err) => {
    if (err) throw err;
    console.log('The permissions for file "build/serve.sh" have been changed!');
  });
  const child = execFile('build/serve.sh', ["-P", previousPrefix], { shell: true }, (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    console.log(stdout);
  });
} else {
  servejs.run({ previousPrefix });
}