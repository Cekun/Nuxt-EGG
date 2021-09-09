<template>
  <div class="app-container">
    <transfer
      :data="data"
      :titles="['source', 'target']"
      pagination
      v-model="value"
      filterable
    >
    </transfer>

    <p>
      <el-transfer v-model="value" :data="data" target-order="original" filterable 
        :format="{noChecked: '${total}',hasChecked: '${checked}/${total}'}">
      </el-transfer>
      
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      value: [1,2,3]
    };
  },
  async mounted() {
    const { data } = await this.$http("/bigdata");
    this.data = data
  },
};
</script>

<style lang="scss">
</style>