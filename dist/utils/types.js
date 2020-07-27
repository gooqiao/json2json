"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRegExp = exports.isPlainObject = exports.toRawType = exports.isFunction = exports.isArray = exports.isObject = exports.isBool = exports.isNumber = exports.isString = exports.isPrimitive = void 0;
/**
 * 判断是否为基本数据类型
 */
function isPrimitive(value) {
    return (typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "symbol" ||
        typeof value === "boolean");
}
exports.isPrimitive = isPrimitive;
/**
 */
function isString(value) {
    return typeof value === "string";
}
exports.isString = isString;
/**
 */
function isNumber(value) {
    return typeof value === "number";
}
exports.isNumber = isNumber;
/**
 */
function isBool(value) {
    return typeof value === "boolean";
}
exports.isBool = isBool;
/**
 * 判断是否为普通对象
 */
function isObject(obj) {
    return obj !== null && typeof obj === "object";
}
exports.isObject = isObject;
/**
 * 数组
 */
function isArray(obj) {
    if (obj instanceof Array) {
        return true;
    }
    return false;
    return _toString.call(obj) === "[object Array]";
}
exports.isArray = isArray;
/**
 * 函数
 */
function isFunction(obj) {
    return _toString.call(obj) === "[object Function]";
}
exports.isFunction = isFunction;
/**
 * 获取原生类型，如： [object Object]
 */
const _toString = Object.prototype.toString;
function toRawType(value) {
    return _toString.call(value).slice(8, -1);
}
exports.toRawType = toRawType;
/**
 * 普通对象
 */
function isPlainObject(obj) {
    return _toString.call(obj) === "[object Object]";
}
exports.isPlainObject = isPlainObject;
/**
 * 正则对象
 */
function isRegExp(v) {
    return _toString.call(v) === "[object RegExp]";
}
exports.isRegExp = isRegExp;
//# sourceMappingURL=types.js.map