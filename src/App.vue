<template>
  <el-container>

    <el-header class="el-header" :height="'50px'">
      <router-link :to="'/'">
        <a class="title">大连红娘</a>
      </router-link>
      <div class="operArea">
        <span></span>
        <span>{{userName}}</span>
        <a @click="logout">注销</a>
        <!-- <a  :href="oldMgrPath+'/'" target="_blank"  style="color: #fff;">切换旧版</a> -->
      </div>
    </el-header>
    <el-container>
      <CainMenu></CainMenu>
      <el-main id="app" :style="{minHeight:containerHeight}">
        <div class="titalBar clr">
          <h3 class="fl">{{titleArea.name}}</h3>
          <el-breadcrumb separator-class="el-icon-arrow-right" class="fr">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path:titleArea.path}">{{titleArea.name}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- <transition name="fade"> -->
          <router-view/>
        <!-- </transition> -->
      </el-main>
    </el-container>
    <!-- <el-footer>Footer</el-footer> -->
  </el-container>
</template>

<script>
import CainMenu from '@/components/common/menu'
import Cain from '@cain/'
export default {
  name: 'app',
  data () {
    return {
      userName: Cain.getCookie('rootUserName'), // sessionStorage.getItem('rootUserName'),
      containerHeight: 0,
      titleArea: this.$route
      // oldMgrPath: baseURL.oldMgrPath
    }
  },
  created () {
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route' (v) {
      this.titleArea = v
    }
  },
  mounted () {
    this.initContainer()
  },
  methods: {
    initContainer () {
      this.containerHeight = (window.screen.availHeight - 70 * 2) + 'px'
      //
    },
    logout () {
      localStorage.clear()
      sessionStorage.clear()
      window.location.href = window.location.origin + window.location.pathname + '/logout'
    }

  },
  components: {
    CainMenu
  }
}
</script>

<style lang="scss" scoped>
$headerColor: #3c8dbc;

.rootContainer .el-header {
  padding: 0;
  position: fixed;
  width: 100%;
  z-index: 10;
  background-color: $headerColor;
  color: #fff;
  line-height: 50px;
  height: 50px;
  font-weight: bold;
}

.el-header .title {
  width: 200px;
  display: inline-block;
  text-align: center;
  background-color: $headerColor;
  color: #fff;
  cursor: pointer;
  font-size: 1.2em;
  line-height: 0;
}

.el-header .title:hover,
.el-header .operArea a:hover {
  background-color: #317eab;
}

.el-header .operArea {
  float: right;
}

.el-header .operArea a {
  display: inline-block;
  margin-right: 10px;
  padding: 0 15px;
  cursor: pointer;
}

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

.el-main {
  margin-top: 50px;
  margin-left: 200px;
}
.titalBar{
  margin-bottom: 10px;
}
.titalBar .el-breadcrumb{
    float: right;
    line-height: 24px;
}
.fade-enter-active, .fade-leave-active{
  transition: opacity 0.2s
}
.fade-enter, .fade-leave-to {
   opacity: 0
}

</style>
