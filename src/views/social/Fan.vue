<template>
  <div class="fan">
    <div class="fanList">
      <div v-if="fanList.length <= 0">
        <img :src="require('@/static/No.jpg')" height="100%" width="100%">
      </div>
      <div v-else class="fanListWrapper">
        <div v-for="(item, index) in fanList" :key="index" @click="goUserIndex(item)" style="width: 200px;">
          <Card :bordered="true" class="customCard item">
            <div class="line">
              <avatar :imgId="item.imgid"/>
            </div>
            <div class="line">{{item.username}}</div>
          </Card>
        </div>
      </div>
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
  data () {
    return {
      fanList: []
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  created () {
    this.$store.commit("social/setLeftCurrent", 4)
    this.getFans()
    this.$store.commit("switchLoading", !1)
  },
  methods: {
    goUserIndex (user) {
      this.$store.commit("switchLoading", !0)
      this.$router.push({ path: "/otheruser/essaylist", query: { userId: user.id } })
    },
    getFans () {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        var fan_param = {
          userId: this.userInfo.id,
          success: (list) => {
            this.fanList = list
          },
          fail: () => {
            _this.$router.push("/logincenter/login")
          },
          actionError: (info) => {
            _this.$store.commit("switchLoading", !1)
            _this.$Message.error(info)
          }
        }
        this.$store.dispatch("fan/getFans", fan_param)
      }
    }
  }
}
</script>
<style scoped>
.fanList{
    display: flex;
    justify-content:space-between;
    align-items: center;
    flex-wrap: wrap;
}
.fan .item{
    display: flex;
    flex-wrap: wrap;
    margin-right:20px;
    margin-bottom: 20px;
    flex-grow: 0;
    flex-shrink: 0;
    text-align: center;
}
.fanListWrapper{
  display: flex;
  justify-content:space-between;
  align-items: center;
  flex-wrap: wrap;
}
</style>
