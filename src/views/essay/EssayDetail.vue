<template>
  <div class="essayDetail">
    <div>
      <div class="fs40 fc">{{essay.title}}</div>
      <span>{{essay.createtime}}</span>
    </div>
    <div>
      <span>作者:</span>
      <span class="ml10">{{user.username}}</span>
    </div>
    <div>
    <span class="mr10">标签:</span><Tag color="#57a3f3" class="mr10" v-for="(cate, index) in cateListOfEssay" :key="index" type="border">{{cate.name}}</Tag>
    </div>
    <div v-if="content.html">
      <editor v-model="content"></editor>
    </div>
    <div v-if="essay.flag === 1">
      <div v-if="upOrDown === 1">
        <Icon type="ios-thumbs-up" size="24"/>({{up.up}})|<Icon type="ios-thumbs-down-outline" size="24" @click="updateUp(essay.id, -1)"/>({{up.down}})
      </div>
      <div v-if="upOrDown === -1">
        <Icon type="ios-thumbs-up-outline" size="24" @click="updateUp(essay.id, 1)"/>({{up.up}})|<Icon type="ios-thumbs-down" size="24"/>({{up.down}})
      </div>
      <div v-if="upOrDown === 0">
        <Icon type="ios-thumbs-up-outline" size="24" @click="updateUp(essay.id, 1)"/>({{up.up}})|<Icon type="ios-thumbs-down-outline" size="24" @click="updateUp(essay.id, -1)"/>({{up.down}})
      </div>
    </div>
    <Divider />
    <div v-if="essay.flag === 1">
      <Button type="primary" shape="circle" @click="addComments(essay.id)">发表评论</Button>
      <Divider />
      <div v-for="(item, index) in commentList" :key="index">
        <comment :comment="item"></comment>
      </div>
      <Page v-if="commentTotalPage > 1" :current="commentPage" :total="commentTotalCount" @on-change="getCommentsByEssayId" simple />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex"
import comment from "@/components/essay/Comment"
import editor from "@/components/editor/Editor"
export default {
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  data () {
    return {
      essay: {},
      user: {},
      up: {},
      upOrDown: 0,
      commentList: [],
      commentTotalCount: 0,
      commentTotalPage: 0,
      commentPage: 1,
      cateListOfEssay: [],
      msg: '',
      content: {
        txt: "",
        html: "",
        isEditable: false
      }
    }
  },
  created () {
    var essayId = parseInt(this.$route.query.essayId)
    this.getEssayDetail(essayId)
    this.getCatesByEssay(essayId)
    var userId = parseInt(this.$route.query.userId)
    this.getUser(userId)
    this.getUps(essayId)
    if (this.userInfo.id) {
      this.getUpOrDown(essayId, this.userInfo.id)
    }
    this.$store.commit("switchLoading", !1)
  },
  components: {
    comment,
    editor
  },
  methods: {
    getUpOrDown (essayId, userId) {
      var up_param = {
        essayId,
        userId,
        success: (up) => {
          if (up) {
            this.upOrDown = up.flag
          }
        },
        fail: () => {
          this.$router.push("/logincenter/login")
        }
      }
      this.$store.dispatch("essay/getUpOrDown", up_param)
    },
    getUps (essayId) {
      var up_param = {
        essayId,
        success: (up) => {
          this.up = up
        }
      }
      this.$store.dispatch("essay/getUps", up_param)
    },
    getEssayDetail (essayId) {
      var essay_params = {
        essayId,
        success: (res) => {
          this.essay = res
          this.content.txt = this.essay.msg
          this.content.html = this.essay.htmlmsg
          this.getCommentsByEssayId(this.commentPage)
        }
      }
      this.$store.dispatch("essay/getEssayByEssayId", essay_params)
    },
    getCommentsByEssayId (pageIndex) {
      var comments_param = {
        essayId: this.essay.id,
        page: pageIndex,
        success: (pageMsg) => {
          this.commentTotalCount = pageMsg.totalCount
          this.commentPage = pageMsg.currentPage
          this.commentList = pageMsg.list
          this.commentTotalPage = pageMsg.totalPage
        }
      }
      this.$store.dispatch("comment/getCommentsByEssayId", comments_param)
    },
    getUser (userId) {
      var user_params = {
        userId,
        success: (res) => {
          this.user = res
        }
      }
      this.$store.dispatch("user/getUserByUserId", user_params)
    },
    getCatesByEssay (essayId) {
      var cate_params = {
        essayId,
        success: (list) => {
          this.cateListOfEssay = this.cateListOfEssay.concat(list)
        }
      }
      this.$store.dispatch("cate/getCatesByEssay", cate_params)
    },
    addComments (essayId) {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        this.$Modal.confirm({
          render: (h) => {
            return h('Input', {
              props: {
                value: "",
                autofocus: true,
                placeholder: '评论内容......'
              },
              on: {
                input: (val) => {
                  this.msg = val
                }
              }
            })
          },
          onOk: () => {
            if (_this.msg.length > 0 && _this.msg.length <= 50) {
              var comment_param = {
                msg: _this.msg,
                userId: _this.userInfo.id,
                essayId,
                success: (comment) => {
                  _this.$store.commit("user/setUserInfo", comment.user)
                  _this.msg = ""
                  _this.getCommentsByEssayId(1)
                },
                fail: () => {
                  _this.$router.push("/logincenter/login")
                }
              }
              _this.$store.dispatch("comment/addComments", comment_param)
            } else {
              _this.$Message.error("信息长度在1-50位")
            }
          }
        })
      }
    },
    updateUp (essayId, flag) {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        var upParam = {
          essayId,
          flag,
          userId: this.userInfo.id,
          success: (up) => {
            _this.upOrDown = flag
            _this.up = up
          },
          fail: () => {
            _this.$router.push("/logincenter/login")
          }
        }
        _this.$store.dispatch("essay/updateUp", upParam)
      }
    }
  }
}
</script>
<style scoped>
.fs40{
  font-size: 34px;
}
.mr10{
  margin-right: 10px;
}
.ml10{
  margin-left: 10px;
}
.mt10{
  margin-top: 10px;
}
.mb10{
  margin-bottom: 10px;
}
</style>
