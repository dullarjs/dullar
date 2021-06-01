/*
* @Author: Just be free
* @Date:   2021-05-13 09:50:08
* @Last Modified by:   Just be free
* @Last Modified time: 2021-05-13 13:22:05
* @E-mail: justbefree@126.com
*/

const request = require('request');
const chalk = require('chalk');
const ora = require('ora');
module.exports = () => {
  let spinner = ora('\n ' + chalk.yellow('Searching available templates...'));
  spinner.start();
  request({
    url: 'https://api.github.com/users/justbefree-org/repos',
    headers: {
      'User-Agent': 'vue2-pro-cli'
    }
  }, (err, res, body) => {
    spinner.stop();
    if (err) {
      console.log(chalk.red(`error ${JSON.stringify(err)}`));
      console.log(chalk.red(err));
      console.log(chalk.yellow('Select a template:'));
      console.log(chalk.green(`
        https://github.com/justbefree-org/vue2-js,
        https://github.com/justbefree-org/vue2-ts
        https://github.com/justbefree-org/vue3-ts(most recommended)
      `));
      process.exit();
    }
    const requestBody = JSON.parse(body);
    if (Array.isArray(requestBody)) {
      console.log();
      console.log(chalk.green('Available templates:'));
      console.log();
      requestBody.forEach(repo => {
        console.log(
        '  ' + chalk.yellow('★') +
        '  ' + chalk.white(repo.name) +
        ' - ' + repo.description)
      });
    } else {
      console.error(requestBody.message);
    }
  })
}
