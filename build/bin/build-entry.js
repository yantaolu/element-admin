const glob = require('glob')
const fs = require('fs')
const render = require('json-templater/string')
const uppercamelcase = require('uppercamelcase')
const path = require('path')
const endOfLine = require('os').EOL

const OUTPUT_PATH = path.join(__dirname, '../../src/index.js')
const IMPORT_TEMPLATE = 'import {{name}} from \'../packages/{{package}}/index.js\''
const INSTALL_COMPONENT_TEMPLATE = '  {{name}}'
const MAIN_TEMPLATE = `/* Automatically generated by './build/bin/build-entry.js' */
'use strict'
// 所有组件
{{include}}
// 国际化支持
import {locale, i18n} from 'element-ui'
// ajax支持
import ajax from './utils/ajax'
// 样式支持
import './css/index.scss'
// Promise兼容支持
import Promise from 'bluebird'
// 默认标签页路由解析器
import routesProcessor from './utils/routes-processor'
// 日期工具函数
import DateUtils from './utils/date-util'
// 字符串工具函数
import StringUtils from './utils/string-util'
// 类型检测工具函数
import TypeCheck from './utils/type-check'
// 表单校验规则生成工具
import ValidateRules from './utils/validate-rules'

const Locale = {locale, i18n}
const $ajax = ajax

const components = [
{{install}}
]

const install = function (Vue, {size = '', zIndex = 2000, locale, i18n} = {}) {
  Locale.locale(locale)
  Locale.i18n(i18n)

  components.map(component => {
    Vue.use(component)
  })

  Vue.use(Loading.directive)

  Vue.prototype.$ELEMENT = {
    size: size,
    zIndex: zIndex
  }

  Vue.prototype.$ajax = ajax
  Vue.prototype.$loading = Loading.service
  Vue.prototype.$msgbox = MessageBox
  Vue.prototype.$alert = MessageBox.alert
  Vue.prototype.$confirm = MessageBox.confirm
  Vue.prototype.$prompt = MessageBox.prompt
  Vue.prototype.$notify = Notification
  Vue.prototype.$message = Message
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

/* unify Promise */
if (typeof window !== 'undefined') {
  window.Promise = Promise
}

export {
  locale,
  i18n,
  install,
  ajax,
  $ajax,
  Promise,
  routesProcessor,
  DateUtils,
  StringUtils,
  TypeCheck,
  ValidateRules,
{{list}}
}

export default {
  version: '{{version}}',
  locale,
  i18n,
  install,
  ajax,
  $ajax,
  Promise,
  routesProcessor,
  DateUtils,
  StringUtils,
  TypeCheck,
  ValidateRules,
{{list}}
}
`
const getComponents = () => {
  let components = {}, tmp, pathname
  glob.sync('./packages/**/index.js').forEach(entry => {
    tmp = entry.split('/').splice(-3)
    pathname = tmp.splice(1, 1).toString().toLowerCase()
    components[pathname] = entry
  })
  return components
}

const ComponentNames = Object.keys(getComponents())

const includeComponentTemplate = []
const installTemplate = []
const listTemplate = []

ComponentNames.forEach(name => {
  const componentName = uppercamelcase(name)

  includeComponentTemplate.push(render(IMPORT_TEMPLATE, {
    name: componentName,
    package: name
  }))

  if (['Loading', 'MessageBox', 'Notification', 'Message', 'TabsView'].indexOf(componentName) === -1) {
    installTemplate.push(render(INSTALL_COMPONENT_TEMPLATE, {
      name: componentName,
      component: name
    }))
  }

  listTemplate.push(`  ${componentName}`)
})

const template = render(MAIN_TEMPLATE, {
  include: includeComponentTemplate.join(endOfLine),
  install: installTemplate.join(',' + endOfLine),
  version: process.env.VERSION || require('../../package.json').version,
  list: listTemplate.join(',' + endOfLine)
})

fs.writeFileSync(OUTPUT_PATH, template)
console.log('[build entry] DONE:', OUTPUT_PATH)
