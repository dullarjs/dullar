/*
 * @Author: yegl
 * @Date: 2021-09-02 18:05:19
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-26 14:06:01
 * @E-mail: yglgzyx@126.com
 */
import "./style/index.less";
import { defineComponent, genComponentName } from "../modules/component";
import Flex from "../flex";
import FlexItem from "../flex-item";
import { YnDate } from "../modules/date";
import { deepClone } from "../modules/utils/deepClone";

const now = YnDate().getToday();
const thisYear = now.getFullYear();
const m = now.getMonth() + 1;
// const month = m < 10 ? `0${m}` : m;
const d = now.getDate();
const today = d < 10 ? `0${d}` : d;
export default defineComponent({
  name: "Calendar",
  components: { Flex, FlexItem },
  props: {
    bordered: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: "选择日期",
    },
    defaultValue: {
      type: String,
      default: "",
    },
    textAlign: {
      type: String,
      default: "left",
    },
    beginDate: {
      type: String,
      default: null,
    },
    endDate: {
      type: String,
      default: null,
    },
    width: {
      type: Number,
      default: 160,
    },
  },
  data() {
    return {
      weekArr: ["日", "一", "二", "三", "四", "五", "六"],
      dateArr: [],
      year: thisYear,
      month: m,
      day: today,
      dayCount: 0,
      selectData: {}, // 选中日期信息 -> year, month, day
      inputValue: "",
      showCalendar: false,
    };
  },
  created() {
    this.dayCount = YnDate(this.year, this.month).getDaysCountOfMonth();
    this.initInputValue();
    this.dateArr = this.getMonthData();
  },
  watch: {
    selectData: function () {
      this.dateArr = this.getMonthData();
    },
    defaultValue: "initInputValue",
    beginDate: function () {
      this.dateArr = this.getMonthData();
    },
    endDate: function () {
      this.dateArr = this.getMonthData();
    },
  },
  mounted() {
    this.$nextTick(() => {
      document
        .querySelector("body")
        .addEventListener("click", this.handleBodyClick);
    });
  },
  beforeDestroy() {
    document
      .querySelector("body")
      .removeEventListener("click", this.handleBodyClick);
  },
  methods: {
    initInputValue() {
      if (this.defaultValue && this.defaultValue !== this.inputValue) {
        const reg = /^\d{1,4}(-)(1[0-2]|0?[1-9])\1(0?[1-9]|[1-2]\d|30|31)$/;
        const isDate = reg.test(this.defaultValue);
        if (isDate) {
          const data = this.defaultValue.split("-");
          const year = Number(data[0]);
          const month = Number(data[1]);
          const day = Number(data[2]);
          this.inputValue =
            year +
            "-" +
            (month < 10 ? `0${month}` : month) +
            "-" +
            (day < 10 ? `0${day}` : day);
          this.selectData = { year, month, day };
          this.year = year;
          this.month = month;
          this.day = day;
        }
      }
    },
    isOutScopeDate(dateInfo) {
      const { beginDate, endDate } = this;
      let checkType = false;
      if (!beginDate && !endDate) {
        return checkType;
      } else if (beginDate && endDate) {
        const _dateInfo = this.initDate(dateInfo);
        const _beginDate = this.initDate(beginDate.split("-"));
        const _endDate = this.initDate(endDate.split("-"));
        checkType = _dateInfo < _beginDate || _dateInfo > _endDate;
      } else if (endDate) {
        const _dateInfo = this.initDate(dateInfo);
        const _endDate = this.initDate(endDate.split("-"));
        checkType = _dateInfo > _endDate;
      } else if (beginDate) {
        const _dateInfo = this.initDate(dateInfo);
        const _beginDate = this.initDate(beginDate.split("-"));
        checkType = _dateInfo < _beginDate;
      }
      return checkType;
    },
    initDate(dataList) {
      const _newList = [];
      dataList.forEach((item) => {
        item = Number(item);
        const _item = item < 10 ? `0${item}` : item;
        _newList.push(_item);
      });
      return Number(_newList.join(""));
    },
    getMonthData() {
      const { year, month } = this;
      const {
        year: selectedYear,
        month: selectedMonth,
        day: selectedDay,
      } = this.selectData;
      const monthStartWeekDay = new Date(year, month - 1, 1).getDay();
      const monthEndWeekDay = new Date(year, month, 1).getDay() || 7;
      const dayCount = this.dayCount;
      const _dateArr = [];

      const preInfo = YnDate(year, month).add(-1, "month");
      const nextInfo = YnDate(year, month).add(1, "month");

      const _preMonthDayCount = YnDate(
        preInfo.year,
        preInfo.month
      ).getDaysCountOfMonth();

      for (let i = 0; i < monthStartWeekDay; i++) {
        const _day = _preMonthDayCount - (monthStartWeekDay - i - 1);
        const _outScope = this.isOutScopeDate([
          preInfo.year,
          preInfo.month,
          _day,
        ]);
        const preObj = {
          type: "pre",
          day: _day,
          month: Number(preInfo.month),
          year: Number(preInfo.year),
          outScope: _outScope,
        };
        _dateArr.push(preObj);
      }

      for (let i = 0; i < dayCount; i++) {
        const _outScope = this.isOutScopeDate([year, month, i + 1]);
        const itemObj = {
          type: "normal",
          day: i + 1,
          month,
          year,
          isToday: Number(today) === i + 1 && year === thisYear && month === m,
          selected:
            Number(selectedDay) === i + 1 &&
            year === selectedYear &&
            month === selectedMonth,
          outScope: _outScope,
        };
        _dateArr.push(itemObj);
      }

      for (let i = 0; i < 7 - monthEndWeekDay; i++) {
        const _outScope = this.isOutScopeDate([
          nextInfo.year,
          nextInfo.month,
          i + 1,
        ]);
        const nextObj = {
          type: "next",
          day: i + 1,
          month: Number(nextInfo.month),
          year: Number(nextInfo.year),
          outScope: _outScope,
        };
        _dateArr.push(nextObj);
      }
      return _dateArr;
    },
    createWeek(h) {
      const _weekContent = [];
      const _weekArr = this.weekArr;
      _weekArr.forEach((item) => {
        _weekContent.push(
          h(
            genComponentName("flex-item"),
            {
              props: { flex: "0 0 14.285%" },
              class: ["yn-calendar-item-title"],
            },
            [item]
          )
        );
      });
      return _weekContent;
    },
    createDay(h) {
      const _dayContent = [];
      const _dateArr = this.dateArr;
      _dateArr.forEach((item) => {
        _dayContent.push(
          h(
            genComponentName("flex-item"),
            {
              props: { flex: "0 0 14.285%" },
              class: [
                "yn-calendar-item-day",
                item.isToday ? "yn-calendar-today" : "",
                item.selected ? "yn-calendar-selected" : "",
                item.type !== "normal" ? "yn-calendar-other-month" : "",
                item.outScope ? "yn-calendar-out-scope" : "",
              ],
              nativeOn: {
                mousedown: () => this.selectedDay(item),
              },
            },
            [h("span", {}, [item.day])]
          )
        );
      });
      return _dayContent;
    },
    changeYear(num) {
      const { year } = this;
      this.dayCount = YnDate(year + num, this.month).getDaysCountOfMonth();
      this.year = year + num;
      this.dateArr = this.getMonthData();
    },
    changeMonth(num) {
      const { year, month } = this;
      const nextInfo = YnDate(year, month).add(num, "month");
      this.dayCount = YnDate(
        nextInfo.year,
        nextInfo.month
      ).getDaysCountOfMonth();
      this.month = Number(nextInfo.month);
      this.year = Number(nextInfo.year);
      this.dateArr = this.getMonthData();
    },
    selectedDay(data) {
      const { year, month, day, outScope } = data;
      if (outScope) return false;
      this.selectData = { year, month, day };
      this.year = year;
      this.month = month;
      this.day = day;
      this.inputValue =
        year +
        "-" +
        (month < 10 ? `0${month}` : month) +
        "-" +
        (day < 10 ? `0${day}` : day);
      this.showCalendar = false;
      this.$emit("onHandleChange", this.inputValue);
    },
    handleBodyClick(e) {
      if (!this.$el.contains(e.target)) {
        const { year, month, selectData } = this;
        if (
          selectData.year &&
          selectData.month &&
          (year !== selectData.year || month !== selectData.month)
        ) {
          this.year = deepClone(selectData.year);
          this.month = deepClone(selectData.month);
          this.dateArr = this.getMonthData();
        }
        this.showCalendar = false;
      }
    },
    onChange(e) {
      const reg = /^\d{1,4}(-)(1[0-2]|0?[1-9])\1(0?[1-9]|[1-2]\d|30|31)$/;
      const isDate = reg.test(e.target.value);
      if (isDate) {
        const data = e.target.value.split("-");
        const year = Number(data[0]);
        const month = Number(data[1]);
        const day = Number(data[2]);
        this.selectedDay({ year, month, day });
      } else {
        e.target.value = this.inputValue;
      }
    },
  },
  render(h) {
    const showIcon = this.icon;
    const { year, month, showCalendar } = this;
    const title = year + "年" + month + "月";
    const inputWidth = this.width + "px";
    return h("div", { class: "yn-caclendar" }, [
      h("div", { class: ["yn-calendar-date-edit"] }, [
        h(
          "input",
          {
            class: [
              "yn-calendar-date-input",
              this.bordered ? "" : "yn-calendar-date-input-rimless",
              showIcon ? "" : "yn-calendar-no-icon",
            ],
            attrs: {
              type: "text",
              placeholder: this.placeholder,
              value: this.inputValue,
            },
            style: { width: inputWidth },
            on: {
              focus: () => {
                return (this.showCalendar = true);
              },
              // blur: () => { return this.handleBodyClick(); },
              change: ($event) => {
                this.onChange($event);
              },
            },
          },
          []
        ),
        showIcon &&
          h("span", { class: ["yn-calendar-input-prefix"] }, [
            h(
              genComponentName("iconfont"),
              {
                props: {
                  size: 14,
                  name: "calendar",
                },
              },
              []
            ),
          ]),
        h(
          "div",
          {
            class: ["yn-calendar-panel"],
            style: {
              display: showCalendar ? "block" : "none",
            },
          },
          [
            h("div", { class: ["yn-calendar-panel-header"] }, [
              h(
                "button",
                { class: ["yn-calendar-h-left-y", "yn-calendar-header-left"] },
                [
                  h(
                    genComponentName("iconfont"),
                    {
                      props: {
                        size: 20,
                        name: "double-left",
                      },
                      on: {
                        click: () => this.changeYear(-1),
                      },
                    },
                    []
                  ),
                ]
              ),
              h(
                "button",
                { class: ["yn-calendar-h-left-m", "yn-calendar-header-left"] },
                [
                  h(
                    genComponentName("iconfont"),
                    {
                      props: {
                        size: 20,
                        name: "left",
                      },
                      on: {
                        click: () => this.changeMonth(-1),
                      },
                    },
                    []
                  ),
                ]
              ),
              h("span", { class: ["yn-calendar-panel-header-label"] }, [title]),
              h(
                "button",
                {
                  class: ["yn-calendar-h-right-y", "yn-calendar-header-right"],
                },
                [
                  h(
                    genComponentName("iconfont"),
                    {
                      props: {
                        size: 20,
                        name: "double-right",
                      },
                      on: {
                        click: () => this.changeYear(1),
                      },
                    },
                    []
                  ),
                ]
              ),
              h(
                "button",
                {
                  class: ["yn-calendar-h-right-m", "yn-calendar-header-right"],
                },
                [
                  h(
                    genComponentName("iconfont"),
                    {
                      props: {
                        size: 20,
                        name: "right",
                      },
                      on: {
                        click: () => this.changeMonth(1),
                      },
                    },
                    []
                  ),
                ]
              ),
            ]),
            h(
              genComponentName("flex"),
              {
                class: ["yn-calendar-panel-week"],
                props: { flexDirection: "row", flexWrap: "wrap" },
              },
              [...this.createWeek(h), ...this.createDay(h)]
            ),
          ]
        ),
      ]),
    ]);
  },
});
