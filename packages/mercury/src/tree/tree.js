/*
 * @Author: Just be free
 * @Date:   2021-08-26 13:48:15
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-26 16:52:50
 * @E-mail: justbefree@126.com
 */
import "./style";
import { defineComponent, genComponentName } from "../modules/component";
import Checkbox from "../checkbox";
import { push, drop } from "../modules/utils";
import { deepClone } from "../modules/utils/deepClone";
import Iconfont from "../iconfont";
import Spin from "../spin";
export default defineComponent({
  name: "Tree",
  components: { Checkbox, Iconfont, Spin },
  props: {
    showCheckbox: {
      default: false,
      type: Boolean,
    },
    lazy: {
      default: false,
      type: Boolean,
    },
    load: {
      type: Object,
      default: () => {
        return {
          params: {},
          action: () => {
            return Promise.resolve();
          },
          parse: (e) => {
            return e;
          },
        };
      },
    },
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
        const node = deepClone(this.flatNodes[id]);
        delete node.children;
        result.push(node);
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
      if (attr === "checked") {
        this.updateSelected(node.id, value);
      }
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
      if (Array.isArray(attr)) {
        attr.forEach((iAttr) => {
          this.updateLeaf(node, iAttr, node[iAttr], loop);
        });
      } else {
        this.updateLeaf(node, attr, node[attr], loop);
      }
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
      if (this.lazy && !node.loaded) {
        const params = { ...this.load.params, node };
        const promise = this.load.action(params);
        node.loading = !node.loading;
        this.updateTreeNode(node, "loading", false);
        promise
          .then((data) => {
            node.children = data;
            this.updateTreeNode(node, "children", false, () => {
              node.expanded = !node.expanded;
              node.loaded = !node.loaded;
              node.loading = !node.loading;
              this.updateTreeNode(
                node,
                ["expanded", "loaded", "loading"],
                false
              );
            });
          })
          .catch(() => {
            node.loading = !node.loading;
            this.updateTreeNode(node, "loading", false);
          });
      } else {
        if (Array.isArray(node.children)) {
          node.expanded = !node.expanded;
          this.updateTreeNode(node, "expanded", false);
        }
      }
      if (!this.showCheckbox) {
        this.$emit("pick", node);
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
    genIcon(h, leaf) {
      const loading = h(
        genComponentName("spin"),
        {
          class: ["tree-loading-icon"],
          props: { type: "fading-circle", size: 14 },
        },
        []
      );
      const checkbox = h(
        genComponentName("checkbox"),
        {
          on: {
            change: this.handleChange.bind(this, leaf),
          },
          class: ["tree-front-icon"],
          props: { size: 14, checked: leaf.checked },
        },
        []
      );
      const iconfont = h(
        genComponentName("iconfont"),
        {
          class: ["tree-front-icon", leaf.expanded ? "expanded" : ""],
          props: {
            name: "solid-arrow",
            size: 8,
          },
          on: {
            click: this.handleExpand.bind(this, leaf),
          },
        },
        []
      );
      const results = [];
      if (this.lazy && this.showCheckbox) {
        results.push(iconfont, checkbox);
        if (leaf.loading) {
          results.push(loading);
        }
      } else if (this.showCheckbox) {
        results.push(checkbox);
      } else {
        if (Array.isArray(leaf.children)) {
          results.push(iconfont);
        }
      }
      return results;
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
        if (!leaf.loaded) {
          leaf.loaded = false;
        }
        if (!leaf.loading) {
          leaf.loading = false;
        }
        this.flatNodes[leaf.id] = leaf;
        return h("div", { key, class: ["yn-tree-leaf"], style: {} }, [
          h("div", { class: ["yn-tree-leaf-label"] }, [
            ...this.genIcon(h, leaf),
            null,
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
