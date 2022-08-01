<template>
  <div
    class="yn-select-dropdown yn-popper"
    :class="[popperClass]"
    :style="{ minWidth: minWidth }">
    <slot></slot>
  </div>
</template>

<script type="text/babel">
  import "./style/index.scss";
  import Popper from '@/utils/vue-popper';
  import { Vue, Options, mixins } from "vue-class-component";
  @Options({
    name: 'YnSelectDropdown',
    componentName: 'YnSelectDropdown',
    props: {
      placement: {
        default: 'bottom-start'
      },

      boundariesPadding: {
        default: 0
      },

      popperOptions: {
        default() {
          return {
            gpuAcceleration: false
          };
        }
      },

      visibleArrow: {
        default: false
      },

      appendToBody: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        minWidth: ''
      };
    },
    computed: {
      popperClass() {
        return this.$parent.popperClass;
      }
    },
    watch: {
      '$parent.inputWidth'() {
        this.minWidth = this.$parent.$el.getBoundingClientRect().width + 'px';

      }
    }
  })
  export default class SelectDropdown extends mixins(Vue, Popper) {
    mounted() {
      this.referenceElm = this.$parent.$refs.reference.$el;
      this.$parent.popperElm = this.popperElm = this.$el;
      // this.$on('updatePopper', () => {
      //   if (this.$parent.visible) this.updatePopper();
      // });
      // this.$on('destroyPopper', this.destroyPopper);
    }
  }
</script>
