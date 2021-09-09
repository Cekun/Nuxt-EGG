<template>
  <el-container>
    <el-aside class="sidebar-container" width="200px">
      <div>
        dx 
      </div>
    </el-aside>
    <el-container class="main-container">
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
          <el-menu-item v-if="userinfo.id" index="5" class="pull-right">
            <nuxt-link to="/editor/new">
              <el-button type="primary">写文章</el-button>
            </nuxt-link>
          </el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <Nuxt />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import UserDisplay from "~/components/UserDisplay.vue";
export default {
  components: { UserDisplay },
  computed: {
    userinfo() {
      return this.$store.state.user;
    },
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$store.commit("user/LOGOUT");
    },
    getUserInfo() {
      const token = localStorage.getItem("token");
      if (token) this.$store.dispatch("user/detail");
    },
  },
};
</script>
