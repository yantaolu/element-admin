const os = Object.prototype.toString

const checkType = (arg, type) => {
  return os.call(arg).toLowerCase() === `[object ${type}]`
}

export default class TypeCheck {
  static isFunction (fn) {
    return checkType(fn, 'function')
  }

  static isString (str) {
    return checkType(str, 'string')
  }

  static isNumber (num) {
    return checkType(num, 'number')
  }

  static isArray (arr) {
    return checkType(arr, 'array')
  }

  static isObject (obj) {
    return checkType(obj, 'object')
  }

  static isBoolean (bool) {
    return checkType(bool, 'boolean')
  }

  static isDate (date) {
    return checkType(date, 'date')
  }

  static isUndefined (val) {
    return val === undefined
  }

  static isNull (val) {
    return checkType(val, 'null')
  }

  static getType (val) {
    return os.call(val).slice(8, -1)
  }
}
