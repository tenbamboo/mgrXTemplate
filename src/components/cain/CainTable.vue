<template>
  <div class="cainTableWrap">

    <el-table
    :data="resData"
    :default-sort="{prop:orderItemProxy, order:orderTypeProxy}"
    :highlight-current-row ="isRadio"
    @selection-change="_changeSelected"
    @current-change="_changeSelected"
    @sort-change="_tableSortBy"
     >
      <template v-if="isCheck">
        <el-table-column type="selection" width="55">
        </el-table-column>
      </template>
      <template v-for="(item,index) in paramProxy">
          <el-table-column
          :key="index"
          :prop="item.name"
          :label="item.label"
          :sortable='item.sortable === true ?"custom":false'
          :width='item.width'
          :formatter="item.formatter || _nullFormatter"
          >
          </el-table-column>
      </template>

        <template v-if="oper && oper.length !== 0">
           <el-table-column label="操作" :width="operWidth">
                <template slot-scope="scope">
                  <template  v-for="(item,index) in oper">
                    <el-button
                     size="small"
                     v-if="item.isShow ? item.isShow(scope) : true"
                     :key="index"
                     :type="item.btnType"
                     @click="item.click(scope)"
                     >{{item.label}}</el-button>
                  </template>
                </template>
           </el-table-column>
        </template>

    </el-table>

    <template v-if="!isHidePager">
      <el-pagination
          :page-sizes="pageSizes"
          :page-size="pageSize"
          :layout="layout"
          :total="pageTotal"
          @size-change="_tableHandleSizeChange"
          @current-change="_tableHandleCurrentChange"
          :current-page.sync="currentPage"
          >
      </el-pagination>
    </template>

  </div>
</template>
<script>
// version 1.1.4
// createDate 2017-10-10
// updateDate 2017-12-15  1.1.1
// updateDate 2018-04-25  1.1.2 增加sendJson字段，用于兼容不同请求方式
// updateDate 2018-04-26  1.1.3 增加success回调事件
// udpateDate 2018-04-26  1.1.4 增加setProps方法

// 各种方法
// reload(data) 重新请求数据，data为搜索参数
// getTableData() 获取当前表格所有数据
// getCheckedData() 获取选取的数据
// setTableData(data) 手动设置数据,建议关闭pager（isHidePager = true）
// exportTable(searchData) 导出数据 入参1->搜索数据
// setProps(data) 设置属性

// emit 事件
// 选取改变 @selectChange 返回选取的数组
// 选取改变 @success 返回数据

// param参数详细说明
// label 表头显示
// name 返回数据的Key
// width 长度请填写如200,300,400
// sortable 是否可排序 true faslse
// formatter 格式化数据
// backFormatter 指定后台格式化器使用，用于导出数据格式使用

// oper参数详细说明
// label 按钮显示内容
// btnType 按钮样式 详细样式参见Element
// click 点击事件回调
// isShow 控制是否显示

export default {
  props: {
    sendJson: {
      type: Boolean,
      default: true
    },
    url: {
      // 请求url
      type: String
    },
    searchData: {
      // 请求数据
      type: Object
    },
    param: {
      // 格式化表格内容
      type: Array
    },
    operWidth: {
      // 操作按钮区域的长度
      type: Number
    },
    oper: {
      // 操作按钮
      type: Array,
      required: false
    },
    isRadio: {
      // 是否可以单选
      type: Boolean,
      default: false
    },
    isCheck: {
      // 是否可以多选
      type: Boolean,
      default: false
    },
    orderType: {
      // 排序类型
      type: String
    },
    orderItem: {
      // 排序字段
      type: String
    },
    isHidePager: {
      // 是否隐藏分页模块
      type: Boolean,
      default: false
    },
    exportUrl: {
      // 导出表格URL
      type: String
    }
  },
  data () {
    return {
      paramProxy: this.param || {}, // 基本参数
      searchDataProxy: this.searchData || {}, // 搜索data
      resData: [], // 返回数据
      orderTypeProxy:
        this.orderType === 'desc'
          ? 'descending'
          : this.orderType === 'asc' ? 'ascending' : '', // ascending,descending
      orderItemProxy: this.orderItem,
      pageSize: 10, // 复写此字段时，也需要写pageSizes变量
      pageSizes: [10, 20, 50, 100], // 显示一页显示多少设置
      pageNo: 0,
      pageTotal: 0, // 总条数
      layout: 'total, sizes, prev, pager, next, jumper', // 配置显示顺序,
      selectedItems: null, // 选中的对象
      currentPage: 1, // 当前页码
      rejcetRunFlag: false // 阻止页码改变时再次执行标记
    }
  },
  mounted () {},
  methods: {
    // 重新加载数据
    // 参数1：searchData 搜索参数
    // 参数2： flag  是否重置页码
    reload (searchData, flag = true) {
      // this.$nextTick(() => {
      this.searchDataProxy = searchData
      this._requestData(flag)
      //
      // })
    },
    // 获取当前表格所有数据
    getTableData () {
      return this.resData
    },
    // 手动写入数据
    setTableData (data) {
      this.resData = data
    },
    // 获取选取的数据
    getCheckedData () {
      return this.selectedItems
    },
    exportTable (searchData) {
      if (!this.exportUrl) {
        alert('导出Url为空!!!')
        return false
      }
      let f = document.createElement('form')
      f.action = this.exportUrl
      f.method = 'post'
      f.target = ''
      f.style.display = 'none'
      document.body.appendChild(f)
      let o = searchData
      for (let i in o) {
        let input = document.createElement('input')
        input.type = 'hidden'
        input.name = i
        input.value = o[i] + ''
        f.appendChild(input)
      }

      let input = document.createElement('input')
      input.type = 'hidden'
      input.name = 'json'
      input.value = JSON.stringify(this.paramProxy)
      f.appendChild(input)

      f.submit()
      setTimeout(() => {
        f.remove()
      }, 500)
    },
    // 私有：当页码改变触发
    _tableHandleCurrentChange (v) {
      if (this.rejcetRunFlag) {
        this.pageNo = v - 1
        this._requestData()
        this.rejcetRunFlag = true
      }
    },
    // 私有：当一页显示多少数改变时触发
    _tableHandleSizeChange (v) {
      this.pageNo = 0
      this.pageSize = v
      this._requestData()
    },
    // 私有：触发表格排序
    _tableSortBy (o) {
      this.orderTypeProxy = o.order
      this.orderItemProxy = o.prop
      this._requestData(true)
    },
    // 私有：选中返回事件
    _changeSelected (items) {
      this.selectedItems = items
      this.$emit('selectChange', this.selectedItems)
    },
    // 私有：请求数据
    async _requestData (reSet) {
      if (!this.url) {
        alert('table Url没有写！！')
        return false
      }
      if (reSet) {
        this.pageNo = 0
        this.currentPage = 1
        this.rejcetRunFlag = false
        // if (!this.pageTotal) {
        //   this.currentPage = 1
        //   return false
        // }

        //
      }
      let p = this.$_.cloneDeep(this.searchDataProxy) || {}
      // this.formartSearchData(p)
      p.orderField = this.orderItemProxy || ''
      p.orderItem = this._tableGetOrderType()
      p.pageNo = this.pageNo * this.pageSize
      p.pageSize = this.pageSize
      let res = ''

      // if (this.sendJson) {
      res = await this.$http.post(this.url, p)
      // } else {
      //   res = await this.$http.post(this.url, p)
      // }
      this.rejcetRunFlag = true
      this.resData = res.data.result.results
      this.pageTotal = res.data.result.totalRecord
      this.$emit('success', res.data)
    },
    // 私有：格式化排序字段
    _tableGetOrderType () {
      return this.orderTypeProxy === 'descending' ? 'desc' : 'asc'
    },
    // 私有：空格式化器
    _nullFormatter (row, column, cellValue) {
      return cellValue
    },
    // 设置属性
    setProps (json) {
      if (json.param) {
        this.paramProxy = json.param
      }
      // if (json.sendJson) {
      //   this.sendJson = json.sendJson
      // }
      // if (json.url) {
      //   this.url = json.url
      // }
      // if (json.operWidth) {
      //   this.operWidth = json.operWidth
      // }
      // if (json.oper) {
      //   this.oper = json.oper
      // }
      // if (json.isRadio) {
      //   this.isRadio = json.isRadio
      // }
      // if (json.isCheck) {
      //   this.isCheck = json.isCheck
      // }
      // if (json.orderType) {
      //   this.orderType = json.orderType
      // }
      // if (json.orderItem) {
      //   this.orderItem = json.orderItem
      // }

      // if (json.isHidePager) {
      //   this.isHidePager = json.isHidePager
      // }

      // if (json.exportUrl) {
      //   this.exportUrl = json.exportUrl
      // }
    }
  }
}
</script>

<style>

</style>
