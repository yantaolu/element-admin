<template>
  <i :class="className" :style="style"></i>
</template>

<script>
export default {
  name: 'TfIcon',
  props: {
    name: String,
    fontSize: Number,
    color: String
  },
  computed: {
    className () {
      if (/^fa-/.test(this.name)) {
        return 'tf-icon fa ' + this.name
      }
      return 'tf-icon el-icon-' + this.name
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
