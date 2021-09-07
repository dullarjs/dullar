<template>
  <div class="shipping-tooltip-box">
    <h2>yn-tooltip</h2>
    <div class="tooltip-box-main">
      <yn-tooltip
        trigger="hover"
        placement="top"
        content="top我是tooltip撒旦发生口角是否数据库恢复瑟夫数据返回上课时间发货时间看"
      >
        <yn-button class="mt30 new-position" type="text">top</yn-button>
      </yn-tooltip>
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
      <yn-tooltip
        trigger="hover"
        placement="right"
        effect="light"
        content="right我是撒旦发生撒旦发生口角是否数据库恢复瑟夫数据返回上课时间发货时间看"
      >
        <yn-button class="mt30" type="text">right</yn-button>
      </yn-tooltip>
      <!-- </div> -->
      <yn-tooltip
        trigger="hover"
        placement="bottom"
        content="bottom我是tooltip撒旦发生口角是否数据库恢复瑟夫数据返回上课时间发货时间看"
      >
        <yn-button class="mt30" type="text">bottom</yn-button>
      </yn-tooltip>
      <div class="bottom">
        <yn-tooltip content="我是tooltip" trigger="click">
          <yn-button class="mt30" type="text">click</yn-button>
        </yn-tooltip>
        <yn-tooltip trigger="focus" effect="light">
          <yn-button class="mt30" type="text">focus</yn-button>
          <div slot="content">我是内容分发的focus。</div>
        </yn-tooltip>
        <yn-tooltip placement="right" effect="light" trigger="hover">
          <yn-button class="mt30" type="text">hover 插槽</yn-button>
          <div slot="content">
            <p>我是tooltip我是tooltip</p>
            <p>我是tooltip我是tooltip</p>
            <p>我是tooltip我是tooltip</p>
          </div>
        </yn-tooltip>
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
  methods: {},
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
  left: 0;
  /* bottom: 0; */
  /* right: 100px; */
}
</style>
