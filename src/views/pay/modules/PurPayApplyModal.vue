<template>
  <a-drawer
  :title="title"
  :width="width"
  placement="right"
  :closable="false"
  :headerStyle="{ textAlign: 'center'}"
  @close="close"
  destroyOnClose
  :visible="visible">
  <pur-pay-apply-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" :action="action"/>
  <div style="text-align: center;">
    <a-button @click="handleCancel" style="margin-left:10px;" type="primary" ghost>取消</a-button>
    <a-button @click="handleReject" type="primary" style="margin-left:10px;" v-if="!disableSubmit">驳回</a-button>
    <a-button @click="handlePass" type="primary" style="margin-left:10px;" v-if="!disableSubmit">通过</a-button>
  </div>
  </a-drawer>
</template>

<script>

  import PurPayApplyForm from './PurPayApplyForm'

  export default {
    name: 'PurPayApplyModal',
    components: {
      PurPayApplyForm
    },
    data() {
      return {
        title:'',
        width:'90%',
        visible: false,
        disableSubmit: false,
        action:'add',
      }
    },
    methods:{
      handlePass(){
        this.$refs.realForm.handlePass();
      },
      handleReject(){
        this.$refs.realForm.handleReject();
      },
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