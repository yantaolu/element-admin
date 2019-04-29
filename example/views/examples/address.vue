<template>
  <div>
    固定级别：<ea-address v-model="address" ref="address" placeholder="请选择省市区" :clearable="true" :params="params" @change="handleChange"></ea-address>
    <div style="margin-top: 10px;">绑定值： {{JSON.stringify(address)}}</div>
    <div style="margin-top: 10px;">输出结果（地址）： {{JSON.stringify($refs.address && $refs.address.getDetail(true))}}</div>
    <div style="margin-top: 10px;">输出结果（完整）： {{JSON.stringify($refs.address && $refs.address.getDetail())}}</div>
    <div style="padding: 10px 0"></div>
    任意级别：<ea-address v-model="address1" ref="address1" placeholder="请选择省市区" :clearable="true" :params="params" :change-on-select="true" @change="handleChange"></ea-address>
    <div style="margin-top: 10px;">绑定值： {{JSON.stringify(address1)}}</div>
    <div style="margin-top: 10px;">输出结果（地址）： {{JSON.stringify($refs.address1 && $refs.address1.getDetail(true))}}</div>
    <div style="margin-top: 10px;">输出结果（完整）： {{JSON.stringify($refs.address1 && $refs.address1.getDetail())}}</div>
  </div>
</template>

<script>

export default {
  props: ['tabCode'],
  data () {
    return {
      address: [],
      // address: ['110000', '110100', '110101'],
      address1: [],
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
      // console.log('Change Event:', value, label, children)
    }
  },
  mounted () {
    // console.log(this.tabCode)
  }
}
</script>
