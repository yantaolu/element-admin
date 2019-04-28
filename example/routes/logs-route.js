import md2vue from './markdown2vue'

export default {
  path: '/logs',
  title: '更新日志',
  icon: 'fa-list-ol',
  component: resolve => import('../views/logs.md').then(md => md2vue(md, resolve))
}
