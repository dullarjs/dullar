<template>
  <popover
    v-model:visible="visible"
    v-bind="$attrs"
    :trigger="'click'"
  >
    <div class="yn-popconfirm">
      <p class="yn-popconfirm__main">
        {{ title }}
      </p>
      <div class="yn-popconfirm__action">
        <Button :type="cancelButtonType" size="mini" @click="handleCancel">{{ cancelButtonText }}</Button>
        <Button :type="confirmButtonType" size="mini" @click="handleConfirm">{{ confirmButtonText }}</Button>
      </div>
    </div>
    <template v-slot:reference>
      <slot name="reference"></slot>
    </template>
  </popover>
</template>
<script lang="ts">
import "./style/index.scss";
import { Vue, Options, prop, mixins } from "vue-class-component";
import Popover from "@/components/popover";
import Button from "@/components/button";
class Props {
  title = prop<string>({ default: "" })
  confirmButtonText = prop<string>({ default: "确定" })
  cancelButtonText = prop<string>({ default: "取消" })
  confirmButtonType = prop<string>({ default: "primary" })
  cancelButtonType = prop<string>({ default: "text" })
}
@Options({
  name: "YnPopconfirm",
  components: {
    Button,
    Popover
  },
  emits: ["confirm", "cancel"]
})
export default class Popconfirm extends mixins(Vue).with(Props){
  static componentName = "YnPopconfirm";
  visible = false;

  handleConfirm() {
    this.visible = false;
    this.$emit("confirm");
  }
  handleCancel() {
    this.visible = false;
    this.$emit("cancel");
  }
}
</script>