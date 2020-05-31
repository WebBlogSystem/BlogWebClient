<template>
    <div class="socialServeWrap">
        <socialLeft class="left"></socialLeft>
        <div class="right">
          <router-view></router-view>
        </div>
        <div class="date">
          <vc-calendar :min-date="new Date()" :max-date="new Date()" :attributes='attrs' title-position="left" nav-visibility="hidden"></vc-calendar>
        </div>
    </div>
</template>
<script>
import socialLeft from './SocialLeft'
export default {
  components: {
    socialLeft
  },
  data () {
    return {
      attrs: [
        {
          key: 'today',
          dates: new Date(),
          dot: 'teal',
          popover: {
            label: '美好的一天！要开心呦！'
          }
        }
      ]
    }
  }
}
</script>
<style scoped>
  .socialServeWrap{
    height: 100%;
    display: flex;
  }
  .socialServeWrap .left{
    position: fixed;
  }
  .socialServeWrap .right{
    width: 75%;
    margin-left:162px;
  }
  .date{
    position: fixed;
    right: 50px;
    top: 80px;
  }
</style>
