<template>
  <form class="form">
    <slot></slot>
  </form>
</template>

<script>
export default {
  name: "form",
  props: {
    rule: {
      type: Object,
      default() {},
    },
    model: {
      type: Object,
    },
    "label-width": {
      type: String,
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },
  provide() {
    return {
      formWrap: this,
    };
  },
};
</script>

<style scoped></style>
