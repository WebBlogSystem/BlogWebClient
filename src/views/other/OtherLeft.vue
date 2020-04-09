<template>
  <div class="otherLeft">
    <div class="leftTop">
      <div class="line">
          <div v-if="user.imgid || user.imgid == 0">
            <avatar :imgId="user.imgid" />
          </div>
          <div>{{user.username}}</div>
      </div>
      <div class="line btnWrap" v-if="user.id !== userInfo.id">
        <Button type="info" class="btn" @click="addAttention(user.id)" v-if="!type">关注</Button>
        <Button type="info" class="btn" @click="deleteAttention(user.id)" v-if="type">取消关注</Button>
        <Button type="info" @click="addLetter(user.id)" v-if="!letterType">私信他</Button>
      </div>
    </div>
    <div class="leftBottom">
      <Menu :active-name="cateId" :open-names="['4']">
          <Submenu name="4">
              <template slot="title">
                  <Icon type="ios-cog" />
                  全部标签
              </template>
              <MenuItem v-for="(cate,index) in cateList" :key="index" :name="cate.id">
                <div @click="goCateEssayList(cate.id)">
                  {{cate.name}}
                </div>
              </MenuItem>
          </Submenu>
      </Menu>
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
      cateId: 0,
      // 0表示未建立私信, 1 表示已建立私信
      letterType: 0
    }
  },
  created () {
    var userId = parseInt(this.$route.query.userId)
    if (this.$route.query.cateId) {
      this.cateId = parseInt(this.$route.query.cateId)
    }
    this.getUser(userId)
    this.getCates(userId)
    if (this.userInfo.id) {
      this.getLetter(userId)
      this.getAttention(userId)
    }
  },
  watch: {
    $route (to, from) {
      this.user = {}
      this.type = 0
      this.cateList = []
      this.cateId = 0
      this.letterType = 0
      var userId = parseInt(to.query.userId)
      if (to.query.cateId) {
        this.cateId = parseInt(to.query.cateId)
      }
      this.getUser(userId)
      this.getCates(userId)
      if (this.userInfo.id) {
        this.getLetter(userId)
      }
    }
  },
  methods: {
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
          }
        }
        _this.$store.dispatch("letter/getLetter", letter_param)
      }
    },
    addAttention (userId) {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        var attention_param = {
          fromUserId: _this.userInfo.id,
          toUserId: userId,
          success: () => {
            _this.type = 1
          },
          fail: () => {
            _this.$router.push("/logincenter/login")
          }
        }
        _this.$store.dispatch("attention/addAttention", attention_param)
      }
    },
    deleteAttention (userId) {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        var attention_param = {
          fromUserId: this.userInfo.id,
          toUserId: userId,
          success: () => {
            this.type = 0
          },
          fail: () => {
            _this.$router.push("/logincenter/login")
          }
        }
        this.$store.dispatch("attention/deleteAttention", attention_param)
      }
    },
    goCateEssayList (cateId) {
      this.$router.replace({ path: "/otheruser/essaylist", query: { userId: this.user.id, cateId } })
    },
    getUser (userId) {
      var _this = this
      var user_params = {
        userId,
        success: (res) => {
          _this.user = res
          if (_this.userInfo.id) {
            _this.getAttention(this.user.id)
          }
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
          }
        }
        this.$store.dispatch("attention/getAttention", attentionParams)
      }
    },
    getCates (userId) {
      var _this = this
      var cate_params = {
        userId,
        success: (res) => {
          _this.cateList = _this.cateList.concat(res)
        }
      }
      _this.$store.dispatch("cate/getCates", cate_params)
    },
    addLetter (userId) {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        var letter_param = {
          userId1: this.userInfo.id,
          userId2: userId,
          success: (letter) => {
            this.$store.commit("user/setUserInfo", letter.user)
            this.$router.push("/social/letter")
          },
          fail: () => {
            _this.$router.push("/logincenter/login")
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
.otherLeft{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.otherLeft .btnWrap{
  margin-top:10px;
}
.otherLeft .btnWrap .btn:first-child{
  margin-right:20px;
}
.otherLeft .leftTop .line{
  text-align: center;
}
.otherLeft .leftBottom{
  text-align: center;
}
</style>
