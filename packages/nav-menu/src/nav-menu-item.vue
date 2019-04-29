<template>
  <el-menu-item :index="index">
    <div :style="style">
      <ea-icon :name="item.icon"></ea-icon>
      <span>{{item.title}}</span>
    </div>
    <ea-icon
      v-if="item.multi" class="add-tab-icon" name="plus" :color="textColor" :font-size="12"
      title="新开标签页" @click.native.stop="handleAddTab(item.code)"></ea-icon>
  </el-menu-item>
</template>

<script>
import {MenuItem} from 'element-ui'

export default {
  name: 'nav-menu-item',
  components: {ElMenuItem: MenuItem},
  props: {
    index: String,
    item: Object,
    menu: String,
    textColor: String,
    activeTextColor: String
  },
  computed: {
    style () {
      if (this.menu === this.item.code) {
        return {color: this.activeTextColor}
      }
      return {color: this.textColor}
    }
  },
  methods: {
    handleAddTab (code) {
      this.$emit('handleAddTab', code)
    }
  }
}
</script>
