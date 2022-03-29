/*
* @Author: Just be free
* @Date:   2022-03-25 12:38:59
* @Last Modified by:   Just be free
* @Last Modified time: 2022-03-25 12:39:38
* @E-mail: justbefree@126.com
*/

import Vue from "vue";
import App from "./App";
import router from "./router";
import "./less/style.less";
import Mercury from "@";
import svgs from "./iconfont/svgs";
Mercury.config({ YnIconfont: { svgs, svgPrefix: "icon" } });
Vue.use(Mercury);

new Vue({
  router,
  render: h => h(App)
}).$mount("#example");
