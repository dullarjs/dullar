<template>
  <div class="shipping-tooltip-box">
    <h2>yn-tooltip</h2>
    <div class="tooltip-box-main">
      <div>
        <yn-tooltip
          trigger="hover"
          placement="top"
          content="top我是tooltip撒旦发生口角是否数据库恢复瑟夫数据返回上课时间发货时间看"
        >
          <yn-button class="mt30 new-position" style="z-index: 2" type="text"
            >top</yn-button
          >
        </yn-tooltip>
      </div>
      <!-- <div class="middle"> -->
      <div>
        <yn-tooltip
          trigger="hover"
          placement="left"
          content="left我是tooltip撒旦发生口角是否数据库恢复瑟夫数据返回上课时间发货时间看"
        >
          <yn-button class="mt30" type="text">left </yn-button>
        </yn-tooltip>
      </div>
      <div>
        <yn-tooltip
          trigger="hover"
          placement="right"
          effect="light"
          content="right我是撒旦发生撒旦发生口角是否数据库恢复瑟夫数据返回上课时间发货时间看"
        >
          <yn-button class="mt30" type="text">right</yn-button>
        </yn-tooltip>
      </div>
      <!-- </div> -->
      <div>
        <yn-tooltip
          :delay="200"
          trigger="hover"
          placement="bottom"
          content="bottom我是tooltip撒旦发生口角是否数据库恢复瑟夫数据返回上课时间发货时间看"
        >
          <yn-button class="mt30" type="text">bottom</yn-button>
        </yn-tooltip>
      </div>
      <div class="bottom">
        <div>
          <yn-tooltip
            @visibleChange="onVisibleChange2"
            content="我是tooltip"
            trigger="click"
          >
            <yn-button class="mt30" type="text">click</yn-button>
          </yn-tooltip>
        </div>
        <div>
          <yn-tooltip
            @visibleChange="onVisibleChange1"
            trigger="focus"
            effect="light"
          >
            <yn-button class="mt30" type="text">focus</yn-button>
            <div slot="content">我是内容分发的focus。</div>
          </yn-tooltip>
        </div>
        <div>
          <yn-tooltip
            :delay="200"
            placement="right"
            effect="light"
            trigger="hover"
          >
            <yn-button class="mt30" type="text">hover 插槽</yn-button>
            <div slot="content">
              <p>我是tooltip我是tooltip</p>
              <p>我是tooltip我是tooltip</p>
              <p>我是tooltip我是tooltip</p>
            </div>
          </yn-tooltip>
        </div>
        <div>
          <yn-tooltip
            @visibleChange="onVisibleChange"
            placement="right"
            effect="light"
            trigger="hover"
          >
            <yn-button class="mt30" type="text">hover 插槽</yn-button>
            <div slot="content">
              <p>visibleChange</p>
            </div>
          </yn-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "YnTooltipPage",
  data() {
    return {};
  },
  methods: {
    onVisibleChange(val) {
      console.log("val", val);
    },
    onVisibleChange1(val) {
      console.log("valfocus", val);
    },
    onVisibleChange2(val) {
      console.log("valclick", val);
    },
  },
};
</script>
<style type="text/css" scoped="scoped">
.tooltip-box-main {
  text-align: center;
  margin-left: 500px;
  margin-top: 300px;
  transform: translate(-50%, -50%);
  position: relative;
}
.middle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
}
.mt30 {
  margin-top: 30px;
}
.new-position {
  position: absolute;
  top: 100px;
  left: 100px;
  /* bottom: 0; */
  /* right: 100px; */
}
</style>
