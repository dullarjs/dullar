<template>
  <h1 @click="handleClick">这是第{{num}}个元素, {{ checked }}</h1>
</template>
<script>
export default {
  name: "pageListItem",
  props: {
    num: Number,
    checked: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    handleClick() {
      this.$emit("click", this.$props.num);
    }
  },
  created() {
    // console.log("item page created");
  },
  mounted() {
    // console.log("item page mounted");
  },
  updated() {
    // console.log("item page updated");
  }
}
</script>