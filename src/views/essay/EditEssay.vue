﻿<template>
  <div class="editEssay">
    <!-- <div v-html="formAddEssay.contentObj.html"></div> -->
     <Form ref="formEditEssay" :model="formEditEssay" :rules="ruleEditEssay" hide-required-mark>
        <FormItem prop="title" :label-width = "70" label="标题">
            <i-input type="text" v-model="formEditEssay.title" :maxlength="100" placeholder="输入博文标题"></i-input>
        </FormItem>
        <FormItem :label-width = "70" label="博文内容">
        </FormItem>
        <editor v-model="formEditEssay.contentObj"></editor>
        <FormItem class="submitWrapper">
            <Button type="primary" @click="handleSubmit('formEditEssay')">提交博文</Button>
        </FormItem>
    </Form>
  </div>
</template>
<script>
import { mapState } from "vuex"
import editor from "@/components/editor/Editor"
export default {
  data () {
    return {
      essay: {},
      formEditEssay: {
        title: "",
        contentObj: {
          txt: "",
          html: "",
          isEditable: true
        }
      },
      ruleEditEssay: {
        title: [
          { required: true, message: '请输入博文标签', trigger: 'blur' },
          { type: 'string', max: 20, min: 1, message: '标题长度在1-20位', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.$store.commit("user/setLeftCurrent", 2)
    this.getEssay()
    this.$store.commit("switchLoading", !1)
  },
  methods: {
    getEssay () {
      var _this = this
      var essayId = this.$route.query.essayId
      var essay_param = {
        essayId,
        success: (essay) => {
          this.essay = essay
          this.formEditEssay.title = essay.title
          this.formEditEssay.contentObj.txt = essay.msg
          this.formEditEssay.contentObj.html = essay.htmlmsg
        },
        fail: (info) => {
          this.$Message.error(info)
        },
        actionError: (info) => {
          _this.$store.commit("switchLoading", !1)
          _this.$Message.error(info)
        }
      }
      this.$store.dispatch("essay/getEssayByEssayId", essay_param)
    },
    handleSubmit (name) {
      this.$store.commit("switchLoading", !0)
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        var _this = this
        if (_this.formEditEssay.contentObj.html.length > 0 && _this.formEditEssay.contentObj.html.length <= 5000 && _this.formEditEssay.title.length > 0 && _this.formEditEssay.title.length <= 20) {
          var essay_param = {
            essayId: _this.essay.id,
            title: _this.formEditEssay.title,
            msg: _this.formEditEssay.contentObj.txt,
            htmlmsg: _this.formEditEssay.contentObj.html,
            success: () => {
              _this.$router.replace("/user/blogmanagement")
            },
            fail: () => {
              _this.$router.push("/logincenter/login")
            },
            actionError: (info) => {
              _this.$store.commit("switchLoading", !1)
              _this.$Message.error(info)
            }
          }
          _this.$refs[name].validate((valid) => {
            if (valid) {
              _this.$store.dispatch("essay/editEssay", essay_param)
            } else {
              this.$store.commit("switchLoading", !1)
              _this.$Message.error('Fail!')
            }
          })
        } else {
          this.$store.commit("switchLoading", !1)
          _this.$Message.error('标题需要在1-20位,内容在4000字左右')
        }
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  components: {
    editor
  }
}
</script>
<style scoped>
.submitWrapper{
  text-align:center;
  margin-top:20px;
}
</style>
