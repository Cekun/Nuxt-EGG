<template>
  <div class="home-page">
    <nuxt-link to="/deviceTest/entity" class="device-test">
      实体设备测试
    </nuxt-link>
    <nuxt-link to="/deviceTest/virtual" class="device-test">
      虚拟设备测试
    </nuxt-link>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  async mounted() {},
};
</script>


<style lang="scss">
.home-page {
  .device-test {
    width: 360px;
    height: 180px;
    text-align: center;
    line-height: 180px;
    background-color: darkgrey;
    text-decoration: none;
    color: #000;
  }
}
</style>

