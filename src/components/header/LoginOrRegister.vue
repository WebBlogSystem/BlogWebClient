<template>
<div>
  <div id="loginOrRegister">
      <router-link :to="{path:'/logincenter/login'}">
        <Button type="primary" class="btn" ghost>登录</Button>
      </router-link>
      <router-link :to="{path:'/logincenter/register'}">
        <Button type="primary" class="btn" ghost>注册</Button>
      </router-link>
  </div>
</div>
</template>
<script>
export default {
  data () {
    return {
    }
  }
}
</script>
<style scoped>
#loginOrRegister{
  display: flex;
}
#loginOrRegister .btn{
  margin-right:10px;
  color: #fff;
  background-color: #2d8cf0;
  border-color: #2d8cf0;
}
</style>
