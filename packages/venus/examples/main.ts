/*
* @Author: Just be free
* @Date:   2020-09-21 17:37:50
* @Last Modified by:   Just be free
* @Last Modified time: 2022-07-19 17:25:32
* @E-mail: justbefree@126.com
*/

import * as Vue from "vue";
import App from "./App.vue";
import router from "./routes";
import Venus from "@";
import svgs from "./svgs";
import { hyphenate } from "@dullar/cube";
console.log(hyphenate);
// console.log(`Venus ${Venus.version}`);
Venus.config({ VIcon: svgs });
const app = Vue.createApp(App);
app.use(router);
app.use(Venus);
app.mount("#example");
