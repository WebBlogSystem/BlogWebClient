<template>
  <div class="attention">
    <div class="attentionList">
      <div v-if="attentionList.length <= 0">
        <img :src="require('@/static/No.jpg')" height="100%" width="100%">
      </div>
      <div v-else v-for="(item, index) in attentionList" :key="index" style="width: 200px;">
        <Card :bordered="true" class="customCard item">
          <div class="line" @click="goUserIndex(item)">
            <avatar :imgId="item.imgid"/>
          </div>
          <div class="line" @click="goUserIndex(item)">{{item.username}}</div>
          <div class="line">
            <Button size="small" type="dashed" @click="deleteAttention(item.id, index)">取消关注</Button>
          </div>
        </Card>
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
    if (this.userInfo.id) {
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
      this.$store.commit("switchLoading", !0)
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
          },
          actionError: (info) => {
            _this.$store.commit("switchLoading", !1)
            _this.$Message.error(info)
          }
        }
        this.$store.dispatch("attention/getAttentions", attention_param)
      }
    },
    deleteAttention (userId, index) {
      this.$store.commit("switchLoading", !0)
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        var attention_param = {
          fromUserId: this.userInfo.id,
          toUserId: userId,
          success: () => {
            this.attentionList.splice(index, 1)
            this.$store.commit("switchLoading", !1)
          },
          fail: () => {
            this.$router.push("/logincenter/login")
          },
          actionError: (info) => {
            _this.$store.commit("switchLoading", !1)
            _this.$Message.error(info)
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
    justify-content: center;
    flex-wrap: wrap;
    margin-right:20px;
    margin-bottom: 20px;
    flex-grow: 0;
    flex-shrink: 0;
    text-align: center;
}
</style>
