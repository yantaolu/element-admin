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
        {text: '日期范围', name: 'dateRange', start: 'start', end: 'end', type: 'date', range: true, maxRange: '6m', required: true},
        {
          text: '动态建议',
          name: 'dynamicSuggest',
          type: 'input',
          remote (keyword) {
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
