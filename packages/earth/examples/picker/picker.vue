<template>
  <div>
    <h2>yn-picker</h2>
    <ul>
      <li @click="handleClick(1)">single picker</li>
      <li @click="handleClick(2)">multiple picker</li>
      <li @click="handleClick(3)">multiple picker2</li>
      <li @click="handleClick(4)">只有一个数据</li>
      <li @click="handleClick(5)">禁止某项选中</li>
    </ul>
    <yn-picker
      v-model="show1"
      :columns="columns1"
      @change="handleChange"
    ></yn-picker>
    <yn-picker
      v-model="show2"
      :columns="columns2"
      @change="handleChange"
    ></yn-picker>
    <yn-picker
      @confirm="handleConfirm"
      v-model="show3"
      :columns="columns3"
      @change="handleChange"
    ></yn-picker>
    <yn-picker
      v-model="show4"
      :columns="columns4"
      @change="handleChange"
    ></yn-picker>
    <yn-picker
      v-model="show5"
      :columns="columns5"
      @change="handleChange"
      @confirm="handleConfirm"
    ></yn-picker>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "YnPickerPage",
  data() {
    return {
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      show5: false,
      // columns1: ["Shanghai", "Toyko"]
      columns1: [
        "Shanghai",
        "Toyko",
        "Beijing",
        "NewYork",
        "Shenzhen",
        "Hongkong"
      ],
      columns2: [
        { value: ["Shanghai", "Toyko", "Beijing", "NewYork", "Shenzhen"], defaultIndex: 2 },
        { value: ["Shanghai", "Toyko", "Beijing", "NewYork", "Shenzhen"], defaultIndex: 1 }
      ],
      columns3: [
        { value: [{ value: "Shanghai", disabled: true }, "Toyko", "Beijing", "NewYork", "Shenzhen"] },
        { value: ["Shanghai", "Toyko", "Beijing", "NewYork", "Shenzhen"] },
        { value: ["Shanghai", "Toyko", "Beijing", "NewYork", "Shenzhen"] }
      ],
      columns4: ["Shanghai"],
      columns5: [{ value: "北京", disabled: true }, { value: "上海" }, { value: "深圳" }, { value: "广州" }]
    };
  },
  methods: {
    handleChange(pick, index) {
      this.Toast(`选择第${index}个，值为${pick.value || pick }`);
      // console.log(pick,index);
    },
    handleClick(i) {
      this[`show${i}`] = !this[`show${i}`];
    },
    handleConfirm(e) {
      this.Toast(JSON.stringify(e));
      console.log("confirm", e);
    }
  }
};
</script>
