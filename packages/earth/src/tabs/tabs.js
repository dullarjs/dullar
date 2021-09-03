/*
 * @Author: Just be free
 * @Date:   2020-04-21 14:19:49
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-05-27 19:44:18
 * @E-mail: justbefree@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
const VALID_CHILD_COMPONENT = "tab-item";
import { slotsMixins } from "../mixins/slots";
import { provideMixins } from "../mixins/provide";
import Flex from "../flex";
import FlexItem from "../flex-item";
export default defineComponent({
  name: "Tabs",
  components: { Flex, FlexItem },
  mixins: [slotsMixins, provideMixins()],
  props: {
    value: [Number, String],
  },
  initPropsToData() {
    return [{ key: "currentTab", value: "value" }];
  },
  methods: {
    getTitles(slots = []) {
      const tabs = [];
      slots.forEach((slot, index) => {
        const { title, disabled } = slot.componentOptions.propsData;
        tabs.push({ value: title, disabled, index: index + 1 });
      });
      return tabs;
    },
    handleTabClick(tab) {
      this.$emit("click", tab);
      if (tab.disabled) {
        return false;
      }
      if (this.currentTab !== tab.index) {
        this.$emit("change", tab);
      }
      this.currentTab = tab.index;
    },
    getStatus(tab) {
      if (tab.disabled) {
        return "disabled";
      }
      if (tab.index === this.currentTab) {
        return "active";
      }
      return "";
    },
  },
  render(h) {
    const prefix = this.VUE_APP_PREFIX;
    let validChildComponent = VALID_CHILD_COMPONENT;
    if (prefix !== "") {
      validChildComponent = `${prefix}-${VALID_CHILD_COMPONENT}`;
    }
    const slots = this.slots("default", {}, validChildComponent);
    const tabTitles = this.getTitles(slots);
    const flex = tabTitles.length > 4 ? "0 0 22%" : 1;
    return h("div", { class: ["yn-tabs"] }, [
      h("div", { class: ["yn-tabs-nav"] }, [
        h(
          genComponentName("flex"),
          { style: { overflowX: "auto", userSelect: "none" } },
          Array.apply(null, tabTitles).map((tab) => {
            return h(
              genComponentName("flex-item"),
              {
                style: { textAlign: "center" },
                props: { flex },
                on: { click: this.handleTabClick.bind(this, tab) },
                key: tab.index,
              },
              [
                h(
                  "span",
                  { class: ["yn-tab-text", this.getStatus(tab)] },
                  tab.value
                ),
              ]
            );
          })
        ),
      ]),
      h("div", { class: ["yn-tabs-content"] }, slots),
    ]);
  },
});
