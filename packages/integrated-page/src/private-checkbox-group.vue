<template>
  <el-checkbox-group v-model="checklist" :disabled="disabled">
    <el-checkbox v-for="op in options" :key="getOptionValue(op)" :label="getOptionValue(op)">{{getOptionLabel(op)}}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
import {CheckboxGroup, Checkbox} from 'element-ui'
import TypeCheck from '../../../src/utils/type-check'

export default {
  name: 'private-checkbox-group',
  components: {
    ElCheckboxGroup: CheckboxGroup,
    ElCheckbox: Checkbox
  },
  props: {
    options: {
      type: Array,
      default: () => []
    },
    value: Array,
    name: String,
    disabled: Boolean
  },
  data () {
    return {
      checklist: []
    }
  },
  watch: {
    checklist (val) {
      this.$emit('change', this.name, val)
    }
  },
  methods: {
    getOptionLabel (op) {
      if (!TypeCheck.isObject(op)) {
        return op
      }
      return op.label || op.value
    },
    getOptionValue (op) {
      if (!TypeCheck.isObject(op)) {
        return op
      }
      return op.value
    }
  },
  mounted () {
  }
}
</script>
