<template>
<!--  <j-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :maskClosable="false"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"> -->
	<a-drawer
	  title="采购需求"
	  :width="width"
	  placement="right"
	  :closable="false"
	  :headerStyle="{ textAlign: 'center'}"
	  @close="close"
	  destroyOnClose
	  :visible="visible">
    <purchase-request-main-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" :ptype="ptype"/>
    <!--采购申请页面进入-->
    <div  style="text-align: center;" v-if="ptype == 'normal'">
      <a-button  @click="handleDraft" type="primary" v-if="!disableSubmit">草稿</a-button>
      <a-button  @click="handleOk" type="primary" v-if="!disableSubmit" style="margin-left:10px;">提交</a-button>
      <a-button  @click="handleCancel" style="margin-left:10px;"  type="primary" ghost>取消</a-button>
    </div>
    <!--审批页面进入-->
    <div  style="text-align: center;" v-if="ptype == 'approve'">
      <a-button  @click="handleReject" type="primary" >驳回</a-button>
      <a-button  @click="handleAgree" type="primary" style="margin-left:10px;">同意</a-button>
      <a-button  @click="handleCancel" style="margin-left:10px;"  type="primary" ghost>取消</a-button>
    </div>
    <!--已办列表进入-->
    <div  style="text-align: center;" v-if="ptype == 'hasdo'">
      <a-button  @click="handleCancel" style="margin-left:10px;"  type="primary" ghost>取消</a-button>
    </div>

    <div  style="text-align: center;" v-if="ptype == 'pur'">
      <a-button  @click="handleAgree" type="primary" style="margin-left:10px;">确定</a-button>
      <a-button  @click="handleCancel" style="margin-left:10px;"  type="primary" ghost>取消</a-button>
    </div>

  </a-drawer>
</template>

<script>

  import PurchaseRequestMainForm from './PurchaseRequestMainForm'

  export default {
    name: 'PurchaseRequestMainModal',
    props:['ptype'],
    components: {
      PurchaseRequestMainForm
    },
    data() {
      return {
        title:'',
        width:'90%',
        visible: false,
        disableSubmit: false
      }
    },
    methods:{
      add () {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.add();
        })
      },
      hasdo(record){
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.hasdo(record);
        })
      },
      edit (record) {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleAgree(){
        this.$refs.realForm.submitAgree();
      },
      handleReject(){
        this.$refs.realForm.submitReject();
      },
      handleDraft(){
        this.$refs.realForm.submitDraft();
      },
      handleOk () {
        this.$refs.realForm.submitForm();
      },
      submitCallback(){
        this.$emit('ok');
        this.visible = false;
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>

<style scoped>
</style>