# 导航菜单

> 导航菜单使用了封装组件 <tf-nav-menu></tf-nav-menu> 实现，请参考 index.vue 中使用

```vue
<template>
  <tf-nav-menu :menus="menus" :collapse="collapse" @handleMenuSelect="handleMenuSelect"></tf-nav-menu>
</template>

<script>
import {menus} from '../routes'

// 在这里可以对菜单进行权限控制，例如这里需要去后台或者用户中获取相关的权限数据，然后进行匹配或者筛选，过滤掉没有权限的菜单
menus[0].children[2].hidden = true // 设置 hidden 属性为 true 则不渲染该菜单条目及其子菜单

export default {
  data () {
    return {
      menus,
      collapse: false
    }
  },
  methods: {
    handleMenuSelect (path, newTab) {
      
    }
  }
}
</script>
```

## Menu Props

|属性名|说明|类型|可选值|默认值|
|---|---|---|---|---|
|backgroundColor|导航菜单背景颜色|String|rgb值或者16进制色值|#495060|
|textColor|导航菜单文字颜色|String|rgb值或者16进制色值|#bcbcbc|
|activeTextColor|菜单选中状态文字颜色|String|rgb值或者16进制色值|#409EFF|
|menus|菜单数组|Array|菜单项|[]|
|collapse|水平折叠状态|Boolean|true/false|false|
|router|启用路由，会按照对应的path调用vue路由的push方法|Boolean|true/false|true|
|indexName|启用路由时，首页对应的路由name|String|-|index|

## Menu Attribute

|属性名|说明|类型|可选值|默认值|
|---|---|---|---|---|
|hidden|用于配置菜单项的权限，是否渲染菜单，可对menus进行递归遍历，然后配置对应的权限|Boolean|true/false|false
