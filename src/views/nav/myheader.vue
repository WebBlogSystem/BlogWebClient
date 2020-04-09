<template>
    <div id="myheader">
      <div class="myheader-wrap">
        <Menu mode="horizontal" theme="dark" active-name="1" class="headerMenu">
            <div class="logo left" @click="goHome">
              <logo></logo>
            </div>
            <div class="nav right">
                  <search class="item"></search>
                  <social class="item" v-if="islogin"></social>
                  <user class="item" v-if="islogin"></user>
                  <loginOrRegister class="item" v-if="!islogin"></loginOrRegister>
            </div>
        </Menu>
      </div>
    </div>
</template>
<script>
import logo from '@/components/header/Logo'
import search from '@/components/header/Search'
import social from '@/components/header/Social'
import user from '@/components/header/User'
import loginOrRegister from '@/components/header/LoginOrRegister'
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      islogin: state => state.user.userInfo.id
    })
  },
  components: {
    logo,
    search,
    social,
    user,
    loginOrRegister
  },
  methods: {
    goHome () {
      this.$router.push({ path: '/' })
    }
  }
}
</script>
<style scoped>
#myheader{
  width: 100%;
}
.myheader-wrap{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.headerMenu{
  width: 100%;
  padding:8px 50px;
  display: flex;
  justify-content: space-between;
}
.headerMenu .right{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.nav .item{
  margin-right:20px;
}
.nav .item:last-child{
  margin-right:0px;
}
</style>
