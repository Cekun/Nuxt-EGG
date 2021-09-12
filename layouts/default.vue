<template>
  <div class="app-wrapper" :class="classObj">
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div>
        <navbar />
        <!-- <tags-view /> -->
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar/index.vue";
import Navbar from "./components/Navbar.vue";
import TagsView from "./components/TagsView"
import AppMain from "./components/AppMain.vue"
import { mapState } from "vuex";
export default {
  components: { Sidebar, Navbar, TagsView, AppMain },
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