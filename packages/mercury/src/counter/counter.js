/*
 * @Author: Just be free
 * @Date:   2020-06-15 10:01:18
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-24 18:30:13
 * @E-mail: justbefree@126.com
 */
import "./style/index";
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
    editable: {
      type: Boolean,
      default: false
    },
    iconSize: {
      type: Number,
      default: 10
    },
    height: {
      type: Number,
      default: 30
    }
  },
  initPropsToData() {
    return [{ key: "count", value: "value", parse: Number }];
  },
  watch: {
    value: function (n) {
      this.set(n);
    },
  },
  computed: {
    style() {
      return { height: `${this.height}px`, lineHeight: `${this.height}px` }
    }
  },
  methods: {
    set(val) {
      this.count = val;
      if (this.editable) {
        this.$refs.countInput.value = val;
      }
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
    handleFocus(e) {
      this.oldValue = Number(e.target.value);
    },
    handleBlur(e) {
      const value = e.target.value;
      if (Number(value) > Number(this.max) || Number(value) < Number(this.min)) {
        this.set(this.oldValue);
        this.error(value);
      }
      this.count = Number(value);
      this.$emit("input", Number(value));
      e.target.value = this.count;
      let type = "add";
      if (Number(value) < this.oldValue) {
        type = "subtract";
      }
      this.$emit("change", {
        parsedValue: this.parse(this.count),
        value: this.count,
        type,
        name: this.name,
      });
    },
    error(value) {
      throw new Error(
        `${value} is out of range, the valid value should be range ${this.min} to ${this.max}`
      );
    }
  },
  render(h) {
    if (
      Number(this.value) <= Number(this.max) &&
      Number(this.value) >= Number(this.min)
    ) {
      const leftButtonClass = this.isEqual(this.value, this.min)
        ? "disabled"
        : "";
      const rightButtonClass = this.isEqual(this.value, this.max)
        ? "disabled"
        : "";
      return h("div", { class: ["yn-counter"] }, [
        h(
          genComponentName("iconfont"),
          {
            on: { click: this.subtract },
            style: { ...this.style },
            class: ["yn-counter-subtract", leftButtonClass],
            props: { name: "minus", size: this.iconSize },
          },
          []
        ),
        [
          this.editable ?
            h("input", { style: { ...this.style }, ref: "countInput", class: ["yn-counter-input"], attrs: { type: "number", value: this.count }, on: { blur: this.handleBlur, focus: this.handleFocus } }, [])
            :
            h("span", { style: { ...this.style }, class: ["yn-counter-screen"] }, [this.count])
        ],
        h(
          genComponentName("iconfont"),
          {
            on: { click: this.add },
            style: { ...this.style },
            class: ["yn-counter-plus", rightButtonClass],
            props: { name: "add", size: this.iconSize },
          },
          []
        ),
      ]);
    } else {
      this.error(this.value);
    }
  },
});
