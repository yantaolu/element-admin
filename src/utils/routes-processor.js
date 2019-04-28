// 组装路由路径，将父子路由路径进行统一处理，去除空路径，将有效路径转换为数组，便于菜单以及标签页属性的生成
const getValidPaths = (...paths) => {
  let valid = []
  paths.forEach(path => {
    if (!path) {
      return true
    }
    // eslint-disable-next-line
    valid.push(...path.replace(/^[\s\/]+/, '').replace(/[\s\/]+$/, '').split('/'))
  })
  return valid
}

export const getTabRoute = function (route = {}, indexComponent) {

}

export const getTabMenu = function (route = {}) {

}

export const getTabMenuTree = function (route = {}) {

}

const _routerHistories = []

// 标签路由路由解析扩展
export default function (rootRoutes, tabRoutes, indexComponent, parameters = []) {
  // 存储解析后的各种属性
  let {components, menus, menuTree} = {
    // 存储标签页将要加载的异步组件
    components: {},
    // 存储导航菜单
    menus: [],
    // 菜单树
    menuTree: {
      label: '全部菜单',
      path: '/*',
      children: []
    }
  }

  let _tabRoutes = []

  // 独立页面路由
  let _spaRoutes = []

  // 标签页首页所在的路由位置，后续的标签页路由都将增加在首页之前，因为路由匹配规则从前到后匹配
  const homeIndex = rootRoutes.findIndex(route => route.path === '/:tabCode?')
  const indexRoute = rootRoutes.find(route => route.path === '/:tabCode?')
  if (indexRoute) {
    indexComponent = indexRoute.component
  }

  /**
   * 路由解析（递归）
   * @param routes [Array] 路由
   * @param parent {Object} 父路由
   */
  const routesParser = (routes, parent) => {
    routes && routes.length && routes.forEach(route => {
      // 获取标准路径
      let pathArr = parent ? getValidPaths(parent.routePath, route.path) : getValidPaths(route.path)
      // 设置routePath属性用于递归计算
      route.routePath = `/${pathArr.join('/')}`

      // 生成对应菜单项以及完整菜单树
      let treeNode = {
        label: route.title,
        path: `/${pathArr.join('/')}`
      }
      route.order !== undefined && (treeNode.order = route.order)
      if (route.buttons && route.buttons instanceof Object) {
        treeNode.buttons = {}
        Object.keys(route.buttons).forEach(code => {
          treeNode.buttons[code] = {
            label: route.buttons[code],
            checked: false
          }
        })
        Object.defineProperty(treeNode, 'checkedButtons', {
          get () {
            let buttons = []
            Object.keys(treeNode.buttons).forEach(button => {
              treeNode.buttons[button].checked && buttons.push(button)
            })
            return buttons
          }
        })
      }
      let menuItem = {
        title: route.title,
        code: `${pathArr.join('/')}`
      }
      // 路由无对应的标签页且有子路由，则菜单需要创建子菜单
      if ((!route.component || route.showNodes) && route.children) {
        menuItem.children = []
        menuItem.event = !!route.component
      }
      // 无父路由则为一级导航
      if (!parent) {
        menuItem.icon = route.icon
        menuItem.order = route.order !== undefined ? route.order : 99999
        // 路由配置在菜单显示
        if (route.menu !== false) {
          menus.push(menuItem)
          // 设置menu引用，用于递归计算
          route.menu = menuItem
        }
        menuTree.children.push(treeNode)
      } else if (route.menu !== false) {
        parent.menu && parent.menu.children && parent.menu.children.push(menuItem)
        route.menu = menuItem
      }
      route.multi && (menuItem.multi = route.multi)

      route.treeNode = treeNode
      route.children && route.children.length && (treeNode.children = [])
      parent && parent.treeNode.children.push(treeNode)

      // 路由配置有对应组件时
      if (route.component) {
        const __tabCode = pathArr[pathArr.length - 1]
        components[`tab-${pathArr.join('-')}`] = {
          component: route.component,
          title: route.title,
          icon: route.icon,
          __tabCode
        }

        // 路由名称，因为路由path和params不能同时使用，所以这里需要生成唯一路由名称
        let routeName = [...pathArr.slice(0, -1)].join('-')
        let routePath = `/${[...pathArr.slice(0, -1), ':tabCode'].join('/')}`

        if (routePath !== '/:tabCode' && !_tabRoutes.find(item => item.path === routePath)) {
          _tabRoutes.unshift({
            path: routePath,
            name: routeName,
            component: indexComponent
          })
        }

        _spaRoutes.unshift({
          path: `/spa/${pathArr.join('/')}(-\\d+)?`,
          name: `${['spa', ...pathArr].join('-')}`,
          component: resolve => {
            resolve({
              template: `<div class="spa-mode-page"><component :is="component" tabCode="${__tabCode}" :query="query"></component></div>`,
              data () {
                return {
                  component: route.component,
                  encode: parseInt('jxj54hs0', 36)
                }
              },
              computed: {
                query () {
                  return this.$route.query
                },
                routePath () {
                  return this.$route.path
                }
              },
              updated () {
                this.updateLinks()
              },
              mounted () {
                this.updateLinks()
                const {path, query} = this.$route
                _routerHistories.push({path: path.substring(4), query})
              },
              methods: {
                getLinks () {
                  return Array.from(this.$el.querySelectorAll('a[href]')).filter(a => {
                    return new RegExp(`^${a.origin}`).test(a.baseURI) && !/(\/?#)?\/spa\//.test(a.href)
                  })
                },
                updateLinks () {
                  setTimeout(() => {
                    this.getLinks().forEach(a => {
                      const mode = this.$router.mode
                      const href = a.getAttribute('href')
                      if (!/^http/.test(href)) {
                        const path = `/spa${href.replace(/\/?#/, '')}`
                        const route = this.$router.options.routes.find(item => item.path !== '*' && new RegExp('^' + item.path).test(path))
                        if (route) {
                          a.onclick = (e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            if (this.routePath !== path) {
                              this.$router.push(path)
                            }
                          }
                          a.setAttribute('href', `${mode === 'hash' ? '#' : ''}${path}`)
                        }
                      }
                    })
                  }, 0)
                },
                openTab (path, query = {}) {
                  const params = {}
                  const routeQuery = this.$route.query
                  parameters.forEach(key => {
                    (typeof routeQuery[key] !== 'undefined' && routeQuery[key] !== '' && routeQuery[key] !== null) && (params[key] = routeQuery[key])
                  })
                  this.$router.push({
                    path: `/spa${path}`,
                    query: {
                      ...params,
                      ...query
                    }
                  })
                },
                open (path, query = {}) {
                  this.openTab(path, query)
                },
                close () {
                  const len = _routerHistories.length
                  if (len > 1) {
                    const {path, query} = _routerHistories[len - 2]
                    _routerHistories.splice(-2)
                    return this.open(path, query)
                  }
                  this.$router.back()
                },
                closeTo (path, query = {}) {
                  this.open(path, query)
                },
                setTitle () {
                },
                refresh () {
                  window.self.location.reload()
                }
              }
            })
          }
        })
      }
      // 递归
      routesParser(route.children, route)
    })
  }

  routesParser(tabRoutes)

  // 导航菜单按照order排序（仅一级菜单，子菜单需按照顺序自行配置）
  menus.sort((a, b) => a.order - b.order)
  // 菜单树排序
  menuTree.children.sort((a, b) => a.order - b.order)
  rootRoutes.splice(homeIndex, 0, ..._tabRoutes)
  rootRoutes.unshift(..._spaRoutes)
  return {components, menus, menuTree}
}
