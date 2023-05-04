<template>
  <a-drawer
    :title="title"
    width=90%
    placement="right"
    :closable="false"
    :headerStyle="{ textAlign: 'center'}"
    @close="close"
    destroyOnClose
    :visible="visible">
    <contract-base-child-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" :action="action"/>
    <div style="text-align: center;">
      <a-button key="cancel" @click="handleCancel"  type="primary" ghost>取消</a-button>
      <a-button  @click="handleOk" type="primary" style="margin-left:10px;" >提交</a-button>
    </div>
  </a-drawer>
</template>

<script>

  import ContractBaseChildForm from './ContractBaseChildForm'

  export default {
    name: 'ContractBaseChildModal',
    components: {
      ContractBaseChildForm
    },
    data() {
      return {
        model:{},
        show:false,
        title:'',
        width:800,
        visible: false,
        disableSubmit: false,
        action:''
      }
    },
    methods:{
      edit(record){
        this.visible = true;
        this.disableSubmit = false;
        this.action = 'edit';
        this.$nextTick(()=>{
          this.$refs.realForm.editTwo(record);
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