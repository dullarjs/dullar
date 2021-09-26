/*
 * @Author: Just be free
 * @Date:   2020-03-11 14:17:51
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-26 14:05:52
 * @E-mail: justbefree@126.com
 */
import "./style/index.less";
import { defineComponent } from "../modules/component";
import { renderedMixins } from "../mixins/rendered";
import { slotsMixins } from "../mixins/slots";
const VALID_CHILD_COMPONENT = "field";
import { addClass, removeClass } from "../modules/dom";
export default defineComponent({
  name: "FieldGroup",
  mixins: [renderedMixins, slotsMixins],
  data() {
    return {
      validChildLength: 0,
    };
  },
  methods: {
    validChildComponent() {
      const prefix = this.VUE_APP_PREFIX;
      let validChildComponent = VALID_CHILD_COMPONENT;
      if (prefix !== "") {
        validChildComponent = `${prefix}-${VALID_CHILD_COMPONENT}`;
      }
      const children = this.slots();
      const validComponent = [];
      children &&
        children.forEach((child) => {
          if (
            child.componentOptions &&
            validChildComponent === child.componentOptions.tag
          ) {
            this.rendered((vnode) => {
              const className =
                this.validChildLength > 1 ? "" : "yn-field-solo";
              addClass(vnode.elm, className);
              removeClass(vnode.elm, "border-top-bottom");
            }, child);
            validComponent.push(child);
          }
        });
      return validComponent;
    },
  },
  render(h) {
    const slots = this.validChildComponent();
    this.validChildLength = slots.length;
    const className = [];
    if (this.validChildLength === 1) {
      className.push("yn-field-group-only-one-child");
    }
    return h("div", { class: ["yn-field-group", ...className] }, [slots]);
  },
});
