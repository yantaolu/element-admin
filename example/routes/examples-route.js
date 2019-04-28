export default {
  path: '/examples',
  title: 'Examples',
  order: 999,
  icon: 'fa-dribbble',
  children: [{
    path: '/roles',
    title: '角色管理',
    component: () => import('../views/examples/roles'),
    buttons: {
      'add-role': '新增角色',
      'edit-role': '编辑角色',
      'delete-role': '删除角色'
    }
  }, {
    path: '/menus',
    title: '菜单权限',
    component: () => import('../views/examples/menus')
  }, {
    path: '/frame',
    title: 'iFrame',
    component: () => import('../views/examples/frame')
  }, {
    path: '/query-conditions',
    title: '查询条件',
    component: resolve => import('../views/examples/query-conditions')
  }, {
    path: '/address',
    title: '地址组件',
    component: resolve => import('../views/examples/address')
  }]
}
