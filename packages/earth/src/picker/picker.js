/*
 * @Author: Just be free
 * @Date:   2020-03-27 11:10:13
 * @Last Modified by:   Just be free
 * @Last Modified time: 2022-09-13 18:21:17
 * @E-mail: justbefree@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import Popup from "../popup";
import { slotsMixins } from "../mixins/slots";
import Flex from "../flex";
import FlexItem from "../flex-item";
import PickerColumn from "./pickerColumn";
import { deepClone } from "../modules/utils/deepClone";
import { isString } from "../modules/utils";
export default defineComponent({
  name: "Picker",
  mixins: [slotsMixins],
  components: { Popup, Flex, FlexItem, PickerColumn },
  props: {
    value: Boolean,
    itemHeight: {
      type: [String, Number],
      default: 44,
    },
    columns: {
      type: Array,
      default: () => {
        return [];
      },
    },
    confirmText: {
      type: String,
      default: "确定",
    },
    cancelText: {
      type: String,
      default: "取消",
    },
    title: {
      type: String,
      default: "请选择",
    },
    showBack: {
      type: Boolean,
      default: true,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    animated: {
      type: String,
      default: "all",
    },
  },
  data() {
    return {
      computedColumn: [],
      pickColumns: {},
    };
  },
  methods: {
    confirm() {
      this.pickColumns = {};
      this.computedColumn.forEach((column, key) => {
        this.pickColumns[`picker_${key}`] = this.$refs[
          `picker_${key}`
        ].getSelectedItem();
      });
      this.$emit("confirm", deepClone(this.pickColumns));
      this.$emit("input", false);
    },
    close() {
      this.$emit("close", false);
      this.$emit("input", false);
    },
    change(...args) {
      this.$emit("change", ...args);
    },
    getContent(h, type) {
      if (type === "back") {
        return [h("span", { class: ["yn-picker-cancel"] }, this.cancelText)];
      } else if (type === "close") {
        return [h("span", { class: ["yn-picker-confirm"] }, this.confirmText)];
      }
    },
    createHeaderArea(h) {
      return h(
        "div",
        { class: ["yn-picker-header", "disable-highlight-tap"] },
        [
          h(
            genComponentName("flex"),
            { props: { justifyContent: "spaceBetween" } },
            [
              h(
                genComponentName("flex-item"),
                {
                  on: { click: this.close },
                  class: ["yn-picker-header-back"],
                  directives: [{ name: "show", value: this.showBack }],
                },
                this.getContent(h, "back")
              ),
              h(
                genComponentName("flex-item"),
                {
                  class: [
                    "yn-picker-header-title",
                    this.showBack ? "" : "ml30",
                    this.showClose ? "" : "mr30",
                  ],
                  props: { flex: 1 },
                },
                this.title
              ),
              h(
                genComponentName("flex-item"),
                {
                  on: { click: this.confirm },
                  class: ["yn-picker-header-close"],
                  directives: [{ name: "show", value: this.showClose }],
                },
                this.getContent(h, "close")
              ),
            ]
          ),
        ]
      );
    },
    getData() {
      const { columns } = this;
      if (columns.length > 0) {
        const item = columns[0];
        if (item.value) {
          if (Array.isArray(item.value)) {
            this.computedColumn = columns;
          } else if (isString(item.value)) {
            this.computedColumn = [columns];
          }
        } else {
          this.computedColumn = [{ value: columns, defaultIndex: 0 }];
        }
      } else {
        this.computedColumn = [];
      }
    },
    handleBeforeEnter() {
      this.getData();
      this.$emit("beforeEnter");
    },
    handleEnter() {
      this.$emit("enter");
    },
    handleAfterEneter() {
      this.$emit("afterEnter");
    },
    handleBeforeLeave() {
      this.$emit("beforeLeave");
    },
    handleLeave() {
      this.$emit("leave");
    },
    handleAfterLeave() {
      this.$emit("afterLeave");
    },
    getColumns(h) {
      const columns = [];
      this.computedColumn.forEach((column, key) => {
        const columnsProps = Array.isArray(column.value)
          ? column.value
          : column;
        columns.push(
          h(
            genComponentName("flex-item"),
            {
              ref: `scrollColumn_${key}`,
              class: ["yn-picker-column-wapper"],
              key,
              props: { flex: 1 },
            },
            [
              h(
                genComponentName("picker-column"),
                {
                  ref: `picker_${key}`,
                  on: {
                    change: (...args) => {
                      this.change(...args, key);
                    },
                  },
                  props: {
                    defaultIndex: column.defaultIndex || 0,
                    columns: columnsProps,
                    itemHeight: this.itemHeight,
                    animated: this.animated,
                  },
                },
                []
              ),
            ]
          )
        );
      });
      return columns;
    },
    createScrollArea(h) {
      return h("div", { class: ["yn-picker-container"] }, [
        h(
          genComponentName("flex"),
          {
            style: { height: "100%" },
            props: {
              justifyContent: "spaceBetween",
              alignContent: "center",
              alignItems: "center",
            },
          },
          this.getColumns(h)
        ),
        h("div", { class: ["scroll-viewer-window"] }, []),
      ]);
    },
  },
  mounted() {
    // this.$refs.pickerMask.style = `background-size: 100% ${
    //   this.itemHeight * 2
    // }px`;
  },
  render(h) {
    return h("div", { class: ["yn-picker"] }, [
      h(
        genComponentName("popup"),
        {
          props: { position: "bottom" },
          directives: [{ name: "show", value: this.value }],
          on: {
            input: this.close,
            beforeEnter: this.handleBeforeEnter,
            enter: this.handleEnter,
            afterEnter: this.handleAfterEneter,
            beforeLeave: this.handleBeforeLeave,
            leave: this.handleLeave,
            afterLeave: this.handleAfterLeave,
          },
        },
        [this.createHeaderArea(h), this.createScrollArea(h)]
      ),
    ]);
  },
});
