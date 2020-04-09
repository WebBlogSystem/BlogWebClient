<template>
  <div class="attention">
    <div class="attentionList">
      <div v-if="attentionList.length <= 0">
        当前没有关注
      </div>
      <div v-else class="item" v-for="(item, index) in attentionList" :key="index">
        <div class="line" @click="goUserIndex(item)">
          <avatar :imgId="item.imgid"/>
        </div>
        <div class="line" @click="goUserIndex(item)">{{item.username}}</div>
        <div class="line">
          <Button size="small" type="dashed" @click="deleteAttention(item.id, index)">取消关注</Button>
        </div>
        <Divider type="vertical" dashed/>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex"
import avatar from "@/components/utils/Avatar"
export default {
  data () {
    return {
      attentionList: []
    }
  },
  created () {
    if (this.userinfo.id) {
      this.getAttention()
    }
    this.$store.commit("social/setLeftCurrent", 3)
    this.$store.commit("switchLoading", !1)
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  components: {
    avatar
  },
  methods: {
    goUserIndex (user) {
      this.$router.push({ path: "/otheruser/essaylist", query: { userId: user.id } })
    },
    getAttention () {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        var attention_param = {
          userId: this.userInfo.id,
          success: (list) => {
            this.attentionList = this.attentionList.concat(list)
          },
          fail: () => {
            _this.$router.push("/logincenter/login")
          }
        }
        this.$store.dispatch("attention/getAttentions", attention_param)
      }
    },
    deleteAttention (userId, index) {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var attention_param = {
          fromUserId: this.userInfo.id,
          toUserId: userId,
          success: () => {
            this.$router.go(0)
          },
          fail: () => {
            this.$router.push("/logincenter/login")
          }
        }
        this.$store.dispatch("attention/deleteAttention", attention_param)
      }
    }
  }
}
</script>
<style scoped>
.attentionList{
    display: flex;
    justify-content:space-between;
    align-items: center;
    flex-wrap: wrap;
}
.attention .item{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right:10px;
    margin-bottom: 10px;
    width: 70px;
    flex-grow: 0;
    flex-shrink: 0;
}
</style>
