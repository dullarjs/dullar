<template>
  <div class="category-content">
    <h2>yn-category</h2>
    <yn-category :delay="80" :categories="category2" :category="getCategory()" @pick="handlePicked"></yn-category>
  </div>
</template>
<script type="text/javascript">
const category = require("./category.json").data;
const category2 = require("./mall.json").data.categoryList;
// console.log("222", category);
export default {
  name: "YnCategoryPage",
  data() {
    return {
      category2
    };
  },
  mounted() {
    console.log(this.processingData(category));
  },
  methods: {
    handlePicked(item) {
      console.log("item = ", item);
    },
    processingData() {
      // 处理数据
      const result = [];
      category.forEach(cat => {
        result.push(...cat.children);
      });
      return result;
    },
    requestCategory(args) {
      console.log(args);
      return new Promise((resolve, reject) => {
        console.log(reject);
        setTimeout(() => {
          resolve(this.processingData(category));
        }, 1000);
      });
    },
    getCategory() {
      return {
        params: { a: 1, b: 2, c: 3 },
        action: this.requestCategory,
        parse: (e) => {
          return e.showName ? e.showName : e.catName;
        }
      }
    }
  }
};
</script>

<style type="text/css" scoped="scoped">
.category-content {
  margin: 20px;
  background: #eee;
  height: 100%;
}
</style>
