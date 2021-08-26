<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane
      ref="scrollPane"
      class="tags-view-wrapper"
      @scroll="handleScroll"
    >
      <nuxt-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        :class="isActive(tag) ? 'active' : ''"
        @contextmenu.prevent.native="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </nuxt-link>
    </scroll-pane>
    <ul
      v-show="visible"
      class="contextmenu"
      :style="{ left: left + 'px', top: top + 'px' }"
    >
      <li>刷新</li>
      <li>关闭</li>
      <li>关闭其他</li>
      <li>关闭所有</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from "./ScrollPane.vue";
export default {
  components: { ScrollPane },
  data() {
    return {
      left: 0,
      top: 0,
      visible: false,
      selectedTag: {},
    };
  },
  watch: {
    $route() {
      this.addTags();
      this.moveToCurrentTag();
    },
    visible(value) {
      if (value) document.body.addEventListener("click", this.closeMenu);
      else document.body.removeEventListener("click", this.closeMenu);
    },
  },
  mounted() {
    this.addTags();
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    },
  },
  methods: {
    addTags() {
      const { name } = this.$route;
      if (name) this.$store.dispatch("tagsView/addView", this.$route);
      return false;
    },
    moveToCurrentTag() {},
    closeSelectedTag(tag) {},
    isActive(route) {
      return route.path === this.$route.path;
    },
    handleScroll() {
      this.closeMenu();
    },
    closeMenu() {
      this.visible = false;
    },
    openMenu(tag, e) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // 容器左偏移
      const offsetWidth = this.$el.offsetWidth; // 容器宽
      const maxLeft = offsetWidth - menuMinWidth;
      const left = e.clientX - offsetLeft + 15; // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }
      this.top = e.clientY;
      this.visible = true;
      this.selectedTag = tag;
    },
  },
};
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    .tags-view-item {
      cursor: pointer;
      height: 26px;
      display: inline-block;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background-color: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background-color: #eee;
      }
    }
  }
}
</style>