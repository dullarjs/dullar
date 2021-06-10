(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.throttle = exports.isChineseCharacters = exports.setProperty = exports.getProperty = exports.push = exports.drop = exports.getCharLength = exports.isDef = exports.isObject = exports.isPromise = exports.isString = exports.capitalize = exports.camelize = exports.hyphenate = exports.hasOwnProperty = void 0;
    var hasOwnProperty = function (obj, props) {
        return Object.prototype.hasOwnProperty.call(obj, props);
    };
    exports.hasOwnProperty = hasOwnProperty;
    var hyphenate = function (str) {
        return String(str).replace(/\B([A-Z])/g, "-$1").toLowerCase();
    };
    exports.hyphenate = hyphenate;
    var camelize = function (str) {
        return String(str).replace(/-(\w)/g, function (_, c) { return (c ? c.toUpperCase() : ""); });
    };
    exports.camelize = camelize;
    var capitalize = function (str) {
        return String(str).charAt(0).toUpperCase() + str.slice(1);
    };
    exports.capitalize = capitalize;
    var isString = function (value) {
        return Object.prototype.toString.call(value) === "[object String]";
    };
    exports.isString = isString;
    var isPromise = function (obj) {
        return (!!obj &&
            (typeof obj === "object" || typeof obj === "function") &&
            typeof obj.then === "function");
    };
    exports.isPromise = isPromise;
    var isObject = function (value) {
        var type = typeof value;
        return value !== null && type === "object";
    };
    exports.isObject = isObject;
    var isDef = function (value) {
        return value !== undefined && value !== null;
    };
    exports.isDef = isDef;
    var getCharLength = function (str) {
        return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
    };
    exports.getCharLength = getCharLength;
    var drop = function (arr, ele) {
        if (Array.isArray(arr)) {
            if (Array.isArray(ele)) {
                ele.forEach(function (item) {
                    var index = arr.indexOf(item);
                    if (index > -1) {
                        arr.splice(index, 1);
                    }
                });
            }
            else {
                var index = arr.indexOf(ele);
                if (index > -1) {
                    arr.splice(index, 1);
                }
            }
        }
    };
    exports.drop = drop;
    var push = function (arr, ele) {
        if (Array.isArray(arr)) {
            if (Array.isArray(ele)) {
                ele.forEach(function (item) {
                    if (arr.indexOf(item) < 0) {
                        arr.push(item);
                    }
                });
            }
            else {
                if (arr.indexOf(ele) < 0) {
                    arr.push(ele);
                }
            }
        }
    };
    exports.push = push;
    var getProperty = function (o, attr) {
        return o[attr];
    };
    exports.getProperty = getProperty;
    var setProperty = function (o, k, v) {
        Object.defineProperty(o, k, {
            value: v,
            writable: true
        });
    };
    exports.setProperty = setProperty;
    var isChineseCharacters = function (str) {
        return /^[\u4e00-\u9fa5]+$/i.test(str);
    };
    exports.isChineseCharacters = isChineseCharacters;
    var throttle = function (callback, delay) {
        if (delay === void 0) { delay = 800; }
        var timer = null;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                callback(args);
                timer = null;
            }, delay);
        };
    };
    exports.throttle = throttle;
});
