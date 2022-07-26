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
  import { Vue, Options, prop, mixins } from "vue-class-component";
  import Dropdown from "./dropdown.vue";
  import scrollbar from "@/components/scrollbar";
  class Props {
    visibleArrow = prop<boolean>({ default: true });
  }
  @Options({
    name: "YnDropdownMenu",
    components: {
      scrollbar
    },
    inject: ["dropdown"],
    watch: {
      "dropdown.placement": {
        immediate: true,
        handler(val: string) {
          this.currentPlacement = val;
        }
      }
      "dropdown.visible"(val: boolean) {
        this.showPopper = val;
      }
    }
  })
  export default class DropdownMenu extends mixins(Vue, Popper).with(Props) {
    static componentName = 'YnDropdownMenu';
    dropdown!: Dropdown;

    created() {
      // this.$on('visible', (val: boolean) => {
      //   this.showPopper = val;
      // });
      // this.$on('updatePopper', () => {
      //   if (this.showPopper) this.updatePopper();
      // });
      // this.$on('destroyPopper', this.destroyPopper);
    }
    mounted() {
      this.referenceElm = this.dropdown.$el as HTMLElement;
      this.dropdown.popperElm = this.popperElm = this.$el as HTMLElement;
    }
  }
</script>
