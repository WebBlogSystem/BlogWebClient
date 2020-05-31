<template>
  <div>
    <div v-if="cateId">当前分类:{{currentCate.name}}</div>
    <div ref="scroll" :class="{essayList:!0, isWidthShow: !isWidth}">
      <div v-if="essayList.length <= 0" class="essayListShow">
        <img :src="require('@/static/No.jpg')" height="100%" width="100%">
      </div>
      <div v-else :class="{ essayListWrapper: !0, scrollFinish: isFinish, essayListShow: !0 }">
        <!-- <Scroll ref="scroll" :on-reach-bottom="!isFinish ? handleAddEssay : stopAddEssay" height="628"> -->
          <div v-for="(item, index) in essayList" :key="index">
            <Card :bordered="true" class="customCard">
              <div :class="{ noAvatar: essayListFrom, item: !0, isPaddingShow: !isWidth }">
                <div class="left" @click="goOtherUser(item.user.id)" v-if="!essayListFrom">
                  <div>
                  <avatar :imgId="item.user.imgid"/>
                  </div>
                  <div>{{ item.user.username }}</div>
                </div>
                <div class="rightWrapper">
                  <div class="right">
                    <essayBriefInfo :essay="item.essay" :userId="item.user.id" :essayListFrom="essayListFrom" :essayIndex="index" @deleteEssay="deleteEssay"></essayBriefInfo>
                  </div>
                </div>
              </div>
            </Card>
            <Divider v-if="!(index === (essayList.length-1))" :dashed="true"/>
          </div>
          <Divider v-if="isFinish" size="small" class="fs10" dashed>已经到底了</Divider>
        <!-- </Scroll> -->
      </div>
    </div>
  </div>
</template>
<script>
import essayBriefInfo from "@/components/essay/EssayBriefInfo"
import avatar from "@/components/utils/Avatar"
import { mapState } from "vuex"
export default {
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  data () {
    return {
      isFinish: !1,
      isWidth: 1,
      page: 0,
      flag: [1],
      userId: 0,
      essayListAction: "essay/getEssayList",
      essayList: [],
      // 0表示不在博文管理中获取文章列表,1表示在博文管理中获取列表
      essayListFrom: 0,
      // cate为0表示查询所有分类的文章
      cateId: 0,
      search: "",
      // 0 表示 (默认)按照最新 查找   1 表示 按照最热 查找
      selectWay: 0,
      selectList: [
      ],
      currentCate: {}
    }
  },
  created () {
    var essay_param = {}
    if (this.$route.query.userId) {
      essay_param.userId = parseInt(this.$route.query.userId)
    }
    if (this.$route.query.cateId) {
      essay_param.cateId = parseInt(this.$route.query.cateId)
    }
    if (this.$route.query.search) {
      essay_param.search = this.$route.query.search
    }
    this.getEssayListFrom(essay_param)
    this.$store.commit("switchLoading", !1)
  },
  components: {
    essayBriefInfo,
    avatar
  },
  watch: {
    $route (to, from) {
      var essay_param = {}
      if (to.query.userId) {
        essay_param.userId = parseInt(to.query.userId)
      }
      if (to.query.cateId) {
        essay_param.cateId = parseInt(to.query.cateId)
      }
      if (to.query.search) {
        essay_param.search = to.query.search
      }
      this.getEssayListFrom(essay_param)
      this.$store.commit("switchLoading", !1)
    },
    selectOption (newVal) {
      this.selectWay = newVal
      var essay_param = {}
      if (this.$route.query.userId) {
        essay_param.userId = parseInt(this.$route.query.userId)
      }
      if (this.$route.query.cateId) {
        essay_param.cateId = parseInt(this.$route.query.cateId)
      }
      if (this.$route.query.search) {
        essay_param.search = this.$route.query.search
      }
      this.getEssayListFrom(essay_param)
    }
  },
  props: [
    'selectOption'
  ],
  methods: {
    getEssayListFrom (essay_param) {
      var path = this.$route.path
      this.isFinish = !1
      this.isWidth = 1
      this.page = 0
      this.userId = 0
      this.essayListAction = "essay/getEssayList"
      this.essayList = []
      this.search = ""
      this.currentCate = {}
      // cate为0表示查询所有分类的文章
      this.cateId = 0
      switch (path) {
        case "/":
          this.essayListFrom = 0
          this.isWidth = 0
          this.flag = [1]
          if (essay_param.search) {
            this.search = essay_param.search
          }
          this.getEssayByPage()
          break
        case "/user/blogmanagement":
          if (!this.userInfo.id) {
            this.$router.push("/logincenter/login")
          } else {
            this.essayListFrom = 1
            this.flag = [-1, 0, 1]
            this.isWidth = 1
            this.search = ""
            this.userId = this.$store.state.user.userInfo.id
            this.$store.commit("user/setLeftCurrent", 2)
          }
          this.getEssayByPage()
          break
        case "/otheruser/essaylist":
          this.essayListFrom = 2
          this.flag = [1]
          this.search = ""
          this.userId = essay_param.userId
          console.log(essay_param, this.userId)
          if (essay_param.cateId) {
            this.isCateUser(essay_param.cateId, this.userId)
          } else {
            this.getEssayByPage()
          }
          break
        case "/search":
          this.essayListFrom = 0
          this.isWidth = 0
          this.flag = [1]
          if (essay_param.search) {
            this.search = essay_param.search
          }
          this.getEssayByPage()
          break
        default:
          this.essayListFrom = 0
          this.flag = [1]
          this.isWidth = 0
          this.getEssayByPage()
      }
    },
    // isMore 是否上拉加载更多
    // getEssayByPage (isMore, done) {
    getEssayByPage () {
      var _this = this
      var param = {
        page: ++this.page,
        flag: this.flag,
        userId: this.userId,
        cateId: this.cateId,
        search: this.search,
        selectWay: this.selectWay,
        // isMore,
        success: (list) => {
          if (this.page === 1) {
            this.essayList = list
          } else {
            this.essayList = this.essayList.concat(list)
          }
          this.isFinish = list.length < 10
          this.$store.commit("switchLoading", !1)
        },
        fail: (info) => {
          this.$store.commit("switchLoading", !1)
          this.$Message.error(info)
        },
        actionError: (info) => {
          _this.$store.commit("switchLoading", !1)
          _this.$Message.error(info)
        }
      }
      this.$store.dispatch(this.essayListAction, param)
    },
    isCateUser (cateId, userId) {
      var _this = this
      var cate_param = {
        cateId,
        success: (cate) => {
          if (cate.userId === userId) {
            _this.cateId = cateId
            _this.getEssayByPage()
            _this.getCate(cate.id)
          } else {
            _this.$Message.error("当前路由参数有误,即将跳转首页")
            _this.$router.replace("/")
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
      _this.$store.dispatch("cate/getCateByCateId", cate_param)
    },
    getCate (cateId) {
      var _this = this
      var cate_param = {
        cateId,
        success: (cate) => {
          _this.currentCate = cate
        },
        fail: (info) => {
          _this.$Message.error(info)
        },
        actionError: (info) => {
          _this.$store.commit("switchLoading", !1)
          _this.$Message.error(info)
        }
      }
      this.$store.dispatch("cate/getCateByCateId", cate_param)
    },
    handleAddEssay () {
      return new Promise(resolve => {
        this.getEssayByPage()
        resolve()
      })
    },
    stopAddEssay () {},
    goOtherUser (userId) {
      var _this = this
      this.$store.commit("switchLoading", !0)
      this.$store.dispatch("user/getUserByUserId", {
        userId,
        success: res => {
          this.$router.push({
            path: "/otheruser/essaylist",
            query: { userId: res.id }
          })
        },
        fail: (info) => {
          this.$Message.error(info)
        },
        actionError: (info) => {
          _this.$store.commit("switchLoading", !1)
          _this.$Message.error(info)
        }
      })
    },
    deleteEssay (essayIndex) {
      this.$store.commit("switchLoading", !0)
      var _this = this
      var fromPage = Math.floor(essayIndex / 10) + 1
      this.essayList.length = (fromPage - 1) * 10
      var pages = []
      if (this.essayList.length % 10 === 1) {
        this.page--
      }
      for (let i = fromPage, j = 0; i <= this.page; i++, j++) {
        pages[j] = i
      }
      pages = pages.map(item => {
        return new Promise((resolve, reject) => {
          var essayParam = {
            page: item,
            flag: this.flag,
            userId: this.userId,
            cateId: this.cateId,
            search: this.search,
            success: (list) => {
              resolve(list)
            }
          }
          _this.$store.dispatch(_this.essayListAction, essayParam)
        })
      })
      Promise.all(pages).then(function (essayList) {
        essayList.map(item => {
          _this.essayList = _this.essayList.concat(item)
          _this.isFinish = item.length < 10
        })
        _this.$store.commit("switchLoading", !1)
        this.$Message.success("删除成功")
      })
    },
    getNewEssayList () {
      this.selectWay = 0
      this.page = 0
      this.getEssayByPage()
    },
    getHotEssayList () {
      this.selectWay = 1
      this.page = 0
      this.getEssayByPage()
    },
    scrollGetMore () {
      var _this = this
      if (document.documentElement.scrollTop + document.documentElement.clientHeight >= document.body.scrollHeight && !_this.isFinish) {
        _this.getEssayByPage()
      }
    }
  },
  mounted () {
    window.addEventListener('scroll', this.scrollGetMore)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scrollGetMore)
  }
}
</script>
<style scoped>
.essayListHeader{
  display: flex;
  justify-content: space-between;
}
.essayList {
  margin: 0 auto;
}
.customCard{
  background: #DFE4ED;
}
.isWidthShow {
  width: 960px;
}
.essayList .essayListWrapper{
  height: 100%;
}
.essayListWrapper .item{
  display: flex;
  align-items: left;
}
.essayListWrapper .item:last-child {
  border: none;
}
.essayListWrapper .isPaddingShow {
  padding: 0 50px;
}
.essayListWrapper .item .left {
  margin-right: 50px;
  flex-shrink: 0;
  flex-grow: 0;
  width: 50px;
  margin-top: 10px;
}
.essayListWrapper .item .right {
  max-width: 92%;
  flex-shrink: 1;
  flex-grow: 1;
}
.essayListWrapper .noAvatar {
  width: 100%;
}
.essayListWrapper .noAvatar .item {
  padding: 0;
}
.essayListWrapper .fs10{
  font-size: 10px;
}
.rightWrapper{
  width: 100%;
}
.selectWrapper{
  display: flex;
  flex-wrap: wrap;
}
.essayListShow{
  margin-top: 20px;
}
</style>
