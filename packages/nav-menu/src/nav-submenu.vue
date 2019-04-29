<template>
  <el-submenu :index="index">
    <div class="slot-title" :style="style" slot="title" @click="handleClick">
      <ea-icon :name="item.icon"></ea-icon>
      <span>{{item.title}}</span>
    </div>
    <template v-for="child in item.children">
      <nav-submenu
        v-if="child.hidden !== true && child.children && child.children.length"
        :key="child.code" :item="child" :index="child.code"
        :text-color="textColor" :active-text-color="activeTextColor" :menu="menu"
        @handleAddTab="handleAddTab" @sub-click="handleSubClick"></nav-submenu>
      <nav-menu-item
        v-else-if="child.hidden !== true"
        :item="child" :key="child.code" :index="child.code"
        :text-color="textColor" :active-text-color="activeTextColor" :menu="menu"
        @handleAddTab="handleAddTab"></nav-menu-item>
    </template>
  </el-submenu>
</template>

<script>
import NavMenuItem from './nav-menu-item'
import {Submenu} from 'element-ui'
import EaIcon from '../../icon/src/icon'

export default {
  name: 'nav-submenu',
  components: {ElSubmenu: Submenu, NavMenuItem, EaIcon},
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
    handleClick (event) {
      if (this.item.event) {
        event.stopPropagation()
        this.$emit('sub-click', this.item)
      }
    },
    handleSubClick (item) {
      this.$emit('sub-click', item)
    },
    handleAddTab (index) {
      this.$emit('handleAddTab', index)
    }
  }
}
</script>
