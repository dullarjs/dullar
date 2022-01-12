
import PopupManager from "./popupManger";
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import "@/theme/popup.scss";
let idSeed = 1;
@Component({
  name: "Popup"
})
export default class Popup extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  visible!: boolean;
  @Prop({
    type: Number,
    default: 0
  })
  zIndex!: number;
  @Prop({
    type: Boolean,
    default: true
  })
  modal!: boolean;
  @Prop({
    type: Boolean,
    default: true
  })
  modalAppendToBody!: boolean;
  @Prop({
    type: Boolean,
    default: true
  })
  closeOnClickModal!: boolean;

  _popupId = "";

  beforeMount() {
    this._popupId = "popup-" + idSeed++; 
    PopupManager.register(this._popupId, this);
  }
  beforeDestroy() {
    PopupManager.deRegister(this._popupId);
  }

  @Watch("visible")
  OnVisible(val: boolean) {
    if (val) {
      this.open();
    } else {
      this.close();
    }
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