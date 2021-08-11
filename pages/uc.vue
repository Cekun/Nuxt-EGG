<template>
  <div>
    <h1>用户中心</h1>
    <i class="el-icon-loading"  v-show="false"/>
    <div id="drag" ref="drag">
      <input type="file" id="file" @change="handleFileChange" />
    </div>

    <el-progress type="line" :percentage="uploadProgree" :stroke-width="16" />

    <div>
      <p>计算hash的进度</p>
      <el-progress type="line" :percentage="hashProgress" :stroke-width="20" :text-inside="true" />
    </div>

    <div>
      <div class="cube-container" :style="{width: cubeWidth+'px'}">
        <div class="cube" v-for="chunk in chunks" :key="chunk.name">
          <div
            :class="{
              'uploading': chunk.progress>0&&chunk.progress<100,
              'success': chunk.progress==100,
              'error': chunk.progress<0
            }"
            :style="{height: chunk.progress+'%'}"
          >
            <i class="el-icon-loading" style="color: #f56c6c" v-if="chunk.progress<100&&chunk.progress>0" />
          </div>
        </div>
      </div>
    </div>
    <div>
      <el-button type="primary" @click="uploadFile">上传</el-button>
    </div>
    
  </div>
</template>

<script>
const CHUNK_SIZE = 0.1*1024*1024;
import sparkMD5 from 'spark-md5'
export default {
  data() {
    return {
      file: null,
     // uploadProgree: 0,
      hashProgress: 0,
      chunks: []
    };
  },
  computed: {
    cubeWidth() {
      return Math.ceil(Math.sqrt(this.chunks.length))*16
    },
    uploadProgree() {
      if(!this.file || this.chunks.length)
        return 0
      const loaded = this.chunks.map(item=>item.chunk.size*item.progress)
                        .reduce((acc, cur) => acc+cur, 0)
      return Number((loaded*100/this.file.size).toFixed(2))
    }
  },
  async mounted() {
    const { data } = await this.$http("/user/info");
    this.bindEvents();
  },
  methods: {
    async blobToString(blob) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function () {
          const ret = reader.result
            .split("")
            .map(v => v.charCodeAt())
            .map(v => v.toString(16).toUpperCase())
            .join(" ");
          resolve(ret)
        };
        reader.readAsBinaryString(blob);
      });
    },
    async isImage(file) {
      return await this.isGif(file) || await this.isPNG(file) || await this.isJpg(file);
    },
    async isGif(file) {
      // GIF89a和GIF87a
      // 前面6个16进制，'47 49 46 38 39 61' 或 '47 49 46 38 37 61'
      const ret = await this.blobToString(file.slice(0, 6));
      const isGif = ret == "47 49 46 38 39 61" || ret == "47 49 46 38 37 61";
      return isGif;
    },
    async isPNG(file) {
      const ret = await this.blobToString(file.slice(0, 8));
      const isPng = ret == "89 50 4E 47 0D 0A 1A 0A"
      return isPng
    },
    async isJpg(file) {
      const len = file.size
      const start = await this.blobToString(file.slice(0, 2))
      const tail = await this.blobToString(file.slice(-2, len))
      const isjpg = (start == 'FF D8') && (tail == 'FF D9')
      return isjpg
    },
    bindEvents() {
      const drag = this.$refs.drag;
      drag.addEventListener("dragover", (e) => {
        drag.style.borderColor = "red";
        e.preventDefault();
      });
      drag.addEventListener("dragleave", (e) => {
        (drag.style.borderColor = "#eee"), e.preventDefault();
      });
      drag.addEventListener("drop", (e) => {
        const fileList = e.dataTransfer.files;
        drag.style.borderColor = "#eee";
        e.preventDefault();
        this.file = fileList[0];
      });
    },

    createFileChunk(file, size=CHUNK_SIZE) {
      const chunks = []
      let cur = 0
      while(cur < file.size) {
        chunks.push({ index: cur, file: file.slice(cur, cur+size) });
        cur+=size
      }
      return chunks
    },
    async calculateHashWorker() {
      return new Promise(resolve => {
        this.worker = new Worker('/hash.js')
        this.worker.postMessage({chunks: this.chunks})
        this.worker.onmessage = e=> {
          const { progress, hash } = e.data
          this.hashProgress = Number(progress.toFixed(2))
          if(hash) resolve(hash)
        }
      })
    },
    async calculateHashIdle() {
      return new Promise(resolve => {
        const spark = new sparkMD5.ArrayBuffer()
        let count = 0;
        const chunks = this.chunks

        const appendToSpark = async file=> {
          return new Promise(resolve => {
            const reader = new FileReader()
            reader.readAsArrayBuffer(file)
            reader.onload = e => {
              spark.append(e.target.result)
              resolve()
            }
          })
        }

        const workloop = async deadline => {
          while(count < this.chunks.length && deadline.timeRemaining() > 1) {
            // 空闲时间，但有任务
            await appendToSpark(chunks[count].file)
            count++
            if(count < chunks.length) {
              this.hashProgress = Number(((100+count)/chunks.length).toFixed(2))
            } else {
              this.hashProgress = 100
              resolve(spark.end())
            }
          }
          window.requestIdleCallback(workloop);
        }
        window.requestIdleCallback(workloop);
      })
    },

    // 布隆过滤器，判断一个数据存在与否
    // 1个G的文件， 抽样后5M以内
    // hash一样， 文件不一定一样
    // hash不一样， 文件一定不一样
    async calculateHashSimple() {
      return new Promise(resolve => {
        const spark = new sparkMD5.ArrayBuffer()
        const reader = new FileReader()

        const file = this.file
        const size = file.size
        const offset = 2*1024*1024
        // 第一个2M，最后一个区块数据全要
        let chunks = [file.slice(0, offset)]

        let cur = offset
        while(cur<size) {
          if (cur+offset>=size) {
            // 最后一个区块
            chunks.push(file.slice(cur, cur+offset))
          } else {
            // 中间区块
            const mid = cur+offset/2
            const end = cur+offset
            chunks.push(file.slice(cur, cur+2))
            chunks.push(file.slice(mid, mid+2))
            chunks.push(file.slice(end-2, end))
          }
          cur += offset
        }
        // 中间的，取前中后各2个字节
        reader.readAsArrayBuffer(new Blob(chunks))
        reader.onload = e=> {
          spark.append(e.target.result)
          this.hashProgress = 100
          resolve(spark.end())
        }
      })
    },

    async uploadFile() {
      // if (!(await this.isImage(this.file))) {
      //   this.$message({
      //     message: "文件格式不对",
      //     type: "warning",
      //   });
      //   return;
      // }

      const chunks = this.createFileChunk(this.file)
      // 创建一个worker线程，计算MD5 hash值
      // const hash = await this.calculateHashWorker()
      // const hash1 = await this.calculateHashIdle()
      // console.log('hash1: ', hash1);
      // console.log('文件hash: ', hash);
      // 抽样hash 不算全量
      // 布隆过滤器 损失一小部分的精度，换取效率
      const hash = await this.calculateHashSimple()
      this.hash = hash

      // 问一下后端， 文件是否上传过，如果没有，是否有存在切片
      const {data:{ uploaded, uploadedList }} = await this.$http.post('/checkfile', {
        hash,
        ext: this.file.name.split('.').pop()
      })
      if(uploaded) {
        // 秒传
        return this.$message('上传成功')
      } 
      // console.log('hash2: ', hash2);
      this.chunks = chunks.map((chunk, index) => {
        // 切片的名字
        const name = hash + '-' + index
        return { hash, name, index, chunk: chunk.file, progress: uploadedList.indexOf(name) >-1 ? 100 : 0 }
      })

      await this.uploadChunks(uploadedList)

    },

    async uploadChunks(uploadedList) {  

      const request = this.chunks
        .filter(chunk => uploadedList.indexOf(chunk.name)==-1)
        .map((chunk) => {
          // 转成promise
          const form = new FormData()
          form.append('chunk', chunk.chunk)
          form.append('hash', chunk.hash)
          form.append('name', chunk.name)
          return {form, index: chunk.index, error: 0}
        })
        // .map(({form, index}) => this.$http.post('/uploadfile', form, {
        //   onUploadProgress: progress => {
        //     this.chunks[index].progress = Number(
        //       ((progress.loaded / progress.total) * 100).toFixed(2)
        //     );
        //   }
        // }))
      
     
      // await Promise.all(request)  // 尝试申请tcp链接过多，也会造成卡顿
      // 异步的并发数量控制
      try {
        await this.sendRequest(request)
        const { code, url } = await this.mergeRequest()
        if(code == 0) 
          this.$message({
            message: '成功上传',
            type: 'success'
          });
      } catch (error) {
        this.$message.error('上传失败，请重试')
      }
      // const form = new FormData();
      // form.append("name", "file");
      // form.append("file", this.file);
      // const ret = await this.$http.post("/uploadfile", form, {
      //   onUploadProgress: (progress) => {
      //     this.uploadProgree = Number(
      //       ((progress.loaded / progress.total) * 100).toFixed(2)
      //     );
      //   },
      // });
      // if(ret.code === 0) 
      //   this.$message({
      //     message: '文件上传成功',
      //     type: 'success'
      //   });
    },

    // 上传可能报错，报错之后，进度条变红，开始重试
    // 一个切片重试失败三次，整体全部终止
    /** 控制发送请求的并发数
     * limit: 并发数
     */
    async sendRequest(chunks, limit=3) {
      return new Promise((resolve, reject) => {
        const len = chunks.length;
        if(len==0) resolve()
        let counter = 0
        let isStop = false
        const start = async () => {
          if(isStop) return
          const task = chunks.shift();
          if(task) {
            const { form, index } = task
            try {
              await this.$http.post('/uploadfile', form, {
                onUploadProgress: progress => {
                  this.chunks[index].progress = Number(
                    ((progress.loaded / progress.total) * 100).toFixed(2)
                  )
                }
              })
              if(counter==len-1) {
                // 最后一个任务
                resolve()
              } else {
                counter++
                start()
              }
            } catch (e) {
              this.chunks[index].progress = -1
              if(task.error<3) {
                // 报错三次重新执行
                task.error++
                chunks.unshift(task)
                start()
              } else {
                // 错误三次直接结束
                isStop = true
                reject(task.error)
              }
            }
            
          }
        }

        while(limit > 0) {
          // 启动limit个任务
          // 模拟延迟
          setTimeout(()=>{
            start()
          }, Math.random()*2000)
          limit-=1
        }
      })
    },
    mergeRequest() {
      this.$http.post('mergefile', {
        ext: this.file.name.split('.').pop(),
        size: CHUNK_SIZE,
        hash: this.hash
      })
    },
    handleFileChange(e) {
      const [file] = e.target.files;
      if (!file) return;
      this.file = file;
    },
  },
};
</script>

<style lang="scss" scoped>
#drag {
  height: 100px;
  line-height: 100px;
  border: 2px dashed #eee;
  text-align: center;
  vertical-align: middle;
  &:hover {
    border-color: red;
  }
}
.cube-container {
  .cube {
    width: 14px;
    height: 14px;
    line-height: 12px;
    border: 1px black solid;
    background: #eee;
    float: left;
    .success {
      background: green;
    }
    .uploading {
      background: blue;
    }
    .error {
      background: red;
    }
  }
}
</style>