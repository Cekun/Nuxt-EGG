<template>
  <div class="device-test-form">
    <el-form :model="form" ref="form" :rules="rules" label-width="120px" size="medium">
      <el-form-item label="测试项目：" prop='radio'>
        <el-radio v-model="form.testItem" :label="1">单品测试</el-radio>
        <el-radio v-model="form.testItem" :label="2">场景测试</el-radio>
      </el-form-item>
      <el-form-item label="供应商：" prop="surply">
        <el-select v-model="form.surply">
          <el-option v-for="item in surplyOps"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="被测设备：" prop="device">
        <el-input v-model="form.device.deviceName" style="width: 30%" readonly />
        <el-button type="primary" @click.prevent="showDeviceDialog=true; $refs.deviceRef.device=form.device">
          {{ !form.device.deviceName ? '添加' : '修改' }}  
        </el-button>
      </el-form-item>
      <el-form-item label="操作类型：" prop="operateType">
        <el-radio v-model="form.operateType" :label="1">APP操作</el-radio>
        <el-radio v-model="form.operateType" :label="2" @change="optTypeChange">语音操作</el-radio>
      </el-form-item>
      
      <el-form-item 
        :label="`指定集${index+1}：`"
        v-for="(item, index) in form.directives"
        :key="item.directid"
        :prop="'directives.' + index + '.directName'"
        :rules="{required: true, message: '指定集不能为空'}"
      >
        <el-input v-model="item.directName" style="width: 30%" />
        <el-button 
          v-if="(index+1)==form.directives.length" 
          type="primary" 
          @click.prevent="showDirectivesDialog=true; $refs.directRef.directives=form.directives"
        >
          {{ form.directives[0].directid ? '修改' : '添加'}}
        </el-button>
      </el-form-item>
      
      <el-form-item label="预期结果：" prop="direvtive" v-if="form.operateType==2">
        <el-input v-model="form.expectResult.result" style="width: 30%" />
        <el-button type="primary" @click.prevent="showExpectDialog=true; $refs.expectRef.expect=form.expectResult">
          {{ !form.expectResult.result ? '添加' : '修改' }}  
        </el-button>
      </el-form-item>
      <el-form-item label="执行次数：" prop="execNum">
        <el-input-number v-model="form.execNum" :min="1" :step="1" controls-position="right" /> 次
      </el-form-item>
      <el-form-item label="间隔时间：" prop="gapTime">
        <el-input-number v-model="form.gapTime" :min="1" :step="1" controls-position="right" /> 秒
      </el-form-item>
      <el-form-item label="分析报告：" prop="emailMsg">
        <el-radio v-model="form.emailMsg" :label="1">邮件通知</el-radio>
        <el-button type="text" size="medium" @click="showEmailDialog=true">设置邮件通知人</el-button> 
      </el-form-item>
      <el-form-item label="串口方式：" prop="portType">
        <div class="port-type">
          <el-radio v-model="form.portType" :label="1">adb</el-radio>
          <el-input v-model="form.adbipt" style="width: 30%" :readonly="form.portType!=1" placeholder="请填写IP" />
        </div>
        <div class="port-type">
          <el-radio v-model="form.portType" :label="2">串口</el-radio>
          <el-input v-model="form.portipt" style="width: 30%" :readonly="form.portType!=2" placeholder="请填写端口号" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button>取消</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
        <el-button type="primary" @click="onSubmit">创建</el-button>
      </el-form-item>
    </el-form>

    <devices-dialog
      ref="deviceRef"
      :visible="showDeviceDialog"
      @close="showDeviceDialog=false"
      @confirm="selectDevice"
    />
    <directives-dialog 
      ref='directRef'
      :type="this.form.operateType==1?'app':'voice'"
      :visible="showDirectivesDialog"
      @close="showDirectivesDialog=false"
      @confirm="selectDirective"
    />
    <expect-dialog 
      ref="expectRef"
      :visible="showExpectDialog"
      @close="showExpectDialog=false"
      @confirm="selectExpect"
    />
  </div>
</template>

<script>
import DevicesDialog from './devicesDialog.vue'
import DirectivesDialog from './directivesDialog.vue'
import ExpectDialog from "./expectDialog.vue";
export default {
  components: { DevicesDialog, DirectivesDialog, ExpectDialog },
  data() {
      return {
        form: {
          testItem: 1,
          surply: 1,
          operateType: 1,
          device: { deviceId: "", deviceName: "", type: 1 },
          directives: [{ directid: '', directName: '' }],
          execNum: 1,
          gapTime: 5,
          emailMsg: 1,
          portType: 1,
          adbipt: '',
          portipt: '',
          expectResult: ''
        },
        surplyOps: [
          {
            label: '华为',
            value: 1
          },
          {
            label: '中兴',
            value: 2
          },
        ],
        rules: {
          abc: []
        },
        showDeviceDialog: false,
        showDirectivesDialog: false,
        showEmailDialog: false,
        showExpectDialog: false
      }
  },
  methods: {
    selectDevice(val) {
      this.showDeviceDialog = false
      this.form.device = val
    },
    selectDirective(val) {
      this.showDirectivesDialog = false
      this.form.directives = val
    },
    selectExpect(val) {
      this.showExpectDialog = false
      this.form.expectResult = val
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    optTypeChange() {
      this.form.directives = [this.form.directives.shift()]
    },
    onSubmit() {
      
    }
  },
}
</script>

<style lang="scss">
.device-test-form {
  .el-input-number {
    margin-right: 5px;
  }
}
.port-type {
  .el-radio__label {
    display: inline-block;
    width: 30px;
  }
  &:first-child {
    margin-bottom: 10px;
  }
}
</style>