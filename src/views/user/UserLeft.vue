<template>
    <Menu :active-name="leftCurrent+''" @on-select="onSelect">
        <MenuGroup title="个人中心">
            <MenuItem name="1">
                <Icon type="md-chatbubbles" />
                添加博文
            </MenuItem>
            <MenuItem name="2">
                <Icon type="md-chatbubbles" />
                博客管理
            </MenuItem>
            <MenuItem name="3">
                <Icon type="md-chatbubbles" />
                标签管理
            </MenuItem>
            <MenuItem name="4">
                <Icon type="md-document" />
                个人资料
            </MenuItem>
        </MenuGroup>
    </Menu>
</template>
<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      leftCurrent: state => state.user.leftCurrent
    })
  },
  methods: {
    onSelect (current) {
      let path = ''
      switch (current) {
        case '2':
          path = 'blogmanagement'
          break
        case '3':
          path = 'catemanagement'
          break
        case '1':
          path = 'addessay'
          break
        case '4':
          path = 'userinfo'
          break
        default:
          current = '1'
          path = 'addessay'
      }
      if (this.$route.path !== `/user/${path}`) {
        this.$router.push({ path: `/user/${path}` })
      }
    }
  }
}
</script>
