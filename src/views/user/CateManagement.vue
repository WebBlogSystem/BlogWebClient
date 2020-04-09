<template>
  <div class="cateManagement">
    <Button class="btn" type="dashed" @click="addCate">添加分类</Button>
    <div class="lineWrap">
      <div v-if="cateList.length <= 0">
        当前没有分类,请添加分类
      </div>
      <div v-else class="line" v-for="(cate, cateIndex) in cateList" :key="cateIndex">
        <span class="catename">{{cate.name}}</span>
        <div>
          <Button class="btn" size="small" type="primary" @click="changeShow(1, cate)">添加博文</Button>
          <Button class="btn" size="small"  type="primary" @click="changeShow(2, cate)">删除博文</Button>
          <Button class="btn" size="small" type="primary" @click="deleteCate(cate, cateIndex)">删除标签</Button>
        </div>
      </div>
    </div>
    <div v-if="isShow">
      <Drawer width="26" :title="isShow === 1?'添加博文('+current_cate.name+')':'删除博文('+current_cate.name+')'" :closable="true" :scrollable="true" :value="!!isShow" @on-close="initEssayData">
        <div class="lineWrap" v-for="(essay,essayIndex) in essayList" :key="essayIndex">
          <div class="essayInfo">
            <div class="title mgr20">{{essay.title}}</div>
            <div class="date mgr20">时间:{{essay.createtime}}</div>
          </div>
          <div class="btn">
            <Button class="btn" size="small" type="primary" v-if="isShow == 1" @click="addEssayCate(essay.id, current_cate.id, essayIndex)">添加</Button>
            <Button class="btn" size="small" type="primary" v-if="isShow == 2" @click="deleteEssayCate(essay.id, current_cate.id, essayIndex)">删除</Button>
          </div>
        </div>
      </Drawer>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex"
export default {
  created () {
    this.$store.commit("user/setLeftCurrent", 3)
    if (this.userInfo.id) {
      this.getCates()
    }
    this.$store.commit("switchLoading", !1)
  },
  data () {
    return {
      cateList: [],
      isShow: 0,
      essayPage: 0,
      essayList: [],
      cate_name: "",
      current_cate: {}
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    getCates () {
      var _this = this
      var cate_param = {
        userId: _this.userInfo.id,
        success: (list) => {
          _this.cateList = _this.cateList.concat(list)
        },
        fail: () => {
          _this.$router.push("/logincenter/login")
        }
      }
      _this.$store.dispatch("cate/getCates", cate_param)
    },
    changeShow (isShow, cate) {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        // 1表示查询所有具备该标签的文章,2 表示查询所有不具备该标签的文章
        _this.essayPage = 0
        _this.essayList = []
        var param = {
          cateId: cate.id,
          flag: 1,
          userId: _this.userInfo.id,
          success: (list) => {
            _this.essayList = this.essayList.concat(list)
            _this.current_cate = cate
            _this.isShow = isShow
          }
        }
        if (isShow === 1) {
          param.flag = 2
        }
        this.$store.dispatch("essay/getAllEssayByCateId", param)
      }
    },
    addEssayCate (essayId, cateId, essayIndex) {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        _this.$store.dispatch("essay/addEssayCate", {
          cateId,
          essayId,
          success: () => {
            _this.essayList.splice(essayIndex, 1)
            _this.$store.commit("switchLoading", !1)
          },
          fail: () => {
            _this.$router.push("/logincenter/login")
          }
        })
      }
    },
    deleteEssayCate (essayId, cateId, essayIndex) {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        _this.$store.dispatch("essay/deleteEssayCate", {
          cateId,
          essayId,
          success: () => {
            _this.essayList.splice(essayIndex, 1)
            _this.$store.commit("switchLoading", !1)
          },
          fail: () => {
            _this.$router.push("/logincenter/login")
          }
        })
      }
    },
    addCate () {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        this.$Modal.confirm({
          render: (h) => {
            return h('Input', {
              props: {
                value: this.cate_name,
                placeholder: '请输入标签名...'
              },
              on: {
                input: (val) => {
                  this.cate_name = val
                }
              }
            })
          },
          onOk: () => {
            var _this = this
            _this.$store.dispatch("cate/addCate", {
              name: _this.cate_name,
              userId: _this.userInfo.id,
              success: (cate) => {
                _this.$router.go(0)
              },
              fail: () => {
                _this.$router.push("/logincenter/login")
              }
            })
          },
          onCancel: () => {
            this.cate_name = ""
          }
        })
      }
    },
    initEssayData () {
      this.essayList = []
      this.isShow = 0
      this.current_cate = {}
    },
    deleteCate (cate, cateIndex) {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        var cate_param = {
          cateId: cate.id,
          success: () => {
            _this.cateList.splice(cateIndex, 1)
          },
          fail: () => {
            _this.$router.push("/logincenter/login")
          }
        }
        _this.$store.dispatch("cate/deleteCate", cate_param)
      }
    }
  }
}
</script>
<style scoped>
.cateManagement {
  margin-left: 30px;
  display: flex;
  flex-direction: column;
}
.cateManagement .line{
  display: flex;
  justify-content: space-around;
  padding: 10px;
  margin-top: 20px;
}
.lineWrap{
  margin-top: 28px;
}
.cateManagement .line span:first-child {
  display: inline-block;
  width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cateManagement .line {
  display: flex;
  font-size: 16px;
}
.cateManagement .btn {
  margin-left: 10px;
}
.ivu-scroll-wrapper {
  width: 100% !important;
}
.fs10{
  font-size: 10px;
}
</style>
