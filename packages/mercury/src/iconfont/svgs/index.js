/*
 * @Author: Just be free
 * @Date:   2020-09-11 14:46:03
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-09-11 14:49:58
 * @E-mail: justbefree@126.com
 */
const importAll = (context) => {
  const map = {};
  for (const key of context.keys()) {
    const keyArr = key.split("/");
    keyArr.shift(); // 移除.
    map[keyArr.join(".").replace(/\.svg$/g, "")] = context(key);
  }
  return map;
};

export default importAll(require.context("./", false, /\.svg$/));
