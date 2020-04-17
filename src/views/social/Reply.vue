<template>
    <div class="reply">
      <div class="replyListWrap">
        <Tabs type="card" @on-click="getCommentFromOrToMe">
          <TabPane label="我回复的"></TabPane>
          <TabPane label="回复我的"></TabPane>
        </Tabs>
        <div v-if="replyList.length <= 0">
          <img :src="require('@/static/No.jpg')" height="100%" width="100%">
        </div>
        <div v-else>
          <Scroll :on-reach-bottom="!isReplyFinish ? bottomAddReply : stopAddReply" height="600">
            <div class="replyList" v-for="(item,index) in replyList" :key="index">
              <Card :bordered="true" class="customCard item">
                <div class="line">
                  <div class="top">
                      <span class="mr10">({{item.reply.createtime}}):</span>
                      <Button type="dashed" @click="deleteReply(item.reply.id, index)">删除回复</Button>
                  </div>
                  <div class="bottom" v-if="flag === 0">
                    <span class="mr10">您在</span>
                    <a @click="goOtherEssayDetail(item.essay)" class="fs mr10 essaylink">{{item.essay.title}}</a>
                    <span class="mr10">文章中向</span>
                    <a @click="goOtherIndex(item.user)" class="fs mr10 essaylink">{{item.user.username}}</a>
                    <span>回复了：</span>
                  </div>
                  <div class="bottom" v-if="flag === 1">
                    <a @click="goOtherIndex(item.user)" class="fs mr10 essaylink">{{item.user.username}}</a>
                    <span class="mr10">在</span>
                    <a @click="goOtherEssayDetail(item.essay)" class="fs mr10 essaylink">{{item.essay.title}}</a>
                    <span class="mr10">文章中向您</span>
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
              </Card>
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
      this.$store.commit("switchLoading", !0)
      this.$router.push({ path: '/otheruser/essaydetail', query: { essayId: essay.id, userId: essay.userId } })
    },
    goOtherIndex (user) {
      this.$store.commit("switchLoading", !0)
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
          flag: this.flag,
          success: (list) => {
            if (list.length < 10) {
              this.isReplyFinish = 1
            }
            if (this.replyPage === 1) {
              this.replyList = list
            } else {
              this.replyList = this.replyList.concat(list)
            }
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
    deleteReply (replyId, replyIndex) {
      this.$store.commit("switchLoading", !0)
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        var reply_param = {
          replyId,
          success: () => {
            this.$Message.success("删除成功")
            var fromPage = Math.floor(replyIndex / 10) + 1
            this.replyList.length = (fromPage - 1) * 10
            var pages = []
            if (this.replyList.length % 10 === 1) {
              this.page--
            }
            for (let i = fromPage, j = 0; i <= this.page; i++, j++) {
              pages[j] = i
            }
            pages = pages.map(item => {
              return new Promise((resolve, reject) => {
                var replyParam = {
                  page: item,
                  userId: this.userInfo.id,
                  success: (list) => {
                    resolve(list)
                  }
                }
                _this.$store.dispatch("reply/getReplyByUserId", replyParam)
              })
            })
            Promise.all(pages).then(function (replyList) {
              replyList.map(item => {
                _this.replyList = _this.replyList.concat(item)
                _this.isFinish = item.length < 10
              })
              _this.$store.commit("switchLoading", !1)
            })
          },
          fail: () => {
            _this.$router.push("/logincenter/login")
          }
        }
        this.$store.dispatch("reply/deleteReply", reply_param)
      }
    },
    getCommentFromOrToMe (name) {
      this.replyPage = 0
      this.flag = +name
      this.isReplyFinish = 0
      this.replyList = []
      this.getReplyByUserId()
    }
  },
  data () {
    return {
      replyList: [],
      replyPage: 0,
      isReplyFinish: 0,
      // 0表示我回复的 1表示回复我的
      flag: 0
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
