/*
 * @Author: Just be free
 * @Date:   2020-04-13 11:32:18
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-04-13 13:38:52
 * @E-mail: justbefree@126.com
 */

import Vue from "vue";

export const extend = (options = {}) => {
  return Vue.extend(options);
};
export const renderedMixins = extend({
  methods: {
    rendered(callback, args) {
      Vue.nextTick(() => {
        callback && typeof callback === "function" && callback(args);
      });
    },
  },
});
