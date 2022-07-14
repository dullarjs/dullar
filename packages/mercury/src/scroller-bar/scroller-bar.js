/*
 * @Author: yegl
 * @Date: 2022-01-20 16:25:59
 * @Last Modified by: yegl
 * @Last Modified time: 2022-07-14 18:24:48
 * @E-mail: yglgzyx@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import { slotsMixins } from "../mixins/slots";
export default defineComponent({
  name: "ScrollerBar",
  props: {
    inputNodeInfo: {
      default: null,
    },
    width: {
      type: [Number, String],
      default: "",
    },
    suggestions: Array,
    scrollerBarVisible: Boolean,
    loading: Boolean,
    isSelected: {
      type: Boolean,
      default: false,
    },
    scrollerBarTop: {
      type: Number,
      default: 0,
    },
  },
  mixins: [slotsMixins],
  data() {
    return {
      scrollTop: 0,
      scrollWidht: 0,
      toScreenBottom: 0,
      top: 0,
    };
  },
  watch: {
    inputNodeInfo: "onInputHandleChange",
  },
  updated() {
    this.onVisibleChange();
  },
  methods: {
    onInputHandleChange() {
      const {
        height: inputHeight,
        width: inputWidth,
        bottom,
        top,
      } = this.inputNodeInfo || {};
      this.scrollTop = inputHeight + 12;
      this.scrollWidht = inputWidth;
      this.toScreenBottom = window.innerHeight - bottom;
      this.top = top;
    },
    onVisibleChange() {
      const { scrollerBarVisible } = this;
      if (scrollerBarVisible === true) {
        this.$nextTick(() => {
          const { bottom = 0, height = 0 } = this.inputNodeInfo;
          const toScreenBottom = window.innerHeight - bottom;
          const { $el: _el } = this;
          if (toScreenBottom < _el.clientHeight + height + 16) {
            this.scrollTop = -_el.clientHeight - 12;
          } else {
            this.scrollTop = this.scrollerBarTop
              ? this.scrollerBarTop
              : height + 12;
          }
        });
      }
    },
    handleSelect(item) {
      this.$emit("handleSelect", { ...item });
    },
    getSlots(item) {
      let node = item.value;
      if (this.$scopedSlots.customize) {
        node = this.slots("customize", { ...item });
      }
      return node;
    },
    getContentList(isSelected, h) {
      if (isSelected) {
        const _slots = this.slots("default") || "暂无数据";
        return _slots;
      } else {
        return Array.apply(null, this.suggestions).map((item) => {
          return h(
            "li",
            {
              class: "yn-autocomplete-item",
              on: {
                click: () => {
                  return this.handleSelect(item);
                },
              },
            },
            [this.getSlots(item)]
          );
        });
      }
    },
  },
  render(h) {
    const { scrollWidht, scrollTop, loading, isSelected, width } = this;
    const _width = width === "auto" ? "100%" : scrollWidht + "px";
    const _list = this.getContentList(isSelected, h);
    return h(
      "div",
      {
        class: "yn-scroller-bar",
        style: {
          width: _width,
          top: scrollTop + "px",
        },
      },
      [
        h("ul", { class: "yn-scroll-list" }, [
          !loading
            ? _list
            : h(
                genComponentName("spin"),
                {
                  props: {
                    type: "rotate",
                    size: 12,
                  },
                },
                []
              ),
        ]),
      ]
    );
  },
});
