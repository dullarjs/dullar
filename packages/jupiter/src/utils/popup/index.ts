
import PopupManager from "./popupManger";
import { Vue, Options, prop, mixins } from "vue-class-component";
import "@/theme/popup.scss";
let idSeed = 1;
class Props {
  visible = prop<boolean>({ default: false })
  zIndex = prop<number>({ default: 0 })
  modal = prop<boolean>({ default: true })
  modalAppendToBody = prop<boolean>({ default: true })
  closeOnClickModal = prop<boolean>({ default: true })
}
@Options({
  name: "Popup",
  watch: {
    visible(val: boolean) {
      if (val) {
        this.open();
      } else {
        this.close();
      }
    }
  }
})
export default class Popup extends mixins(Vue).with(Props) {

  _popupId = "";

  beforeMount() {
    this._popupId = "popup-" + idSeed++; 
    PopupManager.register(this._popupId, this);
  }
  beforeDestroy() {
    PopupManager.deRegister(this._popupId);
  }

  open() {
    const dom = this.$el;
    if (this.zIndex) {
      PopupManager.zIndex = this.zIndex;
    }
    if (this.modal) {
      PopupManager.openModal(this._popupId, PopupManager.nextZIndex(), this.modalAppendToBody ? undefined : dom);
    }
    (dom as HTMLElement).style.zIndex = PopupManager.nextZIndex();
  }
  close() {
    console.log("close");
    PopupManager.closeModal(this._popupId);
  }
}