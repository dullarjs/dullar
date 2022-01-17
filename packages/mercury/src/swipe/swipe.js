/*
 * @Author: Just be free
 * @Date:   2020-04-09 09:20:12
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-10-20 15:33:39
 * @E-mail: justbefree@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import { slotsMixins } from "../mixins/slots";
import { renderedMixins } from "../mixins/rendered";
import { provideMixins } from "../mixins/provide";
const VALID_CHILD_COMPONENT = "swipe-item";
import { on, off, preventDefault } from "../modules/event";
import { Remainder } from "../modules/number/remainder";
import { touchMixins } from "../mixins/touch";
import { move } from "../modules/dom/animate/move";
import Popup from "../popup";
import { EventBus } from "../modules/event/bus";
export default defineComponent({
  name: "Swipe",
  components: {
    Popup,
  },
  mixins: [slotsMixins, provideMixins(), touchMixins, renderedMixins],
  props: {
    vertical: Boolean,
    autoPlay: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: [Number, String],
      default: 3000,
    },
    autoPlayWhenPopup: {
      type: Boolean,
      default: false,
    },
    showIndicator: {
      type: Boolean,
      default: true,
    },
    indicatorType: {
      type: String,
      default: "dashed", // circular dashed
    },
    arrow: {
      type: String,
      default: "none", // hover always none
    },
    trigger: {
      type: String,
      default: "none", // hover click none
    },
    height: {
      type: [String, Number],
      default: 240,
    },
    hoverPause: {
      type: Boolean,
      default: false,
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
  watch: {
    showPopup: function () {
      this.counts++;
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
      showPopup: false,
      children: [],
      fullScreen: false,
      counts: 0,
      oldActivedIndex: 0,
    };
  },
  computed: {
    size() {
      return this.vertical ? this.height : this.width;
    },
    swipeStyle() {
      return {
        height: `${this.height}px`,
      };
    },
  },
  methods: {
    visibilityChangeEvent() {
      const status = document.visibilityState;
      if (status === "visible") {
        this.paly();
      } else {
        this.stop();
      }
    },
    visibilityChange() {
      on(window, "visibilitychange", this.visibilityChangeEvent);
    },
    initRect() {
      this.rect = this.$el.getBoundingClientRect();
    },
    initialize() {
      if (this.$el) {
        this.width = Math.round(this.rect.width);
      }
      const el = this.$refs.swipeContainer;
      this.children = Array.from(el.children);
      const attr = this.vertical ? "top" : "left";
      this.children.forEach((child, key) => {
        if (key === this.activedIndex) {
          child.style[attr] = 0;
        } else {
          child.style[attr] = `${this.size}px`;
        }
      });
      this.paly();
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
          prevEle = that.children[r.getPrevious()];
          curEle = that.children[r.getIndex()];
          nextEle = that.children[r.getNext()];
          prevEle.style[attr] = `${value}px`;
          curEle.style[attr] = `${num * that.size + value}px`;
        },
        stop(e) {
          that.paly();
          that.dragging = false;
          that.delayActivedIndex = that.activedIndex;
          const disXY = that.vertical ? that.deltaY : that.deltaX;
          const timeDiff = Date.now() - startTime;
          if (timeDiff < 200 && disXY === 0) {
            if (that.showPopup) {
              that.closeImageViewer();
              return;
            }
            preventDefault(e.e);
            that.$emit("click", that.activedIndex);
            that.openImageViewer();
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
      move(
        el,
        {
          attr,
          b,
          c,
        },
        () => {
          fn && typeof fn === "function" && fn.call(this, el);
        }
      );
    },
    paly() {
      const { showPopup, autoPlayWhenPopup, autoPlay, duration } = this;
      if (showPopup && !autoPlayWhenPopup && !autoPlay) {
        return;
      }
      const durationTime = showPopup ? 99999999999 : duration;
      if (autoPlay && this.children.length > 1) {
        this.stop();
        this.timer = setTimeout(() => {
          if (!this.showPopup) {
            this.updateActivedIndex(1);
            this.paly();
          }
        }, Number(durationTime));
      }
    },
    next() {
      this.stop();
      this.updateActivedIndex(1, () => {
        this.paly();
      });
    },
    prev() {
      this.stop();
      this.updateActivedIndex(-1, () => {
        this.paly();
      });
    },
    updateActivedIndex(num, callback) {
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
      const prevEle = this.children[r.getPrevious()];
      const curEle = this.children[r.getIndex()];
      const nextEle = this.children[r.getNext()];
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
    indicatorMouseenter(key) {
      if (this.trigger !== "hover") {
        return;
      }
      this.switchSwipe(key);
    },
    indicatorClick(key) {
      if (this.trigger !== "click") {
        return;
      }
      this.switchSwipe(key);
    },
    switchSwipe(key) {
      const num = key - this.delayActivedIndex;
      this.oldActivedIndex = this.delayActivedIndex;
      this.activedIndex = key;
      this.delayActivedIndex = key;
      this.moving = false;
      this.stop();
      this.copyUpdateActivedIndex(num > 0 ? 1 : -1, key, () => {
        this.paly();
      });
    },
    copyUpdateActivedIndex(num, key, callback) {
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
      r.i = key;
      const prevEle = this.children[this.oldActivedIndex];
      const curEle = this.children[r.getIndex()];
      const nextEle = this.children[r.getNext()];
      const attr = this.vertical ? "top" : "left";
      this.startMove(prevEle, 0, -1 * num * this.size);
      curEle.style[attr] = `${num * this.size}px`;
      this.startMove(curEle, num * this.size, -1 * num * this.size, (el) => {
        this.moving = false;
        callback && typeof callback === "function" && callback(el);
      });
      nextEle.style[attr] = `${num * this.size}px`;
    },
    creteIndicator(h, length = 0) {
      const { showIndicator, indicatorType, delayActivedIndex } = this;
      if (showIndicator) {
        let type;
        if (indicatorType === "number") {
          type = [
            h(
              "span",
              {
                class: ["index"],
              },
              `${delayActivedIndex + 1}/${length}`
            ),
          ];
        } else {
          type = Array.apply(null, {
            length,
          }).map((i, key) => {
            return h(
              "div",
              {
                class: ["indicator-dot-box"],
                on: {
                  click: () => this.indicatorClick(key),
                  mouseenter: () => this.indicatorMouseenter(key),
                },
              },
              [
                h(
                  "i",
                  {
                    class: [
                      "indicator-dot",
                      indicatorType === "circular" ? "indicator-circular" : "",
                      Math.abs(delayActivedIndex) === key ? "active" : "",
                    ],
                  },
                  []
                ),
              ]
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
    openImageViewer() {
      if (!this.imageViewer) return;
      this.counts++;
      this.stop();
      this.fullScreen = true;
      this.unbindAllEvent();
      this.rendered(() => {
        this.initialize();
        this.showPopup = true;
        this.drag();
      });
    },
    closeImageViewer() {
      this.unbindAllEvent();
      this.showPopup = false;
    },
    handleAfterLeave() {
      this.fullScreen = false;
      this.rendered(() => {
        this.initialize();
        this.drag();
      });
    },
    creteArrow(h) {
      const { arrow, showPopup } = this;
      if (arrow === "always" || (arrow === "hover" && !showPopup)) {
        return [
          h(
            "div",
            {
              class: ["swipe-arrow-left-box"],
            },
            [
              h(
                "div",
                {
                  class: [
                    "swipe-arrow-left",
                    arrow === "hover" ? "arrow-none" : "",
                  ],
                },
                [
                  h(
                    genComponentName("iconfont"),
                    {
                      props: {
                        name: "arrow",
                        size: "28",
                      },
                      nativeOn: {
                        click: this.prev,
                      },
                    },
                    []
                  ),
                ]
              ),
            ]
          ),
          h(
            "div",
            {
              class: ["swipe-arrow-right-box"],
            },
            [
              h(
                "div",
                {
                  class: [
                    "swipe-arrow-right",
                    arrow === "hover" ? "arrow-none" : "",
                  ],
                },
                [
                  h(
                    genComponentName("iconfont"),
                    {
                      props: {
                        name: "arrow",
                        size: "28",
                        color: "#fff",
                      },
                      class: ["arrow-right-icon"],
                      nativeOn: {
                        click: this.next,
                      },
                    },
                    []
                  ),
                ]
              ),
            ]
          ),
        ];
      }
    },
    swipeMouseenter() {
      if (!this.hoverPause) {
        return;
      }
      this.stop();
    },
    swipeMouseleave() {
      if (!this.hoverPause) {
        return;
      }
      this.paly();
    },
    getSwipper(h, slots) {
      const { vertical } = this;
      const swiper = [
        h(
          "div",
          {
            style: {
              width: `${this.width}px`,
              height: `${this.height}px`,
            },
            class: ["yn-swipe-list-container"],
            ref: "swipeContainer",
            on: {
              mouseenter: this.swipeMouseenter,
              mouseleave: this.swipeMouseleave,
            },
          },
          slots
        ),
        this.creteIndicator(h, slots.length),
        !vertical && this.creteArrow(h),
      ];
      if (this.fullScreen) {
        return [
          h(
            genComponentName("popup"),
            {
              on: {
                input: this.closeImageViewer,
                afterLeave: this.handleAfterLeave,
              },
              class: ["yn-swipe-popup"],
              props: {
                position: "middle",
                showCloseIcon: this.showCloseIcon,
                // closeOnClickModal: false,
              },
              directives: [
                {
                  name: "show",
                  value: this.showPopup,
                },
              ],
            },
            swiper
          ),
        ];
      } else {
        return swiper;
      }
    },
  },
  mounted() {
    this.R = new Remainder(this.count, "activedIndex", this);
    this.initRect();
    this.initialize();
    EventBus.$on("window:resize", () => {
      this.initRect();
      this.initialize();
    });
    this.drag();
    this.visibilityChange();
  },
  beforeDestroy() {
    off(window, "visibilitychange", this.visibilityChangeEvent);
  },
  render(h) {
    const { arrow } = this;
    const prefix = this.VUE_APP_PREFIX;
    let validChildComponent = VALID_CHILD_COMPONENT;
    if (prefix !== "") {
      validChildComponent = `${prefix}-${VALID_CHILD_COMPONENT}`;
    }
    const slots = this.slots("default", {}, validChildComponent);
    this.count = slots.length;
    return h(
      "div",
      {
        class: ["yn-swipe", arrow === "hover" ? "yn-swipe-hover" : ""],
        style: this.swipeStyle,
      },
      this.getSwipper(h, slots)
    );
  },
});
