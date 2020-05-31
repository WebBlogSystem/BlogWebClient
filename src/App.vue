<template>
  <div class="AppHome">
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
      <span class="fs fc">MiniBlog(vue+MVC),需要源代码请联系qq:1306104920</span>
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
  z-index: 250;
}
#contentWrap{
  width: 960px;
  margin: 0 auto;
}
#contentWrap{
  margin-bottom: 20px;
  margin-top:80px;
}
#footerWrap{
  position: fixed;
  bottom: 0;
  width: 100%;
}
#headerWrap{
  position: fixed;
  top:0;
  width:100%;
  z-index: 1000;
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
.fs{
  font-size: 20px;
}
html{
  height: 100%;
}
body{
  background-image: url("./assets/blue-snow.png");
  background-attachment: fixed;
}
.bgImg{
  width: 100%;
  height: 100%;
  background-image: url("./static/No.jpg");
  background-size: cover;
}
.customCard{
  background: #DFE4ED !important;
}
#footerWrap{
  text-align: center;
}
</style>
