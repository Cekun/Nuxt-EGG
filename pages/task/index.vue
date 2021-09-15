<template>
  <div>
    <el-row>
      <el-col :span="4">
        <el-button class="tasklist"
                   icon="el-icon-notebook-2"
                    @click="istaskList = true">任务列表</el-button>
        <el-button class="finishedtask"
                   icon="el-icon-check"
                   @click="istaskList = false">任务结束</el-button>
      </el-col>
      <el-col :span="20">
        <block v-if="istaskList === true">
<!--        <el-tag type="danger">任务进行中({{tasking}})</el-tag>-->
          <el-button type="primary" @click="groupByTask">组合选中的任务</el-button>
          <el-button type="primary" @click="excTasks">执行选中的任务</el-button>
        <el-table
          :data="tableData"
          style="width: 100%"
          row-key="taskId"
          ref="multipleTable"
          id = "solo"
          :row-class-name="tableRowClassName"
          border
          default-expand-all
          @selection-change="handleSelectionChange"
          @row-contextmenu="rightClick"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column
            type="selection"
            :selectable="selectable"
            width="55">
          </el-table-column>
          <el-table-column
            :label="'全部任务,共'+taskNum+'个,进行中'+tasking+'个'"
            prop="taskName">
          </el-table-column>
          <el-table-column
            label="分类">
            <template slot-scope="scope">
              <div slot="reference" class="status">
                <!--                <el-tag>{{ scope.row }}</el-tag>-->
                <el-tag>{{ scope.row.typeName }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="状态">
            <template slot-scope="scope">
              <div slot="reference" class="status">
<!--                <el-tag>{{ scope.row }}</el-tag>-->
                <el-tag v-if="scope.row.state.indexOf('进行中') != -1">{{ scope.row.state }}</el-tag>
                <el-tag type="info" v-if="scope.row.state.indexOf('未开始') != -1">{{ scope.row.state }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="right">
            <template slot="header">
              <!--        <el-input-->
              <!--          v-model="search"-->
              <!--          size="mini"-->
              <!--          placeholder="输入关键字搜索"/>-->
              <el-button
                size="mini" :disabled="taskList.filter(item => item.completeTime === 0).length === 0">全部开始</el-button>
              <el-button
                size="mini">全部中断</el-button>
              <el-button
                size="mini">全部删除</el-button>
            </template>
            <template slot-scope="scope">
              <el-button
                class="expire"
                size="mini"
                round
                v-if = "scope.row.completeTime === 0 && scope.row.taskType !== 2"
                @click="handleEdit(scope, scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                round
                v-if = "scope.row.completeTime === 0"
                @click="handleControl(scope, scope.$index, scope.row)">开始</el-button>
              <el-button
                class="expire"
                size="mini"
                round
                v-if = "scope.row.completeTime !== 0"
                @click="handleControl(scope, scope.$index, scope.row)">中断</el-button>
              <el-button
                class="expire"
                size="mini"
                round
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
          <div id="contextmenu"
               v-show="menuVisible"
               class="menu">
            <div class="contextmenu__item"
                 @click="ShowView(CurrentRow)">查看</div>
            <div class="contextmenu__item"
                 @click="EditData(CurrentRow)">修改</div>
          </div>

          <p style="height: 10px"></p>

<!--        <el-table-->
<!--          :data="groupData"-->
<!--          style="width: 100%"-->
<!--          row-key="taskId"-->
<!--          ref="multipleTable2"-->
<!--          :row-class-name="tableRowClassName2"-->
<!--          default-expand-all-->
<!--          border-->
<!--          @selection-change="handleSelectionChange"-->
<!--          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"-->
<!--        >-->
<!--          <el-table-column-->
<!--            type="selection"-->
<!--            :selectable="selectable"-->
<!--            width="55">-->
<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--            :label="'组合任务,共'+groupNum+'个,进行中'+grouping+'个'"-->
<!--            prop="taskName">-->
<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--            label="分类">-->
<!--            <template slot-scope="scope">-->
<!--              <div slot="reference" class="status">-->
<!--                &lt;!&ndash;                <el-tag>{{ scope.row }}</el-tag>&ndash;&gt;-->
<!--                <el-tag>{{ scope.row.typeName }}</el-tag>-->
<!--              </div>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--            label="状态">-->
<!--            <template slot-scope="scope">-->
<!--              <div slot="reference" class="status">-->
<!--                &lt;!&ndash;                <el-tag>{{ scope.row }}</el-tag>&ndash;&gt;-->
<!--                <el-tag v-if="scope.row.state.indexOf('进行中') != -1">{{ scope.row.state }}</el-tag>-->
<!--                <el-tag type="info" v-if="scope.row.state.indexOf('未开始') != -1">{{ scope.row.state }}</el-tag>-->
<!--              </div>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--            align="right">-->
<!--            <template slot="header" slot-scope="scope">-->
<!--              &lt;!&ndash;        <el-input&ndash;&gt;-->
<!--              &lt;!&ndash;          v-model="search"&ndash;&gt;-->
<!--              &lt;!&ndash;          size="mini"&ndash;&gt;-->
<!--              &lt;!&ndash;          placeholder="输入关键字搜索"/>&ndash;&gt;-->
<!--              <el-button-->
<!--                size="mini" :disabled="taskList.filter(item => item.completeTime === 0).length === 0">全部开始</el-button>-->
<!--              <el-button-->
<!--                size="mini">全部中断</el-button>-->
<!--              <el-button-->
<!--                size="mini">全部删除</el-button>-->
<!--            </template>-->
<!--            <template slot-scope="scope">-->
<!--              <el-button-->
<!--                class="expire"-->
<!--                size="mini"-->
<!--                round-->
<!--                v-if = "scope.row.completeTime === 0 || scope.row.taskType === 2"-->
<!--                @click="handleEdit(scope, scope.$index, scope.row)">编辑</el-button>-->
<!--              <el-button-->
<!--                size="mini"-->
<!--                round-->
<!--                v-if = "scope.row.completeTime === 0"-->
<!--                @click="handleControl(scope, scope.$index, scope.row)">开始</el-button>-->
<!--              <el-button-->
<!--                class="expire"-->
<!--                size="mini"-->
<!--                round-->
<!--                v-if = "scope.row.completeTime !== 0"-->
<!--                @click="handleControl(scope, scope.$index, scope.row)">中断</el-button>-->
<!--              <el-button-->
<!--                class="expire"-->
<!--                size="mini"-->
<!--                round-->
<!--                @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--        </el-table>-->


        <el-dialog title="编辑任务" :visible.sync="dialogFormVisible">
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          </div>
        </el-dialog>
      </block>
        <block v-if="istaskList === false">
          <el-table
            :data="finishedTasks"
            style="width: 100%">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              :label="'全部任务,共'+finishedTasks.length+'个'"
              prop="taskName">
            </el-table-column>
            <el-table-column
              label="分类">
              <template slot-scope="scope">
                <div slot="reference" class="status">
                  <!--                <el-tag>{{ scope.row }}</el-tag>-->
                  <el-tag>{{ scope.row.typeName }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="状态">
              <template slot-scope="scope">
                  <div slot="reference">
                    <el-tag size="success" v-if="scope.row.finishedState === '任务完成'">{{ scope.row.finishedState }}</el-tag>
                    <el-tag type="danger" v-if="scope.row.finishedState === '任务中断'">{{ scope.row.finishedState }}</el-tag>
                  </div>
              </template>
            </el-table-column>
            <el-table-column
              align="right">
              <template slot="header">
                <el-button
                  size="mini">全部删除?</el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  class="expire"
                  size="mini"
                  round
                  @click="handleRecreate(scope, scope.$index, scope.row)">再次创建</el-button>
                <el-button
                  class="expire"
                  size="mini"
                  round
                  @click="handleDelete2(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </block>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  data() {
    return {
      menus: ['详细信息', '方案分析', '方案存库', '清除方案'],
      dialogFormVisible: false,
      formLabelWidth: '120px',
      search: '',
      istaskList: true,

      taskList: [{
        taskId: 1,
        taskName: '1',
        taskType: 0,
        status: 1,
        completeTime: 14,
        execTimes: 15
      },{
        taskId: 2,
        taskName: '组合一',
        taskType: 2,
        status: 1,
        completeTime: 12,
        execTimes: 15,
        children: [{
          taskId: 5,
          taskName: '2',
          taskType: 1,
          status: 1,
          completeTime: 2,
          execTimes: 15
        }, {
          taskId: 6,
          taskName: '3',
          taskType: 0,
          status: 1,
          completeTime: 2,
          execTimes: 15
        }, {
          taskId: 56,
          taskName: '4',
          taskType: 0,
          status: 1,
          completeTime: 2,
          execTimes: 15
        }]
      },{
        taskId: 33,
        taskName: '组合二',
        taskType: 2,
        status: 1,
        completeTime: 12,
        execTimes: 15,
        children: [{
          taskId: 34,
          taskName: '2',
          taskType: 1,
          status: 1,
          completeTime: 2,
          execTimes: 15
        }, {
          taskId: 36,
          taskName: '3',
          taskType: 0,
          status: 1,
          completeTime: 2,
          execTimes: 15
        }, {
          taskId: 35,
          taskName: '4',
          taskType: 0,
          status: 1,
          completeTime: 2,
          execTimes: 15
        }]
      },{
        taskId: 44,
        taskName: '组合三',
        taskType: 2,
        status: 1,
        completeTime: 12,
        execTimes: 15,
        children: [{
          taskId: 45,
          taskName: '2',
          taskType: 1,
          status: 1,
          completeTime: 2,
          execTimes: 15
        }, {
          taskId: 46,
          taskName: '3',
          taskType: 0,
          status: 1,
          completeTime: 2,
          execTimes: 15
        }, {
          taskId: 47,
          taskName: '4',
          taskType: 0,
          status: 1,
          completeTime: 2,
          execTimes: 15
        }]
      },{
        taskId: 66,
        taskName: '组合四',
        taskType: 2,
        status: 0,
        completeTime: 12,
        execTimes: 15,
        children: [{
          taskId: 65,
          taskName: '2',
          taskType: 1,
          status: 0,
          completeTime: 0,
          execTimes: 15
        }, {
          taskId: 68,
          taskName: '3',
          taskType: 0,
          status: 0,
          completeTime: 0,
          execTimes: 15
        }, {
          taskId: 67,
          taskName: '4',
          taskType: 0,
          status: 0,
          completeTime: 0,
          execTimes: 15
        }]
      },{
        taskId: 4,
        taskName: '5',
        taskType: 1,
        status: 0,
        completeTime: 0,
        execTimes: 15
      },{
        taskId: 14,
        taskName: '6',
        taskType: 1,
        status: 0,
        completeTime: 0,
        execTimes: 15
      }],
      multipleSelection: [],
      b : [
        {name : '小明' , age : 14} ,
        {name : '小红' , age : 15}
      ],
      groupData: [],
      menuVisible: false
    }
  },
  mounted() {
    // this.$refs.multipleTable1.bodyWrapper.id = 'solo'
    // this.$refs.multipleTable2.bodyWrapper.id = 'group'
    // this.$refs.multipleTable2.bodyWrapper.Ta
    // this.rowDrop()
  },
  methods: {
    // 自定义菜单的点击事件
    infoClick(index) {
      this.$alert('当前table的下标为'+this.currentRowIndex ,'你点击了自定义菜单的'+this.menus[index]+'功能', {
        confirmButtonText: '确定',
        callback: action => {
          var menu = document.querySelector("#menu");
          menu.style.display = 'none';
        }
      });
    },
    tableRowClassName2 ({row}) {
      if(row.taskType !== 2) {
        console.log('tableclass 2')
        return 'groupCSS'
      }
    },
    rightClick(row, column, event) {
      this.testModeCode = row.testModeCode
      this.menuVisible = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
      this.menuVisible = true // 显示模态窗口，跳出自定义菜单栏
      event.preventDefault() //关闭浏览器右键默认事件
      this.CurrentRow = row
      var menu = document.querySelector('.menu')
      this.styleMenu(menu, event)
    },
    foo() {
      // 取消鼠标监听事件 菜单栏
      this.menuVisible = false
      document.removeEventListener('click', this.foo) // 关掉监听，
    },
    styleMenu(menu, event) {
      const menuMinWidth = 100;   // menu 宽
      const offsetLeft = this.$el.getBoundingClientRect().left; // 容器左偏移
      const offsetWidth = this.$el.offsetWidth         // 容器宽
      const maxLeft = offsetWidth - menuMinWidth;
      const left = event.clientX - offsetLeft
      if (left > maxLeft) {
        menu.style.left = maxLeft+ 'px'
      } else {
        menu.style.left = left + 'px'
      }
      menu.style.top = event.pageY - 80 + 'px'  // 80: table header-height
    },
    tableRowClassName ({ row }) {
      // console.log('row')
      // console.log(row)
      if(row.taskType === 2) {
        return 'rowBan'
      } else {
        return 'rowCan'
      }
    },
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        group: {
          name : '1',
          put: true,
          pull: true
        },
        filter: ".rowBan",
        onEnd(evt) {
          console.log(evt)
          console.log(evt.newIndex)
          if(evt.newIndex === 0){
            return false
          }
          const currRow = _this.tableData.splice(evt.oldIndex, 1)[0]
          _this.tableData.splice(evt.newIndex, 0, currRow)
        }
      })

      const tbody2 = document.querySelectorAll('.el-table__body-wrapper tbody')[1]
      Sortable.create(tbody2, {
        group: {
          name : '2',
          put: true,
          pull: true
        },
        onEnd(evt) {
          console.log(evt.oldIndex)
          console.log(evt.newIndex)
          if(evt.newIndex === 0){
            return false
          }
          var index = 0

          for(var i = 0; i < _this.groupData.length; i++) {
            for(var j = 0; j < _this.groupData[i].children; j++) {
              if(index < evt.newIndex < index + _this.groupData[i].children.length) {

                const currRow = _this.groupData[i].children.splice(evt.oldIndex-1, 1)[0]
                _this.groupData[i].children.splice(evt.newIndex-1,0,currRow)
                console.log(_this.groupData[i].children)
                console.log(_this.groupData[i].children[evt.oldIndex].taskName)

                index = index + _this.groupData[i].children.length
                break
              }

            }
          }
        }
      })

    },
    excTasks () {

    },
    groupByTask() {
      var groupFather={}
      this.$prompt('请输入组合名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        groupFather.taskName = value
        groupFather.taskId = 10086

        groupFather.taskType = 2
        groupFather.typeName = '组合任务'
        groupFather.status = 0
        groupFather.execTimes = this.multipleSelection.length
        groupFather.completeTime = 0
        groupFather.state = "未开始："+groupFather.completeTime+"/"+groupFather.execTimes
        groupFather.selectable = 0
        var groupChild = []
        groupChild = this.multipleSelection.concat()
        groupChild.filter(item => item.selectable = 0)
        groupFather.children = groupChild

        // this.tableData.filter(item => {
        //   var i
        //   for(i = 0; i<groupChild.length; i++) {
        //     console.log(i)
        //     console.log(item.taskId)
        //     console.log(groupChild[i].taskId)
        //     if(item.taskId === groupChild[i].taskId) {
        //       return false
        //     }
        //   }
        // })
        for(var i=0; i<this.tableData.length; i++) {
          for(var j = 0; j<groupChild.length; j++) {
            if(this.tableData[i].taskId === groupChild[j].taskId) {
              this.tableData.splice(i,1)
            }
          }
        }
        this.tableData.unshift(groupFather)
        // this.groupData.unshift(groupFather)
        // console.log(this.groupData)
        this.multipleSelection.length = 0
        this.$refs.multipleTable.clearSelection()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection)
    },
    selectable(row,index) {
      if(row.selectable === 0){
        return false
      } else {
        return true
      }
    },
    handleEdit(scope, index, row) {
      console.log(scope)
      console.log(index, row);

      this.dialogFormVisible = true
    },
    handleDelete(index, row) {
      console.log(index, row);
      // this.$set(this.b, 1 , {name : '小红' , age : 16})
      // this.$set(this.taskList[0], 'status' , 3)
      // this.$set(this.taskList[3], 'completeTime' , 15)

      this.$confirm('当前子任务将被删除, 此操作不可撤销，是否确定?', '删除子任务', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.tableData.splice(index,1)

        this.taskList = this.taskList.filter(item => item.taskId !== row.taskId)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      })

    },
    handleDelete2(index, row) {
      console.log(index, row);

      this.finishedTasks.splice(index,1)
    },
    handleControl(scope, index, row) {
      console.log(scope)
      console.log(index, row);
    },
    handleRecreate(scope, index, row) {
      console.log(scope)
      console.log(index, row);
      console.log(this.finishedTasks[index])
      var taskItem = this.finishedTasks[index]
      taskItem.finishedState = 0
      taskItem.status = 0
      taskItem.state = "未开始："+ 0 +"/"+taskItem.execTimes
    }
  },
  watch: {
    taskList: function (val) {
      this.taskList = val
    },
    tableData: function (val) {
      console.log('watch tableData')
      console.log(val)
      this.tableData = val
    },
    finishedTask: function (val) {
      this.finishedTask = val
    },
    b : {
      handler (newVal , oldVal) {
      } ,
      immediate : true
    }
  },
  computed: {
    taskNum: function () {
      // `this` 指向 vm 实例
      return this.taskList.length
    },
    groupNum: function () {
      return this.groupData.length
    },
    tasking: function () {
      return this.taskList.filter(item => item.status === 1).length
    },
    grouping: function () {
      return this.groupData.filter(item => item.status === 1).length
    },
    tableData: function () {
      var tableData = this.taskList

      tableData.map(item => {
          item.selectable = 1

          if(item.taskType === 0) {
            item.typeName = '实体设备测试'
          } else if(item.taskType === 1) {
            item.typeName = '虚拟设备测试'
          } else if(item.taskType === 2) {
            item.selectable = 0 //表示表格中不可选中
            item.typeName = '组合任务'
          }

          if(item.children !== undefined && item.taskType === 2) {
            item.execTimes = item.children.length
            item.completeTime = item.children.filter(child => child.status === 2).length
            // item.children.status = "进行中："+item.children.completeTime+"/"+item.children.execTimes
            item.children.map(child => {
              child.selectable = 0
              child.isChild = item.taskId //标志该元素为父类子元素
              if(child.completeTime > 0) {
                child.state = "进行中："+child.completeTime+"/"+child.execTimes
              } else {
                child.state = "未开始："+child.completeTime+"/"+child.execTimes
              }

              if(child.taskType === 0) {
                child.typeName = '实体设备测试'
              } else if(child.taskType === 1) {
                child.typeName = '虚拟设备测试'
              } else if(child.taskType === 2) {
                child.typeName = '组合任务'
              }
            })
          }
          // item.isChild = 0
          if(item.status === 1) {
            item.selectable = 0 //表示表格中不可选中
            item.state = "进行中："+item.completeTime+"/"+item.execTimes
          } else if (item.children !== undefined && item.children.filter(child => child.status === 1).length > 0) {
            item.state = "进行中："+item.completeTime+"/"+item.execTimes
          } else {
            item.state = "未开始："+item.completeTime+"/"+item.execTimes
          }

        })
      // this.groupData = tableData.filter(item => item.taskType === 2)
      // tableData = tableData.filter(item => item.taskType !== 2)
      console.log('tableData')
      console.log(tableData)
      tableData = tableData.filter(item => item.status === 0 || item.status === 1)
      return tableData
    },
    finishedTasks: function () {
      var finishedTasks = []
      this.taskList.map(item => {
        if(item.status === 3) {
          item.finishedState = "任务中断"
        } else if(item.status === 2){
          item.finishedState = "任务完成"
        }
      })
      console.log("finishedTask")
      finishedTasks = this.taskList.filter(item => item.status !== 0 && item.status !== 1)
      console.log(finishedTasks)
      return finishedTasks
    }
  }
}
</script>

<style>
.expire:hover{
  color: black;
}
.tasklist {
  margin-left: 20px;
  margin-top: 100px;
}
.finishedtask {
  margin-right: 80px;
  margin-top: 50px;
}
.el-table .groupCSS {
  background: #f0f9eb;
}

.contextmenu__item {
  display: block;
  line-height: 34px;
  text-align: center;
}
.contextmenu__item:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.menu {
  position: absolute;
  background-color: #fff;
  width: 100px;
  /*height: 106px;*/
  font-size: 12px;
  color: #444040;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  white-space: nowrap;
  z-index: 1000;
}
.contextmenu__item:hover {
  cursor: pointer;
  background: #66b1ff;
  border-color: #66b1ff;
  color: #fff;
}
</style>
