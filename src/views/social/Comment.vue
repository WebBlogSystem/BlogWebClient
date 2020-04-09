<template>
  <div class="comment">
    <div class="commentList">
      <div v-if="commentList.length <= 0">
        您当前没有评论过文章
      </div>
      <div v-else>
        <Scroll :on-reach-bottom="!isCommentFinish ? bottomAddComment : stopAddComment" height="600">
          <div class="item" v-for="(item, index) in commentList" :key="index">
            <div class="line">
              <div class="left">
                <span class="mr10">({{item.comment.createtime}})</span>
                <Button type="dashed" size="small" @click="deleteComment(item.comment.id, index)">删除评论</Button>
              </div>
              <div class="right">
                <span class="mr10">您在</span>
                <a @click="goOtherEssayDetail(item.essay)" class="mr10 essaylink fc">{{item.essay.title}}</a>
                <span>文章中评论了：</span>
              </div>
            </div>
            <div class="line">
              <Poptip trigger="hover" title="当前评论内容" :content="item.comment.msg">
                <div class="content">
                  {{item.comment.msg}}
                </div>
              </Poptip>
            </div>
            <Divider v-if="!(index === (commentList.length - 1))" dashed />
          </div>
          <Divider v-if="isCommentFinish" size="small" class="fs10" dashed>已经到底了</Divider>
        </Scroll>
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
      commentList: [],
      commentPage: 0,
      isCommentFinish: 0
    }
  },
  created () {
    this.getCommentsByUserId()
    this.$store.commit("social/setLeftCurrent", 1)
    this.$store.commit("switchLoading", !1)
  },
  methods: {
    goOtherEssayDetail (essay) {
      this.$router.push({ path: '/otheruser/essaydetail', query: { essayId: essay.id, userId: essay.userId } })
    },
    getCommentsByUserId () {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        var comment_params = {
          userId: this.userInfo.id,
          page: ++this.commentPage,
          success: (list) => {
            if (list.length < 10) {
              this.isCommentFinish = 1
            }
            this.commentList = this.commentList.concat(list)
          },
          fail: () => {
            _this.$router.push("/logincenter/login")
          }
        }
        this.$store.dispatch("comment/getCommentsByUserId", comment_params)
      }
    },
    deleteComment (commentId, commentIndex) {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        var comment_params = {
          commentId,
          success: () => {
            this.$router.go(0)
          },
          fail: () => {
            _this.$router.push("/logincenter/login")
          }
        }
        this.$store.dispatch("comment/deleteComment", comment_params)
      }
    },
    bottomAddComment () {
      return new Promise(resolve => {
        this.getCommentsByUserId()
        resolve()
      })
    },
    stopAddComment () {
      return new Promise(resolve => {
        resolve()
      })
    }
  }
}
</script>
<style scoped>
.fs10{
  font-size: 10px;
}
.fc{
  color: #57a3f3;
}
.commentList{
  font-size: 16px;
  width: 100%;
  height: 600px;
  position: relative;
}
.commentList .mr10{
    margin-right: 10px;
}
.commentList .essaylink{
  text-decoration: underline;
}
.commentList .line:first-child{
    width: 100%;
    display: flex;
    flex-direction: column;
}
.commentList .content{
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
.commentList .item:last-child{
    border-bottom:none;
}
</style>
