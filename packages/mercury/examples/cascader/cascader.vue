<!--
 * @Author: yegl
 * @Date: 2021-07-30 18:54:02
 * @Last Modified by: yegl
 * @Last Modified time: 2021-08-02 18:12:28
 * @E-mail: yglgzyx@126.com
-->
<template>
  <div>
    <h2>yn-cascader</h2>
    <yn-cascader
      :categories="leaveOne"
      v-on:handleClick="handleClick"
    ></yn-cascader>
    <yn-cascader
      :categories="leaveTwo"
      v-on:handleClick="handleClick"
    ></yn-cascader>
    <yn-cascader
      :categories="leaveThree"
      v-on:handleClick="handleClick"
    ></yn-cascader>
  </div>
</template>
<script>
export default {
  name: "YnCascaderPage",
  data() {
    return {
      leaveOne: [
        { name: "数码", catId: 1, level: 1 },
        { name: "电脑、办公", catId: 2, level: 1 },
        { name: "家用电器", catId: 3, level: 1 },
        { name: "服饰内衣", catId: 4, level: 1 },
        { name: "美妆护肤", catId: 5, level: 1, selected: true },
        { name: "运动户外", catId: 6, level: 1},
        { name: "母婴", catId: 7, level: 1 },
        { name: "食品饮料", catId: 8, level: 1 },
        { name: "家居日用", catId: 9, level: 1 },
        { name: "礼品", catId: 10, level: 1 },
        { name: "钟表", catId: 11, level: 1 },
        { name: "厨具", catId: 12, level: 1 },
        { name: "玩具乐器", catId: 13, level: 1 },
        { name: "汽车用品", catId: 14, level: 1 },
      ],
      leaveTwo: [
        { name: "美妆护肤-2级分类0", catId: 1, level: 1 },
        { name: "美妆护肤-2级分类1", catId: 1, level: 1 },
        { name: "美妆护肤-2级分类2", catId: 1, level: 1 },
        { name: "美妆护肤-2级分类3", catId: 1, level: 1 },
        { name: "美妆护肤-2级分类4", catId: 1, level: 1 },
        { name: "美妆护肤-2级分类5", catId: 1, level: 1 },
        { name: "美妆护肤-2级分类6", catId: 1, level: 1 },
        { name: "美妆护肤-2级分类7", catId: 1, level: 1 },
        { name: "美妆护肤-2级分类8", catId: 1, level: 1 },
        { name: "美妆护肤-2级分类9", catId: 1, level: 1 },
      ],
      leaveThree: []
    };
  },
  methods: {
    handleClick(e) {
      if (e.level === 1 || e.level === 2) {
        this.getNewList(e);
      }
      console.log(e);
    },
    getNewList(catInfo) {
      const list = []; 
      for (let i = 0; i < 10; i++) {
        const newCat = {};
        newCat.level = catInfo.level + 1
        newCat.name = catInfo.name + '-' + newCat.level + '级分类' + i;
        newCat.catId = catInfo.catId + '-'  + i;
        list.push(newCat);
      }
      if (catInfo.level === 1) {
        this.leaveTwo = [ ...list ];
        this.leaveThree = [];
      } else {
        this.leaveThree = [ ...list ];
      }
    }
  }
};
</script>
