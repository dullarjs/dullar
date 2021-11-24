/*
 * @Author: Just be free
 * @Date:   2021-11-23 11:05:35
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-11-24 17:38:14
 * @E-mail: justbefree@126.com
 */
// genComponentName
import { defineComponent } from "../modules/component";
import { getOffset } from "../modules/dom";
import { isNumber } from "../modules/utils";
import { touchMixins } from "../mixins/touch";
import { slotsMixins } from "../mixins/slots";
import { preventDefault } from "../modules/event";
import { EventBus } from "../modules/event/bus";
const defaultBoundary = {
  left: 0,
  right: "auto",
  top: 0,
  bottom: "auto",
};
export default defineComponent({
  name: "Dragable",
  mixins: [touchMixins, slotsMixins],
  props: {
    defaultLeft: {
      type: Number,
      default: 20,
    },
    defaultTop: {
      type: Number,
      default: 20,
    },
    defaultRight: Number,
    defaultBottom: Number,
    boundary: Object,
  },
  data() {
    return {
      el: null,
      dragging: false,
      currentLeft: 0,
      currentTop: 0,
      rect: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };
  },
  computed: {
    dragStyle() {
      const offsetHeight = this.el ? this.el.offsetHeight : 0;
      const offsetWidth = this.el ? this.el.offsetWidth : 0;
      const transition = this.dragging ? "none 0s ease 0s" : null;
      let left = this.defaultLeft;
      if (isNumber(this.defaultRight)) {
        left = this.rect.width - this.defaultRight - offsetWidth;
      }
      let top = this.defaultTop;
      if (isNumber(this.defaultBottom)) {
        top = this.rect.height - this.defaultBottom - offsetHeight;
      }
      return {
        transition,
        top: `${top}px`,
        left: `${left}px`,
      };
    },
  },
  methods: {
    initRect() {
      this.rect = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    drag() {
      const el = this.$el;
      if (!el) {
        return;
      }
      this.el = el;
      const that = this;
      let startTime = 0;
      const boundary = {
        ...defaultBoundary,
        ...this.boundary,
      };
      let minTop = isNumber(boundary.top) ? boundary.top : 0;
      let maxBottom = that.rect.height - el.offsetHeight;
      if (boundary.bottom !== "auto" && isNumber(boundary.bottom)) {
        if (that.rect.height - boundary.bottom > minTop) {
          maxBottom = that.rect.height - boundary.bottom - el.offsetHeight;
        }
      }
      let minLeft = isNumber(boundary.left) ? boundary.left : 0;
      let maxRight = that.rect.width - el.offsetWidth;
      if (boundary.right !== "auto" && isNumber(boundary.right)) {
        if (that.rect.width - boundary.right > minLeft) {
          maxRight = that.rect.width - boundary.right - el.offsetWidth;
        }
      }
      this.bindEvent(el, {
        start() {
          that.dragging = true;
          startTime = Date.now();
          const offset = getOffset(el);
          that.currentLeft = offset.left;
          that.currentTop = offset.top;
        },
        dragging(e) {
          preventDefault(e.e);
          let left = that.currentLeft + that.deltaX;
          let top = that.currentTop + that.deltaY;
          if (left <= minLeft) {
            left = minLeft;
          }
          if (left >= maxRight) {
            left = maxRight;
          }
          if (top <= minTop) {
            top = minTop;
          }
          if (top >= maxBottom) {
            top = maxBottom;
          }
          el.style.left = `${left}px`;
          el.style.top = `${top}px`;
        },
        stop(e) {
          const offset = getOffset(el);
          if (that.rect.width / 2 > offset.left) {
            el.style.left = `${minLeft}px`;
          } else {
            el.style.left = `${maxRight}px`;
          }
          that.dragging = false;
          const timeDiff = Date.now() - startTime;
          if (timeDiff < 200) {
            preventDefault(e.e);
            that.$emit("click");
            return;
          }
        },
      });
    },
  },
  mounted() {
    this.drag();
    EventBus.$on("window:resize", () => {
      this.initRect();
    });
  },
  activated() {
    this.drag();
    EventBus.$on("window:resize", () => {
      this.initRect();
    });
  },
  beforeDestroy() {
    this.unbindAllEvent();
  },
  deactivated() {
    this.unbindAllEvent();
  },
  render(h) {
    return h("div", { class: ["yn-dragable"], style: this.dragStyle }, [
      this.slots(),
    ]);
  },
});
