/*
* @Author: Just be free
* @Date:   2022-03-25 12:37:42
* @Last Modified by:   Just be free
* @Last Modified time: 2022-03-25 12:37:55
* @E-mail: justbefree@126.com
*/
import Vue from "vue";
import App from "./App";
import router from "./router";
import "./less/style.less";
import Earth from "@";
import svgs from "./iconfont/svgs";
Earth.config({ YnIconfont: { svgs, svgPrefix: "icon" } });
Vue.use(Earth);

new Vue({
  router,
  render: h => h(App)
}).$mount("#example");
