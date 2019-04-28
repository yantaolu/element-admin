<template>
  <!--标签页组件-->
  <private-tabs
    :value="tabsValue" :home="TAB_HOME_NAME"
    @closeOthers="handleCloseOthers"
    @closeAll="handleCloseAll"
    @close="handleClose"
    @tabClick="handleTabClick"
    @refresh="handleRefresh">
    <!--默认标签页首页-->
    <private-tab-pane
      v-if="home" :context="home" :closable="false" :indexRouteName="indexRouteName"
      @refresh="handleRefresh" @setTitle="handleSetTitle" @addRoute="addRoute">
      <component :is="home.component" :ref="TAB_HOME_NAME"></component>
    </private-tab-pane>
    <private-tab-pane
      v-else :context="{name: TAB_HOME_NAME, title: homeTitle, icon: homeIcon}" :closable="false" :indexRouteName="indexRouteName">
      <slot name="home"></slot>
    </private-tab-pane>
    <!--动态加载标签页-->
    <private-tab-pane
      v-for="tab in tabs" :key="tab.name" :context="tab" :indexRouteName="indexRouteName" :parameters="parameters"
      @updateTabsValue="updateTabsValue"
      @close="handleClose"
      @refresh="handleRefresh"
      @setTitle="handleSetTitle"
      @addRoute="addRoute">
      <!--Vue动态组件，详细说明请看官方文档-->
      <component :is="tab.component" :tabCode="tab.tabCode" :ref="tab.name" :query="tab.query"></component>
    </private-tab-pane>
  </private-tabs>
</template>

<script>
import PrivateTabs from './tabs'
import PrivateTabPane from './tab-pane'
import PrivateTabLoading from './tab-loading'
import PrivateTabError from './tab-error'
import {setAuthorities, getAuthority} from './authorities'

const TabHomeName = 'private-tab-home'
let tabComponents

export default {
  name: 'TfTabsView',
  components: {PrivateTabs, PrivateTabPane},
  props: {
    // 是否控制权限
    authority: {
      type: Boolean,
      default: false
    },
    // 拥有权限的路由路径
    authorities: Array,
    homeTitle: {
      type: String,
      default: '首页'
    },
    homeIcon: {
      type: String,
      default: 'fa-home'
    },
    indexRouteName: {
      type: String,
      default: 'index'
    },
    components: Object,
    parameters: {
      type: Array,
      default: () => []
    }
  },
  // 需要在实例化组件之前注册标签页组件，否则无法使用动态组件渲染
  registerComponents (components = {}) {
    tabComponents = components
    process.env.NODE_ENV !== 'production' && console.error(`Please use props 'components' instead of register components in 'TabsView'.`)
  },
  data () {
    return {
      TAB_HOME_NAME: TabHomeName,
      tabsValue: TabHomeName,
      tabs: [],
      tabsRoutes: {},
      sliderWidth: 200,
      collapse: false,
      privateComponents: {}
    }
  },
  computed: {
    home () {
      const obj = this.getComponentObj('tab-home')
      return obj.component ? Object.assign(obj, {name: TabHomeName}) : null
    }
  },
  methods: {
    // 响应路由变化，触发标签页
    handleRouteChange ({name, path, params, query}) {
      // 保存路由路径对应路由名称
      this.tabsRoutes[path] = name
      // 根据路由路径转换成标签页名称
      const code = path.substring(1).replace(/\//g, '-')
      let tabCode = code ? `tab-${code}` : TabHomeName
      // 判断是否存在相应的标签页，如果不存在，重定向到home页
      if (tabCode !== TabHomeName) {
        // 排除标签页多开的影响
        if (!this.getComponentObj(tabCode).component) {
          tabCode = tabCode.replace(/-[\d]+$/, '')
        }
      }
      // 当前标签页标记
      this.updateTabsValue(tabCode !== TabHomeName ? path : TabHomeName)

      // 用户权限控制
      let allowed = true
      if (tabCode !== TabHomeName && this.authority) {
        const authority = getAuthority(path)
        if (!authority) {
          allowed = false
        }
      }
      // 标签页不是首页且（没有打开过或者要求新开标签页）
      if (tabCode !== TabHomeName && (params.newTab || this.tabs.findIndex(tab => tab.name === path) === -1)) {
        this.appendTab({
          tabCode,
          path,
          query,
          allowed
        })
      } else { // 已经打开过的标签页，切换状态或者刷新
        const tab = this.findTab(path)
        // 判断是否需要刷新
        if (tab) {
          let refresh = Object.keys(query).length !== Object.keys(tab.query).length
          // 当请求的参数不相同时默认刷新标签页
          !refresh && Object.keys(query).forEach(key => {
            if (query[key] !== tab.query[key]) {
              refresh = true
            }
          })
          if (params.refresh || refresh) {
            tab.query = query
            this.handleRefresh(tab)
          } else {
            const $tabs = this.$children.filter(child => child.$options.name === 'private-tabs')[0]
            let $tab = $tabs.$children.filter(child => child.$options.name === 'private-tab-pane' && child.name === path)[0]
            $tab = $tab && $tab.$children && $tab.$children[0]
            // 不刷新时切换状态之后的回调
            if ($tab) {
              this.$nextTick(() => {
                $tab.$emit('tabShow')
                $tab.onTabShow && $tab.onTabShow()
              })
            }
          }
        } else if (tabCode === TabHomeName && params.refresh) {
          this.handleRefresh(this.home)
        } else if (tabCode === TabHomeName) {
          const $home = this.$refs[TabHomeName]
          // 不刷新时切换状态之后的回调
          if ($home) {
            this.$nextTick(() => {
              $home && $home.$emit('tabShow')
              $home && $home.onTabShow && $home.onTabShow()
            })
          }
        }
      }
    },
    updateTabsValue (val) {
      this.tabsValue = val
    },
    // 添加标签页
    appendTab ({path, tabCode, query, allowed}) {
      const self = this
      const {component, title, icon, __tabCode} = this.getComponentObj(tabCode)
      // 首先判断对应的标签页是否存在，不存在时显示404，紧接着判断用户权限，无权限时显示403，403和404页面用户可以自定义
      const _component = component ? (allowed ? component : {
        render (h) {
          return h(PrivateTabError, {props: {error: 403}}, self.$slots['403'] ? [h('template', {slot: 'tab-error-403'}, self.$slots['403'])] : [])
        }
      }) : {
        render (h) {
          return h(PrivateTabError, {props: {error: 404}}, self.$slots['404'] ? [h('template', {slot: 'tab-error-404'}, self.$slots['404'])] : [])
        }
      }
      this.plusTab(path, _component, title, icon, query, __tabCode)
    },
    plusTab (name, component, title, icon, query, tabCode) {
      this.tabs.push({component, name, icon, title, query, tabCode})
    },
    subtractTab (name) {
      const index = this.tabs.findIndex(tab => tab.name === name)
      this.tabs.splice(index, 1)
      return index
    },
    // 更新路由状态，由于路由处理中使用了params参数，所以只能通过name去更新路由，否则拿不到params中的tabCode
    pushRouterState ({name = this.indexRouteName, tabCode, refresh = true, query = {}}) {
      this.$router.push({
        name,
        query,
        params: {
          tabCode,
          refresh
        }
      })
    },
    // 从缓存中找到相关的标签页数据
    findTab (path) {
      return this.tabs.find(tab => tab.name === path)
    },
    updateRouterByTabName (name) {
      if (name === TabHomeName) {
        this.pushRouterState({name: this.indexRouteName, refresh: false})
        return
      }
      let routerName = this.tabsRoutes[name]
      let tabCode = name.substring(routerName.length + 2)
      if (routerName === this.indexRouteName) {
        tabCode = name.substring(1)
      }
      this.pushRouterState({name: routerName, tabCode, refresh: false, query: this.findTab(name).query})
    },
    // 标签页点击时触发
    handleTabClick ({name}) {
      this.updateRouterByTabName(name)
    },
    // 关闭标签页
    handleClose ({name}) {
      const index = this.subtractTab(name)
      setTimeout(() => {
        if (name === this.tabsValue) {
          if (index <= 0) {
            this.updateRouterByTabName(TabHomeName)
          } else {
            this.updateRouterByTabName(this.tabs[index - 1].name)
          }
        }
      }, 0)
    },
    handleCloseAll () {
      this.updateRouterByTabName(TabHomeName)
      this.tabs = []
    },
    handleCloseOthers (tab) {
      // 修复右键首页关闭其他bug
      if (!tab || !tab.name || tab.name === TabHomeName) {
        return this.handleCloseAll()
      }
      this.updateRouterByTabName(tab.name)
      this.tabs = [this.findTab(tab.name)]
    },
    // 刷新标签页
    handleRefresh (tab) {
      const component = tab.component
      const icon = tab.icon
      tab.component = PrivateTabLoading
      tab.icon = 'loading'
      // 刷新的标签页不是当前显示的标签页
      if (tab.name !== this.tabsValue) {
        this.updateRouterByTabName(tab.name)
      }
      this.$nextTick(() => {
        setTimeout(function () {
          tab.component = component
          tab.icon = icon
        }, 300)
      })
    },
    // 设置标签页标题
    handleSetTitle (tab, title) {
      tab.title = title
    },
    getComponents () {
      return this.components || tabComponents || {}
    },
    getComponentObj (tabCode) {
      const components = this.getComponents()
      return components[tabCode] || this.privateComponents[tabCode] || {title: '404'}
    },
    addRoute (path, {tabCode, component, title, icon}) {
      const index = this.$router.options.routes.find(route => route.name === this.indexRouteName)
      const indexComponent = index && index.component
      const name = path.replace(/\/?:tabCode$/, '').replace(/\//g, '-')
      if (!tabCode || !component) {
        return
      }
      // 保存标签页
      this.privateComponents[tabCode] = {component, title, icon}
      if (!indexComponent || !name) {
        return
      }
      // 增加路由
      this.$router.addRoutes([{
        path: `/${path}`,
        name,
        component: indexComponent
      }])
    }
  },
  watch: {
    /**
     * 路由更新时，需要更新标签页
     * @param route
     */
    $route (route) {
      this.handleRouteChange(route)
    },
    authorities (arr) {
      if (this.authority) {
        setAuthorities(arr)
      }
    }
  },
  created () {
    if (!this.components && !tabComponents) {
      throw new Error(`The 'TabsView' will not be able to work properly, please set props 'components'.`)
    }
    if (!this.getComponentObj('tab-home').component && !this.$slots.home) {
      throw new Error(`The 'TabsView' will not be able to work properly, please set 'tab-home' component or set 'home' slot.`)
    }
  },
  mounted () {
    if (this.authority) {
      setAuthorities(this.authorities)
    }
    this.handleRouteChange(this.$route)
  }
}
</script>
