<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item key="1" :to="{ path: '/', name: '' }">
        <span class="no-redirect">首页</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-if="destination" key="2" :to="{ path: destination.path, name: destination.name }">
        <a>{{destination.name}}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      destination: null
    };
  },
  created() {
    this.getBreadcrumb()
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb() {
      const { name, path } = this.$route 
      if(path != '/')
        this.destination = { name, path }
      else 
        this.destination = null
    }
  },
};
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: pointer;;
  }
}
</style>