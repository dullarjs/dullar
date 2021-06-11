<template>
  <q-layout
    :monitor="true"
    @scroll="handleScroll"
    :showHeader="showHeader"
    @reachbottom="handleReachBottom"
    bottomDistance="500"
    @reachtop="handleReachTop"
    topDistance="100"
  >
    <template #header>
      <div class="header0">header</div>
    </template>
    <template #body>
      <div>
        body区域，可以滑动
        <div>
          <h2>q-layout</h2>
        </div>
        <template v-for="item in dataList" :key="item">
          <div>{{ item }}</div>
        </template>
        <q-spin type="triple-bounce"></q-spin>
      </div>
    </template>
    <template #footer>
      <div>footer</div>
    </template>
  </q-layout>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
// import Queen from "../../src/component/Queen";
const dataList = [];
for (let i = 0; i < 100; i++) {
  dataList.push(i);
}
export default class Layout extends Vue {
  public showHeader = false;
  public dataList = dataList;
  loadMore() {
    const length = this.dataList.length;
    setTimeout(() => {
      for (let i = length; i < 100 + length; i++) {
        this.dataList.push(i);
      }
    }, 1000);
  }
  handleReachBottom() {
    console.log("滚动到底部触发事件了");
    this.Toast("滚动到底部触发事件了");
    this.loadMore();
  }
  handleReachTop() {
    console.log("滚动到顶部了");
    this.Toast("滚动到顶部了");
  }
  handleScroll(e) {
    if (e.diff > 0) {
      this.showHeader = false;
    } else {
      this.showHeader = true;
    }
    console.log(e, e.diff);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header0 {
    /* height: 44px; */
    background: #ccc;
  }
</style>
