/*
 * @Author: Just be free
 * @Date:   2020-01-15 17:16:27
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-02 15:12:36
 * @E-mail: justbefree@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import { drop, push } from "../modules/utils";
import { YnDate } from "../modules/date";
import Popup from "../popup";
import Iconfont from "../iconfont";
import Flex from "../flex";
import FlexItem from "../flex-item";
import { renderedMixins } from "../mixins/rendered";
import { getOffset } from "../modules/dom";
export default defineComponent({
  name: "Calendar",
  mixins: [renderedMixins],
  components: { Flex, FlexItem, Popup, Iconfont },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: [String, Array],
      default: "日历",
    },
    mode: {
      type: String,
      default: "single",
    },
    doubleModeAllowSameDate: {
      type: Boolean,
      default: true,
    },
    crossed: {
      type: Boolean,
      default: true,
    },
    before: {
      type: [Number, String],
      default: 1,
    },
    after: {
      type: [Number, String],
      default: 1,
    },
    unit: {
      type: String,
      default: "days",
    },
    weekText: {
      type: Array,
      default: () => {
        return ["日", "一", "二", "三", "四", "五", "六"];
      },
    },
    defaultDate: {
      type: String,
      default: YnDate().format(),
    },
    defaultStartDate: {
      type: String,
      default: YnDate().format(),
    },
    defaultEndDate: {
      type: String,
      default: YnDate().add(1, "day").format(),
    },
    showConfirmButton: {
      type: Boolean,
      default: false,
    },
    confirmText: {
      type: String,
      default: "确认",
    },
    fromDateMark: {
      type: String,
      default: "入住",
    },
    toDateMark: {
      type: String,
      default: "离店",
    },
    todayMark: {
      type: String,
      default: "今天",
    },
    monthTtitleParser: {
      type: Function,
      default: (defaultText) => {
        return defaultText;
      },
    },
    noticeText: String,
    dateLocked: {
      type: Boolean,
      default: false,
    },
    lockDateParse: {
      type: Function,
      default: (date, type) => {
        console.log("date:", date, "type:", type);
        if (type === "week") {
          if (!date) {
            return "";
          } else {
            const { week, year, month, day } = date || {};
            const weekText = [
              "周日",
              "周一",
              "周二",
              "周三",
              "周四",
              "周五",
              "周六",
            ];
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
    },
  },
  data() {
    return {
      changedNode: {},
      fromDate: null,
      toDate: null,
      date: null,
      beginDate: null,
      endDate: null,
      confirmButtonClassName: "active",
    };
  },
  watch: {
    value: "highLightDefault",
  },
  methods: {
    handleClick(date) {
      if (date.className.indexOf("clickable") < 0) {
        return false;
      }
      if (this.mode === "double") {
        this.haneleDoubleMode(date);
      } else {
        this.haneleSingleMode(date);
      }
    },
    haneleSingleMode(date) {
      this.changedNode = {};
      push(date.className, ["active", "single-mode"]);
      this.changedNode = { ...this.changedNode, [date.key]: date };
      this.date = date;
      if (!this.showConfirmButton) {
        this.handleOnConfirm();
      }
    },
    haneleDoubleMode(date) {
      if (!this.fromDate) {
        this.confirmButtonClassName = "disable";
        push(date.className, ["start", "active"]);
        this.setDateValue(date, "mark", this.fromDateMark);
        this.changedNode = { ...this.changedNode, [date.key]: date };
        this.fromDate = date;
      } else {
        if (!this.toDate) {
          if (date.key === this.fromDate.key) {
            if (this.doubleModeAllowSameDate) {
              this.confirmButtonClassName = "active";
              push(this.changedNode[this.fromDate.key].className, "end");
              this.setDateValue(
                date,
                "mark",
                `${this.fromDateMark}-${this.toDateMark}`
              );
              this.changedNode = { [date.key]: date };
              this.toDate = date;
              if (!this.showConfirmButton) {
                this.handleOnConfirm();
              }
            } else {
              this.confirmButtonClassName = "disable";
              drop(date.className, ["active", "start"]);
              // this.changedNode = { ...this.changedNode, [date.key]: date };
              this.changedNode = {};
              this.fromDate = null;
            }
          } else {
            if (this.fromDate.ynDate.isAfter(date.ynDate)) {
              if (this.crossed) {
                this.confirmButtonClassName = "active";
                drop(this.changedNode[this.fromDate.key].className, "start");
                push(this.changedNode[this.fromDate.key].className, "end");
                this.setDateValue(
                  this.changedNode[this.fromDate.key],
                  "mark",
                  this.toDateMark
                );
                this.toDate = this.fromDate;
                this.fromDate = date;
                push(date.className, "start");
                this.setDateValue(date, "mark", this.fromDateMark);
              } else {
                drop(this.changedNode[this.fromDate.key].className, [
                  "start",
                  "active",
                ]);
                this.changedNode = { [date.key]: date };
                this.setDateValue(date, "mark", this.fromDateMark);
                push(date.className, ["start", "active"]);
                this.fromDate = date;
                return;
              }
            } else {
              this.confirmButtonClassName = "active";
              push(date.className, "end");
              this.setDateValue(date, "mark", this.toDateMark);
              this.toDate = date;
            }
            push(date.className, "active");
            this.changedNode = { ...this.changedNode, [date.key]: date };
            if (!this.showConfirmButton) {
              this.handleOnConfirm();
            }
          }
        } else {
          this.confirmButtonClassName = "disable";
          this.toDate = null;
          drop(date.className, "during-active");
          drop(date.className, ["active", "end"]);
          push(date.className, ["start", "active"]);
          this.setDateValue(date, "mark", this.fromDateMark);
          this.fromDate = date;
          this.changedNode = { [date.key]: date };
        }
      }
      push(date.className, "during-active");
      this.$emit("changeDate", {
        fromDate: this.fromDate,
        toDate: this.toDate,
      });
    },
    handleOnConfirm() {
      if (this.confirmButtonClassName !== "active") {
        return false;
      }
      this.close();
      if (this.mode === "double") {
        this.$emit("getDate", { fromDate: this.fromDate, toDate: this.toDate });
      } else {
        this.$emit("getDate", { date: this.date });
      }
    },
    getTimePeriod() {
      const beginDate = YnDate().substract(Number(this.before), this.unit);
      const endDate = YnDate().add(Number(this.after), this.unit);
      this.beginDate = beginDate.format();
      this.endDate = endDate.format();
      return YnDate().getMonthPeriod(beginDate, endDate);
    },
    generateDate() {
      const caculatedMonth = this.getTimePeriod();
      const caculatedDates = [];
      caculatedMonth.forEach((item) => {
        const monthObject = {
          dates: [],
        };
        const [year, month] = item.split("-");
        const daysOfMonth = YnDate(year, month).getDaysCountOfMonth();
        for (let i = 1; i <= daysOfMonth; i++) {
          let j = i < 10 ? `0${i}` : String(i);
          if (j === "01") {
            for (let k = 0; k < YnDate(year, month, j).getDay(); k++) {
              monthObject["dates"].push({
                className: [],
                key: `year_month_date_${k}`,
              });
            }
          }
          const className = [];
          const ynDate = YnDate(year, month, j);
          push(
            className,
            YnDate().isAfter(year, month, j) ? "disable" : "clickable"
          );
          if (this.mode === "double" && this.fromDate && this.toDate) {
            push(
              className,
              YnDate(year, month, j).isBetween(
                this.fromDate.ynDate,
                this.toDate.ynDate
              )
                ? "during-active"
                : ""
            );
            if (ynDate.getDay() === 6) {
              push(className, "during-border-right");
            }
            if (String(ynDate.getDaysCountOfMonth()) === j) {
              push(className, "during-border-right");
            }
            if (ynDate.getDay() === 0) {
              push(className, "during-border-left");
            }
            if (j === "01") {
              push(className, "during-border-left");
            }
          }
          if (this.beginDate && this.endDate) {
            if (
              YnDate(year, month, j).isBetweenIncludeBoth(
                this.beginDate,
                this.endDate
              )
            ) {
              push(className, ["open-days", "clickable"]);
              drop(className, "disable");
            } else {
              push(className, "disable");
              drop(className, "clickable");
            }
          }
          monthObject["key"] = `${year}-${month}`;
          monthObject["month"] = month;
          monthObject["year"] = year;
          const festival = YnDate().isSame(year, month, j)
            ? this.todayMark
            : "";
          const key = `${year}-${month}-${j}`;
          if (this.changedNode[key]) {
            monthObject["dates"].push({ ...this.changedNode[key] });
          } else {
            monthObject["dates"].push({
              key,
              year,
              month,
              day: j,
              week: ynDate.getDay(),
              date: key,
              className,
              ynDate,
              mark: "",
              festival,
            });
          }
        }
        caculatedDates.push(monthObject);
      });
      return caculatedDates;
    },
    getDefaultNodeFromProps(prop, className = []) {
      const key = this[prop];
      const [year, month, day] = key.split("-");
      const festival = YnDate().isSame(year, month, day) ? this.todayMark : "";
      const ynDate = YnDate(year, month, day);
      return {
        key,
        ynDate,
        year,
        month,
        day,
        date: key,
        week: ynDate.getDay(),
        className: ["active", "clickable", ...className],
        mark: "",
        festival,
      };
    },
    setDateValue(date, attr, value) {
      date[attr] = value;
    },
    highLightDefault() {
      if (this.mode === "double") {
        const startNode = this.getDefaultNodeFromProps("defaultStartDate", [
          "start",
        ]);
        this.setDateValue(startNode, "mark", this.fromDateMark);
        const endNode = this.getDefaultNodeFromProps("defaultEndDate", ["end"]);
        this.setDateValue(endNode, "mark", this.toDateMark);
        this.changedNode = {
          [startNode.key]: startNode,
          [endNode.key]: endNode,
        };
        // 当允许选择同一天，并且默认传的起止日期也是同一天则需要重置endNode
        if (this.doubleModeAllowSameDate && startNode.key === endNode.key) {
          endNode.className.push("start");
          this.setDateValue(
            endNode,
            "mark",
            `${this.fromDateMark}-${this.toDateMark}`
          );
        }
        this.fromDate = startNode;
        this.toDate = endNode;
        this.$emit("changeDate", {
          fromDate: this.fromDate,
          toDate: this.toDate,
        });
      } else {
        const node = this.getDefaultNodeFromProps("defaultDate", [
          "single-mode",
          "open-days",
        ]);
        this.changedNode = { [node.key]: node };
      }
    },
    setPosition() {
      this.rendered(() => {
        const el = this.$refs.scrollPosition.$el;
        const parent = this.$refs.popup.$el;
        // this.$refs.scroller.$el.scrollTop =
        //   getOffset(el).top -
        //   this.$refs.header.$el.offsetHeight -
        //   getOffset(parent).top;
        // 解决iOS 13.4.1 日历显示选择区域异常。
        // 原因是因为在iOS 13.4.1中 获取popup 的translateY的时候有值（按理说这里应该是0）
        // 猜测：可能是iOS 13.4.1的渲染机制跟其他版本浏览器渲染不一致，测试发现跟Vue transition有关系，具体还得查一下
        // 解决方法：延迟30ms，再进行设置scrollTop值
        setTimeout(() => {
          this.$refs.scroller.$el.scrollTop =
            getOffset(el).top -
            this.$refs.header.$el.offsetHeight -
            getOffset(parent).top;
        }, 30);
      });
    },
    handleBeforeEnter() {
      this.$emit("beforeEnter");
    },
    handleAfterEnter() {
      this.$emit("afterEnter");
      this.setPosition();
    },
    handleBeforeLeave() {
      this.$emit("beforeLeave");
    },
    handleAfterLeave() {
      this.$emit("afterLeave");
    },
    getStartOrEndDateClass(classArr) {
      return classArr.filter((c) => ["active"].includes(c));
    },
    getExcludeStartOrEndDateClass(classArr) {
      return classArr.filter((c) => !["active"].includes(c));
    },
    createDate(h) {
      const dates = this.generateDate();
      const caculateDOM = [];
      dates.forEach((monthItem) => {
        const { month, year, key } = monthItem;
        caculateDOM.push(
          h(
            "div",
            {
              class: ["yn-calendar-month", month],
              key,
            },
            [
              h(
                "h4",
                {
                  class: ["yn-calendar-month-title"],
                  domProps: {
                    innerHTML: this.monthTtitleParser(`${year}-${month}`, {
                      year,
                      month,
                    }),
                  },
                },
                []
              ),
              h(
                genComponentName("flex"),
                {
                  key: `yn_flex_${key}`,
                  class: ["yn-calendar-flex"],
                  props: {
                    flexWrap: "wrap",
                    justifyContent: "spaceAround",
                    fixBottomLine: true,
                  },
                },
                [
                  (() => {
                    const dateDom = [];
                    monthItem.dates.forEach((date) => {
                      let ref = null;
                      if (
                        date.className.indexOf("single-mode") > -1 ||
                        date.className.indexOf("start") > -1
                      ) {
                        ref = "scrollPosition";
                      }
                      dateDom.push(
                        h(
                          genComponentName("flex-item"),
                          {
                            key: date.key,
                            class: [
                              "yn-calendar-date",
                              ...this.getExcludeStartOrEndDateClass(
                                date.className
                              ),
                            ],
                            // domProps: { innerHTML: date.day },
                            ref,
                            nativeOn: {
                              click: this.handleClick.bind(this, date),
                            },
                          },
                          [
                            h(
                              genComponentName("flex"),
                              {
                                class: [
                                  ...this.getStartOrEndDateClass(
                                    date.className
                                  ),
                                ],
                                props: {
                                  flexDirection: "column",
                                  justifyContent: "spaceBetween",
                                },
                              },
                              [
                                h(
                                  genComponentName("flex-item"),
                                  { class: ["yn-calendar-date-festival"] },
                                  date.festival
                                ),
                                h(
                                  genComponentName("flex-item"),
                                  { class: ["yn-calendar-date-text"] },
                                  date.day
                                ),
                                h(
                                  genComponentName("flex-item"),
                                  { class: ["yn-calendar-date-mark"] },
                                  date.mark
                                ),
                              ]
                            ),
                          ]
                        )
                      );
                    });
                    return dateDom;
                  })(),
                ]
              ),
            ]
          )
        );
      });
      return caculateDOM;
    },
    createNoticeBar(h) {
      if (this.noticeText && this.noticeText !== "") {
        return h("div", { class: ["yn-calendar-notice"] }, [
          h("p", { class: ["text"] }, this.noticeText),
        ]);
      }
    },
    createDateResultArea(h) {
      const placeHolderClass = this.toDate
        ? ""
        : "yn-calendar-result-date-placeholder";
      return h(
        "div",
        {
          class: ["yn-calendar-date-result"],
        },
        [
          h(
            "div",
            {
              class: ["yn-calendar-reulst-left"],
            },
            [
              h(
                "span",
                {
                  class: ["yn-calendar-result-date-des"],
                },
                this.fromDateMark
              ),
              h(
                "div",
                {
                  class: ["yn-calendar-result-date"],
                },
                [
                  h(
                    "span",
                    {
                      class: ["yn-calendar-result-year-day"],
                    },
                    this.lockDateParse(this.fromDate, "day")
                  ),
                  h(
                    "span",
                    {
                      class: ["yn-calendar-result-week"],
                    },
                    this.lockDateParse(this.fromDate, "week")
                  ),
                ]
              ),
            ]
          ),
          h(
            "div",
            {
              class: ["yn-calendar-reulst-center"],
            },
            [
              h(
                "span",
                {
                  class: ["yn-clendar-result-center-icon"],
                },
                []
              ),
            ]
          ),
          h(
            "div",
            {
              class: ["yn-calendar-reulst-right"],
            },
            [
              h(
                "span",
                {
                  class: ["yn-calendar-result-date-des"],
                },
                this.toDateMark
              ),
              h(
                "div",
                {
                  class: ["yn-calendar-result-date"],
                },
                [
                  h(
                    "span",
                    {
                      class: ["yn-calendar-result-year-day", placeHolderClass],
                    },
                    this.lockDateParse(this.toDate, "day")
                  ),
                  this.toDate &&
                    h(
                      "span",
                      {
                        class: ["yn-calendar-result-week"],
                      },
                      this.lockDateParse(this.toDate, "week")
                    ),
                ]
              ),
            ]
          ),
        ]
      );
    },
    createHeaderArea(h) {
      return h("div", {}, [
        this.createCloseIcon(h),
        this.createTitle(h),
        this.createNoticeBar(h),
        this.createWeekBar(h),
      ]);
    },
    createFooterArea(h) {
      if (this.showConfirmButton) {
        return h(
          genComponentName("flex-item"),
          {
            class: ["yn-calendar-footer"],
          },
          [
            this.dateLocked && this.createDateResultArea(h),
            h("div", {
              class: [
                "yn-calendar-confirm-button",
                this.confirmButtonClassName,
              ],
              on: { click: this.handleOnConfirm },
              domProps: { innerHTML: this.confirmText },
            }),
          ]
        );
      } else {
        return [];
      }
    },
    createCloseIcon(h) {
      return h(
        genComponentName("iconfont"),
        {
          class: ["yn-calendar-close"],
          props: { name: "close", size: 12 },
          nativeOn: { click: this.close },
        },
        []
      );
    },
    close() {
      this.$emit("input", false);
    },
    getTitle() {
      const title = Array.isArray(this.title) ? this.title : [this.title];
      const [defaultTitle = "", firstClickTitle = "", secondClickTitle] = title;
      if (this.mode === "single") {
        return defaultTitle;
      } else {
        if (!this.fromDate && !this.toDate) {
          return firstClickTitle || defaultTitle;
        } else if (this.fromDate && !this.toDate) {
          return secondClickTitle || defaultTitle;
        } else if (this.fromDate && this.toDate) {
          return defaultTitle;
        }
      }
    },
    createTitle(h) {
      return h(
        "div",
        {
          class: ["yn-calendar-header-title"],
          domProps: { innerHTML: this.getTitle() },
        },
        []
      );
    },
    createWeekBar(h) {
      const bar = [];
      for (let i = 0; i < 7; i++) {
        bar.push(
          h(genComponentName("flex-item"), { key: i }, [
            h("span", { domProps: { innerHTML: this.weekText[i] } }, []),
          ])
        );
      }
      return h("div", { class: ["yn-calendar-week-bar"] }, [
        h(
          genComponentName("flex"),
          { key: "yn_flex_week_bar", props: { justifyContent: "spaceAround" } },
          bar
        ),
      ]);
    },
    handleChange(e) {
      this.$emit("input", e);
    },
  },
  created() {
    this.highLightDefault();
  },
  render(h) {
    return h("div", { class: ["yn-calendar"] }, [
      h(
        genComponentName("popup"),
        {
          on: {
            input: this.handleChange,
            beforeEnter: this.handleBeforeEnter,
            afterEnter: this.handleAfterEnter,
            beforeLeave: this.handleBeforeLeave,
            afterLeave: this.handleAfterLeave,
          },
          directives: [{ name: "show", value: this.value }],
          props: { position: "bottom" },
          style: { height: "90%" },
          ref: "popup",
        },
        [
          h(
            genComponentName("flex"),
            {
              class: ["yn-calendar-content"],
              props: { flexDirection: "column" },
            },
            [
              h(
                genComponentName("flex-item"),
                { class: ["yn-calendar-header"], ref: "header" },
                [this.createHeaderArea(h)]
              ),
              h(
                genComponentName("flex-item"),
                {
                  ref: "scroller",
                  class: ["yn-calendar-body"],
                  props: { flex: 1 },
                },
                [h("div", {}, [this.createDate(h)])]
              ),
              this.createFooterArea(h),
            ]
          ),
        ]
      ),
    ]);
  },
});
