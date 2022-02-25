<template>
  <div>
    <div style="padding-left: 200px">
      <!--              <Input clear suffixIcon="search" v-model="v"/>-->
      <!--              <Input v-model="v" @change="f" maxlength="3"/>-->
      <p>基础用法</p>
      <yn-input />
      <p>默认长度</p>
      <yn-input maxlength="3" placeholder="默认长度为3" />
      <p>textarea</p>
      <yn-input
        v-model="v"
        type="textarea"
        maxlength="20"
        width="300"
        height="100"
        resize="vertical"
      />
      <p>可切换密码</p>
      <yn-input v-model="v" showPassword />
      <p>可清除</p>
      <yn-input clear search v-model="v" placeholder="可清除" />
      <p>前插槽</p>
      <yn-input v-model="v">
        <template v-slot:prepend>
          <div class="prepend_demo">http://</div>
        </template>
      </yn-input>
      <p>后插槽</p>
      <yn-input v-model="v">
        <template v-slot:append>
          <div class="prepend_demo">.com</div>
        </template>
      </yn-input>
      <p>无边框（底线）</p>
      <yn-input type="text" underline />
      <p>输入建议</p>
      <yn-autocomplete v-model="value" :haddleSearch="querySearch" @select="handleSelect" iconName="down-arrow">
      </yn-autocomplete>
      <p>输入建议(自定义模板)</p>
      <yn-autocomplete v-model="value" :haddleSearch="querySearch" @select="handleSelect">
        <template v-slot:customize="item">
          <div class="value">{{ item.value }}</div>
          <span class="name">{{ item.goods_name }}</span>
        </template>
      </yn-autocomplete>
      <p>输入建议(自定义模板-异步获取)</p>
      <yn-autocomplete v-model="value" :haddleSearch="querySearchL" @select="handleSelect" showLoading>
        <template v-slot:customize="item">
          <div class="value">{{ item.value }}</div>
          <span class="name">{{ item.goods_name }}</span>
        </template>
      </yn-autocomplete>
    </div>
  </div>
</template>

<script>
// import Input from './input_copy'
export default {
  name: "index",
  components: {
    // Input
  },
  data() {
    return {
      v: "222",
      value: "",
      searchList: [],
      timeout: null
    };
  },
  mounted() {
    this.searchList = this.loadAll();
  },
  methods: {
    f(v) {
      console.log(v);
    },
    querySearch(queryString, cb) {
      var searchList = this.searchList;
      // 头部匹配
      var results = queryString ? searchList.filter(item => { return item.value.indexOf(queryString) === 0; }) : searchList;
      cb(results);
    },
    querySearchL(queryString, cb) {
      var searchList = this.searchList;
      var results = queryString ? searchList.filter(item => { return item.value.indexOf(queryString) === 0; }) : searchList;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
          cb(results);
        }, 1000 * Math.random());
    },
    handleSelect(rowData) {
      console.log(rowData)
    },
    loadAll() {
      return [
        {
          supplierName: "7777供应商",
          goods_name: "00999",
          value: "测试商品0001"
        },
        {
          supplierName: "测试供应商",
          goods_name: "熊猫大侠黑白",
          value: "测试商品0002"
        },
        {
          supplierName: "测试供应商",
          goods_name: "熊猫大侠红色1133",
          value: "测试商品0003"
        },
        {
          supplierName: "7777供应商",
          goods_name: "55555",
          value: "测试商品0004"
        },
        {
          supplierName: "7777供应商",
          goods_name: "最小起售量为5",
          value: "测试商品0005"
        },
        {
          supplierName: "7777供应商",
          goods_name: "起售量为3，库存为1",
          value: "测试商品0006"
        },
        {
          supplierName: "测试供应商",
          goods_name: "大盘纸002",
          value: "测试商品0007"
        },
        {
          supplierName: "测试供应商",
          goods_name: "大盘纸001",
          value: "测试商品0008"
        },
        {
          supplierName: "测试供应商",
          goods_name: "智能机器人001",
          value: "测试商品0009"
        },
        {
          supplierName: "测试供应商",
          goods_name: "xd平板电视",
          value: "测试商品0010"
        },
      ];
    },
  },
};
</script>

<style scoped>
.prepend_demo {
  height: 100%;
  padding: 0 10px;
  background-color: #e9e9e9;
  line-height: 2;
  border-radius: 4px;
}
.item {
  padding: 3px 0;
}
.value{
  font-size: 14px;
  line-height: 16px;
}
.name {
  font-size: 12px;
  color: #b4b4b4;
  line-height: 14px;
}
</style>
