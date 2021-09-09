<template>
  <div class="app-container">
    <el-button type="primary" size="default" @click="handleAdd">新增</el-button>

    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="form"
        ref="form"
        label-width="80px"
        :inline="false"
        size="normal"
      >
        <el-form-item label="菜单名称">
          <el-input v-model="form.meta.title"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-popover
            ref="menuListPopover"
            placement="bottom-start"
            trigger="click"
          >
            <el-tree
              ref="tree"
              :data="routesData"
              :props="defaultProps"
              node-key="path"
              class="permission-tree"
              :default-expand-all="true"
              :highlight-current="true"
              :expand-on-click-node="false"
              @current-change="menuListTreeCurrentChangeHandle"
            />
          </el-popover>
          <el-input
            v-model="form.ptitle"
            v-popover:menuListPopover
            :readonly="true"
            placeholder="点击选择上级菜单"
            class="menu-list__input"
            clearable
          />
        </el-form-item>
        <el-form-item label="路由">
          <el-input
            v-model="form.path"
            placeholder="请输入路由地址"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input
            v-model="form.meta.icon"
            placeholder="请输入图标"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirm">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
export default {
  data() {
    return {
      dialogVisible: false,
      routes: [],
      form: {
        meta: { title: "系统设置", icon: "setting" },
        // pid: '-1', //父级菜单ID
        path: "/setting",
        ptitle: ''
      },
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },
  computed: {
    routesData() {
      return this.routes 
    }
  },
  mounted() {
    this.getRoutes();
  },
  methods: {
    async getRoutes() {
      const res = await this.$http.get("/route");
      console.log('menu', res.data)
      if (res.code === 0) {
        this.serviceRoutes = res.data
        this.routes = this.generateRoutes(res.data) 
      }
    },
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (const route of routes) {

        const data  = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title,
          id: route._id
        }

        if(route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }

        res.push(data)
      }
      return res
    },
    menuListTreeCurrentChangeHandle(data) {
      console.log('change', data);
      this.form.pid = data.id,
      this.form.ptitle = data.title
    },
    handleAdd() {
      this.dialogVisible = true;
    },
    async confirm() {
      const res = await this.$http.post("/route/create", this.form);
      if (res.code === 0) {
        this.$message({
          type: "success",
          message: "创建成功!",
        });
        this.dialogVisible = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>