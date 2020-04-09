<template>
  <div class="otherServe">
    <div class="left">
      <otherleft></otherleft>
    </div>
    <div class="right">
      <router-view></router-view>
    </div>
  </div>

</template>
<script>
import otherleft from '@/views/other/OtherLeft'
export default {
  components: {
    otherleft
  }
}
</script>
<style scoped>
.otherServe{
  display: flex;
  /* justify-content: center; */
}
.otherServe .left{
  margin-top:20px;
}
.otherServe .right{
  padding-left: 10px;
  width: 75%;
}
</style>
