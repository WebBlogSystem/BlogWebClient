<template>
    <div class="UserWrap">
        <div class="left">
          <userLeft></userLeft>
        </div>
        <div class="right">
          <router-view></router-view>
        </div>
    </div>
</template>
<script>
import userLeft from './UserLeft'
export default {
  components: {
    userLeft
  }
}
</script>
<style scoped>
  .UserWrap{
    display: flex;
  }
  .UserWrap .right{
    padding: 20px;
    width: 75%;
  }
</style>
