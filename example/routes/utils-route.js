import md2vue from './markdown2vue'

export default {
  path: '/utils',
  title: '实用工具类',
  icon: 'fa-wrench',
  order: 2,
  children: [{
    path: '/ajax',
    title: 'Ajax 支持',
    component: resolve => require(['../views/utils/ajax.md'], md => md2vue(md, resolve))
  }, {
    path: '/promise',
    title: 'Promise 支持',
    component: resolve => require(['../views/utils/promise.md'], md => md2vue(md, resolve))
  }, {
    path: '/validate-rules',
    title: 'Form 表单验证',
    component: resolve => require(['../views/utils/validate-rules.md'], md => md2vue(md, resolve))
  }]
}
