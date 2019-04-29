<template>
  <!--<ea-integrated-page :columns="columns" :conditions="conditions" @fetch-data="fetchData" :label-width="80" :auto-fetch="false"></ea-integrated-page>-->
  <div class="markdown-body" v-html="text"></div>
</template>

<script>
import text from '../integrated/integrated-page.md'
import config from '../guide/page-config'

export default {
  name: 'test',
  data () {
    return Object.assign(config, {
      text,
      fetchData ({setData, setTotal, params, page, size}) {
        console.log(params, page, size)
        setData([{code: 'test1'}, {code: 'test2'}])
        setTotal(100)
      }
    })
  }
}
</script>
