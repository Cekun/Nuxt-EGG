<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        background-color="#304156"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <nuxt-link to="/">
          <el-menu-item index="1">
            <template slot="title">
              <i class="el-icon-s-home" />
              首页
            </template>
          </el-menu-item>
        </nuxt-link>
        <nuxt-link to="/task">
          <el-menu-item index="2">
            <template slot="title">
              <i class="el-icon-postcard" />
              任务管理
            </template>
          </el-menu-item>
        </nuxt-link>
        <nuxt-link to="/setting">
          <el-menu-item index="3">
            <template slot="title">
              <i class="el-icon-setting" />
              设置
            </template>
          </el-menu-item>
        </nuxt-link>


        <!-- <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-setting" />
            <span>设置</span>
          </template>
          <el-menu-item index="1-1">
            <nuxt-link to="/setting/menu">菜单管理</nuxt-link>
          </el-menu-item>
          <el-menu-item index="1-2">
            <nuxt-link to="/setting/role">角色管理</nuxt-link>
          </el-menu-item>
          <el-menu-item index="1-3">
            <nuxt-link to="/setting/mail">邮箱管理</nuxt-link>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-s-tools"></i>
            <span>组件</span>
          </template>
          <el-menu-item index="2-1">
            <nuxt-link to="/testComp/transfer">穿梭框</nuxt-link>
          </el-menu-item> -->

      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.scrollbar-wrapper {
  .el-menu {
    border-right: none;
    a {
      text-decoration: none;
      color: #fff;
    }
  }
}
</style>
