/*
 * @Author: Just be free
 * @Date:   2020-04-09 09:20:12
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-11-29 10:50:29
 * @E-mail: justbefree@126.com
 */
import { defineComponent } from "../modules/component";
import { slotsMixins } from "../mixins/slots";
import { renderedMixins } from "../mixins/rendered";
import { provideMixins } from "../mixins/provide";
const VALID_CHILD_COMPONENT = "swipe-item";
import { on, off, preventDefault } from "../modules/event";
import { Remainder } from "../modules/number/remainder";
import { touchMixins } from "../mixins/touch";
import { move } from "../modules/dom/animate/move";
import { EventBus } from "../modules/event/bus";
export default defineComponent({
  name: "Swipe",
  mixins: [slotsMixins, provideMixins(), touchMixins, renderedMixins],
  props: {
    vertical: Boolean,
    duration: {
      type: [Number, String],
      default: 3000,
    },
    autoPlay: {
      type: Boolean,
      default: true,
    },
    showIndicator: {
      type: Boolean,
      default: true,
    },
    indicatorType: {
      type: String,
      default: "dashed",
    },
    height: {
      type: [String, Number],
      default: 240,
    },
    showCloseIcon: {
      type: Boolean,
      default: true,
    },
    imageViewer: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      rect: {},
      width: 0,
      count: 0,
      timer: null,
      activedIndex: 0,
      delayActivedIndex: 0,
      moving: false,
      dragging: false,
    };
  },
  watch: {
    children: function () {
      this.initialize();
    },
  },
  computed: {
    size() {
      return this.vertical ? this.height : this.width;
    },
    swipeStyle() {
      return {
        "min-height": `${this.height}px`,
      };
    },
  },
  methods: {
    visibilityChangeEvent() {
      const status = document.visibilityState;
      if (status === "visible") {
        this.play();
      } else {
        this.stop();
      }
    },
    visibilityChange() {
      on(window, "visibilitychange", this.visibilityChangeEvent);
    },
    initialize() {
      if (this.$el) {
        this.rect = this.$el.getBoundingClientRect();
        this.width = Math.round(this.rect.width);
      }
      this.$emit("ticking", {
        length: this.children.length,
        activeIndex: this.activedIndex + 1,
      });
      const attr = this.vertical ? "top" : "left";
      this.children.forEach((child, key) => {
        if (key === this.activedIndex) {
          child.$el.style[attr] = "0px";
        } else {
          child.$el.style[attr] = `${this.size}px`;
        }
      });
      this.play();
    },
    drag() {
      const el = this.$refs.swipeContainer;
      if (!el) {
        return;
      }
      let prevEle;
      let curEle;
      let num = 1;
      let nextEle;
      let moving = false;
      const that = this;
      let r = null;
      let startTime = 0;
      this.bindEvent(el, {
        start() {
          that.stop();
          that.dragging = true;
          startTime = Date.now();
        },
        dragging(e) {
          preventDefault(e.e);
          if (moving) {
            return;
          }
          if (!r) {
            if (
              (!that.vertical && that.deltaX < 0) ||
              (that.vertical && that.deltaY < 0)
            ) {
              r = that.R.next();
              num = 1;
            } else if (
              (!that.vertical && that.deltaX > 0) ||
              (that.vertical && that.deltaY > 0)
            ) {
              r = that.R.previous();
              num = -1;
            } else {
              return;
            }
          }
          const attr = that.vertical ? "top" : "left";
          const value = that.vertical ? that.deltaY : that.deltaX;
          prevEle = that.children[r.getPrevious()].$el;
          curEle = that.children[r.getIndex()].$el;
          nextEle = that.children[r.getNext()].$el;
          prevEle.style[attr] = `${value}px`;
          curEle.style[attr] = `${num * that.size + value}px`;
        },
        stop(e) {
          that.play();
          that.dragging = false;
          that.delayActivedIndex = that.activedIndex;
          const disXY = that.vertical ? that.deltaY : that.deltaX;
          const timeDiff = Date.now() - startTime;
          if (timeDiff < 200 && disXY === 0) {
            preventDefault(e.e);
            that.$emit("click", that.activedIndex);
            return;
          }
          if (moving || disXY === 0 || !prevEle || !curEle || !nextEle) {
            return;
          }
          const attr = that.vertical ? "top" : "left";
          moving = true;
          that.startMove(prevEle, disXY, -1 * num * that.size - disXY);
          curEle.style[attr] = `${num * that.size + disXY}px`;
          nextEle.style[attr] = `${num * that.size}px`;
          that.startMove(
            curEle,
            num * that.size + disXY,
            -1 * num * that.size - disXY,
            () => {
              moving = false;
              prevEle = null;
              curEle = null;
              nextEle = null;
              r = null;
            }
          );
        },
      });
    },
    startMove(el, b = 0, c = 0, fn) {
      const { vertical } = this;
      const attr = vertical ? "top" : "left";
      move(el, { attr, b, c }, () => {
        fn && typeof fn === "function" && fn.call(this, el);
      });
    },
    play() {
      if (!this.autoPlay) return;
      if (Number(this.duration) > 0 && this.children.length > 1) {
        this.stop();
        this.timer = setTimeout(() => {
          this.updateActivedIndex(1);
          this.play();
        }, Number(this.duration));
      }
    },
    next() {
      this.stop();
      this.updateActivedIndex(1, () => {
        this.play();
      });
    },
    prev() {
      this.stop();
      this.updateActivedIndex(-1, () => {
        this.play();
      });
    },
    updateActivedIndex(num, callback) {
      if (!this.children || this.children.length === 0) return;
      // 正在运动的时候不允许连续点击
      if (this.moving) {
        return false;
      }
      this.moving = true;
      let r;
      const isPositive = num > 0;
      if (isPositive) {
        r = this.R.next();
      } else {
        r = this.R.previous();
      }
      this.delayActivedIndex = this.activedIndex;
      this.$emit("ticking", {
        length: this.children.length,
        activeIndex: this.activedIndex + 1,
      });
      const prevEle = this.children[r.getPrevious()].$el;
      const curEle = this.children[r.getIndex()].$el;
      const nextEle = this.children[r.getNext()].$el;
      const attr = this.vertical ? "top" : "left";
      this.startMove(prevEle, 0, -1 * num * this.size);
      curEle.style[attr] = `${num * this.size}px`;
      this.startMove(curEle, num * this.size, -1 * num * this.size, (el) => {
        this.moving = false;
        callback && typeof callback === "function" && callback(el);
      });
      nextEle.style[attr] = `${num * this.size}px`;
    },
    stop() {
      clearTimeout(this.timer);
    },
    creteIndicator(h, length = 0) {
      const { showIndicator, indicatorType, delayActivedIndex } = this;
      if (showIndicator) {
        let type;
        if (indicatorType === "number") {
          type = [
            h(
              "span",
              { class: ["index"] },
              `${delayActivedIndex + 1}/${length}`
            ),
          ];
        } else {
          type = Array.apply(null, { length }).map((i, key) => {
            return h(
              "i",
              {
                class: [
                  "indicator-dot",
                  Math.abs(delayActivedIndex) === key ? "active" : "",
                ],
              },
              []
            );
          });
        }
        return h(
          "div",
          {
            class: [
              "yn-swipe-indicators",
              indicatorType,
              this.vertical ? "vertical" : "horizontal",
            ],
          },
          type
        );
      }
    },
    getSwipper(h, slots) {
      return [
        h(
          "div",
          {
            style: { width: `${this.width}px`, height: `${this.height}px` },
            class: ["yn-swipe-list-container"],
            ref: "swipeContainer",
          },
          slots
        ),
        this.creteIndicator(h, slots.length),
      ];
    },
  },
  mounted() {
    this.R = new Remainder(this.count, "activedIndex", this);
    this.initialize();
    EventBus.$on("window:resize", () => {
      this.initialize();
    });
    this.drag();
    this.visibilityChange();
  },
  beforeDestroy() {
    off(window, "visibilitychange", this.visibilityChangeEvent);
  },
  render(h) {
    const prefix = this.VUE_APP_PREFIX;
    let validChildComponent = VALID_CHILD_COMPONENT;
    if (prefix !== "") {
      validChildComponent = `${prefix}-${VALID_CHILD_COMPONENT}`;
    }
    const slots = this.slots("default", {}, validChildComponent);
    this.count = slots.length;
    return h(
      "div",
      { class: ["yn-swipe"], style: this.swipeStyle },
      this.getSwipper(h, slots)
    );
  },
});
