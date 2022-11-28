<template>
  <yn-pull-refresh
    v-model="refresh2"
    loadingStatusText="加载中"
    :loadingTexts='["下拉提示文案", "松手提示文案", "加载中的文案", "刷新成功"]'
    @refresh="handleRefresh2"
  >
    <div>
      <h2>yn-pull-refresh</h2>
<!--      <yn-pull-refresh-->
<!--        loadingText="加载中的文案"-->
<!--        draggingTip="下拉提示文案"-->
<!--        triggerLoadingText="松手提示文案"-->
<!--        loadingSuccessText="加载完成文案"-->
<!--        :cancelBubbles="cancelBubbles"-->
<!--        @pullRefresh="handlePullRefresh"-->
<!--        :loading="isLoading"-->
<!--      >-->
<!--        <div class="cancel-bubble-event" v-if="show">-->
<!--          我是一块比较特殊的区域，拖拽我的话将不生效。不信你试试-->
<!--        </div>-->
<!--        <button @click="refresh">refresh</button>-->
<!--        <ul>-->
<!--          <li v-for="i in list" :key="i">{{ i }}</li>-->
<!--        </ul>-->
<!--      </yn-pull-refresh>-->
      <yn-button @click="openDrawer">打开yn-drawer</yn-button>

      <div class="content" style="padding: 0 16px; background-color: #fff">
        <ul>
          <li v-for="i in list" :key="i">{{ i }}</li>
        </ul>
        <yn-spin type="rotate-svg" />
        <yn-drawer :popupStyle="popupStyle" v-model="showDrawer">
          <ul>
            <li v-for="i in 100" :key="i">{{ i }}</li>
          </ul>
        </yn-drawer>
      </div>
    </div>
  </yn-pull-refresh>
</template>
<script type="text/javascript">
export default {
  name: "YnPullRefreshPage",
  data() {
    return {
      isLoading: false,
      list: [],
      index: 0,
      cancelBubbles: [".cancel-bubble-event"],
      show: true,
      refresh2: false,
      showDrawer: false,
      popupStyle: {
        height: "80%",
      },
    };
  },
  mounted() {
    this.load(0);
  },
  methods: {
    openDrawer() {
      this.showDrawer = !this.showDrawer;
    },
    refresh() {
      this.show = false;
      setTimeout(() => {
        this.show = true;
      }, 100);
    },
    load(time = 3000, callback) {
      const timer = setTimeout(() => {
        for (let i = this.index * 10; i < (this.index + 1) * 10; i++) {
          this.list.unshift(i);
        }
        callback && typeof callback === "function" && callback();
        clearTimeout(timer);
        this.index++;
      }, time);
    },
    handlePullRefresh() {
      this.isLoading = true;
      this.load(3000, () => {
        this.isLoading = false;
      });
    },
    handleRefresh2() {
      this.refresh2 = true;
      this.timer = setTimeout(() => {
        const length = this.list.length;
        for (let i = length + 1; i <= 10 + length; i++) {
          this.list.push(i);
        }
        this.refresh2 = false;
      }, 4000);
    },
  },
};
</script>

<style type="text/css" scoped="scoped">
ul {
  padding: 0;
  margin: 0;
}
ul li {
  list-style: none;
  line-height: 40px;
  text-align: center;
  border-bottom: 1px solid #e4e4e4;
}
.cancel-bubble-event {
  height: 100px;
  background: yellow;
  text-align: center;
  line-height: 50px;
}
</style>
