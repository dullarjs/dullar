/*
* @Author: Just be free
* @Date:   2020-11-19 17:53:44
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-11 15:08:04
* @E-mail: justbefree@126.com
*/
import Queen, { mixins, prop, Options } from "../component/Queen";
import { h, VNode } from "vue";
import QFlex from "../flex";
import QFlexItem from "../flex-item";
// const VALID_CHILD_COMPONENT = "animation-list-item";

class Props {
  dataList = prop<Array<any>>({ default: () => [] })
  animation = prop<boolean>({ default: true })
}
@Options({
  name: "QAnimationList",
  provide() {
    return {
      parentList: this
    }
  },
  watch: {
    // dataList: function (newValue, oldValue) {
    dataList: function () {
      this.$nextTick(() => {
        this.init();
      });
    }
  }
})
export default class QAnimationList extends mixins(Queen).with(Props) {
  public static componentName = "QAnimationList";
  public stackList: VNode[] = [];
  infinite(slots: VNode[]) {
    if (slots.length > 0) {
      const slot = slots.shift();
      this.stackList.push(slot as VNode);
      const timer = setTimeout(() => {
        this.infinite(slots);
        clearTimeout(timer);
      }, 50);
    }
  }
  init() {
    this.stackList = [] as VNode[];
    const slots = this.getSlots() as any;
    const children = slots && slots[0] && slots[0].children;
    if (this.animation) {
      this.infinite(children as VNode[]);
    } else {
      this.stackList = slots;
    }
  }
  mounted() {
    this.init();
  }
  render() {
    return h("div", { class: ["q-animation-list"] }, {
      default: () => [
        h(QFlex,
          { flexDirection: "column" },
          {
            default: () => Array.apply(null, this.stackList).map((item: any, key: number, arr: any[]) => {
              return h(QFlexItem, { key }, { default: () => [item] });
            })
          }
        )
      ]
    });
  }
}
