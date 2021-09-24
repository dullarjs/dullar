/*
 * @Author: Just be free
 * @Date:   2021-07-27 13:32:18
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-24 18:32:33
 * @E-mail: justbefree@126.com
 */
import "./style/index";
import { defineComponent, genComponentName } from "../modules/component";
import Spin from "../spin";
export default defineComponent({
  name: "ShippingAddress",
  components: { Spin },
  props: {
    staticAddress: Array,
    attributeMapping: {
      type: Object,
      default: () => {
        return {
          id: "id",
          type: "type",
          parentId: "parentId"
        };
      }
    },
    defaultParams: {
      type: Object,
      default: {}
    },
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
      CACHE: {}
    };
  },
  initPropsToData() {
    return [{ key: "regionHeaders", value: "staticAddress" }];
  },
  methods: {
    handleSwitchTab(tab, index) {
      this.currentTab = index;
      const tempList = this.CACHE[tab[this.attributeMapping["id"]]];
      if (tempList && Array.isArray(tempList)) {
        this.regionList = this.CACHE[tab[this.attributeMapping["id"]]];
      } else {
        this.requestAddress(tab, tab);
      }
    },
    setCache(region, res) {
      if (!this.CACHE[region[this.attributeMapping["id"]]]) {
        this.CACHE[region[this.attributeMapping["id"]]] = res;
      }
    },
    updateRegionList(option) {
      const type = parseInt(option[this.attributeMapping["type"]]);
      const length = this.regionHeaders.length;
      this.regionHeaders.splice(type - 1, length, option);
      if (this.regionList.length > 0) {
        this.regionHeaders.push(this.label);
      }
      const tempList = this.CACHE[option[this.attributeMapping["id"]]];
      if (Array.isArray(tempList) && tempList.length > 0) {
        this.regionList = tempList;
      } else {
        this.requestAddress(option);
      }
    },
    handleItemClick(option) {
      const regionType = parseInt(option[this.attributeMapping["type"]]);
      const currentRegion = this.regionHeaders[regionType - 1];
      if (this.address.parse(currentRegion) === this.address.parse(option)) {
        return;
      }
      this.currentTab = regionType;
      this.updateRegionList(option);
    },
    requestAddress(args) {
      this.isLoading = true;
      const params = { ...this.address.params, ...args };
      const promise = this.address.action(params);
      promise
        .then((res) => {
          this.isLoading = false;
          this.regionList = res;
          if (res.length === 0) {
            this.$emit("done", this.regionHeaders);
          }
          this.setCache(args, res);
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
  },
  created() {
    this.requestAddress(this.defaultParams);
  },
  render(h) {
    return h("div", { class: ["yn-shipping-address"], ref: "container" }, [
      h("div", { class: ["address-selection"] }, [
        h("ul", {}, [
          Array.apply(null, this.regionHeaders).map((attr, index) => {
            return h(
              "li",
              {
                attrs: {
                  "data-id": attr[this.attributeMapping["id"]],
                  "data-parent-id": attr[this.attributeMapping["parentId"]],
                },
                class: [index !== 0 && this[attr] === "" ? "hide" : ""],
              },
              [
                h(
                  "span",
                  {
                    class: ["label", this.currentTab === index ? "active" : ""],
                    on: {
                      click: this.handleSwitchTab.bind(this, { [this.attributeMapping["id"]]: attr[this.attributeMapping["parentId"]], [this.attributeMapping["type"]]: attr[this.attributeMapping["type"]] }, index),
                    },
                  },
                  [this.address.parse(attr)]
                ),
              ]
            );
          }),
        ]),
        h("div", { class: ["address-result", this.isLoading ? "loading" : ""] },
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
                          "data-id": option[this.attributeMapping["id"]],
                          "data-parent-id": option[this.attributeMapping["parentId"]],
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
        )
      ]),
    ]);
  },
});
