<template>
  <ElButton
    :class="{'un-allowable': !allowable}"
    :size="size"
    :type="type"
    :plain="plain"
    :round="round"
    :circle="circle"
    :loading="loading"
    :disabled="disabled"
    :icon="icon"
    :autofocus="autofocus"
    :native-type="nativeType"
    @click="handleClick">
    <slot></slot>
  </ElButton>
</template>

<script>
import {Button} from 'element-ui'
import {validateAuthority} from '../../tabs-view/src/authorities'

const boolean = (value = false) => {
  return {
    type: Boolean,
    default: value
  }
}
export default {
  name: 'EaButton',
  components: {ElButton: Button},
  props: {
    size: String,
    type: String,
    plain: boolean(),
    round: boolean(),
    circle: boolean(),
    loading: boolean(),
    disabled: boolean(),
    icon: String,
    autofocus: boolean(),
    nativeType: {
      type: String,
      default: 'button'
    },
    authorityCode: String
  },
  data () {
    return {
      allowable: true
    }
  },
  mounted () {
    this.allowable = this.checkAllowAble()
  },
  methods: {
    checkAllowAble () {
      if (this.authorityCode) {
        return validateAuthority(this.$route.path, this.authorityCode)
      }
      return true
    },
    handleClick () {
      this.checkAllowAble() && this.$emit('click')
    }
  }
}
</script>
