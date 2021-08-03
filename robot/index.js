/*
* @Author: Just be free
* @Date:   2021-08-03 09:56:19
* @Last Modified by:   Just be free
* @Last Modified time: 2021-08-03 14:45:59
* @E-mail: justbefree@126.com
*/
const axios = require("axios");
const pkg = require("../lerna.json");
const title = `## <font color="info">【dullar编译完成】</font>\n`;
const link = "[查看官网](https://dullar.xyz/)";
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

