<template>
  <li
    @mouseenter="hoverItem"
    @click.stop="selectOptionClick"
    class="yn-dropdown-menu__item"
    v-show="visible"
    :class="{
      'selected': itemSelected,
      'is-disabled': disabled,
      'hover': hover
    }">
    <slot>
      <div v-if="type === 'checkbox'" class="yn-dropdown-item__checkbox">
        <Yn-checkbox disableClick v-model="isChecked" :size="14"></Yn-checkbox>
        <span class="yn-dropdown-item__label">{{ currentLabel }}</span>
      </div>
      <span v-else>{{ currentLabel }}</span>
    </slot>
  </li>
</template>

<script lang="ts">
  import Vue from "vue";
  import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
  import Emitter from "@/components/mixins/emitter";
  
  interface Dropdown {
    [propName: string]: any;
  }

  @Component({
    name: 'ynOption',
    inject: ['dropdown']
  })
  export default class DropdownItem extends Mixins(Vue, Emitter) {
    static componentName = 'YnDropdownItem';
    index = -1;
    visible = true;
    hitState = false;
    hover = false;
    dropdown!: Dropdown;
    isChecked = false;

    @Prop({
      type: [String, Number],
      required: true
    })
    value!: number | string;
    @Prop({
      type: [String, Number],
      required: true
    })
    label!: number | string;
    @Prop({
      type: Boolean,
      default: false
    })
    disabled!: boolean;
    @Prop({
      type: String,
      default: "" // checkbox
    })
    type!: string;
    @Prop({
      type: Boolean,
      default: false
    })
    checked!: boolean;

    get isObject() {
      return Object.prototype.toString.call(this.value).toLowerCase() === '[object object]';
    }
    get currentLabel() {
      return this.label || (this.isObject ? '' : this.value);
    }
    get currentValue() {
      return this.value || this.label || '';
    }
    get itemSelected() {
      if (!this.dropdown.multiple) {
        return this.isEqual(this.value, this.dropdown.value);
      } else {
        return this.contains(this.dropdown.value, this.value);
      }
    }

    @Watch("currentLabel")
    onCurrentLabel() {
      this.dispatch('YnSelect', 'setSelected');
    }
    @Watch("checked", {
      immediate: true
    })
    onChecked(n: boolean) {
      this.isChecked = n;
    }

    isEqual(a: number | string, b: number | string) {
      return a === b;
    }
    contains(arr: (string | number)[] = [], target: string | number) {
      return arr && arr.indexOf(target) > -1;
    }
    hoverItem() {
      if (!this.disabled) {
        this.dropdown.hoverIndex = this.dropdown.options.indexOf(this);
      }
    }
    selectOptionClick() {
      if (this.disabled !== true) {
        this.dispatch('YnDropdown', 'handleOptionClick', this);
      }
    }

    created() {
      this.dropdown.options.push(this);
      this.dropdown.cachedOptions.push(this);
      this.dropdown.optionsCount++;
    }
    beforeDestroy() {
      const { selected, multiple } = this.dropdown;
      let selectedOptions = multiple ? selected : [selected];
      let index = this.dropdown.cachedOptions.indexOf(this);
      let selectedIndex = selectedOptions.indexOf(this);

      // if option is not selected, remove it from cache
      if (index > -1 && selectedIndex < 0) {
        this.dropdown.cachedOptions.splice(index, 1);
      }
      this.dropdown.onOptionDestroy(this.dropdown.options.indexOf(this));
    }
  }
</script>
