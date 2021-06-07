/*
* @Author: Just be free
* @Date:   2020-09-28 11:35:23
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-07 16:42:31
* @E-mail: justbefree@126.com
*/
import Queen, { mixins, prop } from "../../../component/Queen";
import { h, computed, ref } from "vue";
class Props {
  color!: string
  size!: number
}
export default class Snake extends mixins(Queen).with(Props) {
  render() {
    const color = ref(this.color);
    const spinColor = computed(() => color.value);
    const size = ref(this.size as number);
    const spinSize = computed(() => `${size.value / 3}px`);
    const bounceStyle = computed(() => {
      return {
        width: spinSize.value,
        height: spinSize.value,
        backgroundColor: spinColor.value
      }
    });
    return h("div", { class: ["q-spin-triple-bounce"] }, [
      h("div", { class: "triple-bounce1", style: bounceStyle.value }, []),
      h("div", { class: "triple-bounce2", style: bounceStyle.value }, []),
      h("div", { class: "triple-bounce3", style: bounceStyle.value }, [])
    ]);
  }
}