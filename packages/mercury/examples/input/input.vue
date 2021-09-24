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
        <yn-input type="text" underline/>
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
  .prepend_demo{
    height: 100%;
    padding: 0 10px;
    background-color: #e9e9e9;
    line-height: 2;
  }
</style>