<template>
<!--  <j-modal-->
<!--    :title="title"-->
<!--    :width="1200"-->
<!--    :visible="visible"-->
<!--    :maskClosable="false"-->
<!--    switchFullscreen-->
<!--    @ok="handleOk"-->
<!--    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"-->
<!--    @cancel="handleCancel">-->
<!--    <approve-setting-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"/>-->
<!--  </j-modal>-->

  <a-drawer
    :title="title"
    width=50%
    placement="right"
    :closable="false"
    :headerStyle="{ textAlign: 'center'}"
    @close="close"
    destroyOnClose
    :visible="visible">
    <approve-setting-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"/>
    <div style="text-align: center;margin-top: 10px">
      <a-button key="approved"  @click="handleOk" type="primary" v-if="!disableSubmit">提交</a-button>
      <a-button key="cancel" @click="handleCancel" style="margin-left:10px;"  type="primary" ghost>取消</a-button>
    </div>
  </a-drawer>
</template>

<script>

  import ApproveSettingForm from '@views/base/modules/ApproveSettingForm'

  export default {
    name: 'PurPayApplyModal',
    components: {
      ApproveSettingForm
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

<style scoped>
</style>