<template>
  <div>
      页面建设中。。。。。<br>
      <br>

  </div>

</template>

<script>
export default {
  data () {
    return {
      // basePath: baseURL.oldMgrPath,
      oldPath: ''
    }
  },
  mounted () {
    this.setHref()
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route' (v) {
      this.setHref()
    }
  },
  methods: {
    setHref () {
      this.oldPath = this.basePath + this.$route.query.path
    }
  }
}
</script>

<style >
</style>
