/*
* @Author: Just be free
* @Date:   2020-09-22 15:24:40
* @Last Modified by:   Just be free
* @Last Modified time: 2022-07-19 16:47:05
* @E-mail: justbefree@126.com
*/
import Venus, { mixins, prop, Options } from "../component/Venus";
import VIcon from "../icon";
import { h, computed, ref } from "vue";

class Props {
  size = prop<string|number>({ default: 26 })
  modelValue = prop<boolean>({ default: false })
  disabled = prop<boolean>({ default: false })
}
@Options({
  emits: ["update:modelValue"],
  name: "VRadiobox"
})
export default class VRadiobox extends mixins(Venus).with(Props) {
  public static componentName = "VRadiobox";
  public status = ref(this.modelValue).value;
  toggle(): void {
    if (this.disabled) {
      return;
    }
    if (this.status) {
      this.status = false;
    } else {
      this.status = true;
    }
    this.$emit("update:modelValue", this.status);
  }
  render() {
    const modelValue = ref(this.modelValue);
    const disabled = this.disabled;
    const nameComputed = computed(() => `radiobox-${modelValue.value ? "" : "un"}checked`);
    return h("span", { class: ["v-radiobox", disabled ? "disabled" : ""] }, {
      default: () => [
        h(VIcon, { class: ["radiobox-icon"], adjustColor: disabled && modelValue.value, size: this.size, name: nameComputed.value, onClick: this.toggle, cursor: disabled ? "not-allowed" : "pointer" }, {
          default: () => []
        })
      ]
    });
  }
}