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
    :title="title"
    :width="width"
    placement="right"
    :closable="false"
    :headerStyle="{ textAlign: 'center'}"
    @close="close"
    destroyOnClose
    :visible="visible">
    <inquiry-list-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"/>
    <div style="text-align: center;margin-top:15px;">
      <a-button  @click="toEdit" type="primary" v-if="show" style="margin-left:10px;">修改</a-button>
      <a-button  @click="handleOk" type="primary" v-if="!disableSubmit" style="margin-left:10px;">发布询报价</a-button>
      <a-button key="cancel" @click="handleCancel" style="margin-left:10px;" type="primary" ghost>取消</a-button>
    </div>
  </a-drawer>
  <!-- </j-modal> -->
</template>

<script>

import InquiryListForm from './InquiryListForm'

export default {
  name: 'InquiryListModal',
  components: {
    InquiryListForm
  },
  data() {
    return {
      title:'询价',
      width: '90%',
      visible: false,
      disableSubmit: false,
      show:false,
    }
  },
  methods:{
    add () {
      this.visible=true;
      this.show = false;
      this.$nextTick(()=>{
        this.$refs.realForm.add();
      })
    },
    editList(recordIds){
      this.visible=true
      this.show = false;
      this.$nextTick(()=>{
        this.$refs.realForm.editList(recordIds);
      })
    },
    edit (record) {
      this.visible=true
      this.show = false;
      this.$nextTick(()=>{
        this.$refs.realForm.edit(record);
      })
    },
    editTime(record){
      this.visible=true;
      this.show = true;
      this.disableSubmit = true;
      this.$nextTick(()=>{
        this.$refs.realForm.editTime(record);
      })
    },
    close () {
      this.$emit('close');
      this.visible = false;
    },
    toEdit(){
      this.$refs.realForm.toEdit();
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
}
.drawer-footer{
  position: absolute;
  bottom: -8px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: center;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>