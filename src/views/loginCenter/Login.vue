<template>
<div class="login">
<div class="loginWrap">
  <Divider><span class="fs">登录</span></Divider>
    <Form ref="formLogin" :model="formLogin" :rules="ruleLogin" id="requestloginflex" style="width: 310px">
        <FormItem prop="mail">
            <i-input size="large" type="text" v-model="formLogin.mail" placeholder="邮箱">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
            </i-input>
        </FormItem>
        <FormItem prop="password">
            <i-input size="large" type="password" v-model="formLogin.password" :maxlength="20"  placeholder="密码"  width="50%">
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </i-input>
        </FormItem>
        <FormItem>
            <Poptip placement="right" width="400" :disabled="!isShowVerify">
              <Button type="primary" @click="handleSubmit('formLogin')" class="btn"><span class="fs20">登录</span></Button>
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
              </div>
            </Poptip>
        </FormItem>
    </Form>
</div>
</div>
</template>
<script>
export default {
  data () {
    return {
      isShowVerify: !1,
      msg: "",
      formLogin: {
        mail: '1306104920@qq.com',
        password: '12345678'
      },
      ruleLogin: {
        mail: [
          { required: true, message: '请输入邮箱内容', trigger: 'blur' },
          { tpye: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { type: 'string', pattern: /^[0-9a-zA-Z]{8,20}$/, message: '密码长度错误，请重新输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSuccess () {
      var _this = this
      this.$store.dispatch('user/userLogin', {
        formLogin: this.formLogin,
        success: () => {
          this.$router.push("/")
        },
        fail: (info) => {
          this.$refs.slideblock.reset()
          this.$Message.error(info)
        },
        actionError: (info) => {
          _this.$store.commit("switchLoading", !1)
          _this.$Message.error(info)
        }
      })
      this.isShowVerify = !1
    },
    onFail () {
      var _this = this
      setTimeout(() => {
        console.log("开始重置")
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
          this.$Message.error('输入的信息有误，请重新输入。')
        }
        this.$store.commit("switchLoading", !1)
      })
    }
  },
  created () {
    this.$store.dispatch("user/startSession")
    this.$store.commit("switchLoading", !1)
  }
}
</script>
<style>
.loginWrap .ivu-form-item-content{
  text-align: center;
}
</style>
<style scoped>
.loginWrap{
  position: fixed;
  right: 40%;;
  width:310px;
}
.loginWrap .btn{
  background-color: #2d8cf0;
  color:#fff;
}
.fs{
  font-size: 38px;
}
.fs20{
  font-size: 20px;
}
</style>
