<template>
  <div class="yn-input-wrap" ref="inputWrap" :style="{width:width+'px',height:height+'px',backgroundColor:backgroundColor,cursor:cursor}">
    <template v-if="!textArea">
      <div class="icon" v-if="prefixIcon">
        <yn-iconfont :name="prefixIcon" size="16"/>
      </div>
      <input :type="DateType" :style="{cursor:cursor}"
             @focus="onFocus" @blur="onBlur"
             v-bind:value="value" v-on:input="input"
             :placeholder="placeholder" :disabled="disabled"
             :maxlength="maxlength"
             style="width: 100px"
      >
      <div class="clearIcon" v-if="clear">
        <div class="icon " v-if="clearShow">
          <yn-iconfont name="clear" size="16" @click="clearFn"/>
        </div>
      </div>

      <div class="icon" v-if="showPassword">
        <yn-iconfont name="pay-fail" size="16" @click="ShowPassWordFn"/>
      </div>
      <div class="icon" v-if="suffixIcon">
        <yn-iconfont :name="suffixIcon" size="16" @click="searchBtn"/>
      </div>
    </template>
    <template v-if="textArea">
      <textarea v-model="value" v-on:input="input"></textarea>
    </template>
  </div>
</template>

<script>
export default {
  name: "YnInput",
  model:{
    prop:'value',
    event:'input'
  },
  props: {
    value:String,
    type:{
      type:String,
      default:'text'
    },
    maxlength:{
      type:[String,Number]
    },
    placeholder:{
      type:String
    },
    disabled:{
      type:Boolean,
      default:false
    },
    prefixIcon: {
      type: [String,Boolean],
      default() {
        return false
      }
    },
    suffixIcon: {
      type: [String,Boolean],
      default() {
        return false
      }
    },
    width:{
      type:Number,
      default(){
        return 180
      }
    },
    height:{
      type:Number,
      default:20
    },
    clear:{
      type:Boolean,
      default:false
    },
    showPassword:{
      type:Boolean,
      default:false
    },
    cols:{
      type:[String,Number],
      default:30
    },
    rows:{
      type:[String,Number],
      default:10
    }
  },
  data() {
    return {
      clearShow:false,
      textArea:false,
      backgroundColor:'',
      cursor:'',
      DateType:'text',
      time:null,
    }
  },
  watch:{
    type:{
      handler(v){
        this.DateType=v;
        this.textArea=(v=='textarea'?true:false)
      },
      immediate:true
    },
    disabled:{
      handler(v){
        if(v){
          this.backgroundColor="rgb(235, 235, 228)";
          this.cursor="not-allowed";
        }else{
          this.backgroundColor="";
          this.cursor="";
        }
      },
      immediate:true
    },
    showPassword:{
      handler(v){
        if(v){
          this.DateType='password'
        }
      },
      immediate:true
    },
  },
  methods: {
    input(e){
        this.$emit('input',e.target.value)
    },
    clearFn(){
      this.$emit('input','')
    },
    clearShowFn(){

        !!(this.value)==false?(this.clearShow=false):(this.clearShow=true)

    },
    onFocus(){
      let _this=this;
      let i=_this.$refs.inputWrap;
      i.style.border="1px solid #139ff0";
      if(_this.time){
        _this.time=null
      }
       _this.clearShowFn();

    },
    onBlur(){
      let _this=this;
      let i=_this.$refs.inputWrap;
      i.style.border="1px solid #c6c6c6";
      _this.time=setTimeout(function(){
        _this.clearShow=false
      },200)
    },
    f(e){
      let ev = e || window.event;  //标准化事件处理
      switch (ev.keyCode){
        case 13:
          console.log(this.value)
          break;
      }

    },
    searchBtn(){

      this.$emit("change",this.value)
    },
    ShowPassWordFn(){
        this.DateType=this.DateType=='password'?'text':'password'
    }
  },
  mounted() {
    let i=this.$refs.inputWrap;
    i.onkeypress =this.f;
  }

}
</script>

<style lang="less" scoped>
.yn-input-wrap {
  display: flex;
  justify-content: space-around;
  align-items: center;
  border: 1px solid #c6c6c6;
  border-radius: 4px;
  padding: 0 5px;
  > .icon {
    cursor: pointer;
    i.yn-iconfont-wrap {
      padding: 0 3px;
    }
  }
  .clearIcon{
    width: 18px;
  }
  input{
    flex-grow: 1;
    flex-shrink: 1;
    border: none;
    &:focus{
      outline: none;
    }
  }
  textarea{
    border: 0;
    width: 100%;
    height: 100%;
  }
}

</style>