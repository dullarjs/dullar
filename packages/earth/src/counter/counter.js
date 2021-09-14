/*
 * @Author: Just be free
 * @Date:   2020-06-15 10:01:18
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-05-12 12:00:36
 * @E-mail: justbefree@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import Iconfont from "../iconfont";
export default defineComponent({
  name: "Counter",
  components: { Iconfont },
  props: {
    max: {
      default: Number.MAX_VALUE,
      type: [Number, String],
    },
    min: {
      default: Number.MIN_VALUE,
      type: [Number, String],
    },
    steps: {
      default: 1,
      type: [Number, String],
    },
    value: {
      default: -1,
      type: [Number, String],
    },
    parse: {
      type: Function,
      default: (e) => {
        return e;
      },
    },
    name: String,
  },
  initPropsToData() {
    return [{ key: "count", value: "value", parse: Number }];
  },
  watch: {
    value: function (n) {
      this.set(n);
    },
  },
  methods: {
    set(val) {
      this.count = val;
    },
    subtract() {
      this.caculate("subtract");
    },
    add() {
      this.caculate("add");
    },
    isEqual(val1, val2) {
      return Number(val2) === Number(val1);
    },
    caculate(type = "add") {
      const steps = Number(this.steps);
      if (type === "add" && this.count < Number(this.max)) {
        this.count += steps;
      } else if (type === "subtract" && this.count > Number(this.min)) {
        this.count -= steps;
      } else {
        return;
      }
      this.$emit("input", this.count);
      this.$emit("change", {
        parsedValue: this.parse(this.count),
        value: this.count,
        type,
        name: this.name,
      });
    },
  },
  render(h) {
    if (
      Number(this.value) <= Number(this.max) &&
      Number(this.value) >= Number(this.min)
    ) {
      const minusIcon = this.isEqual(this.value, this.min)
        ? "minus-disabled"
        : "minus";
      const addIcon = this.isEqual(this.value, this.max)
        ? "add-disabled"
        : "add";
      return h("div", { class: ["yn-counter"] }, [
        h(
          genComponentName("iconfont"),
          {
            on: { click: this.subtract },
            class: ["yn-counter-subtract"],
            props: { name: minusIcon, size: 12 },
          },
          []
        ),
        h("span", { class: ["yn-counter-screen"] }, [this.count]),
        h(
          genComponentName("iconfont"),
          {
            on: { click: this.add },
            class: ["yn-counter-plus"],
            props: { name: addIcon, size: 12 },
          },
          []
        ),
      ]);
    } else {
      throw new Error(
        `${this.value} is out of range, the valid value should be range ${this.min} to ${this.max}`
      );
    }
  },
});
