/*
* @Author: Just be free
* @Date:   2020-09-28 11:35:23
* @Last Modified by:   Just be free
* @Last Modified time: 2022-07-19 16:48:47
* @E-mail: justbefree@126.com
*/
import Venus, { mixins, prop } from "../../../component/Venus";
// import loadingIcon from "./loading.svg";
const loadingIcon = require("./loading.svg");
import { h, computed, ref } from "vue";
class Props {
  color!: string
  size!: number
}
export default class Rotate extends mixins(Venus).with(Props) {
  render() {
    const color = ref(this.color);
    const spinColor = computed(() => color.value);
    const size = ref(this.size);
    const spinSize = computed(() => `${size.value}px`);
    return h("div",
      {
        class: ["q-spin-rotate-svg"],
        style: {
          borderBottomColor: spinColor.value,
          borderLeftColor: spinColor.value,
          borderTopColor: spinColor.value,
          width: spinSize.value,
          height: spinSize.value
        }
      },
    [h("img", { src: loadingIcon }, [])]);
  }
}