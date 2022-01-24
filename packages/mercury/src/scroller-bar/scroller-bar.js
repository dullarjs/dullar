/*
 * @Author: yegl
 * @Date: 2022-01-20 16:25:59
 * @Last Modified by: yegl
 * @Last Modified time: 2022-01-24 15:46:12
 * @E-mail: yglgzyx@126.com
 */
import { defineComponent } from "../modules/component";
import { slotsMixins } from "../mixins/slots";
export default defineComponent({
  name: "ScrollerBar",
  props: {
    inputNodeInfo: {
      type: DOMRect,
      default: null,
    },
    suggestions: Array,
    scrollerBarVisible: Boolean,
  },
  mixins: [slotsMixins],
  mounted() {
    console.log(this);
  },
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
    scrollerBarVisible: "onVisibleChange",
    suggestions: "onVisibleChange",
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
      this.onVisibleChange();
    },
    onVisibleChange() {
      const { toScreenBottom, top, $el: _el, scrollerBarVisible } = this;
      if (scrollerBarVisible === true) {
        this.$nextTick(() => {
          if (toScreenBottom < _el.clientHeight && top > _el.clientHeight) {
            this.scrollTop = -_el.clientHeight - 12;
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
  },
  render(h) {
    const { scrollWidht, scrollTop, suggestions } = this;
    return h(
      "div",
      {
        class: "yn-scroller-bar",
        style: { width: scrollWidht + "px", top: scrollTop + "px" },
      },
      [
        h("ul", { class: "yn-scroll-list" }, [
          Array.apply(null, suggestions).map((item) => {
            return h(
              "li",
              {
                on: {
                  click: () => {
                    return this.handleSelect(item);
                  },
                },
              },
              [this.getSlots(item)]
            );
          }),
        ]),
      ]
    );
  },
});
