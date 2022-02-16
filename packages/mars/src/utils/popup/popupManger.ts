import { AnyObject } from "@/types";
import { addClass } from "../dom";
import { VueConstructor } from "vue/types";
const getModal = () => {
  let modalDom = PopupManager.modalDom;
  if (modalDom) {
    return modalDom;
  } else {
    modalDom = document.createElement("div");
    modalDom.addEventListener("click", () => {
      PopupManager.doOnModalClick();
    });
    PopupManager.modalDom = modalDom;
    return modalDom;
  }
}
const instances: AnyObject = {} // 保存 popup vue实例
const PopupManager: AnyObject = {
  zIndex: 2000,
  modalStack: [],
  nextZIndex() {
    return this.zIndex++;
  },
  getInstance(id: number) {
    return instances[id];
  },
  register(id: number, instance: VueConstructor) {
    instances[id] = instance;
  },
  deRegister(id: string) {
    instances[id] = null;
    delete instances[id];
  },
  doOnModalClick() {
    // 关闭 modal 其实 对应的 popup也要关闭
    // 拿到 modal, 然后 根据id拿到modal 对应的 popup 实例
    const topItem = this.modalStack[this.modalStack.length - 1];
    const instance = this.getInstance(topItem.id);
    instance.close();
  },
  openModal(id: string, zIndex: number, dom: Element | undefined) {
    const modalDom = getModal();
    if (dom) {
      dom.parentNode?.appendChild(modalDom);
    } else {
      document.body.appendChild(modalDom);
    }
    addClass(modalDom, "v-modal");
    modalDom.style.zIndex = zIndex;
    this.modalStack.push({ id: id, zIndex: zIndex});
  },
  closeModal(id: string) {
    const modalDom = getModal();
    // 存在已经打开的modal
    if (this.modalStack.length > 0) {
      const topItem = this.modalStack[this.modalStack.length - 1];
      // 当前 正在操作的 popup
      const { id: popupId } = topItem;
      // 当前popup 存在已打开的 modal
      if (id === popupId) {
        this.modalStack.pop(); // 关闭当前pop，则清除 缓存中改popup对应的modal
        if (this.modalStack.length > 0) {
          // 关闭当前pop后， 弱缓存中还有modal则 需要 修改modal元素的zIndex
          const topItem = this.modalStack[this.modalStack.length - 1];
          const { zIndex } = topItem;
          modalDom.style.zIndex = zIndex;
        } else {
          // 缓存中没有mdoal， 则不需要 modal元素
          if(modalDom.parentNode) modalDom.parentNode.removeChild(modalDom);
        }
      }
    }
  }
};
export default PopupManager;