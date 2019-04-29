<template>
  <div class="ea-integrated-page">
    <ea-query-condition v-if="conditions && conditions.length"
                        :conditions="conditions" :label-width="labelWidth" @query="handleQuery" :cols="conditionSize"
                        :auto-query="autoFetch"></ea-query-condition>
    <ea-table ref="private-table" :columns="privateColumns" :data="loadData" :loading="loading" :auto-load="false" :context="tableContext" flex>
      <div class="table-tool-bar" slot-scope="selection">
        <template v-for="bar in toolbars">
          <ea-button v-if="bar === 'add'" :key="bar"
                     type="primary" icon="el-icon-plus"
                     @click="addItem" :title="addTitle">{{extendButtons.add.text}}
          </ea-button>
          <ea-button v-if="bar === 'edit'" :key="bar"
                     type="primary" icon="el-icon-edit" :disabled="!selection.currentRow"
                     @click="editItem(selection)" :title="editTitle">{{extendButtons.edit.text}}
          </ea-button>
          <ea-button v-if="bar === 'delete'" :key="bar"
                     type="primary" icon="el-icon-delete" :disabled="deleteDisabled(selection)"
                     @click="deleteItems(selection)" :title="deleteTitle">{{extendButtons.delete.text}}
          </ea-button>
          <ea-button v-if="bar === 'view'" :key="bar"
                     type="primary" icon="el-icon-view" :disabled="!selection.currentRow"
                     @click="viewItem(selection)" :title="viewTitle">{{extendButtons.view.text}}
          </ea-button>
          <ea-button v-if="bar === 'refresh'" :key="bar"
                     type="primary" icon="el-icon-refresh"
                     @click="refresh" :title="refreshTitle">{{extendButtons.refresh.text}}
          </ea-button>
        </template>
      </div>
    </ea-table>
    <el-dialog class="form-dialog" :title="dialogTitle" :visible.sync="dialogFormVisible" :before-close="cancel">
      <el-form ref="private-form" :model="form" :rules="rules" :validate-on-rule-change="false" :disabled="mode === 'view'" label-width="100px">
        <el-form-item v-for="(item, index) in formItems" :key="item.name + index" :label="item.text" :prop="item.name">
          <!--textarea-->
          <el-input v-if="isType(item, 'textarea')" type="textarea" v-model="form[item.name]" :disabled="isDisable(item)"></el-input>
          <!--日期选择-->
          <el-date-picker v-else-if="isType(item, 'date')" :type="item.range ? 'daterange' : 'date'" v-model="form[item.name]" :disabled="isDisable(item)"></el-date-picker>
          <!--包含时间的日期-->
          <el-date-picker v-else-if="isType(item, 'datetime')" :type="item.range ? 'datetimerange' : 'datetime'" v-model="form[item.name]"
                          :disabled="isDisable(item)"></el-date-picker>
          <!--时间选择-->
          <el-time-picker v-else-if="isType(item, 'time')" :is-range="isRange(item)" v-model="form[item.name]" :disabled="isDisable(item)"></el-time-picker>
          <!--下拉框选择-->
          <el-select v-else-if="isType(item, 'select')" v-model="form[item.name]" :disabled="isDisable(item)">
            <el-option v-for="op in item.options" :key="getOptionValue(op)" :label="getOptionLabel(op)" :value="getOptionValue(op)"></el-option>
          </el-select>
          <!--单选框-->
          <el-radio-group v-else-if="isType(item, 'radio')" v-model="form[item.name]" :disabled="isDisable(item)">
            <el-radio v-for="op in item.options" :key="getOptionValue(op)" :label="getOptionValue(op)">{{getOptionLabel(op)}}</el-radio>
          </el-radio-group>
          <!--复选框-->
          <private-checkbox-group v-else-if="isType(item, 'checkbox')" :value="form[item.name]" :name="item.name" :options="item.options"
                                  @change="checklistChange" :disabled="isDisable(item)"></private-checkbox-group>
          <!--input输入框-->
          <el-input v-else v-model="form[item.name]" :disabled="isDisable(item)"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <template v-if="mode !== 'view'">
          <ea-button type="primary" @click="submit">确 定</ea-button>
          <ea-button @click="cancel">取 消</ea-button>
        </template>
        <template v-else>
          <ea-button @click="cancel">确 定</ea-button>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import EaTable from '../../table/index'
import EaQueryCondition from '../../query-conditions/index'
import EaButton from '../../button/index'
import PrivateCheckboxGroup from './private-checkbox-group'
import _$ from '../../../src/utils/common'
import {Input, Select, Option, RadioGroup, Radio, CheckboxGroup, Checkbox, DatePicker, TimePicker, Dialog, Form, FormItem} from 'element-ui'
import ValidateRules from '../../../src/utils/validate-rules'
import TypeCheck from '../../../src/utils/type-check'

const defaultButtons = {
  add: {
    text: '新 增',
    submit: ''
  },
  edit: {
    text: '编 辑',
    submit: ''
  },
  delete: {
    text: '删 除',
    key: 'id',
    submit: ''
  },
  view: {
    text: '查 看'
  },
  refresh: {
    text: '刷 新'
  }
}

export default {
  name: 'EaIntegratedPage',
  components: {
    EaTable,
    EaQueryCondition,
    EaButton,
    PrivateCheckboxGroup,
    ElInput: Input,
    ElSelect: Select,
    ElOption: Option,
    ElRadioGroup: RadioGroup,
    ElRadio: Radio,
    ElCheckboxGroup: CheckboxGroup,
    ElCheckbox: Checkbox,
    ElDatePicker: DatePicker,
    ElTimePicker: TimePicker,
    ElDialog: Dialog,
    ElForm: Form,
    ElFormItem: FormItem
  },
  props: {
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    fetchData: {
      type: Function,
      default: () => {
      }
    },
    conditions: {
      type: Array,
      default: () => []
    },
    conditionSize: Number,
    buttons: {
      type: Object,
      default: () => defaultButtons
    },
    toolbar: {
      type: String,
      default: 'add, edit, delete, view'
    },
    labelWidth: Number,
    autoFetch: {
      type: Boolean,
      default: true
    },
    fields: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    privateColumns () {
      return [{type: 'selection'}, ...this.columns]
    },
    privateConditions () {
      return []
    },
    toolbars () {
      return this.toolbar.split(/\s*,\s*/)
        .filter(bar => ['add', 'edit', 'delete', 'view', 'refresh'].findIndex(code => code === bar.toLowerCase()) !== -1)
        .map(bar => bar.toLowerCase())
    },
    extendButtons () {
      return {
        add: Object.assign({}, defaultButtons.add, this.buttons.add),
        edit: Object.assign({}, defaultButtons.edit, this.buttons.edit),
        delete: Object.assign({}, defaultButtons.delete, this.buttons.delete),
        view: Object.assign({}, defaultButtons.view, this.buttons.view),
        refresh: Object.assign({}, defaultButtons.refresh, this.buttons.refresh)
      }
    },
    dialogTitle () {
      return (this.mode && this.extendButtons[this.mode].text) || ''
    },
    formItems () {
      return this.fields
    },
    formRules () {
      let rules = {}
      this.fields.forEach(field => {
        rules[field.name] = field.rules || []
        if (field.required) {
          const prefix = ['date', 'datetime', 'time', 'checkbox', 'radio', 'select'].findIndex(type => type === field.type) >= 0 ? '请选择' : '请输入'
          rules[field.name].unshift(ValidateRules.required(`${prefix}${field.text}`, field.type === 'checkbox' ? 'change' : 'blur'))
        }
      })
      return rules
    },
    tableContext () {
      return this.$parent
    }
  },
  data () {
    return {
      params: {},
      loading: false,
      addTitle: '新增数据',
      editTitle: '点击选中单行后编辑',
      deleteTitle: '可选中多行进行批量删除',
      viewTitle: '点击选中单行后查看详情',
      refreshTitle: '刷新当前列表数据',
      dialogFormVisible: false,
      form: {},
      rules: {},
      mode: null
    }
  },
  watch: {
    mode (val) {
      if (val === 'view') {
        this.rules = {}
      } else {
        this.rules = this.formRules
      }
    }
  },
  mounted () {
    (!this.conditions || !this.conditions.length) && this.autoFetch && this.loadTable()
  },
  methods: {
    deleteDisabled (selection) {
      return !selection.selection || !selection.selection.length
    },
    handleQuery (params) {
      this.params = params
      this.loadTable()
    },
    loadTable () {
      this.$refs['private-table'].reload()
    },
    loadData ({setData, setTotal, page, size}) {
      const self = this
      this.loading = true
      this.$emit('fetch-data', {
        setData: function (data) {
          setData(data)
          setTimeout(() => {
            self.loading = false
          }, 300)
        },
        setTotal,
        params: self.params,
        page,
        size
      })
    },
    _showDialog (mode, form = {}) {
      this.mode = mode
      this.dialogFormVisible = true
      this.form = form
    },
    _resetFrom () {
      this.dialogFormVisible = false
      this.form = {}
      this.$refs['private-form'].resetFields()
    },
    addItem () {
      this._showDialog('add')
    },
    editItem ({currentRow}) {
      this._showDialog('edit', _$.deepClone(currentRow))
    },
    deleteItems ({selection}) {
      const keys = (selection && selection.map(row => row[this.extendButtons.delete.key]).filter(key => key !== undefined)) || []
      if (keys.length) {
        this.mode = 'delete'
        this.$confirm('是否要删除当前选中的数据？', '确认', {
          type: 'warning',
          confirmButtonText: '确定',
          showCancelButton: true
        }).then(() => {
          this.doSubmit(keys).then(() => {
            this.loadTable()
            this.$message.success('删除成功！')
          }).catch(e => {
            this.$message.error(`删除失败，请稍候重试 ${e}`)
          })
        }).catch(e => {
          // do nothing
        })
      }
    },
    viewItem ({currentRow}) {
      this._showDialog('view', _$.deepClone(currentRow))
    },
    refresh () {
      this.$refs['private-table'].refresh()
    },
    submit () {
      this.$refs['private-form'].validate((valid) => {
        if (valid) {
          this.doSubmit().then(() => {
            this._resetFrom()
            this.loadTable()
            this.$message.success('数据保存成功')
          }).catch(e => {
            this.$message.error(`保存失败，请重试 ${e}`)
          })
        }
      })
    },
    doSubmit (ids) {
      const self = this
      const transformData = () => {
        let data = {...self.form}
        Object.keys(data).forEach(key => {
          // 如果form表单中存在数组的数据，则将数组转换为以 "," 隔开的字符串，方便java后台解析
          TypeCheck.isArray(data[key]) && (data[key] = data[key].join(','))
        })
        return data
      }
      const submit = (action) => {
        if (TypeCheck.isString(action) && !ids) {
          return self.$ajax.post(action, transformData())
        } else if (TypeCheck.isFunction(action)) {
          // 增删改操作为用户自定义事件时，则传递相应的参数用户自行处理
          const result = action(ids || {...self.form})
          if (result instanceof Promise) {
            return result
          }
          return new Promise(resolve => resolve(result))
        } else if (ids) {
          // 指定删除操作的url，则执行post请求，参数为ids
          return self.$ajax.post(action, {ids: JSON.stringify(ids)})
        }
      }
      return new Promise((resolve, reject) => {
        submit(self.extendButtons[self.mode].submit).then(resolve).catch(e => {
          reject(e)
        })
      })
    },
    cancel (done) {
      if (this.mode === 'edit') {
        this.$confirm('是否取消保存？', '确认', {
          type: 'warning',
          confirmButtonText: '确定',
          showCancelButton: true
        }).then(() => {
          if (done) {
            done()
          }
          this._resetFrom()
        }).catch(() => {

        })
      } else {
        this._resetFrom()
      }
    },
    isType (item, type) {
      return item.type === type
    },
    isRange (item) {
      return item.range === true
    },
    isDisable (item) {
      return this.mode === 'edit' && item.edit === false
    },
    getOptionLabel (op) {
      if (!TypeCheck.isObject(op)) {
        return op
      }
      return op.label || op.value
    },
    getOptionValue (op) {
      if (!TypeCheck.isObject(op)) {
        return op
      }
      return op.value
    },
    checklistChange (name, value) {
      this.$set(this.form, name, value)
    }
  }
}
</script>
