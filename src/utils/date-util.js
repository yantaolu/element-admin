import TypeCheck from './type-check'

const checkDate = (date) => {
  if (!TypeCheck.isDate(date)) {
    throw new Error(`Can not use string util to resolve the ${TypeCheck.getType(date)} data.`)
  }
}

const format = (date, fmt = 'yyyy-MM-dd HH:mm:ss') => {
  checkDate(date)
  let d = {
    'y+': date.getFullYear(),
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'h+': date.getHours() % 12,
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    't+': date.getHours() > 11 ? 'PM' : 'AM'
  }

  for (let r in d) {
    switch (r) {
      case 'y+':
        (new RegExp(`(${r})`, 'gi').test(fmt)) && (fmt = fmt.replace(RegExp.$1, d[r].toString().substring(4 - RegExp.$1.length)))
        break
      case 't+':
        (new RegExp(`(${r})`, 'gi').test(fmt)) && (fmt = fmt.replace(RegExp.$1, d[r].toString().substring(0, RegExp.$1.length)))
        break
      default:
        (new RegExp(`(${r})`, 'g').test(fmt)) && (fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? d[r] : d[r].toString().padStart(2, '0')))
        break
    }
  }
  return fmt
}

const utils = {
  format
}

const dateFormat = function (fmt) {
  return format(this, fmt)
}

const old = Date.prototype.format

const noConflict = () => {
  if (Date.prototype.format === dateFormat) {
    try {
      Object.assign(Date.prototype, {format: old})
    } catch (e) {
    }
  }
}

Object.assign(Date.prototype, {
  format: dateFormat
})

utils.noConflict = noConflict

export default utils
