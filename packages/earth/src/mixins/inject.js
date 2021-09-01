/*
 * @Author: Just be free
 * @Date:   2020-04-09 18:47:11
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-04-10 11:01:47
 * @E-mail: justbefree@126.com
 */

import Vue from "vue";

export const injectMixins = (name = "parent", options = {}) => {
  const indexKey = options.indexKey || "index";
  return Vue.extend({
    inject: [name],
    computed: {
      [indexKey]() {
        return this.parent.$children.indexOf(this);
      },
    },
  });
};
