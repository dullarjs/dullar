/*
 * @Author: Just be free
 * @Date:   2020-04-09 09:25:23
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-24 18:33:07
 * @E-mail: justbefree@126.com
 */
import "./style/index";
import { defineComponent } from "../modules/component";
import { slotsMixins } from "../mixins/slots";
import { injectMixins } from "../mixins/inject";
import { loadImageAsync } from "../modules/utils/lazyLoad";

export default defineComponent({
  name: "SwipeItem",
  mixins: [slotsMixins, injectMixins("parent", { indexKey: "indexKey" })],
  data() {
    return {
      loaded: false,
    };
  },
  methods: {
    getImgs() {
      const slots = this.slots();
      if (slots.length > 0) {
        const slot = slots[0];
        if (slot.tag === "img") {
          return slot.elm;
        } else {
          // HTMLCollection 类型非数组类型，需转换成数组
          if (slot.elm) {
            return Array.from(slot.elm.getElementsByTagName("img"));
          } else {
            return [];
          }
        }
      } else {
        return [];
      }
    },
  },
  mounted() {
    loadImageAsync(this.getImgs())
      .then(() => {
        this.loaded = true;
      })
      .catch(() => {
        this.loaded = true;
      });
  },
  render(h) {
    const { vertical, width, height } = this.parent;
    return h(
      "div",
      {
        style: { width: `${width}px`, height: `${height}px` },
        class: [
          "yn-swipe-item",
          this.loaded ? "loaded" : "loading",
          vertical ? "vertical" : "horizontal",
        ],
      },
      this.loaded ? this.slots() : []
    );
  },
});
