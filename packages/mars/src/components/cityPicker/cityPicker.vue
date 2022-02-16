<template>
  <div class="city-picker">
    <Popover
      @update:visible="updateVisibleHandle"
      :visible.sync="popoverVisible"
      :width="pickerWidth"
      :placement="'bottom'"
      :visibleArrow="false"
      :popperClass="'popper-city-picker'"
    >
      <p class="city-picker-input-des">可直接选择城市或输入城市名称</p>
      <div class="city-picker__content">
        <div class="history-city-block">
          <p class="history-city-block__title">历史查询</p>
          <ul class="city-block-list">
            <li class="city-block-item"></li>
          </ul>
        </div>
      </div>
      <template v-slot:reference>
        <input
          ref="pickerInput"
          class="city-picker__input"
        >
      </template>
    </Popover>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Mixins, Prop  } from "vue-property-decorator";
import "./style/index.scss";
import { AnyObject } from "../../types";
@Component({
  name: "CityPicker"
})
export default class CityPicker extends Mixins(Vue) {
  popoverVisible = false;
  pickerWidth = 200;
  updateVisibleHandle(visible: boolean) {
    if (visible) {
      const inputEl: HTMLElement = this.$refs.pickerInput as HTMLElement;
      this.pickerWidth = inputEl.offsetWidth;
    }
  }
}
</script>
