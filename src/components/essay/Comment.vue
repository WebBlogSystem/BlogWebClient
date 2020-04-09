<template>
  <div class="comment">
    <div class="top">
      <span>({{comment.createtime}})</span>
      <span class="mr10 ml10 fc" @click="goOtherIndex(user)">{{user.username}}</span>
      <span>评论了:</span>
      <Button @click="addReply">回复</Button>
      <div v-if="replyList.length" class="showOrHide ml10">
        <Button type="dashed" size="small" @click="type = 1" v-if="type === 0">展开回复</Button>
        <Button type="dashed" size="small" @click="type = 0" v-if="type === 1">收起回复</Button>
      </div>
    </div>
    <div class="bottom">
      <span>{{comment.msg}}</span>
    </div>
    <Divider />
    <div v-if="type">
      <div v-for="(item, index) in replyList" :key="index">
        <reply :reply="item" @getReplyItem="getAddReplyItem"></reply>
      </div>
      <Divider dashed />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex"
import reply from "@/components/essay/Reply"
export default {
  components: {
    reply
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  data () {
    return {
      replyList: [],
      type: 0,
      isReply: 0,
      msg: '',
      user: {}
    }
  },
  props: ["comment"],
  watch: {
    comment (newVal, oldVal) {
      this.replyList = []
      this.type = 0
      this.isReply = 0
      this.msg = ''
      this.getUser(this.comment.userId)
      this.getReply()
    }
  },
  created () {
    this.replyList = []
    this.type = 0
    this.isReply = 0
    this.msg = ''
    this.getUser(this.comment.userId)
    this.getReply()
  },
  methods: {
    goOtherIndex (user) {
      this.$router.push({ path: "/otheruser/essaylist", query: { userId: user.id } })
    },
    getUser (userId) {
      var user_params = {
        userId,
        success: (res) => {
          this.user = res
        }
      }
      this.$store.dispatch("user/getUserByUserId", user_params)
    },
    getReply () {
      var comment_param = {
        commentsId: this.comment.id,
        success: (list) => {
          this.replyList = list
        }
      }
      this.$store.dispatch("reply/getReplyByComment", comment_param)
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
                value: _this.msg,
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
                commentsId: _this.comment.id,
                fromUserId: _this.userInfo.id,
                toUserId: _this.comment.userId,
                msg,
                success: (reply) => {
                  _this.getReply()
                  _this.msg = ""
                },
                fail: () => {
                  _this.$router.push("/logincenter/login")
                }
              }
              _this.$store.dispatch("reply/addReply", reply_param)
            } else {
              _this.$Message.error("长度不能为空且不能超过50位")
            }
          }
        })
      }
    },
    getAddReplyItem () {
      this.getReply()
    }
  }
}
</script>
<style scoped>
.comment .top .showOrHide{
  display: inline-block;
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
.fc{
  text-decoration: underline;
}
</style>
