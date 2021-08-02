<template>
  <div>
    <h2>yn-category-select</h2>
    <yn-category-select
      :categories="category"
      v-on:handleClick="handleClick"
    ></yn-category-select>
  </div>
</template>
<script>
export default {
  name: "YnCategorySelectPage",
  data() {
    return {
      category: [
        { name: "数码", catId: 1, level: 1, selected: false },
        { name: "电脑、办公", catId: 2, level: 1, selected: false },
        { name: "家用电器", catId: 3, level: 1, selected: false },
        { name: "服饰内衣", catId: 4, level: 1, selected: false },
        { name: "美妆护肤", catId: 5, level: 1, selected: true },
        { name: "运动户外", catId: 6, level: 1, selected: false},
        { name: "母婴", catId: 7, level: 1, selected: false },
        { name: "食品饮料", catId: 8, level: 1, selected: false },
        { name: "家居日用", catId: 9, level: 1, selected: false },
        { name: "礼品", catId: 10, level: 1, selected: false },
        { name: "钟表", catId: 11, level: 1, selected: false },
        { name: "厨具", catId: 12, level: 1, selected: false },
        { name: "玩具乐器", catId: 13, level: 1, selected: false },
        { name: "汽车用品", catId: 14, level: 1, selected: false },
      ],
    };
  },
  methods: {
    handleClick(e) {
      console.log(e);
    },
  }
};
</script>
