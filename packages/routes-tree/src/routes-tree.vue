<template>
  <div class="tf-routes-tree">
    <slot></slot>
    <tf-tree ref="routes-tree"
             @check="handleCheck"
             @check-change="handleCheckChange"
             :data="[menuTree]"
             show-checkbox
             :node-key="nodeKey"
             :default-expand-all="defaultExpandAll"
             :default-expanded-keys="defaultExpandedKeys"
             :check-strictly="false"
             :props="props"
             :default-checked-keys="defaultCheckedKeys">
      <div class="custom-tree-node" slot-scope="{node, data}">
        <span>{{node.label}}</span>
        <ul v-if="data.buttons" class="button-items">
          <li v-for="code in Object.keys(data.buttons)" :key="code">
            <tf-checkbox class="authority-button" v-model="data.buttons[code].checked">
              <span style="color: #999999">【按钮】</span>{{data.buttons[code].label}}
            </tf-checkbox>
          </li>
        </ul>
      </div>
    </tf-tree>
  </div>
</template>

<script>
import {Tree} from 'element-ui'

export default {
  name: 'TfRoutesTree',
  components: {Tree},
  props: {
    menuTree: {
      type: Object,
      default () {
        return {
          label: '全部菜单',
          path: '/*'
        }
      }
    },
    nodeKey: {
      type: String,
      default: 'path'
    },
    props: {
      type: Object,
      default () {
        return {
          children: 'children',
          label: 'label'
        }
      }
    },
    defaultExpandAll: {
      type: Boolean,
      default: true
    },
    defaultExpandedKeys: {
      type: Array,
      default: () => []
    },
    defaultCheckedKeys: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {}
  },
  computed: {},
  methods: {
    _tree () {
      return this.$refs['routes-tree']
    },
    handleCheck () {
      console.log(this.getCheckedNodes())
    },
    handleCheckChange (data, checked) {
      if (!checked && data.buttons) {
        Object.keys(data.buttons).forEach(button => {
          this.$set(data.buttons[button], 'checked', false)
        })
      }
    },
    getCheckedNodes () {
      return this._tree().getCheckedNodes().filter(node => !node.children)
    },
    buttonChange (data, code, val) {
      let index = data.checkedButtons.findIndex(button => button === code)
      if (val && index === -1) {
        data.checkedButtons.push(code)
      } else if (!val && index >= 0) {
        data.checkedButtons.splice(index, 1)
      }
    }
  }
}
</script>
