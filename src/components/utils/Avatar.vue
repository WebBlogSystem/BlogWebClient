<template>
  <Avatar :src="src"  icon="ios-person" size="large" />
</template>
<script>
export default {
  data () {
    return {
      src: ""
    }
  },
  props: ["imgId"],
  created () {
    this.getImgSrc()
  },
  watch: {
    imgId (newValue) {
      this.imgId = newValue
      this.getImgSrc()
    }
  },
  methods: {
    getImgSrc () {
      // <avatar :imgId="1" />
      // <avatar :imgId="[1,2,3]" />
      // this.getImg([this.imgId, 22, 23])
      //   .then(
      //     (res) => {
      //    res 是数组
      //       console.dir(res)
      //     }
      //   )
      this.getImg(this.imgId)
        .then(
          (res) => {
            this.src = res
          }
        )
    }
  }
}
</script>
