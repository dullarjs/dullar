<template>
  <li
    @mouseenter="hoverItem"
    @click.stop="selectOptionClick"
    class="yn-select-dropdown__item"
    v-show="visible"
    :class="{
      'selected': itemSelected,
      'is-disabled': disabled,
      'hover': hover
    }">
    <slot>
      <span>{{ currentLabel }}</span>
    </slot>
  </li>
</template>

<script lang="ts">
  import { Vue, Options, mixins, prop } from "vue-class-component";

  interface Select {
    [propName: string]: any;
  }
  class Props {
    value!: number | string;
    label!: number | string;
    disabled!: boolean;
  }
  @Options({
    name: 'ynOption',
    inject: ['select'],
    watch: {
      currentLabel() {
        // this.dispatch('YnSelect', 'setSelected');
        this.select.setSelected()
      }
    }
  })
  export default class Option extends mixins(Vue).with(Props) {
    static componentName = 'YnOption';
    index = -1;
    visible = true;
    hitState = false;
    hover = false;
    select!: Select;

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
      if (!this.select.multiple) {
        return this.isEqual(this.value, this.select.value);
      } else {
        return this.contains(this.select.value, this.value);
      }
    }

    isEqual(a: number | string, b: number | string) {
      return a === b;
    }
    contains(arr: (string | number)[] = [], target: string | number) {
      return arr && arr.indexOf(target) > -1;
    }
    hoverItem() {
      if (!this.disabled) {
        this.select.hoverIndex = this.select.options.indexOf(this);
      }
    }
    selectOptionClick() {
      if (this.disabled !== true) {
        // this.dispatch('YnSelect', 'handleOptionClick', this);
        this.select.handleOptionSelect();
      }
    }

    created() {
      this.select.options.push(this);
      this.select.cachedOptions.push(this);
      this.select.optionsCount++;
    }
    beforeDestroy() {
      const { selected, multiple } = this.select;
      let selectedOptions = multiple ? selected : [selected];
      let index = this.select.cachedOptions.indexOf(this);
      let selectedIndex = selectedOptions.indexOf(this);

      // if option is not selected, remove it from cache
      if (index > -1 && selectedIndex < 0) {
        this.select.cachedOptions.splice(index, 1);
      }
      this.select.onOptionDestroy(this.select.options.indexOf(this));
    }
  }
</script>
