/*
 * @Author: Just be free
 * @Date:   2020-01-20 17:15:01
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-09-11 14:22:44
 * @E-mail: justbefree@126.com
 */

import Vue from "vue";
import App from "./App";
import router from "./router";

import "normalize.css";
import "@/theme/global.scss";

// YuiComponent.config({ iconfont: "../" });
if (process.env.NODE_ENV === "development") {
  // const VConsole = require("vconsole");
  // new VConsole();
}

new Vue({
  router,
  render: h => h(App)
}).$mount("#example");
