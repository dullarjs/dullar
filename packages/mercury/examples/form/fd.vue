<template>
  <div class="wrap">
    <yn-form :model="model" :rule="rules" ref="form">
      <yn-form-item label="账号" prop="name">
        <yn-input v-model="model.name"></yn-input>
      </yn-form-item>
      <yn-form-item label="密码" prop="password">
        <yn-input v-model="model.password"></yn-input>
      </yn-form-item >
      <yn-form-item label="公司" prop="company">
        <select name="" id="" v-model="model.company">
          <option value="">未选择</option>
          <option value="0">阿里</option>
          <option value="1">华为</option>
          <option value="2">小米</option>
          <option value="3">腾讯</option>

        </select>
      </yn-form-item >
      <yn-form-item label="记住" prop="checked">
          <yn-checkbox v-model="checked" @change="handleClick"></yn-checkbox>
          <span>当前状态{{checked }}</span>
      </yn-form-item>
      <yn-form-item>
        <button @click="submit">确定</button>
      </yn-form-item>
    </yn-form>
  </div>
</template>

<script>
export default {
  name: "YnFormPage",
  data() {
    return {
      checked:false,
      model:{
        name:"小明",
        password:'',
        checked:'',
        company:''
      },
      rules:{
        name:[
          {required:true,message:"name不能为空",trigger:'blur'},//暂时有：mix,max,pattern,required,message,trigger
          {min:5,message:"name要长于5",trigger:'change'}
        ],
        checked:[
          {required:true,message:"checked",trigger:'change'}
        ],
        company:[
          {required:true,message:"company不能为空"}
        ]
      }
    }
  },
  methods:{
    handleClick(e){
      console.log(e)
      if(e){
        this.$set(this.model,'checked',e)
      }else{
        this.$set(this.model,'checked',"")
      }
    },
    submit(){
        this.$refs.form.validate((valid)=>{
          if (valid) {
            alert('submit!');
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
    }
</style>