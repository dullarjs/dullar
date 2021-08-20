/*
* @Author: Just be free
* @Date:   2021-08-03 09:56:19
* @Last Modified by:   Just be free
* @Last Modified time: 2021-08-12 16:47:30
* @E-mail: justbefree@126.com
*/
const axios = require("axios");
// const title = `## <font color="info">【@dullar github page publish notice】</font>\n`;
const send = (content = "") => {
  axios.post("https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=eff33902-7403-4176-9887-7e99dc52f7dd", {
    "msgtype": "news",
    "news": {
       "articles" : [
           {
               "title" : "Dullar moves the technology",
               "description" : "UI component examples have been updated",
               "url" : "https://dullar.xyz/",
               "picurl" : "https://dullar.xyz/img/dullar.c4096cd5.png"
           }
        ]
    }
    // "markdown": {
    //   "content": content
    // }
  })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error)
  });
}

send();

