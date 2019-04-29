<template>
  <i :class="className" :style="style"></i>
</template>

<script>
export default {
  name: 'EaIcon',
  props: {
    name: String,
    fontSize: Number,
    color: String
  },
  computed: {
    className () {
      if (/^fa-/.test(this.name)) {
        return 'ea-icon fa ' + this.name
      }
      return 'ea-icon el-icon-' + this.name
    },
    style () {
      return {
        fontSize: this.fontSize + 'px',
        color: this.color
      }
    }
  }
}
</script>
