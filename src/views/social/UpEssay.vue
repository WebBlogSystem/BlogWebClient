<template>
    <div class="upEssayList">
      <div class="upEssayListWrap">
        <Tabs type="card" @on-click="getUpEssay">
          <TabPane label="我赞的文章"></TabPane>
          <TabPane label="赞我的文章"></TabPane>
        </Tabs>
        <div v-if="upEssayList.length <= 0">
          <img :src="require('@/static/No.jpg')" height="100%" width="100%">
        </div>
        <div v-else>
          <!-- <Scroll :on-reach-bottom="!isReplyFinish ? bottomAddReply : stopAddReply" height="600"> -->
            <div class="upEssayList" v-for="(item,index) in upEssayList" :key="index">
              <Card :bordered="true" class="customCard item">
                <div class="line">
                  <div class="top" v-if="flag === 0">
                      <span>您对<a class="ml10 mr10" @click="goOtherIndex(item.user)">{{item.user.username}}</a>的<a class="mr10 ml10" @click="goOtherEssayDetail(item.essay)">{{item.essay.title}}</a>这篇文章点了赞</span>
                  </div>
                  <div class="top" v-if="flag === 1">
                      <a class="mr10" @click="goOtherIndex(item.user)">{{item.user.username}}</a>对您的<a class="ml10 mr10" @click="goOtherEssayDetail(item.essay)">{{item.essay.title}}</a>这篇文章点了赞
                  </div>
                </div>
              </Card>
              <Divider v-if="!(index === (upEssayList.length-1))" dashed />
            </div>
            <Divider v-if="isFinish && upEssayList.length > 0" size="small" class="fs10" dashed>已经到底了</Divider>
          <!-- </Scroll> -->
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
    this.getEssaysByUserUp()
    this.$store.commit("social/setLeftCurrent", 6)
    this.$store.commit("switchLoading", !1)
  },
  data () {
    return {
      upEssayList: [],
      upEssayPage: 0,
      isFinish: 0,
      // 0表示我赞的 1表示赞我的
      flag: 0
    }
  },
  methods: {
    getUpEssay (name) {
      this.upEssayPage = 0
      this.flag = +name
      this.isFinish = 0
      this.upEssayList = []
      this.getEssaysByUserUp()
    },
    goOtherEssayDetail (essay) {
      this.$store.commit("switchLoading", !0)
      this.$router.push({ path: '/otheruser/essaydetail', query: { essayId: essay.id, userId: essay.userId } })
    },
    goOtherIndex (user) {
      this.$store.commit("switchLoading", !0)
      this.$router.push({ path: "/otheruser/essaylist", query: { userId: user.id } })
    },
    getEssaysByUserUp () {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        var reply_param = {
          userId: this.userInfo.id,
          page: ++this.upEssayPage,
          flag: this.flag,
          success: (list) => {
            if (list.length < 10) {
              this.isFinish = 1
            }
            if (this.replyPage === 1) {
              this.upEssayList = list
            } else {
              this.upEssayList = this.upEssayList.concat(list)
            }
          },
          fail: () => {
            _this.$router.push("/logincenter/login")
          },
          actionError: (info) => {
            _this.$store.commit("switchLoading", !1)
            _this.$Message.error(info)
          }
        }
        this.$store.dispatch("social/getEssaysByUserUp", reply_param)
      }
    },
    scrollGetMore () {
      var _this = this
      if (document.documentElement.scrollTop + document.documentElement.clientHeight >= document.body.scrollHeight && !_this.isFinish) {
        _this.getEssaysByUserUp()
      }
    }
  },
  mounted () {
    window.addEventListener('scroll', this.scrollGetMore)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scrollGetMore)
  }
}
</script>
<style scoped>
.mr10{
  margin-right: 10px;
}
.ml10{
  margin-left: 10px;
}
</style>
