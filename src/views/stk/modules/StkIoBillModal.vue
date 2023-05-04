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
    <stk-io-bill-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" :action="action"/>
    <!--验收确认-->
    <div  style="text-align: center;" v-if="action == 'check'">
      <a-button  @click="handleCheck" type="primary">确认</a-button>
      <a-button   @click="handleCancel" style="margin-left:10px;"  type="primary" ghost>取消</a-button>
    </div>
    <!--入库申请-->
    <div  style="text-align: center;" v-else-if="action == 'approve'">
      <a-button  @click="handlePass" type="primary">确认</a-button>
      <a-button   @click="handleCancel" style="margin-left:10px;"  type="primary" ghost>取消</a-button>
    </div>
    <!--费用维护-->
    <div  style="text-align: center;" v-else-if="action == 'cost'">
      <a-button  @click="handleOk" type="primary">提交</a-button>
      <a-button  @click="handleCancel" style="margin-left:10px;"  type="primary" ghost>取消</a-button>
    </div>

    <div  style="text-align: center;" v-else>
      <a-button  @click="handleOk" type="primary" v-if="!disableSubmit">提交</a-button>
      <a-button  @click="handleCancel" style="margin-left:10px;"  type="primary" ghost>取消</a-button>
    </div>
  </a-drawer>
</template>

<script>

  import StkIoBillForm from './StkIoBillForm'

  export default {
    name: 'StkIoBillModal',
    components: {
      StkIoBillForm
    },
    data() {
      return {
        record:{},
        action:'',
        title:'',
        width:'90%',
        visible: false,
        disableSubmit: false
      }
    },
    methods:{
      //新增
      add () {
        this.action = 'add';
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.add();
        })
      },
      //详情
      view(record){
        this.action = 'view';
        this.record = record;
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      //费用维护
      editCost(record){
        this.action = 'cost';
        this.record = record;
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      //验收
      check(record){
        this.action = 'check';
        this.visible=true
        this.record = record;
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      //审核
      approve(record){
        this.action = 'approve';
        this.visible=true
        this.record = record;
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      //编辑
      edit (record) {
        this.action = 'edit';
        this.visible=true
        this.record = record;
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
      handleCheck(){
        this.$refs.realForm.handleCheck();
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