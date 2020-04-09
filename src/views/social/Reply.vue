<template>
    <div class="reply">
      <div class="replyListWrap">
        <div v-if="replyList.length <= 0">
          当前您没有回复他人信息
        </div>
        <div v-else>
          <Scroll :on-reach-bottom="!isReplyFinish ? bottomAddReply : stopAddReply" height="600">
            <div class="replyList" v-for="(item,index) in replyList" :key="index">
              <div class="item">
                <div class="line">
                  <div class="top">
                      <span class="mr10">({{item.reply.createtime}}):</span>
                      <Button type="dashed" @click="deleteReply(item.reply.id)">删除回复</Button>
                  </div>
                  <div class="bottom">
                    <span class="mr10">您在</span>
                    <a @click="goOtherEssayDetail(item.essay)" class="fs mr10 essaylink">{{item.essay.title}}</a>
                    <span class="mr10">文章中向</span>
                    <a @click="goOtherIndex(item.touser)" class="mr10 essaylink">{{item.touser.username}}</a>
                    <span>回复了：</span>
                  </div>
                </div>
                <div class="line">
                  <Poptip trigger="hover" title="当前回复内容" :content="item.reply.msg">
                      <div class="content">
                        {{item.reply.msg}}
                      </div>
                  </Poptip>
                </div>
              </div>
              <Divider v-if="!(index === (replyList.length-1))" dashed />
            </div>
            <Divider v-if="isReplyFinish && replyList.length > 0" size="small" class="fs10" dashed>已经到底了</Divider>
          </Scroll>
        </div>
      </div>
    </div>
</template>
<script>
import { mapState } from "vuex"
export default {
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  created () {
    this.getReplyByUserId()
    this.$store.commit("social/setLeftCurrent", 2)
    this.$store.commit("switchLoading", !1)
  },
  methods: {
    goOtherEssayDetail (essay) {
      this.$router.push({ path: '/otheruser/essaydetail', query: { essayId: essay.id, userId: essay.userId } })
    },
    goOtherIndex (user) {
      this.$router.push({ path: "/otheruser/essaylist", query: { userId: user.id } })
    },
    getReplyByUserId () {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        var reply_param = {
          userId: this.userInfo.id,
          page: ++this.replyPage,
          success: (list) => {
            if (list.length < 10) {
              this.isReplyFinish = 1
            }
            this.replyList = this.replyList.concat(list)
          },
          fail: () => {
            _this.$router.push("/logincenter/login")
          }
        }
        this.$store.dispatch("reply/getReplyByUserId", reply_param)
      }
    },
    bottomAddReply () {
      return new Promise(resolve => {
        this.getReplyByUserId()
        resolve()
      })
    },
    stopAddReply () {
    },
    deleteReply (replyId) {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        var reply_param = {
          replyId,
          success: () => {
            this.$Message.success("删除成功")
            this.$router.go(0)
          },
          fail: () => {
            _this.$router.push("/logincenter/login")
          }
        }
        this.$store.dispatch("reply/deleteReply", reply_param)
      }
    }
  },
  data () {
    return {
      replyList: [],
      replyPage: 0,
      isReplyFinish: 0
    }
  }
}
</script>
<style scoped>
.replyList{
    font-size: 16px;
}
.replyListWrap{
  width: 100%;
  height: 600px;
  position: relative;
}
.replyList .mr10{
    margin-right: 10px;
}
.replyList .essaylink{
    text-decoration: underline;
}
.replyList .line{
  display: flex;
  flex-direction: column;
}
.replyList .content{
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
.replyList .item:last-child{
    border-bottom:none;
}
.fs10{
  font-size: 10px;
}
</style>
