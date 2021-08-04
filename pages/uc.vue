<template>
  <div>
    <h1>用户中心</h1>
  </div>
</template>

<script>
  export default {
    async mounted () {
     const {data} = this.$http('/user/info')
    },
  }
</script>

<style lang="sass" scoped>

</style>