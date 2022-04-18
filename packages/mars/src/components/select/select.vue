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
import Vue from "vue";
import { Component, Prop, Watch, Mixins  } from "vue-property-decorator";
import "./style/index.scss";
import { AnyObject } from "../../types";
import field from "@/components/field";
import selectDropdown from "./selectDropdown.vue";
import scrollbar from "@/components/scrollbar";
import { valueEquals } from "@/utils";
import Clickoutside from '@/utils/clickoutside.js';
import Emitter from "@/components/mixins/emitter";
@Component({
  name: "YnSelect",
  components: {
    scrollbar,
    selectDropdown,
    field
  },
  provide() {
    return {
      "select": this
    }
  },
  directives: { Clickoutside }
})
export default class Select extends Mixins(Vue, Emitter) {
  static componentName = "YnSelect";

  optionsCount = 0;
  hoverIndex = -1;
  selected:AnyObject = {};
  options: AnyObject[] = [];
  cachedOptions: AnyObject[] = [];
  selectedLabel = "";
  visible = false;
  softFocus = false;
  inputWidth = "100%";
  iconRotate = 0;

  @Prop({
    type: [Number, String],
    default: "",
    required: true
  })
  value!: number | string;
  @Prop({
    type: String,
    default: ""
  })
  placeholder!: string;
  @Prop({
    type: Boolean,
    default: false
  })
  disabled!: boolean;
  @Prop({
    type: String,
    default: "medium"
  })
  size!: string;

  get iconArrowClass (){
    return ["yn-select__caret"];
  }
  get readonly() {
    return true;
  }
  @Watch("value")
  onValue() {
    this.setSelected();
  }
  @Watch("visible")
  onVisible(n: boolean) {
    if (n) {
      this.iconRotate = 180;
      this.broadcast('YnSelectDropdown', 'updatePopper');
    } else {
      this.iconRotate = 0;
    }
  }
  @Watch("options")
  onOptions() {
    this.$nextTick(() => {
      this.broadcast('YnSelectDropdown', 'updatePopper');
    });
    this.setSelected();
  }

  emitChange(val: number | string) {
    if (!valueEquals(this.value, val)) {
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
    this.emitChange(option.value);
    this.visible = false;
    this.setSoftFocus();
  }
  setSelected() {
    let option = this.getOption(this.value);
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
    let newOption = {
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
    this.$on('handleOptionClick', this.handleOptionSelect);
    this.$on('setSelected', this.setSelected);
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
