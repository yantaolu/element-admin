'use strict'
import DateUtil from './date-util'
import TypeCheck from './type-check'

const numberToDate = (num) => {
  if (num === 0) {
    return new Date()
  }
  let date = new Date()
  date.setDate(date.getDate() + num)
  return date
}

const transformMinDate = (min) => {
  if (TypeCheck.isDate(min)) {
    min.setHours(0, 0, 0, 0)
  }
}

const transformMaxDate = (max) => {
  if (TypeCheck.isDate(max)) {
    max.setHours(23, 59, 59, 999)
  }
}

const prefixStrategies = {
  date: '请选择',
  default: '请输入',
  get (type) {
    return this[type] || this.default
  }
}

const valueStrategies = {
  date: (value) => DateUtil.format(value, 'yyyy-MM-dd'),
  get (value, type) {
    if (this[type]) {
      return this[type](value)
    }
    return value
  }
}

const suffixStrategies = {
  date: '时间',
  default: '数值',
  get (type) {
    return this[type] || this.default
  }
}

export default {
  // 必填
  required (message, trigger = 'blur') {
    return {required: true, message, trigger}
  },

  // 字符长度
  length (min, max) {
    return {
      validator: (rule, value, callback) => {
        const len = (value + '').toString().length
        if (min === null && len > max) {
          callback(new Error(`最多可输入 ${max} 个字符`))
        } else if (max === null && len < min) {
          callback(new Error(`最少需要输入 ${min} 个字符`))
        } else if (len < min || len > max) {
          callback(new Error(`请输入 ${min} 到 ${max} 个字符`))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  },

  // 范围（数字，时间）
  range (min, max, type = 'number') {
    // 日期范围的需要处理日期参数
    if (type === 'date') {
      TypeCheck.isNumber(min) && (min = numberToDate(min))
      TypeCheck.isNumber(max) && (max = numberToDate(max))
      transformMinDate(min)
      transformMaxDate(max)
    }
    return {
      validator: (rule, value, callback) => {
        if (!value) {
          return callback()
        }
        if (min === null && value > max) {
          callback(new Error(`${prefixStrategies.get(type)}不大于 ${valueStrategies.get(max, type)} 的${suffixStrategies.get(type)}`))
        } else if (max === null && value < min) {
          callback(new Error(`${prefixStrategies.get(type)}不小于 ${valueStrategies.get(min, type)} 的${suffixStrategies.get(type)}`))
        } else if (value < min || value > max) {
          callback(new Error(`${prefixStrategies.get(type)} ${valueStrategies.get(min, type)} 到 ${valueStrategies.get(max, type)} 之间的${suffixStrategies.get(type)}`))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  },

  // 时间范围（时间，时间段）
  dateRange (min, max) {
    TypeCheck.isNumber(min) && (min = numberToDate(min))
    TypeCheck.isNumber(max) && (max = numberToDate(max))
    transformMinDate(min)
    transformMaxDate(max)

    return {
      validator: (rule, value, callback) => {
        if (!value) {
          return callback()
        }
        if (TypeCheck.isDate(value)) {
          if (min === null && value > max) {
            callback(new Error(`请选择不大于 ${DateUtil.format(max, 'yyyy-MM-dd')} 的时间`))
          } else if (max === null && value < min) {
            callback(new Error(`请选择不小于 ${DateUtil.format(min, 'yyyy-MM-dd')} 的时间`))
          } else if (value < min || value > max) {
            callback(new Error(`请选择 ${DateUtil.format(min, 'yyyy-MM-dd')} 到 ${DateUtil.format(max, 'yyyy-MM-dd')} 之间的时间`))
          } else {
            callback()
          }
        } else if (TypeCheck.isArray(value) && value.length === 2) {
          if (min === null && (value[0] > max || value[1] > max)) {
            callback(new Error(`请选择不大于 ${DateUtil.format(max, 'yyyy-MM-dd')} 的时间`))
          } else if (max === null && (value[0] < min || value[1] < min)) {
            callback(new Error(`请选择不小于 ${DateUtil.format(min, 'yyyy-MM-dd')} 的时间`))
          } else if (value[0] < min || value[1] < min || value[0] > max || value[1] > max) {
            callback(new Error(`请选择 ${DateUtil.format(min, 'yyyy-MM-dd')} 到 ${DateUtil.format(max, 'yyyy-MM-dd')} 之间的时间`))
          } else {
            callback()
          }
        }
      },
      trigger: 'blur'
    }
  },

  // 手机号码
  mobile () {
    return {pattern: /^1[3-9][\d]{9}$/, message: '请输入正确的手机号码', trigger: 'blur'}
  },

  // 身份证
  peopleID () {
    return {pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号码', trigger: 'blur'}
  },

  // 车牌号，含新能源
  carID () {
    return {
      pattern: /(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6,7}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/,
      message: '请输入正确的车牌号码，常规格式：浙A12345',
      trigger: 'blur'
    }
  },

  // email
  email (addrs) {
    if (!addrs || !TypeCheck.isArray(addrs) || !addrs.length) {
      return {type: 'email', message: '请输入正确的邮箱地址，例如zhangsan@gmail.com', trigger: 'blur'}
    }
    return {
      pattern: new RegExp(`^[a-zA-Z0-9_-]+@(${addrs.join('|').replace(/\./g, '\\.')})$`),
      message: `请输入正确的邮箱地址，例如：zhangsan@${addrs[0]}`,
      trigger: 'blur'
    }
  },

  // url地址栏
  url () {
    return {type: 'url', message: '请输入正确的url地址，例如：http:www.baidu.com', trigger: 'blur'}
  },

  // 枚举值
  enum (arr = []) {
    return {type: 'enum', enum: arr, message: `只能输入 ${arr.join(', ')} 中的任一值`, trigger: 'blur'}
  },

  // number
  number () {
    return {
      type: 'number',
      message: '请输入合法的数字',
      trigger: 'blur',
      transform (value) {
        if (!value || TypeCheck.isNumber(value)) {
          return value
        }
        if (value && /^\d+(\.?\d+)*$/.test(value.toString())) {
          return parseFloat(value.toString())
        }
        return value
      }
    }
  },

  // integer
  integer () {
    return {
      type: 'integer',
      message: '请输入合法的整数',
      trigger: 'blur',
      transform (value) {
        if (!value || TypeCheck.isNumber(value)) {
          return value
        }
        if (value && /^\d+$/.test(value.toString())) {
          return parseInt(value.toString())
        }
        return value
      }
    }
  },

  // float
  float (digits) {
    return {
      type: 'float',
      message: digits ? `请输入 ${digits} 位小数` : '请输入合法的小数',
      trigger: 'blur',
      transform (value) {
        if (!value || TypeCheck.isNumber(value)) {
          return value
        }
        const reg = digits ? new RegExp(`^\\d+.\\d{${digits}}$`) : /^\d+\.\d+$/
        if (value && reg.test(value.toString())) {
          return parseFloat(value.toString())
        }
        return value
      }
    }
  }
}
