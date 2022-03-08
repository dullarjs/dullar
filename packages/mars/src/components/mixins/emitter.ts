import Vue from "vue";
import { Component } from "vue-property-decorator";

function broadcast(this: Vue, componentName: string, eventName: string, params?: any) {
  this.$children.forEach(child => {
    const name = child.$options.name;

    if (name === componentName) {
      child.$emit.call(child, eventName, params);
    } else {
      broadcast.call(child, componentName, eventName, params);
    }
  });
}
@Component({
  name: "Emitter"
})
export default class Emitter extends Vue {
  dispatch(componentName: string, eventName: string, params?: any) {
    let parent = this.$parent || this.$root;
    let name = parent.$options.name;

    while (parent && (!name || name !== componentName)) {
      parent = parent.$parent;

      if (parent) {
        name = parent.$options.name;
      }
    }
    if (parent) {
      parent.$emit.call(parent, eventName, params);
    }
  }
  broadcast(componentName: string, eventName: string, params?: any) {
    broadcast.call(this, componentName, eventName, params);
  }
}
