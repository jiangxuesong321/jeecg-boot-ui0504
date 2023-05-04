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
    <pur-pay-plan-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" @changeDisabled="changeDisabled"/>
    <div  style="text-align: center;">
      <a-button key="approved"  @click="handleOk" type="primary" v-if="!disableSubmit" :disabled="disabled">提交</a-button>
      <a-button key="cancel" @click="handleCancel" style="margin-left:10px;"  type="primary" ghost :disabled="disabled">取消</a-button>
    </div>
  </a-drawer>
</template>

<script>

  import PurPayPlanForm from './PurPayPlanForm'

  export default {
    name: 'PurPayPlanModal',
    components: {
      PurPayPlanForm
    },
    data() {
      return {
        disabled:false,
        title:'付款计划',
        width:'90%',
        visible: false,
        disableSubmit: false
      }
    },
    methods:{
      changeDisabled(disabled){
        this.disabled = disabled;
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
        this.disabled = false;
      },
      handleOk () {
        this.$refs.realForm.handleOk();
      },
      submitCallback(){
        this.$emit('ok');
        this.visible = false;
        this.disabled = false;
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