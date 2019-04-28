# 路由配置

> 为了协同开发，路由建议一个一级菜单配置一个路由文件，放在 routes 目录下即可，以【开发指南】路由为例

> 这里所谓的路由，不单纯是路由的配置，包含了导航菜单的配置，开发者无需再单独的配置导航菜单

> element-admin里封装的函数 routesProcessor 会对配置的路由进行统一逻辑处理（可以参考做其他扩展或者逻辑处理），从而从路由配置中分离出
>
>> 【Vue 路由】（用于Vue路由控制）
>
>> 【导航菜单】（用于导航栏渲染）
>
>> 【菜单树结构】（用于扩展导航菜单权限控制）
>
>> 【动态标签页组件】（标签页TabsView的 components prop）

```javascript
export default {
  path: '/guide', // 路由路径
  title: '开发指南', // 导航菜单标题
  icon: 'fa-book', // 一级导航菜单图标
  order: 0, // 一级导航菜单排序，越小越靠前
  children: [{
    path: '/basic',
    title: '基本使用',
    component: () => import('../views/guide/basic') // 对应的标签页要显示的组件
  }, {
    path: '/route',
    title: '路由配置',
    component: () => import('../views/guide/route')
  }, {
    path: '/nav',
    title: '导航菜单',
    component: () => import('../views/guide/nav')
  }, {
    path: '/tabs',
    title: '标签页',
    component: () => import('../views/guide/tabs'),
    buttons: {
      'button-authority-code-1': '按钮描述1',
      'button-authority-code-2': '按钮描述2'
    }
  }]
}
```

## 路由项属性

|属性名|说明|类型|可选值|默认值|
|---|---|---|---|---|
|path|路由路径，子路由路径会和父路由路径进行拼接|String|-|-|
|title|导航菜单标题以及标签页标题（子路由对应有vue组件）|String|-|-|
|icon|配置在一级路由上则显示为一级导航菜单的图标，配置在二级路由及更小级路由时，导航菜单不显示，会显示为标签页标题图标|String|可以使用fontawesome图标|-|
|order|一级菜单显示的排序，数字越小越靠前，二级及更小级菜单以路由配置顺序为准|Number|-|-|
|menu|是否显示在导航菜单中，具有父子控制关系，如果父路由不显示在导航菜单中则所有子路由也不显示|Boolean|true/false|true|
|multi|该菜单是否要支持多个标签页同时存在，默认一个菜单只能打开一个对应的标签页，再次点击会刷新标签页|Boolean|true/false|false|
|children|配置子路由（子菜单）|Array|元素为路由实例|-|
|component|路由要加载的标签页组件，以异步方式加载，每个组件会独立打包，懒加载|VueComponent|-|-|
|buttons|该路由对应的标签页下需要控制权限的按钮数据，key值为按钮对应的authority-code，value值为按钮的描述信息|Object|-|-|

## 路由文件管理 / 加载原理，参照 routes/index.js

```javascript
// 使用require.context读取当前目录下以route.js命名的路由模块
const tabRoutes = (req => {
  let routes = req
    .keys()
    .map(key => req(key).default)
  return routes
  // eslint-disable-next-line
})(require.context('./', true, /\-route\.js$/))
```
