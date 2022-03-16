<template>
  <popover
    :visible.sync="visible"
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
import Vue from 'vue'
import { Component, Prop } from "vue-property-decorator";
import Popover from "@/components/popover";
import Button from "@/components/button";
@Component({
  name: "Popconfirm",
  components: {
    Button,
    Popover
  }
})
export default class Popconfirm extends Vue{
  static componentName = "YnPopconfirm";
  visible = false;
  @Prop({
    type: String,
    default: ""
  })
  title!: string;
  @Prop({
    type: String,
    default: "确定"
  })
  confirmButtonText!: string;
  @Prop({
    type: String,
    default: "取消"
  })
  cancelButtonText!: string;
  @Prop({
    type: String,
    default: "primary"
  })
  confirmButtonType!: string;
  @Prop({
    type: String,
    default: "text"
  })
  cancelButtonType!: string;
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