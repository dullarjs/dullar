/*
 * @Author: Just be free
 * @Date:   2021-11-23 11:05:35
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-11-23 18:10:23
 * @E-mail: justbefree@126.com
 */
// genComponentName
import { defineComponent } from "../modules/component";
import { getOffset } from "../modules/dom";
import { touchMixins } from "../mixins/touch";
import { slotsMixins } from "../mixins/slots";
import { preventDefault } from "../modules/event";
import { EventBus } from "../modules/event/bus";
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
  },
  data() {
    return {
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
      const transition = this.dragging ? "none 0s ease 0s" : null;
      return {
        transition,
        top: `${this.defaultTop}px`,
        left: `${this.defaultLeft}px`,
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
      const that = this;
      let startTime = 0;
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
          if (left <= 0) {
            left = 0;
          }
          if (left >= that.rect.width - el.offsetWidth) {
            left = that.rect.width - el.offsetWidth;
          }
          if (top <= 0) {
            top = 0;
          }
          if (top >= that.rect.height - el.offsetHeight) {
            top = that.rect.height - el.offsetHeight;
          }
          el.style.left = `${left}px`;
          el.style.top = `${top}px`;
        },
        stop(e) {
          console.log(e);
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
  render(h) {
    return h("div", { class: ["yn-dragable"], style: this.dragStyle }, [
      this.slots(),
    ]);
  },
});
