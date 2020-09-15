<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item key="1" :to="{ path: '/', name: '' }">
        <span>首页</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-if="destination" key="2" :to="{ path: destination.path }">
        <span class="no-redirect">{{destination.cname}}</span>
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
      if(path != '/') {
        this.destination = { name, path }
        switch (name) {
          case 'deviceTest-entity':
            this.destination.cname = '实体设备测试'
            break;
          case 'deviceTest-virtual':
            this.destination.cname = '虚拟设备测试'
            break
          case 'setting': 
            this.destination.cname = '设置'
            break;
          case 'task': 
            this.destination.cname = '任务管理'
            break
          default:
            this.destination.cname = name
            break;
        }
      }
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