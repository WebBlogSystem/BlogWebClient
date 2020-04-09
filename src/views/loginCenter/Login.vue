<template>
<div class="login">
<div class="loginWrap">
    <Form ref="formLogin" :model="formLogin" :rules="ruleLogin" id="requestloginflex" style="width: 310px">
        <FormItem prop="mail">
            <i-input type="text" v-model="formLogin.mail" placeholder="邮箱">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
            </i-input>
        </FormItem>
        <FormItem prop="password">
            <i-input type="password" v-model="formLogin.password" :maxlength="20"  placeholder="密码"  width="50%">
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </i-input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formLogin')" class="btn">登录</Button>
        </FormItem>
    </Form>
</div>
</div>
</template>
<script>
export default {
  data () {
    return {
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
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$store.dispatch('user/userLogin', {
            formLogin: this.formLogin,
            success: () => {
              this.$router.go(-1)
            }
          })
        } else {
          this.$Message.error('输入的信息有误，请重新输入。')
        }
      })
    }
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
  width:310px;
  margin: 80px auto;
}
.loginWrap .btn{
  background-color: #2d8cf0;
  color:#fff;
}
</style>
