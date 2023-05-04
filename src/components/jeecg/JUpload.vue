<template>
  <div :id="containerId" style="position: relative">

    <!--  ---------------------------- begin 图片左右换位置 ------------------------------------- -->
    <div class="movety-container" :style="{top:top+'px',left:left+'px',display:moveDisplay}" style="padding:0 8px;position: absolute;z-index: 91;height: 32px;width: 104px;text-align: center;">

    </div>
    <!--  ---------------------------- end 图片左右换位置 ------------------------------------- -->
    <!-- <a class="查看附件" @click="viewFile" style="position: absolute;pointer-events: auto;">
      附件管理
    </a> -->
    <div style="display: block;">
      <a-upload
        name="file"
        :multiple="uploadMultiple"
        :action="uploadAction"
        :headers="headers"
        :data="{'biz':bizPath}"
        :fileList="fileList"
        :beforeUpload="beforeUpload"
        @change="handleChange"
        :disabled="disabled"
        :returnUrl="returnUrl"
        :listType="complistType"
        @preview="handlePreview"
        style="display: block; "
        :class="{'uploadty-disabled':disabled}">
        <template>
          <div v-if="isImageComp && !disabled">
            <a-icon type="plus" />
            <div class="ant-upload-text">{{ text }}</div>
          </div>
          <a-button type="dashed" v-else-if="buttonVisible && !disabled">
            {{ text }}
          </a-button>
        </template>
      </a-upload>
<!--      <div :id="containerId+'-mover'" :class="showMoverTask?'uploadty-mover-mask':'movety-opt'" style="margin-top: 12px">-->
<!--        <a @click="moveLast" style="margin: 0 5px;"><a-icon type="arrow-left" style="color: #fff;font-size: 16px"/></a>-->
<!--        <a @click="moveNext" style="margin: 0 5px;"><a-icon type="arrow-right" style="color: #fff;font-size: 16px"/></a>-->
<!--      </div>-->
    </div>
    <pdf-preview-modal ref="pdfmodal"></pdf-preview-modal >
    <!-- <a-modal v-model="visible" width="800px" title="文件管理" ok-text="确认" cancel-text="取消" @ok="hideModal" >

    </a-modal> -->
    <!-- <a-upload
      name="file"
      :multiple="uploadMultiple"
      :action="uploadAction"
      :headers="headers"
      :data="{'biz':bizPath}"
      :fileList="fileList"
      :beforeUpload="beforeUpload"
      @change="handleChange"
      :disabled="disabled"
      :returnUrl="returnUrl"
      :listType="complistType"
      @preview="handlePreview"
      :class="{'uploadty-disabled':disabled}">
      <template>
        <div v-if="isImageComp && !disabled">
          <a-icon type="plus" />
          <div class="ant-upload-text">{{ text }}</div>
        </div>
        <a-button type="dashed" v-else-if="buttonVisible && !disabled">
         {{ text }}
        </a-button>
      </template>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal> -->
  </div>
</template>

<script>
import { Modal } from 'ant-design-vue';
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import { getFileAccessHttpUrl, httpAction } from '@/api/manage'
import PdfPreviewModal from '@views/jeecg/modules/PdfPreviewModal'
let Base64 = require('js-base64').Base64
const FILE_TYPE_ALL = "all"
const FILE_TYPE_IMG = "image"
const FILE_TYPE_TXT = "file"
const uidGenerator=()=>{
  return '-'+parseInt(Math.random()*10000+1,10);
}
const getFileName=(path)=>{
  if(path.lastIndexOf("\\")>=0){
    let reg=new RegExp("\\\\","g");
    path = path.replace(reg,"/");
  }
  return path.substring(path.lastIndexOf("/")+1);
}
const getFileNameText=(path)=>{
  if(path.lastIndexOf("\\")>=0){
    let reg=new RegExp("\\\\","g");
    path = path.replace(reg,"/");
  }
  let name = "";
  let names = path.substring(path.lastIndexOf("/")+1);
  console.log("名称=======",names);
  if(names!=null&&names!=''&&names!=undefined){
    let list = names;
    console.log("名称1=======",names);
    if(name.indexOf("-") >= 0){
      list = names.split("_");
      let replaceVal = "";
      if(list!=null&&list.length>1){
        let listsecond = list[list.length-1].split(".");
        if(listsecond!=null&&listsecond.length>1){
          replaceVal = listsecond[0];
        }
      }
      if(replaceVal!=""&&replaceVal!=null){
        replaceVal = "_"+replaceVal;
        name = names.replace(replaceVal,"");
      }
    }else{
      name = names;
    }
  }
  return name;
}
export default {
  name: 'JUpload',
  components:{
    PdfPreviewModal
  },
  data(){
    return {
      action:'',
      visible: false,
      uploadAction:window._CONFIG['domianURL']+"/sys/common/upload",
      headers:{},
      fileList: [],
      newFileList: [],
      uploadGoOn:true,
      previewVisible: false,
      //---------------------------- begin 图片左右换位置 -------------------------------------
      previewImage: '',
      containerId:'',
      top:'',
      left:'',
      moveDisplay:'none',
      showMoverTask:false,
      moverHold:false,
      currentImg:''
      //---------------------------- end 图片左右换位置 -------------------------------------
    }
  },
  props:{
    text:{
      type:String,
      required:false,
      default:"点击上传"
    },
    fileType:{
      type:String,
      required:false,
      default:FILE_TYPE_ALL
    },
    /*这个属性用于控制文件上传的业务路径*/
    bizPath:{
      type:String,
      required:false,
      default:"temp"
    },
    value:{
      type:[String,Array],
      required:false
    },
    // update-begin- --- author:wangshuai ------ date:20190929 ---- for:Jupload组件增加是否能够点击
    disabled:{
      type:Boolean,
      required:false,
      default: false
    },
    // update-end- --- author:wangshuai ------ date:20190929 ---- for:Jupload组件增加是否能够点击
    //此属性被废弃了
    triggerChange:{
      type: Boolean,
      required: false,
      default: false
    },
    /**
     * update -- author:lvdandan -- date:20190219 -- for:Jupload组件增加是否返回url，
     * true：仅返回url
     * false：返回fileName filePath fileSize
     */
    returnUrl:{
      type:Boolean,
      required:false,
      default: true
    },
    number:{
      type:Number,
      required:false,
      default: 0
    },
    buttonVisible:{
      type:Boolean,
      required:false,
      default: true
    },
    uploadMultiple:{
      type:Boolean,
      required:false,
      default: true
    }
  },
  watch:{
    value:{
      immediate: true,
      handler() {
        let val = this.value
        if (val instanceof Array) {
          if(this.returnUrl){
            this.initFileList(val.join(','))
          }else{
            this.initFileListArr(val);
          }
        } else {
          this.initFileList(val)
        }
      }
    }
  },
  computed:{
    isImageComp(){
      return this.fileType === FILE_TYPE_IMG
    },
    complistType(){
      return this.fileType === FILE_TYPE_IMG?'picture-card':'text'
    }
  },
  created(){
    const token = Vue.ls.get(ACCESS_TOKEN);
    //---------------------------- begin 图片左右换位置 -------------------------------------
    this.headers = {"X-Access-Token":token};
    this.containerId = 'container-ty-'+new Date().getTime();
    //---------------------------- end 图片左右换位置 -------------------------------------
  },

  methods:{
    viewFile(){
      this.visible = true;
    },
    hideModal() {
      this.visible = false;
    },
    initFileListArr(val){
      if(!val || val.length==0){
        this.fileList = [];
        return;
      }
      let fileList = [];
      for(var a=0;a<val.length;a++){
        let url = getFileAccessHttpUrl(val[a].filePath);
        fileList.push({
          uid:uidGenerator(),
          name:val[a].fileName,
          status: 'done',
          url: url,
          response:{
            status:"history",
            message:val[a].filePath
          }
        })
      }
      this.fileList = fileList
    },
    initFileList(paths){
      if(!paths || paths.length==0){
        //return [];
        // update-begin- --- author:os_chengtgen ------ date:20190729 ---- for:issues:326,Jupload组件初始化bug
        this.fileList = [];
        return;
        // update-end- --- author:os_chengtgen ------ date:20190729 ---- for:issues:326,Jupload组件初始化bug
      }
      let fileList = [];
      let arr = paths.split(",")
      for(var a=0;a<arr.length;a++){
        let url = getFileAccessHttpUrl(arr[a]);
        console.log("=====" + url);
        console.log("=====11" + getFileNameText(arr[a]));
        fileList.push({
          uid:uidGenerator(),
          name:getFileNameText(arr[a]),
          status: 'done',
          url: url,
          response:{
            status:"history",
            message:arr[a]
          }
        })
      }
      this.fileList = fileList
    },
    handlePathChange(){
      let uploadFiles = this.fileList
      let path = ''
      if(!uploadFiles || uploadFiles.length==0){
        path = ''
      }
      let arr = [];
      let newFiles = [];
      for(var a=0;a<uploadFiles.length;a++){
        // update-begin-author:lvdandan date:20200603 for:【TESTA-514】【开源issue】多个文件同时上传时，控制台报错
        if(uploadFiles[a].status === 'done' ) {
          arr.push(uploadFiles[a].response.message)
        }else{
          return;
        }
        try{
          var fileJson = {
            fileName:uploadFiles[a].name,
            filePath:uploadFiles[a].response.message,
            fileSize:uploadFiles[a].size
          };
          newFiles.push(fileJson);
        }catch(err){

        }
        // update-end-author:lvdandan date:20200603 for:【TESTA-514】【开源issue】多个文件同时上传时，控制台报错
      }
      if(arr.length>0){
        path = arr.join(",")
      }
      this.$emit('change', path);
      this.$emit('changeNew',newFiles)
    },
    beforeUpload(file){
      this.uploadGoOn=true
      var fileType = file.type;
      if(this.fileType===FILE_TYPE_IMG){
        if(fileType.indexOf('image')<0){
          this.$message.warning('请上传图片');
          this.uploadGoOn=false
          return false;
        }
      }
      //TODO 扩展功能验证文件大小
      const isLt2M = file.size / 1024 /1024 < 100;
      if (!isLt2M) {
        this.$message.error('文件大小不能超过100M');
        this.uploadGoOn=false
        return false;
      }
      return true
    },
    handleChange(info) {
      console.log("--文件列表改变--")
      if(!info.file.status && this.uploadGoOn === false){
        info.fileList.pop();
      }
      let fileList = info.fileList
      if(info.file.status==='done'){
        if(this.number>0){
          fileList = fileList.slice(-this.number);
        }
        if(info.file.response.success){
          fileList = fileList.map((file) => {
            if (file.response) {
              let reUrl = file.response.message;
              file.url = getFileAccessHttpUrl(reUrl);
            }
            return file;
          });
        }
        //this.$message.success(`${info.file.name} 上传成功!`);
      }else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败.`);
      }else if(info.file.status === 'removed'){
        let that = this;
        that.$confirm({
          content: `是否确认删除`,
          onOk: () => {
            that.handleDelete(info.file)
            that.fileList = fileList
            //returnUrl为true时仅返回文件路径
            if(this.returnUrl){
              this.handlePathChange()
            }else{
              //returnUrl为false时返回文件名称、文件路径及文件大小
              this.newFileList = [];
              for(var a=0;a<fileList.length;a++){
                // update-begin-author:lvdandan date:20200603 for:【TESTA-514】【开源issue】多个文件同时上传时，控制台报错
                if(fileList[a].status === 'done' ) {
                  var fileJson = {
                    fileName:fileList[a].name,
                    filePath:fileList[a].response.message,
                    fileSize:fileList[a].size
                  };
                  this.newFileList.push(fileJson);
                }else{
                  return;
                }
                // update-end-author:lvdandan date:20200603 for:【TESTA-514】【开源issue】多个文件同时上传时，控制台报错
              }
              this.$emit('change', this.newFileList);
              this.$emit('changeNew',this.newFileList)
            }
          }
        })
      }
      if(info.file.status !== 'removed'){
        this.fileList = fileList
        if(info.file.status==='done'){
          //returnUrl为true时仅返回文件路径
          if(this.returnUrl){
            this.handlePathChange()
          }else{
            //returnUrl为false时返回文件名称、文件路径及文件大小
            this.newFileList = [];
            for(var a=0;a<fileList.length;a++){
              // update-begin-author:lvdandan date:20200603 for:【TESTA-514】【开源issue】多个文件同时上传时，控制台报错
              if(fileList[a].status === 'done' ) {
                var fileJson = {
                  fileName:fileList[a].name,
                  filePath:fileList[a].response.message,
                  fileSize:fileList[a].size
                };
                this.newFileList.push(fileJson);
              }else{
                return;
              }
              // update-end-author:lvdandan date:20200603 for:【TESTA-514】【开源issue】多个文件同时上传时，控制台报错
            }
            this.$emit('change', this.newFileList);
            this.$emit('changeNew',this.newFileList)
          }
        }
      }


    },

    handleDelete(file){
      //如有需要新增 删除逻辑
      console.log(file)
    },
    handlePreview(file){
      //如果是外网访问则不允许下载文件
      let url = window.location.href;
      if(url.indexOf("ppms.zhlxsemicon.com:8443") > -1){
        this.$message.error("外网不允许下载附件");
        return;
      }


      if(this.fileType === FILE_TYPE_IMG){
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
      }else{
        // location.href = file.url;
        //如果是pdf支持在线预览
        console.log(file)
        let url = file.url;
        let title = file.name;

        if(url != null && (url.indexOf(".pdf") > 0 || url.indexOf(".PDF") > 0)){
          let that = this;
          that.$confirm({
            title: '文件(最大只能预览50M)',
            content: '文件打开方式?',
            cancelText:'下载',
            okText:'在线预览',
            closable:true,
            onOk() {
              // const token = Vue.ls.get(ACCESS_TOKEN);
              // that.headers = {"X-Access-Token":token}
              // that.$refs.pdfmodal.previewFiles(title,token,url);
              // let isLt2M = file.size / 1024 /1024 > 50;
              // if (isLt2M) {
              //   that.$message.error('预览文件不能大于50M');
              //   return;
              // }
              that.viewWord(file.url);
            },
            onCancel(e) {
              if(!e.triggerCancel){
                location.href=file.url;
                Modal.destroyAll();
              }
            },
          });
        }else{
          // window.open(file.url)
          location.href=file.url;
        }
      }
    },
    viewWord(httpUrl){
      /* let urls = "http://view.officeapps.live.com/op/view.aspx?src="+httpUrl;
       */
      // window.open(
      //   "https://view.officeapps.live.com/op/view.aspx?src="+encodeURIComponent(httpUrl),
      //   "_blank"
      // );
      /*
        window.open(urls); */
      let realname = this.$store.getters.userInfo.realname;
      let username = this.$store.getters.userInfo.username;
      if(httpUrl.indexOf("https://ppms-demo.zhlxsemicon.com") > -1){
        let toFile = "https://view.xdocin.com/view?src=" + encodeURIComponent(httpUrl);
        window.open(toFile);
      }else{
        if(httpUrl.indexOf("8081") > -1){
          let url1 = httpUrl.split("8081")
          let end = "https://ppms.zhlxsemicon.com:8443" + url1[1];
          let toFile = "https://view.xdocin.com/view?src=" + encodeURIComponent(end) + "&watermark=" + encodeURIComponent(realname + '(' + username + ')');
          window.open(toFile);
        }else{
          let toFile = "https://view.xdocin.com/view?src=" + encodeURIComponent(httpUrl) + "&watermark=" + encodeURIComponent(realname + '(' + username + ')');
          window.open(toFile);
        }

        // let base = "https://ppms.zhlxsemicon.com:8443/preview/onlinePreview?url="
        // let url = base+encodeURIComponent(Base64.encode(httpUrl))
        // window.open(url, '_blank')
      }

    },
    handleCancel(){
      this.previewVisible = false;
    },
    //---------------------------- begin 图片左右换位置 -------------------------------------
    moveLast(){
      //console.log(ev)
      //console.log(this.fileList)
      //console.log(this.currentImg)
      let index = this.getIndexByUrl();
      if(index==0){
        this.$message.warn('未知的操作')
      }else{
        let curr = this.fileList[index].url;
        let last = this.fileList[index-1].url;
        let arr =[];
        let newFiles = [];
        for(let i=0;i<this.fileList.length;i++){
          if(i==index-1){
            arr.push(curr)
          }else if(i==index){
            arr.push(last)
          }else{
            arr.push(this.fileList[i].url)
          }
          try{
            var fileJson = {
              fileName:fileList[i].name,
              filePath:fileList[i].response.message,
              fileSize:fileList[i].size
            };
            newFiles.push(fileJson);
          }catch(err){

          }
        }
        this.currentImg = last
        this.$emit('change',arr.join(','))
        this.$emit('changeNew',newFiles)
      }
    },
    moveNext(){
      let index = this.getIndexByUrl();
      if(index==this.fileList.length-1){
        this.$message.warn('已到最后~')
      }else{
        let curr = this.fileList[index].url;
        let next = this.fileList[index+1].url;
        let arr =[]
        let newFiles = [];
        for(let i=0;i<this.fileList.length;i++){
          if(i==index+1){
            arr.push(curr)
          }else if(i==index){
            arr.push(next)
          }else{
            arr.push(this.fileList[i].url)
          }
          try{
            var fileJson = {
              fileName:fileList[i].name,
              filePath:fileList[i].response.message,
              fileSize:fileList[i].size
            };
            newFiles.push(fileJson);
          }catch(err){

          }
        }
        this.currentImg = next
        this.$emit('change',arr.join(','))
        this.$emit('changeNew',newFiles)
      }
    },
    getIndexByUrl(){
      for(let i=0;i<this.fileList.length;i++){
        if(this.fileList[i].url === this.currentImg || encodeURI(this.fileList[i].url) === this.currentImg){
          return i;
        }
      }
      return -1;
    }
  },
  mounted(){
    const moverObj = document.getElementById(this.containerId+'-mover');
    if(moverObj){
      moverObj.addEventListener('mouseover',()=>{
        this.moverHold = true
        this.moveDisplay = 'block';
      });
      moverObj.addEventListener('mouseout',()=>{
        this.moverHold = false
        this.moveDisplay = 'none';
      });
    }

    let picList = document.getElementById(this.containerId)?document.getElementById(this.containerId).getElementsByClassName('ant-upload-list-picture-card'):[];
    if(picList && picList.length>0){
      picList[0].addEventListener('mouseover',(ev)=>{
        ev = ev || window.event;
        let target = ev.target || ev.srcElement;
        if('ant-upload-list-item-info' == target.className){
          this.showMoverTask=false
          let item = target.parentElement
          this.left = item.offsetLeft
          this.top=item.offsetTop+item.offsetHeight-50;
          this.moveDisplay = 'block';
          this.currentImg = target.getElementsByTagName('img')[0].src
        }

      });

      picList[0].addEventListener('mouseout',(ev)=>{
        ev = ev || window.event;
        let target = ev.target || ev.srcElement;
        //console.log('移除',target)
        if('ant-upload-list-item-info' == target.className){
          this.showMoverTask=true
          setTimeout(()=>{
            if(this.moverHold === false)
              this.moveDisplay = 'none';
          },100)
        }
        if('ant-upload-list-item ant-upload-list-item-done' == target.className || 'ant-upload-list ant-upload-list-picture-card'== target.className){
          this.moveDisplay = 'none';
        }
      })
      //---------------------------- end 图片左右换位置 -------------------------------------
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  }
}
</script>

<style lang="less">
.uploadty-disabled{
  .ant-upload-list-item {
    .anticon-close{
      display: none;
    }
    .anticon-delete{
      display: none;
    }
  }
}
//---------------------------- begin 图片左右换位置 -------------------------------------
.uploadty-mover-mask{
  background-color: rgba(0, 0, 0, 0.5);
  opacity: .8;
  color: #fff;
  height: 28px;
  line-height: 28px;
}
//---------------------------- end 图片左右换位置 -------------------------------------
</style>