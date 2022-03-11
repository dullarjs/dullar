<!--
 * @Author: yegl
 * @Date: 2021-09-30 14:51:06
 * @Last Modified by: yegl
 * @Last Modified time: 2022-03-11 14:50:46
 * @E-mail: yglgzyx@126.com
-->
<template>
  <div class="wrap">
    <div class="wrap-main">
      <yn-form :model="model" :rule="rules" label-width="80px" label-position="right" ref="form">
        <yn-form-item label="账号" prop="name">
          <yn-input v-model="model.name" width="auto"></yn-input>
        </yn-form-item>
        <yn-form-item label="密码" prop="password">
          <yn-input v-model="model.password" width="auto" showPassword></yn-input>
        </yn-form-item >
        <yn-form-item label="公司" prop="company">
          <yn-select v-model="model.company" width="auto">
            <yn-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></yn-option>
        </yn-select>
        </yn-form-item >
        <yn-form-item label="记住" prop="itemList">
          <span v-for="i in model.itemList" :key="i.value" class="yn-checkbox-item">
            <yn-checkbox v-model="i.checked" size="14"></yn-checkbox>
            <span>{{ i.label }}</span>
          </span>
        </yn-form-item>
        <yn-form-item label="开关">
          <yn-switch v-model="model.switch"></yn-switch>
        </yn-form-item>
        <yn-form-item label="单选">
          <span v-for="i in model.radio" :key="i.value" class="yn-checkbox-item">
            <yn-radiobox v-model="i.checked" size="14" @change="onHandleChange(i)" ></yn-radiobox>
            <span>{{ i.label }}</span>
          </span>
        </yn-form-item>
        <yn-form-item label="textarea">
          <yn-input
            v-model="model.textarea"
            type="textarea"
            maxlength="20"
            width="300"
            height="100"
            resize="vertical"
          />
        </yn-form-item>
        <yn-form-item>
          <yn-button type="primary" @click="submit">确定</yn-button>
        </yn-form-item>
      </yn-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "YnFormPage",
  data() {
    const checkSelected = (value) => {
      var isChecked = false;
      if (!value) return;
      for(const item of value) {
        isChecked = item.checked || isChecked;
        if (isChecked) break;
      }
      if (isChecked) {
        return { success: true, message: "" };
      } else {
        return { success: false, message: "颜色至少需要选中一项" };
      }
    }
    return {
      checked:false,
      model:{
        name:"小明",
        password:'',
        itemList:[
          { label: "Red", value: 1, checked: false },
          { label: "Blue", value: 2, checked: false },
          { label: "Yellow", value: 3, checked: false },
          { label: "Grey", value: 4, checked: false },
          { label: "pink", value: 5, checked: false }
        ],
        company:'',
        switch: false,
        radio: [
          { label: "单选01", value: 1, checked: false },
          { label: "单选02", value: 2, checked: false },
          { label: "单选03", value: 3, checked: false },
          { label: "单选04", value: 4, checked: false },
          { label: "单选05", value: 5, checked: false }
        ],
        textarea: ""
      },
      rules:{
        name:[
          {required:true,message:"name不能为空",trigger:'blur'},//暂时有：mix,max,pattern,required,message,trigger
          {min:5,message:"name要长于5",trigger:['blur', 'change', 'keyup']}
        ],
        // 注意由于 多选公共组件 设计之初未考虑from表单的监听，所以没办法添加监听
        itemList:[
          { required:true, message:"checked", validator: checkSelected },
        ],
        company:[
          {required:true,message:"company不能为空"}
        ]
      },
      options: [{
          value: '公司A1',
          label: '公司A01'
      }, {
          value: '公司A2',
          label: '公司A02',
          disabled: true
      }, {
          value: '公司A3',
          label: '公司A03'
      }, {
          value: '公司A4',
          label: '公司A04'
      }, {
          value: '公司A5',
          label: '公司A05'
      }],
      selectValue: ""
    }
  },
  methods:{
    onHandleChange(i) {
      if (i.checked === true) {
        const list = this.model.radio;
        list.forEach(item => {
          item.checked = (item.value === i.value);
        })
      }
    },
    submit(){
        this.$refs.form.validate((valid)=>{
          if (valid) {
            console.log(this.model);
          } else {
            console.log('error submit!!');
            return false;
          }
        })
    }
  }
}
</script>

<style scoped>
    .wrap{
      width: 500px;
      margin: 50px;
      padding: 20px;
      border: 1px solid #ebebeb;
    }
    .wrap-main{
      width: 400px;
    }
    .yn-checkbox-item{
      display: inline-block;
      width: 100px;
      line-height: 30px;
      margin: 0;
      padding: 0;
      font-size: 14px;
    }
</style>