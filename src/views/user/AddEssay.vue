<template>
  <div class="addEssay">
    <!-- <div v-html="formAddEssay.contentObj.html"></div> -->
     <Form ref="formAddEssay" :model="formAddEssay" :rules="ruleAddEssay" hide-required-mark>
        <FormItem prop="title" :label-width = "70" label="标题">
            <i-input type="text" v-model="formAddEssay.title" :maxlength="100" placeholder="输入博文标题"></i-input>
        </FormItem>
        <FormItem :label-width = "70" label="博文标签">
            <Select v-model="formAddEssay.cate" multiple style="width:296px">
                <Option v-for="item in cates" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
            <i-input v-model="formAddEssay.newCate" placeholder="新增博文标签" :maxlength="20" class="input"/>
        </FormItem>
        <FormItem :label-width = "70" label="博文内容">
        </FormItem>
        <editor v-model="formAddEssay.contentObj"></editor>
        <FormItem class="subBtnWrap">
            <Button class="subBtn" type="primary" @click="handleSubmit('formAddEssay')">提交博文</Button>
        </FormItem>
    </Form>
  </div>
</template>
<script>
import { mapState } from "vuex"
import editor from "@/components/editor/Editor"
export default {
  created () {
    if (this.userInfo.id) {
      this.getCates()
    }
    this.$store.commit("user/setLeftCurrent", 1)
    this.$store.commit("switchLoading", !1)
  },
  data () {
    return {
      formAddEssay: {
        title: "",
        cate: [],
        newCate: "",
        contentObj: {
          txt: "",
          html: "",
          isEditable: true
        }
      },
      cates: [],
      ruleAddEssay: {
        title: [
          { required: true, message: '请输入博文标题', trigger: 'blur' },
          { type: 'string', max: 20, min: 1, message: '标题长度在1-20位', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    editor
  },
  methods: {
    getCates () {
      var cate_param = {
        userId: this.userInfo.id,
        success: (list) => {
          this.cates = list
        }
      }
      this.$store.dispatch("cate/getCates", cate_param)
    },
    handleSubmit (name) {
      if (!this.userInfo.id) {
        this.$router.push("/logincenter/login")
      } else {
        if (this.formAddEssay.contentObj.html.length > 0 && this.formAddEssay.contentObj.html.length <= 5000 && this.formAddEssay.title.length > 0 && this.formAddEssay.title.length <= 20) {
          var _this = this
          var essay_param = {
            userId: this.userInfo.id,
            oldCateId: this.formAddEssay.cate,
            newCateName: this.formAddEssay.newCate,
            title: this.formAddEssay.title,
            msg: this.formAddEssay.contentObj.txt,
            htmlMsg: this.formAddEssay.contentObj.html,
            success: (user) => {
              this.$router.replace("/user/blogmanagement")
            },
            fail: () => {
              _this.$router.push("/logincenter/login")
            }
          }
          this.$refs[name].validate((valid) => {
            if (valid) {
              this.$store.dispatch("essay/addEssay", essay_param)
            } else {
              this.$Message.error('标题需要在1-20位,内容在4000字左右')
            }
          })
        } else {
          this.$Message.error('标题需要在1-20位,内容在4000字左右')
        }
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  }
}
</script>
<style scoped>
.addEssay .input{
    width: 296px;
    margin-left: 15px;
}
.subBtnWrap{
  text-align: center;
}
.subBtnWrap .subBtn{
  margin-top: 28px;
}
</style>
