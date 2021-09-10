<template>
  <div class="el-transfer ck-transfer">
    <transfer-panel
      v-bind="$props"
      ref="leftPanel"
      :title="titles[0] || '列表1'"
      :data="sourceData"
    
      @checked-change="onSourceCheckedChange"
    >
      <slot name="left-footer"></slot>
    </transfer-panel>
    <div class="el-transfer__buttons">
      <el-button
        type="primary"
        :class="['el-transfer__button']"
        :disabled="rightChecked.length === 0"
        @click.native="addToLeft"
      >
        <i class="el-icon-arrow-left"></i>
      </el-button>
      <el-button
        type="primary"
        :class="['el-transfer__button']"
        :disabled="leftChecked.length === 0"
        @click.native="addToRight"
      >
        <i class="el-icon-arrow-right"></i>
      </el-button>
    </div>
    <transfer-panel
      v-bind="$props"
      ref="rightPanel"
      :title="titles[1] || '列表2'"
      :data="targetData"
     
      @checked-change="onTargetCheckedChange"
    >
      <slot name="right-footer"></slot>
    </transfer-panel>
  </div>
</template>

<script>
export default {
  name: 'ck-transfer',
  provide() { 
    return {
      transfer: this
    }
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    titles: {
      type: Array,
      default: () => [],
    },
    pagination: Boolean,
    filterable: Boolean,
    value: {
      type: Array,
      default: () => [],
    },
    props: {
      type: Object,
      default() {
        return {
          label: 'label',
          key: 'key',
          disabled: 'disabled'
        }
      }
    }
  },
  data() {
    return {
      leftChecked: [],
      rightChecked: [],
      leftPageIndex: 1,
      rightPageIndex: 1,
    };
  },
  computed: {
    sourceData() {
      // const pageIndex = this.leftPageIndex;
      const filterData = this.data.filter(item => this.value.indexOf(item[this.props.key]) === -1) 
      // this.leftDataLength = filterData.length
      return  filterData// this.paging(filterData,pageIndex)
    },
    targetData() {
      // const pageIndex = this.rightPageIndex;
      const filterData = this.data.filter(item => this.value.indexOf(item[this.props.key])>-1) 
      // this.rightDataLength = filterData.length
      return filterData//  this.paging(filterData,pageIndex) 
    },
    allDataLength() {
      return this.data.length
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
    leftPageIndexChange(val) {
      if(val) 
        this.leftPageIndex = val;
    },
    rightPageIndexChange(val) {
      if(val) 
        this.rightPageIndex = val;
    },
    onSourceCheckedChange(val) {
      this.leftChecked = val
    },
    onTargetCheckedChange(val) {
      this.rightChecked = val
    },
    addToLeft() {
      let currentValue = this.value.slice();
      console.log('currentValue', currentValue);
      this.rightChecked.forEach(item => {
        const index = currentValue.indexOf(item);
        if (index > -1) {
          currentValue.splice(index, 1);
           console.log('currentValue1', currentValue);
        }
      });
      this.$emit('input', currentValue);
      this.$emit('change', currentValue, 'left', this.rightChecked);
    },
    addToRight() {
      let currentValue = this.value.slice();
      const itemsToMoved = []
      const key = this.props.key
      this.data.forEach(item => {
        const itemKey = item[key]
        if(this.leftChecked.indexOf(itemKey) > -1) {
          itemsToMoved.push(itemKey)
        }
      })
      currentValue = [...currentValue, ...itemsToMoved]
      this.$emit('input', currentValue);
      this.$emit('change', currentValue, 'right', this.leftChecked);
    },
  },
};
</script>