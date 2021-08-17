<template>
  <el-form
    :model="form"
    ref="form"
    :rules="rules"
    label-width="80px"
    size="normal"
    class="form"
  >
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="passwd">
      <el-input type="password" v-model="form.passwd" placeholder="请输入密码"></el-input>
    </el-form-item>
    <el-form-item label="验证码" size="normal" prop="captcha" class="captcha-container">
      <div class="captcha">
        <el-image :src="captchaUrl" fit="fill" :lazy="true" @click="updateCode" />
      </div>
      <el-input v-model="form.captcha" placeholder="请输入验证码" />
    </el-form-item>
    <el-form-item label="验证码" size="normal" prop="emailcode" class="captcha-container">
      <div class="captcha">
        <el-button class="codeBtn" type="primary" size="default" @click="sendEmailCode" :disabled="send.timer>0">{{sendText}}</el-button>
      </div>
      <el-input v-model="form.emailcode" placeholder="请输入验证码" />
    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" @click="onSubmit">登录</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import md5 from 'md5'
export default {
  layout: 'login',
  data() {
    return {
      send: { timer: 0 },
      form: {
        passwd: "123456",
        captcha: "ccc",
        email: "583988818@qq.com",
        emailcode: "123"
      },
      captchaUrl: "/api/captcha",
      rules: {
        nickname: [{ required: true }],
        passwd: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
        repasswd: [{ required: true }],
        captcha: [{ required: true }],
        email: [{ required: true, type: "email" }],
        emailcode: [{ required: true }],
      },
    };
  },
  computed: {
    sendText() {
      return this.send.timer <= 0 ? '发送' : `${this.send.timer}s后发送`
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if(valid) {
          this.$http({
            url: 'user/login',
            method: 'post',
            data: {...this.form, passwd: md5(this.form.passwd)}
          }).then(ret => {
            if(ret.code === 0) {
              localStorage.setItem('token', ret.data.token)
              this.$router.push('/')
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
    sendEmailCode() {
      this.send.timer = 10;
      this.timer = setInterval(() => {
        this.send.timer -= 1
        if(this.send.timer <= 0) clearInterval()
      }, 1000);
      this.$http({ url: 'sendCode', params: {
        email: this.form.email
      }}).then(ret => {
        console.log('ret: ', ret)
      })
    }
  },
};
</script>


