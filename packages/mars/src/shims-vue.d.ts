declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
// 全局声明， vue 在this里面可以使用变量，如: let name = 'xiao'; this[name]...
declare module "vue/types/vue" {
  interface Vue {
    [key: string]: any;
  }
}
