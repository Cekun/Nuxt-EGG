<template>
  <div class="app-container">
    <transfer
      :data="data"
      :titles="['source', 'target']"
      pagination
      filterable
      v-model="value"
    />
    <!-- <div>
      <el-transfer v-model="value" :data="data" target-order="original" filterable 
        :format="{noChecked: '${total}',hasChecked: '${checked}/${total}'}">
      </el-transfer>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      value: []
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