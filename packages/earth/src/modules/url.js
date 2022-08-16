/*
* @Author: Just be free
* @Date:   2022-08-16 12:04:00
* @Last Modified by:   Just be free
* @Last Modified time: 2022-08-16 18:55:11
* @E-mail: justbefree@126.com
*/

export const addHash = (hashName) => {
  let uri = window.location.href.replace(window.location.origin, "");
  if (uri.includes(`&_=${hashName}`) || uri.includes(`?_=${hashName}`)) return;
  if (uri.indexOf("?") > -1) {
    uri += `&_=${hashName}`;
  } else {
    uri += `?_=${hashName}`;
  }
  window.history.pushState({ page: hashName }, hashName, uri);
};

export const removeHash = (hashName) => {
  let uri = window.location.href.replace(window.location.origin, "");
  if (uri.includes(`&_=${hashName}`) && uri.includes(`?_=${hashName}`)) return;
  // window.history.go(-1);
  window.history.back();
};
