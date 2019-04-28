## IntegratedPage

> 具备完整功能的单列表页面组件，包含列表查询条件、分页列表、简单结构数据的增、删、改、查功能集成（自定义后端接口）

> 通过传递简单的props即可开发完整功能的列表页，极大的节约了开发成本，甚至可以通过特定函数处理将配置json直接转换为列表页

[查看功能实例](/examples/roles)

1. vue组件方式实现

```vue
<template>
  <tf-integrated-page :columns="columns" :buttons="buttons" :conditions="conditions" :fields="fields" :condition-size="3" :label-width="100" @fetch-data="fetchData"></tf-integrated-page>
</template>

<script>
import {ValidateRules} from 'element-admin'

export default {
  data () {
    return {
      columns: [{
        type: 'index',
        label: '序号'
      }, {
        prop: 'roleId',
        label: '角色编号'
      }, {
        prop: 'roleName',
        label: '角色名称'
      }, {
        prop: 'memo',
        label: '备注'
      }],
      roles: [{
        roleId: 'admin',
        roleName: '系统管理员'
      }, {
        roleId: 'visitor',
        roleName: '访客'
      }],
      conditions: [{
        name: 'roleId',
        text: '管理员编号'
      }, {
        name: 'roleName',
        text: '管理员名称'
      }],
      buttons: {
        add: {
          text: '新增角色',
          submit: (role) => {
            return new Promise((resolve, reject) => {
              if (this.roles.findIndex(item => item.roleId === role.roleId) >= 0) {
                reject(new Error('该角色编号已经存在，不能重复'))
                return
              }
              this.roles.push(role)
              resolve()
            })
          }
        },
        edit: {
          text: '编辑角色',
          submit: (role) => {
            return new Promise((resolve, reject) => {
              let index = this.roles.findIndex(r => r.roleId === role.roleId)
              if (index >= 0) {
                this.roles.splice(index, 1, role)
                resolve()
              } else {
                reject(new Error('该角色不存在，不能更新'))
              }
            })
          }
        },
        delete: {
          text: '删除角色',
          submit: (ids) => {
            ids.forEach(id => {
              let index = this.roles.findIndex(role => role.roleId === id)
              index >= 0 && this.roles.splice(index, 1)
            })
          },
          key: 'roleId'
        },
        view: {
          text: '查看详情'
        }
      },
      fields: [
        {type: 'input', text: '角色编号', name: 'roleId', rules: [ValidateRules.required('请输入角色名称'), ValidateRules.length(4, 8)], edit: false},
        {type: 'input', text: '角色名称', name: 'roleName', required: true},
        {type: 'textarea', text: '备注', name: 'memo'}
      ]
    }
  },
  methods: {
    fetchData ({setData, setTotal, params}) {
      let data = [...this.roles]
      if (params.roleId) {
        data = data.filter(role => role.roleId === params.roleId)
      }
      if (params.roleName) {
        data = data.filter(role => role.roleName === params.roleName)
      }
      setData(data)
      setTotal(data.length)
    }
  }
}
</script>
```

2. 配置方式实现，可以像jQuery一样的使用方式生成组件

```javascript
import {ValidateRules, IntegratedPage} from 'element-admin'

const roles = [{
  roleId: 'admin',
  roleName: '系统管理员'
}, {
  roleId: 'visitor',
  roleName: '访客'
}]

export default IntegratedPage.loadConfig({
  // 列表列配置
  columns: [{
    type: 'index',
    label: '序号'
  }, {
    prop: 'roleId',
    label: '角色编号'
  }, {
    prop: 'roleName',
    label: '角色名称'
  }, {
    prop: 'memo',
    label: '备注'
  }],
  // 查询条件label宽度
  labelWidth: 100,
  // 列表查询条件配置
  conditions: [{
    name: 'roleId',
    text: '管理员编号'
  }, {
    name: 'roleName',
    text: '管理员名称'
  }],
  // 按钮自定义配置
  buttons: {
    add: {
      text: '新增角色',
      // submit可以自定义事件处理，也可以指定提交的url，组件内部进行post请求处理
      submit (role) {
        return new Promise((resolve, reject) => {
          if (roles.findIndex(item => item.roleId === role.roleId) >= 0) {
            reject(new Error('该角色编号已经存在，不能重复'))
            return
          }
          roles.push(role)
          resolve()
        })
      }
    },
    edit: {
      text: '编辑角色',
      // submit可以自定义事件处理，也可以指定提交的url，组件内部进行post请求处理
      submit (role) {
        return new Promise((resolve, reject) => {
          let index = roles.findIndex(r => r.roleId === role.roleId)
          if (index >= 0) {
            roles.splice(index, 1, role)
            resolve()
          } else {
            reject(new Error('该角色不存在，不能更新'))
          }
        })
      }
    },
    delete: {
      text: '删除角色',
      // submit可以自定义事件处理，也可以指定提交的url，组件内部进行post请求处理
      submit (ids) {
        ids.forEach(id => {
          let index = roles.findIndex(role => role.roleId === id)
          index >= 0 && roles.splice(index, 1)
        })
      },
      key: 'roleId'
    },
    view: {
      text: '查看详情'
    }
  },
  // 数据编辑字段配置
  fields: [
    {type: 'input', text: '角色编号', name: 'roleId', rules: [ValidateRules.required('请输入角色名称'), ValidateRules.length(4, 8)], edit: false},
    {type: 'input', text: '角色名称', name: 'roleName', required: true},
    // {type: 'checkbox', text: '权限类型', name: 'type', required: true, options: ['普通权限', '超级管理员权限'], edit: false},
    // {type: 'date', text: '有效期', name: 'date', required: true, rules: [ValidateRules.range(null, new Date(), 'date')], edit: false},
    // {type: 'time', text: '有效期', name: 'time', required: true, range: true, edit: false},
    // {type: 'datetime', text: '有效期', name: 'datetime', required: true, range: true, rules: [ValidateRules.dateRange(null, 2)], edit: false},
    {type: 'textarea', text: '备注', name: 'memo'}
  ],
  // 数据获取接口实现
  fetchData ({setData, setTotal, params, page, size}) {
    let data = [...roles]
    if (params.roleId) {
      data = data.filter(role => role.roleId === params.roleId)
    }
    if (params.roleName) {
      data = data.filter(role => role.roleName === params.roleName)
    }
    setData(data)
    setTotal(data.length)
  }
})
```

## IntegratedPage Props

|属性名|说明|类型|可选值|默认值|
|---|---|---|---|---|
|columns|列表页列表所展示的列|Array|-|[]|
|label-width|查询条件label所占的宽度|Number|-|80|
|conditions|列表页查询条件|Array|-|-|
|condition-size|查询条件总列数|Number|2-6|4|
|buttons|列表工具栏按钮（增、删、改、查、刷新）|Object|-|{add: {text: '新增'}, edit: {text: '编辑'}, view: {text: '查看'}, delete: {text: '删除'}, refresh: {text: '刷新'}}|
|toolbar|列表工具栏显示哪些按钮|String|add, edit, delete, view, refresh|'add, edit, delete, view'|
|auto-fetch|自动首次加载|Boolean|-|true|
|fields|新增及编辑的字段|Array|-|-|

## IntegratedPage Events

|事件名称|说明|回调参数|
|---|---|---|
|fetch-data|点击查询按钮或者列表加载数据的回调函数|{size, page, params, setData, setTotal}，params为查询时输入的条件，size为每页显示的条数，page为当前页码|

## Column Attribute

[参照Table Column Attribute](/integrated/table)

## Condition Attribute

[参照QueryCondition Condition Attribute](/integrated/query-conditions)

## Button Attribute

|属性名|说明|类型|可选值|默认值|
|---|---|---|---|---|
|text|按钮描述文字|String|-|-|
|submit|对应的按钮点击后的提交操作，当有异步操作时需要返回Promise，也可以指定提交的url地址，由组件内部发送post请求提交数据，针对删除操作提交的数据参数为 ids，格式为数组|Function/String|-|-|

## Field Attribute

|属性名|说明|类型|可选值|默认值|
|---|---|---|---|---|
|name|表单提交的name值|String|-|-|
|type|表单组件类型|String|input, checkbox, radio, select, date, time, datetime, textarea|input|
|text|表单label|String|-|-|
|required|表单提交必填校验，也可以在rules里添加required规则|Boolean|-|-|
|rules|表单提交时校验规则|Array|[常用校验规则](/utils/validate-rules)|-|
|options|针对checkbox、radio、select类型组件的选项，元素可以是包含{label, value}的对象，也可以是简单数据类型，则label和value相同|Array|-|-|
|range|针对date, time, datetime类型组件的附加项，设置为true时则是选择范围，得到的数据是一个包含起止时间的数组|Boolean|-|false|
|edit|在编辑数据时，是否可以改变该字段的数值|Boolean|-|true|
