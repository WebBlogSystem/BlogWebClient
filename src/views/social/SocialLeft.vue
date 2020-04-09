<template>
    <Menu :active-name="leftCurrent + ''" @on-select="onSelect">
        <MenuGroup title="社交">
            <MenuItem name="1">
                <Icon type="md-chatbubbles" />
                评论
            </MenuItem>
            <MenuItem name="2">
                <Icon type="md-chatbubbles" />
                回复
            </MenuItem>
            <MenuItem name="3">
                <Icon type="md-chatbubbles" />
                关注
            </MenuItem>
            <MenuItem name="4">
                <Icon type="md-chatbubbles" />
                粉丝
            </MenuItem>
            <MenuItem name="5">
                <Icon type="md-chatbubbles" />
                云信
            </MenuItem>
        </MenuGroup>
    </Menu>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      leftCurrent: state => state.social.leftCurrent
    })
  },
  methods: {
    onSelect (current) {
      let path = ''
      switch (current) {
        case '1':
          path = 'comment'
          break
        case '2':
          path = 'reply'
          break
        case '3':
          path = 'attention'
          break
        case '4':
          path = 'fan'
          break
        case '5':
          path = 'letter'
          break
        default:
          path = 'comment'
      }
      if (this.$route.path !== `/social/${path}`) {
        this.$store.commit('social/setLeftCurrent', current)
        this.$router.push({ path: `/social/${path}` })
      }
    }
  }
}
</script>
