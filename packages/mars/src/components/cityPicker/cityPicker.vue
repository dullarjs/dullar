<template>
  <div class="city-picker">
    <Popover
      @update:visible="updateVisibleHandle"
      :visible.sync="popoverVisible"
      :width="pickerWidth"
      :placement="'bottom'"
      :visibleArrow="false"
      :popperClass="['popper-city-picker', 'is-noarrow']"
      @beforeEnter="beforeEnter"
    >
      <div class="search-picker-block" v-show="isSearching">
        <ul class="city-block-list">
          <li class="city-block-item"
            v-for="(city, index) in searchList"
            :key="index"
            v-html="parse(city, 'search-result')"
            @click="handlePick(city)"
          ></li>
        </ul>
      </div>
      <div class="city-picker__content" v-show="!isSearching">
        <p class="city-picker-input-des">可直接选择城市或输入城市名称</p>
        <template v-if="limited">
          <div class="limited-city-block">
            <ul class="city-block-list">
              <li class="city-block-item"
                v-for="(city, index) in limitedData"
                :key="index"
                v-html="parse(city, '')"
                @click="handlePick(city)"
              ></li>
            </ul>
          </div>
        </template>
        <template v-else>
          <div class="domestic-international-tabs">
            <div class="domestic-tab"
              v-for="(item, index) in tabs"
              :key="index"
              :class="{ 'active': item.key === currentTab }"
              @click="handleTabSwitch(item)"
            >{{ item.label }}</div>
          </div>
          <div class="history-city-block" v-if="showHistory">
            <p class="history-city-block__title font-active">历史查询</p>
            <spin v-if="historyLoading" type="tripleBounce" :size="30"></spin>
            <ul class="city-block-list" v-else>
              <li class="city-block-item"
                v-for="(city, index) in historyList"
                :key="index"
                v-html="parse(city, '')"
                @click="handlePick(city)"
              ></li>
            </ul>
          </div>
          <div class="hot-alphaBeta-block" v-if="showHotCity || showAlphaBeta">
            <div class="tabs-nav">
              <div class="tabs-nav__item"
                v-for="(item, index) in alphabetTabsCalculated"
                :key="index"
                :class="{'active': selecteDalphabetTab === item.key}"
                @click="alphaBetaTabClick(item)"
              >
                <span class="tabs-nav--text">{{ item.value }}</span>
              </div>
            </div>
            <div class="tabs-content">
              <div class="hot-city-block" v-if="selecteDalphabetTab === 'hot'">
                <spin v-if="historyLoading" type="tripleBounce" :size="30"></spin>
                <ul class="city-block-list" v-else>
                  <li class="city-block-item"
                    v-for="(city, index) in hotCityList"
                    :key="index"
                    v-html="parse(city, '')"
                    @click="handlePick(city)"
                  ></li>
                </ul>
              </div>
              <div class="alphabet-city-block"
                v-else
              >
                <spin v-if="alphaBetaLoading" type="tripleBounce" :size="30"></spin>
                <div class="one-alphabet-block"
                  v-else
                  v-for="(item, key, index) in alphaBetaCities"
                  :key="index"
                >
                  <span class="alphabet-text">{{ key }}</span>
                  <ul class="city-block-list">
                    <li class="city-block-item"
                      v-for="(city, index) in item"
                      :key="index"
                      v-html="parse(city, '')"
                      @click="handlePick(city)"
                    ></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <template v-slot:reference>
        <input
          ref="pickerInput"
          class="city-picker__input"
          :value="inputValue"
          :readonly="!searchable"
          @input="handleOnSearch"
          @focusout="handleFocusout"
          @click="handleClick"
        >
      </template>
    </Popover>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import "./style/index.scss";
import { AnyObject } from "@/types";
import { isPromise, throttle } from "@/utils";
import { EventBus } from "@/utils/eventBus";
import Spin from "../spin";
import Popover from "../popover";
@Component({
  name: "CityPicker",
  components: {
    Popover,
    Spin
  }
})
export default class CityPicker extends Mixins(Vue) {
  static componentName = "YnCityPicker";
  throttleSearch!: (args: InputEvent) => void;
  currentTab = "";
  selecteDalphabetTab = "";
  popoverVisible = false;
  pickerWidth = 200;
  cachedAlphaBeta: AnyObject = {};
  alphaBetaCities: AnyObject = {};
  hotCityList: AnyObject[] = [];
  historyList: AnyObject[] = [];
  searchList: AnyObject[] = [];
  historyLoading = false;
  alphaBetaLoading = false;
  hotCityLoading = false;
  isSearching = false;
  keywords = "";
  @Prop({
    type: String,
    default: ""
  })
  defalutCityName!: string;
  @Prop({
    type: Boolean,
    default: true
  })
  searchable!: boolean;
  @Prop({
    type: Array,
    default: () => {
      return [];
    },
  })
  limitedData!: AnyObject[];
  @Prop({
    type: Boolean,
    default: false
  })
  limited!: boolean;
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
      return `<span>${city.CityName}</span>`;
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
  @Prop({
    type: Array,
    default: () => {
      return [
        { label: "国内城市", key: "mainland-china" },
        { label: "国际/港澳台", key: "overseas" },
      ];
    },
  })
  tabs!: AnyObject[];
  @Prop({
    type: Array,
    default() {
      return [
        {
          key: "hot",
          value: "热门城市"
        },
        {
          key: "ABCDEF",
          value: "ABCDEF"
        },
        {
          key: "GHIJKL",
          value: "GHIJKL"
        },
        {
          key: "MNOPQRS",
          value: "MNOPQRS"
        },
        {
          key: "TUVWXYZ",
          value: "TUVWXYZ"
        }
      ];
    }
  })
  alphabetTabs!: AnyObject[];

  @Watch("tabs", {
    immediate: true
  })
  onTabs() {
    this.tabs.forEach((tab, index) => {
      if (index === 0) {
        this.currentTab = tab.key;
      }
    });
  }

  get inputValue() {
    if (this.isSearching) {
      return this.keywords;
    } else {
      return this.defalutCityName;
    }
  }
  get alphabetTabsCalculated() {
    const arr: AnyObject[] = [];
    this.alphabetTabs.map(item => {
      const { key } = item;
      if (this.showHotCity && key === "hot") {
        arr.push(item);
      } else if (this.showAlphaBeta && key !== "hot") {
        arr.push(item);
      }
    });
    return arr
  }

  handleClick(e: Event) {
    console.log(this.popoverVisible);
    if (this.popoverVisible) {
      // 城市面板显示后，再次点击 input 不关闭
      e.stopPropagation();
    }
  }
  handleTabSwitch(ele: AnyObject) {
    if (ele.key === this.currentTab) {
      return false;
    }
    this.currentTab = ele.key;
    if (this.isSearching) {
      this.clearSearchKeywords();
    }
    if (this.showHistory) {
      this.getHistory(this.currentTab);
    }
    if (this.alphabetTabsCalculated.length > 0 && !this.limited) {
      this.selecteDalphabetTab = this.alphabetTabsCalculated[0].key;
      if (this.showHotCity && this.selecteDalphabetTab === "hot") {
        this.getHotCity(this.currentTab);
      } else if (this.showAlphaBeta && this.selecteDalphabetTab !== "hot"){
        this.getAlphaBetaCity(this.alphabetTabsCalculated[0].value)
      }
    }
  }
  alphaBetaTabClick(item: AnyObject) {
    const { key, value } = item;
    if (this.selecteDalphabetTab === key) {
      return false;
    }
    this.selecteDalphabetTab = key;
    if (key === "hot") {
      // 获取热门城市
      this.getHotCity(this.currentTab);
    } else {
      // 获取 字母相关城市
      this.getAlphaBetaCity(value);
    }
  }
  clearSearchKeywords() {
    this.isSearching = false;
    this.keywords = "";
    (this.$refs.pickerInput as HTMLInputElement).value = "";
    this.clearSearchResult();
  }
  clearSearchResult() {
    this.searchList = [];
  }
  handleOnSearch(e: InputEvent) {
    this.throttleSearch(e);
  }
  handleFocusout(e: InputEvent) {
    this.$emit("focusout", e);
  }
  searchRequest(e: InputEvent) {
    const value = (e.target as HTMLInputElement).value.trim();
    this.keywords = value;
    if (value) {
      this.isSearching = true;
    } else {
      this.isSearching = true;
      this.clearSearchResult();
      // 内容为空， 不搜索
      return;
    }
    const params = { ...this.search.params, tab: this.currentTab, value };
    const promise = this.search.action(params);
    promise
      .then((res: AnyObject) => {
        const data = this.search.parse(res, params);
        if (data && data.length) {
          this.searchList = data;
        }
      })
      .catch((err: AnyObject) => {
        this.clearSearchResult();
        if (err.errmsg) {
          // this.Toast(err.errmsg);
          console.log(err.errmsg);
        } else {
          // this.print(err);
          console.log(err);
        }
      });
  }
  close() {
    this.popoverVisible = false;
  }
  handlePick(e: AnyObject) {
    const { disableClick = false } = e;
    if (disableClick) {
      // 不允许点击城市
      return;
    }
    if (this.isSearching) {
      // 搜索完结果后，点击结果需清当前搜索记录，以及搜索结果
      this.clearSearchKeywords();
      this.clearSearchResult();
    }
    this.close();
    this.$emit("pick", e);
  }
  getAlphaBetaCity(e: string) {
    this.alphaBetaCities = [];
    if (
      this.cachedAlphaBeta[e + this.currentTab] &&
      this.cachedAlphaBeta[e + this.currentTab].length
    ) {
      this.alphaBetaLoading = false;
      this.alphaBetaCities = this.cachedAlphaBeta[e + this.currentTab];
    } else {
      this.alphaBetaLoading = true;
      const params = { ...this.alphaBeta.params, alphaBeta: e };
      const promise = this.alphaBeta.action(params);
      if (isPromise(promise)) {
        promise.then((res: AnyObject) => {
          const data = this.alphaBeta.parse(res, params);
          if (data && Object.keys(data).length) {
            // this.cachedAlphaBeta[e] = data;
            this.alphaBetaCities = data;
            // deepClone, 防止城市组件缓存的数据共享
            this.cachedAlphaBeta = {
              ...this.cachedAlphaBeta,
              [e + this.currentTab]: data,
            };
          }
          this.alphaBetaLoading = false;
        });
      } else {
        Error("The action of alphaBeta's attribute must be a Promise type!");
      }
    }
  }
  getHotCity(e: string) {
    const params = { ...this.hotCity.params, tab: e };
    const promise = this.hotCity.action(params);
    if (isPromise(promise)) {
      this.hotCityLoading = true;
      promise.then((res: AnyObject) => {
        const data = this.hotCity.parse(res, params);
        if (data && data.length) {
          this.hotCityList = data;
        }
        this.hotCityLoading = false;
      });
    } else {
      Error("The action of hotCity's attribute must be a Promise type!");
    }
  }
  getHistory(e: string) {
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
    const inputEl: HTMLElement = this.$refs.pickerInput as HTMLElement;
    if (visible && inputEl) {
      this.pickerWidth = inputEl.offsetWidth;
    }
  }
  beforeEnter(){
    if (this.showHistory) {
      this.getHistory(this.currentTab);
    }
    if (this.alphabetTabsCalculated.length > 0 && !this.limited) {
      this.selecteDalphabetTab = this.alphabetTabsCalculated[0].key;
      if (this.showHotCity && this.selecteDalphabetTab === "hot") {
        this.getHotCity(this.currentTab);
      } else if (this.showAlphaBeta && this.selecteDalphabetTab !== "hot"){
        this.getAlphaBetaCity(this.alphabetTabsCalculated[0].value)
      }
    }
    this.throttleSearch = throttle(this.searchRequest);
  }
  resizeEventHandler(){
    if (this.popoverVisible){
      this.updateVisibleHandle(true);
    }
  }
  resize() {
    EventBus.$on("window:resize", () => {
      this.resizeEventHandler();
    });
  }
  mounted() {
    this.resize();
  }
}
</script>
