<template>
  <div class="my-component" ref="preview">
    <input type="file" @change="preview" ref="searchfile">
  </div>
  <div ref="view"></div>
   <iframe frameborder="0"
                :src="'https://view.officeapps.live.com/op/view.aspx?src=' + this.path"
                width='100%'>
        </iframe>
        <div style="height:100%;">

        </div>
</template>
<script>
const docx = require('docx-preview');
window.JSZip = require('jszip')
export default {
  data(){
    return {
      path:'https://portal.nbsti.gov.cn/nbinfo/Lists/Rules and regulations/Attachments/3/《宁波市科技信息研究院绩效工资分配及管理暂行办法》.doc'
    }
  },
  methods:{
    preview(e){
      console.log(this.$refs.searchfile.files[0])
      //docx.renderAsync(this.$refs.file.files[0],this.$refs.view) // 渲染到页面预览
    }
  }
};
</script>
<style lang="less" scoped>
.my-component{
  width: 100%;
  height: calc(100px);
  border: 1px solid #000;
}
</style>
