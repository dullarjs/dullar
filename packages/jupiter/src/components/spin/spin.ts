import { h } from "vue";
import { Vue, Options, prop, mixins } from "vue-class-component";
import "./style/index.scss";
import { AnyObject } from "../../types";
import { warn } from "@/utils/error";
import { hyphenate, camelize } from "@/utils";
class Props {
  type = prop<string>({ default: "snake" })
  size = prop<number | string>({ default: 28 })
  color = prop<string>({ default: "#007aff" })
  borderWidth = prop<number | string>({ default: 0 })
}
@Options({
  name: "Spin"
})
export default class Spin extends mixins(Vue).with(Props) {
  static componentName = "YnSpin";

  loadSubComponent() {
    const capitalizeName = hyphenate(this.type);
    try {
      const component = require(`./shapes/${capitalizeName}/index.ts`)["default"];
      return component;
    } catch (err) {
      warn(
        `The ${capitalizeName}.js module was not found in shapes floder. The default spinner will be used instead.`
      );
      return "snake";
    }
  }
  createSpinner() {
    const componentName = this.loadSubComponent();
    return h(
      componentName,
      { props: { size: Number(this.size), color: this.color } },
      []
    );
  }
  render() {
    return h("span", {}, [this.createSpinner()]);
  }
}
