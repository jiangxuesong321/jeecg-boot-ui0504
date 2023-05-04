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
  <a-drawer
    :title="title"
    width=50%
    placement="right"
    :closable="false"
    :headerStyle="{ textAlign: 'center'}"
    @close="handleCancel"
    destroyOnClose
    :visible="visible">
    <bas-trade-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></bas-trade-form>
    <div style="text-align: center;margin-top: 10px">
      <a-button key="approved"  @click="handleOk" type="primary" v-if="!disableSubmit">提交</a-button>
      <a-button key="cancel" @click="handleCancel" style="margin-left:10px;"  type="primary" ghost>取消</a-button>
    </div>
  </a-drawer>
<!--  </j-modal>-->
</template>

<script>

  import BasTradeForm from './BasTradeForm'
  export default {
    name: 'BasTradeModal',
    components: {
      BasTradeForm
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