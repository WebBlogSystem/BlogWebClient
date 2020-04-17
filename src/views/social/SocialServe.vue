<template>
    <div class="socialServeWrap">
        <socialLeft class="left"></socialLeft>
        <div class="right">
          <router-view></router-view>
        </div>
    </div>
</template>
<script>
import socialLeft from './SocialLeft'
export default {
  components: {
    socialLeft
  }
}
</script>
<style scoped>
  .socialServeWrap{
    height: 100%;
    display: flex;
  }
  .socialServeWrap .left{
    flex-grow: 0;
    flex-shrink: 1;
  }
  .socialServeWrap .right{
    width: 75%;
    padding: 20px;
  }
</style>
