<template>
  <div class="searchWrap">
    <div class="left">
      <div @click="searchWay(0)">
        <a>
          <Icon type="md-book" size="30"/><span class="fs20">文章</span>
        </a>
      </div>
      <div @click="searchWay(1)" class="mt10">
        <a>
          <Icon type="md-person" size="30" /><span class="fs20">作者</span>
        </a>
      </div>
    </div>
    <div class="right">
      <div class="listHeader">
        <Breadcrumb separator=">">
          <BreadcrumbItem to="/" v-if="isSelectWay === 0">全部文章</BreadcrumbItem>
          <BreadcrumbItem v-if="isSelectWay === 1">全部作者</BreadcrumbItem>
          <BreadcrumbItem>"{{search}}"的搜索结果:</BreadcrumbItem>
        </Breadcrumb>
        <div>
          <span>排序方式:</span>
          <Select :disabled="isSelectWay === 1" v-model="selectWay" style="width:100px;color: black" @on-change="changeSort">
              <Option :value="0">最新</Option>
              <Option :value="1">点赞最多</Option>
          </Select>
        </div>
      </div>
      <essayList v-if="isSelectWay === 0" :selectOption="selectWay"></essayList>
      <userList v-if="isSelectWay === 1"></userList>
    </div>
  </div>
</template>
<script>
import essayList from "../essay/EssayList"
import userList from "@/components/search/UserList"
export default {
  data () {
    return {
      isSelectWay: 0,
      selectWay: 0,
      search: ""
    }
  },
  created () {
    this.search = this.$route.query.search
  },
  watch: {
    "$route" (to, from) {
      this.search = to.query.search
    }
  },
  components: {
    essayList,
    userList
  },
  methods: {
    searchWay (id) {
      this.isSelectWay = id
    },
    changeSort (selectWay) {
      this.selectWay = selectWay
    }
  }
}
</script>
<style scoped>
.left{
  position: fixed;
  left: 450px;
  width: 100px;
  border-right: solid 2px grey;
}
.listHeader{
  display: flex;
  justify-content: space-between;
}
.right{
  margin-left: 150px;
}
.fs20{
  font-size: 20px;
}
.mt10{
  margin-top: 10px;
}
</style>
