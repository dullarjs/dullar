import "./utils/window-event";


import { App } from "vue";
import { AnyObject } from "./types";

import Notification from "@/components/notification";
import Spin from "./components/spin";
import CityPicker from "./components/cityPicker";
import Dialog from "./components/dialog";
import Popover from "./components/popover";
import Indicator from "./components/indicator";
import Iconfont from "./components/iconfont";
import Radiobox from "./components/radiobox";
import Checkbox from "./components/checkbox";
import Field from "./components/field";
import Select from "./components/select";
import Option from "./components/select/option.vue";
import Scrollbar from "./components/scrollbar";
import Dropdown from "./components/dropdown";
import DropdownMenu from "./components/dropdown/dropdownMenu.vue";
import DropdownItem from "./components/dropdown/dropdownItem.vue";
import Tag from "@/components/tag";
import Icon from "@/components/icon";
import Button from "@/components/button";
import Popconfirm from "@/components/popconfirm";
import MessageBox from "@/components/messageBox";
import Message from "@/components/message";
import DatePicker from "@/components/datePicker";
import Flex from "@/components/flex";
import FlexItem from "@/components/flex-item";

interface MarsConfigOptions {
  [propName: string]: any;
}
const configOptions: MarsConfigOptions = {};
export const components: AnyObject = {
  FlexItem,
  Flex,
  DatePicker,
  Popconfirm,
  Button,
  Icon,
  Tag,
  DropdownItem,
  DropdownMenu,
  Dropdown,
  Scrollbar,
  Option,
  Select,
  Field,
  Checkbox,
  Radiobox,
  Iconfont,
  Indicator,
  Spin,
  CityPicker,
  Dialog,
  Popover
}

const install = (app: App<Element>): void => {
  Object.keys(components).map(compName => {
    // debugger; // eslint-disable-line;
    const comp = components[compName];
    const merge = (comp as any).extendData;
    if (merge && typeof merge === "function") {
      merge(configOptions[comp.componentName]);
    }
    if (typeof comp === "function") {
      app.component(comp.componentName, comp);
    } else {
      app.component(comp.name, comp);
    }
  });
  app.config.globalProperties.Indicator = Indicator;
  app.config.globalProperties.$notification = Notification;
  app.config.globalProperties.$msgbox = MessageBox;
  app.config.globalProperties.$message = Message;
};
const config = (options: MarsConfigOptions) => {
  Object.keys(options).forEach((attr: string) => {
    configOptions[attr] = options[attr];
  });
};
export default {
  config,
  install
}
