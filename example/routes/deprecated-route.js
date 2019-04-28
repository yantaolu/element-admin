import md2vue from './markdown2vue'

export default {
  path: '/deprecated',
  title: '弃用组件',
  icon: 'error',
  order: 9,
  children: [{
    path: '/table-column',
    title: 'TableColumn',
    component: resolve => import('../views/deprecated/table-column.md').then(md => md2vue(md, resolve))
  }]
}
