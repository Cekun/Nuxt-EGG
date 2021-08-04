<template>
  <el-form
    :model="form"
    ref="form"
    :rules="rules"
    label-width="80px"
    size="normal"
    class="form"
  >
    <el-form-item label="用户名" prop="nickname">
      <el-input v-model="form.nickname" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="passwd">
      <el-input type="password" v-model="form.passwd" placeholder="请输入密码"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="repasswd">
      <el-input
        type="password"
        v-model="form.repasswd"
        placeholder="请输入再次输入密码"
      ></el-input>
    </el-form-item>
    <el-form-item label="验证码" size="normal" prop="captcha">
      <el-input v-model="form.captcha" placeholder="请输入验证码" />
      <el-image :src="captchaUrl" fit="fill" :lazy="true" @click="updateCode" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">注册</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        nickname: "admin",
        passwd: "123456",
        captcha: "",
        repasswd: "123456",
        email: "admin@qq.com"
      },
      captchaUrl: "/api/captcha",
      rules: {
        nickname: [{ required: true }],
        passwd: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
        repasswd: [{ required: true }],
        captcha: [{ required: true }],
        email: [{ required: true, type: "email" }]
      },
    };
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if(valid) {
          this.$http({
            url: 'user/register',
            method: 'post',
            data: this.form
          }).then(ret => {
            console.log('ret', ret);
            if(ret.code === 0) {
              this.$alert('注册成功', '成功', {
                confirmButtonText: '去登录',
                callback: () => {
                  this.$router.push('/login')
                }
              })
            } else {
              this.$message.error(ret.message)
            }
          })
        }
      });
    },
    updateCode() {
      this.captchaUrl = "/api/captcha?id=" + Date.now();
    },
  },
};
</script>

<style lang="scss">
.form {
  .el-input {
    width: 80%;
  }

  .el-image {
    height: 40px;
    overflow: initial;
  }
}
</style>
