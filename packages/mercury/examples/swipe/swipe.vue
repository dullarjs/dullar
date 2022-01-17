<template>
  <div>
    <h2>yn-swipe</h2>
    <div class="box">
      <h3>左右滑动轮播图</h3>
      <yn-swipe ref="swipe1" :showCloseIcon="false" indicatorType="number">
        <yn-swipe-item>
          <div>
            <img src="./images/apple-1.jpg" />
          </div>
        </yn-swipe-item>
        <yn-swipe-item>
          <img src="./images/apple-2.jpg" />
        </yn-swipe-item>
        <yn-swipe-item>
          <img src="./images/apple-3.jpg" />
        </yn-swipe-item>
        <yn-swipe-item>
          <img src="./images/apple-4.jpg" />
        </yn-swipe-item>
        <yn-swipe-item>
          <img src="./images/apple-1.jpg" />
        </yn-swipe-item>
        <yn-swipe-item>
          <img src="./images/apple-2.jpg" />
        </yn-swipe-item>
        <yn-swipe-item>
          <img src="./images/apple-3.jpg" />
        </yn-swipe-item>
        <yn-swipe-item>
          <img src="./images/apple-4.jpg" />
        </yn-swipe-item>
      </yn-swipe>
      <div class="api">
        <span>对外接口</span>
        <yn-button @click="prev('swipe1')">prev</yn-button>
        <yn-button @click="next('swipe1')">next</yn-button>
        <yn-button @click="open('swipe1')">open</yn-button>
        <yn-button @click="open('swipe1')">close</yn-button>
      </div>
    </div>
    <div class="box">
      <h3>上下滑动轮播图</h3>
      <yn-swipe vertical :showCloseIcon="false" :autoPlay="false" ref="swipe2">
        <yn-swipe-item>
          <img src="./images/apple-1.jpg" />
        </yn-swipe-item>
        <yn-swipe-item>
          <img src="./images/apple-2.jpg" />
        </yn-swipe-item>
        <yn-swipe-item>
          <img src="./images/apple-3.jpg" />
        </yn-swipe-item>
        <yn-swipe-item>
          <img src="./images/apple-4.jpg" />
        </yn-swipe-item>
      </yn-swipe>
      <div class="api">
        <span>对外接口</span>
        <yn-button @click="prev('swipe2')">prev</yn-button>
        <yn-button @click="next('swipe2')">next</yn-button>
        <yn-button @click="next('swipe2')">open</yn-button>
        <yn-button @click="next('swipe2')">close</yn-button>
      </div>
    </div>
    <div class="box3">
      <h3>左右滑动轮播图</h3>
      <yn-swipe :height="400" hoverPause :imageViewer="false" arrow="hover" indicatorType="circular" trigger="click" :showCloseIcon="false" ref="swipe3">
        <yn-swipe-item>
          <img src="./images/apple-1.jpg" />
        </yn-swipe-item>
        <yn-swipe-item>
          <img src="./images/apple-2.jpg" />
        </yn-swipe-item>
        <yn-swipe-item>
          <img src="./images/apple-3.jpg" />
        </yn-swipe-item>
        <yn-swipe-item>
          <img src="./images/apple-4.jpg" />
        </yn-swipe-item>
      </yn-swipe>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "YnSwipePage",
  data() {
    return {};
  },
  methods: {
    prev(ref) {
      console.log(ref);
      this.$refs[ref].prev();
    },
    next(ref) {
      this.$refs[ref].next();
    },
    open(ref) {
      this.$refs[ref].openImageViewer();
    },
    close(ref) {
      this.$refs[ref].closeImageViewer();
    },
  },
};
</script>
<style type="text/css" scoped="scoped">
.box {
  margin: 20px auto;
  border-bottom: 1px solid #e4e4e4;
}
.api {
  height: 100px;
  line-height: 100px;
}
img {
  width: 100%;
  height: 240px;
}
.box3 img {
  height: 400px;
}
</style>
