<template>
<!--
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <bas-professionals-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></bas-professionals-form>
  </j-modal>
-->

  <a-drawer
    :title="title"
    width=40%
    placement="right"
    :closable="false"
    :headerStyle="{ textAlign: 'center'}"
    @close="close"
    destroyOnClose
    :visible="visible">
    <bas-professionals-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" :activeKey="activeKey"></bas-professionals-form>
    <div  style="text-align: center;">
      <a-button key="approved"  @click="handleOk" type="primary" v-if="!disableSubmit">提交</a-button>
      <a-button key="cancel" @click="handleCancel" style="margin-left:10px;"  type="primary" ghost>取消</a-button>
    </div>
  </a-drawer>
</template>

<script>

  import BasProfessionalsForm from './BasProfessionalsForm'
  export default {
    name: 'BasProfessionalsModal',
    props: {
      activeKey:{
        type: String,
        default: false,
        required: false
      }
    },
    components: {
      BasProfessionalsForm
    },
    data () {
      return {
        title:'',
        width:800,
        visible: false,
        disableSubmit: false
      }
    },
    methods: {
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