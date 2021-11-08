<template>
  <div>
    <h2>yn-swipe</h2>
    <div class="box">
      <h3>左右滑动轮播图</h3>
      <yn-swipe ref="swipe1" indicatorType="number">
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
      </yn-swipe>
      <div class="api">
        <span>对外接口</span>
        <yn-button @click="prev('swipe1')">prev</yn-button>
        <yn-button @click="next('swipe1')">next</yn-button>
        <yn-button @click="open('swipe1')">open</yn-button>
        <yn-button @click="close('swipe1')">close</yn-button>
      </div>
    </div>
    <div class="box">
      <h3>上下滑动轮播图</h3>
      <yn-swipe vertical ref="swipe2">
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
        <yn-button @click="open('swipe2')">open</yn-button>
        <yn-button @click="close('swipe2')">close</yn-button>
      </div>
    </div>
    <div class="box">
      <h3>酒店轮播图</h3>
      <yn-swipe indicatorType="number" :autoPlayWhenPopup="false">
        <yn-swipe-item tag="1" resource="https://pavo.elongstatic.com/i/Hotel350_350/LQECeEzOkU.jpg">
          <div>
            <img src="https://pavo.elongstatic.com/i/Hotel350_350/LQECeEzOkU.jpg" />
          </div>
        </yn-swipe-item>
        <yn-swipe-item tag="2" resource="http://pavo.elongstatic.com/i/Hotel350_350/000ciKER.jpg">
          <img src="http://pavo.elongstatic.com/i/Hotel350_350/000ciKER.jpg" />
        </yn-swipe-item>
        <yn-swipe-item tag="3" resource="http://pavo.elongstatic.com/i/Hotel350_350/000cfX2X.jpg">
          <img src="http://pavo.elongstatic.com/i/Hotel350_350/000cfX2X.jpg" />
        </yn-swipe-item>
        <yn-swipe-item tag="4" resource="http://pavo.elongstatic.com/i/Hotel350_350/L4sfKCVY64.jpg">
          <img src="http://pavo.elongstatic.com/i/Hotel350_350/L4sfKCVY64.jpg" />
        </yn-swipe-item>
        <yn-swipe-item tag="5" resource="http://pavo.elongstatic.com/i/Hotel350_350/L4sfz6LKVO.jpg">
          <img src="http://pavo.elongstatic.com/i/Hotel350_350/L4sfz6LKVO.jpg" />
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
    }
  }
};
</script>
<style type="text/css">
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
</style>
