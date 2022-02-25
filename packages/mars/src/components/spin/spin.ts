import Vue, { CreateElement } from "vue";
import { Component, Prop  } from "vue-property-decorator";
import "./style/index.scss";
import { AnyObject } from "../../types";
import { warn } from "@/utils/error";
import { hyphenate, camelize } from "@/utils";
@Component({
  name: "Spin"
})
export default class Spin extends Vue {
  static componentName = "YnSpin";
  @Prop({
    type: String,
    default: "snake"
  })
  type!: string;
  @Prop({
    type: [Number, String],
    default: 28
  })
  size!: number | string;
  @Prop({
    type: String,
    default: "#007aff"
  })
  color!: string;
  @Prop({
    type: [Number, String],
    default: 0
  })
  borderWidth!: number | string;

  loadSubComponent() {
      const capitalizeName = hyphenate(this.type);
      const camelizeName = camelize(this.type);
      if ((this as AnyObject).$options.components[camelizeName]) {
        return camelizeName;
      }
      try {
        const component = require(`./shapes/${capitalizeName}/index.ts`);
        (this as AnyObject).$options.components[camelizeName] = component["default"];
        return camelizeName;
      } catch (err) {
        warn(
          `The ${capitalizeName}.js module was not found in shapes floder. The default spinner will be used instead.`
        );
        return "snake";
      }
    }
    createSpinner(h: CreateElement) {
      const componentName = this.loadSubComponent();
      return h(
        componentName,
        { props: { size: Number(this.size), color: this.color } },
        []
      );
    }
    render(h: CreateElement) {
      return h("span", {}, [this.createSpinner(h)]);
    }
}
