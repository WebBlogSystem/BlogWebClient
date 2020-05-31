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
      txt: ""
    }
  },
  watch: {
    "$route.query.search" (newVal, oldVal) {
      console.log(newVal)
      this.txt = newVal
    }
  },
  methods: {
    searchEssay () {
      this.$store.commit("switchLoading", !0)
      if (this.txt !== '') {
        this.$router.push({ path: "/search", query: { search: this.txt } })
      } else {
        this.$router.push("/")
      }
      this.$store.commit("switchLoading", !1)
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
