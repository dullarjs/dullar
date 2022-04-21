<template>
  <table
    cellspacing="0"
    cellpadding="0"
    class="yn-date-table"
    @click="handleClick"
    @mousemove="handleMouseMove"
  >
    <tbody>
      <tr>
        <th v-for="(week, key) in WEEKS" :key="key">{{ weekText[key] }}</th>
      </tr>
      <tr class="yn-date-table__row" v-for="(row, key) in rows" :key="key">
        <td v-for="(cell, key) in row" :class="getCellClasses(cell)" :key="key">
          <div>
            <span>
              {{ cell.text }}
            </span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import "./style.scss";
import {
  isDate,
  getStartDateOfMonth,
  getFirstDayOfMonth,
  getDayCountOfMonth,
  clearTime,
  nextDate,
  prevDate
} from "@/utils/date-util.js";
const WEEKTEXTs = ["日", "一", "二", "三", "四", "五", "六"];
const WEEKS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const getDateTimestamp = function (time) {
  if (typeof time === "number" || typeof time === "string") {
    return clearTime(new Date(time)).getTime();
  } else if (time instanceof Date) {
    return clearTime(time).getTime();
  } else {
    return NaN;
  }
};
export default {
  name: "DataTable",
  props: {
    doubleModeAllowSameDate: {
      type: Boolean,
      default: true
    },
    before: {
      default: ""
    },
    after: {
      default: ""
    },
    minDate: {},
    maxDate: {},
    value: {},
    defaultValue: {
      validator(val) {
        // either: null, valid Date object, Array of valid Date objects
        return val === null || isDate(val) || (Array.isArray(val) && val.every(isDate));
      }
    },
    firstDayOfWeek: {
      default: 7,
      type: Number,
      validator: (val) => val >= 1 && val <= 7,
    },
    date: {},
    selectionMode: {
      default: "day",
    },
    rangeState: {
      default() {
        return {
          endDate: null,
          selecting: false
        };
      }
    }
  },
  computed: {
    offsetDay() {
      const week = this.firstDayOfWeek;
      // 周日为界限，左右偏移的天数，3217654 例如周一就是 -1，目的是调整前两行日期的位置
      return week > 3 ? 7 - week : -week;
    },
    weekText() {
      const week = this.firstDayOfWeek;
      return WEEKTEXTs.concat(WEEKTEXTs).slice(week, week + 7);
    },
    WEEKS() {
      const week = this.firstDayOfWeek;
      return WEEKS.concat(WEEKS).slice(week, week + 7);
    },

    year() {
      return this.date.getFullYear();
    },

    month() {
      return this.date.getMonth();
    },

    startDate() {
      return getStartDateOfMonth(this.year, this.month);
    },
    startLimitedDate() {
      if (!isNaN(parseInt(this.before))) {
        return prevDate(new Date(), Math.abs(parseInt(this.before)));
      } else {
        return "";
      }
    },
    endLimitedDate() {
      if (!isNaN(parseInt(this.after))) {
        return nextDate(new Date(), Math.abs(parseInt(this.after)));
      } else {
        return "";
      }
    },
    rows() {
      // TODO: refactory rows / getCellClasses
      const date = new Date(this.year, this.month, 1);
      let day = getFirstDayOfMonth(date); // day of first day
      const dateCountOfMonth = getDayCountOfMonth(
        date.getFullYear(),
        date.getMonth()
      );
      const dateCountOfLastMonth = getDayCountOfMonth(
        date.getFullYear(),
        date.getMonth() === 0 ? 11 : date.getMonth() - 1
      );

      day = day === 0 ? 7 : day;

      const offset = this.offsetDay;
      const rows = this.tableRows;
      let count = 1;

      const startDate = this.startDate;
      const disabledDate = this.disabledDate;
      const cellClassName = this.cellClassName;
      const selectedDate = [];
      const now = getDateTimestamp(new Date());

      for (let i = 0; i < 6; i++) {
        const row = rows[i];

        for (let j = 0; j < 7; j++) {
          let cell = row[j];
          if (!cell) {
            cell = {
              row: i,
              column: j,
              type: "normal",
              inRange: false,
              start: false,
              end: false,
            };
          }

          cell.type = "normal";

          const index = i * 7 + j;
          const time = nextDate(startDate, index - offset).getTime();
          cell.inRange =
            time >= getDateTimestamp(this.minDate) &&
            time <= getDateTimestamp(this.maxDate);
          cell.start = this.minDate && time === getDateTimestamp(this.minDate);
          cell.end = this.maxDate && time === getDateTimestamp(this.maxDate);
          const isToday = time === now;

          if (isToday) {
            cell.type = "today";
          }

          if (i >= 0 && i <= 1) {
            const numberOfDaysFromPreviousMonth =
              day + offset < 0 ? 7 + day + offset : day + offset;

            if (j + i * 7 >= numberOfDaysFromPreviousMonth) {
              cell.text = count++;
            } else {
              cell.text =
                dateCountOfLastMonth -
                (numberOfDaysFromPreviousMonth - (j % 7)) +
                1 +
                i * 7;
              cell.type = "prev-month";
            }
          } else {
            if (count <= dateCountOfMonth) {
              cell.text = count++;
            } else {
              cell.text = count++ - dateCountOfMonth;
              cell.type = "next-month";
            }
          }

          let cellDate = new Date(time);
          cell.disabled =
            typeof disabledDate === "function" && disabledDate(cellDate);
          cell.selected =
            selectedDate.findIndex(
              (date) => date.getTime() === cellDate.getTime()
            ) > -1;
          cell.customClass =
            typeof cellClassName === "function" && cellClassName(cellDate);
          // this.$set(row, j, cell);
          row.splice(j, 1, cell);
        }
      }

      return rows;
    },
  },
  watch: {
    'rangeState.endDate'(newVal) {
      this.markRange(this.minDate, newVal);
    },

    minDate(newVal, oldVal) {
      if (getDateTimestamp(newVal) !== getDateTimestamp(oldVal)) {
        this.markRange(this.minDate, this.maxDate);
      }
    },

    maxDate(newVal, oldVal) {
      if (getDateTimestamp(newVal) !== getDateTimestamp(oldVal)) {
        this.markRange(this.minDate, this.maxDate);
      }
    }
  },
  data() {
    return {
      isMouseMoving: false,
      lastRow: -1,
      lastColumn: -1,
      tableRows: [[], [], [], [], [], []],
    };
  },
  methods: {
    mouseMovEnd() {
      // 鼠标 划出日期元素 或者 划到 disable 日期 算滑动结束
      if (this.isMouseMoving) {
        this.$emit("mouseMovEnd");
        this.isMouseMoving = false;
      }
    },
    mouseMoving(row, column) {
      // 当 鼠标在 可选日期范围内移动，实时改变 input内日期
      // if (this.rows[row][column].disabled) {
      //   this.mouseMovEnd();
      //   return;
      // }
      this.isMouseMoving = true;
      this.$emit('mouseMoving', {
        date: this.getDateOfCell(row, column),
        selecting: this.rangeState.selecting
      });
    },
    moveChangeRange(row, column) {
      if (!this.rangeState.selecting) return;
      // can not select disabled date
      // only update rangeState when mouse moves to a new cell
      // this avoids frequent Date object creation and improves performance
      this.$emit('changerange', {
        minDate: this.minDate,
        maxDate: this.maxDate,
        rangeState: {
          selecting: true,
          endDate: this.getDateOfCell(row, column)
        }
      });
    },
    handleMouseMove(event) {
      let target = event.target;
      if (target.tagName === 'SPAN') {
        target = target.parentNode.parentNode;
      }
      if (target.tagName === 'DIV') {
        target = target.parentNode;
      }
      if (target.tagName !== 'TD') {
        this.mouseMovEnd();
        return
      }

      const row = target.parentNode.rowIndex - 1;
      const column = target.cellIndex;
      if (this.rows[row][column].disabled) {
        this.mouseMovEnd();
        return
      }
      if (row === this.lastRow && column === this.lastColumn) return;
      this.lastRow = row;
      this.lastColumn = column;
      this.mouseMoving(row, column);
      this.moveChangeRange(row, column);
    },
    handleClick(event) {
      let target = event.target;
      if (target.tagName === 'SPAN') {
        target = target.parentNode.parentNode;
      }
      if (target.tagName === 'DIV') {
        target = target.parentNode;
      }

      if (target.tagName !== 'TD') return;

      const row = target.parentNode.rowIndex - 1;
      const column = target.cellIndex;
      const cell = this.rows[row][column];

      if (cell.disabled || cell.type === 'week') return;

      const newDate = this.getDateOfCell(row, column);

      if (this.selectionMode === 'range') {
        if (!this.rangeState.selecting) {
          this.$emit('pick', {minDate: newDate, maxDate: null, rangeState: { selecting: true }});
        } else {
          if (newDate.getTime() > this.minDate.getTime()) {
            this.$emit('pick', {minDate: this.minDate, maxDate: newDate, rangeState: { selecting: false }});
          } else if (newDate.getTime() == this.minDate.getTime() && !this.doubleModeAllowSameDate) {
            this.$emit('pick', {minDate: this.minDate, maxDate: newDate, rangeState: { selecting: true }});
          } else {
            this.$emit('pick', {minDate: newDate, maxDate: this.minDate, rangeState: { selecting: false }});
          }
        }
      } else if (this.selectionMode === 'day') {
        this.$emit('pick', newDate);
      }
      this.mouseMovEnd();
    },
    getDateOfCell(row, column) {
      const offsetFromStart = row * 7 + column - this.offsetDay;
      return nextDate(this.startDate, offsetFromStart);
    },
    cellMatchesDate(cell, date) {
      const value = new Date(date);
      return (
        this.year === value.getFullYear() &&
        this.month === value.getMonth() &&
        Number(cell.text) === value.getDate()
      );
    },
    getCellClasses(cell) {
      const selectionMode = this.selectionMode;
      const defaultValue = this.defaultValue
        ? Array.isArray(this.defaultValue)
          ? this.defaultValue
          : [this.defaultValue]
        : [];

      let classes = [];
      if ((cell.type === "normal" || cell.type === "today") && !cell.disabled) {
        classes.push("available");
        if (cell.type === "today") {
          classes.push("today");
        }
      } else {
        classes.push(cell.type);
      }

      if (
        cell.type === "normal" &&
        defaultValue.some((date) => this.cellMatchesDate(cell, date))
      ) {
        classes.push("default");
      }

      if (
        selectionMode === "day" &&
        (cell.type === "normal" || cell.type === "today") &&
        this.cellMatchesDate(cell, this.value)
      ) {
        classes.push("current");
      }

      if (
        cell.inRange &&
        (cell.type === "normal" ||
          cell.type === "today")
      ) {
        classes.push("in-range");

        if (cell.start) {
          classes.push("start-date");
        }

        if (cell.end) {
          classes.push("end-date");
        }
      }

      if (cell.disabled) {
        classes.push("disabled");
      }

      if (cell.selected) {
        classes.push("selected");
      }

      if (cell.customClass) {
        classes.push(cell.customClass);
      }

      return classes.join(" ");
    },
    markRange(minDate, maxDate) {
      minDate = getDateTimestamp(minDate);
      maxDate = getDateTimestamp(maxDate) || minDate;
      [minDate, maxDate] = [Math.min(minDate, maxDate), Math.max(minDate, maxDate)];

      const startDate = this.startDate;
      const rows = this.rows;
      for (let i = 0, k = rows.length; i < k; i++) {
        const row = rows[i];
        for (let j = 0, l = row.length; j < l; j++) {

          const cell = row[j];
          const index = i * 7 + j;
          const time = nextDate(startDate, index - this.offsetDay).getTime();

          cell.inRange = minDate && time >= minDate && time <= maxDate;
          cell.start = minDate && time === minDate;
          cell.end = maxDate && time === maxDate;
        }
      }
    },
    disabledDate(celldate) {
      if (!isNaN(parseInt(this.before)) || !isNaN(parseInt(this.after))) {
        if (getDateTimestamp(celldate) < getDateTimestamp(this.startLimitedDate) ||
          getDateTimestamp(celldate) > getDateTimestamp(this.endLimitedDate)) {
          return true;
        } else {
          return false;
        }
      } else {
        return false
      }
    }
  },
};
</script>
