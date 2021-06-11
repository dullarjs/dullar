"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBem = void 0;
var BEM = /** @class */ (function () {
    function BEM() {
    }
    BEM.config = function (options) {
        console.log("pass BEM config ", options);
        var _a = options.blockPrefix, blockPrefix = _a === void 0 ? "yui" : _a, _b = options.modifierSeparator, modifierSeparator = _b === void 0 ? "--" : _b, _c = options.elementSeparator, elementSeparator = _c === void 0 ? "__" : _c;
        BEM.blockPrefix = blockPrefix;
        BEM.modifierSeparator = modifierSeparator;
        BEM.elementSeparator = elementSeparator;
    };
    BEM.BlockParser = function (name) {
        if (typeof name === "string") {
            return "" + BEM.blockPrefix + name;
        }
        else {
            var key = Object.keys(name)[0];
            var value = name[key];
            if (typeof value === "string") {
                return "" + BEM.blockPrefix + key + BEM.modifierSeparator + value;
            }
            else {
                var attr = Object.keys(value)[0];
                var deepValue = value[attr];
                if (typeof deepValue === "boolean") {
                    if (deepValue) {
                        return "" + BEM.blockPrefix + key + " " + BEM.blockPrefix + key + BEM.modifierSeparator + attr;
                    }
                    else {
                        return "" + BEM.blockPrefix + key;
                    }
                }
                else {
                    return "" + BEM.blockPrefix + key + BEM.modifierSeparator + attr + BEM.modifierSeparator + value[attr];
                }
            }
        }
    };
    BEM.ElementParser = function (b, e) {
        if (typeof b === "string" && typeof e === "string") {
            return "" + BEM.blockPrefix + b + BEM.elementSeparator + e;
        }
        else if (typeof b === "string") {
            if (typeof e === "string") {
                return "" + BEM.blockPrefix + b + BEM.elementSeparator + e;
            }
            else {
                var key = Object.keys(e)[0];
                var value = e[key];
                if (typeof value === "string") {
                    return "" + BEM.blockPrefix + b + BEM.elementSeparator + key + " " + BEM.blockPrefix + b + BEM.elementSeparator + key + BEM.modifierSeparator + value;
                }
                else {
                    var attr = Object.keys(value)[0];
                    var deepValue = value[attr];
                    if (typeof deepValue === "boolean") {
                        if (deepValue) {
                            return "" + BEM.blockPrefix + b + BEM.elementSeparator + key + " " + BEM.blockPrefix + b + BEM.elementSeparator + key + BEM.modifierSeparator + attr;
                        }
                        else {
                            return "" + BEM.blockPrefix + b + BEM.elementSeparator + key;
                        }
                    }
                    else {
                        return "" + BEM.blockPrefix + b + BEM.elementSeparator + key + " " + BEM.blockPrefix + b + BEM.elementSeparator + key + BEM.modifierSeparator + attr + BEM.modifierSeparator + value[attr];
                    }
                }
            }
        }
        else {
            var name_1 = Object.keys(b)[0];
            return BEM.ElementParser(name_1, e);
        }
    };
    BEM.create = function (b, e) {
        return e ? BEM.ElementParser(b, e) : BEM.BlockParser(b);
    };
    BEM.blockPrefix = "yui";
    BEM.modifierSeparator = "--";
    BEM.elementSeparator = "__";
    return BEM;
}());
exports.default = BEM;
var createBem = function (b, e) {
    return BEM.create(b, e);
};
exports.createBem = createBem;
// bem("block"); => block
// bem("block", "element"); => block__element
// bem({ block: "green" }); => block--green
// bem("block", { element: "active" }); => block__element block__element--active
// bem("block", { element: { "is-active": true } }); => block__element block__element--is-active
// bem("block", { element: { "is-active": false } }); => block__element
// bem("block", { element: { "has-color": "black" } }); => block__element block__element--has-color--black
// bem({ block: "active" }, { element: "active" }); => block__element block__element--active
// bem({ block: { "is-show": true } }); => block block--is-show
// bem({ block: { "is-show": false } }); => block
