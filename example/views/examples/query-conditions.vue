<template>
  <div>
    <ea-query-conditions :conditions="conditions" @query="handleQuery" @reset="handleReset"></ea-query-conditions>
    <div style="color: #555">
      <div style="font-size: 16px; margin: 10px 0; color: #333;">查询条件展示（值 类型）</div>
      <ul style="list-style: none; margin-left: 20px;">
        <li label=""><label>静态下拉：</label>{{params.select}} {{getType(params.select)}}</li>
        <li label=""><label>动态下拉：</label>{{params.dynamicSelect}} {{getType(params.dynamicSelect)}}</li>
        <li label=""><label>日期选择：</label>{{params.date}} {{getType(params.date)}}</li>
        <li label=""><label>日期范围：</label>{{JSON.stringify(params.dateRange || [])}} ( [{{getType(params.dateRange[0])}}, {{getType(params.dateRange[1])}}] )</li>
        <li label=""><label>开始日期：</label>{{params.start}} {{getType(params.start)}}</li>
        <li label=""><label>结束日期：</label>{{params.end}} {{getType(params.end)}}</li>
        <li label=""><label>动态建议：</label>{{params.dynamicSuggest}} {{getType(params.dynamicSuggest)}}</li>
        <li label=""><label>数字输入：</label>{{params.number}} {{getType(params.number)}}</li>
        <li label=""><label>普通文本：</label>{{params.input}} {{getType(params.input)}}</li>
        <li label=""><label>地址组件：</label>{{params.address}} {{getType(params.address)}}</li>
      </ul>
    </div>
    <div style="color: #555">
      <div style="font-size: 16px; margin: 10px 0; color: #333;">代码示例</div>
      <div style="margin-left: 20px;" class="markdown-body" v-html="code"></div>
    </div>
  </div>
</template>

<script>
import code from './query-conditions.md'
import TypeCheck from '../../../src/utils/type-check'
import ValidateRules from '../../../src/utils/validate-rules'

export default {
  name: 'query-condition-example',
  data () {
    return {
      code,
      params: {dateRange: []},
      test: '',
      options: []
    }
  },
  computed: {
    conditions () {
      return [
        {text: '静态下拉', name: 'select', type: 'select', default: this.test, options: [{value: 111, label: '---'}, 222, '333', ...this.options]},
        {
          text: '动态下拉',
          name: 'dynamicSelect',
          type: 'select',
          remote (keyword) {
            return Promise.resolve(['111', '222', '333', '444'].filter(item => item.includes(keyword)))
          }
        },
        {text: '日期选择', name: 'date', type: 'date', props: {valueFormat: 'yyyy-MM-dd'}},
        {text: '日期范围', name: 'dateRange', start: 'start', end: 'end', type: 'date', range: true, maxRange: '6m', required: true},
        {
          text: '动态建议',
          name: 'dynamicSuggest',
          type: 'input',
          remote (keyword) {
            return Promise.resolve([{value: `${keyword}@163.com`}, {value: `${keyword}@126.com`}, `${keyword}@100.com`, `${keyword}@199.com`])
          }
        },
        {text: '数字输入', name: 'number', type: 'number', props: {min: 1}},
        {text: '普通文本', name: 'input', type: 'input', default: '333', rules: ValidateRules.length(2, 5)},
        {text: '地址组件', type: 'address', name: 'address', fields: ['省', '市'], props: {level: 3}}
      ]
    }
  },
  methods: {
    handleQuery (params) {
      this.params = params
      // console.log(params)
    },
    handleReset (params) {
      this.params = params
    },
    getType (val) {
      if (typeof val !== 'undefined') {
        return `( ${TypeCheck.getType(val)} )`
      }
      return ''
    }
  }
}
</script>
