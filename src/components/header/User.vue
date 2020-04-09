<template>
  <div id="user">
    <Dropdown trigger="click">
      <Button type="primary">
          <span class="mr5 ml5">{{userInfo.username}}</span>
          <span>个人中心</span>
          <Icon type="ios-arrow-down"></Icon>
      </Button>
      <DropdownMenu slot="list">
          <div @click="goUser('1')"><DropdownItem>添加博文</DropdownItem></div>
          <div @click="goUser('2')"><DropdownItem>博客管理</DropdownItem></div>
          <div @click="goUser('3')"><DropdownItem>标签管理</DropdownItem></div>
          <div @click="goUser('4')"><DropdownItem>个人资料</DropdownItem></div>
          <div ><DropdownItem>活跃值:<span class="fc">{{userInfo.point}}</span></DropdownItem></div>
      </DropdownMenu>
    </Dropdown>
    <avatar :imgId="userInfo.imgid"/>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import avatar from '@/components/utils/Avatar'

export default {
  data () {
    return {
      socket: "",
      path: process.env.VUE_APP_WS + "/loginCheck?userid=" + this.$store.state.user.userInfo.id
    }
  },
  components: {
    avatar
  },
  created () {
    if (this.userInfo.id) {
      this.initWebSocket()
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    initWebSocket () {
      if (typeof (WebSocket) === "undefined") {
        this.$Notice.info({
          title: "浏览器版本过低",
          desc: "当前浏览器不支持WebSocket,请更换支持WebSocket的浏览器"
        })
      } else {
        // 实例化socket
        this.socket = new WebSocket(this.path)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        this.socket.onclose = this.close
        // 监听socket消息
        this.socket.onmessage = this.getMessage
      }
    },
    close () {
      console.log("User close")
    },
    open () {
      console.log("User onopen")
    },
    error () {
    },
    getMessage (msg) {
      var _this = this
      var loginCheck = JSON.parse(msg.data)
      if (!loginCheck.islogin) {
        this.$Notice.warning({
          title: "登录异常",
          desc: loginCheck.info,
          duration: 3,
          onClose: () => {
            _this.$store.commit("user/setUserInfo", {})
            _this.$router.go(0)
          }
        })
      }
    },
    goUser (current) {
      let path = ''
      switch (current) {
        case '4':
          path = 'userinfo'
          break
        case '1':
          path = 'addessay'
          break
        case '2':
          path = 'blogmanagement'
          break
        case '3':
          path = 'catemanagement'
          break
        default:
          path = 'addessay'
      }
      this.$router.push({ path: `/user/${path}` })
    }
  }
}
</script>
<style scoped>
#User .ivu-dropdown-menu,
#User .ivu-dropdown-menu a{
  text-align: center
}
.mr5{
  margin-right: 5px;
}
.ml5{
  margin-left: 5px;
}
.fc{
  color: #57a3f3;
}
</style>
