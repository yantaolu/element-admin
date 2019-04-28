import md2vue from './markdown2vue'

export default {
  path: '/integrated',
  title: '集成组件',
  icon: 'fa-gg-circle',
  order: 1,
  children: [
    {
      path: '/table',
      title: 'Table',
      component: resolve => import('../views/integrated/table.md').then(md => md2vue(md, resolve))
    }, {
      path: '/table-example',
      title: 'Table Example',
      menu: false,
      component: resolve => import('../views/integrated/table-example')
    }, {
      path: '/button',
      title: 'Button',
      component: resolve => import('../views/integrated/button.md').then(md => md2vue(md, resolve))
    }, {
      path: '/query-conditions',
      title: 'QueryConditions',
      component: resolve => import('../views/integrated/query-conditions.md').then(md => md2vue(md, resolve))
    }, {
      path: '/integrated-page',
      title: 'IntegratedPage',
      component: resolve => import('../views/integrated/integrated-page.md').then(md => md2vue(md, resolve))
    },
    {
      path: '/address',
      title: 'Address',
      component: resolve => import('../views/integrated/address.md').then(md => md2vue(md, resolve))
    }, {
      path: '/addr-example',
      title: 'AddrExample',
      menu: false,
      component: resolve => import('../views/examples/address')
    }
  ]
}
