/*
 * @Author: Just be free
 * @Date:   2020-03-12 18:44:56
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-26 16:53:13
 * @E-mail: justbefree@126.com
 */
import "./style";
import { defineComponent, genComponentName } from "../modules/component";
import Flex from "../flex";
import FlexItem from "../flex-item";
import { getScrollTop } from "../modules/dom";
import { on, off } from "../modules/event";
import { EventBus } from "../modules/event/bus";
import { slotsMixins } from "../mixins/slots";
export default defineComponent({
  name: "Layout",
  mixins: [slotsMixins],
  components: { Flex, FlexItem },
  props: {
    showHeader: {
      type: Boolean,
      default: false,
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
    monitor: {
      // 是否监听scroll事件，默认为true监听
      type: Boolean,
      default: true,
    },
    footerTransitionName: {
      type: String,
      default: "slide-fade",
    },
    headerTransitionName: {
      type: String,
      default: "slide-fade-top",
    },
    topDistance: {
      type: [Number, String],
      default: 0,
    },
    bottomDistance: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      scrollTop: 0,
      clientHeight: 0,
      topTriggered: false,
      bottomTriggered: false,
      hasPopupOpened: false,
    };
  },
  mounted() {
    this.handleEventBus();
    if (this.monitor) {
      const ele = this.$refs.scrollElement.$el;
      if (!ele) {
        return false;
      }
      on(ele, "scroll", this.handleBodyScroll);
    }
  },
  beforeDestroy() {
    if (this.monitor) {
      const ele = this.$refs.scrollElement.$el;
      if (!ele) {
        return false;
      }
      off(ele, "scroll", this.handleBodyScroll);
    }
  },
  methods: {
    handleEventBus() {
      EventBus.$on("popup:opening", (status) => {
        this.hasPopupOpened = status;
      });
    },
    handleBodyScroll(e) {
      const scrollTop = getScrollTop(e.target);
      const clientHeight = e.target.clientHeight;
      const diff =
        scrollTop + clientHeight - (this.scrollTop + this.clientHeight);
      const bottom =
        e.target.scrollHeight -
        e.target.offsetHeight -
        (Number(this.bottomDistance) || 0);
      const top = Number(this.topDistance) || 0;
      // diff>0 往下滑动；diff<0往上滑动
      this.$emit("scroll", { e, scrollTop, diff, bottom: bottom - scrollTop });
      if (diff < 0 && !this.topTriggered && scrollTop <= top) {
        this.topTriggered = true;
        // 到达顶部
        this.$emit("reachTop", { e, scrollTop });
      } else if (diff > 0 && scrollTop > top) {
        this.topTriggered = false;
      }
      if (diff > 0 && !this.bottomTriggered && scrollTop >= bottom) {
        this.bottomTriggered = true;
        this.$emit("reachBottom", { e, scrollTop });
        // 到达底部
      } else if (diff < 0 && scrollTop >= bottom) {
        this.bottomTriggered = false;
      } else if (diff > 0 && scrollTop < bottom) {
        this.bottomTriggered = false;
      }
      this.scrollTop = scrollTop;
      this.clientHeight = clientHeight;
    },
    getTop(pos = 0) {
      const ele = this.$refs.scrollElement.$el;
      if (!ele) {
        return false;
      }
      ele.scrollTop = pos;
    },
  },
  render(h) {
    return h("div", { class: ["yn-layout"] }, [
      h(
        genComponentName("flex"),
        {
          class: ["yn-layout-flex-container"],
          props: { flexDirection: "column", justifyContent: "spaceBetween" },
        },
        [
          h("transition", { props: { name: this.headerTransitionName } }, [
            h(
              genComponentName("flex-item"),
              {
                directives: [{ name: "show", value: this.showHeader }],
                class: ["yn-layout-header"],
              },
              [this.slots("header")]
            ),
          ]),
          h(
            genComponentName("flex-item"),
            {
              class: [
                "yn-layout-body",
                "yn-layout-body-scroll-ele",
                this.hasPopupOpened ? "" : "ios-scrolling",
              ],
              props: { flex: 1 },
              ref: "scrollElement",
            },
            [this.slots("body")]
          ),
          h("transition", { props: { name: this.footerTransitionName } }, [
            h(
              genComponentName("flex-item"),
              {
                directives: [{ name: "show", value: this.showFooter }],
                class: ["yn-layout-footer"],
              },
              [this.slots("footer")]
            ),
          ]),
        ]
      ),
    ]);
  },
});
