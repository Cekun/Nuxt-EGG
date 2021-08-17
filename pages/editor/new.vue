<template>
  <div>
    <!-- <div contenteditable="true">阿萨斯</div> -->
    <div class="write-btn">
      <el-button @click="submit" type="primary">提交</el-button>
    </div>
    <el-row>
      <el-col :span="12">
        <textarea ref="editor" class="md-editor" :value="content" @input="update" ></textarea>
      </el-col>
      <el-col :span="12">
        <div class="markdown-body" v-html="compiledContent"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import marked from 'marked'
export default {
  data() {
    return {
      // timer:
      content: `# 🍚吧${String(Math.random()).slice(2, 6)}
* 睡觉
* 吃饭
* 写代码

\`\`\`javascript

  let a =1;
  console.log(a)
\`\`\`
      `,
    };
  },
  mounted () {
    this.timer = null;
  },
  computed: {
    compiledContent() {
      return marked(this.content, {})
    }
  },
  methods: {
    update(e) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.content = e.target.value
      }, 350)
    },
    async submit() {
      let ret =  await this.$http.post('/article/create', {
        content: this.content,
        compiledContent: this.compiledContent
      })
      if(ret.code==0) {
        this.$notify({
          title: '创建成功',
          type: 'success',
          message: `文章《${ret.data.title}》创建成功`
        })
        setTimeout(() => {
          this.$router.push({ path:'/article/'+ret.data.id})
        }, 300);
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.md-editor{
  width:95%;
  height:100vh;
  outline: none;
}
.write-btn{
  position: fixed;
  z-index:100;
  right:30px;
  top:70px;
}
.markdown-body pre{
  background:#23241f;
  color:#f92672;
}
</style>