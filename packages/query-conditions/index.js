import QueryCondition from './src/query-conditions'

QueryCondition.install = function (Vue) {
  Vue.component(QueryCondition.name, QueryCondition)
}

export default QueryCondition
