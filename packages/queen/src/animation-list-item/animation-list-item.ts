/*
* @Author: Just be free
* @Date:   2020-11-19 17:56:43
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-11 15:08:06
* @E-mail: justbefree@126.com
*/
import Queen, { mixins, prop, Options } from "../component/Queen";
import { h, Transition, withDirectives, vShow, VNode } from "vue";

class Props {
  height?: string|number
}
@Options({
  name: "QAnimationListItem",
  inject: ["parentList"],
  computed: {
    animation() {
      return this.parentList.animation;
    }
  }
})
export default class QAnimationListItem extends mixins(Queen).with(Props) {
  public static componentName = "QAnimationListItem";
  public show = false;
  private entered = false;
  handleAfterEnter(): void {
    this.entered = true;
  }
  mounted() {
    if (this.animation) {
      const timer = setTimeout(() => {
        this.show = true;
        clearTimeout(timer);
      }, 1);
    }
  }
  beforeUnmount() {
    this.show = false;
  }
  render() {
    return h(Transition, {
      name: this.animation ? "q-slide-in" : "",
      onAfterEnter: this.handleAfterEnter
    }, {
      default: () => [
        withDirectives(h("div", { class: ["q-animation-list-item", this.entered ? "no-transform" : ""], style: { height: `${this.height}px` } }, {
          default: () => this.getSlots()
        }), [[vShow, (this.show || !this.animation)]])
      ]
    });
  }
}
