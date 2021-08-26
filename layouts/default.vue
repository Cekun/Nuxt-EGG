<template>
  <div class="app-wrapper" :class="classObj">
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div>
        <navbar />
        <tags-view />
      </div>
      <!-- <app-main /> -->
      <Nuxt />
    </div>
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar/index.vue";
import Navbar from "./components/Navbar.vue";
import TagsView from "./components/TagsView"
import { mapState } from "vuex";
export default {
  components: { Sidebar, Navbar, TagsView },
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
$sideBarWidth: 210px;
.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: $sideBarWidth;
  position: relative;
}
.sidebar-container {
  transition: width 0.28s;
  width: $sideBarWidth !important;
  // background-color: $menuBg;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}

.hideSidebar {
  .sidebar-container {
    width: 54px !important;
  }
  .main-container {
    margin-left: 54px;
  }
}
</style>