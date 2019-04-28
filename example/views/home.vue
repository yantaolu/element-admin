<template>
  <div class="markdown-body" v-html="guide"></div>
</template>

<script>
import guide from './guide/guide.md'

const home = {
  name: 'home',
  data () {
    return {
      guide
    }
  },
  mounted () {
  }
}

export default home
</script>
