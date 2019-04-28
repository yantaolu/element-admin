<template>
  <div class="tf-tabs-view">
    <div class="tf-tabs-bars" ref="tabs-bar" :class="{'scroll': nav_scroll}">
      <div v-show="nav_scroll" class="tf-tabs-nav-prev" @click="scrollToLeft">
        <i class="el-icon-arrow-left"></i>
      </div>
      <!--标签页标题栏-->
      <ul class="tf-tabs-bars-container" ref="tabs-bar-container" :style="{transform: `translateX(-${nav_transformX}px)`}">
        <!--标签页标题-->
        <li v-for="tab in tabs" class="tf-tab-bar" :class="{'bar-active': tab.name === value}" :key="tab.name"
            @click.stop="handleClick(tab)" @contextmenu.prevent="contextMenu(tab, $event)">
          <tf-icon v-if="tab.icon" :name='tab.icon'></tf-icon>
          <label>{{tab.title}}</label>
          <i v-if="tab.closable" class="el-icon-close" @click.stop="handleClose(tab)"></i>
        </li>
      </ul>
      <div v-show="nav_scroll" class="tf-tabs-nav-next" @click="scrollToRight">
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
    <div class="tf-tabs-contents">
      <slot></slot>
    </div>
    <transition name="tf-tabs-slide-fade">
      <div class="tabs-context-menu" v-show="showContextMenu" @mouseleave="showContextMenu = false" @click="showContextMenu = false"
           :style="{left: style_left, top: style_top}">
        <ul>
          <li @click.stop="refresh(currentTab)" :class="{disabled: !currentTab.component}">
            <tf-icon name="refresh"></tf-icon>
            <span>刷新</span>
          </li>
          <li @click="closeOthers(currentTab)">
            <tf-icon name="close"></tf-icon>
            <span>关闭其他</span>
          </li>
          <li @click="closeAll">
            <tf-icon name="delete"></tf-icon>
            <span>关闭所有</span>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import mouseWheelBind from '../../../src/utils/mouse-wheel'
import _ from 'lodash'
import TfIcon from '../../icon/src/icon'
import {addResizeListener, removeResizeListener} from 'element-ui/lib/utils/resize-event'

export default {
  name: 'private-tabs',
  components: {TfIcon},
  props: {
    home: String, // 首页tabName
    value: String // 当前页tabName
  },
  data () {
    return {
      tabs: [], // 所有标签页
      tabs_mounted: false, // 是否渲染完成
      nav_scroll: false, // 是否产生滚动
      nav_transformX: 0, // 水平位移
      showContextMenu: false, // 标签标题栏右键菜单
      style_left: 0,
      style_top: 0,
      currentTab: {}
    }
  },
  mounted () {
    this.tabs_mounted = true
    this._tabsBar() && mouseWheelBind(this._tabsBar(), _.throttle(this.onBarScroll, 150))
    addResizeListener(this.$el, this.updateTabBar)
  },
  beforeDestroy () {
    this.$el && this.updateTabBar && removeResizeListener(this.$el, this.updateTabBar)
  },
  watch: {
    value () {
      this.updateActive()
    }
  },
  methods: {
    _tabsBar () {
      return this.$refs['tabs-bar']
    },
    _tabsBarContainer () {
      return this.$refs['tabs-bar-container']
    },
    getTabs () {
      return this.$children.filter(item => item.$options.name === 'private-tab-pane')
    },
    updateNav () {
      this.tabs = this.getTabs()
      this.$nextTick(() => {
        this.updateTabBar()
      })
    },
    updateTabBar () {
      if (!this._tabsBar()) return // 页面销毁时
      const navWidth = this._tabsBar().offsetWidth
      const navScrollWidth = this._tabsBarContainer().offsetWidth
      this.nav_scroll = navWidth < navScrollWidth
      this.$nextTick(() => {
        // 动画完成后再计算
        setTimeout(this.scrollToActiveTab, 20)
      })
    },
    setOffset (value) {
      !isNaN(value) && (this.nav_transformX = parseInt(value))
    },
    scrollToActiveTab () {
      if (!this.nav_scroll) {
        this.setOffset(0)
        return
      }
      const nav = this._tabsBar()
      const navScroll = this._tabsBarContainer()
      const activeTab = navScroll.querySelector('li.bar-active')
      if (!activeTab) return

      const activeTabBounding = activeTab.getBoundingClientRect()
      const navScrollBounding = navScroll.getBoundingClientRect()
      const navBounding = nav.getBoundingClientRect()
      let newOffset
      // 最大可以接受的translateX
      let max = navScroll.offsetWidth - (nav.offsetWidth - 60) + 5
      // 如果活跃的标签位于右侧
      if (activeTabBounding.right > navBounding.right - 35) {
        newOffset = (activeTabBounding.right - navScrollBounding.left - (nav.offsetWidth - 60) + 5)
      } else if (activeTabBounding.left < navBounding.left) {
        newOffset = (activeTabBounding.left - navScrollBounding.left)
      } else if (navScrollBounding.right < navBounding.right - 30) {
        newOffset = max
      }
      newOffset !== undefined && this.setOffset(Math.min(newOffset, max))
    },
    onBarScroll (e) {
      if (!this.nav_scroll) return
      let diff = 0
      if (e.deltaX === 0) {
        diff = e.deltaY
      } else {
        diff = e.deltaX
      }
      if (diff < 0) {
        this.scrollToLeft(e, 150)
      } else {
        this.scrollToRight(e, 150)
      }
    },
    scrollToLeft (e, diff = 300) {
      const scroll = this.nav_transformX
      this.setOffset(Math.max(scroll - diff, 0))
    },
    scrollToRight (e, diff = 300) {
      const nav = this._tabsBar()
      const navScroll = this._tabsBarContainer()
      const max = navScroll.offsetWidth - (nav.offsetWidth - 60) + 5
      const scroll = this.nav_transformX
      this.setOffset(Math.min(scroll + diff, max))
    },
    updateActive () {
      if (!this.tabs_mounted) {
        return
      }
      this.updateTabBar()
    },
    // 右键菜单
    contextMenu (tab, event) {
      let react = this.$el.getBoundingClientRect()
      this.currentTab = tab
      this.style_left = (event.clientX - react.left - 5) + 'px'
      this.style_top = (event.clientY - react.top - 5) + 'px'
      this.showContextMenu = true
    },
    // 标签页标题点击
    handleClick (tab) {
      this.$emit('tabClick', tab.context)
    },
    // 标签页刷新
    refresh (tab) {
      if (!tab.component) {
        return
      }
      this.$emit('refresh', tab.context)
      this.showContextMenu = false
    },
    // 关闭标签页
    handleClose (tab) {
      this.$emit('close', tab.context)
    },
    // 关闭所有
    closeAll () {
      this.$emit('closeAll')
    },
    // 关闭其他
    closeOthers (tab) {
      this.$emit('closeOthers', tab.context)
    }
  }
}
</script>
