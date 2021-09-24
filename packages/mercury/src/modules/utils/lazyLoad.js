/*
 * @Author: Just be free
 * @Date:   2020-04-14 10:41:41
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-19 17:43:01
 * @E-mail: justbefree@126.com
 */
const p = (image) => {
  const promise = new Promise((resolve, reject) => {
    const img = new Image();
    if (!image || !image.src) {
      const err = new Error("img src attribute is required");
      reject(err);
    }
    img.src = image.src;
    img.onload = function () {
      resolve({
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        src: image.src,
      });
    };
    img.onerror = function () {
      reject(false);
    }
  });
  return promise;
};
export const loadImageAsync = (images = []) => {
  if (Array.isArray(images)) {
    const all = [];
    images.forEach((image) => {
      all.push(p(image));
    });
    return Promise.all(all);
  } else {
    return p(images);
  }
};
