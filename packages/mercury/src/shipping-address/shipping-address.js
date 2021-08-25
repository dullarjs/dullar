/*
 * @Author: Just be free
 * @Date:   2021-07-27 13:32:18
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-08-25 18:56:07
 * @E-mail: justbefree@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import Spin from "../spin";
export default defineComponent({
  name: "ShippingAddress",
  components: { Spin },
  props: {
    staticAddress: Array,
    label: {
      type: String,
      default: "请选择",
    },
    address: {
      type: Object,
      default: () => {
        return {
          params: {},
          action: () => {
            return Promise.resolve();
          },
          parse: (e) => {
            return e;
          },
        };
      },
    },
  },
  data() {
    return {
      currentTab: 0,
      isLoading: false,
      regionList: [],
      CACHE: [],
      CACHE_1: {},
      CACHE_2: {},
      CACHE_3: {},
      CACHE_4: {},
    };
  },
  initPropsToData() {
    return [{ key: "regionHeaders", value: "staticAddress" }];
  },
  methods: {
    handleSwitchTab(tab, index) {
      this.currentTab = index;
      // tab页签切换的时候，小于要清除后面的label
      if (index === 0) {
        this.regionList = this.CACHE;
      } else {
        const tempList = this[`CACHE_${index}`][tab.parent_id];
        if (tempList && Array.isArray(tempList)) {
          this.regionList = this[`CACHE_${index}`][tab.parent_id];
        } else {
          this.requestAddress(tab, tab);
        }
      }
    },
    setCache(region, res) {
      if (this.currentTab === 0) {
        this.CACHE = res;
      } else {
        if (!this[`CACHE_${region.region_type}`][region.region_id]) {
          this[`CACHE_${region.region_type}`][region.region_id] = res;
        }
      }
    },
    replaceItem(type, option) {
      if (type === 1) {
        this.regionHeaders = [];
        this.regionHeaders.push(option);
        this.regionHeaders.push(this.label);
      } else {
        // this.regionHeaders.splice(this.regionHeaders.length - 1, 0, option);
        const length = this.regionHeaders.length;
        this.regionHeaders.splice(type - 1, length, option);
        if (this.regionList.length > 0) {
          this.regionHeaders.push(this.label);
        }
      }
    },
    updateRegionList(option) {
      const type = parseInt(option.region_type);
      const length = this.regionHeaders.length;
      this.regionHeaders.splice(type - 1, length, option);
      if (this.regionList.length > 0) {
        this.regionHeaders.push(this.label);
      }
      const tempList = this[`CACHE_${option.region_type}`][option.region_id];
      if (Array.isArray(tempList) && tempList.length > 0) {
        this.regionList = tempList;
      } else {
        this.requestAddress(option, option);
      }
    },
    handleItemClick(option) {
      const regionType = parseInt(option.region_type);
      const currentRegion = this.regionHeaders[regionType - 1];
      if (this.address.parse(currentRegion) === this.address.parse(option)) {
        return;
      }
      this.currentTab = regionType;
      this.updateRegionList(option);
      // this.replaceItem(regionType, option);
      // this.requestAddress({ regionType: regionType, regionId: option.region_id }, option, "item");
    },
    requestAddress(args, region) {
      this.isLoading = true;
      // const { regionType } = args;
      const params = { ...this.address.params, ...args };
      const promise = this.address.action(params);
      promise
        .then((res) => {
          this.isLoading = false;
          this.regionList = res;
          this.setCache(region, res);
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
  },
  mounted() {
    this.requestAddress(
      { region_type: "1", region_id: "10" },
      this.regionHeaders[0]
    );
  },
  render(h) {
    return h("div", { class: ["yn-shipping-address"] }, [
      h("div", { class: ["address-selection"] }, [
        h("ul", {}, [
          Array.apply(null, this.regionHeaders).map((attr, index) => {
            return h(
              "li",
              {
                attrs: {
                  "data-id": attr.region_id,
                  "data-parent-id": attr.parent_id,
                },
                class: [index !== 0 && this[attr] === "" ? "hide" : ""],
              },
              [
                h(
                  "span",
                  {
                    class: ["label", this.currentTab === index ? "active" : ""],
                    on: {
                      click: this.handleSwitchTab.bind(this, attr, index),
                    },
                  },
                  [this.address.parse(attr)]
                ),
                h(
                  "div",
                  {
                    class: [
                      "result",
                      this.currentTab === index ? "" : "hide",
                      this.isLoading ? "loading" : "",
                    ],
                  },
                  [
                    this.isLoading
                      ? h(
                          genComponentName("spin"),
                          {
                            class: ["shipping-address-loading"],
                            props: { type: "rotate-svg", size: 40 },
                          },
                          []
                        )
                      : Array.apply(null, this.regionList).map(
                          (option, key) => {
                            return h(
                              "span",
                              {
                                attrs: {
                                  "data-id": option.region_id,
                                  "data-parent-id": option.parent_id,
                                },
                                class: ["option"],
                                key,
                                on: {
                                  click: this.handleItemClick.bind(
                                    this,
                                    option
                                  ),
                                },
                              },
                              [this.address.parse(option)]
                            );
                          }
                        ),
                  ]
                ),
              ]
            );
          }),
        ]),
      ]),
    ]);
  },
});
