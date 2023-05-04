<template>
  <a-drawer
    :title="title"
    width=80%
    placement="right"
    :closable="false"
    @close="close"
    destroyOnClose
    :visible="visible">
    <div class="drawer-footer" style="text-align: center;">
      <a-button key="cancel" @click="handleCancel" style="margin-left:10px;"  type="primary" ghost>取消</a-button>
    </div>
		<div class="card-title">
			基本信息
		</div>
    <a-row>
      <a-form ref="form" :model="model" >
          <a-col :span="8">
            <a-form-item label="物料编码" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              {{model.code}}
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="物料名称" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              {{model.name}}
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="物料大类" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              {{model.categoryName}}
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="规格型号" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              {{model.speType}}
            </a-form-item>
          </a-col>
<!--          <a-col :span="8">-->
<!--            <a-form-item label="采购员" :labelCol="labelCol" :wrapperCol="wrapperCol" >-->
<!--              {{model.buyer}}-->
<!--            </a-form-item>-->
<!--          </a-col>-->
          <a-col :span="8">
            <a-form-item label="设备类别" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              {{model.model_dictText}}
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="设备描述" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              {{model.remark}}
            </a-form-item>
          </a-col>
      </a-form>
    </a-row>
	<div class="card-title">
		更多信息
	</div>
    <a-row>
      <a-tabs v-model:activeKey="tabKey" @change="changeTabs">
        <a-tab-pane key="0" tab="供应商供货信息">
          <material-to-goods ref="materialToGoods" :prodCode="model.code"></material-to-goods>
        </a-tab-pane>
        <a-tab-pane key="1" tab="合同及到货信息">
          <material-to-contract ref="materialToContract" :prodCode="model.code"></material-to-contract>
        </a-tab-pane>
        <a-tab-pane key="2" tab="历史报价信息">
          <material-to-offer ref="materialToOffer" :prodCode="model.code"></material-to-offer>
        </a-tab-pane>
        <a-tab-pane key="3" tab="库存信息">
          <material-to-stock ref="materialToStock" :prodCode="model.code"></material-to-stock>
        </a-tab-pane>
        <a-tab-pane key="4" tab="历史合同价格">
          <material-to-history ref="materialToHistory" :prodCode="model.code"></material-to-history>
        </a-tab-pane>
      </a-tabs>
    </a-row>
  </a-drawer>

</template>

<script>

  import MaterialToGoods from '@views/base/modules/MaterialToGoods'
  import MaterialToContract from '@views/base/modules/MaterialToContract'
  import MaterialToOffer from '@views/base/modules/MaterialToOffer'
  import MaterialToStock from '@views/base/modules/MaterialToStock'
  import MaterialToHistory from '@views/base/modules/MaterialToHistory'

  export default {
    name: 'BasMaterialModal',
    components: {
      MaterialToGoods,
      MaterialToContract,
      MaterialToOffer,
      MaterialToStock,
      MaterialToHistory
    },
    data () {
      return {
        tabKey:'0',
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        model:{},
        title:'设备详情',
        width:800,
        visible: false,
        disableSubmit: false
      }
    },
    methods: {
      changeTabs(tab){
        let that = this;
        if(tab == 0){
          setTimeout(()=>{
            that.$refs.materialToGoods.loadData(1);
          }, 300)
        }else if(tab == 1){
          setTimeout(()=>{
            that.$refs.materialToContract.loadData(1);
          }, 300)
        }else if(tab == 2){
          setTimeout(()=>{
            that.$refs.materialToOffer.loadData(1);
          }, 300)
        }else if(tab == 3){
          setTimeout(()=>{
            that.$refs.materialToStock.loadData(1);
          }, 300)
        }else if(tab == 4){
          setTimeout(()=>{
            that.$refs.materialToHistory.loadData(1);
          }, 300)
        }
      },
      initData (record,type) {
        this.visible = true;
        this.model = record;
        this.tabKey = '0';
        if(type == '2'){
          this.tabKey = '4';
        }
      },
      close () {
        this.$emit('close');
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
  bottom: 0px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
  z-index: 9999;
}
</style>