<template>
  <div>
    <Nuxt />
  </div>
</template>

<style lang="scss">
.form {
  .el-form-item {
    margin: 0 10% 22px 10%;
  }
  .el-input {
    width: 90%;
  }
  .el-image {
    height: 40px;
    overflow: initial;
  }
}
.captcha-container {
  position: relative;
  .captcha {
    position: absolute;
    right: 0;
  }
  .codeBtn {
    width: 99px;
  }
}
</style>