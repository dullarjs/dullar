<template>
  <transition name="yn-zoom-in-top" @after-leave="handleLeave">
    <div
      v-show="visible"
      class="yn-picker-panel yn-date-range-picker yn-popper"
      :class="[]"
    >
      <div class="yn-picker-panel__body-wrapper">
        <div class="yn-picker-panel__body">
          <div class="yn-picker-panel__content is-left">
            <div class="yn-date-picker__header">
              <button
                type="button"
                @click="leftPrevYear"
                class="yn-picker-panel__icon-btn yn-date-picker__prev-btn yn-icon-d-arrow-left"
                @mouseenter="leftPrevYearHover = true"
                @mouseleave="leftPrevYearHover = false"
              >
                 <Iconfont
                  :name="`left-arrow-yan-double-${leftPrevYearHover ? '0052cc' : 'bcc1cc'}`"
                  :size="22"
                ></Iconfont>
              </button>
              <button
                type="button"
                @click="leftPrevMonth"
                class="yn-picker-panel__icon-btn yn-date-picker__prev-btn yn-icon-arrow-left"
                @mouseenter="leftPrevMonthHover = true"
                @mouseleave="leftPrevMonthHover = false"
              >
                <Iconfont
                  :name="`left-arrow-yan-${leftPrevMonthHover ? '0052cc' : 'bcc1cc'}`"
                  :size="22"
                ></Iconfont>
              </button>
              <span class="yn-date-picker__header-label">
                {{ `${leftYear}年 ${ leftMonth + 1 }月` }}
              </span>
            </div>
            <DataTable
              :date="leftDate"
              :defaultValue="defaultValue ? defaultValue : null"
              :minDate="minDate"
              :maxDate="maxDate"
              :rangeState="rangeState"
              :selectionMode="selectionMode"
              :before="before"
              :after="after"
              :doubleModeAllowSameDate="doubleModeAllowSameDate"
              @pick="handleRangePick"
              @changerange="handleChangeRange"
              @mouseMovEnd="mouseMovEnd"
              @mouseMoving="mouseMoving"
            ></DataTable>
          </div>
          <div class="yn-picker-panel__content is-right">
            <div class="yn-date-picker__header">
              <span class="yn-date-picker__header-label">
                {{ `${rightYear}年 ${ rightMonth + 1 }月` }}
              </span>
              <button
                type="button"
                @click="rightNextMonth"
                class="yn-picker-panel__icon-btn yn-date-picker__next-btn yn-icon-arrow-right"
                @mouseenter="rightNextMonthHover = true"
                @mouseleave="rightNextMonthHover = false"
              >
                <Iconfont
                  :name="`left-arrow-yan-${rightNextMonthHover ? '0052cc' : 'bcc1cc'}`"
                  :size="22"
                  :rotate="180"
                ></Iconfont>
              </button>
              <button
                type="button"
                @click="rightNextYear"
                class="yn-picker-panel__icon-btn yn-date-picker__next-btn yn-icon-d-arrow-right"
                @mouseenter="rightNextYearHover = true"
                @mouseleave="rightNextYearHover = false"
              >
                <Iconfont
                  :name="`left-arrow-yan-double-${rightNextYearHover ? '0052cc' : 'bcc1cc'}`"
                  :size="22"
                  :rotate="180"
                ></Iconfont>
              </button>
            </div>
            <DataTable
              :date="rightDate"
              :defaultValue="defaultValue ? defaultValue : null"
              :minDate="minDate"
              :maxDate="maxDate"
              :rangeState="rangeState"
              :selectionMode="selectionMode"
              :before="before"
              :after="after"
              :doubleModeAllowSameDate="doubleModeAllowSameDate"
              @pick="handleRangePick"
              @changerange="handleChangeRange"
              @mouseMovEnd="mouseMovEnd"
              @mouseMoving="mouseMoving"
            ></DataTable>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
import "./style/datePanel.scss";
import DataTable from "../basic/date-table.vue";
import Iconfont from "@/components/iconfont";
import { prevMonth, nextMonth, prevYear, nextYear, isDate, nextDate, isSameDate } from "@/utils/date-util.js";
const calcDefaultValue = (defaultValue) => {
  if (Array.isArray(defaultValue)) {
    return [new Date(defaultValue[0]), new Date(defaultValue[1])];
  } else if (defaultValue) {
    return [new Date(defaultValue), nextDate(new Date(defaultValue), 1)];
  } else {
    return [new Date(), nextDate(new Date(), 1)];
  }
}
export default {
  name: "CalendarDateRangePanel",
  components: {
    Iconfont,
    DataTable,
  },
  data() {
    return {
      before: "",
      after: "",
      value: "",
      defaultValue: "",
      visible: false,
      minDate: "",
      maxDate: "",
      leftDate: new Date(),
      rightDate: nextMonth(new Date()),
      selectionMode: "day",
      leftPrevYearHover: false,
      leftPrevMonthHover: false,
      rightNextYearHover: false,
      rightNextMonthHover: false,
      rangeState: {
        endDate: null,
        selecting: false,
        row: null,
        column: null
      },
      doubleModeAllowSameDate: true
    };
  },
  computed: {
    leftYear() {
      return this.leftDate.getFullYear();
    },
    leftMonth() {
      return this.leftDate.getMonth();
    },
    rightYear() {
      return this.rightDate.getFullYear();
    },
    rightMonth() {
      return this.rightDate.getMonth();
    }
  },
  watch: {
    value(n) {
      if (!n) {
        this.minDate = null;
        this.maxDate = null;
      } else {
        this.minDate = isDate(n[0]) ? new Date(n[0]) : null;
        this.maxDate = isDate(n[1]) ? new Date(n[1]) : null;
        if (this.minDate) {
          this.leftDate = this.minDate;
          if (this.maxDate) {
            const minDateYear = this.minDate.getFullYear();
            const minDateMonth = this.minDate.getMonth();
            const maxDateYear = this.maxDate.getFullYear();
            const maxDateMonth = this.maxDate.getMonth();
            this.rightDate = minDateYear === maxDateYear && minDateMonth === maxDateMonth
              ? nextMonth(this.maxDate)
              : this.maxDate;
          } else {
            this.rightDate = nextMonth(this.leftDate);
          }
        } else {
          this.leftDate = calcDefaultValue(this.defaultValue)[0];
          this.rightDate = nextMonth(this.leftDate);
        }
      }
    }
    // defaultValue: {
    //   immediate: true,
    //   handler(val) {
    //     if (Array.isArray(val)) {
    //       const [left, right] = calcDefaultValue(val);
    //       this.leftDate = left;
    //       this.rightDate = right;
    //     }
    //   }
    // }
  },
  methods: {
    leftPrevMonth() {
      this.leftDate = prevMonth(this.leftDate);
      this.rightDate = nextMonth(this.leftDate);
    },
    leftPrevYear() {
      this.leftDate = prevYear(this.leftDate);
      this.rightDate = nextMonth(this.leftDate)
    },

    rightNextMonth() {
      this.leftDate = nextMonth(this.leftDate)
      this.rightDate = nextMonth(this.leftDate);
    },

    rightNextYear() {
      this.leftDate = nextYear(this.leftDate)
      this.rightDate = nextMonth(this.leftDate);
    },
    mouseMoving(option) {
      this.$emit("mouseMoving", option);
    },
    mouseMovEnd() {
      this.$emit("mouseMovEnd");
    },
    handleChangeRange(val) {
      this.minDate = val.minDate;
      this.maxDate = val.maxDate;
      this.rangeState = val.rangeState;
    },
    handleRangePick(val, close = true) {
      const { minDate, maxDate, rangeState } = val
      if (new Date(this.maxDate).getTime() === new Date(maxDate).getTime() && new Date(this.minDate).getTime() === new Date(minDate).getTime()) {
        return;
      }
      this.minDate = minDate;
      this.maxDate = maxDate;
      this.rangeState.selecting = rangeState.selecting;
      if (!close) return;
      if (isDate(maxDate) && isDate(minDate) && !isSameDate(minDate, maxDate)) {
        this.$emit('pick', [this.minDate, this.maxDate], false);
      }
      this.$emit('selecting', [this.minDate, this.maxDate], this.rangeState.selecting);
    },
    handleLeave() {
      this.$emit('dodestroy');
    }
  }
};
</script>
