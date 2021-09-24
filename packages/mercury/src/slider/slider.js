/*
 * @Author: Just be free
 * @Date:   2020-04-22 11:10:20
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-24 18:32:48
 * @E-mail: justbefree@126.com
 */
import "./style/index";
import { defineComponent } from "../modules/component";
import { touchMixins } from "../mixins/touch";
import { getOffset } from "../modules/dom";
import { isObject, charLength, hasOwnProperty } from "../modules/utils";
import { preventDefault } from "../modules/event";
export default defineComponent({
  name: "Slider",
  mixins: [touchMixins],
  props: {
    value: [Number, Object],
    tip: Boolean,
    dragIcon: String,
    min: {
      type: [String, Number],
      default: 0,
    },
    max: {
      type: [String, Number],
      default: 100,
    },
    step: {
      type: [String, Number],
      default: 1,
    },
    parse: {
      type: Function,
      default: (e) => {
        return e;
      },
    },
  },
  data() {
    return {
      startLeft: 0,
      endLeft: 0,
      width: 0,
      dragging: false,
      disStep: 0,
      startValue: 0,
      endValue: 0,
      tipValueSize: 0,
    };
  },
  watch: {
    value: "updateValue",
  },
  computed: {
    maxVlue() {
      return Number(this.max) - Number(this.min);
    },
    startRoundValue() {
      return Math.round((Number(this.max) * this.startLeft) / this.width);
    },
    endRoundValue() {
      return Math.round((Number(this.max) * this.endLeft) / this.width);
    },
    startBarStyle() {
      const transition = this.dragging ? "none 0s ease 0s" : null;
      return {
        width: `${Math.round((100 * this.startLeft) / this.width)}%`,
        transition,
      };
    },
    endBarStyle() {
      const transition = this.dragging ? "none 0s ease 0s" : null;
      return {
        width: `${Math.round((100 * this.endLeft) / this.width)}%`,
        transition,
      };
    },
  },
  methods: {
    transformValueToDistance(value = 0) {
      return (this.width * value) / this.maxVlue;
    },
    transformDistanceToValue(distance = 0) {
      return Math.round((this.maxVlue * distance) / this.width);
    },
    getNearestDirection(real) {
      const right = this.endLeft - real;
      const left = real - this.startLeft;
      return Math.min(left, right) === right ? "end" : "start";
    },
    handleBarClick() {
      const that = this;
      this.bindEvent(this.$el, {
        stop(event) {
          preventDefault(event.e, true);
          if (event.e && event.e.changedTouches && event.e.changedTouches[0]) {
            const disX =
              event.e.changedTouches[0].clientX - getOffset(event.target).left;
            let real = Math.round(disX / that.disStep) * that.disStep;
            // 防止滑块超出范围
            if (real >= that.width) {
              real = that.width;
            } else if (real <= 0) {
              real = 0;
            }
            const value = that.transformDistanceToValue(real);
            if (isObject(that.value)) {
              if (value >= that.endValue) {
                that.endValue = value;
                that.endLeft = real;
              } else if (value <= that.startValue) {
                that.startValue = value;
                that.startLeft = real;
              } else if (value > that.startValue && value < that.endValue) {
                const direction = that.getNearestDirection(real);
                that[`${direction}Value`] = value;
                that[`${direction}Left`] = real;
              }
            } else {
              that.endValue = value;
              that.endLeft = real;
            }
            that.emit();
          }
        },
      });
    },
    set(value = 0) {
      this.$emit("input", value);
    },
    emit() {
      if (isObject(this.value)) {
        this.$emit("input", {
          start: this.startRoundValue,
          end: this.endRoundValue,
        });
      } else {
        this.$emit("input", this.endRoundValue);
      }
    },
    drag(type) {
      const el = this.$refs[`${type}Slider`];
      if (!el) {
        return;
      }
      const that = this;
      let barWidth = 0;
      const value = this.value;
      const width = this.$el.offsetWidth;
      let iValue;
      if (isObject(value)) {
        if (hasOwnProperty(value, "start") && hasOwnProperty(value, "end")) {
          iValue = this.value[type];
        } else {
          return;
        }
      } else {
        iValue = this.value;
      }
      that[`${type}Value`] = iValue;
      this.disStep =
        Math.round(width / (Number(this.max) - 1)) * Number(this.step);
      this.width = width;
      this[`${type}Left`] = this.transformValueToDistance(iValue);
      this.bindEvent(el, {
        start(event) {
          preventDefault(event.e, true);
          barWidth = that.$refs[`${type}SliderBar`].offsetWidth;
        },
        dragging(event) {
          preventDefault(event.e, true);
          that.dragging = true;
          that[`${type}Left`] =
            Math.round((barWidth + that.deltaX) / that.disStep) * that.disStep;
          if (that[`${type}Left`] >= that.width) {
            that[`${type}Left`] = that.width;
          }
          if (that[`${type}Left`] <= 0) {
            that[`${type}Left`] = 0;
          }
          if (isObject(that.value)) {
            if (type === "start") {
              if (that.startLeft >= that.endLeft) {
                that.startLeft = that.endLeft;
              }
            } else if (type === "end") {
              if (that.endLeft <= that.startLeft) {
                that.endLeft = that.startLeft;
              }
            }
          }
          that[`${type}Value`] = that[`${type}RoundValue`];
          that.emit();
        },
        stop(event) {
          preventDefault(event.e, true);
          that.dragging = false;
          that.emit();
        },
      });
    },
    genSider(h, type) {
      if (type === "start") {
        if (!isObject(this.value)) {
          return;
        }
      }
      const dragIcon = this.dragIcon
        ? h("img", { attrs: { src: this.dragIcon } }, [])
        : "";
      const tipValue = this.parse(this[`${type}Value`]);
      const tipValueSize = charLength(String(tipValue)) * 7;
      const slider = this.$refs[`${type}Slider`];
      const sliderOffsetWidth = (slider && slider.offsetWidth) || 0;
      let tip;
      if (this.tip) {
        tip = h(
          "div",
          {
            style: {
              width: `${tipValueSize}px`,
              left: `${(-1 * tipValueSize) / 2 + sliderOffsetWidth / 2 - 3}px`,
            },
            class: ["yn-slider-button-tip"],
          },
          [h("span", {}, [tipValue])]
        );
      }
      return h(
        "div",
        {
          ref: `${type}SliderBar`,
          class: ["yn-slider-bar", type],
          style: this[`${type}BarStyle`],
        },
        [
          h(
            "div",
            {
              ref: `${type}Slider`,
              class: ["yn-slider-button", this.dragIcon ? "drag-icon" : ""],
            },
            [dragIcon, tip]
          ),
        ]
      );
    },
    init() {
      this.drag("start");
      this.drag("end");
      this.handleBarClick();
    },
    updateValue(n) {
      if (n && !this.dragging) {
        this.unbindAllEvent();
        this.init();
      }
    },
  },
  mounted() {
    this.init();
  },
  render(h) {
    return h("div", { class: ["yn-slider"] }, [
      this.genSider(h, "start"),
      this.genSider(h, "end"),
    ]);
  },
});
