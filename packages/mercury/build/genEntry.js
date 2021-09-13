/*
* @Author: Just be free
* @Date:   2020-09-18 18:15:09
* @Last Modified by:   Just be free
* @Last Modified time: 2021-09-06 18:52:57
* @E-mail: justbefree@126.com
*/
const path = require("path");
const fs = require("fs");
const dotenv = require('dotenv');
const envConfit = dotenv.config({ path: "./.env.production" });
const componentPrefix = envConfit.parsed.VUE_APP_PREFIX;
const { genComponentLibs, camelize, chalk } = require("./utils");
const exculde = ["mixins", "theme", "modules"];
const components = [];
const componentsWithoutPrefix = [];
const prepend = `
const EVENTS = {};
import { getConfig } from "./modules/component/config";
import { hyphenate } from "./modules/utils";
const version = getConfig("VUE_APP_VERSION");
import "./index.less";
import "./window-events";\n
`;
const renderInstall = () => `
const components = [${componentsWithoutPrefix.join(", ")}];
const install = (Vue) => {
  if (install.installed) return;
  components.map(component => {
    if (component.name && typeof component !== "function") {
      const eventName = hyphenate(component.name);
      if (EVENTS[eventName] && typeof EVENTS[eventName] === "function") {
         Vue.component(component.name, EVENTS[eventName]());
      } else {
         Vue.component(component.name, component);
      }
    } else if (component.install) {
      Vue.use(component);
    }
  });
  Vue.prototype.Toast = Toast;
  Vue.prototype.Dialog = Dialog;
  Vue.prototype.Indicator = Indicator;
  Vue.prototype.Modal = Modal;
};
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}
const config = (options = {}) => {
  Object.keys(options).forEach(componentName => {
   const ca = hyphenate(componentName);
   components.forEach((component) => {
     if (ca === component.name) {
       if (component.callback && (typeof component.callback === "function")) {
         EVENTS[ca] = () => {
           return component.callback(options[componentName]);
         }
       }
     }
   });
  });
};
export { install, version, config };
export default {
  install,
  version,
  config
};\n`;
module.exports = {
  write: () => {
    const validComponents = genComponentLibs("src", exculde);
    const indexPath = path.posix.join("src", "/index.js");
    const indexLess = path.posix.join("src", "/index.less");
    fs.writeFileSync(indexPath, prepend); // clear entry file 
    fs.writeFileSync(indexLess, "");
    Array.apply(null, validComponents).map(component => {
      // console.log("component = ", component);
      const exportedName = `${componentPrefix}-${component}`;
      const componentName = camelize(component, true);
      componentsWithoutPrefix.push(componentName);
      components.push({ [componentName]: camelize(exportedName, true) });
      const exportCode = `import ${componentName} from "./${component}";\n`;
      fs.appendFileSync(indexPath, exportCode);
      const style = `@import "./${component}/style/index.less";\n`;
      fs.appendFileSync(indexLess, style);
    });
    fs.appendFileSync(indexPath, renderInstall());
    // const exportCode = `export { ${components.join(", ")} };\n`;
    let exportCode = "";
    Array.apply(null, components).map(component => {
      const key = Object.keys(component)[0];
      chalk(`${key} component was compeleted!`);
      // console.log(component, key);
      // const exportedName = `${componentPrefix}-${component}`;
      exportCode += `export { ${key} as ${component[key]} };\n`;
    });
    fs.appendFileSync(indexPath, exportCode);
  }
};
