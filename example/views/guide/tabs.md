# 标签页

> 标签页使用了自定义组件（非全局组件）实现，请参考 index.vue 中使用，内部监听路由的变化，去渲染对应的标签页组件

> 标签页首页有两种使用方式：
>
>> 标签页组件中定义了 'tab-home' 的相关信息；
>
>> 使用插槽 slot='home'，同时存在时，优先使用第一种方式；

- 首页使用组件的方式（【首页】标题栏支持右键菜单刷新）

```vue
<template>
  <tabs-view :components="components">
    <template slot="404">您访问的页面不存在</template>
  </tabs-view>
</template>

<script>
import TabHome from './home'
// 非全局组件，需要局部引入并进行组件组册
import {TabsView} from 'element-admin'
// 在路由处理中组合的标签页组件相关数据
import {components} from '../routes'
// 注意该使用方法务必保证组件中有tab-home的组件信息
components['tab-home'] = {
  component: TabHome,
  title: '首页',
  icon: 'fa-home'
}

export default {
  components: {TabsView}, // 局部组件注册
  data () {
    return {
      components
    }
  }
}
</script>
```

- 首页使用插槽的方式（【首页】标题栏不支持右键菜单刷新）

```vue
<template>
  <tabs-view :components="components">
    <tab-home slot="home"></tab-home>
  </tabs-view>
</template>

<script>
import TabHome from './home'
// 非全局组件，需要局部引入并进行标签页组件组册
import {TabsView} from 'element-admin'
// 在路由处理中组合的标签页组件相关数据
import {components} from '../routes'

export default {
  components: {TabsView, TabHome}, // 局部组件注册
  data () {
    return {
      components
    }
  }
}
</script>
```

## TabsView Props

|属性名|说明|类型|可选值|默认值|
|---|---|---|---|---|
|authority|是否控制显示权限，当用户无访问权限时显示403页面，该属性为true时 authorities 配置才生效|Boolean|-|false|
|authorities|登陆用户拥有权限的路由数据，包含路由对应的标签页下的按钮权限 [{path: '***', buttons: ['authority-code', ...]}, ...]|Array|-|-|
|homeTitle|使用插槽的方式定义首页时，首先的标签标题|String|-|'首页'|
|homeIcon|使用插槽的方式定义首页时，首先的标签icon|String|-|'fa-home'|
|indexRouteName|TabsView所在的页面对应的路由名称|String|-|'index'|
|components|标签页要加载的动态组件数据，对象的key值为标签页name，默认以`tab${this.$route.path.repalce(/\//g, '')}`命名，属性值包含{component, title, icon}|Object|-|-|

## TabsView Slot

|name|说明|参数|
|---|---|---|
|home|标签页首页内容，推荐使用components['tab-home']|-|
|403|无权限的标签页展示内容|-|
|404|不存在的标签页展示内容|-|

## 常用标签页操作

1. 设置标签页的标题

```vue
<script>
export default {
  methods: {
    setTitle (title) {
      this.$parent.setTitle(title)
    }
  }
}
</script>
```

2. 打开 / 刷新其他标签页

```vue
<script>
export default {
  methods: {
    openTab (path, query = {}, refresh = true) {
      // path 为路由的路径，query为查询参数，refresh是否刷新该标签页，默认刷新，方法内部对参数进行的对比，如果已经打开的标签页参数和新参数不同也会刷新
      this.$parent.openTab(path, query, refresh)
    }
  }
}
</script>
```

3. 切换标签页时，没有被刷新的标签页显示后需要做特定操作（例如标签页中含有列表时，隐藏再显示会使列表的布局发生变化，这时需要调整列表的布局），两种方式任选其一，注意当标签页刷新或者新开的标签页显示时不会执行回调

```vue
<template>
  <tf-table ref="table" :columns="[]" data="[]"></tf-table>
</template>

<script>
export default {
  mounted () {
    // 第一种方式，在mounted里注册tabShow事件的回调，回调中处理列表的布局
    this.$on('tabShow', function () {
      this.$refs['table'].doLayout()
    })
  },
  methods: {
    // 第二种方式，在methods里定义onTabShow方法，作为标签页显示后的回调
    onTabShow () {
      this.$refs['table'].doLayout()
    }
  }
}
</script>
```

4. 关闭当前标签页

```vue
<script>
export default {
  methods: {
    closeSelf () {
      this.$parent.close()
    }
  }
}
</script>
```

5. 关闭当前标签页并跳转至指定标签页

```vue
<script>
export default {
  methods: {
    closeTo (path = '/', query = {}, ops = {}) {
      this.$parent.closeTo(path, query, ops)
    }
  }
}
</script>
```

6. 增加临时路由，增加后可以使用路由api、router-link以及openTab打开临时的路由，不支持页面刷新

```vue
<script>
export default {
  methods: {
    addRoute (path = '/') {
      this.$parent.addRoute(path, {
        component, // 需要临时加载的标签页组件
        title: '', // 标签页标题
        icon: '' // 标签页icon
      })
    }
  }
}
</script>
```
