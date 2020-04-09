<template>
  <div id="essayBriefInfo">
    <div class="essayItem">
      <div class="line header">
        <div class="title mgr20" @click="showEssay(userId,essay.id)">
          {{essay.title}}
        </div>
        <div class="date mgr20">
          {{essay.createtime}}
        </div>
        <div class="goodnum mgr20">
          点赞数:{{up.up}}
        </div>
        <div class="checkStatus" v-if="essayListFrom === 1">
          <div v-if="essay.flag == 0">审核中</div>
          <div v-if="essay.flag == 1">审核成功</div>
          <div v-if="essay.flag == -1">{{essay.checkmsg}}</div>
        </div>
        <div v-if="essayListFrom === 1" class="rightAlign">
          <Dropdown>
            <Button type="dashed">文章操作</Button>
            <DropdownMenu slot="list">
              <DropdownItem @click.native="showEssay(userId, essay.id)">查看文章</DropdownItem>
              <DropdownItem @click.native="editEssay(essay.id)">编辑文章</DropdownItem>
              <DropdownItem @click.native="deleteEssay(essay.id)">删除文章</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div class="line content">
        {{essay.msg}}
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
  data () {
    return {
      up: {}
    }
  },
  props: ['essay', 'userId', 'essayListFrom'],
  created () {
    this.getUps()
  },
  methods: {
    getUps () {
      var up_param = {
        essayId: this.essay.id,
        success: (up) => {
          this.up = up
        }
      }
      this.$store.dispatch("essay/getUps", up_param)
    },
    editEssay (essayId) {
      // this.$store.dispatch("essay/getEssayByEssayId", {
      //   essayId,
      //   success: () => {
      //     this.$router.push("user/")
      //   }
      // })
      this.$store.commit("switchLoading", !0)
      this.$router.push({ path: "/user/editessay", query: { essayId } })
    },
    showEssay (userId, essayId) {
      this.$store.commit("switchLoading", !0)
      this.$router.push({ path: "/otheruser/essaydetail", query: { userId, essayId } })
    },
    deleteEssay (essayId) {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        this.$store.dispatch("essay/deleteEssay", {
          essayId,
          success: () => {
            _this.$router.go(0)
          },
          fail: () => {
            _this.$router.push("/logincenter/login")
          }
        })
      }
    }
  }
}
</script>
<style scoped>
.mgr20{
  margin-right: 20px;
}
#essayBriefInfo .rightAlign{
  text-align: right
}
#essayBriefInfo .checkStatus{
  margin-right: 40px;
}
#essayBriefInfo .essayItem{
  height:60px;
}
#essayBriefInfo .line{
  margin-bottom:10px;
}
#essayBriefInfo .line:last-child{
  margin-bottom:10px;
}
#essayBriefInfo .header{
  display: flex;
  align-items: center;
}
#essayBriefInfo .title{
  font-size:20px;
  width: 164px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#essayBriefInfo .content{
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
