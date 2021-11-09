/*
 * @Author: Just be free
 * @Date:   2020-04-09 09:25:23
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-11-09 09:26:46
 * @E-mail: justbefree@126.com
 */
import { defineComponent } from "../modules/component";
import { slotsMixins } from "../mixins/slots";
import { injectMixins } from "../mixins/inject";
import { loadImageAsync } from "../modules/utils/lazyLoad";

export default defineComponent({
  name: "SwipeItem",
  mixins: [slotsMixins, injectMixins("parent", { indexKey: "indexKey" })],
  props: {
    resource: String,
  },
  data() {
    return {
      loaded: false,
      actualHeight: "",
    };
  },
  created() {
    if (!this.resource) {
      this.loaded = true;
      return;
    }
    loadImageAsync([this.resource])
      .then((e) => {
        const { width } = this.parent;
        const l = e[0].naturalWidth / e[0].naturalHeight;
        this.actualHeight = width / l;
        this.$refs.swipeItem.parentNode.style.height = `${width / l}px`;
        this.loaded = true;
      })
      .catch((err) => {
        console.log(err);
        this.loaded = true;
      });
  },
  render(h) {
    const { vertical, width, height } = this.parent;
    const actualHeight = this.actualHeight || height;
    return h(
      "div",
      {
        ref: "swipeItem",
        style: { width: `${width}px`, height: `${actualHeight}px` },
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
