<template>
  <!-- <yn-layout
    monitor
    @scroll="handleScroll"
    :showHeader="showHeader"
    @reachBottom="handleReachBottom"
    bottomDistance="500"
    @reachTop="handleReachTop"
    topDistance="100"
  >
    <div slot="header" class="header">header</div>
    <div slot="body">
      <yn-animation-list :dataList="dataList">
        <yn-animation-list-item style="borderBottom: 1px solid #eee;line-height: 40px" height="40" v-for="i in dataList" :key="i">
          <span>这是第{{i}}个元素</span>
        </yn-animation-list-item>
      </yn-animation-list>
      <yn-spin type="triple-bounce"></yn-spin>
    </div>
    <div slot="footer">footer</div>
  </yn-layout> -->
  <div>
    <yn-button @click="filter">数组反转</yn-button>
    <!-- <yn-dialog v-model="showDialog">
      外面的弹窗
    </yn-dialog> -->
    <yn-animation-list ref="animation">
      <yn-animation-list-item height="100" v-for="i in asyncData" :key="i.index">
        <!-- <div style="height: 100px;" :class="[i.index % 2 === 0 ? 'hide' : '']">这是第{{i.index}}个元素</div> -->
        <!-- <div v-if="i.index %2 === 0">这是第{{i.index}}个元素</div> -->
        <div v-if="i.index === 5">
          这是第{{i.index}}个元素 <span @click="dialog">注意有弹窗{{showDialog}}</span>
          <yn-dialog v-model="showDialog">
            弹窗后页面还能滑动吗
          </yn-dialog>
        </div>
        <div v-else>这是第{{i.index}}个元素</div>
        <!-- <div>
          <item :num="i.index"></item>
        </div> -->
        <!-- <item class="test-class" name="item" :num="i.index" @click="handleItemClick"></item> -->
      </yn-animation-list-item>
    </yn-animation-list>
  </div>
</template>
<script>
// const item = () => import("./item.vue");
export default {
  name: "YnAnimationListPage",
  components: {
    // item
  },
  data() {
    const dataList = [];
    for (let i = 0; i < 200; i++) {
      dataList.push(i);
    }
    return {
      showHeader: true,
      dataList,
      asyncData: [],
      animation: true,
      showDialog: false
    };
  },
  methods: {
    handleItemClick(num) {
      console.log("handleItemClick", num);
    },
    dialog() {
      this.animation = false;
      this.showDialog = true;
    },
    filter() {
      // this.asyncData.reverse();
      this.animation = false;
      const shuffle = this.shuffle(this.asyncData);
      console.log("过滤", shuffle);
      this.asyncData = JSON.parse(JSON.stringify([...shuffle]));
      // this.asyncData = [];
      // this.asyncData = [10, 9, 8];
    },
    getData() {
      console.log("getData");
      const timer = setTimeout(() => {
        for (let i = 0; i < 200; i++) {
          this.asyncData.push({ index: i });
        }
        clearTimeout(timer);
      }, 1000);
    },
    loadMore() {
      const length = this.dataList.length;
      setTimeout(() => {
        for (let i = length; i < 200 + length; i++) {
          this.dataList.push(i);
        }
      }, 1000);
    },
    handleReachBottom() {
      console.log("滚动到底部触发事件了");
      this.Toast("滚动到底部触发事件了");
      this.loadMore();
    },
    handleReachTop() {
      console.log("滚动到顶部了");
      this.Toast("滚动到顶部了");
    },
    handleScroll(e) {
      if (e.diff > 0) {
        this.showHeader = false;
      } else {
        this.showHeader = true;
      }
      console.log(e, e.diff);
    },
    shuffle(aArr) {
      let iLength = aArr.length
        , i = iLength
        , nTemp
        , iRandom;
      while ( i-- ) {
        if (i !== (iRandom = Math.floor(Math.random()*iLength))) { // 不是同一个数组项的前提下进行互换
          nTemp = aArr[i];
          aArr[i] = aArr[iRandom];
          aArr[iRandom] = nTemp;
        }
      }
      return aArr;
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style type="text/css">
.infinite-list-box {
  text-align: center;
}
.hide {
  display: none;
}
hr {
  border: none;
}
</style>
