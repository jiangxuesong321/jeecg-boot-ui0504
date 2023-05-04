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
    <stk-return-bill-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" :action="action"/>

    <div class="drawer-footer" style="text-align: center;" v-if="action == 'approve'">
      <a-button   @click="handlePass" type="primary">通过</a-button>
      <a-button   @click="handleReject" type="primary" style="margin-left:10px;">驳回</a-button>
      <a-button   @click="handleCancel" style="margin-left:10px;"  type="primary" ghost>取消</a-button>
    </div>

    <div class="drawer-footer" style="text-align: center;" v-if="action != 'approve' && action != 'return'">
      <a-button   @click="handleOk" type="primary" v-if="!disableSubmit">提交</a-button>
      <a-button   @click="handleCancel" style="margin-left:10px;"  type="primary" ghost>取消</a-button>
    </div>
  </a-drawer>
</template>

<script>

  import StkReturnBillForm from '@views/stk/modules/StkReturnBillForm'

  export default {
    name: 'StkIoBillModal',
    components: {
      StkReturnBillForm
    },
    data() {
      return {
        action:'',
        title:'',
        width:'90%',
        visible: false,
        disableSubmit: false
      }
    },
    methods:{

      add () {
        this.action = 'add';
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.add();
        })
      },
      view(record){
        this.action = 'view';
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      return(record){
        this.action = 'return';
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      approve(record){
        this.action = 'approve';
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      edit (record) {
        this.action = 'edit';
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