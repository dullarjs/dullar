<template>
  <div class="wrap">
    <yn-form :model="model" :rule="rules" ref="form">
      <yn-form-item label="账号" prop="name">
        <yn-input v-model="model.name"></yn-input>
      </yn-form-item>
      <yn-form-item label="密码" prop="password">
        <yn-input v-model="model.password"></yn-input>
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

      model:{
        name:"小明",
        password:''
      },
      rules:{
        name:[
          {required:true,message:"name不能为空",trigger:'blur'},//暂时有：mix,max,pattern,required,message,trigger
          {min:5,message:"name要长于5",trigger:'change'}
        ]
      }
    }
  },
  methods:{
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