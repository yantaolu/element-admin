## QueryConditions

> 为查询条件封装的布局组件，支持定义查询条件类型、默认值、表单校验规则等设置，开发者不在需要为查询条件繁琐的布局而烦恼，后期可以升级为列数自适应布局

> [查询条件实例](/examples/query-conditions)

```vue
<template>
  <ea-query-conditions :conditions="conditions" @query="handleQuery" @reset="handleReset"></ea-query-conditions>
</template>

<script>
export default {
  data () {
    return {
      conditions: [
        {text: '静态下拉', name: 'select', type: 'select', options: [{value: 111, label: '---'}, 222, '333']},
        {
          text: '动态下拉',
          name: 'dynamicSelect',
          type: 'select',
          remote (keyword) {
            return new Promise((resolve, reject) => {
              resolve(['111', '222', '333', '444'].filter(item => item.includes(keyword)))
            })
          }
        },
        {text: '日期选择', name: 'date', type: 'date', props: {valueFormat: 'yyyy-MM-dd'}},
        {text: '日期范围', name: 'dateRange', start: 'start', end: 'end', type: 'date', range: true, maxRange: '3m', required: true},
        {
          text: '动态建议',
          name: 'dynamicSuggest',
          type: 'input',
          remote: (keyword) => {
            return new Promise((resolve, reject) => {
              resolve([{value: `${keyword}@163.com`}, {value: `${keyword}@126.com`}, `${keyword}@100.com`, `${keyword}@199.com`])
            })
          }
        },
        {text: '数字输入', name: 'number', type: 'number', props: {min: 1}},
        {text: '普通文本', name: 'input', type: 'input', rules: ValidateRules.length(2, 5)},
        {text: '地址组件', name: 'address', type: 'address', props: {level: 3}}
      ]
    }
  },
  methods: {
    handleQuery (params) {
      console.log(params)
    },
    handleReset (params) {
      console.log(params)
    }
  }
}
</script>
```

> remote ajax返回Promise写法示例

```javascript
// ajax异步不推荐写法
return new Promise((resolve, reject) => {
  this.$ajax.get('xxx', {keyword}).then((result = []) => {
    let values = []
    result.forEach(item => {
      values.push({value: item.xxx})
    })
    resolve(values)
  })
})

// ajax异步推荐写法
return this.$ajax.get('xxx', {keyword}).then((result = []) => {
  return result.map(item => ({value: item.xxx}))
})
```


## Condition Attribute

> conditions 数组元素可拥有属性

|属性名|说明|类型|可选值|默认值|
|---|---|---|---|---|
|type|查询条件类型，date类型的查询条件，默认值为日期类型的数据，可以使用props属性设置value-format转化为字符串类型|String|date/input/select/number/address|input|
|options|当查询条件type为select时，非动态下拉列表，需要配置可选项|Array|-|-|
|text|查询条件前的label描述|String|-|-|
|name|查询条件对象的属性名，即key值|String|-|-|
|range|当查询条件类型为日期时，设置该属性为true则为日期范围|Boolean|-|false|
|maxRange|最大日期范围，可以设置年（y）、月（m）、周（w）、日（d），以数字+指定后缀作为属性值（例如JIRA工时），如果设置了props的valueFormat属性则不生效|String|例如 '1y' '2m' '3w' '4d'|-|
|start|当type为date且range为true时，可以设置额外的start字段接收日期范围开始时间|String|-|-|
|end|当type为date且range为true时，可以设置额外的end字段接收日期范围结束时间|String|-|-|
|dateType|当查询条件类型为日期时，日期类型选择，是否包含时间选择|String|date/datetime|date|
|rules|form表单校验规则，支持多条规则或者单条规则|Object/String|-|-|
|required|必填规则简写|Boolean|-|-|
|props|附加属性，例如 number 的范围  min，max 等，为组件的attributes属性，注意：如果日期使用了valueFormat属性，则设置默认值也需要格式化|Object|-|-|
|remote|动态下拉/搜索建议配置，参数为用户实时输入的关键字，需要返回Promise，resolve一个数组|Function(keyword) @return Promise|-|-|
|fields|当type为address时，定义接收各级地址参数的字段，跟地址组件数据同级，省、市、区、街道...|Array|-|-|

## QueryCondition Props

|属性名|说明|类型|可选值|默认值|
|---|---|---|---|---|
|conditions|查询条件数组|Array|-|-|
|label-width|查询条件label所占宽度|Number|-|120|
|search-text|查询按钮的描述文字|String|-|查询|
|reset-text|重置按钮的描述文字|String|-|重置|
|auto-query|自动触发首次查询|Boolean|-|true|
|show-reset|展示重置按钮|Boolean|-|true|

## QueryCondition Events

|事件名|说明|参数|
|---|---|---|
|query|点击查询按钮触发的事件，参数为查询条件对象|Object|
|reset|点击重置按钮触发的事件，参数为查询条件对象|Object|
