/*
* @Author: Just be free
* @Date:   2020-08-25 18:15:13
* @Last Modified by:   Just be free
* @Last Modified time: 2020-08-25 18:20:37
* @E-mail: justbefree@126.com
*/

import { Toast, Indicator } from "./index";
declare module 'vue/types/vue' {
  interface Vue {
    Indicator: Indicator;
    Toast: Toast;
  }
}
