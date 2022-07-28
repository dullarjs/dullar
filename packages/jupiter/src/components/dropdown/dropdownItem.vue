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
  import { Vue, Options, mixins, prop } from "vue-class-component";
  
  interface Dropdown {
    [propName: string]: any;
  }
  class Props {
    value = prop<number | string>({ default: "" })
    label = prop<number | string>({ default: "" })
    disabled = prop<boolean>({ default: false })
    type = prop<string>({ default: "" })
    checked = prop<boolean>({ default: false })
  }
  @Options({
    name: 'YnDropdownItem',
    inject: ['dropdown'],
    watch: {
      currentLabel() {
        // this.dispatch('YnSelect', 'setSelected');
        this.dropdown.setSelected();
      },
      checked: {
        immediate: true,
        handler(n: boolean) {
          this.isChecked = n;
        }
      }
    }
  })
  export default class DropdownItem extends mixins(Vue).with(Props) {
    static componentName = 'YnDropdownItem';
    index = -1;
    visible = true;
    hitState = false;
    hover = false;
    dropdown!: Dropdown;
    isChecked = false;

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
        // this.dispatch('YnDropdown', 'handleOptionClick', this);
        this.dropdown.handleOptionSelect();
      }
    }

    created() {
      this.dropdown.options.push(this);
      this.dropdown.cachedOptions.push(this);
      this.dropdown.optionsCount++;
    }
    beforeDestroy() {
      const { selected, multiple } = this.dropdown;
      const selectedOptions = multiple ? selected : [selected];
      const index = this.dropdown.cachedOptions.indexOf(this);
      const selectedIndex = selectedOptions.indexOf(this);

      // if option is not selected, remove it from cache
      if (index > -1 && selectedIndex < 0) {
        this.dropdown.cachedOptions.splice(index, 1);
      }
      this.dropdown.onOptionDestroy(this.dropdown.options.indexOf(this));
    }
  }
</script>
