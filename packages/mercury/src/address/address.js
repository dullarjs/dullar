/*
 * @Author: Just be free
 * @Date:   2021-08-13 16:53:33
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-10-12 10:42:28
 * @E-mail: justbefree@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import { isString } from "../modules/utils";
import Popup from "../popup";
import Flex from "../flex";
import FlexItem from "../flex-item";
import Iconfont from "../iconfont";
export default defineComponent({
  name: "Address",
  components: {
    Popup,
    Flex,
    FlexItem,
    Iconfont,
  },
  props: {
    showCloseIcon: {
      type: Boolean,
      default: true,
    },
    showBackIcon: {
      type: Boolean,
      default: false,
    },
    title: {
      default: "配送至",
      type: String,
    },
    position: {
      type: String,
      default: "bottom",
    },
    value: Boolean,
    defaultParams: {
      type: Object,
      default: () => {
        return {};
      },
    },
    attributeMapping: {
      type: Object,
      default: () => {
        return {
          id: "id",
          type: "type",
          parentId: "parentId",
        };
      },
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
      CACHE: {},
      lock: false,
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
      const params = {
        ...this.address.params,
        ...args,
      };
      const promise = this.address.action(params);
      promise
        .then((res) => {
          this.updateRegionList(res, args);
          this.setCache(args, res);
          this.lock = false;
        })
        .catch(() => {
          this.lock = false;
        });
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
      if (this.lock) return;
      this.lock = true;
      const cache = this.CACHE[region[this.attributeMapping["id"]]];
      if (Array.isArray(cache)) {
        this.updateRegionList(cache, region);
        this.lock = false;
        return;
      }
      this.requestAddress(region);
    },
    handleTabClick({ region, key }) {
      if (this.regionHeader.length - 1 === key) return;
      this.regionHeader.splice(key);
      this.regionHeader.push(this.label);
      this.regionList = this.CACHE[region[this.attributeMapping["id"]]];
    },
  },
  render(h) {
    return h(
      "div",
      {
        class: ["yn-address"],
      },
      [
        h(
          genComponentName("popup"),
          {
            class: ["address-popup"],
            ref: "popup",
            props: {
              position: this.position,
              showCloseIcon: this.showCloseIcon,
              fixed: true,
              closeOnClickModal: true,
            },
            on: {
              beforeEnter: this.handleBeforeEnter,
              input: this.handleInput,
            },
            directives: [
              {
                name: "show",
                value: this.value,
              },
            ],
          },
          [
            h(
              "div",
              {
                class: ["address-container"],
              },
              [
                h(
                  genComponentName("flex"),
                  {
                    class: ["address-flex"],
                    props: {
                      flexDirection: "column",
                    },
                  },
                  [
                    h(
                      genComponentName("flex-item"),
                      {
                        class: ["address-header"],
                      },
                      [
                        h(
                          "div",
                          {
                            class: [
                              "address-header-back",
                              this.showBackIcon ? "" : "hidden",
                            ],
                            on: {
                              click: () => {
                                this.$emit("input", false);
                              },
                            },
                          },
                          [
                            // "返回"
                            h(
                              genComponentName("iconfont"),
                              {
                                props: {
                                  name: "back",
                                  size: 14,
                                },
                              },
                              []
                            ),
                          ]
                        ),
                        h(
                          "div",
                          {
                            class: ["address-header-title"],
                          },
                          [h("span", {}, this.title)]
                        ),
                      ]
                    ),
                    h(
                      genComponentName("flex-item"),
                      {
                        class: ["address-title"],
                      },
                      [
                        Array.isArray(this.regionList) &&
                        this.regionList.length > 0
                          ? h(
                              genComponentName("flex"),
                              {
                                props: {},
                                class: ["header-container"],
                              },
                              Array.apply(null, this.regionHeader).map(
                                (region, key) => {
                                  const isStringType = isString(region);
                                  const text = isStringType
                                    ? region
                                    : this.address.parse(region);
                                  const iWidth = this.$refs.popup.$el
                                    .offsetWidth;
                                  const total = iWidth / 15;
                                  const flex = `0 0 ${
                                    (text.length / total) * 100
                                  }%`;
                                  const isLast =
                                    key === this.regionHeader.length - 1;
                                  return h(
                                    genComponentName("flex-item"),
                                    {
                                      props: {
                                        flex,
                                      },
                                      on: {
                                        click: this.handleTabClick.bind(this, {
                                          region: {
                                            [this.attributeMapping["id"]]:
                                              region[
                                                this.attributeMapping[
                                                  "parentId"
                                                ]
                                              ],
                                            [this.attributeMapping["type"]]:
                                              region[
                                                this.attributeMapping["type"]
                                              ],
                                          },
                                          key,
                                        }),
                                      },
                                      key,
                                      class: [
                                        "header-tab",
                                        isLast ? "active" : "",
                                      ],
                                    },
                                    [h("span", {}, text)]
                                  );
                                }
                              )
                            )
                          : null,
                      ]
                    ),
                    h(
                      genComponentName("flex-item"),
                      {
                        class: ["address-body"],
                      },
                      [
                        h(
                          "ul",
                          {
                            class: ["ul-container"],
                          },
                          Array.apply(null, this.regionList).map(
                            (region, key) => {
                              return h(
                                "li",
                                {
                                  key,
                                  on: {
                                    click: this.handleItemClick.bind(
                                      this,
                                      region
                                    ),
                                  },
                                },
                                this.address.parse(region)
                              );
                            }
                          )
                        ),
                      ]
                    ),
                  ]
                ),
              ]
            ),
          ]
        ),
      ]
    );
  },
});
