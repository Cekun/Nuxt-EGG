<template>
  <el-scrollbar
    ref="scrollContainer"
    :vertical="false"
    class="scroll-container"
    @wheel.native.prevent="handleScroll"
  >
    <slot /> 
  </el-scrollbar>
</template>

<script>
export default {
  name: "ScrollPane",
  data() {
    return {
      left: 0
    }
  },
  computed: {
    scrollWrapper() {
      return this.$refs.scrollContainer.$refs.wrap
    }
  },
  mounted () {
    this.scrollWrapper.addEventListener('scroll', this.emitScroll, true);
  },
  beforeDestroy () {
    this.scrollWrapper.removeEventListener('scroll', this.emitScroll);
  },
  methods: {
    emitScroll() {
      this.$emit('scroll')
    },
    handleScroll() {

    }
  },
};
</script>

<style lang="scss" scoped>
</style>