/*
 * @Author: liuzx
 * @Date:   2020-01-20 16:43:44
 * @Last Modified by:   liuzx
 * @Last Modified time: 2020-05-15 10:09:55
 */
import { install } from "../modules/component";
import { extend } from "../mixins/rendered";
import YnModal from "./modal";

install(YnModal);

const YnModalContructor = extend(YnModal);
const getInstance = () => {
  return new YnModalContructor({
    el: document.createElement("div"),
  });
};
const props = {
  title: "",
  message: "",
  width: "400px",
  showCancelButton: true,
  showConfirmButton: true,
  cancelButtonText: "取消",
  cancelLoadingText: "取消",
  confirmButtonText: "确定",
  confirmLoadingText: "确定",
  loadingColor: "#007aff",
  closeModelOnClick: false,
  zIndex: 2,
  className: "",
  showHeader: false,
  showFooter: true,
  footerTopBorder: false,
  buttonSize: "small",
};

export default {
  alert(options = {}) {
    const args = {
      ...props,
      showCancelButton: false,
      ...options,
    };
    const instance = getInstance();

    instance.$data.renderedAsComponent = false;
    Object.assign(instance, props, args);
    document.body.appendChild(instance.$el);
    instance.show = true;
  },
  confirm(options = {}) {
    const args = {
      ...props,
      ...options,
    };
    this.alert(args);
  },
  ...YnModal,
};
