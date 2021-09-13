<template>
  <div class="app-container">
    <device-test-form @confirm="confirm" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      key: "",
    };
  },
  methods: {
    confirm(val) {
      console.log('form', val)
    }
  },
};
</script>

