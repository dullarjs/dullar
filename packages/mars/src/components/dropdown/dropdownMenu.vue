<template>
  <div
    ref="popper"
    class="yn-dropdown-menu yn-popper"
    v-show="showPopper"
    >
    <scrollbar
        tag="ul"
        wrapClass="yn-dropdown-menu__wrap"
        viewClass="yn-dropdown-menu__list"
        ref="scrollbar"
      >
        <slot></slot>
    </scrollbar>
  </div>
</template>

<script lang="ts">
  import "./style/index.scss";
  import Popper from '@/utils/vue-popper';
  import Vue from "vue";
  import { Component, Prop, Watch, Mixins } from "vue-property-decorator";
  import Dropdown from "./dropdown.vue";
  import scrollbar from "@/components/scrollbar";

  @Component({
    name: "YnDropdownMenu",
    components: {
      scrollbar
    },
    inject: ["dropdown"]
  })
  export default class DropdownMenu extends Mixins(Vue, Popper) {
    static componentName = 'YnDropdownMenu';
    dropdown!: Dropdown;

    @Prop({
      type: Boolean,
      default: true
    })
    visibleArrow = true;

    @Watch("dropdown.placement", {
      immediate: true
    })
    onDropdownPlacement(val: string) {
      this.currentPlacement = val;
    }

    created() {
      this.$on('visible', (val: boolean) => {
        this.showPopper = val;
      });
      this.$on('updatePopper', () => {
        if (this.showPopper) this.updatePopper();
      });
      // this.$on('destroyPopper', this.destroyPopper);
    }
    mounted() {
      this.referenceElm = this.dropdown.$el as HTMLElement;
      this.dropdown.popperElm = this.popperElm = this.$el as HTMLElement;
    }
  }
</script>
