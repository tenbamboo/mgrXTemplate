<template>
  <div>
    <ToggleForm>
      <el-form slot="form" :inline="true" size="mini" :model="table.searchData">
        <el-form-item label="角色名称：">
          <el-input v-model="table.searchData.rn" @keyup.enter.native="searchData"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="box-footer text-center">
        <el-button type="primary" @click="searchData">
          <i class="fa fa-search" aria-hidden="true"></i>搜索</el-button>
        <el-button type="primary" @click="showRoleDialog('')">
          <i class="fa fa-plus-circle" aria-hidden="true"></i>添加</el-button>
      </div>
    </ToggleForm>
    <div class="box box-primary">
      <div class="box-body">
        <CainTable ref="cainTable" :param="table.param" :url="table.url" :sendJson="table.sendJson" :oper="table.oper">
        </CainTable>
      </div>
    </div>

    <el-dialog title="角色信息添加" :visible.sync="roleDialogStatus" width="30%">
      <div>
        <el-form status-icon :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="角色名称：" prop="rn">
            <el-input v-model="addForm.rn" :maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="角色编码：" prop="rc">
            <el-input v-model="addForm.rc"></el-input>
          </el-form-item>
          <el-form-item label="是否可用：" v-if="updateFlag">
            <el-radio-group v-model="addForm.iv">
              <el-radio :label="'1'">有效</el-radio>
              <el-radio :label="'0'">无效</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogStatus = false">取 消</el-button>
        <el-button type="primary" @click="operRole">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="权限菜单信息修改" :visible.sync="treeDialogStatus" width="30%">
      <el-form label-width="100px">
        <el-form-item label="角色名称：">
          <el-input v-model="tree.saveData.rn" readonly="readonly"></el-input>
        </el-form-item>
      </el-form>
      <label>角色权限：</label>
      <el-tree ref="roleTree" :data="tree.data" show-checkbox node-key="id" :default-expanded-keys="tree.expandedkeys" :default-checked-keys="tree.checkedKeys" :props="tree.defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="treeDialogStatus = false">取 消</el-button>
        <el-button type="primary" @click="operTreeRole">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import ToggleForm from '@cain/ToggleForm'
import Cain from '@cain/'
import CainTable from '@cain/CainTable'
export default {
  data () {
    return {
      formStatus: true,
      roleDialogStatus: false,
      treeDialogStatus: false,
      updateFlag: false,
      tree: {
        data: [],
        checkedKeys: [],
        expandedkeys: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        saveData: {}
      },
      addForm: {
        iv: '1'
      },
      addFormRules: {
        rn: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        rc: [{ required: true, message: '请输入角色编码', trigger: 'blur' }]
      },
      table: {
        sendJson: false,
        searchData: {},
        url: 'bs/roltwh',
        param: [
          { label: '角色名称', name: 'rn' },
          { label: '角色编码', name: 'rc' },
          {
            label: '是否有效',
            name: 'iv',
            formatter: this.roleEnableFormatter
          },
          { label: '创建时间', name: 'cd' }
        ],
        oper: [
          { label: '修改', click: this.showRoleDialog },
          { label: '权限', click: this.showTreeDialog }
        ]
      }
    }
  },
  mounted () {
    this.searchData()
  },
  methods: {
    searchData () {
      let p = this.table.searchData
      this.$refs.cainTable.reload(p)
    },
    operRole () {
      this.$refs['addFormRef'].validate(valid => {
        if (valid) {
          const url = this.updateFlag ? 'bs/roltmrs' : 'bs/roltcr'

          this.addForm.cr = this.$store.state.rootUserId
          this.addForm.mr = this.$store.state.rootUserId

          this.$http.post(url, this.addForm).then(
            response => {
              this.$notify({
                title: '提示',
                message: '操作成功',
                type: 'success'
              })
              this.roleDialogStatus = false
              this.searchData()
            },
            response => {}
          )
        } else {
          return false
        }
      })
    },
    showRoleDialog (scope) {
      this.updateFlag = false
      this.roleDialogStatus = true
      this.addForm = {}
      if (!Cain.isBlank(scope)) {
        this.addForm = this.$_.cloneDeep(scope.row)
        this.updateFlag = true
      } else {
        this.$refs['addFormRef'].resetFields()
      }
    },
    showTreeDialog (scope) {
      this.tree.saveData = this.$_.cloneDeep(scope.row)
      this.$http.post('bs/aultmr', this.tree.saveData).then(
        response => {
          let list = response.data.m
          let proxyList = []
          let checkedKeys = []
          let expandedkeys = []
          // 处理数据，生产array为eleTree格式
          for (var i in list) {
            let father = this.$_.find(list, { id: list[i].pId })

            // 设置选中
            if (list[i].checked === 'true') {
              checkedKeys.push(list[i].id)
            }

            // 判断如果没有找到父节点，则此节点为父节点
            if (Cain.isBlank(father)) {
              proxyList.push(list[i])
              // 设置父节点打开
              expandedkeys.push(list[i].id)
              continue
            }

            // 判断如果孩子为空则建立
            if (Cain.isBlank(father.children)) {
              father.children = []
            }
            // 设置孩子
            father.children.push(list[i])
          }

          this.tree.checkedKeys = checkedKeys
          this.tree.expandedkeys = expandedkeys
          this.tree.data = proxyList
          this.treeDialogStatus = true
        },
        response => {}
      )
    },
    operTreeRole () {
      var data = this.$_.cloneDeep(this.tree.saveData)
      data.mr = this.$store.state.rootUserId
      data.nodes = this.$refs.roleTree.getCheckedNodes()

      this.$http.post('bs/authrs', data).then(
        response => {
          this.$notify({
            title: '提示',
            message: '操作成功',
            type: 'success'
          })
          this.treeDialogStatus = false
          this.searchData()
        },
        response => {}
      )
    },
    roleEnableFormatter (row, column) {
      return row.iv === '0' ? '否' : '是'
    }
  },
  components: {
    CainTable,
    ToggleForm
  }
}
</script>

<style>

</style>
