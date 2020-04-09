<template>
    <!-- <div id="blogmanagement">
        <div ref="editor" v-show="0" style="text-align:left" class="editorarea"></div>
        <button v-on:click="getContent">查看内容</button>
    </div> -->
   <div></div>
</template>
<script>
export default {
  name: 'editor',
  data () {
    return {
      editorContent: ''
    }
  },
  components: {
  },
  created () {
    this.$store.commit("user/setLeftCurrent",2)
    this.$store.commit("switchLoading",!1)
  },
  methods: {
    getContent: function () {
      // console.log(this.editorContent)
      // alert(this.editorContent)
    }
  },
  mounted () {
    // var editor = new E()
    // editor.customConfig.menus = [
    // ]
    // editor.customConfig.onchange = (html) => {
    //   this.editorContent = html
    // }
    // editor.customConfig.zIndex = 100
    // editor.create()
  }
}
</script>
<style scoped>
.blogmanagement{
  display: flex;
}
</style>
