/*
 * @Author: Just be free
 * @Date:   2021-08-26 13:48:15
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-08-28 16:59:57
 * @E-mail: justbefree@126.com
 */

import { defineComponent, genComponentName } from "../modules/component";
import Checkbox from "../checkbox";
import { push, drop } from "../modules/utils";
// import { move } from "../modules/dom/animate/move";
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
  data() {
    return {
      selected: [],
      flatNodes: {},
    };
  },
  methods: {
    notification() {
      const result = [];
      this.selected.forEach((id) => {
        result.push(this.flatNodes[id]);
      });
      this.$emit("pick", result);
    },
    updateSelected(id, status) {
      if (status) {
        push(this.selected, id);
      } else {
        drop(this.selected, id);
      }
    },
    updateLeaf(node, attr, value, loop) {
      node[attr] = value;
      this.updateSelected(node.id, value);
      if (loop) {
        if (Array.isArray(node.children)) {
          node.children.forEach((leaf) => {
            // this.updateLeaf(leaf, status);
            this.updateLeaf(leaf, attr, value, loop);
          });
        }
      }
    },
    updateTreeNode(node, attr, loop, callback) {
      const path = node.id.split("-").map((i) => parseInt(i));
      this.updateLeaf(node, attr, node[attr], loop);
      const changedNode = this.dataSource[path[0]];
      this.dataSource.splice(path[0], 1, changedNode);
      callback && typeof callback === "function" && callback();
    },
    handleChange(leaf) {
      leaf.checked = !leaf.checked;
      this.updateTreeNode(leaf, "checked", true, () => {
        this.notification();
      });
    },
    handleExpand(node) {
      if (Array.isArray(node.children)) {
        node.expanded = !node.expanded;
        this.updateTreeNode(node, "expanded", false);
      }
    },
    handleEnter(el) {
      el.style.height = "auto";
      // noinspection JSSuspiciousNameCombination
      let endWidth = window.getComputedStyle(el).height;
      el.style.height = "0px";
      el.offsetHeight; // force repaint
      // noinspection JSSuspiciousNameCombination
      el.style.height = endWidth;
    },
    handleAfterEnter(el) {
      el.style.height = null;
    },
    handleLeave(el) {
      el.style.height = window.getComputedStyle(el).height;
      el.offsetHeight; // force repaint
      el.style.height = "0px";
    },
    handleAfterLeave(el) {
      el.style.height = null;
    },
    genTreeNode(h, source, parentId) {
      return Array.apply(null, source).map((leaf, key) => {
        if (!leaf.checked) {
          leaf.checked = false;
        }
        leaf.parentId = parentId;
        leaf.id = parentId !== null ? `${parentId}-${key}` : `${key}`;
        if (!leaf.expanded) {
          leaf.expanded = false;
        }
        this.flatNodes[leaf.id] = leaf;
        return h("div", { key, class: ["yn-tree-leaf"], style: {} }, [
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
            h(
              "span",
              {
                on: {
                  click: this.handleExpand.bind(this, leaf),
                },
              },
              leaf.label
            ),
          ]),
          h(
            "transition",
            {
              name: "yn-tree-expand",
              on: {
                enter: this.handleEnter.bind(this),
                afterEnter: this.handleAfterEnter.bind(this),
                leave: this.handleLeave.bind(this),
                afterLeave: this.handleAfterLeave.bind(this),
              },
            },
            [
              h(
                "div",
                {
                  class: ["leaf-group"],
                  directives: [{ name: "show", value: leaf.expanded }],
                },
                Array.isArray(leaf.children)
                  ? this.genTreeNode(h, leaf.children, leaf.id)
                  : null
              ),
            ]
          ),
        ]);
      });
    },
  },
  render(h) {
    return h("div", { class: ["yn-tree"] }, [
      this.genTreeNode(h, this.dataSource, null, -1),
    ]);
  },
});

// reference https://blogs.vicsdf.com/article/638
