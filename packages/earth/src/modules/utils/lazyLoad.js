/*
 * @Author: Just be free
 * @Date:   2020-04-14 10:41:41
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-11-08 17:50:42
 * @E-mail: justbefree@126.com
 */
const p = (url) => {
  const promise = new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = function () {
      resolve(img);
    };
    img.onerror = function (err) {
      reject(err);
    };
  });
  return promise;
};
export const loadImageAsync = (resources = []) => {
  if (Array.isArray(resources)) {
    const all = [];
    resources.forEach((image) => {
      all.push(p(image));
    });
    return Promise.all(all);
  } else {
    return p(resources);
  }
};
