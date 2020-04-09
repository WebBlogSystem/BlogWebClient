<template>
  <div>
    <div class="left">
      <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
          <Menu active-name="1-2" theme="dark" width="auto" :class="menuitemClasses">
              <MenuItem name="1-1">
                  <Icon type="ios-navigate"></Icon>
                  <span>kjdfkj</span>
              </MenuItem>
              <MenuItem name="1-2">
                  <Icon type="ios-search"></Icon>
                  <span>Option 2</span>
              </MenuItem>
              <MenuItem name="1-3">
                  <Icon type="ios-settings"></Icon>
                  <span>Option 3</span>
              </MenuItem>
          </Menu>
      </Sider>
    </div>
    <div class="right">
    </div>
  </div>
</template>
<script>
export default {
}
</script>
