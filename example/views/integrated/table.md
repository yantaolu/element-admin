## Table

> Table组件使用了ElementUI的Table、TableColumn及Pagination封装，包含分页功能，剔除了TableColumn组件，是一个具有分页功能的完整表格组件

> ElementUI表格列采用的是插槽的方式实现，这里废除这种方式，改为columns属性作为表格的列数据

```vue
<template>
  <div>
    <tf-button @click="queryData">查询列表</tf-button>
    <!--data属性支持数组和方法，如果是数组则列表以该数组为数据源显示，如果是方法则是table内部接口调用可以动态获取数据-->
    <tf-table ref="privete-table" :columns="columns" :data="fetchData"></tf-table>
  </div>
</template>

<script>
export default {
  name: 'table-demo',
  data () {
    return {
      // table的列
      columns: [],
      // table的查询参数，根据实际情况
      params: {}
    }
  },
  methods: {
    _table () {
      return this.$refs['privete-table']
    },
    // 按钮的查询事件，在事件里对参数组装
    queryData () {
      this.params = {
        name: '**'
      }
      this.$refs['privete-table'].reload()
    },
    // table的data接口，这里只能是table自己内部调用该接口
    // 参数page是当前页码，size是页面显示行数，prop是排序字段， order是排序方式， setData和setTotal是table的方法
    fetchData ({page, size, prop, order, setData, setTotal}) {
      // 这里可以自定义ajax的传参，例如后台的分页查询接口字段不一致，这里可以进行指定，还有列表的查询参数可以在这里合并
      this.$ajax.get('**', Object.assign({
        page,
        size,
        sort: '**'
      }, this.params)).then(d=>{
        // 设置table显示的数据
        setData(d.data)
        // 设置分页列表的总数
        setTotal(d.total)
      })
    },
    mounted () {
      // table的方法调用示例
      this._table().refresh()
    }
  }
}
</script>
```

## 全局defaults配置

```javascript
import {Table} from 'element-admin'

// 全部的配置项，属性值均为默认值
Table.defaults = {
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
  // 数据加载前置处理，主要针对设置 url 的方式
  beforeFetch: function (params) {
    return {...params, param1: 'xxxx', param2: 'yyyy'}
  },
  // 数据加载后置处理，主要针对设置 url 的方式
  afterFetch: function (result) {
    return {
      data: result.data,
      total: result.count
    }
  }
}

// 例如针对分页列表，后端接口统一使用 pageNumber 接收当前页码，使用 pageSize 接收每页的数据条数，则可以通过改变默认配置

Table.defaults.pageParam = 'pageNumber'
Table.defaults.sizeParam = 'pageSize'

// 通过上面的设置之后在，fetchData 接口的参数也会变成对应的字段
export default {
  methods: {
    fetchData ({pageNumber, pageSize, setData, setTotal, prop, order, params}) {
      this.$ajax.get('***', {pageNumber, pageSize}).then(d => {
        setData(d.data)
        setTotal(d.total)
      })
    }
  }
}

```

## Column Attribute

> columns 数组元素可拥有属性

|属性名|说明|类型|可选值|默认值|
|---|---|---|---|---|
|type|对应列的类型。如果设置了 selection 则显示多选框；如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮|String|selection/index/expand|-|
|index|如果设置了 type=index，可以通过传递 index 属性来自定义索引|String|Function(index)|-|-|
|columnKey|column 的 key，如果需要使用 filter-change 事件，则需要此属性标识是哪个 column 的筛选条件|String|-|-|
|label|显示的标题|String|-|-|
|prop|对应列内容的字段名，也可以使用 property 属性|String|-|-|
|width|对应列的宽度|String|-|-|
|minWidth|对应列的最小宽度，与 width 的区别是 width 是固定的，min-width 会把剩余宽度按比例分配给设置了 min-width 的列|String|-|-|
|fixed|列是否固定在左侧或者右侧，true 表示固定在左侧|String/Boolean|true/left/right|-|
|renderHeader|列标题 Label 区域渲染使用的 Function	|Function(h, { column, $index })|-|-|
|sortable|对应列是否可以排序，如果设置为 'custom'，则代表用户希望远程排序，需要监听 Table 的 sort-change 事件|Boolean/String|true/false/cunstom|false|
|sortMethod|	对数据进行排序的时候使用的方法，仅当 sortable 设置为 true 的时候有效，需返回一个数字，和 Array.sort 表现一致|Function(a, b)|-|-|
|sortBy|指定数据按照哪个属性进行排序，仅当 sortable 设置为 true 且没有设置 sort-method 的时候有效。如果 sort-by 为数组，则先按照第 1 个属性排序，如果第 1 个相等，再按照第 2 个排序，以此类推|String/Array/Function(row, index)|-|-|
|sortOrders|数据在排序时所使用排序策略的轮转顺序，仅当 sortable 为 true 时有效。需传入一个数组，随着用户点击表头，该列依次按照数组中元素的顺序进行排序|Array|数组中的元素需为以下三者之一：ascending 表示升序，descending 表示降序，null 表示还原为原始顺序|['ascending', 'descending', null]|
|resizable|对应列是否可以通过拖动改变宽度（需要在 tf-table 上设置 border 属性为真）|Boolean|true/false|true|
|formatter|用来格式化内容|Function(row, column, cellValue, index)|-|-|
|dateFormat|格式化时间戳|Boolean/String|true/yyyy-MM-dd HH:mm:ss|yyyy-MM-dd HH:mm|
|showOverflowTooltip|当内容过长被隐藏时显示 tooltip|Boolean|true/false|false|
|align|对齐方式|String|left/center/right|left|
|headerAlign|表头对齐方式，若不设置该项，则使用表格的对齐方式|String|left/center/right|left|
|className|列的 className|String|-|-|
|labelClassName|当前列标题的自定义类名|String|-|-|
|selectable|仅对 type=selection 的列有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选|Function(row, index)|-|-|
|reserveSelection|仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）|Boolean|true/false|false|
|filters|数据过滤的选项，数组格式，数组中的元素需要有 text 和 value 属性。|Array[{ text, value }]|-|-|
|filterPlacement|过滤弹出框的定位|String|与 Tooltip 的 placement 属性相同|-|
|filterMultiple|数据过滤的选项是否多选|Boolean|true/false|true|
|filterMethod|数据过滤使用的方法，如果是多选的筛选项，对每一条数据会执行多次，任意一次返回 true 就会显示。|Function(value, row, column)|-|-|
|filteredValue|选中的数据过滤项，如果需要自定义表头过滤的渲染方式，可能会需要此属性。|Array|-|-|
|renderCell|自定义单元格内容|Function(h, {row, column, $index})|-|-|
|columns|多级表头|Array|[Column]|-|-|
|defaultSort|默认排序列以及默认排序方式，同时设置多个则后面的覆盖前面的，只支持一列排序|String|ascending/descending|-|

## Table Props

|属性名|说明|类型|可选值|默认值|
|---|---|---|---|---|
|columns|列表列数据|Array|[Column]|[]|
|data|显示的数据或者获取数据的方法|Array/Function({page = 1, size = 20, prop/*排序字段*/, order/*排序方式asc / desc*/, setData, setTotal, params})|-|[]|
|params|列表查询参数，内部接口调用时候会传递该参数|Object|-|{}|
|autoLoad|当data设置为Function时，是否自动加载数据|Boolean|true/false|true|
|flex|是否使用flex布局，需要表格自适应的场景，父元素也需要使用flex布局|Boolean|true/false|false|
|height|Table 的高度，默认为自动高度。如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式。|String/Number|-|-|
|maxHeight|Table 的最大高度|String/Number|-|-|
|stripe|是否为斑马纹 table|Boolean|true/false|false|
|border|是否带有纵向边框|Boolean|true/false|true|
|size|Table 的尺寸|String|medium / small / mini|-|
|fit|列的宽度是否自撑开|Boolean|true/false|true|
|showHeader|是否显示表头|Boolean|-|true|
|headerContextMenu|是否使用表头右键默认事件|Boolean|-|false|
|highlightCurrentRow|是否要高亮当前行|Boolean|-|false|
|currentRowKey|当前行的 key，只写属性|String/Number|-|-|
|rowClassName|行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。|Function({row, rowIndex})/String|-|-|
|rowStyle|行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。|Function({row, rowIndex})/Object|-|-|
|cellClassName|单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className。|Function({row, column, rowIndex, columnIndex})/String|-|-|
|cellStyle|单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style。|Function({row, column, rowIndex, columnIndex})/Object|-|-|
|headerRowClassName|表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。|Function({row, rowIndex})/String|-|-|
|headerRowStyle|表头行的 style 的回调方法，也可以使用一个固定的 Object 为所有表头行设置一样的 Style。|Function({row, rowIndex})/Object|-|-|
|headerCellClassName|表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className。|Function({row, column, rowIndex, columnIndex})/String|-|-|
|headerCellStyle|表头单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style。|Function({row, column, rowIndex, columnIndex})/Object|-|-|
|rowKey|行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能的情况下，该属性是必填的。类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function。|Function(row)/String|-|-|
|emptyText|空数据时显示的文本内容|String|-|暂无数据|
|defaultExpandAll|是否默认展开所有行，当 Table 中存在 type="expand" 的 Column 的时候有效|Boolean|-|false|
|expandRowKeys|可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。|Array|-|-|
|defaultSort|默认的排序列的 prop 和顺序。它的prop属性指定默认的排序的列，order指定默认排序的顺序|Object|order: ascending, descending|如果只指定了prop, 没有指定order, 则默认顺序是ascending|
|tooltipEffect|tooltip effect 属性|String|dark/light|-|
|showSummary|是否在表尾显示合计行|Boolean|-|false|
|sumText|合计行第一列的文本|String|-|合计|
|summaryMethod|自定义的合计计算方法|Function({ columns, data })|-|-|
|spanMethod|合并行或列的计算方法|Function({ row, column, rowIndex, columnIndex })|-|-|
|selectOnIndeterminate|在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。若为 true，则选中所有行；若为 false，则取消选择所有行|Boolean|-|true|
|pagination|是否显示分页|Boolean|-|true|
|paginationLayout|分页组件布局，子组件名用逗号分隔|String|sizes, prev, pager, next, jumper, ->, total, slot|'total, prev, pager, next, jumper, sizes'|
|pageSizes|每页显示个数选择器的选项设置|Array|-|[10, 20, 50, 100, 200]|
|pageSize|每页显示条目个数|Number|pageSizes的任意元素|20|
|pagerCount|最多显示的页码数|Number|-|5|
|showLoading|数据加载时是否显示加载动画|Boolean|-|true|
|loading|加载动画|Boolean|-|false|
|config|table相关参数及前后置处理配置，用以覆盖全局 defaults 的配置，当某个table数据请求参数或者返回结果不同时，可以使用该配置|Object|参照Table.defaults|-|

## Table Methods

|方法名|说明|参数|
|---|---|---|
|clearSelection|用于多选表格，清空用户的选择|-|
|toggleRowSelection|用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）|row, selected|
|toggleRowExpansion|用于可展开表格，切换某一行的展开状态，如果使用了第二个参数，则是设置这一行展开与否（expanded 为 true 则展开）|row, expanded|
|setCurrentRow|用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态|row|
|clearSort|用于清空排序条件，数据会恢复成未排序的状态|-|
|clearFilter|用于清空过滤条件，数据会恢复成未过滤的状态|-|
|doLayout|对 Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法|-|
|sort|手动对 Table 进行排序。参数prop属性指定排序列，order指定排序顺序。|{prop: string, order: string}|
|setData|设置table显示的数据|Array|
|setTotal|设置数据总条数（分页列表）|Number|
|reload|重新加载数据，从第一页加载|-|
|refresh|刷新列表当前页|-|
|goTo|分页列表跳转至指定页|Number|


## Table Events

<a href="http://element-cn.eleme.io/#/zh-CN/component/table#table-events" target="_blank">请参照ElementUI</a>

## Table Slot

|name|说明|参数|
|---|---|---|
|-|插入在表头之上，可以在这里作为表格工具栏使用|{selection, currentRow, oldCurrentRow}|
|append|插入至表格最后一行之后的内容，如果需要对表格的内容进行无限滚动操作，可能需要用到这个 slot。若表格有合计行，该 slot 会位于合计行之上。|-|
