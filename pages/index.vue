<template>
  <el-form :model="form" ref="form" :rules="rules" label-width="80px" :inline="false" size="normal">
    <el-form-item label="用户名">
      <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item label="验证码" size="normal">
      <el-input v-model="form.username" placeholder="请输入验证码" />
      <el-image :src="'/api/captcha'" fit="fill" :lazy="true" />
      
    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: ''
      },
      rules: {}
    }
  },
}
</script>
