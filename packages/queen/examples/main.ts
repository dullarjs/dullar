/*
* @Author: Just be free
* @Date:   2020-09-21 17:37:50
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-10 14:32:36
* @E-mail: justbefree@126.com
*/

import * as Vue from "vue";
import App from "./App.vue";
import router from "./routes";
import Queen from "@";
import svgs from "./svgs";
import { hyphenate } from "@dullar/cube";
console.log(hyphenate);
console.log(`Queen ${Queen.version}`);
Queen.config({ QIcon: svgs });
const app = Vue.createApp(App);
app.use(router);
app.use(Queen);
app.mount("#example");
