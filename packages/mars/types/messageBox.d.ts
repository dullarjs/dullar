interface Vue{
  // install: (Vue: typeof Vue) => void;
  [key: string]: any;
  $msgbox: any;
}
interface VueConstructor{
  $msgbox: any;
}
