/*
 * @Author: Just be free
 * @Date:   2020-03-19 16:53:00
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-26 14:05:31
 * @E-mail: justbefree@126.com
 */
import "./style/index.less";
import { defineComponent } from "../modules/component";
import { getScroller } from "../modules/dom/scroll";
import { getOffset, getScrollTop } from "../modules/dom";
import { slotsMixins } from "../mixins/slots";
const fixedStyle = /fixed/i;
export default defineComponent({
  name: "Sticky",
  mixins: [slotsMixins],
  props: {
    offsetTop: {
      type: [Number, String],
      default: 0,
    },
    zIndex: {
      type: [Number, String],
      default: 0,
    },
    container: {
      default: null,
    },
    sticky: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      fixed: false,
      top: 0,
      containerTop: 0,
      scrollElement: null,
    };
  },
  methods: {
    handleScroll(e) {
      const { position } = window.getComputedStyle(this.$el);
      if (!fixedStyle.test(position)) {
        this.top = getOffset(this.$el).top;
      }
      const { container, offsetTop } = this;
      const scrollTop = getScrollTop(e.target);
      const diff = this.top - scrollTop;
      this.$emit("scroll", { el: this.$el, scrollTop, offsetTop: diff });
      if (container && container.nodeType && container.nodeType === 1) {
        this.containerTop = getOffset(container).top;
        const clientHeight = container.clientHeight;
        if (
          this.containerTop - scrollTop <= 0 &&
          this.containerTop +
            clientHeight -
            scrollTop -
            this.$el.clientHeight >=
            0
        ) {
          this.fixed = true;
        } else {
          this.fixed = false;
        }
      } else {
        if (diff <= offsetTop) {
          this.fixed = true;
        } else {
          this.fixed = false;
        }
      }
    },
  },
  mounted() {
    this.scrollElement = getScroller(this.$el);
    this.top = getOffset(this.$el).top;
    this.scrollElement.addEventListener("scroll", this.handleScroll, false);
  },
  beforeDestroy() {
    this.scrollElement.removeEventListener("scroll", this.handleScroll, false);
  },
  render(h) {
    return h(
      "div",
      {
        style: { top: `${this.offsetTop}px`, zIndex: this.zIndex },
        class: [
          "yn-sticky",
          this.sticky && this.fixed ? "yn-sticky-fixed" : "",
        ],
      },
      [this.slots()]
    );
  },
});
