/*
* @Author: Just be free
* @Date:   2020-11-19 17:53:44
* @Last Modified by:   Just be free
* @Last Modified time: 2021-07-07 16:03:30
* @E-mail: justbefree@126.com
*/
import Queen, { mixins, prop, Options } from "../component/Queen";
import { h, TransitionGroup } from "vue";
import QFlex from "../flex";
import QFlexItem from "../flex-item";
export type animationTypes = "list" | "paragraph";
class Props {
  animationType = prop<animationTypes>({ default: "list" })
  duration = prop<number>({ default: 600 })
}
@Options({
  name: "QAnimationList",
})
export default class QAnimationList extends mixins(Queen).with(Props) {
  public static componentName = "QAnimationList";
  handleBeforeEnter(el: HTMLElement) {
    el.style.opacity = "0";
  }
  handleEnter(el: HTMLElement, done: () => void) {
    const delay = Number(el.getAttribute("dataindex")) * 5 + 100;
    setTimeout(() => {
      el.setAttribute("style", `
        opacity: 1;
        transition: opacity ${this.duration}ms;
        animation: ${this.animationType}-one-by-one ${this.duration}ms infinite;
        animation-iteration-count: 1;
      `);
      done();
    }, delay);
  }
  render() {
    const slots = this.getSlots() as any;
    const children = slots && slots[0] && slots[0].children;
    return h("div", { class: ["q-animation-list"] }, {
      default: () => [
        h(QFlex, { flexDirection: "column" }, {
          default: () => [
            h(TransitionGroup,
              { css: false, onEnter: (e: any, fun: any) => this.handleEnter(e, fun), onBeforeEnter: (e: any) => this.handleBeforeEnter(e) },
              {
                default: () => Array.apply(null, children as any).map((item: any, key: number, arr: any[]) => {
                  return h(QFlexItem, { key, dataindex: key }, { default: () => [item] });
                })
              }
            )
          ]
        })
      ]
    });
  }
}
