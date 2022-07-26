<template>
  <div class="yn-dropdown"
    ref="reference"
    @click.stop="toggleMenu"
    v-clickoutside="handleClose"
  >
    <slot></slot>
    <slot name="dropdown"></slot>
  </div>
</template>
<script lang="ts">
import { Vue, Options, prop, mixins } from "vue-class-component";
import "./style/index.scss";
import { AnyObject } from "../../types";
import DropdownMenu from "./dropdownMenu.vue";
import { valueEquals } from "@/utils";
import Clickoutside from '@/utils/clickoutside.js';
import { VNode, Slot } from "vue";
class Props {
  placement = prop<string>({ default: 'bottom' }) 
  value = prop<number | string | (number | string)[]>({ default: "" })
  placeholder = prop<string>({ default: "" })
  disabled = prop<boolean>({ default: false })
  multiple = prop<boolean>({ default: false })
}
@Options({
  name: "YnDropdown",
  components: {
    DropdownMenu
  },
  provide() {
    return {
      "dropdown": this
    }
  },
  directives: { Clickoutside },
  watch: {
    value() {
      this.setSelected();
    }
    options() {
      this.setSelected();
    }
    visible(n: boolean) {
      // this.broadcast('YnDropdownMenu', 'visible', n);
      this.$emit("visible-change", n);
    }
  }
})
export default class Select extends mixins(Vue).with(Props) {
  static componentName = "YnDropdown";

  triggerElm!: HTMLElement;
  popperElm!: HTMLElement;
  optionsCount = 0;
  hoverIndex = -1;
  selected:AnyObject | AnyObject[] = {};
  options: AnyObject[] = [];
  cachedOptions: AnyObject[] = [];
  selectedLabel = "";
  currentPlaceholder = "";
  visible = false;

  get readonly() {
    return true;
  }
  
  emitChange(val: number | string | (string | number)[]) {
    if (!valueEquals(this.value, val)) {
      this.$emit('change', val);
    }
  }
  handleOptionSelect(option: AnyObject) {
    if (this.multiple) {
      const value = (this.value as (string | number)[] || []).slice();
      const optionIndex = value.indexOf(option.value);
      if (optionIndex > -1) {
        value.splice(optionIndex, 1);
      } else {
        value.push(option.value);
      }
      this.$emit('input', value);
      this.emitChange(value);
    } else {
      this.$emit("input", option.value);
      this.emitChange(option.value);
      this.visible = false;
    }
  }
  setSelected() {
    // 先把所有的 选项 且为 checkbox的重置为 false
    this.options.forEach(op => {
      if (op.type === "checkbox") {
        op.isChecked = false;
      }
    });
    if (this.multiple) {
      let result: AnyObject[] = [];
      if (Array.isArray(this.value)) {
        this.value.forEach(value => {
          const option = this.getOption(value)
          if (option.type === "checkbox") {
            option.isChecked = true;
          }
          result.push(option);
        });
      }
      this.selected = result;
    } else {
      let option = this.getOption(this.value as string | number);
      this.selectedLabel = option.currentLabel;
      this.selected = option;
      if (option.type === "checkbox") {
        option.isChecked = true;
      }
    }
  }
  getOption(value: string | number): AnyObject {
    let option;
    const isObject = Object.prototype.toString.call(value).toLowerCase() === '[object object]';
    const isNull = Object.prototype.toString.call(value).toLowerCase() === '[object null]';
    const isUndefined = Object.prototype.toString.call(value).toLowerCase() === '[object undefined]';
    for (let i = this.cachedOptions.length - 1; i >= 0; i--) {
      const cachedOption = this.cachedOptions[i];
      const isEqual = cachedOption.value === value;
      if (isEqual) {
        option = cachedOption;
        break;
      }
    }
    if (option) return option;
    const label = (!isObject && !isNull && !isUndefined)
      ? String(value) : '';
    let newOption = {
      value: value,
      currentLabel: label
    };
    return newOption;
  }
  toggleMenu() {
    if (!this.disabled) {
      this.visible = !this.visible;
      const input = (this.$refs.input || this.$refs.reference) as HTMLInputElement;
      if (this.visible) {
        input.focus();
      }
    }
  }
  onOptionDestroy(index: number) {
    if (index > -1) {
      this.optionsCount--;
      this.options.splice(index, 1);
    }
  }
  handleClose() {
    this.visible = false;
  }
  handleClick() {
    if (this.disabled) return;
    if (this.visible) {
      this.visible = false;
    } else {
      this.visible = true;
    }
  }
  initEvent() {
    this.triggerElm = (this.$slots.default as Slot)()[0].el as HTMLElement;
  }
  created() {
    // this.$on('handleOptionClick', this.handleOptionSelect);
    // this.$on('setSelected', this.setSelected);
  }
  mounted() {
    this.initEvent();
    this.setSelected();
  }
}
</script>