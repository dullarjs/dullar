/*
 * @Author: Just be free
 * @Date:   2021-08-13 16:53:33
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-08-16 15:27:10
 * @E-mail: justbefree@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import { isString } from "../modules/utils";
import Popup from "../popup";
import Flex from "../flex";
import FlexItem from "../flex-item";
export default defineComponent({
  name: "Address",
  components: { Popup, Flex, FlexItem },
  props: {
    value: Boolean,
    label: {
      type: String,
      default: "请选择",
    },
    sources: {
      type: Array,
      default: () => [],
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
      regionList: [],
      regionHeader: [],
      CACHE: [],
      CACHE_1: {},
      CACHE_2: {},
      CACHE_3: {},
      CACHE_4: {},
      CACHE_5: {},
    };
  },
  methods: {
    updateRegionList(list, region) {
      if (list.length > 0) {
        this.regionList = list;
      } else {
        this.$emit("input", false);
        this.$emit("done", this.regionHeader);
      }
      if (this.regionHeader.length === 0) {
        this.regionHeader.push(this.label);
      } else {
        this.regionHeader.splice(this.regionHeader.length - 1, 0, region);
        if (list.length === 0) {
          this.regionHeader.pop();
        }
      }
    },
    setCache(type, region, res) {
      if (type === "1") {
        this.CACHE = res;
      } else {
        if (!this[`CACHE_${region.region_type}`][region.region_id]) {
          this[`CACHE_${region.region_type}`][region.region_id] = res;
        }
      }
    },
    requestAddress(args) {
      const { region } = args;
      const { regionType } = args.params;
      const params = { ...this.address.params, ...args.params };
      const promise = this.address.action(params);
      promise
        .then((res) => {
          this.updateRegionList(res, region);
          this.setCache(regionType, region, res);
        })
        .catch(() => {});
    },
    handleBeforeEnter() {
      if (this.regionList.length === 0) {
        this.requestAddress({ params: { regionType: "1" } });
      }
    },
    handleInput() {
      this.$emit("input", false);
    },
    handleItemClick(region) {
      const cache = this[`CACHE_${region.region_type}`][region.region_id];
      if (cache) {
        this.updateRegionList(cache, region);
        return;
      }
      const currentRegionType = parseInt(region.region_type);
      const nextRegionType = String(currentRegionType + 1);
      this.requestAddress({
        region,
        params: { regionType: nextRegionType, regionId: region.region_id },
      });
    },
    handleTabClick({ region, key }) {
      this.regionHeader.splice(key);
      this.regionHeader.push(this.label);
      if (key === 0) {
        this.regionList = this.CACHE;
      } else {
        this.regionList = this[`CACHE_${key}`][region.parent_id];
      }
    },
  },
  render(h) {
    return h("div", { class: ["yn-address"] }, [
      h(
        genComponentName("popup"),
        {
          class: ["address-popup"],
          props: {
            position: "bottom",
            showCloseIcon: true,
            fixed: true,
            closeOnClickModal: false,
          },
          on: {
            beforeEnter: this.handleBeforeEnter,
            input: this.handleInput,
          },
          directives: [{ name: "show", value: this.value }],
        },
        [
          h("div", { class: ["address-container"] }, [
            h(
              genComponentName("flex"),
              { class: ["address-flex"], props: { flexDirection: "column" } },
              [
                h(
                  genComponentName("flex-item"),
                  { class: ["address-header"] },
                  [
                    this.regionList.length > 0
                      ? h(
                          "div",
                          {},
                          Array.apply(null, this.regionHeader).map(
                            (region, key) => {
                              const isStringType = isString(region);
                              const isLast =
                                key === this.regionHeader.length - 1;
                              return h(
                                "span",
                                {
                                  on: {
                                    click: this.handleTabClick.bind(this, {
                                      region,
                                      key,
                                    }),
                                  },
                                  key,
                                  class: [isLast ? "active" : ""],
                                },
                                isStringType
                                  ? region
                                  : this.address.parse(region)
                              );
                            }
                          )
                        )
                      : null,
                  ]
                ),
                h(genComponentName("flex-item"), { class: ["address-body"] }, [
                  h(
                    "ul",
                    { class: ["ul-container"] },
                    Array.apply(null, this.regionList).map((region, key) => {
                      return h(
                        "li",
                        {
                          key,
                          on: {
                            click: this.handleItemClick.bind(this, region),
                          },
                        },
                        region.region_name
                      );
                    })
                  ),
                ]),
              ]
            ),
          ]),
        ]
      ),
    ]);
  },
});
