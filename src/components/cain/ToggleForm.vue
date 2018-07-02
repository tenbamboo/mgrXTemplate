<template>
    <div>
        <div class="box " :class="'box-'+boxStyle">
            <div class="box-header with-border" @click="formStatus = !formStatus">
                <div class="title" v-if="title !==''">{{title}}</div>
                <div class="box-tools pull-right">
                    <button type="button" class="btn-box-tool">
                        <i class="fa " :class="{'fa-minus':formStatus,'fa-plus':!formStatus}"></i>
                    </button>
                </div>
            </div>
            <el-collapse-transition>
                <div class="box-body" v-show="formStatus">
                    <slot name="form"></slot>
                </div>
            </el-collapse-transition>
            <slot name="footer"></slot>
        </div>

    </div>
</template>
<script>
// version 1.0
// createDate 2018-01-22
// updateDate 2018-01-22

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    boxStyle: {
      type: String,
      default: 'primary' // warning,success,info,danger,default
    }
  },
  data () {
    return {
      formStatus: true // 折叠search
    }
  },
  mounted () {},
  methods: {}
}
</script>

<style  scoped  lang="scss" >
.title{
    font-weight: bold;
}
</style>
