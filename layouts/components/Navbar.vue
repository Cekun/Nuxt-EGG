<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <UserDisplay :user="userinfo" class="right-menu-item" />

      <a v-if="userinfo.id" @click="logout" class="right-menu-item">退出</a>
    </div>
  </div>
</template>

<script>
export default {
 
  data() {
    return {
      key: "",
    };
  },
  computed: {
    userinfo() {
      return this.$store.state.user;
    },
    sidebar() {
      return this.$store.getters['app/sidebar']
    }
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    getUserInfo() {
      const token = localStorage.getItem("token");
      if (token) this.$store.dispatch("user/detail");
    },
    logout() {
      localStorage.removeItem("token");
      this.$store.commit("user/LOGOUT");
    },
  },
};
</script>


<style lang='scss' scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    height: 100%;
    cursor: pointer;
    line-height: 46px;
    float: left;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      // font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
  }
}
</style>