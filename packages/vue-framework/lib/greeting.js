/*
* @Author: Just be free
* @Date:   2021-05-13 09:51:51
* @Last Modified by:   Just be free
* @Last Modified time: 2021-05-13 13:23:20
* @E-mail: justbefree@126.com
*/
const qrcode = require('qrcode-terminal');
const chalk = require('chalk');
module.exports = {
  hi() {
    console.log("===============================================================");
    console.log("|                                                             |");
    console.log("|             " + chalk.white.bold("Welcome to use @dullar/vue-framework") + "             |");
    console.log("|                                                             |");
    console.log("===============================================================");
    console.log();
    console.log(chalk.yellow.bold("If you have any questions,") + chalk.yellow.underline.bold(" don't be hesitate"));
    console.log();
    qrcode.generate('https://u.wechat.com/EICPGRBBQ92j-TtqqS-wN9Q');
  },
  wechat() {
    qrcode.generate('https://u.wechat.com/EICPGRBBQ92j-TtqqS-wN9Q');
  }
};
