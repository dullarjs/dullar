/*
 * @Author: Just be free
 * @Date:   2021-08-26 13:48:15
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-08-26 18:35:54
 * @E-mail: justbefree@126.com
 */

import { defineComponent, genComponentName } from "../modules/component";
import Checkbox from "../checkbox";
export default defineComponent({
  name: "Tree",
  components: { Checkbox },
  props: {
    data: {
      default: () => {
        return [];
      },
      type: Array,
    },
  },
  initPropsToData() {
    return [{ key: "dataSource", value: "data" }];
  },
  methods: {
    updateTreeNode(node) {
      console.log("node = ", node);
      console.log("data = ", this.dataSource);
      const path = [];
      console.log(path);
      this.dataSource.forEach((leaf, key) => {
        console.log(leaf, key);
      });
      // this.dataSource = JSON.parse(JSON.stringify(this.dataSource));
    },
    handleChange(leaf) {
      // console.log(leaf);
      leaf.checked = !leaf.checked;
      this.updateTreeNode(leaf);
    },
    genTreeNode(h, source) {
      let seed = 0;
      return Array.apply(null, source).map((leaf, key) => {
        ++seed;
        if (!leaf.checked) {
          leaf.checked = false;
        }
        leaf.id = `${seed}-${key}`;
        return h("div", { key, class: ["yn-tree-leaf"] }, [
          h("div", { class: ["yn-tree-leaf-label"] }, [
            h(
              genComponentName("checkbox"),
              {
                on: {
                  change: this.handleChange.bind(this, leaf),
                },
                class: ["tree-checkbox"],
                props: { size: 14, checked: leaf.checked },
              },
              []
            ),
            h("span", {}, leaf.label),
          ]),
          Array.isArray(leaf.children)
            ? this.genTreeNode(h, leaf.children)
            : null,
        ]);
      });
    },
  },
  render(h) {
    return h("div", { class: ["yn-tree"] }, [
      this.genTreeNode(h, this.dataSource),
    ]);
  },
});
