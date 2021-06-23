/*
* @Author: Just be free
* @Date:   2020-09-22 15:24:40
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-23 17:13:57
* @E-mail: justbefree@126.com
*/
import Queen, { mixins, prop, Options } from "../component/Queen";
import VIcon from "../icon";
import { h, computed, ref } from "vue";

class Props {
  size = prop<string|number>({ default: 26 })
  modelValue = prop<boolean>({ default: false })
  disabled = prop<boolean>({ default: false })
}
@Options({
  emits: ["update:modelValue"],
  name: "VCheckbox"
})
export default class VCheckbox extends mixins(Queen).with(Props) {
  public static componentName = "VCheckbox";
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
    const nameComputed = computed(() => `checkbox-${modelValue.value ? "" : "un"}checked`);
    const disabled = this.disabled;
    return h("span", { class: ["v-checkbox", disabled ? "disabled" : ""] }, {
      default: () => [
        h(VIcon, { class: ["checkbox-icon"], adjustColor: disabled && modelValue.value, size: this.size, name: nameComputed.value, onClick: this.toggle, cursor: disabled ? "not-allowed" : "pointer" }, {
          default: () => []
        })
      ]
    });
  }
}