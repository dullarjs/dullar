<template>
  <div>
    <h2>yn-dropdown-menu</h2>
    <div class="box">
      <yn-dropdown-menu>
        <yn-dropdown-menu-item
          v-model="value1"
          :options="option1"
          @change="handleChange"
          :borderRadius="10"
        >
        </yn-dropdown-menu-item>
        <yn-dropdown-menu-item
          v-model="value2"
          defaultSelectedIndex="2"
          :options="option2"
          :titleChangealbe="true"
        >
        </yn-dropdown-menu-item>
        <yn-dropdown-menu-item
          v-model="value5"
          :mapStatus="mapStatus"
          :titleChangealbe="true"
          @change="handleChange"
          :fixed="true"
          ref="mapStatus"
        ></yn-dropdown-menu-item>
        <yn-dropdown-menu-item
          v-model="value7"
          :mapOption="mapOption"
          :append="appendChild"
          :titleChangealbe="true"
          @change="handleChange"
          ref="mapOption"
        ></yn-dropdown-menu-item>
        <yn-dropdown-menu-item
          v-model="value3"
          ref="menuItem"
          @beforeEnter="handleBeforeEnter"
          :borderRadius="10"
        >
          <div>
            <span>这里面是自定义内容</span>
            <ul>
              <li>1</li>
              <li>2</li>
              <li>3</li>
            </ul>
            <yn-button type="primary" @click="changeData4(true)">设置筛选</yn-button>
            <yn-button type="primary" @click="changeData4(false)">取消筛选</yn-button>
            <yn-button type="primary" @click="close1">关闭</yn-button>
          </div>
        </yn-dropdown-menu-item>
      </yn-dropdown-menu>
    </div>
    <div class="box">
      <yn-dropdown-menu direction="up">
        <yn-dropdown-menu-item
          v-model="value6"
          :options="setOtions()"
          defaultSelectedIndex="2"
        ></yn-dropdown-menu-item>
        <yn-dropdown-menu-item
          v-model="value5"
          :mapStatus="mapStatusB"
          :titleChangealbe="true"
          @change="handleChange"
          ref="mapStatusB"
        ></yn-dropdown-menu-item>
        <yn-dropdown-menu-item
          v-model="value4"
          ref="closeAble"
          :hideDirectionIcon="true"
        >
          <div>
            <span>这里面是自定义内容</span>
            <yn-button type="primary" @click="close">关闭</yn-button>
          </div>
        </yn-dropdown-menu-item>
      </yn-dropdown-menu>
      <hr />
      <yn-button type="primary" @click="changeData(true)">直接选中</yn-button>
      <yn-button type="primary" @click="changeData(false)">取消选中</yn-button>
      <div></div>
      <yn-button type="primary" @click="changeData2(true)">直接选中【有下拉】</yn-button>
      <yn-button type="primary" @click="changeData2(false)">取消选中【有下拉】</yn-button>
      <div></div>
      <yn-button type="primary" @click="changeData3(true)">直接选中【自定义内容】</yn-button>
      <yn-button type="primary" @click="changeData3(false)">取消选中【自定义内容】</yn-button>
      <div></div>
      <yn-button type="primary" @click="changeData31(true)">直接高亮【自定义内容】</yn-button>
      <yn-button type="primary" @click="changeData31(false)">取消高亮【自定义内容】</yn-button>
      <div></div>
      <yn-button type="primary" @click="changeData5(0)">直接选中 无弹框mapOption</yn-button>
      <yn-button type="primary" @click="changeData5(-1)">取消选中 无弹框mapOption</yn-button>
      <div></div>
      <yn-button type="primary" @click="switchTo(1)">切换</yn-button>
    </div>
  </div>
</template>

<script type="text/javascript">
import { genComponentName } from "../../src/modules/component";
  export default {
  name: "YnDropdownMenuPage",
  data() {
    return {
      value1: "我是固定title",
      value6: "异步加载",
      value2: "我的可变title",
      value3: "自定义内容",
      value4: "不显示icon",
      option1: [
        { text: "Option1", value: 0 },
        { text: "Option2", value: 1 },
        { text: "Option3", value: 2 }
      ],
      option2: [
        { text: "Option A", value: "a" },
        { text: "Option B", value: "b" },
        { text: "Option C", value: "c" }
      ],
      option3: [],
      option4: [
        { text: "Option A", value: "a" },
        { text: "Option B", value: "b" },
        { text: "Option C", value: "c" }
      ],
      value5: "默认文案",
      mapStatusB: {
        checked: {
          value: 1,
          label: "选中文案"
        },
        unchecked: {
          value: 2,
          label: "未选中文案"
        }
      },
      mapStatus: {
        checked: {
          value: 1,
          label: "合标航班"
        },
        unchecked: {
          value: 2,
          label: "全部航班"
        }
      },
      value7: "按时间",
      mapOption: [
        {
          value: 1,
          label: "从早到晚"
        },
        {
          value: 2,
          label: "从晚到早"
        }
      ]
    };
  },
  methods: {
    appendChild(h, active) {
      return h(genComponentName('iconfont'), { class: { active }, props: { name: active ? 'check-mark' : 'add', size: 18 }})
    },
    getOptions() {
      return new Promise((resolve, reject) => {
        console.log(reject);
        setTimeout(() => {
          const options = [
            { text: "Option1", value: 0 },
            { text: "Option2", value: 1 },
            { text: "Option3", value: 2 }
          ];
          resolve(options);
        }, 3000);
      });
    },
    setOtions() {
      return {
        action: this.getOptions,
        params: { a: 1, b: 2 },
        parse: res => {
          return res;
        }
      };
    },
    handleBeforeEnter() {
      this.Toast("即将展开");
    },
    handleChange(option) {
      console.log(option);
      this.Toast(`已选择${option.value}`);
    },
    close() {
      console.log("关闭");
      this.$refs.closeAble.closeTab();
    },
    close1() {
      this.$refs.menuItem.closeTab();
    },
    changeData(e) {
      this.$refs.mapStatus.check(e);
    },
    changeData2(e) {
      this.$refs.slide.check(e);
    },
    changeData3(e) {
     this.$refs.closeAble.check(e);
    },
    changeData31(e) {
      this.$refs.closeAble.setIsFiltered(e);
    },
    changeData4(e) {
      this.$refs.menuItem.setIsFiltered(e);
    },
    changeData5(e) {
      this.$refs.mapOption.checkMapOption(e);
    },
    switchTo(i) {
      this.$refs.switchTo.switchTab(i, true);
    }
  }
};
</script>
<style type="text/css" scoped>
.box {
  height: 300px;
}
</style>
