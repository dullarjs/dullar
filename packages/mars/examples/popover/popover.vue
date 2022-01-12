<template>
  <div class="popover-page">
    <h3>基础用法</h3>
    <Popover
      :visible.sync="popoverVisible1"
      :width="200"
      :title="'提示'"
    >
      <template v-slot:reference>
        <button >click激活,下边展示</button>
      </template>
    </Popover>
    <Popover
      :visible.sync="popoverVisible2"
      :placement="'top'"
      :width="150"
    >
      <template v-slot:reference>
        <button >click激活,上边展示</button>
      </template>
    </Popover>
    <Popover
      :visible.sync="popoverVisible3"
      :width="200"
      :placement="'left'"
    >
      <template v-slot:reference>
        <button >click激活,左边展示</button>
      </template>
    </Popover>
    <Popover
      :visible.sync="popoverVisible4"
      :width="200"
      :placement="'right'"
    >
      <template v-slot:reference>
        <button >click激活,右边展示</button>
      </template>
    </Popover>
    <Popover
      :visible.sync="popoverVisible5"
      :width="200"
      :placement="'top'"
      :trigger="'hover'"
    >
      <template v-slot:reference>
        <button >hover激活,上边展示</button>
      </template>
    </Popover>
    <h3>嵌套用法</h3>
    <Popover
      :visible.sync="popoverVisible6"
      :width="200"
      :placement="'top'"
    >
      <p>这是一段内容这是一段内容确定删除吗？</p>
      <div style="text-align: right; margin: 0">
        <button size="mini" type="text" @click="handleDel">取消</button>
        <button type="primary" size="mini" @click="handleDel">确定</button>
      </div>
      <template v-slot:reference>
        <button >删除</button>
      </template>
    </Popover>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import "./style/index.scss";
import { Component } from "vue-property-decorator";
import Popover from "@/components/popover";
@Component({
  name: "popoverPage",
  components: {
    Popover
  }
})
export default class ExDialog extends Vue {
  popoverVisible1 = false;
  popoverVisible2 = false;
  popoverVisible3 = false;
  popoverVisible4 = false;
  popoverVisible5 = false;
  popoverVisible6 = false;
  handleDel() {
    this.popoverVisible6 = false;
  }
}
</script>