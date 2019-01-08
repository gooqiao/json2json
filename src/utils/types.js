
/**
 * 判断是否为基本数据类型
 */
export function isPrimitive (value) {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      // $flow-disable-line
      typeof value === 'symbol' ||
      typeof value === 'boolean'
    )
  }
  
  /**
   */
  export function isString (value) {
    return typeof value === 'string'
  }

  /**
   */
  export function isNumber (value) {
    return typeof value === 'number'
  }

  /**
   */
  export function isBool (value) {
    return typeof value === 'boolean'
  }
  
  /**
   * 判断是否为普通对象
   */
  export function isObject (obj) {
    return obj !== null && typeof obj === 'object'
  }
  
  /**
   * 数组
   */
  export function isArray (obj) {
    return _toString.call(obj) === '[object Array]'
  }

  /**
   * 函数
   */
  export function isFunction (obj) {
    return _toString.call(obj) === '[object Function]'
  }
  
  /**
   * 获取原生类型，如： [object Object]
   */
  var _toString = Object.prototype.toString;
  
  export function toRawType (value) {
    return _toString.call(value).slice(8, -1)
  }
  
  /**
   * 普通对象
   */
  export function isPlainObject (obj) {
    return _toString.call(obj) === '[object Object]'
  }
  /**
   * 正则对象
   */
  export function isRegExp (v) {
    return _toString.call(v) === '[object RegExp]'
  }

