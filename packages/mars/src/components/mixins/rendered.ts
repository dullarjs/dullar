import Vue from "vue";

export const extend = (options: any = {}) => {
  return Vue.extend(options);
};
export const renderedMixins = extend({
  methods: {
    rendered(callback: any, args: any) {
      Vue.nextTick(() => {
        callback && typeof callback === "function" && callback(args);
      });
    },
  },
});