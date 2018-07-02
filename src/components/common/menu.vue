<template>
  <el-aside class="menuBarWrap" width="200px">
    <el-menu class="menuBar" @open="handleOpen" :default-active="$route.path" :default-openeds="[fatherIndex]" :router="true" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :unique-opened="true">
      <template v-for="(item,index) in menu">
        <el-submenu :key="index" :index="index+''" v-if="item.c != undefined">
          <template slot="title">
            <i class="fa fa-circle-o" aria-hidden="true"></i>
            <span>{{item.n}}</span>
          </template>
          <el-menu-item v-for="(subItem,subInx) in item.c" :key="subInx" :index="'/'+subItem.u" :route="{path: '/'+subItem.u}">
            {{subItem.n}}
          </el-menu-item>
        </el-submenu>

        <el-menu-item :key="index" :index="'/'+item.u" :route="{path: '/'+item.u}" v-if="item.c == undefined">
          <i class="fa fa-circle-o" aria-hidden="true"></i>
          {{item.n}}
        </el-menu-item>
      </template>
    </el-menu>
  </el-aside>
</template>

<script>
import Cain from '@cain/'

export default {
  data () {
    return {
      menu: [],
      fatherIndex: -1
    }
  },
  mounted () {
    this.getMenuData()
  },
  methods: {
    async getMenuData () {
      // let menuList = Cain.getParam('menuList')
      // if (Cain.isBlank(menuList)) {
      //   menuList = await this.$httpJson.post('bs/rmnfBody', {roleId: Cain.getCookie('rootRoleId')})
      //   menuList = menuList.data
      //   sessionStorage.setItem('menuList', JSON.stringify(menuList))
      // } else {
      //   menuList = JSON.parse(menuList)
      // }
      let menuList = [
        {
          n: '用户管理',
          i: '用户管理',
          u: 'userManage'
        },
        {
          n: '审核管理',
          i: '审核管理',
          u: 'authManage'
        },
        {
          n: '申请管理',
          i: '申请管理',
          u: 'applyManage'
        }
      ]

      const proxy = menuList
      const pathName =
        this.$router.history.pending && this.$router.history.pending.fullPath
      let fatherIndex = -1
      if (!Cain.isBlank(pathName)) {
        // 处理选中
        proxy.forEach(function (n, i) {
          if (Cain.isBlank(n.c)) {
            if (pathName === '/' + n.u) {
              fatherIndex = i
            }
          } else {
            n.c.forEach(function (m, j) {
              if (pathName === '/' + m.u) {
                fatherIndex = i
              }
            })
          }
        })
      }

      this.fatherIndex = fatherIndex + ''
      this.menu = menuList
    },
    handleOpen (key, keyPath) {
      this.fatherIndex = '' + key
    }
  }
}
</script>

<style>
.menuBar {
  position: fixed;
  height: 100%;
  width: 200px;
}

.el-aside {
  color: #333;
  position: fixed;
  height: 100%;
  margin-top: 50px;
}
</style>
