<template>
    <div>

      <div style="padding-left: 200px;">
<!--              <Input clear suffixIcon="search" v-model="v"/>-->
<!--              <Input v-model="v" @change="f" maxlength="3"/>-->
              <p>基础用法</p>
              <yn-input/>
              <p>默认长度</p>
              <yn-input maxlength="3" placeholder="默认长度为3"/>
              <p>textarea</p>
              <yn-input v-model="v" type="textarea" width="300" height="100"/>
              <p>可切换密码</p>
              <yn-input v-model="v" showPassword/>
              <p>可清除</p>
              <yn-input clear search v-model="v" placeholder="可清除"/>
      </div>

    </div>
</template>

<script>
 // import Input from './input_copy'
export default {
  name: "index",
  components:{
    // Input
  },
  data(){
    return{
      v:"222"
    }
  },
  methods:{
    f(v){
      console.log(v)
    }
  }

}
</script>

<style scoped>

</style>