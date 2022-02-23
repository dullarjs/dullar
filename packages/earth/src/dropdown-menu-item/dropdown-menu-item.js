/*
 * @Author: Just be free
 * @Date:   2020-04-02 15:47:54
 * @Last Modified by:   Just be free
 * @Last Modified time: 2022-02-22 17:54:58
 * @E-mail: justbefree@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import { injectMixins } from "../mixins/inject";
import { error } from "../modules/error";
import { isPromise, isObject } from "../modules/utils";
import { deepClone } from "../modules/utils/deepClone";
import { slotsMixins } from "../mixins/slots";
import Popup from "../popup";
import Flex from "../flex";
import FlexItem from "../flex-item";
import Iconfont from "../iconfont";
export default defineComponent({
  name: "DropdownMenuItem",
  mixins: [slotsMixins, injectMixins("parent", { indexKey: "indexKey" })],
  components: { Popup, FlexItem, Flex, Iconfont },
  props: {
    borderRadius: {
      type: Number,
      default: 0,
    },
    index: [String, Number],
    value: {
      type: [String, Number],
      default: "",
    },
    active: {
      type: Boolean,
      default: false,
    },
    options: {
      type: [Array, Object],
      default: () => {
        return [];
      },
    },
    mapStatus: {
      type: Object,
      default: () => {
        return {};
      },
    },
    mapOption: {
      type: Array,
      default: () => {
        return [];
      },
    },
    direction: String,
    hideDirectionIcon: {
      type: Boolean,
      default: false,
    },
    titleChangealbe: {
      type: Boolean,
      default: false,
    },
    defaultSelectedIndex: {
      type: [Number, String],
      default: -1,
    },
    fixed: Boolean,
  },
  initPropsToData() {
    const clone = (data) => {
      try {
        return deepClone(data);
      } catch (err) {
        return [];
      }
    };
    return [{ key: "selections", value: "options", parse: clone }];
  },
  data() {
    return {
      originLabel: "",
      currentOptionIndex: -1,
      isFiltered: false,
      show: false,
      menuStatus: false,
      bodyOverflow: null,
      closingWithoutAnimation: false,
      currentSelected: -1,
      checked: false,
    };
  },
  watch: {
    options: "setSelections",
  },
  computed: {
    position() {
      return this.direction === "up" ? "bottom" : "top";
    },
  },
  methods: {
    setSelections(n) {
      if (n) {
        if (Array.isArray(n) && n.length > 0) {
          this.selections = deepClone(n);
          this.setDefault();
        }
      }
    },
    hasOptions() {
      const { options } = this;
      return (
        (isObject(options) && typeof options.action === "function") ||
        (Array.isArray(options) && options.length > 0) ||
        this.slots().length > 0
      );
    },
    setDefault() {
      const index = this.defaultSelectedIndex;
      const { selections } = this;
      if (index > -1 && selections.length && selections.length > index) {
        const option = selections[index];
        this.currentSelected = index;
        selections.splice(index, 1, {
          ...option,
          selected: true,
        });
        this.$emit("input", option.value);
      }
      this.switchTab(this.index, this.getStatus());
    },
    createMask(h) {
      return h(
        "transition",
        {
          directives: [{ name: "show", value: this.show }],
          props: { name: "dropdown-fade" },
        },
        [
          h(
            "div",
            {
              class: [
                "v-yn-dropdown-menu-item-mask",
                this.direction === "up" ? "v-up" : "v-bottom",
              ],
            },
            []
          ),
        ]
      );
    },
    getStatus() {
      if (this.hasOptions()) {
        if (this.slots().length > 0) {
          // 自定义内容
          return this.show || this.isFiltered;
        } else {
          return this.show || this.currentSelected > -1;
        }
      } else {
        return this.checked || this.currentOptionIndex > -1;
      }
    },
    setIsFiltered(flag) {
      this.isFiltered = flag;
      this.switchTab(this.index, this.getStatus());
    },
    getNextOptionIndex() {
      const len = this.mapOption.length;
      if (this.currentOptionIndex + 1 < len) {
        this.currentOptionIndex++;
      } else {
        this.currentOptionIndex = 0;
      }
    },
    checkMapOption(index = 0, options = {}) {
      if (this.currentOptionIndex === -1) {
        this.currentOptionIndex = --index;
        this.toggle(options);
        this.$parent.switchTo(this.index);
      } else {
        this.currentOptionIndex = index;
        const { disableEmit = false } = options;
        if (this.titleChangealbe) {
          if (this.currentOptionIndex === -1) {
            this.$emit("input", this.originLabel);
          } else {
            this.$emit("input", this.mapOption[this.currentOptionIndex].label);
          }
        }
        if (!disableEmit) {
          this.$emit("unchange", this.mapStatus[this.currentOptionIndex] || {});
        }
      }
      this.switchTab(this.index, this.getStatus());
    },
    check(selected = false, options = {}) {
      if (this.hasOptions()) {
        if ((selected && !this.show) || (!selected && this.show)) {
          this.toggle(options);
          this.$parent.switchTo(this.index);
        }
      } else {
        if ((selected && !this.checked) || (!selected && this.checked)) {
          this.toggle(options);
          this.$parent.switchTo(this.index);
        } else {
          const status = this.checked ? "checked" : "unchecked";
          const { disableEmit = false } = options;
          if (!disableEmit) {
            this.$emit("unchange", this.mapStatus[status]);
          }
        }
      }
      this.switchTab(this.index, this.getStatus());
    },
    toggle(options = {}) {
      const { disableEmit = false } = options;
      if (this.hasOptions()) {
        this.show = !this.show;
      } else {
        if (this.mapOption.length > 0) {
          this.getNextOptionIndex();
          if (this.titleChangealbe) {
            if (this.currentOptionIndex === -1) {
              this.$emit("input", this.originLabel);
            } else {
              this.$emit(
                "input",
                this.mapOption[this.currentOptionIndex].label
              );
            }
          }
          if (!disableEmit) {
            this.$emit("change", this.mapOption[this.currentOptionIndex] || {});
          }
        } else {
          this.checked = !this.checked;
          const status = this.checked ? "checked" : "unchecked";
          if (this.titleChangealbe) {
            this.$emit("input", this.mapStatus[status].label);
          }
          if (!disableEmit) {
            this.$emit("change", this.mapStatus[status]);
          }
        }
      }
    },
    close(e = false) {
      if (e) {
        this.closingWithoutAnimation = e;
      }
      this.show = false;
    },
    switchTab(key, status) {
      const { switchTab } = this.parent;
      switchTab && typeof switchTab === "function" && switchTab(key, status);
    },
    slideUp(flag = false) {
      const { slideUp } = this.parent;
      slideUp && typeof slideUp === "function" && slideUp(flag);
    },
    setCollapsedIconStatus(key, status) {
      const { setCollapsedIconStatus } = this.parent;
      setCollapsedIconStatus &&
        typeof setCollapsedIconStatus === "function" &&
        setCollapsedIconStatus(key, status);
    },
    closeTab() {
      this.close();
      this.slideUp(this.getStatus());
      // this.$parent.closeTab();
    },
    expandDirection() {
      const parent = this.$parent.$el;
      const rect = parent.getBoundingClientRect();
      if (this.direction === "up") {
        this.$refs.menu.style.bottom = `${window.innerHeight - rect.top}px`;
      } else {
        this.$refs.menu.style.top = `${rect.bottom}px`;
      }
    },
    handleBeforeEnter() {
      this.setCollapsedIconStatus(this.index, true);
      this.expandDirection();
      this.menuStatus = true;
      this.$emit("beforeEnter");
    },
    handleAfterEnter() {
      this.$emit("afterEnter");
    },
    handleBeforeLeave() {
      this.$emit("beforeLeave");
      if (this.closingWithoutAnimation) {
        this.menuStatus = false;
      }
      this.setCollapsedIconStatus(this.index, false);
    },
    handleAfterLeave() {
      this.$emit("afterLeave");
      if (!this.closingWithoutAnimation) {
        this.menuStatus = false;
      }
    },
    handleItemClick(args) {
      const { option, key } = args;
      const { currentSelected, selections } = this;
      if (key === currentSelected) {
        return false;
      }
      if (this.currentSelected > -1) {
        const currnetItem = selections[currentSelected];
        selections.splice(currentSelected, 1, {
          ...currnetItem,
          selected: false,
        });
      }
      this.currentSelected = key;
      selections.splice(key, 1, { ...option, selected: true });
      this.$emit("change", option);
      if (this.titleChangealbe) {
        this.$emit("input", option.value);
      }
      this.slideUp(this.getStatus());
      this.close();
    },
    getContent(h) {
      const slots = this.slots();
      if (slots && slots.length) {
        return slots;
      } else {
        if (this.selections.length > 0) {
          return [
            h(
              "ul",
              {
                class: ["yn-dropdown-menu-item-content-list"],
              },
              Array.apply(null, this.selections).map((option, key) => {
                return h(
                  "li",
                  {
                    class: [option.selected ? "active" : ""],
                    on: {
                      click: this.handleItemClick.bind(this, {
                        option,
                        key,
                      }),
                    },
                    key,
                  },
                  [
                    h(
                      genComponentName("flex"),
                      { justifyContent: "spaceAround" },
                      [
                        h(
                          genComponentName("flex-item"),
                          { props: { flex: 1 } },
                          [h("span", { class: ["text"] }, option.text)]
                        ),
                        h(genComponentName("flex-item"), {}, [
                          h(
                            genComponentName("iconfont"),
                            {
                              class: ["confirm-mark"],
                              directives: [
                                { name: "show", value: option.selected },
                              ],
                              props: { name: "check-mark", size: 12 },
                            },
                            []
                          ),
                        ]),
                      ]
                    ),
                  ]
                );
              })
            ),
          ];
        }
      }
    },
  },
  mounted() {
    this.originLabel = this.value;
    if (isObject(this.options) && typeof this.options.action === "function") {
      const { action, params, parse } = this.options;
      if (typeof action === "function" && typeof parse === "function") {
        // 异步处理
        const callback = action(params);
        if (isPromise(callback)) {
          callback.then((res) => {
            this.selections = parse(res);
            this.setDefault();
          });
        } else {
          error("The action of options's attribute must be a Promise type!");
        }
      }
    } else {
      this.setDefault();
    }
  },
  render(h) {
    if (this.hasOptions()) {
      return h(
        "div",
        {
          ref: "menu",
          directives: [{ name: "show", value: this.menuStatus }],
          class: [
            "yn-dropdown-menu-item",
            this.direction === "up" ? "v-up" : "v-bottom",
            this.menuStatus ? "zIndex" : "",
          ],
        },
        [
          h(
            genComponentName("popup"),
            {
              on: {
                beforeEnter: this.handleBeforeEnter,
                afterEnter: this.handleAfterEnter,
                beforeLeave: this.handleBeforeLeave,
                afterLeave: this.handleAfterLeave,
                input: this.closeTab,
              },
              style: { position: "absolute" },
              props: {
                borderRadius: this.borderRadius,
                position: this.position,
                value: this.show,
                singleton: true,
              },
            },
            [
              h(
                "div",
                {
                  class: ["yn-dropdown-menu-item-content"],
                },
                this.getContent(h)
              ),
            ]
          ),
        ]
      );
    }
    return null;
  },
});
