<template>
  <block>
    <el-button type="primary" plain @click="dialogFormVisible = true">添加邮箱</el-button>
    <el-table
      :data="mailList"
      style="width: 100%">
      <el-table-column
        label="全部邮箱"
        prop="mail">
      </el-table-column>
      <el-table-column
        label="名称"
        prop="name">
      </el-table-column>
      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-button
            size="mini">全部删除?</el-button>
        </template>
        <template slot-scope="scope">
          <el-button
            class="expire"
            size="mini"
            round
            @click="showEditDialog(scope)">编辑</el-button>
          <el-button
            class="expire"
            size="mini"
            round
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
  </el-table-column>
</el-table>

<el-dialog title="添加邮箱" :visible.sync="dialogFormVisible" @close="dialogClosed">
  <el-form :model="userEmailsEntityVo" :rules="addFormRules" ref="FormRef">
    <el-form-item label="邮箱" :label-width="formLabelWidth" prop="mail">
      <el-input v-model="userEmailsEntityVo.email" autocomplete="off" clearable></el-input>
    </el-form-item>

    <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
      <el-input v-model="userEmailsEntityVo.name" autocomplete="off" clearable></el-input>
    </el-form-item>
  </el-form>

  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="addMail">确 定</el-button>
  </div>
</el-dialog>

<el-dialog title="编辑邮箱" :visible.sync="dialogEditVisible" @close="dialogClosed">
  <el-form :model="userEmailsEntityVo" :rules="addFormRules" ref="FormRef">
    <el-form-item label="邮箱" :label-width="formLabelWidth" prop="mail">
      <el-input v-model="userEmailsEntityVo.email" autocomplete="off" clearable></el-input>
    </el-form-item>

    <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
      <el-input v-model="userEmailsEntityVo.emailUserName" autocomplete="off" clearable></el-input>
    </el-form-item>
  </el-form>

  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="EditMail">确 定</el-button>
  </div>
</el-dialog>
</block>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }
    return {
      dialogEditVisible: false,
      dialogFormVisible: false,
      mailList:[
      ],
      userEmailsEntityVo: {
        email: '',
        emailId: 0,
        emailUserName: ''
      },
      formLabelWidth: '120px',
      addFormRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 2,
            max: 6,
            message: '名称长度在2~6个字符之间',
            trigger: 'blur'
          }
        ],
        mail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {

    // this.$http.get('/auto-device-test/userEmails/list').then((res) => {
    //   console.log(res)
    //   this.mailList = res.data
    // })

  },
  methods: {
    showEditDialog(scope) {
      this.dialogEditVisible = true
      console.log(scope)
      this.userEmailsEntityVo.mail = scope.row.mail
      this.userEmailsEntityVo.name = scope.row.name
    },
    EditMail () {

      this.$refs.FormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post('/auto-device-test/userEmails/update/', this.userEmailsEntityVo).catch(function (err) {
          console.log(err)
        })

        if (res.status !== 201) {
          this.$message.error('修改邮箱失败！')
        }

        this.dialogFormVisible = false
        this.$message.success('修改邮箱成功！')
      })
    },
    dialogClosed () {
      this.$refs.FormRef.resetFields()
      console.log(111)
    },
    handleEdit(scope, index, row) {
      console.log(scope)
      console.log(index, row);

      this.dialogFormVisible = true
    },
    handleDelete(index, row) {

      this.$http.delete(`/auto-device-test/userEmails/delete/${this.mailList[index].emailId}`).then((res) => {
        this.$message.success('删除成功')
        this.renderData(res.data.data)
      })
      // this.mailList.splice(index,1)

    },
    renderData(data) {
      console.log(data)
    },
    handleControl(scope, index, row) {
      console.log(scope)
      console.log(index, row);
    },
    addMail () {
      this.$refs.FormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post('/auto-device-test/userEmails/add', this.form).catch(function (err) {
          console.log(err)
        })

        if (res.status !== 201) {
          this.$message.error('添加邮箱失败！')
        }

        this.dialogFormVisible = false
        this.$message.success('添加邮箱成功！')
      })
    }
  },
  watch: {
    mailList : {
      handler (newVal , oldVal) {
        console.log(newVal)
        this.mailList = newVal
      }
    },
    b : {
      handler (newVal , oldVal) {
        console.log(newVal , oldVal)
      } ,
      immediate : true
    }
  },
  computed: {

  }
}
</script>

<style>
.expire:hover{
  color: black;
}
</style>
