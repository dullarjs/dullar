/*
 * @Author: Just be free
 * @Date:   2020-01-15 17:16:27
 * @Last Modified by:   Just be free
 * @Last Modified time: 2023-08-30 11:50:49
 * @E-mail: justbefree@126.com
 */
import Flex from "../flex";
import Popup from "../popup";
import Iconfont from "../iconfont";
import FlexItem from "../flex-item";
import { YnDate, setLocalTime } from "../modules/date";
import { drop, push } from "../modules/utils";
import { renderedMixins } from "../mixins/rendered";
import { getOffset, getScrollTop } from "../modules/dom";
import { off, on, preventDefault } from "../modules/event";
import { defineComponent, genComponentName } from "../modules/component";

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
      default: "single", // ["single", "double", "multiple"]
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
    multipleDate: {
      type: Array,
      default: () => {
        return [];
      }
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
      default: "确定",
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
    monthTitleParser: {
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
        if (type === "week") {
          if (!date) return "";
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
        } else {
          if (!date) return "请选择日期";
          const { month, day } = date || {};
          return `${Number(month)}月${Number(day)}日`;
        }
      },
    },
    closeOnClickModal: {
      type: Boolean,
      default: true,
    },
    festival: {
      type: Object,
      default: function() {
        return {};
      }
    },
    timezone: {
      type: Number,
      default: YnDate().getTimezone()
    },
    clearUnsaved: {
      type: Boolean,
      default: false
    },
    beforeDateClicked: {
      type: Function,
      default: (date) => {
        return !!date;
      }
    },
    localTimeMark: {
      type: String,
      default: "当地时间"
    }
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
      monthTitleDoms: [],
      weekBarOffsetTop: 0,
      calendarBlockHeight: 0,
      monthTitleBarDom: null,
    };
  },
  computed: {
    generateDate() {
      const calculatedMonth = this.getTimePeriod();
      return calculatedMonth.map((item) => {
        const monthObject = {
          dates: [],
        };
        const [year, month] = item.split("-");
        const daysOfMonth = YnDate(year, month).getDaysCountOfMonth();
        for (let i = 1; i <= daysOfMonth; i++) {
          const className = [];
          const j = i < 10 ? `0${i}` : String(i);
          const ynDate = YnDate(year, month, j);
          const week = ynDate.getDay();
          if (j === "01") {
            for (let k = 0; k < week; k++) {
              monthObject["dates"].push({
                className: [],
                key: `year_month_date_${k}`,
              });
            }
          }
          push(
            className,
            YnDate().isAfter(year, month, j) ? "disable" : "clickable"
          );
          let sf = null;
          const iKey = `${year}-${month}-${j}`;
          if (!this.isEmptyFestival(iKey)) {
            sf = this.festival[iKey];
          }
          // 处理假期休息日
          if (sf) {
            if (sf.workday) {
              push(className, "duty");
            } else {
              push(className, "not-duty");
            }
          }
          // 周六周日要标记出来
          if (week === 0 || week === 6) {
            push(className, "weekend");
          }
          if (this.mode === "double" && this.fromDate && this.toDate) {
            if (YnDate(year, month, j).isBetween(
                this.fromDate.ynDate,
                this.toDate.ynDate
              )) {
              push(className, "during-active");
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
          monthObject["year"] = year;
          monthObject["month"] = month;
          monthObject["key"] = `${year}-${month}`;
          const key = `${year}-${month}-${j}`;
          const festival = YnDate().isSame(year, month, j)
            ? this.todayMark
            : this.getFestival(key);
          if (this.changedNode[key]) {
            monthObject["dates"].push({ ...this.changedNode[key] });
          } else {
            monthObject["dates"].push({
              key,
              year,
              month,
              day: j,
              week,
              date: key,
              className,
              ynDate,
              mark: "",
              festival,
            });
          }
        }
        return monthObject;
      });
    },
  },
  watch: {
    value: "highLightDefault",
    timezone: "setLocalTime"
  },
  mounted() {
    this.bindEvent();
  },
  activated() {
    this.bindEvent();
  },
  deactivated() {
    this.destroy();
  },
  beforeDestroy() {
    this.destroy();
  },
  methods: {
    setLocalTime() {
      setLocalTime(this.timezone);
      this.highLightDefault();
    },
    isEmptyFestival(key) {
      if (Object.keys(this.festival).length > 0 && this.festival[key]) {
        return false;
      }
      return true;
    },
    getFestival(key) {
      if (!this.isEmptyFestival(key)) {
        const sf = this.festival[key];
        if (sf.solarFestival || sf.lunarFestival) {
          return sf.solarFestival || sf.lunarFestival;
        } else {
          if (sf.workday) {
            return "班";
          } else {
            return "休";
          }
        }
      }
      return "";
    },
    bindEvent() {
      const ele = this.$refs.scroller?.$el ?? null;
      if (!ele) return;
      on(ele, "scroll", this.handleBodyScroll);
    },
    destroy() {
      const ele = this.$refs.scroller?.$el ?? null;
      if (!ele) return;
      off(ele, "scroll", this.handleBodyScroll);
    },
    calculateMonthTitleOffsetTop({ scrollTop }) {
      let tops = [];
      this.monthTitleDoms.forEach((dom) => {
        tops.push(getOffset(dom).top - scrollTop - this.weekBarOffsetTop);
      });
      const index = tops.findIndex((i) => {
        return i <= 0 && Math.abs(i) <= this.calendarBlockHeight - 44;
      });
      if (this.monthTitleBarDom && this.monthTitleDoms[index]) {
        this.monthTitleBarDom.innerHTML = this.monthTitleDoms[index].innerHTML;
      }
    },
    handleBodyScroll(e) {
      preventDefault(e);
      const scrollTop = getScrollTop(e.target);
      const clientHeight = e.target.clientHeight;
      const diff =
        scrollTop + clientHeight - (this.scrollTop + this.clientHeight);
      const bottom =
        e.target.scrollHeight -
        e.target.offsetHeight -
        (Number(this.bottomDistance) || 0);
      const top = Number(this.topDistance) || 0;
      // diff>0 往下滑动；diff<0往上滑动
      this.calculateMonthTitleOffsetTop({ scrollTop });
      this.$emit("scroll", { e, scrollTop, diff, bottom: bottom - scrollTop });
      if (diff < 0 && !this.topTriggered && scrollTop <= top) {
        this.topTriggered = true;
        // 到达顶部
        this.$emit("reachTop", { e, scrollTop });
      } else if (diff > 0 && scrollTop > top) {
        this.topTriggered = false;
      }
      if (diff > 0 && !this.bottomTriggered && scrollTop >= bottom) {
        this.bottomTriggered = true;
        this.$emit("reachBottom", { e, scrollTop });
        // 到达底部
      } else if (diff < 0 && scrollTop >= bottom) {
        this.bottomTriggered = false;
      } else if (diff > 0 && scrollTop < bottom) {
        this.bottomTriggered = false;
      }
      this.scrollTop = scrollTop;
      this.clientHeight = clientHeight;
    },
    handleClick(date) {
      if (!this.beforeDateClicked(date)) {
        return;
      }
      if (date.className.indexOf("clickable") < 0) return;

      if (this.mode === "double") {
        this.handleDoubleMode(date);
      } else if (this.mode === "single") {
        this.handleSingleMode(date);
      } else if (this.mode === "multiple") {
        this.handleMultipleMode(date);
      }
    },
    handleSingleMode(date) {
      this.changedNode = {};
      push(date.className, ["active", "single-mode"]);
      this.changedNode = { ...this.changedNode, [date.key]: date };
      this.date = date;
      if (!this.showConfirmButton) {
        this.handleOnConfirm();
      }
    },
    handleDoubleMode(date) {
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
      this.$emit("changeDate", {
        fromDate: this.fromDate,
        toDate: this.toDate,
      });
    },
    handleMultipleMode(date) {
      date.className.push("radius");
      if (date.className.includes("active")) {
        drop(date.className, ["active"]);
        // 反选需要删除已选数据
        if (this.changedNode[date.key]) {
          delete this.changedNode[date.key];
        }
      } else {
        push(date.className, ["active"]);
        this.changedNode = { ...this.changedNode, [date.key]: date };
      }
    },
    handleOnConfirm() {
      if (this.confirmButtonClassName !== "active") {
        return false;
      }
      this.close();
      if (this.mode === "double") {
        this.$emit("getDate", { fromDate: this.fromDate, toDate: this.toDate });
      } else if (this.mode === "single") {
        this.$emit("getDate", { date: this.date });
      } else if (this.mode === "multiple") {
        this.$emit("getDate", this.changedNode);
      }
    },
    getTimePeriod() {
      const beginDate = YnDate().substract(Number(this.before), this.unit);
      const endDate = YnDate().add(Number(this.after), this.unit);
      this.beginDate = beginDate.format();
      this.endDate = endDate.format();
      return YnDate().getMonthPeriod(beginDate, endDate);
    },
    generateDateDom(h, { dates }) {
      return dates.map((date) => {
        let ref = null;
        if (
          date.className.indexOf("single-mode") > -1 ||
          date.className.indexOf("start") > -1
        ) {
          ref = "scrollPosition";
        }
        return h(
          genComponentName("flex-item"),
          {
            key: date.key,
            class: ["yn-calendar-date", ...date.className],
            ref,
            nativeOn: {
              click: this.handleClick.bind(this, date),
            },
          },
          [
            h(
              genComponentName("flex"),
              {
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
        );
      });
    },
    getDateNode(dateFormat, className = []) {
      const [year, month, day] = dateFormat.split("-");
      const festival = YnDate().isSame(year, month, day) ? this.todayMark : this.getFestival(dateFormat);
      const ynDate = YnDate(year, month, day);
      return {
        key: dateFormat,
        ynDate,
        year,
        month,
        day,
        date: dateFormat,
        week: ynDate.getDay(),
        className,
        mark: "",
        festival,
      };
    },
    getDefaultNodeFromProps(prop, className = []) {
      const key = this[prop];
      return this.getDateNode(key, ["active", "clickable", ...className]);
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
        this.confirmButtonClassName = "active";
      } else if (this.mode === "single") {
        const node = this.getDefaultNodeFromProps("defaultDate", [
          "single-mode",
          "open-days",
        ]);
        this.changedNode = { [node.key]: node };
      } else if (this.mode === "multiple") {
        this.multipleDate.forEach((item) => {
          if (!this.changedNode[item.date]) {
            const dateNode = this.getDateNode(item.date, item.disabled ? ["disable", "radius"] : ["active", "clickable", "radius"]);
            this.changedNode = { ...this.changedNode, [item.date]: dateNode };
          }
        });
      }
    },
    setPosition() {
      this.rendered(() => {
        const { scrollPosition, popup, scroller, header } = this.$refs;
        if (!scrollPosition || !popup || !scroller || !header) return;
        const headerHeight = header.$el?.offsetHeight ?? 0;
        const scrollPositionHeight = scrollPosition.$el?.offsetHeight ?? 0;
        const popupEleOffsetTop = popup.$el
          ? getOffset(popup.$el)?.top ?? 0
          : 0;
        const scrollEleOffsetTop = scrollPosition.$el
          ? getOffset(scrollPosition.$el)?.top ?? 0
          : 0;
        // this.$refs.scroller.$el.scrollTop =
        //   getOffset(el).top -
        //   this.$refs.header.$el.offsetHeight -
        //   getOffset(parent).top;
        // 解决iOS 13.4.1 日历显示选择区域异常。
        // 原因是因为在iOS 13.4.1中 获取popup 的translateY的时候有值（按理说这里应该是0）
        // 猜测：可能是iOS 13.4.1的渲染机制跟其他版本浏览器渲染不一致，测试发现跟Vue transition有关系，具体还得查一下
        // 解决方法：延迟30ms，再进行设置scrollTop值
        setTimeout(() => {
          scroller.$el.scrollTop =
            scrollEleOffsetTop -
            headerHeight -
            popupEleOffsetTop -
            scrollPositionHeight;
        }, 30);
      });
    },
    handleBeforeEnter() {
      this.$emit("beforeEnter");
    },
    handleAfterEnter() {
      const weekBar = this.$refs.weekBar;
      this.weekBarOffsetHeight = weekBar ? weekBar.offsetHeight : 0;
      this.weekBarOffsetTop = weekBar
        ? parseInt(getOffset(weekBar).top + weekBar.offsetHeight)
        : 0;
      this.monthTitleDoms = this.$el.querySelectorAll(
        ".yn-calendar-month-title"
      );
      if (this.$el) {
        const monthBlockDom = this.$el.querySelector(".yn-calendar-month");
        this.calendarBlockHeight = monthBlockDom.offsetHeight;
      }
      if (this.$refs) {
        this.monthTitleBarDom = this.$refs.monthTitleBar;
      }
      this.$emit("afterEnter");
      this.setPosition();
    },
    handleBeforeLeave() {
      this.$emit("beforeLeave");
    },
    handleAfterLeave() {
      this.$emit("afterLeave");
    },
    createDate(h) {
      return this.generateDate.map((monthItem) => {
        const { month, year, key } = monthItem;
        return h(
          "div",
          {
            key,
            class: ["yn-calendar-month", month],
          },
          [
            h(
              "header",
              {
                class: ["yn-calendar-month-title"],
                domProps: {
                  innerHTML: this.monthTitleParser(`${year}-${month}`, {
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
              this.generateDateDom(h, monthItem)
            ),
          ]
        );
      });
    },
    createNoticeBar(h) {
      if (this.noticeText && this.noticeText !== "") {
        return h("div", { class: ["yn-calendar-notice"] }, [
          h("p", { class: ["text"] }, [
            h(genComponentName("iconfont"), { class: ["waring-icon"], props: { name: "warning", size: 12 } }, []),
            this.noticeText
          ]),
        ]);
      }
    },
    createDateResultArea(h) {
      const fromPlaceHolderClass = this.fromDate
        ? ""
        : "yn-calendar-result-date-placeholder";
      const toPlaceHolderClass = this.toDate
        ? ""
        : "yn-calendar-result-date-placeholder";
      return h(genComponentName("flex"), { class: ["yn-calendar-date-result"], props: { justifyContent: "spaceAround" } }, [
        h(genComponentName("flex-item"), { class: ["yn-calendar-result-left"], props: { flex: 1 } }, [
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
                  class: [
                    "yn-calendar-result-year-day",
                    fromPlaceHolderClass,
                  ],
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
          )
        ]),
        h(genComponentName("flex-item"), { class: ["yn-calendar-result-center"], props: { flex: 0.8 } }, [
          h("div", { class: ["local-time"] }, [
            this.localTimeMark !== "" ? h("span", { class: ["mark"] }, [this.localTimeMark]) : null
          ]),
          h(
            "div",
            {
              class: ["yn-calendar-result-center-icon"],
            },
            []
          )
        ]),
        h(genComponentName("flex-item"), { class: ["yn-calendar-result-right"], props: { flex: 1 } }, [
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
                  class: [
                    "yn-calendar-result-year-day",
                    toPlaceHolderClass,
                  ],
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
          )
        ])
      ]);
    },
    createMonthTitleBar(h) {
      return h("div", { ref: "monthTitleBar", class: ["yn-month-bar"] }, []);
    },
    createHeaderArea(h) {
      return h("div", {}, [
        this.createCloseIcon(h),
        this.createTitle(h),
        this.createNoticeBar(h),
        this.createMonthTitleBar(h),
        this.createWeekBar(h),
      ]);
    },
    createFooterArea(h) {
      if (!this.showConfirmButton) return [];

      return h(
        genComponentName("flex-item"),
        {
          class: ["yn-calendar-footer"],
        },
        [
          h(
            "div",
            {
              class: ["yn-calendar-footer-inner"],
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
          ),
        ]
      );
    },
    createCloseIcon(h) {
      return h(
        genComponentName("iconfont"),
        {
          class: ["yn-calendar-close"],
          props: { name: "close", size: 12 },
          nativeOn: { click: this.closeAndClear },
        },
        []
      );
    },
    closeAndClear() {
      if (this.clearUnsaved) {
        this.changedNode = {};
      }
      this.close();
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
      return h("div", { ref: "weekBar", class: ["yn-calendar-week-bar"] }, [
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
          props: {
            position: "bottom",
            closeOnClickModal: this.closeOnClickModal,
          },
          style: { height: "85%" },
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
