<template>
  <el-form :model="form" ref="form" label-width="70px">
    <el-form-item label="账号：" prop="email">
      <el-input v-model="form.email" placeholder="请输入账号" />
    </el-form-item>
    <el-form-item label="密码：" prop="passwd">
      <el-input
        type="password"
        v-model="form.passwd"
        placeholder="请输入密码"
        show-password
      />
    </el-form-item>
    <div class="footer">
      <el-button type="primary" @click="onSubmit" :disabled="loginDisabled"
        >登录</el-button
      >
    </div>
  </el-form>
</template>

<script>
import md5 from "md5";
export default {
  layout: "login",
  data() {
    return {
      form: { passwd: "", email: "" },
    };
  },
  computed: {
    loginDisabled() {
      var disabled = false;
      for (const key in this.form) {
        const value = this.form[key];
        if (value === "") disabled = true;
      }
      return disabled;
    },
    sendText() {
      return this.send.timer <= 0 ? "发送" : `${this.send.timer}s后发送`;
    },
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$http({
            url: "user/login",
            method: "post",
            data: { ...this.form, passwd: md5(this.form.passwd) },
          }).then((ret) => {
            if (ret.code === 0) {
              localStorage.setItem("token", ret.data.token);
              this.$router.push("/");
            } else {
              this.$message.error(ret.message);
            }
          });
        }
      });
    },
    updateCode() {
      this.captchaUrl = "/api/captcha?id=" + Date.now();
    },
    sendEmailCode() {
      this.send.timer = 10;
      this.timer = setInterval(() => {
        this.send.timer -= 1;
        if (this.send.timer <= 0) clearInterval();
      }, 1000);
      this.$http({
        url: "sendCode",
        params: {
          email: this.form.email,
        },
      }).then((ret) => {
        console.log("ret: ", ret);
      });
    },
  },
};
</script>


