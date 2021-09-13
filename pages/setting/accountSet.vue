<template>
  <el-form :model="form" ref="form" label-width="90px" class="app-container">
    <el-form-item label="我的账号：">
      {{form.account}}
      <el-button type="primary" plain size="small">登出</el-button>
    </el-form-item>
    <el-form-item label="报告打印：">
      <el-input v-model="form.destination" placeholder="默认路径" clearable></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        account: '奔波儿灞',
        destination: ''
      }
    }
  },
};
</script>