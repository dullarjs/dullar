/*
* @Author: Just be free
* @Date:   2020-11-02 14:26:49
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-07 16:24:19
* @E-mail: justbefree@126.com
*/
import Queen, { mixins, prop, Options } from "../component/Queen";
import { EventEmulator, EventCallbackOptions } from "../component/EventEmulator";
import { preventDefault } from "../utils/event";
import QIcon from "../icon";
import { h } from "vue";
class Props {
  max = prop<number|string>({ default: Number.MAX_VALUE })
  min = prop<number|string>({ default: Number.MIN_VALUE })
  steps = prop<number|string>({ default: 1 })
  modelValue = prop<number|string>({ default: -1 })
  parse = prop<(e: any) => any>({
    default: () => {
      return (e: any) => {
        return e;
      };
    }
  })
  name?: string
}

@Options({
  name: "QCounter",
  emits: ["update:modelValue", "change"]
})
export default class QCounter extends mixins(Queen, EventEmulator).with(Props) {
  public static componentName = "QCounter";
  public count = Number(this.modelValue);
  isEqual(val1: string|number, val2: string|number): boolean {
    return Number(val2) === Number(val1);
  }
  caculate(type = "add"): void {
    const steps = Number(this.steps);
    if (type === "add" && this.count < Number(this.max)) {
      this.count += steps;
    } else if (type === "subtract" && this.count > Number(this.min)) {
      this.count -= steps;
    } else {
      return;
    }
    this.$emit("update:modelValue", this.count);
    this.$emit("change", {
      parsedValue: this.parse(this.count),
      value: this.count,
      type,
      name: this.name,
    });
  }
  initEvent(): void {
    let timer: null|number = null;
    const that = this;
    const addButton = this.$refs.addButton as QIcon;
    this.bindEvent(addButton.$el, {
      start(event: EventCallbackOptions) {
        preventDefault(event.e, true);
        clearTimeout(timer as number);
        timer = setInterval(() => {
          that.caculate("add");
        }, 100);
      },
      stop(event: EventCallbackOptions) {
        preventDefault(event.e, true);
        clearTimeout(timer as number);
      }
    });
    const minusButton = this.$refs.minusButton as QIcon;
    this.bindEvent(minusButton.$el, {
      start(event: EventCallbackOptions) {
        preventDefault(event.e, true);
        clearTimeout(timer as number);
        timer = setInterval(() => {
          that.caculate("subtract");
        }, 100);
      },
      stop(event: EventCallbackOptions) {
        preventDefault(event.e, true);
        clearTimeout(timer as number);
      }
    });
  }
  mounted() {
    this.initEvent();
  }
  render() {
    if (
      Number(this.modelValue) <= Number(this.max) &&
      Number(this.modelValue) >= Number(this.min)
    ) {
      const leftButtonClass = this.isEqual(this.modelValue, this.min)
        ? "disabled"
        : "";
      const rightButtonClass = this.isEqual(this.modelValue, this.max)
        ? "disabled"
        : "";
      return h("div", { class: ["q-counter"] }, {
        default: () => [
          h(QIcon,
            {
              ref: "minusButton",
              class: ["q-counter-subtract", leftButtonClass],
              cursor: "pointer",
              name: "minus",
              size: 15
            },
            { default: () => [] }
          ),
          h("span", { class: ["q-counter-screen"] }, { default: () => [this.count] }),
          h(QIcon,
            {
              ref: "addButton",
              class: ["q-counter-plus", rightButtonClass],
              cursor: "pointer",
              name: "add",
              size: 15
            },
            { default: () => [] } 
          )
        ]
      });
    } else {
      throw new Error("value is out of range");
    }
  }
}
