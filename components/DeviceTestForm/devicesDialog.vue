<template>
  <el-dialog
    class="test-dialog"
    title="选择被测设备"
    :visible.sync="show"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    @close="$emit('close')"
  >
    <el-container class="out-container">
      <el-aside width="160px">
        <el-menu default-active="1">
          <el-menu-item index="1">
            <i class="el-icon-cloudy"></i>
            <span slot="title">云端获取</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-folder"></i>
            <span slot="title">本地获取</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container class="inner-container">
        <el-table ref="table" :data="list"  highlight-current-row @row-click="handleRowClick" height="360">
          <el-table-column prop="deviceId" label="设备ID" align="center" />
          <el-table-column prop="deviceName" label="设备名称" align="center" />
          <el-table-column label="状态" align="center">
            <template slot-scope="{ row }">
              <span v-if="row.status == 'online'" style="color: green">在线</span>
              <span v-else style="color: grey">离线</span>
            </template>
          </el-table-column>
        </el-table>
      </el-container>
    </el-container>
    <span slot="footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="$emit('confirm', device)" :disabled="!device.deviceId">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
  },
  watch: {
    visible(val) {
      this.show = val
      if(val) {
        this.list.forEach(row => {
          if(row.deviceId === this.device.deviceId)
            this.$refs.table.setCurrentRow(row)
        });
      }
    },
  },
  data() {
    return {
      show: false,
      device: { deviceId: "", deviceName: "", status: 'online' },
      list: [],
    };
  },
  methods: {
    handleRowClick(row) {
      this.device = JSON.parse(JSON.stringify(row));
    },
    async getDataList() {
      const { code, data } = await this.$http('/ManufactureDevice/getDevice');
      if(code === 0) {
        this.list = data
      }
    }
  },
  mounted () {
    this.getDataList()
  },
};
</script>
