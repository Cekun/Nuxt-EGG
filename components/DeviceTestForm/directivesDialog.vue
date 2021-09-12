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
          <el-table ref="table" :data="list" border highlight-current-row @row-click="handleRowClick" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"  v-if="type==='app'" />
            <el-table-column prop="directName" label="指令集" align="center" />
          </el-table>
        </el-main>
      </el-container>
    </el-container>
    <span slot="footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="$emit('confirm', directives)" :disabled="!directives.length">确认</el-button>
    </span>

  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    type: {
      type: String,
      default: () => 'app'
    },
  },
  watch: {
    visible(val) {
      this.show = val
      if(!val)
        this.directives = []
      else {
        // 回显选中
        var ids = this.directives.map(item => item.directid)
        this.list.forEach(row => {
          if(ids.indexOf(row.directid) > -1) {
            if(this.type === 'app')
              this.$refs.table.toggleRowSelection(row)
            else
              this.$refs.table.setCurrentRow(row)
          }
        })
      }
    },
  },
  data() {
    return {
      show: false,
      directives: [],
      list: [
        { directid: '123', directName: 'ba' },
        { directid: '234', directName: 'ra' },
      ],
      multipleSelection: []
    };
  },
  methods: {
    handleRowClick(row) {
      if(this.type !== 'app')
        this.directives = [row]
    },
    handleSelectionChange(val) {
      this.directives = val
    },
  },
};
</script>
