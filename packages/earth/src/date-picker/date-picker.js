/*
 * @Author: Just be free
 * @Date:   2020-04-29 10:58:15
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-01-21 15:59:11
 * @E-mail: justbefree@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import Picker from "../picker";
import { YnDate, validateFormatedDate } from "../modules/date";
const isSameDate = (d1, d2) => {
  return Number(d1) === Number(d2);
};
const now = YnDate().getToday();
const year = now.getFullYear();
const m = now.getMonth() + 1;
const month = m < 10 ? `0${m}` : m;
const d = now.getDate();
const date = d < 10 ? `0${d}` : d;
export default defineComponent({
  name: "DatePicker",
  components: { Picker },
  props: {
    value: Boolean,
    start: {
      type: String,
      default: `${year - 100}-${month}-${date}`,
    },
    end: {
      type: String,
      default: `${year}-${month}-${date}`,
    },
    defaultDate: String,
    confirmText: {
      type: String,
      default: "确认",
    },
    cancelText: {
      type: String,
      default: "取消",
    },
    title: {
      type: String,
      default: "请选择",
    },
  },
  data() {
    return {
      year: "",
      month: "",
      date: "",
      dayCount: YnDate(year - 30, month, date).getDaysCountOfMonth(),
      monthStart: 1,
      monthEnd: 12,
      dateStart: 1,
      dateEnd: 31,
      computedColumns: [],
      defaultDisplayDate: "",
    };
  },
  initPropsToData() {
    return [];
  },
  methods: {
    close() {
      this.$emit("input", false);
    },
    handleOnConfirm(e) {
      this.$emit("confirm", {
        e,
        month: this.month,
        date: this.date,
        year: this.year,
        dateInstance: YnDate(this.year, this.month, this.date),
      });
      this.close();
    },
    updateMonthDayCount() {
      this.dayCount = YnDate(this.year, this.month, "01").getDaysCountOfMonth();
    },
    genDate(startDate, endDate) {
      // this.updateMonthDayCount();
      const defaultIndex = this.computedColumns[2].defaultIndex;
      const dates = [];
      for (let i = startDate; i <= endDate; i++) {
        dates.push(i);
      }
      if (defaultIndex < dates.length) {
        this.date = dates[defaultIndex];
      } else {
        this.computedColumns[2].defaultIndex = 0;
        this.date = dates[0];
      }
      this.computedColumns[2].value = dates;
    },
    genMonth(startMonth, endMonth, extendParams = {}) {
      const defaultIndex = this.computedColumns[1].defaultIndex;
      const months = [];
      for (let i = startMonth; i <= endMonth; i++) {
        months.push(i);
      }
      if (defaultIndex < months.length) {
        this.month = months[defaultIndex];
      } else {
        this.computedColumns[1].defaultIndex = 0;
        this.month = months[0];
      }
      this.computedColumns[1].value = months;
      if (extendParams.trigger) {
        if (extendParams.trigger === "start") {
          if (this.month === startMonth) {
            this.genDate(extendParams.startDate, this.dayCount);
          } else {
            this.genDate(1, this.dayCount);
          }
        } else if (extendParams.trigger === "end") {
          if (this.month === endMonth) {
            this.genDate(1, extendParams.endDate);
          } else {
            this.genDate(1, this.dayCount);
          }
        }
      } else {
        this.genDate(1, this.dayCount);
      }
    },
    handleChange(e, i, key) {
      const [startYear, startMonth, startDate] = this.start.split("-");
      const [endYear, endMonth, endDate] = this.end.split("-");
      if (key === 1) {
        // 月变化
        this.month = e;
        this.updateMonthDayCount();
        if (isSameDate(this.year, startYear)) {
          if (isSameDate(e, startMonth)) {
            this.genDate(startDate, this.dayCount);
          } else {
            this.genDate(1, this.dayCount);
          }
        } else if (isSameDate(this.year, endYear)) {
          if (isSameDate(e, endMonth)) {
            this.genDate(1, endDate);
          } else {
            this.genDate(1, this.dayCount);
          }
        } else {
          this.genDate(1, this.dayCount);
        }
      } else if (key === 0) {
        // 年变化
        this.year = e;
        this.updateMonthDayCount();
        if (isSameDate(startYear, endYear)) {
          this.genMonth(startMonth, endMonth);
        } else {
          if (isSameDate(e, startYear)) {
            this.genMonth(Number(startMonth), 12, {
              trigger: "start",
              startDate,
            });
          } else if (isSameDate(e, endYear)) {
            this.genMonth(1, Number(endMonth), { trigger: "end", endDate });
          } else {
            this.genMonth(1, 12);
          }
        }
      } else if (key === 2) {
        // 日变化
        this.date = e;
      }
    },
    getDefaultIndex(arr, type) {
      const index = arr.indexOf(Number(this[type]));
      if (index < 0) {
        this[type] = arr[0];
      }
      return index > -1 ? index : 0;
    },
    genColumns() {
      const columns = [];
      if (
        !validateFormatedDate(this.start) ||
        !validateFormatedDate(this.end)
      ) {
        return columns;
      }
      const year = [];
      const month = [];
      const date = [];
      const [startYear] = this.start.split("-");
      const [endYear] = this.end.split("-");
      for (let i = startYear; i <= endYear; i++) {
        // 创建年集合
        year.push(i);
      }
      columns.push({
        value: year,
        defaultIndex: this.getDefaultIndex(year, "year"),
      });
      for (let i = this.monthStart; i <= this.monthEnd; i++) {
        month.push(i);
      }
      columns.push({
        value: month,
        defaultIndex: this.getDefaultIndex(month, "month"),
      });
      for (let i = this.dateStart; i <= this.dateEnd; i++) {
        date.push(i);
      }
      columns.push({
        value: date,
        defaultIndex: this.getDefaultIndex(date, "date"),
      });
      return columns;
    },
    initData() {
      if (validateFormatedDate(this.defaultDate)) {
        this.defaultDisplayDate = this.defaultDate;
      } else {
        this.defaultDisplayDate = this.end;
      }
      const [displayY, displayM, displayD] = this.defaultDisplayDate.split("-");
      this.year = Number(displayY);
      this.month = Number(displayM);
      this.date = Number(displayD);
      this.updateMonthDayCount();
      const [startYear, startMonth, startDate] = this.start.split("-");
      const [endYear, endMonth, endDate] = this.end.split("-");
      if (!isSameDate(displayY, startYear) && !isSameDate(displayY, endYear)) {
        this.monthStart = 1;
        this.monthEnd = 12;
        this.dateStart = 1;
        this.dateEnd = this.dayCount;
      } else if (isSameDate(displayY, startYear)) {
        this.monthStart = Number(startMonth);
        this.monthEnd = 12;
        if (isSameDate(displayM, startMonth)) {
          this.dateStart = Number(startDate);
          this.dateEnd = this.dayCount;
        } else {
          this.dateStart = 1;
          this.dateEnd = this.dayCount;
        }
      } else if (isSameDate(displayY, endYear)) {
        this.monthStart = 1;
        this.monthEnd = Number(endMonth);
        if (isSameDate(displayM, endMonth)) {
          this.dateStart = 1;
          this.dateEnd = Number(endDate);
        } else {
          this.dateStart = 1;
          this.dateEnd = this.dayCount;
        }
      }
    },
    handleBeforeEnter() {
      this.$emit("beforeEnter");
    },
    handleEnter() {
      this.$emit("enter");
    },
    handleAfterEnter() {
      this.$emit("afterEnter");
    },
    handleBeforeLeave() {
      this.$emit("beforeLeave");
    },
    handleLeave() {
      this.$emit("leave");
    },
    handleAfterLeave() {
      this.$emit("afterLeave");
    },
  },
  created() {
    this.initData();
    this.computedColumns = this.genColumns();
  },
  render(h) {
    return h("div", { class: ["yn-date-picker"] }, [
      h(
        genComponentName("picker"),
        {
          on: {
            confirm: this.handleOnConfirm,
            close: this.close,
            change: this.handleChange,
            beforeEnter: this.handleBeforeEnter,
            enter: this.handleEnter,
            afterEnter: this.handleAfterEnter,
            beforeLeave: this.handleBeforeLeave,
            leave: this.handleLeave,
            afterLeave: this.handleAfterLeave,
          },
          props: {
            columns: this.computedColumns,
            value: this.value,
            confirmText: this.confirmText,
            cancelText: this.cancelText,
            title: this.title,
          },
        },
        []
      ),
    ]);
  },
});
