<template>
  <div class="category-content">
    <h2>yn-category-mobile</h2>
    <div class="container">
      <yn-category-mobile :bottomDraggingTip="bottomDraggingTip" :topDraggingTip="topDraggingTip" @pullRefresh="handlePullRefresh" :mapKeys="mapKeys" :preload="preload" :categories="categories" :category="getCategory()"></yn-category-mobile>
    </div>
  </div>
</template>
<script type="text/javascript">
const categories = require("./categories.json").RECORDS;
const secCategory = require("./sec-category.json").data;
const preload = require("./preload.svg");
const firstClassCategory = [];
console.log(preload);
categories.forEach(cat => {
  if (cat.cat_desc === "一级分类") {
    firstClassCategory.push(cat);
  }
});
firstClassCategory.forEach(cat => {
  cat.id = cat.cat_id;
  cat.label = cat.cat_name;
});
export default {
  name: "YnCategoryMobilePage",
  data() {
    return {
      categories: [],
      preload,
      mapKeys: {
        id: "id",
        label: "label",
        imgUrl: "touchIcon",
        children: "children",
      },
      topDraggingTip: "下拉继续浏览",
      bottomDraggingTip: "上拉继续浏览"
    };
  },
  created() {
    setTimeout(() => {
      this.categories = firstClassCategory;
    }, 1000);
  },
  methods: {
    handlePullRefresh(e) {
      const { direction, status, currentTab } = e;
      if (status === "dragging") {
        if (direction === "top") {
          if (currentTab === 0) {
            this.topDraggingTip = "到顶啦";
          } else {
            const cat = this.categories[currentTab - 1];
            this.topDraggingTip = `下拉继续浏览${cat.cat_name}`;
          }
        } else {
          if (currentTab === this.categories.length - 1) {
            this.bottomDraggingTip = "到底啦";
          } else {
            const cat = this.categories[currentTab + 1];
            this.bottomDraggingTip = `上拉继续浏览${cat.cat_name}`;
          }
        }
      }
    },
    processingData(category) {
      // 处理数据
      const result = [];
      category.forEach(cat => {
        result.push(...cat.children);
      });
      return result;
    },
    requestCategory(params) {
      console.log(params);
      const category = this.processingData(secCategory);
      console.log("category = ", category);
      return new Promise((resolve, reject) => {
        category.forEach(cat => {
          cat.id = cat.catId;
          cat.label = cat.catName;
          Array.isArray(cat.children) && cat.children.forEach(subCat => {
            subCat.id = subCat.catId;
            subCat.label = subCat.catName;
          });
        });
        console.log(reject);
        setTimeout(() => {
          resolve(category);
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
