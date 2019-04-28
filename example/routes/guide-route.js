import markdown2vue from './markdown2vue'

export default {
  path: '/guide',
  title: '开发指南',
  icon: 'fa-book',
  order: 0,
  children: [{
    path: '/basic',
    title: '基本使用',
    component: resolve => markdown2vue(import('../views/guide/basic.md'), resolve)
  }, {
    path: '/route',
    title: '路由配置',
    // multi: true,
    component: resolve => markdown2vue(import('../views/guide/route.md'), resolve)
  }, {
    path: '/nav',
    title: '导航菜单',
    component: resolve => markdown2vue(import('../views/guide/nav.md'), resolve)
  }, {
    path: '/tabs',
    title: '标签页',
    component: resolve => require(['../views/guide/tabs.md'], md => markdown2vue(md, resolve))
  }, {
    path: '/routes-tree',
    title: '菜单权限树',
    component: resolve => require(['../views/guide/routes-tree.md'], md => markdown2vue(md, resolve))
  }, {
    path: '/md-preview',
    title: '文档预览',
    menu: false,
    component: resolve => import('../views/guide/md-preview')
  }]
}
