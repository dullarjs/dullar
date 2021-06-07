/*
* @Author: Just be free
* @Date:   2020-11-25 14:12:12
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-07 16:38:00
* @E-mail: justbefree@126.com
*/
import Queen, { mixins, prop, Options } from "../component/Queen";
import { loadImageAsync } from "../utils/lazyload";
import { h } from "vue";
class Props {}
@Options({
  name: "QSwipeItem",
  inject: ["swipeParent"]
})
export default class QSwipeItem extends mixins(Queen).with(Props) {
  public static componentName = "QSwipeItem";
  public loaded = false;
  mounted() {
    const $el = this.$refs.swipeItem as HTMLElement;
    if (!$el) {
      return;
    }
    const imgs = $el.getElementsByTagName("img");
    const imgDOMs = Array.from(imgs);
    if (imgDOMs.length > 0) {
      loadImageAsync(imgDOMs).then(() => {
        this.loaded = true;
      }).catch(err => {
        console.error("There was an error while loading image:", err);
      });
    } else {
      this.loaded = true;
    }
  }
  render() {
    const { vertical, width, height, loadingText } = this.swipeParent;
    return h(
      "div",
      {
        ref: "swipeItem",
        style: { width: `${width}px`, height: `${height}px` },
        class: [
          "q-swipe-item",
          this.loaded ? "loaded" : "loading",
          vertical ? "vertical" : "horizontal"
        ]
      },
      {
        default: () => [
          this.getSlots(),
          (!this.loaded) && h("div", { class: ["loading-mask"], style: { lineHeight: `${height}px` } }, { default: () => loadingText })
        ]
      }
    );
  }
}