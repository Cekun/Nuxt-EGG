<template>
  <el-dialog
    title="设置邮件通知人"
    :visible.sync="show"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    @close="$emit('close')"
  >
    <el-table
      ref="table"
      :data="list" border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="email" label="邮箱地址" align="center" />
      <el-table-column prop="emailUserName" label="名称" align="center" />
    </el-table>
    <span slot="footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="$emit('confirm', emails)" :disabled="!emails.length">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean
  },
  data() {
    return {
      show: false,
      list: [],
      emails: []
    }
  },
  watch: {
    visible(val) {
      this.show = val
      if(!val)
        this.emails = []
      else {
        // 回显选中
        var ids = this.emails.map(item => item.emailId)
        this.list.forEach(row => {
          if(ids.indexOf(row.emailId) > -1) {
            this.$refs.table.toggleRowSelection(row)
          }
        })
      }
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.emails = val
    },
    async getEmailList() {
      const { code, data } = await this.$http('/userEmails/list');
      if(code === 0) {
        this.list = data
      }
    }
  },
  mounted () {
    this.getEmailList()
  },
};
</script>

