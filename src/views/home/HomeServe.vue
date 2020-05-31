<template>
    <div class="HomeWrap">
        <div class="left">
          <essayList></essayList>
        </div>
        <div class="fixPosition">
          <Card style="width:300px">
            <p slot="title">
              <Icon type="md-apps" />推荐作者
            </p>
            <a href="#" slot="extra" @click.prevent="changeUser">
              <Icon type="ios-refresh-circle" />换一批
            </a>
            <div v-for="(item, index) in userList" :key="index" class="recommendWrapper">
              <div class="recommendLeft">
                <div @click="goUserIndex(item.user)">
                  <avatar :imgId="item.user.imgid"></avatar>
                </div>
                <div class="ml10">
                  <div @click="goUserIndex(item.user)">
                    {{item.user.username}}
                  </div>
                  <div>
                    已有{{item.nums}}位粉丝
                  </div>
                </div>
              </div>
              <div class="recommendRight">
                <Button class="btnColor" type="dashed" ghost v-if="item.isAttention">已关注</Button>
                <Button class="btnColor" type="dashed" ghost v-if="!item.isAttention" @click="addAttention(item)"><Icon type="ios-add"  />关注</Button>
              </div>
            </div>
          </Card>
        </div>
    </div>
</template>
<script>
import essayList from "@/views/essay/EssayList"
import avatar from "@/components/utils/Avatar"
import { mapState } from "vuex"
export default {
  components: {
    essayList,
    avatar
  },
  created () {
    this.getRecommendUser()
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    goUserIndex (user) {
      this.$store.commit("switchLoading", !0)
      this.$router.push({ path: "/otheruser/essaylist", query: { userId: user.id } })
    },
    addAttention (item) {
      console.log(item)
      if (this.userInfo.id) {
        var _this = this
        var user_param = {
          fromUserId: _this.userInfo.id,
          toUserId: item.user.id,
          success: (nums) => {
            item.isAttention = true
            item.nums = nums
          },
          fail: () => {
            _this.$router.push("/logincenter/login")
          },
          actionError: (info) => {
            _this.$Message.error(info)
          }
        }
        _this.$store.dispatch("attention/addAttention", user_param)
      } else {
        this.$router.push("/logincenter/login")
      }
    },
    changeUser () {
      this.getRecommendUser()
    },
    getRecommendUser () {
      var _this = this
      this.page = this.page + 1
      this.page = this.page > this.totalPage ? 1 : this.page
      var user_param = {
        page: this.page,
        pageSize: 5,
        search: "",
        userId: 0,
        success: (userList) => {
          console.log(userList)
          _this.page = userList.currentPage
          _this.totalPage = userList.totalPage
          _this.userList = userList.list
        },
        fail: (info) => {
          _this.$Message.error(info)
        },
        actionError: (info) => {
          _this.$store.commit("switchLoading", !1)
          _this.$Message.error(info)
        }
      }
      if (this.userInfo.id) {
        user_param.userId = this.userInfo.id
      }
      this.$store.dispatch("user/getRecommendUser", user_param)
    }
  },
  data () {
    var _this = this
    return {
      page: 0,
      userId: 0,
      totalPage: 1,
      userList: [
      ],
      currentIndex: 0,
      imgList: [1, 2, 3, 4, 5],
      swiperOption: {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: '3',
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false
        },
        pagination: {
          el: '.swiper-pagination'
        },
        autoplay: {
          delay: 4000,
          disableOnInteraction: false
        },
        on: {
          slideChange: function () {
            _this.currentIndex = this.activeIndex
          }
        }
      }
    }
  }
}
</script>
<style scoped>
.HomeWrap{
  display: flex;
  justify-content: space-around;
}
.left{
  margin-right: 100px;
}
.width{
  width:900px;
}
.ml10{
  margin-left: 10px;
}
.spanDis{
  position:absolute;
  bottom: 30px;
  left: 15px;
}
.fixPosition{
  position: fixed;
  right: 180px;
}
.btnColor{
  background-color: #2d8cf0;
}
.recommendWrapper{
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.recommendLeft{
  display: flex;
}
</style>
