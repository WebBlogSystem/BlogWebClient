<template>
<div>
  <div id="social">
    <Dropdown trigger="click" placement="top-start">
      <Button type="primary">
        <span>社交</span>
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <DropdownMenu slot="list">
          <div @click="goPath('1')"><DropdownItem>评论</DropdownItem></div>
          <div @click="goPath('2')"><DropdownItem>回复</DropdownItem></div>
          <div @click="goPath('3')"><DropdownItem>关注</DropdownItem></div>
          <div @click="goPath('4')"><DropdownItem>粉丝</DropdownItem></div>
          <div @click="goPath('5')">
            <DropdownItem>
              <div class="letter">
                云信
                <div class="noRead" v-if="noRead > 0"><span>{{noRead > 99 ? "99+" : noRead}}</span></div>
              </div>
            </DropdownItem>
          </div>
      </DropdownMenu>
    </Dropdown>
  </div>
</div>
</template>
<script>
import { mapState } from "vuex"
export default {
  data () {
    return {
      socket: "",
      path: process.env.VUE_APP_WS + "/getHeaderNums?userid=" + this.$store.state.user.userInfo.id,
      noRead: 0
    }
  },
  created () {
    this.initWebSocket()
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
    open () {
      console.log("连接成功")
    },
    close () {
      console.log("连接关闭")
    },
    getMessage (msg) {
      console.log(msg.data)
      this.noRead = parseInt(msg.data)
    },
    error () {
      console.log("连接错误")
    },
    goPath (current) {
      let path = ''
      switch (current) {
        case '1':
          path = 'comment'
          break
        case '2':
          path = 'reply'
          break
        case '3':
          path = 'attention'
          break
        case '4':
          path = 'fan'
          break
        case '5':
          path = 'letter'
          break
        default:
          path = 'comment'
      }
      if (this.$route.path !== `/social/${path}`) {
        this.$store.commit('social/setLeftCurrent', current)
        this.$router.push(`/social/${path}`)
      }
    }
  }
}
</script>
<style scoped>
#social .ivu-dropdown-menu,
#social .ivu-dropdown-menu a{
  text-align: center
}
.letter{
  display: inline-block;
  position: relative;
}
.noRead{
  position: absolute;
  top: -14px;
  right: -22px;
  width:22px;
  height:22px;
  font-size:12px;
  text-align: center;
  border-radius: 50%;
  background-color: red;
  color: #fff;
  line-height: 22px;
  z-index: 100;
}
</style>
