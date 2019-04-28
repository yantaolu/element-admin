import Type from './type-check'

const clone = (source, deep = false) => {
  let result
  if (Type.isArray(source)) {
    result = []
    const len = source.length
    for (let i = 0; i < len; i++) {
      result[i] = deep ? clone(source[i], true) : source[i]
    }
  } else if (Type.isObject(source)) {
    result = {}
    Object.keys(source).forEach(key => {
      result[key] = deep ? clone(source[key], true) : source[key]
    })
  } else if (deep && Type.isDate(source)) {
    result = new Date(source.getTime())
  } else {
    result = source
  }
  return result
}

export default class CommonUtil {
  static clone (source) {
    return clone(source)
  }

  static deepClone (source) {
    return clone(source, true)
  }
}
