<template>
  <div class="yn-field-container">
    <h2>yn-field</h2>
    <div class="box">
      <ul>
        <li>
          <span class="label">基础用法</span>
          <yn-field-group>
            <yn-field v-model="basicUsage" placeholder="请输入内容"></yn-field>
          </yn-field-group>
        </li>
        <li>
          <span class="label">数字类型</span>
          <yn-field-group>
            <yn-field
              v-model="phoneNumber"
              label="手机号码"
              type="number"
              min="3"
              max="10"
              placeholder="phone number"
              pattern="[0-9]*"
            ></yn-field>
          </yn-field-group>
        </li>
        <li>
          <span class="label">密码类型</span>
          <yn-field
            v-model="userPassword"
            label="用户密码"
            type="password"
            placeholder="password"
          ></yn-field>
        </li>
        <li>
          <span class="label">只读</span>
          <yn-field
            v-model="readonly"
            label="证件信息"
            type="text"
            readonly
          ></yn-field>
        </li>
        <li>
          <span class="label">disabled</span>
          <yn-field
            v-model="disabled"
            label="关键信息"
            type="text"
            disabled
          ></yn-field>
        </li>
        <li>
          <span class="label">清除icon</span>
          <yn-field
            v-model="clear"
            label="清除icon"
            type="text"
            clearable
          ></yn-field>
        </li>
        <li>
          <span class="label">自定义icon</span>
          <yn-field
            v-model="customIcon"
            label="自定义icon"
            iconName="iconarrow_right_gray"
            type="text"
          ></yn-field>
        </li>
        <li>
          <span class="label">textarea</span>
          <yn-field
            v-model="textarea"
            label="textarea"
            type="textarea"
            maxlength="50"
            showTextareaCounter
            clearable
          ></yn-field>
        </li>
        <li>
          <span>未加密字符串{{ynIdNoEncrpt}}</span>
          <yn-field-group>
            <yn-field v-model="ynName" label="中文姓名"></yn-field>
            <yn-field v-model="ynPhone" label="手机号码"></yn-field>
            <yn-field v-model="ynIdType" label="证件类型"></yn-field>
            <yn-field v-model="ynIdNo" label="证件号码"></yn-field>
            <yn-field
              v-model="ynIdNoEncrpt"
              ref="YnField"
              label="加密证件"
              encrypted
            ></yn-field>
            <yn-field v-model="ynBirthday" label="出生日期"></yn-field>
          </yn-field-group>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "YnFieldPage",
  data() {
    return {
      basicUsage: "",
      phoneNumber: "",
      userPassword: "",
      readonly: "3333333333333",
      disabled: "1111111111",
      clear: "",
      customIcon: "",
      textarea: "",
      ynName: "",
      ynPhone: "",
      ynIdType: "",
      ynIdNo: "",
      ynBirthday: "",
      ynIdNoEncrpt: "11222222222",
      customLabel: ""
    };
  }
};
</script>
<style type="text/css" scoped="scoped">
.yn-field-container{
  background-color: #f7f8fa;
}
.box {
  height: 100%;
}
.box ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.box ul li {
  margin: 10px 0;
}
.box ul li .label {
  margin: 5px 0;
  display: block;
}
</style>
