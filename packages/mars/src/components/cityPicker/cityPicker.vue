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
import { isPromise } from "../../utils";
@Component({
  name: "CityPicker"
})
export default class CityPicker extends Mixins(Vue) {
  popoverVisible = false;
  pickerWidth = 200;
  alphaBetaCities: AnyObject[] = [];
  hotCityList: AnyObject[] = [];
  historyList: AnyObject[] = [];
  searchList: AnyObject[] = [];
  historyLoading = false;
  alphaBetaLoading = false;
  hotCityLoading = false;
  isSearching = false;
  @Prop({
    type: Boolean,
    default: false
  })
  showHistory!: boolean;
  @Prop({
    type: Boolean,
    default: true
  })
  showHotCity!: boolean;
  @Prop({
    type: Boolean,
    default: true,
  })
  showAlphaBeta!: boolean;
  @Prop({
    type: Function,
    default: (city: AnyObject, nameSpace: string) => {
      if (!nameSpace) nameSpace = "";
      return city.CityName;
    },
  })
  parse!: (city: AnyObject, nameSpace: string) => string;
  @Prop({
    type: Object,
    default: () => {
      return {
        params: {},
        action: () => {
          return Promise.resolve();
        },
        parse: (e: AnyObject) => {
          return e;
        },
      };
    }
  })
  search!: AnyObject;
  @Prop({
    type: Object,
    default: () => {
      return {
        params: {},
        action: () => {
          return Promise.resolve();
        },
        parse: (e: AnyObject) => {
          return e;
        },
        title: "历史查询",
      };
    }
  })
  history!: AnyObject; 
  @Prop({
    type: Object,
    default: () => {
      return {
        params: {},
        action: () => {
          return Promise.resolve();
        },
        parse: (e: AnyObject) => {
          return e;
        },
        title: "热门城市",
      };
    }
  })
  hotCity!: AnyObject;
  @Prop({
    type: Object,
    default: () => {
      return {
        params: {},
        action: () => {
          return Promise.resolve();
        },
        parse: (e: AnyObject) => {
          return e;
        },
        title: "按字母查询",
      };
    }
  })
  alphaBeta!: AnyObject;

  getHistory(e: AnyObject) {
    const params = { ...this.history.params, tab: e };
    const promise = this.history.action(params);
    if (isPromise(promise)) {
      this.historyLoading = true;
      promise.then((res: AnyObject) => {
        const data = this.history.parse(res, params);
        if (data && Array.isArray(data)) {
          this.historyList = data;
        } else {
          this.historyList = [];
        }
        this.historyLoading = false;
      });
    } else {
      Error("The action of hotCity's attribute must be a Promise type!");
    }
  }
  updateVisibleHandle(visible: boolean) {
    if (visible) {
      const inputEl: HTMLElement = this.$refs.pickerInput as HTMLElement;
      this.pickerWidth = inputEl.offsetWidth;
    }
  }
}
</script>
