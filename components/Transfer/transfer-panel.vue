<template>
  <div class="el-transfer-panel">
    <p class="el-transfer-panel__header">
      <el-checkbox
        v-model="allChecked"
        @change="handleAllCheckedChange"
        :indeterminate="isIndeterminate"
      >
        {{ title }} 
        <span>{{ checkedSummary }}</span>
      </el-checkbox>
    </p>

    <div :class="['el-transfer-panel__body', filterable ? 'is-width-filter'  :'']">
      <el-input
        class="el-transfer-panel__filter"
        v-model="query"
        size="small"
        :placeholder="placeholder"
        @mouseenter.native="inputHover = true"
        @mouseleave.native="inputHover = false"
        v-if="filterable">
        <i slot="prefix"
          :class="['el-input__icon', 'el-icon-' + inputIcon]"
          @click="clearQuery"
        ></i>
      </el-input>
      <el-checkbox-group
        v-model="checked"
        v-show="!!data.length"
        class="el-transfer-panel__list"
      >
        <el-checkbox
          v-for="item in filteredData"
          class="el-transfer-panel__item"
          :key="item[keyProp]"
          :label="item[keyProp]"
        >
          {{item[keyProp]}} - {{item[labelProp]}}
          <!-- <option-content :option="item" /> -->
        </el-checkbox>
      </el-checkbox-group>
      <p v-show="!data.length" class="el-transfer-panel__empty">无数据</p>
    </div>
    <p class="el-transfer-panel__footer">
      <a class="pagination" v-if="pagination">
        <el-button type="text" size="small" @click="pageIndex-=1" :disabled="pageIndex==1">
          <i class="el-icon-arrow-left" />
        </el-button>
        <input type="text" v-model="pageIndex" @keydown.enter="$emit('changePageIndex',pageIndex)" /> 
        <span class="slash">/</span>
        {{ totalPage }}
        <span></span>
        <el-button type="text" size="small" @click="pageIndex+=1" :disabled="pageIndex==totalPage">
          <i class="el-icon-arrow-right" />
        </el-button>
      </a>
      <slot></slot>
    </p>
  </div>
</template>

<script>
export default {
  name: 'TransferPanel',
  inject: ['transfer'],
  props: {
    data: {
      type: Array,
      default() { return [] }
    },
    props: Object,
    title: String,
    pagination: Boolean,
    filterable: Boolean,
    filterMethod: Function,
    placeholder: {
      type: String,
      default: () => '请输入关键字'
    },
    dataLength: Number,
  },
  data() {
    return {
      allChecked: false,
      checked: [],
      pageIndex: 1,
      pageSize: 10,
      query: '',
      inputHover: false,
    }
  },
  computed: {
    filteredData() {
      const filteredData =  this.getFilteredData()
      return this.paging(filteredData, this.pageIndex)
    },
    isIndeterminate() {
      const checkedLength = this.checked.length
      const filteredData =  this.getFilteredData()
      return checkedLength > 0 && checkedLength < filteredData.length
    },
    checkedSummary() {
      const checkedLength = this.checked.length;
      const dataLength = this.data.length;
      // const { noChecked, hasChecked } = this.format;
      // if (noChecked && hasChecked) {
      //   return checkedLength > 0
      //     ? hasChecked.replace(/\${checked}/g, checkedLength).replace(/\${total}/g, dataLength)
      //     : noChecked.replace(/\${total}/g, dataLength);
      // } else {
        return `${ checkedLength }/${ dataLength }`;
      // }
    },
    keyProp() {
      return this.props.key || 'key';
    },    
    labelProp() {
      return this.props.label || 'label';
    },
    inputIcon() {
      return this.query.length > 0 && this.inputHover
        ? 'circle-close'
        : 'search';
    },
    totalPage() {
      var filteredData =  this.getFilteredData()
      return Math.ceil(filteredData.length / this.pageSize)
    }
  },
  watch: {
    checked(val, oldVal) {
      const movedKeys = val.concat(oldVal)
      this.$emit('checked-change', val)
    },
    data() {
      const checked = []
      const filteredDataKeys = this.filteredData.map(item => item[this.keyProp])
      this.checked.forEach(item => {
        if(filteredDataKeys.indexOf(item) > -1) {
          checked.push(item)
        }
      })
      this.checked = checked
    }
  },
  methods: {
    paging(arr, currentPage, pageSize = 10) {
      var skipNum = (currentPage - 1) * pageSize;
      var newArr =
        skipNum + pageSize >= arr.length
          ? arr.slice(skipNum, arr.length)
          : arr.slice(skipNum, skipNum + pageSize);
      return newArr;
    },
    getFilteredData() {
      return this.data.filter(item => {
        if(typeof this.filterMethod === 'function') {
          return this.filterMethod(this.query, item)
        } else {
          const label = item[this.labelProp] || item[this.keyProp].toString()
          return label.toLowerCase().includes(this.query.toLowerCase()) 
        }
      })
    },
    handleAllCheckedChange(val) {
      const filteredData =  this.getFilteredData()
      this.checked = val ? filteredData
        .map(item => item[this.keyProp]) : []
    },
    prevPage() {
      this.pageIndex -= 1
      // this.$emit('changePageIndex', this.pageIndex)
    },
    nextPage() {
      this.pageIndex += 1
      // this.$emit('changePageIndex', this.pageIndex)
    },
    clearQuery() {
      if (this.inputIcon === 'circle-close') {
        this.query = '';
      }
    }
  },
 
}
</script>

<style lang="scss" scoped>
.ck-transfer {
  
  .el-transfer-panel__body {
    height: 346px !important;
    .el-transfer-panel__list {
      height: 346px !important
    }
  }
  .is-width-filter {
    height: 408px !important;
    .el-transfer-panel__list {
      height: auto !important
    }
  }
  .el-transfer-panel__footer {
    .pagination {
      text-align: right;
      display: block;
      line-height: 40px;
      i {
        color: #000000d9;
      }
      input {
        width: 42px;
        text-align: center;
        height: 22px;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        outline: none;
        transition: border-color .3s;
      }
      .slash {
        padding: 0 10px;
      }
    }
  }
}

</style>