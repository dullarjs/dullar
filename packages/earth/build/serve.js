/*
* @Author: Just be free
* @Date:   2020-06-08 16:34:45
* @Last Modified by:   Just be free
* @Last Modified time: 2020-06-09 09:52:35
* @E-mail: justbefree@126.com
*/
const path = require("path");
const fs = require("fs");
const readline = require('readline');
async function readLine() {
  const fileStream = fs.createReadStream(path.join(__dirname, "../.env.development"));
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    if (line.indexOf("VUE_APP_PREFIX") > -1) {
      const prefix = line.split("=")[1];
      return prefix;
      break;
    }
    // console.log(`Line from file: ${line}`);
  }
}
function replaceContent(pathName, reg, str) {
  if (reg === str) {
    console.log("The prefix didn't change! No need replace.");
    return;
  }
  fs.readdir(pathName, (err, files) => {
    files.forEach(file => {
      const subPathName = path.join(pathName, file);
      fs.stat(subPathName, (err, data) => {
        if (data.isFile()) {
          fs.readFile(subPathName, "utf8", (err, data) => {
            if (err) {
              return err;
            }
            let result = data.toString();
            if (result.indexOf(reg) > -1) {
              const regexp = new RegExp(reg, "ig");
              result = result.replace(regexp, str);
              fs.chmod(subPathName, 0o777, (err) => {
                if (err) {
                  console.log("Access denied");
                  return err;
                }
                fs.writeFile(subPathName, result, "utf8", (err) => {
                  if (err) {
                    console.log("filed to write = ", err, subPathName);
                  }
                });
              });
            }
          });
        } else {
          replaceContent(subPathName, reg, str);
        }
      });
    });
  });
}
module.exports = function () {
  return {
    run: async function(args = {}) {
      const { previousPrefix } = args;
      const prefix = await readLine();
      const examplesDir = path.join(__dirname, "../examples");
      replaceContent(examplesDir, `${previousPrefix}-`, `${prefix}-`);
      console.log("The application is about to start ", previousPrefix, prefix);
    }
  };
};
