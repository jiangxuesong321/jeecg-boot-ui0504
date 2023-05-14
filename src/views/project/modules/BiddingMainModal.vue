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
		<bidding-main-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" :ptype="ptype" @changeDisable="changeDisable"/>
		<div  style="text-align: center;margin-top:15px;">
      <a-button key="approved" @click="handleChange" type="primary" v-if="ptype == 'change'" :disabled="confirmLoading">发布变更</a-button>
			<a-button key="approved" @click="handleOk" type="primary" v-if="ptype == 'normal'" :disabled="confirmLoading">发布招标</a-button>
			<a-button key="cancel" @click="handleCancel" style="margin-left:10px;" type="primary" :disabled="confirmLoading">取消</a-button>
		</div>
	</a-drawer>
</template>

<script>

  import BiddingMainForm from './BiddingMainForm'

  export default {
    name: 'BiddingMainModal',
    components: {
      BiddingMainForm
    },
    data() {
      return {
        title:'招标',
        width: '90%',
        visible: false,
        disableSubmit: false,
        confirmLoading:false,
        ptype:'normal',
      }
    },
    methods:{
      changeDisable(disabled){
        this.confirmLoading = disabled;
      },
      add () {
        this.confirmLoading = false;
        this.visible=true
        this.disableSubmit = false;
        this.$nextTick(()=>{
          this.$refs.realForm.add();
        })
      },
      //发起招标
      edit (record) {
        this.visible = true;
        this.ptype = 'normal';
        this.confirmLoading = false;
        this.disableSubmit = false;
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      //招标详情
      editTwo(record,type){
        this.visible = true;
        this.ptype = type;
        this.confirmLoading = false;
        this.$nextTick(()=>{
          this.$refs.realForm.editTwo(record);
        })
      },
      //查看评标专家
      editThree(record,type){
        this.visible = true;
        this.ptype = type;
        this.confirmLoading = false;
        this.$nextTick(()=>{
          this.$refs.realForm.editThree(record);
        })
      },
      close () {
        this.confirmLoading = false;
        this.$emit('close');
        this.visible = false;
      },
      handleChange(){
        this.$refs.realForm.handleChange();
      },
      handleOk () {
        this.$refs.realForm.handleOk();
      },
      submitCallback(){
        this.$emit('ok');
        this.confirmLoading = false;
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