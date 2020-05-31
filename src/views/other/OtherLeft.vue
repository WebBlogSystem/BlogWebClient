<template>
  <div class="otherLeft">
    <div class="leftTop">
      <Card style="width:250px">
        <div class="line">
            <div v-if="user.imgid || user.imgid == 0" class="center">
              <avatar :imgId="user.imgid" />
            </div>
            <div class="lineItem">
              <span>作者:</span>{{user.username}}
            </div>
            <div class="lineItem">
              <span>个人简介:</span>
              <span class="userInfoBlock">{{user.intro}}</span>
            </div>
        </div>
        <div class="line btnWrap" v-if="user.id !== userInfo.id">
          <Button type="info" class="btn" @click="addAttention(user.id)" v-if="!type">关注</Button>
          <Button type="info" class="btn" @click="deleteAttention(user.id)" v-if="type">取消关注</Button>
          <Button type="info" @click="addLetter(user.id)" v-if="!letterType">私信</Button>
        </div>
      </Card>
    </div>
    <div class="leftBottom">
      <!-- <Menu :active-name="cateId" class="customMenu">
        <MenuGroup title="全部标签">
          <MenuItem v-for="(cate, index) in cateList" :key="index" :name="cate.id" @click.native="goCateEssayList(cate.id)">
            {{cate.id}}{{cate.name}}
          </MenuItem>
        </MenuGroup>
      </Menu> -->
      <Card style="width:250px">
          <p slot="title">
            全部标签
          </p>
          <div v-if="cateList.length > 0" class="cateListWrapper">
            <div v-for="(cate,index) in cateList" :key="index" class="ml10 cateItem" @click="goCateEssayList(cate.cate.id)">
              <div><a>{{cate.cate.name}}</a></div>
              <div>{{cate.nums}}篇</div>
            </div>
          </div>
          <div v-else>
            当前用户暂无标签
          </div>
      </Card>
    </div>
  </div>
</template>
<script>
import avatar from "@/components/utils/Avatar"
import { mapState } from 'vuex'
// import login from '@/api/loginApi'
export default {
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  data () {
    return {
      user: {},
      type: 0,
      cateList: [],
      currentCate: '4-' + (this.$route.query.cateId ? (+this.$route.query.cateId) : 0),
      // 0表示未建立私信, 1 表示已建立私信
      letterType: 0
    }
  },
  created () {
    this.initData()
  },
  watch: {
    $route (to, from) {
      this.currentCate = '4-' + (this.$route.query.cateId ? (+this.$route.query.cateId) : 0)
      this.initData()
    }
  },
  methods: {
    initData () {
      var userId = +(this.$route.query.userId)
      if (userId) {
        this.getUser(userId)
        this.getCates(userId)
      } else {
        this.$router.replace("/")
      }
    },
    getLetter (userId) {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        var letter_param = {
          userId1: _this.userInfo.id,
          userId2: userId,
          success: (letter) => {
            if (letter) {
              _this.letterType = 1
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
        _this.$store.dispatch("letter/getLetter", letter_param)
      }
    },
    addAttention (userId) {
      this.$store.commit("switchLoading", !0)
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        var attention_param = {
          fromUserId: _this.userInfo.id,
          toUserId: userId,
          success: () => {
            _this.type = 1
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
    deleteAttention (userId) {
      this.$store.commit("switchLoading", !0)
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        var attention_param = {
          fromUserId: this.userInfo.id,
          toUserId: userId,
          success: () => {
            this.type = 0
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
        this.$store.dispatch("attention/deleteAttention", attention_param)
      }
    },
    goCateEssayList (cateId) {
      if (('4-' + cateId) !== this.currentCate) {
        console.log(cateId)
        this.$store.commit("switchLoading", !0)
        this.$router.replace({ path: "/otheruser/essaylist", query: { userId: this.user.id, cateId } })
      }
    },
    getUser (userId) {
      var _this = this
      var user_params = {
        userId,
        success: (res) => {
          _this.user = res
          if (_this.userInfo.id) {
            _this.getAttention(_this.user.id)
            _this.getLetter(userId)
          }
        },
        fail: (info) => {
          _this.$Message.error(info)
        },
        actionError: (info) => {
          _this.$store.commit("switchLoading", !1)
          _this.$Message.error(info)
        }
      }
      this.$store.dispatch("user/getUserByUserId", user_params)
    },
    getAttention (userId) {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        var attentionParams = {
          fromUserId: this.userInfo.id,
          toUserId: userId,
          success: (res) => {
            if (res) {
              _this.type = 1
            } else {
              _this.type = 0
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
        this.$store.dispatch("attention/getAttention", attentionParams)
      }
    },
    getCates (userId) {
      var _this = this
      var cate_params = {
        userId,
        flag: 1,
        success: (res) => {
          _this.cateList = res
        },
        fail: (info) => {
          _this.$Message.error(info)
        },
        actionError: (info) => {
          _this.$store.commit("switchLoading", !1)
          _this.$Message.error(info)
        }
      }
      _this.$store.dispatch("cate/getCates", cate_params)
    },
    addLetter (userId) {
      this.$store.commit("switchLoading", !0)
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        var letter_param = {
          userId1: this.userInfo.id,
          userId2: userId,
          success: (letter) => {
            this.$router.push("/social/letter")
          },
          fail: () => {
            _this.$router.push("/logincenter/login")
          },
          actionError: (info) => {
            _this.$store.commit("switchLoading", !1)
            _this.$Message.error(info)
          }
        }
        this.$store.dispatch("letter/addLetter", letter_param)
      }
    }
  },
  components: {
    avatar
  }
}
</script>
<style scoped>
.fs10{
  font-size: 10px;
}
.cateItem{
  display: flex;
  justify-content: space-between;
}
.center{
  text-align: center;
}
.cateListWrapper{
  height: 300px;
  overflow-y:auto;
}
.otherLeft .btnWrap{
  margin-top:10px;
  display: flex;
  justify-content: space-around;
}
.otherLeft .btnWrap .btn:first-child{
  margin-right:20px;
}
.otherLeft .leftTop .line{
  word-wrap: break-word;
  word-break: normal;
}
.otherLeft .leftBottom{
  margin-top:50px;
}
.customMenu{
  background-color: transparent;
  margin-top: 20px;
  margin-right: 32px;
}
.lineItem{
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.leftTop .lineItem:not(.avatar) span:first-child{
    margin-right: 10px;
    display: inline-block;
    width: 80px;
    text-align: right;
}
.lineItem{
  display: flex;
}
.userInfoBlock{
  display: inline-block;
  width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
