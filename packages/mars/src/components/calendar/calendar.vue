<template>
  <div class="yn-calendar" ref="reference"
    v-clickoutside="handleClose"
    @click="handleClick"
  >
    <template v-if="mode === 'single'">
      <div class="yn-calendar__single">
        <field
          v-model="displayValue"
          type="text"
          :placeholder="currentPlaceholder"
          :disabled="disabled"
          :readonly="readonly"
        ></field>
      </div>
    </template>
    <template v-else>
      <div class="yn-calendar__double">
        double
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
import { AnyObject } from "@/types";
import Popper from '@/utils/vue-popper';
import Field from "@/components/field";
import Clickoutside from '@/utils/clickoutside.js';
@Component({
  name: "Calendar",
  components: {
    Field
  },
  directives: { Clickoutside }
})
export default class YnCalendar extends Mixins(Vue, Popper) {
  static componentName = "YnCalendar";
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

  panel!: AnyObject;
  displayValue = "";
  disabled = true;
  readonly = true;
  currentPlaceholder = "";

  get reference() {
    return  this.$refs.reference;
  }
  @Watch("mode")
  onMode() {
    this.panel = this.getPanel(this.mode);
  }
  @Watch("value")
  onValue(n: boolean) {
    if (n) {
      this.showPicker()
    }
  }
  handleClick() {
    if (!this.value) {
     this.$emit("input", true);
    }
    this.$emit('focus', this);
  }
  handleClose() {
    if (this.value) {
      this.picker.visible = false;
      this.$emit("input", false);
    }
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
      this.picker.visible = false;
      this.destroyPopper();
    }
  }
  showPicker() {
    if (!this.picker) {
      this.mountPicker();
    }
    this.picker.visible = true;

    this.updatePopper();
  }

  mountPicker() {
    this.picker = new Vue(this.panel).$mount();
    // this.picker.defaultValue = this.defaultValue;
    this.popperElm = this.picker.$el;
    this.picker.width = (this.reference as HTMLElement).getBoundingClientRect().width;
    this.picker.arrowControl = this.arrowControl || this.timeArrowControl || false;

    this.$el.appendChild(this.picker.$el);
    this.picker.resetView && this.picker.resetView();

    this.picker.$on('dodestroy', this.doDestroy);
    // this.picker.$on('pick', (date = '', visible = false) => {
    //   this.userInput = null;
    //   this.pickerVisible = this.picker.visible = visible;
    //   this.emitInput(date);
    //   this.picker.resetView && this.picker.resetView();
    // });

    // this.picker.$on('select-range', (start, end, pos) => {
    //   if (this.refInput.length === 0) return;
    //   if (!pos || pos === 'min') {
    //     this.refInput[0].setSelectionRange(start, end);
    //     this.refInput[0].focus();
    //   } else if (pos === 'max') {
    //     this.refInput[1].setSelectionRange(start, end);
    //     this.refInput[1].focus();
    //   }
    // });
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
