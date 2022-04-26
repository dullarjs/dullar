import Icon from "@/components/icon";
import Vue, { CreateElement } from "vue";
import { Component, Prop } from "vue-property-decorator";
import "./style/index.scss";
@Component({
  name: "tag",
  components: { Icon }
})
export default class Tag extends Vue{
  static componentName = "YnTag";

  @Prop({
    type: String,
    default: "medium"
  })
  size!: string; // large / medium / small
  @Prop({
    type: String
  })
  color!: string;
  @Prop({
    type: Boolean,
    default: false
  })
  hit!: boolean;
  @Prop({
    type: Boolean,
    default: false
  })
  closable!: boolean;
  @Prop({
    type: Boolean,
    default: false
  })
  disableTransitions!: boolean;
  @Prop({
    type: String
  })
  type!: string; // success/info/warning/danger
  @Prop({
    type: String,
    default: "light"
  })
  effect!: string; // dark / light / plain

  handleClose(event: Event) {
    event.stopPropagation();
    this.$emit('close', event);
  }
  handleClick(event: Event) {
    this.$emit('click', event);
  }
  render(h: CreateElement) {
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
        Icon,
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
      children?.push(iconEl);
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
