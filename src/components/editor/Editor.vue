<template>
    <div>
      <div :class="{essayEditorAuto: !content_editor.isEditable, essayEditorHeight: content_editor.isEditable}" ref="editor" style="text-align:left"></div>
    </div>
</template>

<script>
import E from 'wangeditor'

export default {
  name: 'editor',
  data () {
    return {
      uploadAddress: process.env.VUE_APP_API + process.env.VUE_APP_uploadApi
    }
  },
  model: {
    prop: 'content_editor',
    event: 'getContent'
  },
  props: {
    content_editor: Object
  },
  watch: {
    "content_editor.html" (newValue) {
      this.content_editor.html = newValue
      this.editor.txt.html(newValue)
    }
  },
  methods: {
    initEditor () {
      this.editor.txt.text(this.content_editor.txt)
      this.editor.txt.html(this.content_editor.html)
      this.editor.$textElem.attr('contenteditable', !!this.content_editor.isEditable)
    }
  },
  mounted () {
    var editor = new E(this.$refs.editor)
    this.editor = editor

    editor.customConfig.zIndex = 100
    // 自定义菜单配置
    editor.customConfig.menus = []
    if (this.content_editor.isEditable) {
      editor.customConfig.menus = [
        // 标题
        'head',
        // 粗体
        'bold',
        // 字号
        'fontSize',
        // 字体
        'fontName',
        // 斜体
        'italic',
        // 下划线
        'underline',
        // 删除线
        'strikeThrough',
        // 文字颜色
        'foreColor',
        // 背景颜色
        'backColor',
        // 插入链接
        'link',
        // 列表
        'list',
        // 对齐方式
        'justify',
        // 引用
        'quote',
        // 表情
        'emoticon',
        // 插入图片
        'image',
        // 表格
        'table',
        // 插入视频
        // 'video',
        // 插入代码
        'code',
        // 撤销
        'undo',
        // 重复
        'redo'
      ]
    }
    // 忽略粘贴内容中的图片
    editor.customConfig.pasteIgnoreImg = true
    // 上传图片的服务器端接口
    editor.customConfig.uploadImgServer = this.uploadAddress
    editor.customConfig.uploadImgMaxSize = 5 * 1024 * 1024
    // 限制一次最多上传 1 张图片
    editor.customConfig.uploadImgMaxLength = 1
    // 上传图片时可自定义传递一些参数，例如传递验证的token等。参数会被添加到formdata中。
    // formdata.append(name, file)
    editor.customConfig.uploadFileName = 'upload'
    // editor.customConfig.uploadImgParams = {
    //   // 如果版本 <=v3.1.0 ，属性值会自动进行 encode ，此处无需 encode
    //   // 如果版本 >=v3.1.1 ，属性值不会自动 encode ，如有需要自己手动 encode
    //   name: 'upload'
    // }
    // 可使用监听函数在上传图片的不同阶段做相应处理
    editor.customConfig.uploadImgHooks = {
      before: function (xhr, editor, files) {
        // 图片上传之前触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
        // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
        // return {
        //     prevent: true,
        //     msg: '放弃上传'
        // }
      },
      success: function (xhr, editor, result) {
        // 图片上传并返回结果，图片插入成功之后触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      fail: function (xhr, editor, result) {
        // 图片上传并返回结果，但图片插入错误时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      error: (xhr, editor) => {
        // console.dir(xhr)
        // console.log(editor)
        this.$Notice.warning({
          title: '上传本地图片失败！',
          desc: ''
        })
        // 图片上传出错时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },
      timeout: function (xhr, editor) {
        // 图片上传超时时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },
      // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
      // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
      customInsert: function (insertImg, result, editor) {
        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
        // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
        insertImg(process.env.VUE_APP_domain + process.env.VUE_APP_imagesDir + "/" + result.res.location)

        // result 必须是一个 JSON 格式字符串！！！否则报错
      }
    }
    // 上传图片的错误提示默认使用alert弹出
    editor.customConfig.customAlert = (info) => {
      // console.log(info)
      this.$Notice.warning({
        title: '上传图片失败！',
        desc: info
      })
    }
    // 如果想完全自己控制图片上传的过程，可以使用如下代码
    // editor.customConfig.customUploadImg = function (files, insert) {
    //     // files 是 input 中选中的文件列表
    //     // insert 是获取图片 url 后，插入到编辑器的方法

    //     // 上传代码返回结果之后，将图片插入到编辑器中
    //     insert(imgUrl)
    // }
    // 插入网络图片的回调
    editor.customConfig.linkImgCallback = function (url) {
      // console.log(url) // url 即插入图片的地址
    }
    editor.customConfig.linkImgCheck = function (src) {
      // console.log(src) // 图片的链接

      return true // 返回 true 表示校验成功
      // return '验证失败' // 返回字符串，即校验失败的提示信息
    }
    editor.customConfig.onchange = () => {
      var txt = editor.txt.text()
      var html = editor.txt.html()
      this.$emit("getContent", { txt, html, isEditable: this.content_editor.isEditable })
    }
    editor.create()
    this.initEditor()
  }
}
</script>

<style>
.essayEditorHeight .w-e-text-container{
  height: 700px !important;
}
.essayEditorAuto .w-e-text-container{
  height: auto !important;
}
.essayEditorAuto .w-e-text {
  overflow-y: auto !important;
}
</style>
