<template>
  <div class="date-picker-page">
    <h2>yn-date-picker</h2>
    <ul>
      <li>
        <div>
          <h2 type="text">
            单选日历默认，无指定默认日期
          </h2>
        </div>
        <span class="selected-time-txt">已选择时间：{{ calendar1Date }}</span>
        <yn-date-picker
          mode="single"
          :before="10"
          :after="10"
          v-model="calendar1"
          v-on:getDate="handleOnGetDate1"
          @afterLeave="handleAfterLeave"
        ></yn-date-picker>
      </li>
      <li>
        <div>
          <h2>
            多选日历默认，无指定默认日期
          </h2>
        </div>
        <span class="selected-time-txt">已选择时间：{{ calendar2Date }}</span>
        <yn-date-picker
          mode="double"
          :before="10"
          :after="10"
          :dateRefenceWidth="'500px'"
          :roundType="'hotel'"
          v-model="calendar2"
          v-on:getDate="handleOnGetDate2"
        ></yn-date-picker>
      </li>
      <li>
        <div>
          <h2>
            单选日历，指定默认选择为明天({{ defaultDate }})
          </h2>
        </div>
        <span class="selected-time-txt">已选择时间：{{ calendar3Date }}</span>
        <span @click="changeDefaultDate">修改默认时间为后天</span>
        <yn-date-picker
          mode="single"
          :before="10"
          :after="10"
          :dateRefenceWidth="'100%'"
          v-model="calendar3"
          :defaultDate="defaultDate"
          v-on:getDate="handleOnGetDate3"
        ></yn-date-picker>
      </li>
      <li>
        <div>
          <h2>
            多选日历，指定默认时间，当前时间前四天后五天,不能选同一天({{
              defaultStartDate
            }}
            ~ {{ defaultEndDate }})
          </h2>
        </div>
        <span class="selected-time-txt">已选择时间：{{ calendar4Date }}</span>
        <yn-date-picker
          mode="double"
          :before="4"
          :after="5"
          v-model="calendar4"
          :defaultStartDate="defaultStartDate"
          :defaultEndDate="defaultEndDate"
          :roundType="'hotel'"
          :doubleModeAllowSameDate="false"
          v-on:getDate="handleOnGetDate4"
        ></yn-date-picker>
      </li>
      <li>
        <div>
          <h2>
            多选日历，带底部确认按钮
          </h2>
        </div>
        <span class="selected-time-txt">已选择时间：{{ calendar5Date }}</span>
        <yn-date-picker
          mode="double"
          :before="10"
          :after="10"
          v-model="calendar5"
          v-on:getDate="handleOnGetDate5"
          :showConfirmButton="true"
          :confirmText="confirmText"
          @changeDate="changeDate"
        ></yn-date-picker>
      </li>
      <li>
        <div>
          <h2>
            多选日历，允许选择同一天
          </h2>
        </div>
        <span class="selected-time-txt">已选择时间：{{ calendar6Date }}</span>
        <yn-date-picker
          mode="double"
          :before="10"
          :after="10"
          v-model="calendar6"
          v-on:getDate="handleOnGetDate6"
          :doubleModeAllowSameDate="true"
        ></yn-date-picker>
      </li>
      <li>
        <div>
          <h2>
            多选日历，自定义title
          </h2>
        </div>
        <span class="selected-time-txt">已选择时间：{{ calendar7Date }}</span>
        <yn-date-picker
          mode="double"
          :before="10"
          :after="10"
          v-model="calendar7"
          v-on:getDate="handleOnGetDate7"
          :title="['日历', '请选择入住时间', '请选择离店时间']"
        ></yn-date-picker>
      </li>
      <li>
        <div>
          <h2>
            单选多选切换
          </h2>
        </div>
        <yn-radiobox
          v-model="single"
          @change="(e) => handleChange(e, 'single')"
        ></yn-radiobox
        ><span>单选</span>
        <yn-radiobox
          v-model="double"
          @change="(e) => handleChange(e, 'double')"
        ></yn-radiobox
        ><span>多选</span>
        <span class="selected-time-txt">已选择时间：{{ calendar8Date }}</span>
        <yn-date-picker
          :mode="getModel"
          :before="10"
          :after="10"
          v-model="calendar8"
          v-on:getDate="handleOnGetDate8"
          :title="['日历', '请选择入住时间', '请选择离店时间']"
        ></yn-date-picker>
      </li>
      <li>
        <div>
          <p
            >一年前日期到一年后日期</p
          >
        </div>
        <span class="selected-time-txt">已选择时间：{{ calendar9Date }}</span>
        <yn-date-picker
          before="1"
          after="1"
          v-model="calendar9"
          unit="year"
        ></yn-date-picker>
      </li>
      <li>
        <div>
          <h2>
            多选日历，带底部确认按钮,头部带去程返程日期。
          </h2>
        </div>
        <span class="selected-time-txt">已选择时间：{{ calendar10Date }}</span>
        <yn-date-picker
          mode="double"
          :doubleModeAllowSameDate="false"
          :dateLocked="true"
          :lockDateParse="lockDateParse"
          :before="9"
          :after="10"
          :fromDateMark="'出发'"
          :toDateMark="'到达'"
          v-model="calendar10"
          v-on:getDate="handleOnGetDate5"
          :showConfirmButton="true"
          :confirmText="confirmText"
          :dateRefenceWidth="'100%'"
          @changeDate="changeDate"
        ></yn-date-picker>
      </li>
    </ul>

  </div>
</template>

<script>
import { YnDate } from "@/components/modules/date";
export default {
  name: "YnCalendarPage",
  data() {
    return {
      duration: 0,
      calendar1: false,
      calendar1Date: "",
      calendar2: false,
      calendar2Date: "",
      calendar3: false,
      calendar3Date: "",
      defaultDate: YnDate().add(1, "d").format("YYYY-MM-DD"),
      calendar4: false,
      calendar4Date: "",
      defaultStartDate: YnDate().add(-4, "d").format("YYYY-MM-DD"),
      defaultEndDate: YnDate().add(5, "d").format("YYYY-MM-DD"),
      calendar5: false,
      calendar5Date: "",
      calendar6: false,
      calendar6Date: "",
      calendar7: false,
      calendar7Date: "",
      calendar8: false,
      single: false,
      double: true,
      calendar8Date: "",
      calendar9Date: "",
      calendar9: false,
      calendar10: false,
      calendar10Date: "",
    };
  },
  computed: {
    confirmText() {
      if (this.double) {
        return `确定（${this.duration}晚）`;
      } else {
        return "";
      }
    },
    getModel() {
      if (this.single) {
        return "single";
      } else if (this.double) {
        return "double";
      }
      return "";
    },
  },
  methods: {
    lockDateParse(date, type) {
      if (type === "week") {
        if (!date) {
          return "";
        } else {
          const { week, year, month, day } = date || {};
          const weekText = ["日", "一", "二", "三", "四", "五", "六"];
          return YnDate().isSame(year, month, day) ? "今天" : weekText[week];
        }
      } else {
        if (!date) {
          return "请选择日期";
        } else {
          const { month, day } = date || {};
          return `${Number(month)}月${Number(day)}日`;
        }
      }
    },
    diff(start, end) {
      const startTime = new Date(start).getTime();
      const endTime = new Date(end).getTime();
      return (endTime - startTime) / 1000 / 60 / 60 / 24;
    },
    changeDate(date) {
      console.log(date);
      const { fromDate, toDate } = date;
      if (!fromDate || !toDate) {
        this.duration = 0;
      } else {
        this.duration = this.diff(fromDate.date, toDate.date);
      }
    },
    changeDefaultDate() {
      this.defaultDate = YnDate().add(2, "d").format("YYYY-MM-DD");
    },
    monthTtitleParser(defaultText, { year, month }) {
      console.log("defaultText", defaultText);
      console.log(year, month);
      return `${month}/${year}`;
    },
    handleAfterLeave() {
      this.Toast("关闭完成的回调事件触发");
    },
    handleOpenCalendar(attr) {
      this[attr] = !this[attr];
    },
    handleOnGetDate1(date) {
      console.log(date);
      this.calendar1Date = date.date.date;
    },
    handleOnGetDate2(date) {
      this.calendar2Date = date.fromDate.date + " ~ " + date.toDate.date;
      console.log(date);
    },
    handleOnGetDate3(date) {
      console.log(date);
      this.calendar3Date = date.date;
    },
    handleOnGetDate4(date) {
      this.calendar4Date = date.fromDate.date + " ~ " + date.toDate.date;
      console.log(date);
    },
    handleOnGetDate5(date) {
      this.calendar5Date = date.fromDate.date + " ~ " + date.toDate.date;
      console.log(date);
    },
    handleOnGetDate6(date) {
      this.calendar6Date = date.fromDate.date + " ~ " + date.toDate.date;
      console.log(date);
    },
    handleOnGetDate7(date) {
      this.calendar7Date = date.fromDate.date + " ~ " + date.toDate.date;
      console.log(date);
    },
    handleOnGetDate8(date) {
      if (this.single) {
        this.calendar8Date = date.date.date;
      } else {
        this.calendar8Date = date.fromDate.date + " ~ " + date.toDate.date;
      }
      console.log(date);
    },
    handleOnGetDate9(date) {
      this.calendar9Date = date.fromDate.date + " ~ " + date.toDate.date;
      console.log(date);
    },
    handleChange(e, args) {
      if (args === "single") {
        if (e) {
          this.double = false;
        } else {
          this.single = true;
        }
      } else if (args === "double") {
        if (e) {
          this.single = false;
        } else {
          this.double = true;
        }
      }
    },
  },
};
</script>
<style type="text/css" scoped="scoped">
hr {
  border: 0.5px solid #e4e4e4;
}
ul {
  padding: 0;
  margin: 0;
  text-align: left;
  list-style: none;
}
ul li {
  margin: 20px auto;
}
.selected-time-txt{
  display: block;
  margin-bottom: 15px;
}
</style>
