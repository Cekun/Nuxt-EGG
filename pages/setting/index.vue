<template>
  <div>
    <el-tabs tab-position="left" style="height:calc(100vh - 50px)">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-user-solid" />&nbsp;账号设置</span>
        <account-set/>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-message" />&nbsp;邮箱设置</span>
        <mail/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import accountSet from './accountSet.vue';
import mail from './mail/index'
export default {
  components: { accountSet, mail },};
</script>

<style lang="scss" scoped>
</style>
