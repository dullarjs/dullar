<template>
  <div class="category-content">
    <h2>yn-category-mobile</h2>
    <div class="container">
      <yn-category-mobile :categories="categories" :category="getCategory()"></yn-category-mobile>
    </div>
  </div>
</template>
<script type="text/javascript">
const categories = require("./categories.json").RECORDS;
const secCategory = require("./sec-category.json").category;
console.log("sec = ", secCategory);
const firstClassCategory = [];
categories.forEach(cat => {
  if (cat.cat_desc === "一级分类") {
    firstClassCategory.push(cat);
  }
});
firstClassCategory.forEach(cat => {
  cat.id = cat.cat_id;
  cat.label = cat.cat_name;
});
console.log(firstClassCategory);
export default {
  name: "YnCategoryMobilePage",
  data() {
    return {
      categories: firstClassCategory
    };
  },
  methods: {
    requestCategory(params) {
      console.log(params);
      return new Promise((resolve, reject) => {
        secCategory.forEach(cat => {
          cat.children = cat.cat_id;
          Array.isArray(cat.children) && cat.children.forEach(subCat => {
            subCat.imgUrl = subCat.cat_img;
          });
          cat.label = cat.name;
          cat.imgUrl = cat.cat_img;
        });
        console.log(reject);
        setTimeout(() => {
          resolve(secCategory);
        }, 1000);
      }).catch((err) => {
        // reject(err);
        console.log(err);
      })
    },
    getCategory() {
      return {
        params: { a: 1, b: 2, c: 3 },
        action: this.requestCategory,
        parse: (e, params) => {
          console.log(e, params);
        }
      }
    }
  }
};
</script>

<style type="text/css" scoped="scoped">
.category-content {
  /* margin: 20px; */
}
.container {
  height: 400px;
  width: calc(100% - 2px);
  border:  1px solid #ccc;
}
</style>
