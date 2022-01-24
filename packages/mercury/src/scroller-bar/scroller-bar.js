/*
 * @Author: yegl
 * @Date: 2022-01-20 16:25:59
 * @Last Modified by: yegl
 * @Last Modified time: 2022-01-24 19:28:06
 * @E-mail: yglgzyx@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
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
    loading: Boolean,
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
      const { toScreenBottom, top, scrollerBarVisible, inputNodeInfo } = this;
      if (scrollerBarVisible === true) {
        this.$nextTick(() => {
          const { $el: _el } = this;
          if (toScreenBottom < _el.clientHeight && top > _el.clientHeight) {
            this.scrollTop = -_el.clientHeight - 12;
          } else {
            this.scrollTop = inputNodeInfo.height + 12;
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
    const { scrollWidht, scrollTop, suggestions, loading } = this;
    return h(
      "div",
      {
        class: "yn-scroller-bar",
        style: { width: scrollWidht + "px", top: scrollTop + "px" },
      },
      [
        h("ul", { class: "yn-scroll-list" }, [
          !loading
            ? Array.apply(null, suggestions).map((item) => {
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
              })
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
