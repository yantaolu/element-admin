import Type from './type-check'

const checkString = (str) => {
  if (!Type.isString(str)) {
    throw new Error(`Can not use string util to resolve the ${Type.getType(str)} data.`)
  }
}
export default class StringUtil {
  static isEmpty (str) {
    checkString(str)
    return str === undefined || str === null || /^\s*$/.test(str)
  }

  static trim (str) {
    checkString(str)
    return str.replace(/^\s*/g, '').replace(/\s*$/g, '')
  }
}
