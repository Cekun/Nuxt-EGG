<template>
  <el-dialog
    title="选择被测设备"
    :visible.sync="show"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    @close="$emit('close')"
  >
    <el-table
      :data="list" border highlight-current-row
    >
      <el-table-column prop="deviceId" label="设备ID" align="center" />
      <el-table-column prop="deviceName" label="设备名称" align="center" />
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      list: [
        { emialId: '123323123123', emailName: 'nsd@qq.com' },
        { emialId: '234234234233', emailName: '1nassd@163.com' }
      ]
    }
  },
};
</script>

