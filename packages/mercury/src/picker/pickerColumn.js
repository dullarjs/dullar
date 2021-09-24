/*
 * @Author: Just be free
 * @Date:   2020-03-31 18:40:12
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-24 18:32:10
 * @E-mail: justbefree@126.com
 */
import "./style/index";
import { defineComponent } from "../modules/component";
import { touchMixins } from "../mixins/touch";
import { getElementsTranslate } from "../modules/dom";
import { isObject } from "../modules/utils";
import { deepClone } from "../modules/utils/deepClone";
const range = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};
function isOptionDisabled(option) {
  return isObject(option) && option.disabled;
}
/**
当传的参数只有一个
并且是Number类型
并且Number的范围在0 到 2^32-1之间，
则会声明一个长度为所传参数长度的数组，并且数组的每个元素为空。 
当参入的参数大于一个或者参数为1个但是不是Number的合法范围内 则为数组
Array(1,2,3) => [1, 2, 3]
Array(1) => [empty]
Array(10) => [empty * 10]
**/

const polyfill = (arr = []) => {
  if (arr.length === 1 && typeof arr[0] === "number") {
    return [String(arr[0])];
  }
  return arr;
};
const DEFAULT_DURATION = 200;
const MOMENTUM_LIMIT_TIME = 300;
const MOMENTUM_LIMIT_DISTANCE = 15;
export default defineComponent({
  name: "PickerColumn",
  mixins: [touchMixins],
  props: {
    columns: {
      type: Array,
      default: () => {
        return [];
      },
    },
    defaultIndex: Number,
    itemHeight: {
      type: [String, Number],
      default: 44,
    },
    // visibleItemCount: {
    //   type: [String, Number],
    //   default: 6
    // },
    swipeDuration: {
      type: [String, Number],
      default: 1000,
    },
  },
  initPropsToData() {
    return [
      { key: "options", value: "columns", parse: deepClone },
      { key: "currentIndex", value: "defaultIndex" },
    ];
  },
  data() {
    return {
      duration: 0,
      offset: 0,
    };
  },
  computed: {
    baseOffset() {
      return (this.itemHeight * (this.count - 1)) / 2;
    },
    count() {
      return this.columns.length;
    },
  },
  methods: {
    setOptions(options) {
      if (JSON.stringify(options) !== JSON.stringify(this.options)) {
        this.options = deepClone(options);
        this.setIndex(this.defaultIndex);
      }
    },
    getSelectedItem() {
      return this.options[this.currentIndex];
    },
    getIndexByOffset(offset) {
      return range(Math.round(-offset / this.itemHeight), 0, this.count - 1);
    },
    momentum(distance, duration) {
      const speed = Math.abs(distance / duration);
      distance = this.offset + (speed / 0.003) * (distance < 0 ? -1 : 1);
      const index = this.getIndexByOffset(distance);
      this.duration = +this.swipeDuration;
      this.setIndex(index, true);
    },
    adjustIndex(index) {
      index = range(index, 0, this.count);

      for (let i = index; i < this.count; i++) {
        if (!isOptionDisabled(this.options[i])) return i;
      }

      for (let i = index - 1; i >= 0; i--) {
        if (!isOptionDisabled(this.options[i])) return i;
      }
    },
    setIndex(index, emitChange) {
      index = this.adjustIndex(index) || 0;
      const offset = -index * this.itemHeight;
      const trigger = () => {
        if (index !== this.currentIndex) {
          this.currentIndex = index;
          if (emitChange) {
            this.$emit("change", this.options[index], index);
          }
        }
      };
      // trigger the change event after transitionend when moving
      if (this.moving && offset !== this.offset) {
        this.transitionEndTrigger = trigger;
      } else {
        trigger();
      }
      this.offset = offset;
    },
    stopMomentum() {
      this.moving = false;
      this.duration = 0;
      if (this.transitionEndTrigger) {
        this.transitionEndTrigger();
        this.transitionEndTrigger = null;
      }
    },
    drag() {
      const el = this.$refs.pickerColumn;
      if (!el) {
        return;
      }
      const that = this;
      this.bindEvent(el, {
        start() {
          if (that.moving) {
            const translateY = getElementsTranslate(that.$refs.wrapper).y;
            that.offset = Math.min(0, translateY - that.baseOffset);
            that.startOffset = that.offset;
          } else {
            that.startOffset = that.offset;
          }
          that.duration = 0;
          that.transitionEndTrigger = null;
          that.touchStartTime = Date.now();
          that.momentumOffset = that.startOffset;
        },
        dragging() {
          if (that.direction === "vertical") {
            that.moving = true;
            // preventDefault(event.e, true);
          }

          that.offset = range(
            that.startOffset + that.deltaY,
            -(that.count * that.itemHeight),
            that.itemHeight
          );
          const now = Date.now();
          if (now - that.touchStartTime > MOMENTUM_LIMIT_TIME) {
            that.touchStartTime = now;
            that.momentumOffset = that.offset;
          }
        },
        stop() {
          const distance = that.offset - that.momentumOffset;
          const duration = Date.now() - that.touchStartTime;
          const allowMomentum =
            duration < MOMENTUM_LIMIT_TIME &&
            Math.abs(distance) > MOMENTUM_LIMIT_DISTANCE;
          if (allowMomentum) {
            that.momentum(distance, duration);
            return;
          }

          const index = that.getIndexByOffset(that.offset);
          that.duration = DEFAULT_DURATION;
          that.setIndex(index, true);

          // compatible with desktop scenario
          // use setTimeout to skip the click event triggered after touchstart
          setTimeout(() => {
            that.moving = false;
          }, 0);
        },
      });
    },
    onTransitionEnd() {
      this.stopMomentum();
    },
    handleItemClick(index) {
      if (this.moving) {
        return;
      }
      this.duration = DEFAULT_DURATION;
      this.setIndex(index, true);
    },
  },
  watch: {
    defaultIndex(val) {
      this.setIndex(val);
    },
    columns: "setOptions",
  },
  created() {
    this.setIndex(this.currentIndex);
  },
  mounted() {
    this.drag();
  },
  render(h) {
    const style = {
      transform: `translate3d(0, ${this.offset + this.baseOffset}px, 0)`,
      transitionDuration: `${this.duration}ms`,
      transitionProperty: this.duration ? "all" : "none",
      lineHeight: `${this.itemHeight}px`,
    };
    return h("div", { class: "yn-picker-column", ref: "pickerColumn" }, [
      h(
        "ul",
        { style, ref: "wrapper", on: { transitionend: this.onTransitionEnd } },
        Array.apply(null, polyfill(this.columns)).map((column, key) => {
          const isObj = isObject(column);
          const text = isObj ? column.value : column;
          return h(
            "li",
            {
              class: [isObj && column.disabled ? "disabled" : ""],
              on: { click: this.handleItemClick.bind(this, key) },
              key,
            },
            text
          );
        })
      ),
    ]);
  },
});
