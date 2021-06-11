/*
* @Author: Just be free
* @Date:   2020-09-22 15:24:40
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-11 15:07:11
* @E-mail: justbefree@126.com
*/
import Queen, { mixins, prop, Options } from "../component/Queen";
import QIcon from "../icon";
import { h, computed, ref } from "vue";

class Props {
  size = prop<string|number>({ default: 26 })
  modelValue = prop<boolean>({ default: false })
  disabled = prop<boolean>({ default: false })
}
@Options({
  emits: ["update:modelValue"],
  name: "QCheckbox"
})
export default class QCheckbox extends mixins(Queen).with(Props) {
  public static componentName = "QCheckbox";
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
    return h(QIcon, { class: ["q-checkbox"], size: this.size, name: nameComputed.value, onClick: this.toggle, cursor: "pointer" }, { default: () => [] });
  }
}