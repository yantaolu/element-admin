## Address

> 地址选择组件，支持地址层级（省、市、区、街道）自定义选择

> [地址选择组件实例](/examples/address)

```vue
<template>
  <div>
    <tf-address v-model="address" ref="address" placeholder="请选择省市区" :clearable="true" :params="params" @change="handleChange"></tf-address>
    <div style="margin-top: 10px;">绑定值： {{JSON.stringify(address)}}</div>
    <div style="margin-top: 10px;">输出结果（地址）： {{JSON.stringify($refs.address && $refs.address.getDetail(true))}}</div>
    <div style="margin-top: 10px;">输出结果（完整）： {{JSON.stringify($refs.address && $refs.address.getDetail())}}</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      address: [],
      // 根据实际情况传递参数，为jsonp请求数据接口附件的额外参数，例如dogy参数，请注意开发及测试环境
      params: {
        dog_ak: '2021596y0Tb790O0',
        dog_sk: 'K77MFVhwk348J4h72nHi',
        sourcecode: '01020307'
      }
    }
  },
  methods: {
    handleChange (value, {label, children}) {
      // value 组件绑定值
      //  label 组件绑定值对应的地址描述
      //  children 所选值得下级地址组合（最小级地址无下级地址）
    }
  }
}
</script>
```

## Address Props

|属性名|说明|类型|可选值|默认值|
|---|---|---|---|---|
|host|jsonp请求的域名，区分开发环境及测试环境|String|-|测试（判断条件为location.hostname !== 'v1.tf56.com'，业务方使用自行判断并设置）：'//partyopenapitest.tf56.com', 开发：'//partyopenapi.tf56.com'|
|urls|jsonp请求省、市、区、街道数据接口的url数组|Array|-|['/partyOpenApi/partyAddress/getProvince', '/partyOpenApi/partyAddress/getCity', '/partyOpenApi/partyAddress/getRegion', '/partyOpenApi/partyAddress/getStreet']|
|params|jsonp请求数据接口附加的参数，例如dogy参数，请根据实际情况包括环境类型传参|Object|-|{}|
|level|地址选择的最小级别，例如1级则只选到省，2级到市，以此类推，level <= urls.length && level >= 1|Number|-|4|
|-|基于Cascader组件实现，其他属性请参照http://element-cn.eleme.io/#/zh-CN/component/cascader#attributes|-|-|-|

## Address Events

|事件名|说明|参数|
|---|---|---|
|change|组件选择内容时触发change事件，function (value, {label, children}) {}|value为数组，值为组件的绑定值；label为数组，值为组件绑定值对应的地址描述；children为数组，值为所选级别地址下的子地址集，例如选2级市地址，则children为该市下面的所有区的集合|

## Address Methods

|方法名|说明|参数|
|---|---|---|
|getDetail|获取组件的详细数据|Boolean，可选参数，是否只获取地址描述|
|getChildren|获取组件所选地址的子地址集，最小级地址的子集为空|Array，可选参数，获取指定地址的子集，返回Promise|
