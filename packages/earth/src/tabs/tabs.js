/*
 * @Author: Just be free
 * @Date:   2020-04-21 14:19:49
 * @Last Modified by:   Just be free
 * @Last Modified time: 2022-09-05 10:41:32
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
    border: {
      type: Boolean,
      default: true,
    },
    fixedWidth: Number,
    alignContent: String,
    justifyContent: String,
    alignItems: String,
    fontSize: {
      type: Number,
      default: 14
    },
  },
  initPropsToData() {
    return [{ key: "currentTab", value: "value" }];
  },
  methods: {
    getTitles(slots = []) {
      const tabs = [];
      slots.forEach((slot, index) => {
        const { title, disabled, fixedWidth } = slot.componentOptions.propsData;
        tabs.push({ value: title, disabled, index: index + 1, width: fixedWidth });
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
    const { alignContent, alignItems, justifyContent, fontSize, border } = this;
    return h("div", { class: ["yn-tabs"] }, [
      h("div", { class: ["yn-tabs-nav"] }, [
        h(
          genComponentName("flex"),
          {
            props: { alignContent, justifyContent, alignItems },
            style: { overflowX: "auto", userSelect: "none" },
            class: ["yn-tabs-nav-flex"]
          },
          Array.apply(null, tabTitles).map((tab) => {
            const width = tab.width > 0 ? tab.width : this.fixedWidth;
            return h(
              genComponentName("flex-item"),
              {
                class: ["yn-tabs-nav-flex-item", border ? "bottom-line" : ""],
                style: { textAlign: "center", width: `${width}px` },
                props: { flex: width > 0 ? undefined : flex },
                on: { click: this.handleTabClick.bind(this, tab) },
                key: tab.index,
              },
              [
                h(
                  "span",
                  {
                    style: { fontSize: `${fontSize}px` },
                    class: ["yn-tab-text", this.getStatus(tab)] },
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
