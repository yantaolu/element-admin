<template>
  <el-form ref="conditions-form" class="tf-query-conditions" :model="formData" :rules="rules" label-position="right" label-suffix="：" :label-width="`${labelWidth}px`" inline>
    <el-form-item
      v-for="(con, index) in conditions" :key="`condition-${con.name}-${index}`" :label="con.text" :prop="con.name"
      :class="{'date-range-condition': con.type === 'date' && con.range}" :style="{width: `${getItemWidth(con)}px`}">
      <!--静态下拉列表-->
      <el-select v-if="con.type === 'select' && !con.remote" v-model="formData[con.name]" :placeholder="getPlaceHolder(con)" v-bind="con.props" clearable filterable>
        <el-option v-for="(op, i) in con.options" :key="`${getOpValue(op)}-${i}`" :label="getOpLabel(op)" :value="getOpValue(op)"></el-option>
      </el-select>
      <!--远程/异步下拉列表-->
      <private-remote-select
        v-else-if="con.type === 'select'" v-model="formData[con.name]" :condition="con" :placeholder="getPlaceHolder(con)"
        :getOpValue="getOpValue" :getOpLabel="getOpLabel"></private-remote-select>
      <!--单日期-->
      <el-date-picker
        v-else-if="con.type === 'date' && !con.range" v-model="formData[con.name]" :type="con.dateType === 'datetime' ? 'datetime' : 'date'"
        v-bind="con.props" :placeholder="getPlaceHolder(con)"></el-date-picker>
      <!--日期范围-->
      <el-date-picker
        v-else-if="con.type === 'date'" v-model="formData[con.name]"
        :type="con.dateType === 'datetime' ? 'datetimerange' : 'daterange'"
        align="right"
        start-placeholder="开始日期" range-separator="至" end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
        :picker-options="con.pickerOptions || getPickerOptions(con)" v-bind="con.props">
      </el-date-picker>
      <!--远程/异步自动填充-->
      <private-auto-complete
        v-else-if="con.remote" v-model="formData[con.name]" :condition="con" :placeholder="getPlaceHolder(con)"
        @key-enter="handleQuery"></private-auto-complete>
      <!--数字输入框-->
      <el-input-number
        v-else-if="con.type === 'number'" v-model="formData[con.name]" controls-position="right" @keyup.enter.native.stop="handleQuery"
        v-bind="con.props"></el-input-number>
      <!--地址组件-->
      <tf-address
        v-else-if="con.type === 'address'" v-model="formData[con.name]" :placeholder="getPlaceHolder(con)"
        v-bind="con.props" clearable></tf-address>
      <!--文本输入-->
      <el-input
        v-else v-model="formData[con.name]" :placeholder="getPlaceHolder(con)"
        @keyup.enter.native.stop="handleQuery" v-bind="con.props"></el-input>
    </el-form-item>
    <el-form-item v-if="conditions.length" style="margin-top: -1px; text-align: center;" :style="{width: `${itemWidth}px`}">
      <tf-button icon="el-icon-search" @click="handleQuery" type="primary">{{searchText}}</tf-button>
      <tf-button v-if="showReset" icon="el-icon-setting" @click="reset">{{resetText}}</tf-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {Input, InputNumber, Select, Option, DatePicker, Form, FormItem} from 'element-ui'
import ValidateRules from '../../../src/utils/validate-rules'
import TypeCheck from '../../../src/utils/type-check'
import PrivateAutoComplete from './auto-complete-condition'
import PrivateRemoteSelect from './remote-select-condition'
// 获取开始时间
const getStartDateTime = (isDate = true) => {
  if (!isDate) {
    return new Date()
  }
  let startDateTime = new Date()
  startDateTime.setHours(0)
  startDateTime.setMinutes(0)
  startDateTime.setSeconds(0)
  startDateTime.setMilliseconds(0)
  return startDateTime
}
// 获取结束时间
const getEndDateTime = (isDate = true) => {
  if (!isDate) {
    return new Date()
  }
  let endDateTime = new Date()
  endDateTime.setHours(23)
  endDateTime.setMinutes(59)
  endDateTime.setSeconds(59)
  endDateTime.setMilliseconds(999)
  return endDateTime
}
// 获取日期范围随机名称
const getRandomFieldName = () => {
  return `range-${Math.random().toString(36).substring(2)}-name`
}

export default {
  name: 'TfQueryConditions',
  components: {
    ElInput: Input,
    ElInputNumber: InputNumber,
    ElSelect: Select,
    ElOption: Option,
    ElDatePicker: DatePicker,
    ElForm: Form,
    ElFormItem: FormItem,
    PrivateAutoComplete,
    PrivateRemoteSelect
  },
  data () {
    let formData = {}
    let rules = {}
    let rangeNames = []
    this.conditions.forEach(con => {
      // 日期范围特殊处理
      if (con.type === 'date' && con.range) {
        // 日期范围可以不定义那么，使用start和end两个字段接收参数
        if (!con.name) {
          let name = getRandomFieldName()
          while (rangeNames.find(item => item === name)) {
            name = getRandomFieldName()
          }
          rangeNames.push(name)
          con.name = name
        }
        // 默认值，如果用户未定义默认值，则使用最近三个月为默认值
        formData[con.name] = TypeCheck.isArray(con.default) ? con.default : this.lastThreeMonths(con)
        // 默认值格式化
        if (con.props && con.props.valueFormat) {
          formData[con.name] = formData[con.name].map(date => {
            if (TypeCheck.isDate(date)) {
              return date.format(con.props.valueFormat)
            }
            return date
          })
        }
        // 定义开始字段
        if (con.start) {
          formData[con.start] = formData[con.name][0]
          Object.defineProperty(formData, con.start, {
            get () {
              return formData[con.name] && formData[con.name][0]
            }
          })
        }
        // 定义结束字段
        if (con.end) {
          formData[con.end] = formData[con.name][1]
          Object.defineProperty(formData, con.end, {
            get () {
              return formData[con.name] && formData[con.name][1]
            }
          })
        }
        // 日期范围校验
        // maxRange，最大日期范围，y(years),m(months),w(weeks),d(days),h(hours)
        if (con.maxRange && (!con.props || !con.props.valueFormat)) {
          const matches = /^(\d+)([a-z]?)$/.exec(`${con.maxRange}`.toLowerCase())
          if (matches && matches.length === 3) {
            const number = Number(matches[1])
            const unit = matches[2] || 'd'
            let unitCN = '天'
            const validator = (rule, value, callback) => {
              if (value && value.length) {
                const start = value[0]
                const end = value[1]
                const days = Math.floor((end - start) / (24 * 60 * 60 * 1000))
                const months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth()
                let valid = true
                switch (unit) {
                  // 年
                  case 'y':
                    valid = months < number * 12 || (months === number * 12 && end.getDate() <= start.getDate())
                    unitCN = '年'
                    break
                  // 月
                  case 'm':
                    valid = months < number || (months === number && end.getDate() <= start.getDate())
                    unitCN = '个月'
                    break
                  // 周
                  case 'w':
                    valid = days <= number * 7
                    unitCN = '个周'
                    break
                  // 日
                  default:
                    valid = days <= number
                    unitCN = '天'
                    break
                }
                if (!valid) {
                  callback(new Error(`最大日期范围为${number}${unitCN}`))
                }
              }
              callback()
            }
            con.rangeValidator = {validator, trigger: 'change'}
          }
        } else if (con.maxRange) {
          console.warn(`"${con.text}"设置了valueFormat属性，则范围校验不生效`)
        }
      } else if (con.type === 'address') {
        if (!con.name) {
          let name = getRandomFieldName()
          while (rangeNames.find(item => item === name)) {
            name = getRandomFieldName()
          }
          rangeNames.push(name)
          con.name = name
        }
        // 普通默认值
        formData[con.name] = Array.isArray(con.default) ? con.default : []
        // 定义单独地址字段接收参数
        if (Array.isArray(con.fields)) {
          con.fields.forEach((field, index) => {
            formData[field] = formData[con.name][index]
            Object.defineProperty(formData, field, {
              get () {
                return formData[con.name] && formData[con.name][index]
              }
            })
          })
        }
      } else {
        // 普通默认值
        formData[con.name] = typeof con.default === 'undefined' ? '' : con.default
      }
      // 必填输入
      if (con.required) {
        const isSelect = (con.type === 'select' && !con.remote) || con.type === 'date' || con.type === 'address'
        rules[con.name] = [ValidateRules.required(`请${isSelect ? '选择' : '输入'}${con.text}`, isSelect ? 'change' : 'blur')]
      }
      // 日期范围
      if (con.rangeValidator) {
        if (!rules[con.name]) {
          rules[con.name] = [con.rangeValidator]
        } else {
          rules[con.name].push(con.rangeValidator)
        }
      }
      // 校验规则
      if (con.rules) {
        if (!rules[con.name]) {
          rules[con.name] = con.rules
        } else if (Array.isArray(con.rules)) {
          rules[con.name].push(...con.rules)
        } else {
          rules[con.name].push(con.rules)
        }
      }
      // 远程支持
      if (con.remote) {
        if (!TypeCheck.isFunction(con.remote)) {
          throw new Error(`'remote' must be a function`)
        }
        if (formData[con.name] === null) {
          formData[con.name] = ''
        }
      }
    })
    return {
      rangeNames,
      formData,
      rules
    }
  },
  props: {
    conditions: {
      type: Array,
      default: () => []
    },
    labelWidth: {
      type: Number,
      default: 120,
      validator (val) {
        if (val < 60) {
          console.error(`'label-width' can't be less than 60.`)
        }
        return val >= 60
      }
    },
    searchText: {
      type: String,
      default: '查 询'
    },
    resetText: {
      type: String,
      default: '重 置'
    },
    autoQuery: {
      type: Boolean,
      default: true
    },
    showReset: {
      type: Boolean,
      default: true
    },
    defaults: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    itemWidth () {
      return this.labelWidth + 160
    }
  },
  watch: {
    defaults (obj = {}) {
      Object.keys(obj).forEach(key => {
        this.$set(this.formData, key, obj[key])
      })
    }
  },
  methods: {
    _form () {
      return this.$refs['conditions-form']
    },
    lastThreeMonths ({dateType}) {
      const isDate = dateType !== 'datetime'
      const start = getStartDateTime(isDate)
      start.setMonth(start.getMonth() - 3)
      return [start, getEndDateTime(isDate)]
    },
    getPickerOptions ({dateType}) {
      const isDate = dateType !== 'datetime'
      return {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const start = getStartDateTime(isDate)
            start.setDate(start.getDate() - 7)
            picker.$emit('pick', [start, getEndDateTime(isDate)])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const start = getStartDateTime(isDate)
            start.setMonth(start.getMonth() - 1)
            picker.$emit('pick', [start, getEndDateTime(isDate)])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const start = getStartDateTime(isDate)
            start.setMonth(start.getMonth() - 3)
            picker.$emit('pick', [start, getEndDateTime(isDate)])
          }
        }]
      }
    },
    getFormData () {
      let params = {}
      const formData = this.formData
      Object.keys(formData).forEach(key => {
        if (this.rangeNames.find(item => item === key)) {
          return
        }
        let value = formData[key]
        typeof value !== 'undefined' && value !== '' && value !== null && (params[key] = value)
      })
      return params
    },
    handleQuery () {
      this._form().validate(valid => {
        if (!valid) {
          return
        }
        this.$emit('query', this.getFormData())
      })
    },
    reset () {
      this._form().resetFields()
      this.$emit('reset', this.getFormData())
    },
    getItemWidth (con) {
      if (con.type === 'date' && con.range) {
        return this.itemWidth * 2 + 10
      }
      return this.itemWidth
    },
    getPlaceHolder (con) {
      if (typeof con.placeholder === 'undefined') {
        let prefix = '请输入'
        if (con.type === 'date' || con.type === 'address' || (con.type === 'select' && !con.remote)) {
          prefix = '请选择'
        }
        return `${prefix}${con.text}`
      }
      return con.placeholder
    },
    getOpValue (op) {
      if (TypeCheck.isObject(op)) {
        return op.value
      }
      return op
    },
    getOpLabel (op) {
      if (TypeCheck.isObject(op)) {
        return op.label || op.value
      }
      return op
    }
  },
  mounted () {
    this.autoQuery && this.handleQuery()
  }
}
</script>
