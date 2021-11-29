/*
* @Author: Just be free
* @Date:   2021-08-05 10:33:28
* @Last Modified by:   Just be free
* @Last Modified time: 2021-11-29 12:58:51
* @E-mail: justbefree@126.com
*/
const axios = require("axios");
const pkg = require("../lerna.json");
const title = `## <font color="info">【@dullar npm package publish notification】</font>\n`;
const link = `> A new version of the package @dullar/* (${pkg.version}) has been published, [Check now](https://www.npmjs.com/search?q=%40dullar)`;
const send = (content = "") => {
  axios.post("https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=eff33902-7403-4176-9887-7e99dc52f7dd", {
    "msgtype": "markdown",
    "markdown": {
      "content": content
    }
  })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error)
  });
}

send(`${title} ${link}`);