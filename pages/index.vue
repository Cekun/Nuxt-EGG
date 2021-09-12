<template>
  <div class="home-page">
    <div class="device-test">
      <nuxt-link to="/deviceTest/entity">实体设备测试</nuxt-link>
    </div>
    <div class="device-test">
      <nuxt-link to="/deviceTest/virtual">虚拟设备测试</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
     
    }
  },
  async mounted() {
   
  }
}
</script>


<style lang="scss">
.home-page {
  .device-test {
    width: 360px;
    height: 180px;
    text-align: center;
    line-height: 180px;
    background-color: darkgrey;
    cursor: pointer;
  }
}
</style>

