import {routesProcessor} from 'tf'

// 使用require.context读取当前目录下以route.js命名的路由模块
const tabRoutes = (req => {
  let routes = req
    .keys()
    .map(key => req(key).default)
  return routes
  // eslint-disable-next-line
})(require.context('./', true, /\-route\.js$/))

// 原始路由配置，可以使用相应的方法将tabRoutes扩展进去
const rootRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login')
  }, {
    path: '/:tabCode?',
    name: 'index',
    component: () => import('../views/index')
  }, {
    path: '*',
    redirect: '/'
  }
]

let components
let menus
let menuTree

export {components, menus, menuTree}

export const getRoutes = () => {
  return new Promise((resolve, reject) => {
    resolve({})
  }).then(result => {
    // 处理后端返回路由数据
    // ... 合并路由数据到 tabRoutes ...
    // 处理标签页路由
    const obj = routesProcessor(rootRoutes, tabRoutes, () => import('../views/index'), ['sourceCode'])
    components = obj.components
    menus = obj.menus
    menuTree = obj.menuTree
    return rootRoutes
  })
}
