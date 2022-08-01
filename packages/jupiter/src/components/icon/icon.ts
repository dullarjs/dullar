import "./style/index.scss";
import { h } from "vue"
import { Vue, Options, mixins } from "vue-class-component";
class Props {
  name!: string
}
@Options({
  name: "Icon"
})
export default class Icon extends mixins(Vue).with(Props) {
  static componentName = 'YnIcon';
  render() {
    return h("i", { class: ['yn-icon-' + this.name] }, []);
  }
}
