<!--
 * @Author: yegl
 * @Date: 2021-09-02 19:00:52
 * @Last Modified by: yegl
 * @Last Modified time: 2021-09-04 21:27:41
 * @E-mail: yglgzyx@126.com
-->
<template>
    <div>
      <h2>yn-calendar</h2>
      <p>基础用法</p>
      <yn-calendar
        :defaultValue="defaultValue"
        @onHandleChange="onChange"
      ></yn-calendar>
      <p>时间段（最小、最大时间控制, 日历框单独显示待日后优化）</p>
      <yn-flex justifyContent="flexStart" flexDirection="row" flexWrap="nowrap" class="yn-calendar-content">
        <yn-flex-item>
          <yn-calendar
            :defaultValue="startDate"
            :bordered="false"
            :icon="false"
            :width="90"
            :endDate="endDate"
            placeholder="起始日期"
            @onHandleChange="onChangeStart"
          ></yn-calendar>
        </yn-flex-item>
        <yn-flex-item>至</yn-flex-item>
        <yn-flex-item align-self="flex-end">
          <yn-calendar
            :defaultValue="endDate"
            :bordered="false"
            :icon="false"
            :width="90"
            :beginDate="startDate"
            placeholder="结束日期"
            @onHandleChange="onChangeEnd"
          ></yn-calendar>
        </yn-flex-item>
      </yn-flex>
    </div>
  </template>
  <script type="text/javascript">
  export default {
    name: "YnCalendarPage",
    data() {
      return {
        defaultValue: "2021-09-06",
        startDate: "",
        endDate: "",
      };
    },
    methods: {
      onChange(value) {
        this.defaultValue = value;
        console.log(this.defaultValue);
      },
      onChangeStart(value) {
        this.startDate = value;
        console.log(this.startDate);
      },
      onChangeEnd(value) {
        this.endDate = value;
        console.log(this.endDate);
      }
    }
  };
  </script>

<style type="text/css" scoped="scoped">
.yn-calendar-content{
  line-height: 32px;
}
.yn-calendar-content > div{
  border-top: 1px solid #c4c4c4;
  border-bottom: 1px solid #c4c4c4;
}
.yn-calendar-content > div:first-child{
  border-left: 1px solid #c4c4c4;
}
.yn-calendar-content > div:last-child{
  border-right: 1px solid #c4c4c4;
}
</style>