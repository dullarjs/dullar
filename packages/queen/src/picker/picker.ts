/*
* @Author: Just be free
* @Date:   2020-11-05 13:22:24
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-07 16:30:32
* @E-mail: justbefree@126.com
*/
import Queen, { mixins, prop, Options } from "../component/Queen";
import { h, vShow, withDirectives, VNode } from "vue";
import { deepClone } from "../utils/deep-clone";
import QPickerColumn from "./picker-column";
import { ColumnObject } from "./picker-column";
import QPopup from "../popup";
import QFlex from "../flex";
import QFlexItem from "../flex-item";
export interface ChangeCallbackEvent {
  value: any;
  index: number;
  key: number;
}
class Props {
  modelValue!: boolean
  itemHeight = prop<string|number>({ default: 44 })
  columns = prop<Array<any>>({
    default: () => []
  })
  confirmText = prop<string>({ default: "确认" })
  cancelText = prop<string>({ default: "取消" })
  title = prop<string>({ default: "请选择日期" })
  showBack = prop<boolean>({ default: true })
  showClose = prop<boolean>({ default: true })
}

@Options({
  name: "QPicker",
  emits: ["close", "update:modelValue", "confirm", "change"]
})
export default class QPicker extends mixins(Queen).with(Props) {
  public static componentName = "QPicker";
  public computedColumn: ColumnObject[] = [];
  public pickColumns = {} as any;
  confirm(): void {
    this.pickColumns = {};
    this.computedColumn.forEach((column: any, key: number) => {
      const pickerColumn = this.$refs[`picker_${key}`] as QPickerColumn;
      this.pickColumns[`picker_${key}`] = pickerColumn.getSelectedItem();
    });
    this.$emit("confirm", deepClone(this.pickColumns));
    this.$emit("update:modelValue", false);
  }
  close(): void {
    this.$emit("close", false);
    this.$emit("update:modelValue", false);
  }
  getContent(type: string = "back"): VNode[] {
    if (type === "back") {
      return [h("span", { class: ["q-picker-cancel"] }, { default: () => this.cancelText })];
    } else {
      return [h("span", { class: ["q-picker-confirm"] }, { default: () => this.confirmText })];
    }
  }
  getData(): void {
    const { columns } = this;
    if (columns.length > 0) {
      const item = columns[0];
      if (item.value && Array.isArray(item.value) && item.value.length > 0) {
        this.computedColumn = columns;
      } else {
        this.computedColumn = [{ value: columns, defaultIndex: 0 }];
      }
    } else {
      this.computedColumn = [];
    }
  }
  change(value: any, index: number, key: number): void {
    this.$emit("change", { value, index, key });
  }
  getColumns() {
    const columns: VNode[] = [];
    this.computedColumn.forEach((column: any, key: number) => {
      columns.push(
        h(QFlexItem,
          {
            ref: `scrollColumn_${key}`,
            class: ["q-picker-column-wapper"],
            key,
            flex: 1
          },
          {
            default: () => [
              h(QPickerColumn,
                {
                  ref: `picker_${key}`,
                  onChange: (value: any, index: number) => {
                    this.change(value, index, key);
                  },
                  defaultIndex: column.defaultIndex || 0,
                  columns: column.value,
                  itemHeight: this.itemHeight
                },
                { default: () => [] }
              )
            ]
          }
        )
      );
    });
    return columns;
  }
  createHeaderArea(): VNode {
    return h("div", { class: ["q-picker-header"] }, {
      default: () => [
        h(QFlex,
          { justifyContent: "spaceBetween" },
          {
            default: () => [
              withDirectives(h(QFlexItem,
                {
                  onClick: this.close,
                  class: ["q-picker-header-back"],
                },
                {
                  default: () => this.getContent("back")
                }
              ), [[vShow, this.showBack]]),
              h(QFlexItem,
                {
                  class: [
                    "q-picker-header-title",
                    this.showBack ? "" : "ml30",
                    this.showClose ? "" : "mr30",
                  ],
                  flex: 1,
                },
                { default: () => this.title }
              ),
              withDirectives(h(QFlexItem,
                {
                  onClick: this.confirm,
                  class: ["q-picker-header-close"],
                },
                {
                  default: () => this.getContent("close")
                }
              ), [[vShow, this.showClose]])
            ]
          }
        ),
      ]
    });
  }
  createScrollArea(): VNode {
    return h("div", { class: ["q-picker-container"] }, {
      default: () => [
        h(QFlex,
          {
            style: { height: "100%" },
            justifyContent: "spaceBetween",
            alignContent: "center",
            alignItems: "center"
          },
          { default: () => this.getColumns() }
        ),
        h(
          "div",
          { class: ["q-picker-mask"], style: {}, ref: "pickerMask" },
          { default: () => [] }
        ),
        h("div", { class: ["scroll-viewer-window"] }, { default: () => [] }),
      ]
    });
  }
  beforeEnter() {
    this.getData();
  }
  mounted() {
    (this.$refs.pickerMask as HTMLDivElement).style.backgroundSize = `100% ${Number(this.itemHeight) * 2}px`;
  }
  render() {
    return h("div", { class: ["q-picker"] }, {
      default: () => [
        withDirectives(h(QPopup, { position: "bottom", onBeforeenter: this.beforeEnter, onInput: this.close }, {
          default: () => [
            this.createHeaderArea(),
            this.createScrollArea()
          ]
        }), [[vShow, this.modelValue]])
      ]
    });
  }
}