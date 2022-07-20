import Icon from "@/components/icon";
import { h } from "vue";
import { Vue, Options, prop, mixins } from "vue-class-component";
import "./style/index.scss";
class Props {
  size = prop<string>({ default: "medium" }) // large / medium / small
  color!: string
  hit = prop<boolean>({ default: false })
  closable = prop<boolean>({ default: false })
  disableTransitions = prop<boolean>({ default: false })
  type!: string // success/info/warning/danger
  effect = prop<string>({ default: "light" }) // dark / light / plain
}
@Options({
  name: "tag",
  components: { Icon }
})
export default class Tag extends mixins(Vue).with(Props){
  static componentName = "YnTag"; 

  handleClose(event: Event) {
    event.stopPropagation();
    this.$emit('close', event);
  }
  handleClick(event: Event) {
    this.$emit('click', event);
  }
  render() {
    const { size, hit, type, effect } = this;
    const classes = [
      'yn-tag',
      type ? `yn-tag--${type}` : '',
      effect ? `yn-tag--${effect}` : '',
      size ? `yn-tag--${size}` : '',
      hit && 'is-hit'
    ];
    const children = this.$slots.default;
    if (this.closable) {
      const iconEl = h(
        "icon",
        {
          "class": ["yn-tag__close"],
          props: {
            name: "close"
          },
          nativeOn: {
            click: this.handleClose
          }
        },
        []
      )
      Array.isArray(children) && children?.push(iconEl);
    }
    const tagEl = h(
      "span",
      {
        "class": classes,
        style: { backgroundColor: this.color },
        on: {
          click: this.handleClick.bind(this)
        }
      },
      children
    );
    const transtionEl = h(
      "transition",
      {
        props: {
          name: "yn-zoom-in-center"
        }
      },
      [tagEl]
    );

    return this.disableTransitions ? tagEl : transtionEl;
  }
}
