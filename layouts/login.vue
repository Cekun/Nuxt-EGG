<template>
  <div class="login-container">
    <el-card class="login-card">
      <Nuxt />
    </el-card>
  </div>
</template>

<style lang="scss">
.login-container {
  background-color:darkturquoise;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-card {
  width: 480px;
  .footer {
    display: flex;
    justify-content: center;
  }
}

</style>