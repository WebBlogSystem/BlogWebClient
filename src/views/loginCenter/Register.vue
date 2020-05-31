<template>
<div class="register">
  <div class="registerWrap">
    <Divider><span class="fs">注册</span></Divider>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
        <FormItem label="昵称" prop="username" class="fs20">
            <i-input size="large" v-model="formValidate.username" :maxlength="15" placeholder="请输入用户名"></i-input>
        </FormItem>
        <FormItem label="邮箱" prop="mail" class="fs20">
            <i-input type="email" size="large" v-model="formValidate.mail" placeholder="请输入邮箱"></i-input>
        </FormItem>
        <FormItem type="password" label="密码" prop="password" class="fs20">
            <i-input type="password" size="large" v-model="formValidate.password" :maxlength="20" placeholder="请输入密码(字母数字组合，8-20位)"></i-input>
        </FormItem>
        <FormItem label="性别" prop="sex" class="fs20">
            <RadioGroup v-model="formValidate.sex">
                <Radio label="1"><span class="f20">男</span></Radio>
                <Radio label="2"><span class="f20">女</span></Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="个性签名" prop="intro" class="fs20">
            <i-input v-model="formValidate.intro" size="large" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :maxlength="200" placeholder="请输入个性签名"></i-input>
        </FormItem>
        <FormItem>
          <div class="btnWrap">
            <Button class="btn f20" @click="handleReset('formValidate')">重置</Button>
            <Poptip placement="right" width="400" :disabled="!isShowVerify">
              <Button class="btn f20" type="primary" @click="handleSubmit('formValidate')">注册</Button>
              <div slot="content">
                <slide-verify ref="slideblock" :l="42"
                  :r="10"
                  :w="310"
                  :h="155"
                  slider-text="向右滑动"
                  @success="onSuccess"
                  @fail="onFail"
                  @refresh="onRefresh"
                  >
                </slide-verify>
                <div>{{msg}}</div>
              </div>
            </Poptip>
          </div>
        </FormItem>
    </Form>
  </div>
</div>
</template>
<script>
export default {
  created () {
    this.$store.commit("switchLoading", !1)
  },
  data () {
    return {
      isShowVerify: !1,
      msg: "",
      formValidate: {
        username: '',
        mail: '',
        password: '',
        sex: '1',
        intro: ''
      },
      ruleValidate: {
        username: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { type: 'string', pattern: /^.{5,15}$/, message: '用户名长度需在5-15位', trigger: 'blur' }
        ],
        mail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^[0-9|a-zA-Z]{8,20}$/, message: '密码长度为8-20位，请重新输入密码', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' },
          { type: 'string', pattern: /^[1-2]$/, trigger: 'change' }
        ],
        intro: [
          { type: 'string', max: 200, message: '个人简介不能超过200位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSuccess () {
      var _this = this
      var user_param = {
        username: this.formValidate.username,
        mail: this.formValidate.mail,
        password: this.formValidate.password,
        sex: this.formValidate.sex,
        intro: this.formValidate.intro,
        success: () => {
          this.$Message.success("请登录邮箱激活使用")
          this.$router.push("/logincenter/login")
        },
        fail: (info) => {
          this.$Message.error(info)
        },
        actionError: (info) => {
          _this.$store.commit("switchLoading", !1)
          _this.$Message.error(info)
        }
      }
      this.$store.dispatch("user/register", user_param)
      this.isShowVerify = !1
    },
    onFail () {
      var _this = this
      setTimeout(() => {
        _this.$refs.slideblock.reset()
      }, 3000)
    },
    onRefresh () {
    },
    handleSubmit (name) {
      this.$store.commit("switchLoading", !0)
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.isShowVerify = !0
        } else {
          this.$Message.error('Fail!')
        }
        this.$store.commit("switchLoading", !1)
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>
<style scoped>
.registerWrap{
  margin: 80px auto;
  width: 50%;
}
.btnWrap{
  margin-top:20px;
}
.btnWrap .btn:first-child{
  margin-right: 20px;
}
.fs{
  font-size: 38px;
}
.fs20 > :first-child{
  font-size: 20px;
}
.f20{
  font-size: 20px;
}
</style>
