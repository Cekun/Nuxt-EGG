<template>
  <div ref="list" class="infinite-list-container" @scroll="scrollEvent($event)">
    <div class="infinite-list-phantom" :style="{ height: listHeight + 'px' }" />
    <div class="infinite-list" :style="{ transform: getTransform }">
      <ArticleItem
        ref="items"
        :id="index"
        class="infinite-list-item"
        v-for="(item, index) in visibleData"
        :article="item"
        :key="item._id"
        :style="{ height: itemSize + 'px' }"
      ></ArticleItem>
    </div>
  </div>
</template>

<script>
import ArticleItem from "./ArticleItem";
export default {
  name: "VirtualList",
  components: { ArticleItem },
  props: {
    listData: {
      type: Array,
      default: () => [],
    },
    // 每项高度
    itemSize: {
      type: Number,
      default: 200,
    },
  },
  computed: {
    listHeight() {
      return this.listData.length * this.itemSize;
    },
    // 可显示的列表项数
    visibleCount() {
      return Math.ceil(this.screenHeight / this.itemSize);
    },
    // 偏移量对应的style
    getTransform() {
      return `translate3d(0, ${this.startOffset}px, 0)`;
    },
    visibleData() {
      return this.listData.slice(
        this.start,
        Math.min(this.end, this.listData.length)
      );
    }
  },
  mounted() {
    this.start = 0;
    this.end = this.start + this.visibleCount;
  },
  data() {
    return {
      screenHeight: 800, // 可视区域高度
      startOffset: 0, // 偏移量
      start: 0, //起始索引
      end: 4, //结束索引
    };
  },
  methods: {
    scrollEvent() {
      // 当前滚动位置
      let scrollTop = this.$refs.list.scrollTop;
      // 此时的开始索引
      this.start = Math.floor(scrollTop / this.itemSize)
      // 此时的结束索引
      this.end = this.start + this.visibleCount;
      // 此时的偏移量
      this.startOffset = scrollTop - (scrollTop % this.itemSize)
    }
  },
};
</script>

<style lang="scss" scoped>
.infinite-list-container {
  height: 100%;
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}
.infinite-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}
</style>