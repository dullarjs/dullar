<template>
  <transition name="yn-zoom-in-top" @after-leave="handleLeave">
    <div
      v-show="visible"
      class="yn-picker-panel yn-date-picker yn-popper"
      :class="[]"
    >
      <div class="yn-picker-panel__body-wrapper">
        <div class="yn-date-picker__header">
          <button
            type="button"
            @click="prevYear"
            class="yn-picker-panel__icon-btn yn-date-picker__prev-btn yn-icon-d-arrow-left"
            @mouseenter="prevYearHover = true"
            @mouseleave="prevYearHover = false"
          >
            <Iconfont
              :name="`checkRight-${prevYearHover ? '0052cc' : '303133'}`"
              :rotate="180"
              :size="12"
            ></Iconfont>
          </button>
          <button
            type="button"
            @click="prevMonth"
            class="yn-picker-panel__icon-btn yn-date-picker__prev-btn yn-icon-arrow-left"
            @mouseenter="prevMonthHover = true"
            @mouseleave="prevMonthHover = false"
          >
            <Iconfont
              :name="`arrowRight-${prevMonthHover ? '0052cc' : '303133'}`"
              :rotate="180"
              :size="12"
            ></Iconfont>
          </button>
          <span class="yn-date-picker__header-label">
            {{ `${year}年 ${ month + 1 }月` }}
          </span>
          <button
            type="button"
            @click="nextMonth"
            class="yn-picker-panel__icon-btn yn-date-picker__next-btn yn-icon-arrow-right"
            @mouseenter="nextMonthHover = true"
            @mouseleave="nextMonthHover = false"
          >
            <Iconfont
              :name="`arrowRight-${nextMonthHover ? '0052cc' : '303133'}`"
              :size="12"
            ></Iconfont>
          </button>
          <button
            type="button"
            @click="nextYear"
            class="yn-picker-panel__icon-btn yn-date-picker__next-btn yn-icon-d-arrow-right"
            @mouseenter="nextYearHover = true"
            @mouseleave="nextYearHover = false"
          >
            <Iconfont
              :name="`checkRight-${nextYearHover ? '0052cc' : '303133'}`"
              :size="12"
            ></Iconfont>
          </button>
        </div>
        <div class="yn-picker-panel__body">
          <div class="yn-picker-panel__content">
            <DataTable
              :date="date"
              :defaultValue="defaultValue ? new Date(defaultValue) : null"
              :value="value"
              :before="before"
              :after="after"
              @pick="handleDatePick"
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
import { clearTime, prevMonth, nextMonth, prevYear, nextYear, isDate } from "@/utils/date-util.js";

export default {
  name: "CalendarDatePanel",
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
      selectableRange: [],
      visible: false,
      date: new Date(),
      selectionMode: "day",
      prevYearHover: false,
      nextYearHover: false,
      prevMonthHover: false,
      nextMonthHover: false
    };
  },
  computed: {
     year() {
      return this.date.getFullYear();
    },

    month() {
      return this.date.getMonth();
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (isDate(val)) {
          this.date = val ? new Date(val) : new Date();
        }
      }
    }
  },
  methods: {
    prevMonth() {
      this.date = prevMonth(this.date);
    },

    nextMonth() {
      this.date = nextMonth(this.date);
    },

    prevYear() {
      this.date = prevYear(this.date);
    },

    nextYear() {
      this.date = nextYear(this.date);
    },
    handleDatePick(value) {
      if (this.selectionMode === 'day') {
        let newDate = clearTime(value);
        // change default time while out of selectableRange
        this.date = newDate;
        this.$emit("pick", this.date);
      }
    },
    handleLeave() {
      this.$emit('dodestroy');
    }
  }
};
</script>
