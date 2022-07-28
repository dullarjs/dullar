<template>
  <div class="yn-select"
    @click.stop="toggleMenu"
    v-clickoutside="handleClose"
  >
    <field
      ref="reference"
      v-model="selectedLabel"
      type="text"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :iconName="'down-arrow-cdcdcd'"
      :iconSize="14"
      :iconClass="iconArrowClass"
      :iconRotate="iconRotate"
      :inputWidth="inputWidth"
      :size="size"
      @focus="handleFocus"
      @blur="handleBlur"
    ></field>
    <selectDropdown
      ref="popper"
      v-show="visible"
    >
      <scrollbar
        tag="ul"
        wrapClass="yn-select-dropdown__wrap"
        viewClass="yn-select-dropdown__list"
        ref="scrollbar"
        v-show="options.length > 0"
      >
        <slot></slot>
      </scrollbar>
    </selectDropdown>
  </div>
</template>
<script lang="ts">
import { Vue, Options, prop, mixins } from "vue-class-component";
import "./style/index.scss";
import { AnyObject } from "../../types";
import field from "@/components/field";
import selectDropdown from "./selectDropdown.vue";
import scrollbar from "@/components/scrollbar";
import { valueEquals } from "@/utils";
import Clickoutside from '@/utils/clickoutside.js';
class Props {
  modelValue = prop<number | string>({ default: "" })
  placeholder = prop<string>({ default: "" })
  disabled = prop<boolean>({ default: false })
  size = prop<string>({ default: "medium" })
}
@Options({
  name: "YnSelect",
  components: {
    scrollbar,
    selectDropdown,
    field
  },
  emits: ["change", "focus", "input", "update:modelValue", "blur"],
  provide() {
    return {
      "select": this
    }
  },
  directives: { Clickoutside },
  watch: {
    modelValue() {
      this.setSelected();
    },
    visible(n: boolean) {
      if (n) {
        this.iconRotate = 180;
        // this.broadcast('YnSelectDropdown', 'updatePopper');
        this.$refs.popper.updatePopper();
      } else {
        this.iconRotate = 0;
      }
    },
    options() {
      this.$nextTick(() => {
        // this.broadcast('YnSelectDropdown', 'updatePopper');
        if (this.visible) {
          this.$refs.popper.updatePopper();
        }
      });
      this.setSelected();
    }
  }
})
export default class Select extends mixins(Vue).with(Props) {
  static componentName = "YnSelect";
  optionsCount = 0;
  hoverIndex = -1;
  selected: AnyObject = {};
  options: AnyObject[] = [];
  cachedOptions: AnyObject[] = [];
  selectedLabel = "";
  visible = false;
  softFocus = false;
  inputWidth = "100%";
  iconRotate = 0;

  get iconArrowClass (){
    return ["yn-select__caret"];
  }
  get readonly() {
    return true;
  }

  emitChange(val: number | string) {
    if (!valueEquals(this.modelValue, val)) {
      this.$emit('change', val);
    }
  }
  handleFocus(e: Event) {
    if (!this.softFocus) {
      this.$emit('focus', e)
    } else {
      this.softFocus = true;
    }
  }
  handleBlur(e: Event) {
    this.softFocus = false;
    this.$emit('blur', e);
  }
  handleOptionSelect(option: AnyObject) {
    this.$emit("input", option.value);
    this.$emit("update:modelValue", option.value);
    this.emitChange(option.value);
    this.visible = false;
    this.setSoftFocus();
  }
  setSelected() {
    const option = this.getOption(this.modelValue);
    this.selectedLabel = option.currentLabel;
    this.selected = option;
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
    const newOption = {
      value: value,
      currentLabel: label
    };
    return newOption;
  }
  setSoftFocus() {
    this.softFocus = true;
    const input = (this.$refs.input || this.$refs.reference) as HTMLInputElement;
    if (input) {
      input.focus();
    }
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
  handleResize() {
    const reference: Vue = this.$refs.reference as Vue;
    if (reference && reference.$el) {
        this.inputWidth = reference.$el.getBoundingClientRect().width + "px";
      }
  }
  created() {
    // this.$on('handleOptionClick', this.handleOptionSelect);
    // this.$on('setSelected', this.setSelected);
  }
  mounted() {
    this.$nextTick(() => {
      this.handleResize()
    });
    this.setSelected();
    window.addEventListener("resize", this.handleResize);
  }
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  }
}
</script>
