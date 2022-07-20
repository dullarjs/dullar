/*
* @Author: Just be free
* @Date:   2022-03-30 13:51:08
* @Last Modified by:   Just be free
* @Last Modified time: 2022-03-30 13:51:27
* @E-mail: justbefree@126.com
*/
import { createApp } from 'vue'
import App from "./App";
import router from "./router";

import "normalize.css";
import "@/theme/global.scss";
import svgs from "./iconfont/svgs";

import Mars from "../src/index";
Mars.config({ YnIconfont: { svgs, svgPrefix: "icon" } });

const app = createApp(App);
app.use(router);
app.use(Mars);
app.mount("#example");
