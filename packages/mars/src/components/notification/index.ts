import Vue from "vue"
import myNotice from "./notification.vue"
const instances:any[] = [];
let seed = 0;
// 继承
const noticeConstructor = Vue.extend(myNotice);
const oncloseNotice = function(args: string) {
  let removedHeight = 0;
  let index = -1;
  instances.forEach((val, i) => {
    // 当前关闭的dom
    if (args === val.id) {
      removedHeight = val.$el.offsetHeight;
      index = i;
      instances.splice(i, 1);
    }
  })
  for(let i = 0; i < instances.length; i++){
    const dom = instances[i].$el;
    dom.style.top = parseInt(dom.style.top) - removedHeight -10 + 'px';
  }
}
const Notification = function(options: any) {
//   const { message, type, center } = options;
  // 实例化
  const instance = new noticeConstructor({
    el: document.createElement("div"),
    propsData: options
  });
  const id = "notice-" + seed++;
  (instance as any).onClose = function () {
    oncloseNotice(id);
  }
  // 实例展示到页面
  document.body.appendChild(instance.$el);
//   // center：布尔类型 是否居中 （非必传 默认不居中）
//   (instance as any).center = center;
//   // type：字符串 提示类型（非必传 默认消息提示）
//   (instance as any).type = type;
  let noticeTop = 20;
  if (instances && instances.length > 0) {
    instances.forEach(item => {
      // 防止noticeTop NAN
      if (item.$el.offsetHeight) {
        noticeTop += item.$el.offsetHeight + 10;
      }
    })   
  }
  (instance as any).id = id;
  (instance as any).top = noticeTop;
  // 每一次的实例保存起来 （渲染页面不重叠）
  (instance as any).visable = true;
  instances.push(instance);
  return instance;
}
export default Notification