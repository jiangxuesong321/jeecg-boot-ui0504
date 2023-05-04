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
    <contract-base-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" :action="action"/>
    <div style="text-align: center;">
      <div v-if="action == 'view'">
        <a-button key="cancel" @click="handleCancel"  type="primary" ghost>取消</a-button>
      </div>
      <div v-if="action == 'approve'">
        <a-button key="cancel" @click="handleCancel"  type="primary" ghost>取消</a-button>
        <a-button  @click="handleReject" type="primary" style="margin-left:10px;" >驳回</a-button>
        <a-button  @click="handleOA" type="primary" style="margin-left:10px;" >发起OA审批</a-button>
      </div>
      <div v-if="action == 'edit'">
        <a-button key="cancel" @click="handleCancel"  type="primary" ghost>取消</a-button>
        <a-button  @click="handleDraft" type="primary" style="margin-left:10px;" >保存草稿</a-button>
        <a-button  @click="handleOk" type="primary" style="margin-left:10px;" >提交</a-button>
      </div>
    </div>
  </a-drawer>
</template>

<script>

  import ContractBaseForm from './ContractBaseForm'

  export default {
    name: 'ContractBaseModal',
    components: {
      ContractBaseForm
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
      add () {
        this.visible = true;
        this.action = 'add';
        this.$nextTick(()=>{
          this.$refs.realForm.add();
        })
      },
      detail(record){
        this.visible = true;
        this.disableSubmit = true;
        this.action = 'view';
        this.$nextTick(()=>{
          this.$refs.realForm.editTwo(record);
        })
      },
      edit (record,type) {
        this.action = 'edit';
        this.disableSubmit = false;
        this.show = false;
        this.model = {};
        this.visible = true;
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record,type);
        })
      },
      editTwo(record){
        this.action = 'edit';
        this.disableSubmit = false;
        this.visible = true;
        this.model = record;
        this.$nextTick(()=>{
          this.$refs.realForm.editTwo(record);
        })
      },
      editThree(record){
        this.action = 'approve';
        this.disableSubmit = true;
        this.visible = true;
        this.model = record;
        this.$nextTick(()=>{
          this.$refs.realForm.editTwo(record);
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleDraft(){
        this.$refs.realForm.handleDraft();
      },
      handleReject(){
        this.$refs.realForm.handleReject();
      },
      handleOA(){
        this.$refs.realForm.handleOA();
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