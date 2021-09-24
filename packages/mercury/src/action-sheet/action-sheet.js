/*
 * @Author: Just be free
 * @Date:   2020-03-09 12:18:33
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-24 18:29:05
 */
import "./style/index";
import { defineComponent, genComponentName } from "../modules/component";
import Popup from "../popup";
import Iconfont from "../iconfont";
import Flex from "../flex";
import FlexItem from "../flex-item";
import Spin from "../spin";
export default defineComponent({
  name: "actionSheet",
  components: { Popup, Iconfont, Flex, FlexItem, Spin },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "标题",
    },
    actions: {
      type: Array,
      default: () => {
        return [];
      },
    },
    showCancel: {
      type: Boolean,
      default: false,
    },
    cancelText: {
      type: String,
      default: "取消",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    iconType: {
      type: String,
      default: "tripleBounce",
    },
    iconSize: {
      type: Number,
      default: 36,
    },
    iconColor: String,
  },
  methods: {
    handleChange(e) {
      this.$emit("input", e);
    },
    handleCancel() {
      this.handleChange(false);
    },
    handleItemClick(e) {
      if (e && e.disable) {
        return false;
      }
      this.$emit("getSelected", e);
      this.handleChange(false);
    },
    createList(h) {
      const list = [];
      if (this.loading) {
        list.push(
          h("li", { class: ["yn-action-sheet-loading-warpper"] }, [
            h(
              genComponentName("spin"),
              {
                class: ["loading"],
                props: {
                  type: this.iconType,
                  size: this.iconSize,
                  color: this.iconColor,
                },
              },
              []
            ),
          ])
        );
      } else {
        this.actions.forEach((action, index) => {
          const className = Array.isArray(action.className)
            ? action.className
            : [action.className];
          const key = action.key || index;
          const disable = action.disable ? "disable" : "";
          list.push(
            h(
              "li",
              {
                key: key,
                class: [...className, disable],
                on: { click: this.handleItemClick.bind(this, action) },
              },
              [h("span", { class: [`${disable}-text`] }, action.name)]
            )
          );
        });
      }
      if (this.showCancel) {
        list.push(
          h(
            "li",
            {
              class: ["yn-action-sheet-cancel"],
              on: { click: this.handleCancel },
            },
            [h("span", {}, this.cancelText)]
          )
        );
      }
      return list;
    },
    handleBeforeEnter() {
      this.$emit("beforeEnter");
    },
    handleAfterEnter() {
      this.$emit("afterEnter");
    },
    handleBeforeLeave() {
      this.$emit("beforeLeave");
    },
    handleAfterLeave() {
      this.$emit("afterLeave");
    },
  },
  render(h) {
    return h("div", { class: ["yn-action-sheet"] }, [
      h(
        genComponentName("popup"),
        {
          on: {
            input: this.handleChange,
            beforeEnter: this.handleBeforeEnter,
            afterEnter: this.handleAfterEnter,
            beforeLeave: this.handleBeforeLeave,
            afterLeave: this.handleAfterLeave,
          },
          directives: [{ name: "show", value: this.value }],
          props: { position: "bottom" },
          style: { "max-height": "80%" },
        },
        [
          h("h3", { class: ["yn-action-sheet-title"] }, this.title),
          h("ul", { class: ["yn-action-sheet-content"] }, [this.createList(h)]),
        ]
      ),
    ]);
  },
});
