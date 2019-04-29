<template>
  <private-cascader
    expand-trigger="hover"
    :options="options"
    :props="props"
    :value="value"
    @change="handleChange"
    @active-item-change="activeItemChange"
    v-bind="$attrs">
  </private-cascader>
</template>

<script>
import Cascader from '../../cascader'

const host = window.self.location.hostname !== 'v1.tf56.com' ? '//partyopenapitest.tf56.com' : '//partyopenapi.tf56.com'

const params = window.self.location.hostname !== 'v1.tf56.com' ? {
  dog_ak: '2021596y0Tb790O0',
  dog_sk: 'K77MFVhwk348J4h72nHi',
  sourcecode: '01020307'
} : {
  dog_ak: '6T2457jC775Q72EZ',
  dog_sk: 'Z20Qrqr2FB86Hs9UF5b7',
  sourcecode: '3013030033'
}
// 缓存省级地址数据
let provinces
// 缓存地址数据集
let addressCache = {}

export default {
  name: 'ea-address',
  components: {
    PrivateCascader: Cascader
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    host: {
      type: String,
      default: host
    },
    urls: {
      type: Array,
      default: () => [
        '/partyOpenApi/partyAddress/getProvince', // 省
        '/partyOpenApi/partyAddress/getCity', // 市
        '/partyOpenApi/partyAddress/getRegion', // 区
        '/partyOpenApi/partyAddress/getStreet' // 街道
      ]
    },
    params: {
      type: Object,
      default: () => params
    },
    level: {
      type: Number,
      default: 4,
      validator: function (val) {
        // 省、市、区、街道 最大四级
        return val >= 1
      }
    },
    props: {
      type: Object,
      default: () => ({value: 'districtCode', label: 'fullName'})
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      options: [],
      detail: []
    }
  },
  computed: {
    // 最大级别
    maxLevel () {
      return Math.min(this.level, this.urls.length)
    },
    fullUrls () {
      return (this.urls || []).map(url => {
        return /^(http(s)?:)?\/\//.test(url) ? url : `${this.host}${url}`
      })
    }
  },
  async created () {
    const provinces = await this.getProvinces()
    this.options.push(...provinces)
    this.mountMultilevelAddress(this.value, true)
  },
  watch: {
    value (val) {
      this.mountMultilevelAddress(val, true)
    }
  },
  methods: {
    // 获取第一级地址（省）数据，组件生命周期内仅调用一次
    async getProvinces () {
      if (!provinces) {
        provinces = await this.$ajax.jsonp(this.fullUrls[0], this.params, {intercept: false}).then((result = {}) => {
          return (result.data || [])
        })
      }
      return provinces.map(province => {
        return Object.assign({}, province, {children: this.maxLevel > 1 && Number(province.isHaveNext) ? [] : null})
      })
    },
    // 根据地址子集
    async getAddress (level, keywords) {
      // 当地址大于等于最大的urls数时，则达到最大级别，后面为无效地址
      if (level >= this.urls.length - 1) {
        return Promise.resolve([])
      }
      // 缓存市级以后的地址
      if (!addressCache[level]) {
        addressCache[level] = {}
      }
      if (!addressCache[level][keywords]) {
        addressCache[level][keywords] = await this.$ajax.jsonp(this.fullUrls[level + 1], {...this.params, keywords}, {intercept: false}).then((result = {}) => {
          return result.data || []
        })
      }
      return addressCache[level][keywords].map(address => {
        return Object.assign({}, address, {children: this.maxLevel > level + 2 && Number(address.isHaveNext) ? [] : null})
      })
    },
    // 同时获取多级地址
    async getMultilevelAddress (array = []) {
      const promises = [this.options]
      array.forEach((keywords, level) => {
        promises.push(this.getAddress(level, keywords))
      })
      return Promise.all(promises)
    },
    // 挂载地址子节点，可以挂载多级，需存在父子关系，返回最后一级的下级地址
    async mountMultilevelAddress (addressCodes = [], change = false) {
      // 修复引用类型参数后置异步处理中可能存在的bug
      const array = [...addressCodes]
      const maxLevel = this.maxLevel
      const props = this.props
      return this.getMultilevelAddress(array).then(address => {
        // 默认第一个节点为省节点
        let node = address[0].find(province => province[props.value] === array[0]) || {}
        const valid = [node]
        // 从address第二级（市）开始往上一级挂载
        for (let index = 1; index < maxLevel && index < address.length; index++) {
          const _children = address[index]
          // 每个节点只挂在一次子节点
          if (!node._mounted) {
            this.$set(node, 'children', _children.length ? _children : null)
            node._mounted = true
          }
          if (!node.children) {
            break
          }
          node = node.children.find(child => child[props.value] === array[index])
          if (!node) {
            break
          }
          valid.push(node)
        }
        if (change) {
          this.detail = valid.map(item => {
            return {
              value: item[props.value],
              label: item[props.label]
            }
          })
        }
        return address[array.length]
      })
    },
    handleChange (value = []) {
      this.mountMultilevelAddress(value, true).then(children => {
        this.$emit('change', value, {
          children,
          label: this.detail.map(item => item.label)
        })
      })
    },
    activeItemChange (val = []) {
      if (val.length >= this.maxLevel) {
        return
      }
      this.mountMultilevelAddress(val)
    },
    getDetail (onlyLabel = false) {
      return this.value.length ? onlyLabel ? this.detail.map(item => item.label) : this.detail : []
    },
    getChildren (array) {
      const value = Array.isArray(array) ? array : this.value
      return this.getMultilevelAddress(value).then(address => {
        return address[value.length]
      })
    }
  }
}
</script>
