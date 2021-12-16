<template>
  <div class="container">
    <yn-magic-layer ref="magicLayer" @dragstart="handleDragstart" @dragging="handleDragging" @stoped="handleStpped" @transitionend="handleTransitionend">
      <div class="inner" :class="animated ? 'animated' : ''" ref="inner" slot="inner">
      </div>
      <div slot="outside" class="outside">
      </div>
    </yn-magic-layer>
  </div>
</template>
<script type="text/javascript">
  export default {
    name: "YnMagicLayerPage",
    data() {
      return {
        dragstart: false,
        dragging: false,
        indicatorFixed: true,
        opened: false,
        modalDom: null,
        popup: false,
        entered: false,
        currentIndex: -1,
        animated: false,
        images: [
          "https://pavo.elongstatic.com/i/Hotel350_350/JcPRJpObzW.jpg",
          "https://img.huazhu.com/cos/mdm/HN02000710/a9104687-333c-4930-92ec-930c95936876/2021-09-10-16-56-26-529.jpg",
          "http://pavo.elongstatic.com/i/Hotel350_350/0004XDSx.jpg",
          "https://pavo.elongstatic.com/i/Hotel350_350/LQECeEzOkU.jpg",
          "http://pavo.elongstatic.com/i/Hotel350_350/000ciKER.jpg"
        ]
      }
    },
    methods: {
      giveItATry() {
        this.Toast("点击触发了~~哈哈");
      },
      handleDragstart() {
        // this.dragstart = true;
      },
      handleTransitionend(e) {
        this.opened = e.opened;
        if (e.opened) {
          this.indicatorFixed = false;
        } else {
          this.indicatorFixed = true;
          this.dragstart = false;
        }
      },
      handleTicking(e) {
        if (!this.opened) {
          this.dragstart = false;
          // this.$refs.magicLayer.fold();
        }
        this.$refs.filter.style.backgroundImage = `url(${this.images[e.activeIndex - 1]})`;
      },
      handleTicking2(e) {
        this.modalDom.style.backgroundImage = `url(${this.images[e.activeIndex - 1]})`;
        this.modalDom.style.filter = "blur(20px)";
        this.modalDom.style.backgroundSize = "cover";
      },
      handleDragging(e) {
        this.dragstart = true;
        this.dragging = true;
        this.animated = false;
        this.$refs.inner.style.height = `${e.height}px`;
      },
      handleStpped(e) {
        this.opened = e.opened;
        this.dragging = false;
        this.animated = true;
        this.$refs.inner.style.height = `${e.height}px`;
      },
      handleClick(index) {
        if (!this.opened) {
          console.log("当前是第几个", index);
          this.popup = true;
          this.currentIndex = index;
        }
      },
      beforeEnter(e) {
        console.log("beforeEnter", e);
        this.modalDom = e.modal;
        this.$refs.swipex.stop();
      },
      afterEnter() {
        this.entered = true;
      },
      afterLeave() {
        this.$refs.swipex.play();
      }
    }
  };
</script>
<style type="text/css" scoped="scoped">
  .container {
    height: 100%;
  }
  .inner {
    height: 240px;
    overflow: hidden;
    position: relative;
    background: red;
  }
  .inner.animated {
    transition: height 0.5s ease;
  }
  .filter-background {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    filter: blur(20px);
    background-size: cover;
  }
  .outside {
    height: 100%;
    background: yellow;
  }
  .swipe-view-box {
    position: absolute;
    top: 50%;
    transform: translate3d(0, -50%, 0);
    width: 100%;
    height: auto;
  }
  .background {
    background:  rgba(0, 0, 0, 0) !important;
    /* filter: blur(20px); */
    /* width: 50% !important; */
  }
</style>
