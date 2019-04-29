<script>
import {Table, TableColumn, Pagination, Checkbox, version} from 'element-ui'

const supportHeaderSlot = Number(version.replace(/\./g, '')) && Number(version.replace(/\./g, '')) > 249

const array = () => {
  return {
    type: Array,
    default: () => []
  }
}

const boolean = (val = true) => {
  return {
    type: Boolean,
    default: val
  }
}

const EaTable = {
  name: 'EaTable',
  components: {
    ElPagination: Pagination,
    ElCheckbox: Checkbox
  },
  render (h) {
    const _self = this
    let columns = []
    let defaultSort

    const createColumn = (column, key) => {
      let option = {
        props: {
          type: column.type,
          index: column.index,
          columnKey: column.columnKey,
          label: column.label,
          prop: column.prop,
          width: column.width,
          minWidth: column.minWidth,
          fixed: column.fixed,
          renderHeader: column.renderHeader ? column.renderHeader.bind(_self.renderContext) : column.renderHeader,
          sortable: column.sortable,
          sortMethod: column.sortMethod,
          sortBy: column.sortBy,
          sortOrders: column.sortOrders,
          resizable: column.resizable,
          formatter: column.formatter,
          showOverflowTooltip: column.showOverflowTooltip,
          align: column.align,
          headerAlign: column.headerAlign,
          className: column.className,
          labelClassName: column.labelClassName,
          selectable: column.selectable,
          reserveSelection: column.reserveSelection,
          filters: column.filters,
          filterPlacement: column.filterPlacement,
          filterMultiple: column.filterMultiple,
          filterMethod: column.filterMethod,
          filteredValue: column.filteredValue
        },
        scopedSlots: {},
        key
      }

      if (supportHeaderSlot) {
        delete option.props.renderHeader
      }

      if (column.defaultSort) {
        defaultSort = {prop: column.prop, order: column.defaultSort}
      }
      // 时间格式化
      const df = column.dateFormat
      if (df) {
        option.props.formatter = function (row, column) {
          const ms = row[column.property]
          // 没有值，返回空字符串
          if (!ms) {
            return ''
          }
          // 有自定义格式，则格式化相对应的格式
          if (typeof df === 'string') {
            return new Date(ms).format(df)
          }
          // 返回默认格式化数据
          return new Date(ms).format('yyyy-MM-dd HH:mm')
        }
      }

      if (column.columns) {
        let children = []
        column.columns.forEach((child, index) => {
          if (child.hidden) {
            return true
          }
          children.push(createColumn(child, `${key}-${child.prop || index}`))
        })
        return h(TableColumn, option, children)
      } else {
        // 分页列表定制index为累加
        if (column.type === 'index' && !column.index && _self.pagination) {
          Object.assign(option.scopedSlots, {
            default: props => {
              return (_self.currentPage - 1) * _self._getPageSize() + props.$index + 1
            }
          })
        }
        // 自定义单元格
        if (column.renderCell) {
          Object.assign(option.scopedSlots, {
            default: props => column.renderCell.call(_self.renderContext, h, props)
          })
        }
        // 自定义表头
        if (supportHeaderSlot && column.renderHeader) {
          Object.assign(option.scopedSlots, {
            header: props => column.renderHeader.call(_self.renderContext, h, props)
          })
        }
        return h(TableColumn, option)
      }
    }

    _self.columns.forEach((column, index) => {
      if (column.hidden) {
        return true
      }
      columns.push(createColumn(column, `ea-table-column-${column.prop || index}`))
    })

    // append 插槽
    if (_self.$slots.append || _self.$scopedSlots.append) {
      columns.push(h('template', {slot: 'append'}, [_self.$scopedSlots.append ? _self.$scopedSlots.append({
        selection: _self.selection,
        currentRow: _self.currentRow,
        oldCurrentRow: _self.oldCurrentRow
      }) : _self.$slots.append]))
    }

    let table = h(Table, {
      ref: 'elTable',
      class: {
        'el-table--fluid-height': _self.flex,
        'el-table--scrollable-y': _self.flex
      },
      props: {
        data: _self.tableData,
        height: _self.tableHeight,
        maxHeight: _self.maxHeight,
        stripe: _self.stripe,
        border: _self.border,
        size: _self.size,
        fit: _self.fit,
        showHeader: _self.showHeader,
        highlightCurrentRow: _self.highlightCurrentRow,
        currentRowKey: _self.currentRowKey,
        rowClassName: _self.rowClassName,
        rowStyle: _self.rowStyle,
        cellClassName: _self.cellClassName,
        cellStyle: _self.cellStyle,
        headerRowClassName: _self.headerRowClassName,
        headerRowStyle: _self.headerRowStyle,
        headerCellClassName: _self.headerCellClassName,
        headerCellStyle: _self.headerCellStyle,
        rowKey: _self.rowKey,
        emptyText: _self.emptyText,
        defaultExpandAll: _self.defaultExpandAll,
        expandRowKeys: _self.expandRowKeys,
        defaultSort: defaultSort || _self.defaultSort,
        tooltipEffect: _self.tooltipEffect,
        showSummary: _self.showSummary,
        sumText: _self.sumText,
        summaryMethod: _self.summaryMethod,
        spanMethod: _self.spanMethod,
        selectOnIndeterminate: _self.selectOnIndeterminate
      },
      on: {
        select: (selection, row) => {
          _self.$emit('select', selection, row)
        },
        'select-all': (selection) => {
          _self.$emit('select-all', selection)
        },
        'selection-change': (selection) => {
          _self.selection = selection
          _self.$emit('selection-change', selection)
        },
        'cell-mouse-enter': (row, column, cell, event) => {
          _self.$emit('cell-mouse-enter', row, column, cell, event)
        },
        'cell-mouse-leave': (row, column, cell, event) => {
          _self.$emit('cell-mouse-leave', row, column, cell, event)
        },
        'cell-click': (row, column, cell, event) => {
          _self.$emit('cell-click', row, column, cell, event)
        },
        'cell-dblclick': (row, column, cell, event) => {
          _self.$emit('cell-dblclick', row, column, cell, event)
        },
        'row-click': (row, event, column) => {
          _self.$emit('row-click', row, event, column)
        },
        'row-contextmenu': (row, event) => {
          _self.$emit('row-contextmenu', row, event)
        },
        'row-dblclick': (row, event) => {
          _self.$emit('row-dblclick', row, event)
        },
        'header-click': (column, event) => {
          _self.$emit('header-click', column, event)
        },
        'header-contextmenu': (column, event) => {
          if (_self.headerContextMenu) {
            let react = _self._table().$el.querySelector('div.el-table__header-wrapper').getBoundingClientRect()
            _self.showContextMenu = true
            clearTimeout(_self.$_setTimeoutId)
            _self.contextMenuStyle.top = (event.clientY - react.top - 5) + 'px'
            _self.contextMenuStyle.left = (event.clientX - react.left - 5) + 'px'
            _self.contextMenuStyle.opacity = 1
            event.preventDefault()
          } else {
            _self.$emit('header-contextmenu', column, event)
          }
        },
        'sort-change': ({column, prop, order}) => {
          _self.currentSort = prop ? {prop, order} : null
          // 针对自定义排序
          if (column && column.sortable === 'custom') {
            _self.refresh()
          }
          _self.$emit('sort-change', {column, prop, order})
        },
        'filter-change': (filters) => {
          _self.$emit('filter-change', filters)
        },
        'current-change': (currentRow, oldCurrentRow) => {
          _self.currentRow = currentRow
          _self.oldCurrentRow = oldCurrentRow
          _self.$emit('current-change', currentRow, oldCurrentRow)
        },
        'header-dragend': (newWidth, oldWidth, column, event) => {
          _self.$emit('header-dragend', newWidth, oldWidth, column, event)
        },
        'expand-change': (row, expandedRows) => {
          _self.$emit('expand-change', row, expandedRows)
        }
      }
    }, [...columns])

    const generateContextMenu = () => {
      let lis = []
      const generateLis = (columns) => {
        columns.forEach(column => {
          if (!column.columns) {
            !column.type && lis.push(column)
          } else {
            generateLis(column.columns)
          }
        })
      }
      generateLis(_self.columns)
      return (
        <div class="ea-table-header-context-menu" v-show={_self.showContextMenu} style={_self.contextMenuStyle}>
          <ul>
            {
              lis.map(li => (
                <li>
                  <el-checkbox name={li.prop} checked={li.hidden !== true} on-change={(value) => {
                    _self.toggleColumnShow(li.prop, value)
                  }}>{li.label}</el-checkbox>
                </li>
              ))
            }
          </ul>
        </div>
      )
    }

    return h('div', {
      'class': _self.flex ? 'ea-table ea-table-flex' : 'ea-table',
      on: {
        '!click': () => {
          _self.contextMenuStyle.opacity = 0
          _self.$_setTimeoutId = setTimeout(() => {
            _self.showContextMenu = false
          }, 500)
        },
        mouseleave: () => {
          _self.contextMenuStyle.opacity = 0
          _self.$_setTimeoutId = setTimeout(() => {
            _self.showContextMenu = false
          }, 500)
        }
      }
    }, [
      generateContextMenu(),
      _self.$scopedSlots.default ? _self.$scopedSlots.default({
        selection: _self.selection,
        currentRow: _self.currentRow,
        oldCurrentRow: _self.oldCurrentRow
      }) : _self.$slots.default,
      table,
      _self.pagination ? <div class="ea-pagination">
        <el-pagination
          ref="elPagination"
          background
          on-size-change={_self.handleSizeChange}
          on-current-change={_self.handlePageChange}
          current-page={_self.currentPage}
          page-sizes={_self.pageSizes}
          page-size={_self.pageSize}
          pager-count={_self.pagerCount}
          layout={_self.paginationLayout}
          total={_self.total}>
        </el-pagination>
      </div> : '',
      <transition name="el-fade-in-linear">
        <div class="ea-table-loading" v-show={_self.showLoading && _self.loading}>
          <i class="el-icon-loading"></i>
        </div>
      </transition>
    ])
  },
  props: {
    context: Object,
    columns: array(),
    data: {
      type: Array | Function,
      default: () => []
    },
    // 获取数据的 url
    url: String,
    // 使用 url 获取数据时的额外配置
    config: {
      type: Object,
      default: () => {
        return {}
      }
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    },
    autoLoad: boolean(),
    flex: boolean(false),
    height: String | Number,
    maxHeight: String | Number,
    stripe: boolean(false),
    border: boolean(),
    size: String,
    fit: boolean(),
    showHeader: boolean(),
    headerContextMenu: boolean(false),
    highlightCurrentRow: boolean(),
    currentRowKey: String | Number,
    rowClassName: Function | String,
    rowStyle: Function | Object,
    cellClassName: Function | String,
    cellStyle: Function | Object,
    headerRowClassName: Function | String,
    headerRowStyle: Function | Object,
    headerCellClassName: Function | String,
    headerCellStyle: Function | String,
    rowKey: Function | String,
    emptyText: String,
    defaultExpandAll: boolean(false),
    expandRowKeys: Array,
    defaultSort: Object,
    tooltipEffect: String,
    showSummary: boolean(false),
    sumText: String,
    summaryMethod: Function,
    spanMethod: Function,
    selectOnIndeterminate: boolean(),
    pagination: boolean(),
    paginationLayout: {
      type: String,
      default: 'total, prev, pager, next, jumper, sizes'
    },
    pageSizes: {
      type: Array,
      default () {
        return [10, 20, 50, 100, 200]
      }
    },
    pageSize: {
      type: Number,
      default: 20
    },
    pagerCount: {
      type: Number,
      default: 5
    },
    showLoading: boolean(),
    loading: boolean(false)
  },
  data () {
    return {
      tableData: [],
      total: 0,
      currentPageSize: 0,
      currentPage: 1,
      $_setTimeoutId: null,
      showContextMenu: false,
      contextMenuStyle: {
        top: 0,
        left: 0,
        opacity: 0
      },
      selection: null,
      currentRow: null,
      oldCurrentRow: null,
      prevSort: null,
      currentSort: null
    }
  },
  computed: {
    tableHeight () {
      return this.flex ? '200px' : this.height
    },
    columnIndexes () {
      let indexes = {}
      const setIndexes = (columns, pIndex) => {
        columns.forEach((column, index) => {
          if (column.type) {
            return true
          }
          if (column.columns) {
            setIndexes(column.columns, index)
          } else if (column.prop) {
            indexes[column.prop] = pIndex !== undefined ? `${pIndex}-${index}` : `${index}`
          }
        })
      }
      setIndexes(this.columns)
      return indexes
    },
    renderContext () {
      return this.context ? this.context : this.$parent
    }
  },
  watch: {
    data (val) {
      this.reload()
    }
  },
  methods: {
    _table () {
      return this.$refs.elTable
    },
    _pagination () {
      return this.$refs.elPagination
    },
    _initSelection () {
      this.selection = null
      this.currentRow = null
      this.oldCurrentRow = null
      this.$emit('selection-change', null)
      this.$emit('current-change', null, null)
    },
    _getPageSize () {
      return this.currentPageSize || this.pageSize
    },
    clearSelection () {
      this._table().clearSelection()
    },
    toggleRowSelection (row, selected) {
      this._table().toggleRowSelection(row, selected)
    },
    toggleRowExpansion (row, expanded) {
      this._table().toggleRowExpansion(row, expanded)
    },
    setCurrentRow (row) {
      this._table().setCurrentRow(row)
    },
    clearSort () {
      this._table().clearSort()
    },
    clearFilter () {
      this._table().clearFilter()
    },
    doLayout () {
      this._table().doLayout()
    },
    sort ({prop, order = 'ascending'}) {
      this._table().sort({prop, order})
    },
    setData (data = []) {
      if (Object.prototype.toString.call(data).toLowerCase() !== '[object array]') {
        throw new Error('The parameter of "setData" must be an array, bug got "' + (typeof data) + '".')
      }
      this.tableData = data
    },
    setTotal (total = 0) {
      const t = parseInt(total)
      if (isNaN(t)) {
        throw new Error(`Can not convert parameter of "setTotal" to a number.`)
      }
      this.total = t
    },
    toggleColumnShow (prop, show) {
      if (!prop) {
        return false
      } else if (show) {
        this.showColumn(prop)
      } else {
        this.hideColumn(prop)
      }
    },
    getColumnIndexes (prop) {
      let index = this.columnIndexes[prop]
      return index !== undefined ? index.split('-') : null
    },
    showColumn (prop) {
      let indexes = this.getColumnIndexes(prop)
      if (!indexes) {
        return
      }
      // 递归设置显示
      let column = Object.assign({}, this.columns[indexes[0]])
      let col
      let len = indexes.length
      for (let i = 1; i < len; i++) {
        if (!col) {
          col = column.columns[indexes[i]]
        } else {
          col = col.columns[indexes[i]]
        }
        col && (col.hidden = false)
      }
      column.hidden = false
      // 调用splice触发更新
      this.columns.splice(indexes[0], 1, column)
    },
    hideColumn (prop) {
      let indexes = this.getColumnIndexes(prop)
      if (!indexes) {
        return
      }
      // 找到对应的列，设置隐藏
      let column = indexes && Object.assign({}, this.columns[indexes[0]])
      let col
      let len = indexes.length
      let columns = [column]
      for (let i = 1; i < len; i++) {
        if (!col) {
          col = column.columns[indexes[i]]
          columns.push(column.columns[indexes[i]])
        } else {
          col = col.columns[indexes[i]]
          columns.push(col.columns[indexes[i]])
        }
      }
      col && (col.hidden = true)
      // 递归检测父列是否需要隐藏
      let colLen = columns.length
      if (colLen > 1) {
        for (let i = colLen - 2; i >= 0; i--) {
          let hidden = true
          columns[i].columns.forEach(col => {
            if (col.hidden !== true) {
              hidden = false
            }
          })
          columns[i].hidden = hidden
        }
      }
      column.hidden = true
      // 调用splice触发更新
      this.columns.splice(indexes[0], 1, column)
    },
    handleSizeChange (size) {
      this.currentPageSize = size
      this.reload()
    },
    handlePageChange (page) {
      this.currentPage = page
      this.refresh()
    },
    // 刷新，不改变页码
    refresh () {
      this._initSelection()
      if (this.url) {
        this._fetchData(this.url)
        return
      }
      if (this.data instanceof Array) {
        this._fillArray()
      } else if (this.data instanceof Function) {
        this._fetchData()
      }
    },
    // 填充静态数组数据
    _fillArray () {
      // 需要分页的情况
      if (this.pagination) {
        this.setTotal(this.data.length)
        let start = (this.currentPage - 1) * this._getPageSize()
        let end = Math.min(this.currentPage * this._getPageSize(), this.total)
        this.setData(this.data.slice(start, end))
      } else {
        this.setData(this.data)
      }
    },
    _getFetchParams () {
      const self = this
      const sort = this.currentSort || this._table().defaultSort
      let query = {}
      // 有排序的情况
      if (sort) {
        Object.assign(query, {
          [self.getConfigItem('orderParam')]: sort.prop,
          [self.getConfigItem('sequenceParam')]: self.getConfigItem(sort.order || 'ascending')
        })
      }
      // 分页的情况
      if (this.pagination) {
        Object.assign(query, {
          [self.getConfigItem('pageParam')]: self.currentPage,
          [self.getConfigItem('sizeParam')]: self._getPageSize()
        })
      }
      return query
    },
    // 调用数据接口获取数据
    _fetchData (url) {
      const self = this
      if (url) {
        let params = self.getConfigItem('beforeFetch')({
          ...self._getFetchParams(),
          ...self.params
        })
        if (!params) {
          throw new Error('The "beforeFetch" need a returned object.')
        }
        this.$ajax.get(url, params).then(result => {
          let d = self.getConfigItem('afterFetch')(result)
          if (!d) {
            throw new Error('The "afterFetch" need a returned object.')
          }
          self.setData(d.data)
          self.setTotal(d.total)
        }).catch(e => {
          this.$message.error(e.message)
        })
        return
      }
      this.data({...this._getFetchParams(), params: self.params, setData: self.setData, setTotal: self.setTotal})
    },
    reload () {
      this.currentPage = 1
      this.refresh()
    },
    goTo (page = 1) {
      if (!this.pagination) {
        throw new Error('Please set the prop "pagination" to true then call this function.')
      }
      if (page > 0 && page <= Math.max(1, Math.ceil(this.total / this._getPageSize()))) {
        this.currentPage = page
        this.refresh()
      }
    },
    getConfigItem (key) {
      return this.config[key] || EaTable.defaults[key]
    }
  },
  mounted () {
    if (this.autoLoad === false && this.data instanceof Function) {
      return
    }
    this.reload()
  },
  // 默认配置
  defaults: {
    // 排序参数字段
    orderParam: 'prop',
    // 排序方式参数字段
    sequenceParam: 'order',
    // 排序方式参数升序值
    ascending: 'asc',
    // 排序方式参数降序值
    descending: 'desc',
    // 分页页码参数字段
    pageParam: 'page',
    // 分页条数参数字段
    sizeParam: 'size',
    // 数据加载前置处理
    beforeFetch: function (params) {
      return params
    },
    // 数据加载后置处理
    afterFetch: function (result) {
      return result
    }
  }
}

export default EaTable
</script>
