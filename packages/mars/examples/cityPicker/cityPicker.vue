<template>
  <div>
    <h2>Yn-city-picker</h2>
    <ul>
      <li @click="handlePicker(1)">
        国内城市
        <Yn-city-picker
          :defalutCityName="defalutCityName1"
          :searchable="false"
          @pick="handlePick"
          v-model="picker1"
          :tabs="tabs1"
          :alphaBeta="getAlphaBeta()"
          :history="getHistory()"
          :hotCity="getHotCity()"
          showHistory
        ></Yn-city-picker>
      </li>
      <li @click="handlePicker(2)">
        国际城市
        <Yn-city-picker
          :defalutCityName="defalutCityName2"
          :alphaBeta="getAlphaBeta()"
          :history="getHistory()"
          :hotCity="getHotCity()"
          showHistory
          :searchable="false"
          @pick="handlePick"
          v-model="picker2"
          :tabs="tabs2"
        ></Yn-city-picker>
      </li>
      <li @click="handlePicker(3)">
        全部城市
        <Yn-city-picker
          :defalutCityName="defalutCityName3"
          :alphaBeta="getAlphaBeta()"
          :history="getHistory()"
          :hotCity="getHotCity()"
          :searchable="false"
          @pick="handlePick"
          v-model="picker3"
        ></Yn-city-picker>
      </li>
      <li @click="handlePicker(4)">
        受限城市
        <Yn-city-picker
          :defalutCityName="defalutCityName4"
          :searchable="false"
          @pick="handlePick"
          v-model="picker4"
          :limitedData="data.cnCitiesList"
          limited
        ></Yn-city-picker>
      </li>
      <li @click="handlePicker(9)">
        受限城市搜索
        <Yn-city-picker
          :defalutCityName="defalutCityName9"
          @pick="handlePick"
          v-model="picker9"
          :limitedData="data.cnCitiesList"
          :search="getSearch()"
          limited
        ></Yn-city-picker>
      </li>
      <li @click="handlePicker(5)">
        显示历史记录
        <Yn-city-picker
          :defalutCityName="defalutCityName5"
          @pick="handlePick"
          v-model="picker5"
          :hotCity="getHotCity()"
          showHistory
          :history="getHistory()"
          :alphaBeta="getAlphaBeta()"
        ></Yn-city-picker>
      </li>
      <li @click="handlePicker(6)">
        不显示热门城市
        <Yn-city-picker
          :defalutCityName="defalutCityName6"
          :alphaBeta="getAlphaBeta()"
          :searchable="false"
          @pick="handlePick"
          v-model="picker6"
          :tabs="tabs2"
          :showHotCity="false"
        ></Yn-city-picker>
      </li>
      <li @click="handlePicker(7)">
        可搜索【关闭后会自动清除上次搜索记录】
        <Yn-city-picker
          :defalutCityName="defalutCityName7"
          ref="cityPicker"
          :search="getSearch()"
          :alphaBeta="getAlphaBeta()"
          :history="getHistory()"
          :hotCity="getHotCity()"
          showHistory
          @pick="handlePick"
          v-model="picker7"
          :parse="parse"
          @afterLeave="handleAfterLeave"
        ></Yn-city-picker>
      </li>
      <li @click="handlePicker(8)">
        可搜索(三列布局)
        <Yn-city-picker
          :defalutCityName="defalutCityName8"
          :search="getSearch()"
          :alphaBeta="getAlphaBeta()"
          :history="getHistory()"
          :hotCity="getHotCity()"
          showHistory
          @pick="handlePick"
          v-model="picker8"
          column="3"
        ></Yn-city-picker>
      </li>
    </ul>
    
    <!-- <Yn-city-picker
      :search="getSearch()"
      :alphaBeta="getAlphaBeta()"
      :history="getHistory()"
      :hotCity="getHotCity()"
      showHistory
      @pick="handlePick"
      v-model="picker10"
      :parse="parse"
    ></Yn-city-picker> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import "./style/index.scss";
import { Component } from "vue-property-decorator";
import { AnyObject } from "../../src/types";
const data = require("./ykb_hot_city.json").result;
const alphaBetData = require("./ykb_alphabat_city.json").result;
@Component({
  name: "cityPickerPage"
})
export default class CityPickerPage extends Vue {
  currentNum = 1;
  keywords = "天津";
  alphaBetData: AnyObject = alphaBetData;
  data: AnyObject = data;
  defalutCityName1 = "";
  defalutCityName2 = "";
  defalutCityName3 = "";
  defalutCityName4 = "";
  defalutCityName5 = "";
  defalutCityName6 = "";
  defalutCityName7 = "";
  defalutCityName8 = "";
  defalutCityName9 = "";
  defalutCityName10 = "";
  picker1 = false;
  picker2 = false;
  picker3 = false;
  picker4 = false;
  picker5 = false;
  picker6 = false;
  picker7 = false;
  picker8 = false;
  picker9 = false;
  picker10 = false;
  tabs1: AnyObject[] = [{ label: "国内城市", key: "mainland-china" }];
  tabs2: AnyObject[] = [{ label: "国际/港澳台", key: "overseas" }];

  handleAfterLeave() {
    (this.$refs.cityPicker as AnyObject).clearSearchKeywords();
  }
  parse(city: AnyObject, nameSpace: string) {
    if (nameSpace === "search-result") {
      const str = `<span>
                      <span class="hightlight-city">城市</span>
                      <span class="city-province">${city.CityName}-${city.CountryName}</span>
                      <span class="distance">无机场</span>
                  </span>`;
      const innerHTML = `${str.replace(
            new RegExp(this.keywords, "ig"),
            `<i>${this.keywords}</i>`
          )}`;
      return innerHTML;
    } else {
      const str = `<span>${nameSpace} ${city.CityName}</span>`;
      return str;
    }
  }
  getHistory() {
    return {
      title: "历史查询",
      params: { a: "1", b: "2" },
      action: this.getHistoryAction,
      parse: (e: AnyObject, params: AnyObject = {}) => {
        const { tab } = params;
        if (tab === "mainland-china") {
          return e.cnCitiesList;
        } else if (tab === "overseas") {
          return e.intCitiesList;
        }
      }
    };
  }
  getHistoryAction(params = {}) {
    console.log("这里处理请求的参数", params);
    return new Promise((resolve, reject) => {
      console.log(reject);
      // setTimeout(() => {
      //   reject("失败信息");
      // }, 1000);
      setTimeout(() => {
        resolve(data);
      }, 1000);
    }).catch(err => {
      // this.Toast(err);
      console.log(err, "异常在组件外面处理");
    });
  }
  handlePick(e: AnyObject) {
    // this.Toast(`已选择：${e.CityName}`);
    console.log("已选择：", e.CityName);
    (this as AnyObject)[`defalutCityName${this.currentNum}`] = e.CityName;
  }
  handlePicker(num: number) {
    this.currentNum = num;
    (this as AnyObject)[`picker${num}`] = !(this as AnyObject)[`picker${num}`];
  }
  transferAlphabetData(params: AnyObject, data: AnyObject) {
    const { alphaBeta } = params;
    const alphaBetaSome = alphaBeta.split("");
    const transferedData: AnyObject = {};
    alphaBetaSome.map((key: string) => {
      transferedData[key] = data[key];
    });
    return transferedData;
  }
  getCityListByAlphaBeta(params: AnyObject = {}) {
    console.log("这里处理请求的参数", params);
    
    return new Promise((resolve, reject) => {
      console.log(reject);
      // setTimeout(() => {
      //   reject("失败信息");
      // }, 1000);

      setTimeout(() => {
        resolve(this.transferAlphabetData(params, alphaBetData));
      }, 1000);
    }).catch(err => {
      // this.Toast(err);
      console.log(err, "异常在组件外面处理");
    });
  }
  getHotCityAction(params = {}) {
    console.log("这里处理请求的参数", params);
    return new Promise((resolve, reject) => {
      // setTimeout(() => {
      //   reject("失败信息");
      // }, 1000);
      console.log(reject);
      setTimeout(() => {
        resolve(data);
      }, 1000);
    }).catch(err => {
      // this.Toast(err);
      console.log(err, "异常在组件外面处理");
    });
  }
  getSearchAction(params: AnyObject = {}) {
    console.log("这里处理请求的参数", params);
    const { value } = params;
    this.keywords = value;
    return new Promise((resolve, reject) => {
      console.log(reject);
      // setTimeout(() => {
      //   reject("失败信息");
      // }, 1000);
      setTimeout(() => {
        resolve(data);
      }, 1000);
    }).catch(err => {
      // this.Toast(err);
      console.log(err, "异常在组件外面处理");
    });
  }
  getSearch() {
    return {
      params: { a: "1", b: "2" },
      action: this.getSearchAction,
      parse: (e: AnyObject, params: AnyObject = {}) => {
        const { tab } = params;
        if (tab === "mainland-china") {
          return e.cnCitiesList;
        } else if (tab === "overseas") {
          return e.intCitiesList;
        }
      }
    };
  }
  getHotCity() {
    return {
      title: "热门城市",
      params: { a: "1", b: "2" },
      action: this.getHotCityAction,
      parse: (e: AnyObject, params: AnyObject = {}) => {
        const { tab } = params;
        if (tab === "mainland-china") {
          return e.cnCitiesList;
        } else if (tab === "overseas") {
          return e.intCitiesList;
        }
      }
    };
  }
  getAlphaBeta() {
    return {
      title: "按字母查询",
      params: { a: "1", b: "2" },
      action: this.getCityListByAlphaBeta,
      parse: (e: AnyObject) => {
        return e;
      }
    };
  }
}
</script>

