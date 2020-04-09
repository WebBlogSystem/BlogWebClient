<template>
  <div>
    <!-- <avatar :imgId="22"/> -->
    <div id="loading" v-if="loading">
      <loading></loading>
    </div>
    <div id="headerWrap">
      <myheader></myheader>
    </div>
    <div id="contentWrap">
      <router-view></router-view>
    </div>
    <div id="footerWrap">
      我的尾部
    </div>
  </div>
</template>
<script>
// import { sstorage } from '@/store/storage'
import loading from '@/components/utils/Loading'
import myheader from './views/nav/myheader'
import { mapState } from "vuex"
// import avatar from "@/components/utils/Avatar"

export default {
  computed: {
    ...mapState({
      loading: state => state.loading,
      isLoginPage: state => state.isLoginPage
    })
  },
  components: {
    loading,
    myheader
    // avatar
  }
}
</script>
<style scoped>
#loading{
  width:100px;
  height:100px;
  margin: auto;
  position: fixed;
  top:0;
  bottom:0;
  left:0;
  right:0;
}
#contentWrap{
  width: 960px;
  margin: 0 auto;
  border:1px solid #2d8cf0;
}
#footerWrap{
  height: 100px;
}
#contentWrap,
#footerWrap{
  border: 1px solid #2d8cf0;
  margin-top: 20px;
}
</style>
<style>
.scrollFinish .ivu-scroll-loader{
  display: none;
}
.scrollFinish .ivu-scroll-content{
  opacity: 1;
}
.fc{
  color: #57a3f3;
}
</style>
