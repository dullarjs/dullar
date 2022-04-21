<template>
  <div class="yn-date-picker" ref="reference"
    v-clickoutside="hidePicker"
    @click="handleClick"
    :class="datePickerClassname"
    :style="style"
  >
    <template v-if="mode === 'single'">
      <input
        class="yn-date-picker__input"
        :value="displayValue"
        type="text"
        :disabled="disabled"
        :readonly="readonly"
      />
      <span class="yn-date-picker--WeekDes">{{ weekDesParse(displayValue) }}</span>
    </template>
    <template v-else>
      <div class="yn-date-picker__startDate"
        :class="{
          'is-selected': startDateSelecting
        }"
        @click="handleDateSelecting"
      >
        <span class="yn-date-picker--fromDateMark">{{ fromDateMark }}</span>
        <input
          class="yn-date-picker__input"
          :value="displayValue && displayValue[0]"
          type="text"
          :disabled="disabled"
          :readonly="readonly"
        />
      <span class="yn-date-picker--fromWeekDes">{{ weekDesParse(displayValue[0]) }}</span>
      </div>
      <div class="yn-date-picker__rangMid">
        <span class="yn-date-picker__roundhotel" v-if="roundType === 'hotel'">
          {{ diffNightNumber + diffUnit }}
        </span>
      </div>
      <div class="yn-date-picker__endDate"
        :class="{
          'is-selected': endDateSelecting
        }">
        <span class="yn-date-picker--toDateMark">{{ toDateMark }}</span>
        <input
          class="yn-date-picker__input"
          :value="displayValue && displayValue[1]"
          type="text"
          :disabled="disabled"
          :readonly="readonly"
        />
        <span class="yn-date-picker--toWeekDes">{{ weekDesParse(displayValue[1]) }}</span>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import "./style/index.scss";
import Vue from "vue";
import { Component, Prop, Watch, Mixins } from "vue-property-decorator";
import { YnDate } from "@/components/modules/date";
import DatePanel from './panel/date.vue';
import DateRangePanel from './panel/date-range.vue';
import { AnyObject, Callback } from "@/types";
import Popper from '@/utils/vue-popper';
import Field from "@/components/field";
import Clickoutside from '@/utils/clickoutside.js';
import { formatDate, isDate, clearTime, diff } from "@/utils/date-util.js";
@Component({
  name: "DatePicker",
  components: {
    Field
  },
  props: {
    placement: {
      default: "bottom-start"
    }
  },
  directives: { Clickoutside }
})
export default class YnDatePicker extends Mixins(Vue, Popper) {
  static componentName = "YnDatePicker";
  @Prop({
    type: Boolean,
    default: false,
  })
  value!: boolean;
  @Prop({
    type: String,
    default: "single",
  })
  mode!: string;
  @Prop({
    type: Boolean,
    default: true,
  })
  doubleModeAllowSameDate!: boolean;
  @Prop({
    type: Boolean,
    default: true,
  })
  crossed!: boolean;
  @Prop({
    type: [Number, String],
    default: 1,
  })
  before!: number | string;
  @Prop({
    type: [Number, String],
    default: 1,
  })
  after!: number | string;
  @Prop({
    type: String,
    default: "days",
  })
  unit!: string;
  @Prop({
    type: Array,
    default: () => {
      return ["日", "一", "二", "三", "四", "五", "六"];
    },
  })
  weekText!: string[];
  @Prop({
    type: String,
    default: YnDate().format(),
  })
  defaultDate!: string;
  @Prop({
    type: String,
    default: YnDate().format(),
  })
  defaultStartDate!: string;
  @Prop({
    type: String,
    default: YnDate().add(1, "day").format(),
  })
  defaultEndDate!: string;
  @Prop({
    type: String,
    default: "入住",
  })
  fromDateMark!: string;
  @Prop({
    type: String,
    default: "离店",
  })
  toDateMark!: string;
  @Prop({
    type: String,
    default: "今天",
  })
  todayMark!: string;
  @Prop({
    type: Function,
    default: (date: string) => {
      if (!date) {
        return "";
      } else {
        const now = clearTime(new Date());
        const dateObj = new Date(date);
        const week = dateObj.getDay();
        const weekText = [
          "周日",
          "周一",
          "周二",
          "周三",
          "周四",
          "周五",
          "周六",
        ];
        return now.getTime() === clearTime(dateObj).getTime() ? "今天" : weekText[week];
      }
    }
  })
  weekDesParse!: Callback;
  @Prop({
    type: String,
    default: "晚"
  })
  diffUnit!: string
  @Prop({
    type: String,
    default: "100%"
  })
  dateRefenceWidth!: string;
  @Prop({
    type: String,
    default: "medium"
  })
  size!: string;
  @Prop({
    type: String,
    default: ""
  })
  roundType!: string;

  mouseMoveDate: string | Date = ""; // 鼠标在可行日期上移动得到的日期
  isMouseMoving = false; // 鼠标是否在 可行日期上移动
  selecting = false; // 是否日期选择中，默认一进来为 false
  visibleArrowData = false;
  panel!: AnyObject;
  disabled = false;
  readonly = true;
  placeholder = "";
  dateValue: string | string[] | Date | Date[] = new Date();

  get datePickerClassname() {
    const classnames = [];
    if (this.value) classnames.push('is-focus');
    if (this.mode === 'single') {
      classnames.push('is-single');
    } else {
      classnames.push('is-double');
    }
    classnames.push(`yn-date-picker--${this.size}`);
    if (this.isMouseMoving) {
      classnames.push('is-mouse-moving');
    }
    return classnames;
  }
  get startDateSelecting() {
    return this.value && !this.selecting;
  }
  get endDateSelecting() {
    return this.value && this.selecting;
  }
  get style() {
    const styleObj: AnyObject = {};
    if (this.dateRefenceWidth) {
      styleObj.width = this.dateRefenceWidth;
    }
    return styleObj;
  }
  get diffNightNumber() {
    if (this.mode === "single") {
      return 0;
    } else {
      if (Array.isArray(this.dateValue) &&
        isDate(this.dateValue[0]) &&
        isDate(this.dateValue[1])) {
        return diff(this.dateValue[0], this.dateValue[1])
      } else {
        return 0;
      }
    }
  }
  get reference() {
    return  this.$refs.reference;
  }
  get displayValue() {
    if (this.isMouseMoving) {
      if (Array.isArray(this.dateValue) && this.mode === "double") {
        if (!this.selecting) {
          return [formatDate(new Date(this.mouseMoveDate)), formatDate(new Date(this.dateValue[1]))]
        } else {
          return [formatDate(new Date(this.dateValue[0])), formatDate(new Date(this.mouseMoveDate))]
        }
      } else {
        return formatDate(new Date(this.mouseMoveDate as string));
      }
    } else {
      if (Array.isArray(this.dateValue) && this.mode === "double") {
        return [formatDate(new Date(this.dateValue[0])), formatDate(new Date(this.dateValue[1]))]
      } else {
        return formatDate(new Date(this.dateValue as string));
      }
    }
  }
  @Watch("mode")
  onMode() {
    if (this.mode === "single") {
      this.dateValue = this.defaultDate;
    } else {
      this.dateValue = [this.defaultStartDate, this.defaultEndDate];
    }
    if (this.picker) {
      this.unmountPicker();
      this.panel = this.getPanel(this.mode);
      this.mountPicker();
    } else {
      this.panel = this.getPanel(this.mode);
    }
  }
  @Watch("value")
  onValue(n: boolean) {
    if (n) {
      this.showPicker()
    }
  }
  @Watch("defaultDate", {
    immediate: true
  })
  onDefaultDate(val: string) {
    this.dateValue = val;
    if (this.picker) {
      this.picker.defaultValue = new Date(val);
    }
  }
  @Watch("defaulStartDate", {
    immediate: true
  })
  onDefaultStartDate(val: string) {
    if (this.mode === "single") return;
    this.dateValue = [new Date(val), new Date(this.defaultEndDate)];
    if (this.picker) {
      this.picker.defaultValue = [new Date(val), new Date(this.defaultEndDate)];
    }
  }
  @Watch("defaultEndDate", {
    immediate: true
  })
  onDefaultEndDate(val: string) {
    if (this.mode === "single") return;
    this.dateValue = [new Date(this.defaultStartDate), new Date(val)];
    if (this.picker) {
      this.picker.defaultValue = [new Date(this.defaultStartDate), new Date(val)];
    }
  }

  handleDateSelecting() {
    this.selecting = false;
    if (this.picker) {
      this.picker.rangeState.selecting = this.selecting;
    }
  }
  handleClick() {
    if (!this.value) {
     this.$emit("input", true);
    }
    this.$emit('focus', this);
  }
  getPanel (mode: string) {
    if (mode === "single") {
      return DatePanel;
    } else {
      return DateRangePanel;
    }
  }
  hidePicker() {
    if (this.picker) {
      this.$emit("input", false);
      this.picker.visible = false;
      // this.destroyPopper();
    }
  }
  showPicker() {
    if (!this.picker) {
      this.mountPicker();
    }
    this.visibleArrowData = false;
    this.picker.visible = true;
    this.updatePopper();
    this.picker.value = this.dateValue;
  }

  mountPicker() {
    this.picker = new Vue(this.panel).$mount();
    if (this.mode === "single") {
      this.picker.defaultValue = new Date(this.defaultDate);
    } else {
      this.picker.defaultValue = [new Date(this.defaultStartDate), new Date(this.defaultEndDate)];
    }
    this.popperElm = this.picker.$el;
    this.picker.width = (this.reference as HTMLElement).getBoundingClientRect().width;
    this.picker.arrowControl = this.arrowControl || this.timeArrowControl || false;
    this.picker.selectionMode = this.mode === "single" ? "day" : "range";
    this.picker.before = this.before;
    this.picker.after = this.after;
    this.picker.doubleModeAllowSameDate = this.doubleModeAllowSameDate;

    // this.$el.appendChild(this.picker.$el);
    this.picker.resetView && this.picker.resetView();

    this.picker.$on('dodestroy', this.doDestroy);
    this.picker.$on('pick', (date = '', visible = false) => {
      this.dateValue = date;
      this.picker.visible = visible;
      this.$emit("input", visible);
      const dateWrap: AnyObject = {
        date: {},
        fromDate: {},
        toDate: {}
      };
      if (this.mode === "single") {
        dateWrap.date.date = formatDate(date);
      } else {
        dateWrap.fromDate.date = isDate(date[0]) ? formatDate(date[0]) : "";
        dateWrap.toDate.date = isDate(date[1]) ? formatDate(date[1]) : "";
      }
      console.log("this.dateWrap:", dateWrap);
      // this.picker.resetView && this.picker.resetView();
      this.$emit("getDate", dateWrap);
    });
    this.picker.$on("selecting", (date = [], selecting: true) => {
      const [minDate, maxDate] = date;
      if (!this.selecting) {
        // 选择的是 开始日期
        if (Array.isArray(this.dateValue)) {
          this.dateValue.splice(0, 1, minDate);
        } else {
          this.dateValue = [minDate, new Date()];
        }
      } else {
        Array.isArray(this.dateValue) && this.dateValue.splice(1, 1, maxDate);
      }
      this.selecting = selecting;
      const dateWrap: AnyObject = {
        date: {},
        fromDate: {},
        toDate: {}
      };
      dateWrap.fromDate.date = isDate(date[0]) ? formatDate(date[0]) : "";
      dateWrap.toDate.date = isDate(date[1]) ? formatDate(date[1]) : "";
      this.$emit("selecting", dateWrap);
    });
    this.picker.$on("mouseMoving", (option: AnyObject) => {
      const { date } = option;
      this.isMouseMoving = true;
      this.mouseMoveDate = date;
    });
    this.picker.$on("mouseMovEnd", () => {
      this.isMouseMoving = false;
    });
  }
  unmountPicker() {
    if (this.picker) {
      this.picker.$destroy();
      this.picker.$off();
      this.picker.$el.parentNode.removeChild(this.picker.$el);
    }
  }
  created() {
    this.panel = this.getPanel(this.mode);
  }
}
</script>
