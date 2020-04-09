<template>
    <div class="search">
        <div class="searchWrap">
            <i-input v-model="txt" icon="md-search" enter-button placeholder="输入文章标题搜索文章" @on-enter="searchEssay" @on-click="searchEssay" />
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      txt: ''
    }
  },
  created () {
    var query = this.$route.query.search
    this.txt = query
  },
  methods: {
    searchEssay () {
      this.$router.push({ path: "/", query: { search: this.txt } })
    }
  }
}
</script>
<style>
.searchWrap .ivu-select,
.searchWrap .ivu-select-arrow,
.searchWrap .ivu-select-single .ivu-select-selection .ivu-select-placeholder{
    color:#fff;
}
</style>
<style scoped>
.searchWrap .ivu-select,
.searchWrap .ivu-select-single .ivu-select-selection .ivu-select-placeholder{
    background-color: #2d8cf0;
}
</style>
