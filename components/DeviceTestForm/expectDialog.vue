<template>
  <el-dialog
    title="选择被测设备"
    :visible.sync="show"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    @close="$emit('close')"
  >
    <el-container style="height: 500px; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu>
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
      <el-container>
        <el-main>
          <el-table ref="table" :data="list" border highlight-current-row @row-click="handleCloudRowClick">
            <el-table-column prop="result" label="预期结果" align="center" />
          </el-table>
        </el-main>
      </el-container>
    </el-container>
    <span slot="footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="$emit('confirm', expect)" :disabled="!expect">确认</el-button>
    </span>

  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean
  },
  watch: {
    visible(val) {
      this.show = val
      if(val) {
        this.list.forEach(row => {
          if(row.expectId === this.expect.expectId)
            this.$refs.table.setCurrentRow(row)
        });
      }
    },
  },
  data() {
    return {
      show: false,
      expect: { expectId: '', result: '' },
      list: [
        { expectId: '123', result: 'foo' },
        { expectId: '456', result: 'bar' },
      ]
    };
  },
  methods: {
    handleCloudRowClick(row) {
      this.expect = JSON.parse(JSON.stringify(row))
    }
  },
};
</script>
