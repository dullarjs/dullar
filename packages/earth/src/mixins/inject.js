/*
 * @Author: Just be free
 * @Date:   2020-04-09 18:47:11
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-11-22 14:30:36
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
    mounted() {
      this.bind();
    },
    beforeDestroy() {
      if (this.parent) {
        this.parent.children = this.parent.children.filter(
          (item) => item !== this
        );
      }
    },
    methods: {
      bind() {
        if (!this.parent || this.parent.children.indexOf(this) !== -1) {
          return;
        }
        const children = [...this.parent.children, this];
        // sortChildren(children, this.parent);
        this.parent.children = children;
      },
    },
  });
};
