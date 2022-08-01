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
    <component
      :is="currentPickPanel"
      ref="pickPanel"
      @dodestroy="doDestroy"
      @pick="pickHanler"
      @selecting="selectingHandler"
      @mouseMoving="mouseMovingHandler"
      @mouseMovEnd="mouseMoveEndHandler"
    ></component>
  </div>
</template>
<script lang="ts">
import "./style/index.scss";
import { Vue, Options, prop, mixins } from "vue-class-component";
import { YnDate } from "@/components/modules/date";
import DatePanel from './panel/date.vue';
import DateRangePanel from './panel/date-range.vue';
import { AnyObject, Callback } from "@/types";
import Popper from '@/utils/vue-popper';
import Field from "@/components/field";
import Clickoutside from '@/utils/clickoutside.js';
import { formatDate, isDate, clearTime, diff } from "@/utils/date-util.js";
import { ComponentPublicInstance } from "vue";
class Props {
  modelValue = prop<boolean>({ default: false })
  mode = prop<string>({ default: "single" })
  doubleModeAllowSameDate = prop<boolean>({ default: true })
  crossed = prop<boolean>({ default: true })
  before = prop<number | string>({ default: 1 })
  after = prop<number | string>({ default: 1 })
  unit = prop<string>({ default: "days" })
  weekText = prop<Array<string>>({
    default: () => {
      return ["日", "一", "二", "三", "四", "五", "六"];
    }
  })
  defaultDate = prop<string>({ default: YnDate().format() })
  defaultStartDate = prop<string>({ default: YnDate().format() })
  defaultEndDate = prop<string>({ default: YnDate().add(1, "day").format() })
  fromDateMark = prop<string>({ default: "入住" })
  toDateMark = prop<string>({ default: "离店" })
  todayMark = prop<string>({ default: "今天" })
  diffUnit = prop<string>({ default: "晚" })
  dateRefenceWidth = prop<string>({ default: "100%" })
  size = prop<string>({ default: "medium" })
  roundType = prop<string>({ default: "" })
}
@Options({
  name: "YnDatePicker",
  components: {
    Field
  },
  emits: ["input", "focus", "selecting", "getDate", "update:modelValue"],
  props: {
    placement: {
      default: "bottom-start"
    },
    weekDesParse: {
      default() {
        return (date: string) => {
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
      }
    }
  },
  directives: { Clickoutside },
  watch: {
    mode() {
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
    },
    modelValue(n) {
      if (n) {
        this.showPicker()
      }
    },
    defaultDate: {
      immediate: true,
      handler(val: string) {
        this.dateValue = val;
        if (this.picker) {
          this.picker.defaultValue = new Date(val);
        }
      }
    },
    defaulStartDate: {
      immediate: true,
      handler(val: string) {
        if (this.mode === "single") return;
        this.dateValue = [new Date(val), new Date(this.defaultEndDate)];
        if (this.picker) {
          this.picker.defaultValue = [new Date(val), new Date(this.defaultEndDate)];
        }
      }
    },
    defaultEndDate: {
      immediate: true,
      handler(val: string) {
        if (this.mode === "single") return;
        this.dateValue = [new Date(this.defaultStartDate), new Date(val)];
        if (this.picker) {
          this.picker.defaultValue = [new Date(this.defaultStartDate), new Date(val)];
        }
      }
    }
  }
})
export default class YnDatePicker extends mixins(Vue, Popper).with(Props) {
  static componentName = "YnDatePicker";

  arrowControl = false;
  picker!: ComponentPublicInstance;
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
    if (this.modelValue) classnames.push('is-focus');
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
    return this.modelValue && !this.selecting;
  }
  get endDateSelecting() {
    return this.modelValue && this.selecting;
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
  get currentPickPanel() {
    return this.getPanel(this.mode);
  }

  handleDateSelecting() {
    this.selecting = false;
    if (this.picker) {
      (this.picker as ComponentPublicInstance<{ rangeState: AnyObject }>).rangeState.selecting = this.selecting;
    }
  }
  handleClick() {
    if (!this.modelValue) {
     this.$emit("update:modelValue", true);
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
      this.$emit("update:modelValue", false);
      (this.picker as ComponentPublicInstance<{ visible: boolean }>).visible = false;
      // this.destroyPopper();
    }
  }
  showPicker() {
    if (!this.picker) {
      this.mountPicker();
    }
    this.visibleArrowData = false;
    (this.picker as ComponentPublicInstance<{ visible: boolean }>).visible = true;
    this.updatePopper();
    (this.picker as ComponentPublicInstance<{ value: string | string[] | Date | Date[] }>).value = this.dateValue;
  }

  mountPicker() {
    this.picker = this.$refs.pickPanel as ComponentPublicInstance;
    if (this.mode === "single") {
      (this.picker as ComponentPublicInstance<{ defaultValue: Date }>).defaultValue = new Date(this.defaultDate);
    } else {
      (this.picker as ComponentPublicInstance<{ defaultValue: Date[] }>).defaultValue = [new Date(this.defaultStartDate), new Date(this.defaultEndDate)];
    }
    this.popperElm = this.picker.$el;
    (this.picker as ComponentPublicInstance<{ width: number }>).width = (this.reference as HTMLElement).getBoundingClientRect().width;
    (this.picker as ComponentPublicInstance<{ arrowControl: boolean }>).arrowControl = this.arrowControl || false;
    (this.picker as ComponentPublicInstance<{ selectionMode: string }>).selectionMode = this.mode === "single" ? "day" : "range";
    (this.picker as ComponentPublicInstance<{ before: number | string }>).before = this.before;
    (this.picker as ComponentPublicInstance<{ after: number | string }>).after = this.after;
    (this.picker as ComponentPublicInstance<{ doubleModeAllowSameDate: boolean }>).doubleModeAllowSameDate = this.doubleModeAllowSameDate;

    // this.$el.appendChild(this.picker.$el);
    // this.picker.resetView && this.picker.resetView();
  }
  mouseMoveEndHandler() {
    this.isMouseMoving = false;
  }
  mouseMovingHandler(option: AnyObject) {
    const { date } = option;
    this.isMouseMoving = true;
    this.mouseMoveDate = date;
  }
  selectingHandler(date = [], selecting: true) {
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
  }
  pickHanler(date = '', visible = false) {
    this.dateValue = date;
    (this.picker as ComponentPublicInstance<{ visible: boolean }>).visible = visible;
    this.$emit("update:modelValue", visible);
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
  }
  unmountPicker() {
    if (this.picker) {
      this.picker.$el.parentNode.removeChild(this.picker.$el);
    }
  }
  created() {
    this.panel = this.getPanel(this.mode);
  }
}
</script>
