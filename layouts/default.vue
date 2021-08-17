<template>
 <el-container>
   <el-header>
     <el-menu class="el-menu-demo" mode="horizontal">
       <el-menu-item index="1">
          <nuxt-link to="/">首页</nuxt-link>
        </el-menu-item>
        <el-menu-item v-if="!userinfo.id" index="2" class="pull-right">
          <nuxt-link to="/register">注册</nuxt-link>
        </el-menu-item>
        <el-menu-item v-if="userinfo.id" index="3" class="pull-right">
          <a @click="logout">退出</a>
        </el-menu-item>
        <el-menu-item v-if="!userinfo.id" index="3" class="pull-right">
          <nuxt-link to="/login">登录</nuxt-link>
        </el-menu-item>

        <el-menu-item v-if="userinfo.id" index="4" class="pull-right">
          <UserDisplay :user="userinfo" /> 
        </el-menu-item>


        <el-menu-item v-if="userinfo.id" index="3" class="pull-right">
          <nuxt-link to="/editor/new">
            <el-button type="primary">写文章</el-button>
          </nuxt-link>
        </el-menu-item>

     </el-menu>
   </el-header>
   <el-container>
     <el-container>
       <el-main height="">
        <Nuxt />
       </el-main>
       <el-footer class="footer" >
         <p>康佳电子科技有限公司</p> 
         <p></p>
       </el-footer>
     </el-container>
   </el-container>
 </el-container>
 
</template>

<script>
  import UserDisplay from "~/components/UserDisplay.vue";
  export default {
    components: { UserDisplay },
    computed: {
      userinfo() {
        return this.$store.state.user 
      }
    },
    mounted () {
      this.getUserInfo();
    },
    methods: {
      logout() {
        localStorage.removeItem('token')
        this.$store.commit('user/LOGOUT')
      },
      getUserInfo() {
        const token = localStorage.getItem('token')
        if(token)
          this.$store.dispatch('user/detail')
      }
    },
  }
</script>

<style lang="scss">
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  background: #eee;
}
.pull-right {
  float: right !important;
}
.nuxt-link-active {
  text-decoration: none;
}
.footer {
  position: relative;
  bottom: 0;
  text-align: center;
}
</style>