<template>
  <!-- <div>
    <h2>yn-layout</h2>
  </div> -->
  <yn-layout monitor @scroll="handleScroll" :showHeader="showHeader">
    <div slot="header" class="header">header</div>
    <div slot="body">
      body区域，可以滑动
      <template v-for="item in 200">
        <div v-if="item === 20" :key="item">
          <yn-sticky offsetTop="100" @scroll="handleStickyScroll">
            <span>我固定在某个位置{{ item }}</span>
          </yn-sticky>
        </div>
        <div v-else-if="item === 100" :key="item">
          <yn-sticky offsetTop="0">
            <span>我固定在某个位置{{ item }}</span>
          </yn-sticky>
        </div>
        <div v-else-if="item === 120" :key="item">
          <div class="box111" ref="container">
            <yn-sticky :container="container" class="has-container">
              <span>我固定在某个位置{{ item }}</span>
            </yn-sticky>
          </div>
        </div>
        <div v-else :key="item">{{ item }}</div>
      </template>
    </div>
    <div slot="footer">footer</div>
  </yn-layout>
</template>
<script>
export default {
  name: "YnStickyPage",
  data() {
    return {
      showHeader: true,
      container: null
    };
  },
  methods: {
    handleScroll(e) {
      if (e.diff > 0) {
        this.showHeader = false;
      } else {
        this.showHeader = true;
      }
    },
    handleStickyScroll(e) {
      console.log(
        "当前滚动scrollTop",
        e.scrollTop,
        ";距离顶部的距离",
        e.offsetTop
      );
    }
  },
  mounted() {
    this.container = this.$refs.container[0];
  }
};
</script>
<style type="text/css">
div.header {
  background: yellow;
  height: 100%;
}
div.box111 {
  text-align: right;
  height: 200px;
  width: 100%;
  background: #ccc;
}
.has-container {
  width: 100%;
  text-align: right;
}
</style>
