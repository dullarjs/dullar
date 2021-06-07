/*
* @Author: Just be free
* @Date:   2020-11-02 17:10:04
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-07 16:31:51
* @E-mail: justbefree@126.com
*/
import Queen, { mixins, prop, Options } from "../component/Queen";
import { EventEmulator, EventCallbackOptions } from "../component/EventEmulator";
import { preventDefault } from "../utils/event";
import { getScroller } from "../utils/dom/scroller";
import { getScrollTop } from "../utils/dom";
import { h } from "vue";
import QSpin from "../spin";
class Props {
  loadingText?: string
  draggingTip = prop<string>({ default: "松手下拉刷新" })
  loading?: boolean
}
@Options({
  name: "QPullRefresh"
})
export default class QPullRefresh extends mixins(Queen, EventEmulator).with(Props) {
  public static componentName = "QPullRefresh";
  public className = "";
  public dragging = false;
  public scrollElement: null|HTMLElement = null;
  public scrollTop = 0;
  genLoading() {
    if (this.loading) {
      return h("div", { class: ["q-pull-refresh-loading"] }, {
        default: () => [
          h("span", {}, [this.loadingText]),
          h(QSpin, { type: "tripleBounce", size: 40 }, { default: () => [] }),
        ]
      });
    }
  }
  genDraggingText() {
    if (this.dragging && this.deltaY >= 20) {
      return h("div", { class: ["q-pull-refresh-draggin-text"] }, {
        default: () => [
          h("span", {}, { default: () => [this.draggingTip] }),
        ]
      });
    }
  }
  handleScroll(e: Event) {
    this.scrollTop = getScrollTop(e.target as HTMLElement);
  }
  scroll() {
    this.scrollElement = getScroller(this.$el);
    this.scrollElement.addEventListener("scroll", this.handleScroll, false);
  }
  pull() {
    this.scroll();
    const that = this;
    this.bindEvent(this.$el, {
      dragging(event: EventCallbackOptions) {
        const { target } = event;
        if (!that.loading && that.deltaY > 0 && that.scrollTop <= 10) {
          that.dragging = true;
          that.className = "none dragging";
          target.style.transform = `translate3D(0, ${that.bounceDeltaY}px, 0)`;
        }
      },
      stop(event: EventCallbackOptions) {
        if (!that.loading && that.deltaY > 0 && that.scrollTop <= 10) {
          that.$emit("pullrefresh", true);
          const { target } = event;
          that.className = "";
          that.dragging = false;
          target.style.transform = "translate3D(0, 0, 0)";
        }
      },
    });
  }
  mounted() {
    this.pull();
  }
  beforeUnmount() {
    (this.scrollElement as HTMLElement).removeEventListener("scroll", this.handleScroll, false);
  }
  render() {
    return h("div", { class: ["q-pull-refresh", this.className] }, {
      default: () => [
        this.genLoading(),
        this.genDraggingText(),
        this.getSlots()
      ]
    });
  }
}
