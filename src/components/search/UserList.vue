<template>
  <div>
    <div v-if="userList.length <= 0">
      <img :src="require('@/static/No.jpg')" height="100%" width="100%">
    </div>
    <div v-else class="userWrap">
      <div v-for="(item, index) in userList" :key="index" class="recommendWrapper" style="width: 200px;">
        <Card :bordered="true" class="customCard item" style="">
          <div class="recommendLeft">
            <div @click="goUsernIndex(item.user)">
              <avatar :imgId="item.user.imgid"></avatar>
            </div>
            <div class="ml10" @click="goUserIndex(item.user)">
              <div>
                {{item.user.username}}
              </div>
              <div>
                已有{{item.nums}}位粉丝
              </div>
            </div>
          </div>
          <div class="recommendRight">
            <Button class="btnColor" type="dashed" v-if="item.isAttention">已关注</Button>
            <Button class="btnColor" type="dashed" v-if="!item.isAttention" @click="addAttention(item)"><Icon type="ios-add"  />关注</Button>
          </div>
        </Card>
      </div>
      <Divider v-if="isFinish" size="small" class="fs10" dashed>已经到底了</Divider>
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
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  created () {
    console.log("list....")
    this.search = this.$route.query.search
    this.getUserList()
  },
  watch: {
    $route (to, from) {
      this.search = to.query.search
      console.log(this.search)
      this.page = 0
      this.totalPage = 1
      this.isFinish = 0
      this.userList = []
      this.getUserList()
    }
  },
  data () {
    return {
      userList: [],
      page: 0,
      totalPage: 1,
      isFinish: 0,
      search: ''
    }
  },
  mounted () {
    window.addEventListener('scroll', this.scrollGetMore)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scrollGetMore)
  },
  methods: {
    scrollGetMore () {
      var _this = this
      if (document.documentElement.scrollTop + document.documentElement.clientHeight >= document.body.scrollHeight && !_this.isFinish) {
        _this.getUserList()
      }
    },
    addAttention (item) {
      this.$store.commit("switchLoading", !0)
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        var attention_param = {
          fromUserId: _this.userInfo.id,
          toUserId: item.user.id,
          success: (nums) => {
            item.isAttention = !0
            item.nums = nums
            this.$store.commit("switchLoading", !1)
          },
          fail: () => {
            _this.$router.push("/logincenter/login")
          },
          actionError: (info) => {
            _this.$store.commit("switchLoading", !1)
            _this.$Message.error(info)
          }
        }
        _this.$store.dispatch("attention/addAttention", attention_param)
      }
    },
    goUserIndex (user) {
      this.$store.commit("switchLoading", !0)
      this.$router.push({ path: "/otheruser/essaylist", query: { userId: user.id } })
    },
    getUserList () {
      var _this = this
      var user_param = {
        page: ++_this.page,
        userId: 0,
        pageSize: 30,
        search: _this.search,
        success: (user) => {
          if (user.currentPage === user.totalPage) {
            _this.isFinish = 1
          }
          _this.userList = _this.userList.concat(user.list)
        },
        fail: () => {
          _this.$router.push("/")
        }
      }
      if (this.userInfo.id) {
        user_param.userId = this.userInfo.id
      }
      this.$store.dispatch("user/getRecommendUser", user_param)
    }
  }
}
</script>
<style scoped>
.fs10{
  font-size: 10px;
}
.userWrap{
  display: flex;
  flex-wrap: wrap;
}
.recommendWrapper{
  margin-right:20px;
  margin-bottom: 20px;
}
</style>
