<template>
  <tf-table :columns="columns" :data="[{}]" :pagination="false"></tf-table>
</template>

<script>
import {Carousel, CarouselItem} from 'element-ui'

export default {
  components: {ElCarousel: Carousel, ElCarouselItem: CarouselItem},
  data () {
    return {
      columns: [{
        label: '区间',
        minWidth: 100,
        renderCell () {
          return '价格'
        }
      }, {
        width: 100,
        fixed: 'right',
        renderHeader (h) {
          const self = this
          return (
            <span>
              <tf-button type="text" onClick={self.plus} icon="el-icon-plus">增加区间</tf-button>
            </span>
          )
        }
      }]
    }
  },
  methods: {
    plus () {
      let columns = [...this.columns]
      const len = columns.length
      columns.splice(len - 1, 0, {
        label: len + '',
        minWidth: '120px',
        prop: 'prop-' + len + '',
        renderCell (h) {
          return h('tf-input-number', {
            props: {
              controlsPosition: 'right',
              min: 0,
              precision: 2
            },
            style: {
              width: '100px'
            }
          })
        }
      })
      this.columns = columns
    }
  }
}
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>
