/*
* @Author: Just be free
* @Date:   2021-05-13 09:51:02
* @Last Modified by:   Just be free
* @Last Modified time: 2021-05-13 13:19:27
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