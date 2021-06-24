/*
* @Author: Just be free
* @Date:   2020-09-22 15:24:40
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-24 16:02:44
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
  name: "VRadiobox"
})
export default class VRadiobox extends mixins(Queen).with(Props) {
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