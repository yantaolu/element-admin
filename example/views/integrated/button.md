## Button

> button 组件在原来的基础上增加了权限的扩展

## 权限控制方案（目前还未完全实现，思路如下）

> 在标签页中对需要控制权限的button设置相应的 authority-code 属性，路由中配置 buttons ，在权限设置时对相应的角色赋予按钮权限

> 按钮渲染时，根据路由及用户权限数据进行隐藏/disabled或者其他定制处理，使按钮的事件失效，从而达到控制权限的目的

```vue
<template>
  <tf-button @click="handleClick">按钮</tf-button>
</template>

<script>
export default {
  methods: {
    handleClick () {
      
    }
  }
}
</script>
```

## Button Props
|属性名|说明|类型|可选值|默认值|
|---|---|---|---|---|
|size|	尺寸	|String|	medium / small / mini|	—
|type|	类型	|String	|primary / success / warning / danger / info / text	|—
|plain	|是否朴素按钮|	Boolean	|—	|false|
|round|	是否圆角按钮	|Boolean	|—	|false|
|circle	|是否圆形按钮|	Boolean|	—	|false|
|loading|	是否加载中状态|	Boolean	|—	|false|
|disabled	|是否禁用状态	|Boolean|	—	|false|
|icon|	图标类名	|String	|—	|—|
|autofocus	|是否默认聚焦	|Boolean	|—|	false|
|native-type	|原生 type 属性|	String	|button / submit / reset|	button|
|authority-code|权限控制编码|String|-|-|
