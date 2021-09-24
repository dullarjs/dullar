<template>
  <div class="form-item">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "form",
  inject: ["formWrap"],
  data() {
    return {
      formWrap: this.formWrap,
    };
  },
  props: {
    prop: {
      type: String,
      default() {},
    },
    label: {
      type: String,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    console.log(this.formWrap);
  },
};
</script>

<style scoped></style>
