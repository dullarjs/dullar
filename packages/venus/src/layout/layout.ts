/*
* @Author: Just be free
* @Date:   2020-10-21 15:19:17
* @Last Modified by:   Just be free
* @Last Modified time: 2022-07-19 16:46:36
* @E-mail: justbefree@126.com
*/
import Venus, { mixins, prop, Options } from "../component/Venus";
import { h, VNode, Transition, withDirectives, vShow } from "vue";
import VFlex from "../flex";
import VFlexItem from "../flex-item";
import { getScrollTop } from "../utils/dom";
import { on, off } from "../utils/event";

class Props {
  showHeader = prop<boolean>({ default: false })
  headerHeight = prop<string|number>({ default: 44 })
  footerHeight = prop<string|number>({ default: 50 })
  showFooter = prop<boolean>({ default: true })
  monitor = prop<boolean>({ default: false }) // 是否监听scroll事件，默认为false监听
  footerTransitionName = prop<string>({ default: "slide-fade" })
  headerTransitionName = prop<string>({ default: "slide-fade-top" })
  topDistance = prop<number|string>({ default: 0 })
  bottomDistance = prop<number|string>({ default: 0 })
}
@Options({
  name: "VLayout",
  emits: ["reachtop", "reachbottom", "scroll"]
})
export default class QLayout extends mixins(Venus).with(Props) {
  public static componentName = "VLayout";
  public scrollTop = 0;
  public clientHeight = 0;
  public topTriggered = false;
  public bottomTriggered = false;
  handleBodyScroll(e: Event): void {
    const target = e.target as HTMLElement;
    const scrollTop = getScrollTop(target);
    const clientHeight = target.clientHeight;
    const diff =
      scrollTop + clientHeight - (this.scrollTop + this.clientHeight);
    const bottom =
      target.scrollHeight -
      target.offsetHeight -
      (Number(this.bottomDistance) || 0);
    const top = Number(this.topDistance) || 0;
    // diff>0 往下滑动；diff<0往上滑动
    this.$emit("scroll", { e, scrollTop, diff, bottom: bottom - scrollTop });
    if (diff < 0 && !this.topTriggered && scrollTop <= top) {
      this.topTriggered = true;
      // 到达顶部
      this.$emit("reachtop", { e, scrollTop });
    } else if (diff > 0 && scrollTop > top) {
      this.topTriggered = false;
    }
    if (diff > 0 && !this.bottomTriggered && scrollTop >= bottom) {
      this.bottomTriggered = true;
      this.$emit("reachbottom", { e, scrollTop });
      // 到达底部
    } else if (diff < 0 && scrollTop >= bottom) {
      this.bottomTriggered = false;
    } else if (diff > 0 && scrollTop < bottom) {
      this.bottomTriggered = false;
    }
    this.scrollTop = scrollTop;
    this.clientHeight = clientHeight;
  }
  getTop(pos: number = 0): void {
    const ele = (this.$refs.scrollElement as VFlexItem).$el;
    if (!ele) {
      return;
    }
    ele.scrollTop = pos;
  }
  mounted() {
    if (this.monitor) {
      const ele = (this.$refs.scrollElement as VFlexItem).$el;
      if (!ele) {
        return;
      }
      on(ele as HTMLElement, "scroll", this.handleBodyScroll);
    }
  }
  beforeUnmount() {
    if (this.monitor) {
      const ele = (this.$refs.scrollElement as VFlexItem).$el;
      if (!ele) {
        return;
      }
      off(ele, "scroll", this.handleBodyScroll);
    }
  }
  render() {
    const headerHeight = `${this.headerHeight}px`;
    const footerHeight = `${this.footerHeight}px`;
    return h("div", { class: ["v-layout"] }, {
      default: () => [
        h(VFlex,
          {
            class: ["v-layout-flex-container"],
            flexDirection: "column",
            justifyContent: "spaceBetween"
          },
          {
            default: () => [
              h(Transition, { name: this.headerTransitionName }, {
                default: () => [
                  withDirectives(h(VFlexItem, { class: ["v-layout-header"], style: { height: headerHeight } }, {
                    default: () => this.getSlots("header")
                  }), [[vShow, this.showHeader]])
                ]
              }),
              h(VFlexItem,
                {
                  class: ["v-layout-body", "v-layout-body-scroll-ele"],
                  flex: 1,
                  ref: "scrollElement"
                },
                {
                  default: () => this.getSlots("body")
                }
              ),
              h(Transition, { name: this.footerTransitionName }, {
                default: () => [
                  withDirectives(h(VFlexItem, { class: ["v-layout-footer"], style: { height: footerHeight } }, {
                    default: () => this.getSlots("footer")
                  }), [[vShow, this.showFooter]])
                ]
              })
            ]
          }
        )
      ]
    });
  }
}