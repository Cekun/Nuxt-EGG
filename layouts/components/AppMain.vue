<template>
  <section class="app-main">
    <transition>
      <keep-alive>
        <Nuxt />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {};
  },
};
</script>
