<template>
<div class="reply">
  <div>
    <span>({{reply.createtime}})</span>
    <span class="fc mr10 ml10" @click="goOtherIndex(fromUser)">{{fromUser.username}}</span>
    <span>对</span>
    <span class="fc mr10 ml10" @click="goOtherIndex(toUser)">{{toUser.username}}</span>
    <span>回复了:</span>
    <div class="showReply">
      <Button type="dashed" size="small" shape="circle" @click="addReply">回复</Button>
    </div>
  </div>
  <div>
    <span>{{reply.msg}}</span>
  </div>
</div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      fromUser: {},
      toUser: {},
      msg: ""
    }
  },
  props: {
    reply: {
      required: true
    }
  },
  watch: {
    reply (newVal) {
      this.reply = newVal
      this.getUser(newVal.fromUserId, 0)
      this.getUser(newVal.toUserId, 1)
    }
  },
  created () {
    // 0表示from,1表示to
    this.getUser(this.reply.fromUserId, 0)
    this.getUser(this.reply.toUserId, 1)
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    goOtherIndex (user) {
      this.$router.push({ path: "/otheruser/essaylist", query: { userId: user.id } })
    },
    getUser (userId, userIndex) {
      var user_params = {
        userId,
        success: (user) => {
          if (userIndex === 0) {
            this.fromUser = user
          } else if (userIndex === 1) {
            this.toUser = user
          }
        }
      }
      this.$store.dispatch("user/getUserByUserId", user_params)
    },
    addReply () {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        this.$Modal.confirm({
          render: (h) => {
            return h('Input', {
              props: {
                value: this.msg,
                autofocus: true,
                placeholder: '回复信息...'
              },
              on: {
                input: (val) => {
                  this.msg = val
                }
              }
            })
          },
          onOk: () => {
            var msg = _this.msg.replace(/(^\s*)|(\s*$)/g, "")
            if (msg.length > 0 && msg.length <= 50) {
              var reply_param = {
                commentsId: _this.reply.commentsId,
                fromUserId: _this.userInfo.id,
                toUserId: _this.reply.fromUserId,
                msg,
                success: (reply) => {
                  _this.$emit("getReplyItem")
                  _this.msg = ""
                },
                fail: () => {
                  _this.$router.push("/logincenter/login")
                }
              }
              this.$store.dispatch("reply/addReply", reply_param)
            } else {
              this.$Message.error("信息长度在1-50位之间")
            }
          }
        })
      }
    }
  }
}
</script>
<style scoped>
.reply .showReply{
  display: inline-block;
}
.fc{
  text-decoration: underline;
}
.mr10{
  margin-right: 10px;
}
.ml10{
  margin-left: 10px;
}
.mt10{
  margin-top: 10px;
}
.mb10{
  margin-bottom: 10px;
}
</style>
