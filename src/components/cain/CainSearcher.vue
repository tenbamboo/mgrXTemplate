<template>
  <div class="cainSearcherWrap">

    <ToggleForm>
      <el-form slot="form" :inline="true" size="mini" :label-width="this.labelWidth">
        <el-row :gutter="20">
          <el-col :span="colSpan" v-for="(item,index) in paramProxy" :key="'colSpan'+index">

            <el-form-item :label="item.label +'：'">

              <template v-if="item.type === 'text' || item.type === '' || item.type === undefined">
                <el-input v-model="formData[item.name]" v-if="enterEvent" @keyup.enter.native="enterEvent">
                  <template v-if="item.prepend" slot="prepend">{{item.prepend}}</template>
                </el-input>
                <el-input v-model="formData[item.name]" v-if="!enterEvent">
                  <template v-if="item.prepend" slot="prepend">{{item.prepend}}</template>
                </el-input>
              </template>

              <template v-else-if="item.type === 'date' ">
                <el-date-picker v-model="formData[item.name]" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
                </el-date-picker>
              </template>

              <template v-else-if="item.type === 'daterange' ">
                <el-date-picker v-model="formData[item.name]" value-format="yyyy-MM-dd" placeholder="选择日期" type="daterange" align="right" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </template>

              <template v-else-if="item.type === 'checkbox' ">
                <el-checkbox-group v-model="formData[item.name]" size="mini">
                  <el-checkbox-button v-for="(child,index) in item.children" :label="child.value" :key="(child.value+'')+index">{{child.label}}</el-checkbox-button>
                </el-checkbox-group>
              </template>

              <template v-else-if="item.type === 'select' || item.type === 'selectByCode' ">

                <template v-if="item.list !== undefined && item.list">

                  <el-select v-model="formData[item.name]" clearable placeholder="请选择">
                    <el-option v-for="(child,index) in item.list.source" :key="index" :label="child[item.list.label]" :value="child[item.list.value]"></el-option>
                  </el-select>
                </template>
                <template v-else>
                  <el-select v-model="formData[item.name]" clearable placeholder="请选择">
                    <el-option v-for="(child,index) in item.children" :key="(child.value+'')+index" :label="child.label" :value="child.value"></el-option>
                  </el-select>

                </template>

              </template>

            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="box-footer text-center">
        <el-button v-for="(item,index) in optBtn" :key="index" :type="item.type" @click="item.click">
          <i :class="item.icon" aria-hidden="true"></i>{{item.text}}</el-button>
      </div>
    </ToggleForm>
  </div>
</template>

<script>
// version 1.0.0
// createDate 2018-05-03

// 方法
// pushParam 插入param数据，一般用于动态获取数据之后再push到param总

// 参数说明
// param 基础参数
// colSpan 栅格化 0~24
// labelWidth 标签宽度
// enterEvent 全局回车事件
// optBtn 操作按钮信息

// param Array 基础参数详细说明
// label String 标签名
// name  String 属性名
// type  String 类型 input、select、date、daterange、checkbox、selectByCode 默认input
// children Object 子属性（只用类型为 select、checkbox 可用）
// children.label 显示的文字
// children.value 对应的值
// prepend String 类型为text专属 前置样式文本
// list Object 类型为select、checkbox 可用 注入一个list数据并指定value和label来动态生成，注意：如有此属性则children失效
// code String selectByCode专属字段 对应字典表的type字段，
// defaultValue Any 指定默认值

// optBtn Array 操作按钮详细说明
// icon String 图标信息
// text String 显示文本
// type String 类型 primary success info danger warn
// click Function 点击回调

// 例子写法
//  testJson: [
//     { label: 'test1', name: 'test11' },
//     { label: 'test2', name: 'test22', type: 'text' },
//     { label: 'test3', name: 'test33', type: 'date' },
//     { label: 'test4', name: 'test44', type: 'daterange' },
//     {
//       label: 'test5',
//       name: 'test55',
//       type: 'checkbox',
//       children: [
//         {
//           value: 1,
//           label: 'check1'
//         },
//         {
//           value: 2,
//           label: 'check2'
//         }
//       ]
//     },
//     {
//       label: 'test6',
//       name: 'test66',
//       type: 'select',
//       children: [
//         {
//           value: 1,
//           label: 'select1'
//         },
//         {
//           value: 2,
//           label: 'select2'
//         }
//       ]
//     },
//  {
//             label: '任务类型',
//             name: 'taskId',
//             type: 'select',
//             children: [ //如果有type为select、checkbox时，如果有list属性则children无效
//               { label: '健康成人', value: '健康成人' },
//               { label: '1型糖尿病儿童/青少年', value: '1型糖尿病儿童/青少年' },
//               { label: '1型糖尿病成人', value: '1型糖尿病成人' },
//               { label: '2型糖尿病成人', value: '2型糖尿病成人' },
//               { label: '妊娠糖尿病', value: '妊娠糖尿病' }
//             ],
//             list: {
//               source: this.taskList,
//               value: 'taskId',
//               label: 'taskName'
//             }
//           }
//   ],
// <CainSearcher :param="testJson"></CainSearcher>
// <CainSearcher :param="testJson" :enterEvent="searchData" ></CainSearcher>

import ToggleForm from '@cain/ToggleForm'
import Cain from '@cain/'
export default {
  props: {
    value: {},
    // 基础数据
    param: {
      type: Array
    },
    // 栅格化 1~24
    colSpan: {
      type: Number,
      default: 8
    },
    // 标签宽度
    labelWidth: {
      type: String,
      default: '110px'
    },
    // 全局回车事件
    enterEvent: {
      type: Function
    },
    optBtn: {
      type: Array
    }
  },
  data () {
    return {
      formData: {},
      paramProxy: this.param
    }
  },
  watch: {
    formData (n, l) {
      this.$emit('input', this.formData)
    }
  },
  mounted () {
    this.initParam()
  },
  methods: {
    async initParam () {
      for (let item of this.paramProxy) {
        if (item.type === 'checkbox') {
          this.$set(this.formData, item.name, [])
        } else if (item.type === 'selectByCode') {
          this.$set(item, 'children', await Cain.getCode(item.code, this.$http))
        }

        // 设置默认组件值
        if (!Cain.isBlank(item.defaultValue)) {
          this.$set(this.formData, item.name, item.defaultValue)
        }
      }
    },
    pushParam (item) {
      if (item.type === 'checkbox') {
        this.$set(this.formData, item.name, [])
      }
      this.paramProxy.push(item)
    }
  },
  components: {
    ToggleForm
  }
}
</script>

<style>

</style>
