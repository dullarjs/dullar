'use strict';


const ora = require('ora');
const inquirer = require('inquirer');
const chalk = require('chalk');
const request = require('request');
const download = require('download-git-repo');

module.exports = () => {
  request({
    url: 'https://api.github.com/users/justbefree-org/repos',
    headers: {
      'User-Agent': 'vue2-pro-cli'
    }
  }, (err, res, body) =>{
    if (err) {
      console.log(chalk.red('Network unavaliable currently, load templates fail'));
      console.log(chalk.red(err));
      process.exit();
    }

    const requestBody = JSON.parse(body)
    if (Array.isArray(requestBody)) {
      let tplNames = [];
      requestBody.forEach(repo => {
        tplNames.push(repo.name);
      })

      let promptList = [
        {
          type: 'list',
          message: 'Choose template',
          name: 'tplName',
          choices: tplNames
        },
        {
          type: 'input',
          message: 'Project name:',
          name: 'projectName',
          validate (val) {
            if (val !== '') {
              return true
            }
            return 'Project name should not be empty!'
          }
        }
      ]
      inquirer.prompt(promptList).then(answers => {

        let ind = requestBody.find(function (ele) {
          return answers.tplName == ele.name;
        });
        let gitUrl = `${ind.full_name}#${ind.default_branch}`,
          defaultUrl = './',
          projectUrl = `${defaultUrl}/${answers.projectName}`,
          spinner = ora('\n Starting generate, please wait...');
          spinner.start();
        download(gitUrl, projectUrl, (error)=>{
          spinner.stop();
          if (error) {
            console.log('Template download fail……');
            console.log(error);
            process.exit();
          }
          console.log(chalk.green(`\n √ ${answers.projectName} generated sucessfully!`));
          console.log(`\n cd ${answers.projectName} && npm install \n`);
        })
      })
    } else {
      console.error(requestBody.message);
    }
  })
}