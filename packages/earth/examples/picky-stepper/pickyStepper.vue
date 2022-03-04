<template>
  <div>
    <h2>yn-picky-stepper</h2>
    <ul>
      <li @click="handleClick(1)">简单用法（单选）</li>
      <li @click="handleClick(2)">简单用法（多选）</li>
      <li @click="handleClick(4)">简单用法(可以不需要异步操作)</li>
      <li @click="handleClick(3)">高级用法（多步骤）</li>
      <li @click="handleClick(5)">高级用法实际案例（多步骤）</li>
      <li @click="handleClick(6)">动态数据案例（多步骤）</li>
      <li>
        <span @click="handleClick(7)">动态更换数据源（多步骤）</span>
        <yn-button @click="switchData(1)">切换数据源1</yn-button>
        <yn-button @click="switchData(2)">切换数据源2</yn-button>
      </li>
      <li @click="handleClick(8)">oneStepMode</li>
    </ul>
    <yn-picky-stepper
      v-model="picker1"
      :submit="submit"
      :steps="steps1"
      @picked="handleOnPick"
    ></yn-picky-stepper>
    <yn-picky-stepper
      v-model="picker2"
      :submit="submit"
      :steps="steps2"
      @picked="handleOnPick"
    ></yn-picky-stepper>
    <yn-picky-stepper
      v-model="picker3"
      :submit="submit"
      :steps="steps3"
      @picked="handleOnPick"
    ></yn-picky-stepper>
    <yn-picky-stepper
      v-model="picker4"
      @success="handleSuccess"
      :steps="steps4"
      @picked="handleOnPick"
    ></yn-picky-stepper>
    <yn-picky-stepper
      v-model="picker5"
      @success="handleSuccess"
      :steps="steps5"
      @picked="handleOnPick"
    ></yn-picky-stepper>
    <yn-picky-stepper
      v-model="picker6"
      @success="handleSuccess"
      :steps="steps6"
      @picked="handleOnPick"
    ></yn-picky-stepper>
    <yn-picky-stepper
      v-model="picker7"
      @success="handleSuccess"
      :steps="steps7"
      @picked="handleOnPick"
    ></yn-picky-stepper>
    <yn-picky-stepper
      v-model="picker8"
      oneStepMode
      @success="handleSuccess"
      :steps="steps1"
      :submit="submit"
      @picked="handleOnPick"
    ></yn-picky-stepper>
  </div>
</template>
<script type="text/javascript">
const persons = require("./persons.json");
persons.forEach(p => {
  p.label = p.Name;
});
const reasons = require("./reasons.json");
export default {
  name: "YnPickyStepperPage",
  methods: {
    handleClick(e) {
      this[`picker${e}`] = !this[`picker${e}`];
    },
    submit(args = {}) {
      console.log("这个是需要提交的参数", args);
      return new Promise((resolve, reject) => {
        console.log(reject);
        setTimeout(() => {
          resolve("ok");
        }, 3000);
      }).catch(err => {
        console.log("错误要在外面执行", err);
      });
    },
    handleSuccess(res) {
      console.log("选择的数据", res);
    },
    switchData(num) {
      this.steps7 = this[`steps${num}`];
    },
    handleOnPick(e) {
      console.log("选择的是", e);
    }
  },
  data() {
    return {
      picker1: false,
      picker2: false,
      picker3: false,
      picker4: false,
      picker5: false,
      picker6: false,
      picker7: false,
      picker8: false,
      steps7: [],
      steps5: [
        {
          title: "请选择改签人员",
          list: persons,
          multiple: true
        },
        {
          title: "请选择原因",
          list: reasons,
          multiple: false
        }
      ],
      steps6: [],
      steps4: [
        {
          title: "请选择改签人员",
          list: [
            { label: "lizhuang", value: "李壮" },
            { label: "keyanqin", value: "柯艳琴" },
            { label: "xionglonghui", value: "熊龙辉" },
            { label: "liyan", value: "李妍" },
            { label: "wangshengzi", value: "王生资" },
            { label: "zhangsan", value: "张三" },
            { label: "lisi", value: "lisi" },
            { label: "wanger", value: "王二" },
            { label: "wangxiaoer", value: "王小二" },
            { label: "wangerxiao", value: "王二小" },
            { label: "libai", value: "李白" },
          ],
          multiple: true
        },
        {
          title: "请选择原因",
          list: [
            { label: "行程变化", value: "行程变化" },
            { label: "目的地有住宿", value: "目的地有住宿" },
            { label: "预算超支", value: "预算超支" },
            {
              label: "其他",
              type: "input",
              placeholder: "请输入原因",
              value: ""
            }
          ],
          multiple: false
        }
      ],
      steps3: [
        {
          title: "请选择改签人员",
          list: [
            { label: "lizhuang", value: "李壮", disabled: true },
            { label: "keyanqin", value: "柯艳琴" },
            { label: "xionglonghui", value: "熊龙辉" },
            { label: "liyan", value: "李妍" },
            { label: "wangshengzi", value: "王生资" }
          ],
          multiple: true
        },
        {
          title: "请选择原因",
          list: [
            { label: "行程变化", value: "行程变化", disabled: true },
            { label: "目的地有住宿", value: "目的地有住宿" },
            { label: "预算超支", value: "预算超支" },
            {
              label: "其他",
              type: "input",
              placeholder: "请输入原因",
              value: ""
            }
          ],
          multiple: false
        }
      ],
      steps2: [
        {
          title: "请选择改签人员",
          list: [
            { label: "lizhuang", value: "李壮", disabled: true },
            { label: "keyanqin", value: "柯艳琴" },
            { label: "xionglonghui", value: "熊龙辉" },
            { label: "liyan", value: "李妍" },
            { label: "wangshengzi", value: "王生资", disabled: true }
          ],
          multiple: true
        }
      ],
      steps1: [
        {
          title: "请选择原因",
          list: [
            { label: "行程变化", value: "行程变化" },
            { label: "目的地有住宿", value: "目的地有住宿" },
            { label: "预算超支", value: "预算超支" },
            {
              label: "其他",
              type: "input",
              placeholder: "请输入原因，不是必填",
              value: "",
              required: false
            },
            {
              label: "还有其他呢",
              type: "textarea",
              placeholder: "请输入原因，默认必填",
              value: "",
              counter: true,
              maxlength: 100,
              // required: true
            }
          ],
          multiple: false
        }
      ],
      steps8: [
        {
          title: "请选择改签人员",
          list: persons,
          multiple: true
        },
        {
          title: "请选择原因",
          list: reasons,
          multiple: false
        }
      ]
    };
  },
  mounted() {
    const personStep = {
      title: "请选择改签人员",
      list: persons,
      multiple: true
    };
    const reasonStep = {
      title: "请选择原因",
      list: reasons,
      multiple: false
    };
    this.steps6.push(personStep);
    setTimeout(() => {
      this.steps6.push(reasonStep);
    }, 1000);
    console.log(this.steps6);
  }
};
</script>
