<template>
  <div id="letter">
    <div v-if="letterList.length <= 0">
      当前没有私信用户
    </div>
    <div v-else :class="{ scrollFinish: isLetterFinish, userListWrap: !0 }">
      <Scroll :on-reach-bottom="!isLetterFinish ? bottomAddLetter : stopAddLetter" height="600">
        <div class="userList">
          <div class="item" v-for="(item, index) in letterList" :key="index">
              <div class="avatar mr10">
                <!-- <div class="noRead" v-if="item.noRead > 0"><span>{{+item.noRead > 99 ? "99+ : item.noRead}}</span></div> -->
                <div class="noRead" v-if="item.noRead > 0"><span>{{item.noRead > 99 ? "99+" : item.noRead}}</span></div>
                <avatar :imgId="item.user.imgid"/>
              </div>
              <div class="briefContent">
                <div class="line">
                  <span class="mr10">{{item.user.username}}:</span>
                  <span v-if="item.latestLetterMsg">({{item.latestLetterMsg.createtime}})</span>
                  <Button type="dashed" class="ml10" @click="deleteLetter(item.letter.id)">删除私信</Button>
                  <Button type="dashed" class="ml10" @click="showLetterMsgList(item.letter, item.user, index)">打开私信</Button>
                </div>
                <div class="content" v-if="item.latestLetterMsg">{{item.latestLetterMsg.msg}}</div>
              </div>
          </div>
          <Divider v-if="isLetterFinish" size="small" class="fs10" dashed>已经到底了</Divider>
        </div>
      </Scroll>
    </div>
    <div class="drawer-letter" v-if="isShowDrawer">
      <Drawer
            :title="'与  '+current_user.username+'  的私信记录'"
            v-model="isShowDrawer"
            width="800"
            @on-close="resetData"
        >
        <div class="letterListWrap">
          <div :class="{ scrollFinish: isLetterMsgFinish, letterList: !0 }">
            <Scroll :on-reach-top="!isLetterMsgFinish ? topAddLetterMsg : stopAddLetterMsg" height="600">
              <div :class="{item: !0, leftLetter: userInfo.id === item.toUserId, rightLetter: userInfo.id === item.fromUserId}" :ref="'letterItem' + index" v-for="(item, index) in reversedLetterMsgList" :key="index">
                <div class="left">
                  <div class="avatar" v-if="userInfo.id === item.toUserId"><avatar :imgId="current_user.imgid" /></div>
                  <div class="avatar" v-if="userInfo.id === item.fromUserId"><avatar :imgId="userInfo.imgid" /></div>
                </div>
                <div :class="{ right:!0, rightLetterMsg:userInfo.id === item.fromUserId }">
                  <div class="top ml10 mr10">
                    {{item.createtime}}
                    <span v-if="userInfo.id === item.toUserId && item.flag === 1">
                      <Icon type="ios-checkmark" size="30"/>
                      已读
                    </span>
                    <Checkbox v-if="userInfo.id === item.toUserId && item.flag === 0" @on-change="flag => setLetterMsgFlag(flag, item, index)">未读</Checkbox>
                  </div>
                  <div class="bottom msg mr10 ml10">{{item.msg}}</div>
                </div>
              </div>
            </Scroll>

            <!-- <scroller :on-infinite="bottomAddLetter" height="70%">
              <div :class="{item: !0, leftLetter: item.left, rightLetter: item.right}" v-for="(item, index) in letterList" :key="index">
                <div class="avatar"><img src="@/assets/logo.png" width="30px" height="30px"></div>
                <div class="msg mr10 ml10">{{item.msg}}</div>
                <Checkbox v-model="item.isRead" :disabled="item.isRead">{{item.isRead? '已读': '未读'}}</Checkbox>
              </div>
            </scroller> -->
          </div>
        </div>
        <Form :model="formSend" label-colon>
          <FormItem label="回复私信" label-position="top">
            <Input type="textarea" v-model="formSend.msg" :rows="4" placeholder="请输入回复私信内容" />
          </FormItem>
        </Form>
        <div class="demo-drawer-footer">
          <Button style="margin-right: 8px" @click="isShowDrawer = false">取消</Button>
          <Button type="primary" @click="addLetterMsg">回复他</Button>
        </div>
      </Drawer>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex"
import avatar from "@/components/utils/Avatar"
export default {
  components: {
    avatar
  },
  data () {
    return {
      // 从state中获取
      socket: "",
      path: process.env.VUE_APP_WS + "/sendLetterMsg?userid=" + this.$store.state.user.userInfo.id,
      letterPath: "",
      isLetterFinish: !1,
      isLetterMsgFinish: !1,
      isShowDrawer: !1,
      letterList: [],
      letterPage: 0,
      letterMsgList: [],
      letterMsgPage: 0,
      current_user: {},
      current_letter: {},
      formSend: {
        msg: ""
      },
      letterSocket: []
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    reversedLetterMsgList: function () {
      var arr = new Array(...this.letterMsgList)
      return arr.reverse()
    }
  },
  created () {
    this.$store.commit("social/setLeftCurrent", 5)
    this.getLetterList()
  },
  destroyed () {
    this.letterSocket.map(item => {
      item.socket.close()
    })
  },
  methods: {
    initWebSocket () {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
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
      }
    },
    close () {
      console.log("close")
    },
    open () {
      console.log("onopen")
    },
    error () {
    },
    getMessage (msg) {
      var letterMsg = JSON.parse(msg.data)
      if (!letterMsg.isSend) {
        this.$Message.error(letterMsg.res)
      } else {
        if (this.letterMsgList.length % 10 === 0 && this.letterMsgList.length > 0) {
          this.isLetterMsgFinish = 0
          this.letterMsgList.pop()
        } else {
          this.isLetterMsgFinish = 1
        }
        this.letterMsgList.unshift(letterMsg.res)
        this.letterList[this.current_letter_index].latestLetterMsg = letterMsg
        this.$nextTick(function () {
          this.$refs['letterItem' + (this.letterMsgList.length - 1)][0].scrollIntoView(false)
        })
      }
    },
    deleteLetter (letterId) {
      var _this = this
      var letter_param = {
        letterId,
        success: () => {
          this.letterSocket.map(item => {
            if (letterId === item.letterId) {
              item.socket.close()
            }
          })
          this.$Message.success("删除成功")
          this.$router.go(0)
        },
        fail: () => {
          _this.$router.push("/logincenter/login")
        }
      }
      this.$store.dispatch("letter/deleteLetter", letter_param)
    },
    setLetterNoRead () {
      var _this = this
      var noRead_param = {
        letterId: this.current_letter.id,
        userId: this.userInfo.id,
        success: (nums) => {
          console.log(nums)
          this.letterList[this.current_letter_index].noRead = nums
        },
        fail: () => {
          _this.$router.push("/logincenter/login")
        }
      }
      this.$store.dispatch("letter/getNoReadLetterMsgNums", noRead_param)
    },
    setLetterMsgFlag (flag, letterMsg, index) {
      console.log(flag, index, letterMsg)
      var _this = this
      if (flag) {
        var letterMsg_param = {
          letterMsgId: letterMsg.id,
          success: () => {
            // this.setLetterNoRead()
            _this.letterMsgList[this.letterMsgList.length - 1 - index].flag = 1
          },
          fail: () => {
            _this.$router.push("/logincenter/login")
          }
        }
        this.$store.dispatch("letterMsg/switchFlag", letterMsg_param)
      }
    },
    resetData () {
      this.isLetterMsgFinish = !1
      this.isShowDrawer = !1
      this.letterMsgList = []
      this.letterMsgPage = 0
      this.current_user = {}
      this.current_letter = {}
      this.formSend.msg = ""
      this.socket.close()
    },
    letterOpen () {
    },
    letterClose () {
    },
    letterMessage (msg) {
      msg = JSON.parse(msg.data)
      this.letterList.map(item => {
        if (item.letter.id === msg.letterId) {
          item.noRead = msg.nums
          if (msg.latestLetterMsg) {
            item.latestLetterMsg = msg.latestLetterMsg
          }
        }
        return item
      })
    },
    letterError () {
    },
    getLetterList () {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        var letter_param = {
          userId: this.userInfo.id,
          page: ++this.letterPage,
          success: (letter) => {
            if (typeof (WebSocket) === "undefined") {
              this.$Notice.info({
                title: "浏览器版本过低",
                desc: "当前浏览器不支持WebSocket,请更换支持WebSocket的浏览器"
              })
            } else {
              letter.list.map(item => {
              // 实例化socket
                var letterPath = process.env.VUE_APP_WS + "/getLetterMsgNums?letterid=" + item.letter.id + "&userid=" + this.$store.state.user.userInfo.id
                var socket = new WebSocket(letterPath)
                this.letterSocket.unshift({ letterId: item.letter.id, socket })
                // 监听socket连接
                socket.onopen = this.letterOpen
                // 监听socket错误信息
                socket.onerror = this.letterError
                socket.onclose = this.letterClose
                // 监听socket消息
                socket.onmessage = this.letterMessage
              })
            }
            if (letter.list.length < 10) {
              this.isLetterFinish = !0
            }
            this.letterList = this.letterList.concat(letter.list)
          },
          fail: () => {
            _this.$router.push("/logincenter/login")
          }
        }
        this.$store.dispatch("letter/getLetterList", letter_param)
      }
    },
    getLetterMsgList (letterId) {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        var letter_param = {
          letterId,
          page: ++this.letterMsgPage,
          success: (letterMsgList) => {
            if (letterMsgList.list.length < 10) {
              this.isLetterMsgFinish = !0
            }
            this.letterMsgList = this.letterMsgList.concat(letterMsgList.list)
          },
          fail: () => {
            _this.$router.push("/logincenter/login")
          }
        }
        this.$store.dispatch("letterMsg/getLetterMsgList", letter_param)
      }
    },
    showLetterMsgList (current_letter, current_user, current_letter_index) {
      this.current_letter = current_letter
      this.current_user = current_user
      this.current_letter_index = current_letter_index
      this.getLetterMsgList(this.current_letter.id)
      this.isShowDrawer = !0
      this.initWebSocket()
      // 滚动到最底部
      // this.$nextTick(()=>{
      // })
      // this.$refs['letterItem' + (this.essayList.length - 1)][0].scrollIntoView()
    },
    bottomAddLetter () {
      return new Promise(resolve => {
        this.getLetterList()
        resolve()
      })
    },
    stopAddLetter () {
      return new Promise(resolve => {
        resolve()
      })
    },
    topAddLetterMsg () {
      // 页面获取 page = (Math.floor(this.letterList/10))
      // 掉接口 (page + 1)
      // 接口但会数据 list
      // 头部添加 list.concat(this.letterList.slice(0, page *10))
      return new Promise(resolve => {
        this.getLetterMsgList(this.current_letter.id)
        resolve()
      })
    },
    stopAddLetterMsg () {
      return new Promise(resolve => {
        resolve()
      })
    },
    addLetterMsg () {
      // 发送一条私信
      // 私信内容 前后去空格 str.replace(/(^\s*)|(\s*$)/g,"") 校验表单 发送的内容是否为空
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var rep_msg = this.formSend.msg.replace(/(^\s*)|(\s*$)/g, "")
        if (rep_msg.length >= 1 && rep_msg.length <= 50) {
          // 掉接口
          var letterMsgParam = {
            msg: rep_msg,
            letterId: this.current_letter.id,
            fromUserId: this.userInfo.id,
            toUserId: this.current_user.id
          }
          this.socket.send(JSON.stringify(letterMsgParam))
        } else {
          this.$Message.error("内容长度需要在1-50位")
        }
      }
      // 接口成功之后 this.letterList.push()
      // 滚动到最底部
      // this.$nextTick(()=>{
      // })
    }
  }
}
</script>
<style scoped>
.fs10{
  font-size: 10px;
}
.mr10{
  margin-right: 10px;
}
.ml10{
  margin-left: 10px;
}
#letter{
  width: 100%;
}
.userListWrap{
  width: 100%;
  position: relative;
}
.item .avatar{
  border: 1px solid #2d8cf0;
  border-radius: 5px;
  flex-shrink: 0;
  position: relative;
}
.userList>.item{
  padding: 10px 5px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e8eaec;
}
.userList>.item .noRead{
  position: absolute;
  top: -10px;
  right: -10px;
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
.userList>.item .briefContent{
  flex-grow: 1;
  overflow: hidden;
}
.userList>.item .briefContent .line {
  display: flex;
  align-items: center;
}
.userList>.item .briefContent .content{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.letterListWrap{
  padding: 5px;
  width: 100%;
  border: 1px solid #2d8cf0;
}
.letterListWrap .letterList{
  position: relative;
  width: 100%;
  height:100%;
}
.letterList .item{
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.letterList .item.leftLetter{
  justify-content: flex-start;
}
.letterList .item.rightLetter{
  /* justify-content: flex-end; */
  flex-direction: row-reverse;
}
.letterList .item .msg{
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.letterListWrap .rightLetterMsg{
  text-align: right;
}
</style>
