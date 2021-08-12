/*
 * @Author: Just be free
 * @Date:   2020-02-25 14:19:11
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-08-11 14:29:44
 */
class PopuoManager {
  constructor() {
    this.zIndex = 2000;
    this.instances = {};
    this.modalStack = [];
  }
  nextZindex() {
    this.zIndex++;
  }
  onModalClick() {
    const topItem = this.modalStack[this.modalStack.length - 1];
    if (!topItem) return;
    const instance = this.getInstance(topItem.popupId);
    if (instance && instance.closeOnClickModal) {
      instance.close();
    }
  }
  closeModal(id) {
    const topItem = this.modalStack[this.modalStack.length - 1];
    if (!topItem) return;
    if (id === topItem.popupId) {
      const instance = this.getInstance(topItem.popupId);
      const node = instance.$el;
      const modal = node.previousElementSibling;
      node.parentNode.removeChild(modal);
      this.deregister(id);
      this.modalStack.pop();
      document.body.style.overflow = instance.bodyOverflow;
    }
  }
  openModal(id, instance) {
    if (instance.lockScreen) {
      document.body.style.overflow = "hidden";
    }
    const node = instance.$el;
    const modal = node.previousElementSibling;
    modal.style.zIndex = this.zIndex;
    node.style.zIndex = this.zIndex + 1;
    this.addEvent(modal);
    this.modalStack.push({ popupId: id, node, modal, instance });
    this.nextZindex();
  }
  addEvent(modal) {
    modal.onclick = () => {
      this.onModalClick();
    };
  }
  getInstance(id) {
    return this.instances[`popupid_${id}`];
  }
  register(id, instance) {
    this.instances[`popupid_${id}`] = instance;
    this.openModal(id, instance);
  }
  deregister(id) {
    if (this.instances[`popupid_${id}`]) {
      this.instances[`popupid_${id}`] = null;
      delete this.instances[`popupid_${id}`];
    }
  }
}
const popupManager = new PopuoManager();
export default popupManager;
