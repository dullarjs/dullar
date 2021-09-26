/*
* @Author: Just be free
* @Date:   2020-05-06 14:45:16
* @Last Modified by:   Just be free
* @Last Modified time: 2021-09-26 16:25:29
* @E-mail: justbefree@126.com
*/
let config = {};

if (process.env.NODE_ENV === "components") {
  config = require("./components.config");
} else {
  config = require("./examples.config");
}
module.exports = config;
