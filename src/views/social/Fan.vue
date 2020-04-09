<template>
  <div class="fan">
    <div class="fanList">
      <div v-if="fanList.length <= 0">
        没有粉丝
      </div>
      <div v-else>
        <div class="item" v-for="(item, index) in fanList" :key="index" @click="goUserIndex(item)">
          <div class="line">
            <avatar :imgId="item.imgid"/>
          </div>
          <div class="line">{{item.username}}</div>
        </div>
        <Divider type="vertical" dashed />
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
  },
  methods: {
    goUserIndex (user) {
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
            console.log(list)
            this.fanList = list
          },
          fail: () => {
            _this.$router.push("/logincenter/login")
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
    flex-direction: column;
    align-items: center;
    margin-right:10px;
    margin-bottom: 10px;
    width: 70px;
    flex-grow: 0;
    flex-shrink: 0;
}
</style>
