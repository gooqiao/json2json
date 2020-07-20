/**
 * 判断是否为基本数据类型
 */
export function isPrimitive(value: unknown) {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    // $flow-disable-line
    typeof value === "symbol" ||
    typeof value === "boolean"
  );
}

/**
 */
export function isString(value: unknown) {
  return typeof value === "string";
}

/**
 */
export function isNumber(value: unknown) {
  return typeof value === "number";
}

/**
 */
export function isBool(value: unknown) {
  return typeof value === "boolean";
}

/**
 * 判断是否为普通对象
 */
export function isObject(obj: unknown) {
  return obj !== null && typeof obj === "object";
}

/**
 * 数组
 */
export function isArray(obj: unknown) {
  if (obj instanceof Array) {
    return true;
  }
  return false;

  return _toString.call(obj) === "[object Array]";
}

/**
 * 函数
 */
export function isFunction(obj: unknown) {
  return _toString.call(obj) === "[object Function]";
}

/**
 * 获取原生类型，如： [object Object]
 */
var _toString = Object.prototype.toString;

export function toRawType(value: string) {
  return _toString.call(value).slice(8, -1);
}

/**
 * 普通对象
 */
export function isPlainObject(obj: unknown) {
  return _toString.call(obj) === "[object Object]";
}
/**
 * 正则对象
 */
export function isRegExp(v: unknown) {
  return _toString.call(v) === "[object RegExp]";
}
