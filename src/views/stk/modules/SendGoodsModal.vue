<template>
<!--  <j-modal-->
<!--    :title="title"-->
<!--    :width="width"-->
<!--    :visible="visible"-->
<!--    switchFullscreen-->
<!--    @ok="handleOk"-->
<!--    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"-->
<!--    @cancel="handleCancel"-->
<!--    cancelText="关闭">-->
<!--    <send-goods-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></send-goods-form>-->
<!--  </j-modal>-->
  <a-drawer :title="title" :width="width" placement="right" :closable="false" :headerStyle="{ textAlign: 'center'}"
            @close="handleCancel" destroyOnClose :visible="visible">
    <send-goods-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" :action="action" :approverId="roleCode" :roleCode="roleKey"></send-goods-form>
    <send-goods-pdf ref='modalPdf'></send-goods-pdf>
    <div class="drawer-footer" style="text-align: center;margin-top:15px;">
      <a-button  @click="handleReject" type="primary" v-if="action == 'approve'" style="margin-left:10px;">驳回</a-button>
      <a-button  @click="handlePass" type="primary" v-if="action == 'approve'" style="margin-left:10px;">通过</a-button>
      <a-button key="cancel" @click="downLoadPdf" style="margin-left:10px;" type="primary" ghost>预览发货单</a-button>
      <a-button key="cancel" @click="handleCancel" style="margin-left:10px;" type="primary" ghost>取消</a-button>
    </div>
  </a-drawer>
</template>

<script>

  import SendGoodsForm from './SendGoodsForm'
  import SendGoodsPdf from '@views/stk/modules/SendGoodsPdf'
  export default {
    name: 'SendGoodsModal',
    props:['roleKey'],
    components: {
      SendGoodsForm,
      SendGoodsPdf
    },
    data () {
      return {
        ruleForm:{},
        roleCode:'',
        action:'',
        title:'',
        width:'90%',
        visible: false,
        disableSubmit: false
      }
    },
    methods: {
      downLoadPdf(record){
        this.$refs.modalPdf.edit(this.ruleForm);
      },
      add () {
        this.ruleForm = {};
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.add();
        })
      },
      edit (record) {
        this.ruleForm = record;
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleReject(){
        this.$refs.realForm.handleReject();
      },
      handlePass(){
        this.$refs.realForm.handlePass();
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