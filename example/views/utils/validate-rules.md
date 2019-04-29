## Form表单验证（ValidateRules）

> ea-form 组件附加工具类，提供常用的表单校验功能

> <a href="http://element-cn.eleme.io/#/zh-CN/component/form#biao-dan-yan-zheng" target="_blank">表单验证示例</a>

```vue
<template>
  <ea-form v-model="form" :rules="rules">
    <ea-form-item label="必填" prop="required">
      <ea-input v-model="form.required"></ea-input>
    </ea-form-item>
    <ea-form-item label="字符串长度" prop="length">
      <ea-input v-model="form.length"></ea-input>
    </ea-form-item>
    <ea-form-item label="范围" prop="range">
      <ea-input v-model="form.range"></ea-input>
    </ea-form-item>
    <ea-form-item label="时间范围" prop="dateRange">
      <ea-input v-model="form.dateRange"></ea-input>
    </ea-form-item>
    <ea-form-item label="手机号码" prop="mobile">
      <ea-input v-model="form.mobile"></ea-input>
    </ea-form-item>
    <ea-form-item label="身份证" prop="peopleID">
      <ea-input v-model="form.peopleID"></ea-input>
    </ea-form-item>
    <ea-form-item label="车牌号" prop="carID">
      <ea-input v-model="form.carID"></ea-input>
    </ea-form-item>
    <ea-form-item label="邮箱地址" prop="email">
      <ea-input v-model="form.email"></ea-input>
    </ea-form-item>
    <ea-form-item label="url地址" prop="url">
      <ea-input v-model="form.url"></ea-input>
    </ea-form-item>
    <ea-form-item label="枚举值" prop="enum">
      <ea-input v-model="form.enum"></ea-input>
    </ea-form-item>
    <ea-form-item label="数字" prop="number">
      <ea-input v-model="form.number"></ea-input>
    </ea-form-item>
    <ea-form-item label="整数" prop="integer">
      <ea-input v-model="form.integer"></ea-input>
    </ea-form-item>
    <ea-form-item label="小数" prop="float">
      <ea-input v-model="form.float"></ea-input>
    </ea-form-item>
  </ea-form>
</template>

<script>
// 校验工具类
import {ValidateRules} from 'element-admin'

export default {
  data () {
    return {
      form: {},
      rules: {
        // 必填项校验
        required: [ValidateRules.required('请输入必填项')],
        
        // 长度上限和下限，上线和下限分别可设置为null，则表示只要满足一个限制，
        // 例如 ValidateRules.length(null, 10) 则表示10个字符以内
        length: [ValidateRules.length(0, 10)],
        
        // 范围检验，可只设置一个限制，另外也支持日期（日期选择组件）范围校验
        // 时间检验时参数可设置为整数，表示以当前日期为基准的间隔天数
        // 例如 ValidateRules.range(0, 10) 表示当前日期到未来10天的范围内
        range: [ValidateRules.range(0, 10)],
        
        // 日期范围校验，可只设置一个限制，另外支持（日期范围组件）范围检验，即起止日期范围同时校验，
        // 参数可设置为整数
        dateRange: [ValidateRules.dateRange(new Date(), new Date())],
        
        // 11位手机号码校验，仅13* - 19*号码段
        mobile: [ValidateRules.mobile()],
        
        // 身份证号码校验，15位或者18位（包含末尾带X的）
        peopleID: [ValidateRules.peopleID()],
        
        // 车牌号校验，支持新能源、教练车、警车、军队车等
        carID: [ValidateRules.carID()],
        
        // 邮箱地址校验，当不输入参数时，仅校验规则，输入参数时校验是否为参数内的邮箱地址
        email: [ValidateRules.email(['163.com', 'etransfar.com'])],
        
        // url地址校验，仅校验规则
        url: [ValidateRules.url()],
        
        // 枚举值校验，输入内容必须为参数中的任一个
        enum: [ValidateRules.enum(['www.baidu.com', 'www.google.com', 'www.yahoo.com'])],
        
        // 数字校验，整数及小数
        number: [ValidateRules.number()],
        
        // 整数校验
        integer: [ValidateRules.integer()],
        
        // 小数校验，有参数时则必须满足该参数位小数，无则不限制，例如必须是两位小数
        float: [ValidateRules.float(2)]
      }
    }
  }
}
</script>
```
