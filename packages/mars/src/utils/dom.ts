export const on = (el: Document | HTMLElement | Window, eventName: string, cb: (e: Event) => void) => {
  el.addEventListener(eventName, cb);
}
export const off = (el: Document | HTMLElement | Window, eventName: string, cb: (e: Event) => void) => {
  el.removeEventListener(eventName, cb);
}
export const hasClass = (el: HTMLElement, cls: string) => {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error("className should not contain space.");
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (" " + el.className + "").indexOf(" " + cls + " ") > -1;
  }
}
export const addClass = (el: HTMLElement, cls: string) => {
  if (!el) return;
  let curClass = el.className;
  const classes = (cls || "").split(" ");
  classes.forEach(clsName => {
    if (el.classList) {
      el.classList.add(clsName);
    } else if(!hasClass(el, clsName)) {
      curClass += " " + clsName;
    }
  });
  if (!el.classList) {
    el.setAttribute("class", curClass);
  }
}