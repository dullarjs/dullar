<template>
  <div class="category-content">
    <h2>yn-category</h2>
    <yn-category :categories="category"></yn-category>
  </div>
</template>
<script type="text/javascript">
const category = require("./category.json");
export default {
  name: "YnCategoryPage",
  data() {
    return {
      category
    };
  },
  methods: {
  }
};
</script>

<style type="text/css" scoped="scoped">
.category-content {
  margin: 20px;
}
</style>
