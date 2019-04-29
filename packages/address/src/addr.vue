<template>
  <el-cascader
    :options="options"
    @active-item-change="handleItemChange"
    :props="props"
    :value="calcVal"
    @change="$emit('change', $event)"
    v-bind="$attrs"
  ></el-cascader>
</template>

<script>
import {Cascader} from 'element-ui'

const urls = [
  '/partyOpenApi/partyAddress/getProvince',
  '/partyOpenApi/partyAddress/getCity',
  '/partyOpenApi/partyAddress/getRegion',
  '/partyOpenApi/partyAddress/getStreet'
]

const isOnline = location.href.indexOf('test.tf56.com') === -1

let prefix = 'https://partyopenapitest.tf56.com'

if (isOnline) {
  prefix = 'https://partyopenapi.tf56.com'
}

export default {
  name: 'EaAddr',
  components: {'el-cascader': Cascader},

  model: {
    prop: 'value',
    event: 'change'
  },

  props: ['value', 'urls', 'params', 'prefix'],

  data () {
    return {
      options: [],
      props: {
        value: 'districtCode',
        label: 'fullName'
      },
      indexs: [], // 记录省,市, 区, 县的点击位置
      isFirst: true
    }
  },

  computed: {
    remoteUrls () {
      let pre = this.prefix || prefix
      let reg = /^(http(s)?:)?\/\//

      return (this.urls || urls).map(v => {
        if (!reg.test(v)) {
          return pre + v
        }
        return v
      })
    },
    calcVal () {
      if (this.isFirst) return
      this.fetchData(this.value)
      return this.value
    }
  },

  methods: {
    // 取得包含val和label的数组对象
    getDetail (isOnlyLabel) {
      let arr = []
      let len = this.value.length
      var data = {children: this.options}

      for (let i = 0; i < len; i++) {
        if (data && data.children) {
          data = data.children[this.indexs[i]]

          arr.push(isOnlyLabel ? data.fullName : {value: data.districtCode, label: data.fullName})
        }
      }

      return arr
    },
    // 从远程获取数据
    fetchData (val) {
      if (!val.length) return

      let arr = []

      for (let i = 0; i < val.length; i++) {
        arr.push(this.fetchLevelData(val.slice(0, i + 1)))
      }

      Promise.all(arr).then((rest) => {
        let data = rest[0].data

        // 拼接数据
        for (let i = 0; i < rest.length; i++) {
          let item = rest[i]

          if (item.index > -1) {
            this.indexs[i] = item.index
            data = data[item.index].children
          } else {
            let index = item.data.findIndex(v => v.districtCode === val[i])

            if (index > -1) {
              this.indexs[i] = index

              if (i === 0) {
                data = data[index].children
                continue
              }
              data.push(...item.data)
              data = data[index].children
            }
          }
        }
      })
    },
    // 从远程获取当前层级数据
    fetchLevelData (val) {
      let len = val.length
      let data = this.options
      let needFetch = false
      let pos = 0

      for (let i = 0; i < len; i++) {
        pos = data.findIndex(v => v.districtCode === val[i])

        if (pos === -1) {
          needFetch = true
          break
        }

        if (i < len - 1) { // 不是当前最后一项
          data = data[pos].children || []
        }
      }

      if (needFetch) {
        return this.$ajax.jsonp(this.remoteUrls[len - 1], {keywords: val[len - 2], ...this.params})
          .then(({data}) => {
            data = data.map(v => {
              (Number(v.isHaveNext)) && (v.children = [])
              return v
            })

            return {data, index: pos}
          })
      } else {
        return Promise.resolve({data, index: pos})
      }
    },
    // 取得已有的层级数据
    getLevelData (val) {
      let data = this.options

      for (let i = 0; i < val.length - 1; i++) {
        data = data[this.indexs[i]].children
      }

      return data
    },
    handleItemChange (val) {
      let index = val.length - 1
      let levelData = this.getLevelData(val)
      let pos = levelData.findIndex(v => v.districtCode === val[index])

      this.indexs[index] = pos // 记录点击位置

      // 如果已经有数据就使用缓存的
      if (levelData[pos].children && levelData[pos].children.length) {
        return Promise.resolve() // 返回一个promise
      }

      // 请求对应的数据
      return this.$ajax.jsonp(this.remoteUrls[index + 1], {keywords: val[index], ...this.params})
        .then(({data}) => {
          data = data.map(v => {
            // 是否有下一级
            (Number(v.isHaveNext)) && (v.children = [])
            return v
          })
          // 设置数据
          levelData[pos].children = data
        })
    },
    // 请求省或直辖市数据
    getProvince () {
      if (this.options.length > 0) {
        return Promise.resolve(this.options)
      }
      return this.$ajax.jsonp(this.remoteUrls[0], {...this.params})
        .then(({data}) => {
          data = data.map(v => {
            (Number(v.isHaveNext)) && (v.children = [])
            return v
          })

          // this.options = data
          return data
        })
    }
  },

  created () {
    this.getProvince().then(data => {
      this.options = data

      // 修复如果有默认值, 会请求多次的bug
      if (this.isFirst && this.value) {
        this.isFirst = false
        this.value = this.calcVal
      }
    })
  }
}
</script>
