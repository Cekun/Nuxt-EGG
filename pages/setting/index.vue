<template>
  <div>
    <el-tabs tab-position="left" style="height:calc(100vh - 50px)">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-user-solid" />&nbsp;账号设置</span>
        <account-set/>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-message" />&nbsp;邮箱设置</span>
        邮箱设置
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import accountSet from './accountSet.vue';
export default {
  components: { accountSet },};
</script>

<style lang="scss" scoped>
</style>