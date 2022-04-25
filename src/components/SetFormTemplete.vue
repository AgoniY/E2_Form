<template>
  <div class="upload">
    <el-upload
        ref="upload"
        class="upload-demo"
        drag
        action=""
        :auto-upload="false"
        multiple
        :show-file-list="showFileList"
        :multiple="false"
        :limit="fileListLimit"
        :on-exceed="handleExceed"
        :on-change="handleOnChange"
        :on-remove="handleOnRemove"
        :accept="accept"
        :on-error="uploadError"
    >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
            拖动上传 或者 <em>点击上传</em>
        </div>
        <template #tip>
        <div class="el-upload__tip">
            <p>上传血缘Excel(仅限Excel格式) 生成 表单数据库JSON</p>
            <el-button class="ml-3" type="success" 
                @click="submitUpload" 
                :disabled="genBtnDisabled"
                >开始生成</el-button>
        </div>
        </template>
    </el-upload>
    <div v-show="noDsIdArr.length!=0" class="content-box">
        <p>未匹配数据源字段(字段对应的表不存在)</p>
        <el-tag class="ml-2" type="warning"
            v-for="item in noDsIdArr" size="large"
            >{{item.FieldName}}
        </el-tag>
    </div>
    <div v-show="Object.keys(Repeat).length!=0" class="content-box">
        <p>重复字段(存在同表同字段)</p>
        <el-tag class="ml-2" type="danger"
            v-for="item in Repeat" size="large"
            >{{item.RepeatCol.FieldName}} 
        </el-tag>
    </div>

    <div v-show="FormatFileData.length>0" class="content-box">
        <p>表单代码</p>
        <p class="output-code" 
        @click = "copycode"
        >{{FormatFileData}}</p>
    </div>
    

    <div v-show="false" style="margin-top:10px;">
        <el-select v-model="selectValue" class="m-2" placeholder="选择" 
            @change = "getColAttr"
            >
            <el-option
            v-for="item in FormColumnMap[0].Options"
            :key="item.Val"
            :label="item.Label"
            :value="item.Val"
            >
            </el-option>
        </el-select>
        <p class="output-code" 
            @click = "copycode"
            v-show="Object.keys(colAttr).length>0"
            >{{colAttr}}</p>
    </div>
    
  </div>
</template>

<script>
import { UploadFilled } from '@element-plus/icons-vue'
import { readExcelContent,getColAttr,checkRepeat} from '@/libs/util.js'
import {formatE2JsonByChapter} from "@/libs/index.js"
import FormColumnMap from '@/assets/JSON/FormColumnMap'
export default {
  name: 'SetFormTemplete',
  components: {
    UploadFilled
  },
  props: {
    msg: String
  },
  data(){
      return {
          FormColumnMap:FormColumnMap,
          selectValue:'',
          colAttr:{},

          accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
          showFileList:true,
          fileListLimit:1,
          fileList:[],  //上传文件列
          OriginalFileData:[],      //原始数据
          FormatFileData:[],
          //校验结果
          Repeat:{},
          noDsIdArr:[]
      }
  },
  computed:{
      genBtnDisabled(){
        return this.fileList.length==0?true:false
      }
  },
  mounted(){
      //console.log(FormColumnMap)
      
  },
  methods:{
      submitUpload(){
          readExcelContent(this.fileList,(d)=>{
              this.OriginalFileData = d
              try{
                  this.FormatFileData = formatE2JsonByChapter(this.OriginalFileData).Chaps;
                  let res = checkRepeat(this.FormatFileData)
                  this.Repeat = res.Repeat
                  this.noDsIdArr = res.noDsIdArr
                  //console.log(this.Repeat,this.noDsIdArr)
              }catch(e){
                  this.$message({
                      message: '发生错误！',
                      grouping: true,
                      type: 'error',
                    })
              }
              
          })
      },
      handleExceed (files) {
        let upload = this.$refs.upload
        //console.log(upload.value)
        upload.clearFiles()
        upload.handleStart(files[0])
      },
      handleOnChange(file, fileList){
          //console.log(file)
          //if(!fileList) return
          this.fileList = fileList
      },
      handleOnRemove(file, fileList){
          //console.log(fileList)
          this.fileList = fileList
          this.FormatFileData = []
      },
      uploadError(err, file, fileList){
          console.log(err)
      },
      copycode(e){
          //console.log(e.target.innerText);
        let oInput = document.createElement('input');
        oInput.value = e.target.innerText;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象;
        document.execCommand("Copy"); // 执行浏览器复制命令
        this.$message({
            message: '已复制文本内容',
            grouping: true,
            type: 'success',
        })
        oInput.remove()
      },
      getColAttr(val){
          this.colAttr = getColAttr(val)
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.upload{
    width:500px;
    margin:0 auto;
    --border-color: rgb(229, 231, 235);
}   
.output-code{
    margin-top:10px;
    cursor:pointer;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.content-box{
    border:1px solid var(--border-color);
    padding:6px;
    border-radius: 3px;
    margin:20px 0;
}
</style>
