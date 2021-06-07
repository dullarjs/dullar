/*
* @Author: Just be free
* @Date:   2020-11-10 10:41:55
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-07 16:38:32
* @E-mail: justbefree@126.com
*/
import Queen, { mixins, prop, Options } from "../component/Queen";
import { h, VNode } from "vue";
import QFlex from "../flex";
import QFlexItem from "../flex-item";
const VALID_CHILD_COMPONENT = "QTabItem";
export interface Tab {
  value: string;
  disabled: boolean|undefined;
  index: number;
  name: string;
}
class Props {
  modelValue!: string|number
}
@Options({
  name: "QTabs",
  emits: ["click", "change"],
  provide() {
    return {
      parentTab: this
    }
  }
})
export default class QTabs extends mixins(Queen).with(Props) {
  public static componentName = "QTabs";
  public currentTab = this.modelValue;
  getTitles(slots: VNode[] = []): Tab[] {
    const tabs: Tab[] = [];
    slots.forEach((slot: any, index: number) => {
      const { title, disabled, name } = slot.props;
      tabs.push({ value: title, disabled, index, name });
    });
    return tabs;
  }
  handleTabClick(tab: Tab): void {
    this.$emit("click", tab);
    if (tab.disabled) {
      return;
    }
    if (this.currentTab !== tab.name) {
      this.$emit("change", tab);
    }
    this.currentTab = tab.name;
  }
  getStatus(tab: Tab): string {
    if (tab.disabled) {
      return "disabled";
    }
    if (tab.name === this.currentTab) {
      return "active";
    }
    return "";
  }
  render() {
    const slots = this.getCustomSlotsByTagName(VALID_CHILD_COMPONENT);
    const tabTitles = this.getTitles(slots);
    const flex = tabTitles.length > 4 ? "0 0 22%" : 1;
    return h("div", { class: ["q-tabs"] }, [
      h("div", { class: ["q-tabs-nav"] }, [
        h(QFlex,
          { style: { overflowX: "auto", userSelect: "none" } },
          {
            default: () => Array.apply(null, tabTitles).map((tab: any, index: number, arr: any[]) => {
              return h(QFlexItem,
                {
                  style: { textAlign: "center" },
                  flex,
                  onClick: this.handleTabClick.bind(this, tab),
                  key: tab.name
                },
                {
                  default: () => [
                    h(
                      "span",
                      { class: ["q-tab-text", this.getStatus(tab)] },
                      { default: () => tab.value }
                    )
                  ]
                }
              );
            })
          }
        )
      ]),
      h("div", { class: ["q-tabs-content"] }, { default: () => slots })
    ]);
  }
}
