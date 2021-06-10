/*
* @Author: Just be free
* @Date:   2021-06-10 19:00:11
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-10 19:00:12
* @E-mail: justbefree@126.com
*/
const qrcode = require('qrcode-terminal');
const chalk = require('chalk');
const opn = require('better-opn');
module.exports = {
  online() {
    const url = "https://lizhuang.xyz/docs/vue2-cli/";
    console.log(chalk.yellow.bold("Online docs\n") + chalk.green.underline(url));
    opn(url);
  }
}