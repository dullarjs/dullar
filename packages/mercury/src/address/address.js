/*
 * @Author: Just be free
 * @Date:   2021-08-13 16:53:33
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-10-08 17:14:49
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
    defaultParams: {
      type: Object,
      default: () => {
        return {}
      }
    },
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
      CACHE: {}
    };
  },
  methods: {
    updateRegionList(list, region) {
      if (this.regionHeader.length === 0) {
        this.regionHeader.push(this.label);
      } else {
        this.regionHeader.splice(this.regionHeader.length - 1, 0, region);
        if (list.length === 0) {
          this.regionHeader.pop();
        }
      }
      if (list.length > 0) {
        this.regionList = list;
      } else {
        this.$emit("input", false);
        this.$emit("done", this.regionHeader);
      }
    },
    setCache(region, res) {
      if (!this.CACHE[region[this.attributeMapping["id"]]]) {
        this.CACHE[region[this.attributeMapping["id"]]] = res;
      }
    },
    requestAddress(args) {
      const params = { ...this.address.params, ...args };
      const promise = this.address.action(params);
      promise
        .then((res) => {
          this.updateRegionList(res, args);
          this.setCache(args, res);
        })
        .catch(() => {});
    },
    handleBeforeEnter() {
      if (this.regionList.length === 0) {
        this.requestAddress(this.defaultParams);
      }
    },
    handleInput() {
      this.$emit("input", false);
    },
    handleItemClick(region) {
      const cache = this.CACHE[region[this.attributeMapping["id"]]];
      if (Array.isArray(cache)) {
        this.updateRegionList(cache, region);
        return;
      }
      this.requestAddress(region);
    },
    handleTabClick({ region, key }) {
      this.regionHeader.splice(key);
      this.regionHeader.push(this.label);
      this.regionList = this.CACHE[region[this.attributeMapping["id"]]];
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
                          genComponentName("flex"),
                          { props: {}, class: ["header-container"] },
                          Array.apply(null, this.regionHeader).map(
                            (region, key) => {
                              const isStringType = isString(region);
                              const text = isStringType
                                    ? region
                                    : this.address.parse(region);
                              const iWidth = window.innerWidth - 40;
                              const total = iWidth / 14;
                              const flex = `0 0 ${text.length / total * 100}%`;
                              const isLast =
                                key === this.regionHeader.length - 1;
                              return h(
                                genComponentName("flex-item"),
                                {
                                  props: { flex },
                                  on: {
                                    click: this.handleTabClick.bind(this, {
                                      region: { [this.attributeMapping["id"]]: region[this.attributeMapping["parentId"]], [this.attributeMapping["type"]]: region[this.attributeMapping["type"]] },
                                      key,
                                    }),
                                  },
                                  key,
                                  class: ["header-tab", isLast ? "active" : ""],
                                },
                                [h("span", {},
                                  text
                                )]
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
                        this.address.parse(region)
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
