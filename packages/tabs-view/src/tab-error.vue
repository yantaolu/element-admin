<template>
  <div class="tab-error" style="width: 100%; height: 100%;">
    <slot v-if="error === 403" name="tab-error-403">您无权限访问该页面</slot>
    <slot v-if="error === 404" name="tab-error-404">您访问的页面不存在</slot>
    <slot v-if="error === 500" name="tab-error-500">服务器错误，请稍候查重试</slot>
  </div>
</template>

<script>
export default {
  name: 'tab-error',
  props: {
    error: Number
  }
}
</script>

<style scoped>

</style>
