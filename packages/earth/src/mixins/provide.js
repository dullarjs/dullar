/*
 * @Author: Just be free
 * @Date:   2020-04-09 18:47:32
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-04-09 19:42:31
 * @E-mail: justbefree@126.com
 */

import Vue from "vue";
export const provideMixins = (name = "parent") => {
  return Vue.extend({
    provide() {
      return {
        [name]: this,
      };
    },
  });
};
