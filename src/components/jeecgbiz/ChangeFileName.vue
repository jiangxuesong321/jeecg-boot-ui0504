<template>
  <a-modal
    width="600px"
    :visible="visible"
    title="文件修改"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="取消">
    <a-row>
      <a-col :span="12">旧文件名</a-col>
      <a-col :span="12">新文件名(不需带后缀)</a-col>
    </a-row>
    <div v-for="(item,index) in model.urlList">
      <a-row>
        <a-col :span="12">
          {{item.oldUrl}}
        </a-col>
        <a-col :span="12">
          <a-input v-model="item.newUrl" @change="setValue"></a-input>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script>

import { getAction,postAction } from '@/api/manage'
import { isNotNullOrEmpty, isNullOrEmpty } from '@/utils/util'
export default {
    name: 'JSelectContract',
    components: {},
    props: {
      // model: {
      //   type: Object,
      //   default: {},
      //   required: false
      // },
    },
    data() {
      return {
        visible:false,
        model:{},
      }
    },
    computed:{

    },
    mounted() {

    },

    model: {

    },
    methods: {
      setValue(){
        this.$forceUpdate();
      },
      handleOk(){
        let that = this;
        let param = that.model;
        let urlList = param.urlList;
        for(let i = 0; i < urlList.length; i++){
          if(isNotNullOrEmpty(urlList[i].newUrl)){
            if(urlList[i].newUrl.indexOf(".") > -1){
              that.$message.error("文件名不能带.");
              return;
            }
            if(urlList[i].newUrl.indexOf("*") > -1){
              that.$message.error("文件名不能带*");
              return;
            }
            if(urlList[i].newUrl.indexOf("#") > -1){
              that.$message.error("文件名不能带#");
              return;
            }
            if(urlList[i].newUrl.indexOf("'") > -1){
              that.$message.error("文件名不能带'");
              return;
            }
          }
        }
        let url = "/srm/projBase/changeFileName";
        that.$confirm({
          content: `是否确认提交`,
          onOk: () => {
            postAction(url,param).then(res => {
              if(res.success){
                that.$message.success("提交成功");
                that.handleCancel();
                that.$emit('back',res.result);
              }else {
                that.$message.error("提交失败");
              }
            })
          }
        })
      },
      handleCancel(){
        this.visible = false;
      },
      initData(model){
        this.model = model;
        this.visible = true;
      }
    }
  }
</script>

<style scoped>

</style>