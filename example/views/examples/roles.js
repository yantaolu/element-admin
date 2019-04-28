import {ValidateRules, IntegratedPage} from 'tf'

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
    label: 'No.'
  }, {
    prop: 'roleId',
    label: '角色编号'
  }, {
    prop: 'roleName',
    label: '角色名称',
    renderHeader (h, {column}) {
      return column.label
    }
  }, {
    prop: 'memo',
    label: '备注'
  }],
  // 列表查询条件配置
  conditions: [{
    name: 'roleId',
    text: '角色编号'
  }, {
    name: 'roleName',
    text: '角色名称'
  }],
  // 查询条件label宽度
  labelWidth: 100,
  // 按钮自定义配置
  buttons: {
    add: {
      text: '新增角色',
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
    /*
    this.$ajax.get('xxxx', {page: 1, size: 20, roleId: '', roleName: ''}).then(d => {
      setData(d.data)
      setTotal(d.total)
    })
    */
    let data = [...roles]
    if (params.roleId) {
      data = data.filter(role => new RegExp(params.roleId).test(role.roleId))
    }
    if (params.roleName) {
      data = data.filter(role => new RegExp(params.roleName).test(role.roleName))
    }
    setData(data)
    setTotal(data.length)
  }
})
