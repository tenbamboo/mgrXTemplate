<template>
  <div>
    <ToggleForm>
      <el-form slot="form" :inline="true" size="mini" :model="table.searchData">
        <el-form-item label="用户姓名：">
          <el-input v-model="table.searchData.qn" @keyup.enter.native="searchData"></el-input>
        </el-form-item>
        <el-form-item label="角色类型：">
          <el-select v-model="table.searchData.qr" clearable placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.i" :label="item.n" :value="item.i">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="table.searchData.qv" clearable placeholder="请选择">
            <el-option label="有效" :value="'1'"></el-option>
            <el-option label="无效" :value="'0'"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="box-footer text-center">
        <el-button type="primary" @click="searchData">
          <i class="fa fa-search" aria-hidden="true"></i>搜索</el-button>
        <el-button type="primary" @click="showDialog('')">
          <i class="fa fa-plus-circle" aria-hidden="true"></i>添加</el-button>
      </div>
    </ToggleForm>

    <div class="box box-primary">
      <div class="box-body">
        <CainTable ref="cainTable" :param="table.param" :url="table.url" :sendJson="table.sendJson" :oper="table.oper">
        </CainTable>
      </div>
    </div>

    <el-dialog title="用户信息" :visible="userDialogStatus" width="30%">
      <el-form status-icon :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户角色：" prop="fr">
          <el-select v-model="addForm.fr" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.i" :label="item.n" :value="item.i">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户名：" prop="fc" v-if="!updateFlag">
          <el-input v-model="addForm.fc" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名：" prop="fn">
          <el-input v-model="addForm.fn" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="用户密码：" prop="fp">
          <el-input v-model="addForm.fp" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="是否可用：" v-if="updateFlag">
          <el-radio-group v-model="addForm.fv">
            <el-radio :label="'1'">有效</el-radio>
            <el-radio :label="'0'">无效</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userDialogStatus = false">取 消</el-button>
        <el-button type="primary" @click="operUser">确 定</el-button>
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
      rolesList: [],
      userDialogStatus: false,
      updateFlag: false,
      addForm: {
        fv: '1'
      },
      addFormRules: {
        fr: [{ required: true, message: '请选择用户角色', trigger: 'change' }],
        fc: [{ required: true, message: '请输入账户名', trigger: 'blur' }],
        fn: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
        fp: [{ required: true, message: '请输入账户名', trigger: 'blur' }]
      },
      table: {
        sendJson: false,
        searchData: {},
        url: 'bs/urlt',
        param: [
          { label: '账户号', name: 'c' },
          { label: '用户姓名', name: 'n' },
          { label: '用户角色', name: 'r', formatter: this.userRoleFormatter },
          { label: '创建时间', name: 'd' },
          { label: '是否有效', name: 'v', formatter: this.roleEnableFormatter }
        ],
        oper: [{ label: '修改', click: this.showDialog }]
      }
    }
  },
  mounted () {
    this.searchData()
    this.getRolesList()
  },
  methods: {
    searchData () {
      let p = this.table.searchData
      this.$refs.cainTable.reload(p)
    },
    getRolesList () {
      this.$http.post('bs/rlnf').then(
        response => {
          this.rolesList = response.data
        },
        response => {}
      )
    },
    operUser () {
      this.$refs['addFormRef'].validate(valid => {
        if (valid) {
          const url = this.updateFlag ? 'bs/urchs' : 'bs/urcr'

          this.addForm.cr = Cain.getCookie('rootUserId')
          this.addForm.mr = Cain.getCookie('rootUserId')
          // this.addForm.i = Cain.getCookie('rootUserId')

          this.$http.post(url, this.addForm).then(
            response => {
              this.$notify({
                title: '提示',
                message: '操作成功',
                type: 'success'
              })
              this.userDialogStatus = false
              this.searchData()
            },
            response => {}
          )
        } else {
          return false
        }
      })
    },
    showDialog (scope) {
      this.addFormRules.fp[0].required = true
      this.updateFlag = false
      this.addForm = {}
      if (this.$refs['addFormRef']) {
        this.$refs['addFormRef'].resetFields()
      }

      if (!Cain.isBlank(scope)) {
        this.updateFlag = true
        let t = this.$_.cloneDeep(scope.row)
        t.r = t.r + ''
        this.$set(this.addForm, 'fr', t.r)
        this.$set(this.addForm, 'fv', t.v)
        // this.addForm.fr = t.r
        this.addForm.fc = t.c
        this.addForm.fn = t.n
        this.addForm.fp = t.p
        // this.addForm.fv = t.v
        this.addForm.i = t.i

        this.addFormRules.fp[0].required = false
      }
      this.userDialogStatus = true
    },
    roleEnableFormatter (row, column) {
      return row.v === '0' ? '否' : '是'
    },
    userRoleFormatter (row, column) {
      let t = this.$_.find(this.rolesList, { i: row.r + '' })
      if (Cain.isBlank(t)) {
        return '--'
      }
      return t.n
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
