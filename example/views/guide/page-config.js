export default {
  title: '',
  fields: [],
  columns: [{
    prop: 'code',
    label: 'sssss'
  }],
  conditions: [
    {type: 'date', text: '创建日期', range: true, name: 'date', dateType: 'datetime'},
    {
      type: 'select',
      text: '订单类型',
      name: 'type',
      options: [
        {value: 'ssss', label: 'SSSS'}
      ]
      // remote: 'remote'
    },
    {type: 'input', text: '订单编号', name: 'number1'},
    {type: 'input', text: '人员编号', name: 'number2'},
    {type: 'input', text: '车牌号', name: 'number3'},
    {type: 'input', text: '运单号', name: 'number7', remote: 'remote'}
  ],
  buttons: []
}
