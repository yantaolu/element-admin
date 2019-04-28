<template>
  <el-menu-item :index="index">
    <div :style="style">
      <tf-icon :name="item.icon"></tf-icon>
      <span>{{item.title}}</span>
    </div>
    <tf-icon
      v-if="item.multi" class="add-tab-icon" name="plus" :color="textColor" :font-size="12"
      title="新开标签页" @click.native.stop="handleAddTab(item.code)"></tf-icon>
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
