/*
 * @Author: Just be free
 * @Date:   2020-04-02 15:11:27
 * @Last Modified by:   Just be free
 * @Last Modified time: 2022-02-22 18:33:38
 * @E-mail: justbefree@126.com
 */

import { defineComponent, genComponentName } from "../modules/component";
import { provideMixins } from "../mixins/provide";
const VALID_CHILD_COMPONENT = "dropdown-menu-item";
import Flex from "../flex";
import FlexItem from "../flex-item";
import { slotsMixins } from "../mixins/slots";
import Iconfont from "../iconfont";
export default defineComponent({
  name: "DropdownMenu",
  mixins: [slotsMixins, provideMixins()],
  components: { Flex, FlexItem, Iconfont },
  props: {
    direction: {
      type: String,
      default: "down",
    },
  },
  data() {
    return {
      currentTab: "",
      currentTabStauts: true,
      tabs: {},
      tabsIcon: {},
    };
  },
  methods: {
    validChildComponent() {
      const prefix = this.VUE_APP_PREFIX;
      let validChildComponent = VALID_CHILD_COMPONENT;
      if (prefix !== "") {
        validChildComponent = `${prefix}-${VALID_CHILD_COMPONENT}`;
      }
      const children = this.slots();
      const validComponent = [];
      let key = 0;
      children &&
        children.forEach((child) => {
          if (
            child.componentOptions &&
            validChildComponent === child.componentOptions.tag
          ) {
            child.key = key;
            validComponent.push(child);
            key++;
          }
        });
      return validComponent;
    },
    switchTo(key) {
      const slots = this.validChildComponent();
      if (key > -1) {
        this.currentTab = key;
        this.tabs = {
          ...this.tabs,
          [key]: slots[key].componentInstance.getStatus(),
        };
      }
    },
    switchTab(key, status) {
      this.currentTab = key;
      this.tabs = {
        ...this.tabs,
        [key]: status,
      };
    },
    setCollapsedIconStatus(key, status) {
      this.tabsIcon = {
        ...this.tabsIcon,
        [key]: status,
      };
    },
    slideUp(flag = false) {
      this.currentTabStauts = flag;
      this.tabs = {
        ...this.tabs,
        [this.currentTab]: flag,
      };
    },
    handleTabSwitch(args) {
      const { item, key, slots } = args;
      const instance = item.componentInstance;
      const hasOptions = instance.hasOptions();
      const { currentTab } = this;
      const currentTabStauts = {};
      instance.toggle();
      if (currentTab !== "") {
        const status = slots[currentTab].componentInstance.getStatus();
        currentTabStauts[currentTab] = status;
      }
      this.tabs = {
        ...this.tabs,
        ...currentTabStauts,
        [key]: instance.getStatus(),
      };
      this.currentTabStauts = instance.getStatus();
      if (currentTab !== key && currentTab !== "") {
        if (hasOptions) {
          slots[currentTab].componentInstance.close(this.tabs[currentTab]);
        } else {
          if (slots[currentTab].componentInstance.hasOptions()) {
            slots[currentTab].componentInstance.close(this.tabs[currentTab]);
          }
        }
      }
      this.currentTab = key;
    },
    createMenu(h, slots) {
      return h("div", { class: ["yn-dropdown-menu-bar"] }, [
        h(
          genComponentName("flex"),
          { props: { justifyContent: "spaceBetween" } },
          Array.apply(null, slots).map((item, key) => {
            item.componentOptions.propsData.direction = this.direction;
            item.componentOptions.propsData.index = key;
            const mapStatus = item.componentOptions.propsData.mapStatus || {};
            const mapOption = item.componentOptions.propsData.mapOption || [];
            // const fixed = item.componentOptions.propsData.fixed || false;
            const active = this.tabs[key];
            const text = item.data.model.value;
            const { append } = item.componentOptions.propsData;
            let label = h("span", {}, text);
            if (append && typeof append === "function") {
              label = h("div", { class: "yn-dropdown-menu-bar-label" }, [
                h("div", { class: "label-container" }, [
                  append(h, active, item),
                  h("div", { class: "label-container__text" }, text),
                ]),
              ]);
            }
            const down = this.tabsIcon[key];
            const directionIcon =
              item.componentOptions.propsData.hideDirectionIcon || false;
            const showDirectionIcon =
              !(Object.keys(mapStatus).length > 0) &&
              !(mapOption.length > 0) &&
              !directionIcon &&
              !append;
            // const active = this.currentTab === key;
            // let active = false;
            // if (showDirectionIcon) {
            //   active = this.currentTab === key && this.currentTabStauts;
            // } else {
            //   if (fixed) {
            //     active = this.tabs[key];
            //   } else {
            //     active = this.currentTab === key && this.currentTabStauts;
            //   }
            // }
            return h(
              genComponentName("flex-item"),
              {
                class: ["menu-bar-item", active ? "active" : ""],
                on: {
                  click: this.handleTabSwitch.bind(this, { item, key, slots }),
                },
                props: { flex: 1 },
                key,
              },
              [
                label,
                h(
                  genComponentName("iconfont"),
                  {
                    directives: [{ name: "show", value: showDirectionIcon }],
                    class: ["dropdown-icon"],
                    props: {
                      size: 8,
                      name: `cpllapsed-expand-${active ? "active" : "default"}`,
                      rotate: down ? 180 : 0,
                    },
                  },
                  []
                ),
              ]
            );
          })
        ),
      ]);
    },
    closeTab() {
      this.tabs = { ...this.tabs, [this.currentTab]: false };
    },
  },
  render(h) {
    const slots = this.validChildComponent();
    return h("div", { class: ["yn-dropdown-menu"] }, [
      this.createMenu(h, slots),
      slots,
    ]);
  },
});
