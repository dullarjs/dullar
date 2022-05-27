/*
 * @Author: Just be free
 * @Date:   2020-02-14 16:38:25
 * @Last Modified by:   Just be free
 * @Last Modified time: 2022-05-27 11:18:12
 */
import { defineComponent } from "../modules/component";
import { camelize, hyphenate } from "../modules/utils";
import { warn } from "../modules/error";
export default defineComponent({
  name: "Spin",
  props: {
    type: {
      type: String,
      default: "snake",
    },
    size: {
      type: [Number, String],
      default: 28,
    },
    color: {
      type: String,
      default: "#007aff", // 这块要跟theme/variable.less内的主题色保持一致
    },
    borderWidth: [String, Number],
  },
  methods: {
    loadSubComponent() {
      const capitalizeName = hyphenate(this.type);
      const camelizeName = camelize(this.type);
      if (this.$options.components[camelizeName]) {
        return camelizeName;
      }
      try {
        const component = require(`./shapes/${capitalizeName}/index.js`);
        this.$options.components[camelizeName] = component["default"];
        return camelizeName;
      } catch (err) {
        warn(
          `The ${capitalizeName}.js module was not found in shapes floder. The default spinner will be used instead.`
        );
        return "snake";
      }
    },
    createSpinner(h) {
      const componentName = this.loadSubComponent();
      return h(
        componentName,
        { props: { size: Number(this.size), color: this.color } },
        []
      );
    },
  },
  render(h) {
    return h("span", {}, [this.createSpinner(h)]);
  },
});
