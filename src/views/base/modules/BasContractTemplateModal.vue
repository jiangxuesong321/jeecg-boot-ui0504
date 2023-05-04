<template>
<!--
  <j-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :maskClosable="false"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel">
    <bas-contract-template-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"/>
  </j-modal>
-->

  <a-drawer
    :title="title"
    width=90%
    placement="right"
    :closable="false"
    :headerStyle="{ textAlign: 'center'}"
    @close="close"
    destroyOnClose
    :visible="visible">
    <bas-contract-template-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"/>
    <div style="text-align: center;margin-top: 10px">
      <a-button key="approved"  @click="handleOk" type="primary" v-if="!disableSubmit">提交</a-button>
      <a-button key="cancel" @click="handleCancel" style="margin-left:10px;"  type="primary" ghost>取消</a-button>
    </div>
  </a-drawer>
</template>

<script>

  import BasContractTemplateForm from './BasContractTemplateForm'

  export default {
    name: 'BasContractTemplateModal',
    components: {
      BasContractTemplateForm
    },
    data() {
      return {
        title:'',
        width:800,
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
      handleOk () {
        this.$refs.realForm.handleOk();
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

<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: center;
}
.drawer-footer{
  position: absolute;
  bottom: -8px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>