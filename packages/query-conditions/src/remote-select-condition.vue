<template>
  <tf-select
    :value="value" :placeholder="placeholder" v-bind="condition.props"
    filterable remote reserve-keyword
    :remote-method="remoteMethod" :loading="loading"
    @clear="handleClear" v-on="$listeners" clearable>
    <el-option v-for="(op, i) in options" :key="`${getOpValue(op)}-${i}`" :label="getOpLabel(op)" :value="getOpValue(op)"></el-option>
  </tf-select>
</template>

<script>
import {Select, Option} from 'element-ui'

export default {
  name: 'remote-select-condition',
  components: {
    ElSelect: Select,
    ElOption: Option
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      loading: false,
      options: []
    }
  },
  props: {
    condition: Object,
    value: {},
    placeholder: String,
    getOpValue: Function,
    getOpLabel: Function
  },
  methods: {
    remoteMethod (keyword) {
      this.loading = true
      this.condition.remote(keyword).then(options => {
        this.options = options
        this.loading = false
      }).catch(e => {
        this.options = []
        this.loading = false
      })
    },
    handleClear () {
      this.options = []
    }
  }
}
</script>
