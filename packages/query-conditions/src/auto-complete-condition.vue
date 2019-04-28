<template>
  <el-autocomplete
    :placeholder="placeholder" :trigger-on-focus="false" v-on="$listeners" :value="value"
    :fetch-suggestions="fetchSuggestions" @keyup.enter.native.stop="handleQuery" v-bind="condition.props"></el-autocomplete>
</template>

<script>
import {Autocomplete} from 'element-ui'
import TypeCheck from '../../../src/utils/type-check'

export default {
  name: 'auto-complete-condition',
  components: {
    ElAutocomplete: Autocomplete
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    condition: Object,
    value: {},
    placeholder: String
  },
  methods: {
    fetchSuggestions (keyword, cb) {
      this.condition.remote(keyword).then(results => {
        cb(results.map(value => {
          if (TypeCheck.isObject(value)) {
            return value
          }
          return {value}
        }))
      })
    },
    handleQuery () {
      this.$emit('key-enter')
    }
  }
}
</script>
