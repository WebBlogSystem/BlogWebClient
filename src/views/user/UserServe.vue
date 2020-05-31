<template>
    <div class="UserWrap">
        <div class="left">
          <userLeft></userLeft>
        </div>
        <div class="right">
          <router-view></router-view>
        </div>
        <div class="date">
          <vc-calendar :min-date="new Date()" :max-date="new Date()" :attributes='attrs' title-position="left" nav-visibility="hidden"></vc-calendar>
        </div>
    </div>
</template>
<script>
import userLeft from './UserLeft'
export default {
  components: {
    userLeft
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
.UserWrap{
  display: flex;
}
.UserWrap .right{
  padding-left: 20px;
  width: 75%;
  margin-left: 250px;
}
.date{
  position: fixed;
  right: 50px;
  top: 80px;
}
</style>
