<template>
	<a-drawer title="项目详情" :width="width" placement="right" :closable="false" :headerStyle="{ textAlign: 'center'}"
		@close="close" destroyOnClose :visible="visible">
    <proj-base-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"
                    v-if="ptype == 'edit' || ptype == 'add'" :ptype="ptype"></proj-base-form>

		<a-tabs v-model="tabKey" @change="handleChange" v-if="ptype != 'edit' && ptype != 'add'">
      <a-tab-pane  key="0" tab="项目概况">
<!--        <bas-eqp-modal ref="eqpModal" :projId="model.id"></bas-eqp-modal>-->
        <project-over-view-modal ref="overView"></project-over-view-modal>
      </a-tab-pane>

			<a-tab-pane key="1" tab="项目信息">
				<proj-base-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" :ptype="ptype"></proj-base-form>
			</a-tab-pane>

			<a-tab-pane  key="2" tab="项目资金">
<!--        <process-match-modal ref="matchModal" :projId="model.id"></process-match-modal>-->
        <project-money-modal ref="money"></project-money-modal>
			</a-tab-pane>
<!--			<a-tab-pane  key="4" tab="自动化配套">-->
<!--        <bas-auto-modal ref="autoModal" :projId="model.id"></bas-auto-modal>-->
<!--			</a-tab-pane>-->
<!--      <a-tab-pane  key="5" tab="信息化配套">-->
<!--        <bas-info-modal ref="infoModal" :projId="model.id"></bas-info-modal>-->
<!--      </a-tab-pane>-->
<!--			<a-tab-pane  key="6" tab="基建配套">-->
<!--				<bas-infr-modal ref="infrModal" :projId="model.id"></bas-infr-modal>-->
<!--			</a-tab-pane>-->
<!--      <a-tab-pane  key="7" tab="手续及评价类">-->
<!--        <procedure-eval-modal ref="evalModal" :projId="model.id"></procedure-eval-modal>-->
<!--      </a-tab-pane>-->
			<a-tab-pane  key="3" tab="变更记录">
        <bas-change-modal ref="changeModal" :projId="model.id"></bas-change-modal>
			</a-tab-pane>
			<a-tab-pane  key="4" tab="合同清单">
        <bas-contract-modal ref="contractModal" :projId="model.id"></bas-contract-modal>
			</a-tab-pane>
<!--			<a-tab-pane  key="5" tab="费用分类资金明细">-->
<!--&lt;!&ndash;        <bas-pay-modal ref="payModal" :projId="model.id"></bas-pay-modal>&ndash;&gt;-->
<!--        <project-category-modal ref="category"></project-category-modal>-->
<!--			</a-tab-pane>-->
<!--      <a-tab-pane  key="11" tab="到票金额">-->
<!--        <bas-invoice-modal ref="invoiceModal" :projId="model.id"></bas-invoice-modal>-->
<!--      </a-tab-pane>-->
		</a-tabs>
		<div  style="text-align: center;margin-top:15px;">
			<a-button @click="handleCancel" type="primary" ghost>关闭</a-button>
      <a-button @click="handleOk" type="primary" style="margin-left:10px" v-if="ptype == 'edit' || ptype == 'add'">提交</a-button>
		</div>
	</a-drawer>
</template>

<script>
	import {
		JVxeTableModelMixin
	} from '@/mixins/JVxeTableModelMixin.js'
	import '@/assets/less/TableExpand.less'
	import ProjBaseForm from './ProjBaseForm'
  // import BasEqpModal from '@views/project/modules/BasEqpModal'
  // import ProcessMatchModal from '@views/project/modules/ProcessMatchModal'
  // import BasAutoModal from '@views/project/modules/BasAutoModal'
  // import BasInfoModal from '@views/project/modules/BasInfoModal'
  // import BasInfrModal from '@views/project/modules/BasInfrModal'
  // import ProcedureEvalModal from '@views/project/modules/ProcedureEvalModal'
  import BasChangeModal from '@views/project/modules/BasChangeModal'
  import BasContractModal from '@views/project/modules/BasContractModal'
  // import BasPayModal from '@views/project/modules/BasPayModal'
  // import BasInvoiceModal from '@views/project/modules/BasInvoiceModal'
  import ProjectOverViewModal from '@views/project/modules/history/ProjectOverViewModal'
  import ProjectMoneyModal from '@views/project/modules/ProjectMoneyModal'
  import ProjectCategoryModal from '@views/project/modules/ProjectCategoryModal'

	export default {
		name: 'ProjBaseModal',
		mixins: [JVxeTableModelMixin],
		components: {
			ProjBaseForm,
      // BasEqpModal,
      // ProcessMatchModal,
      // BasAutoModal,
      // BasInfoModal,
      // BasInfrModal,
      // ProcedureEvalModal,
      BasChangeModal,
      BasContractModal,
      // BasPayModal,
      // BasInvoiceModal,
      ProjectOverViewModal,
      ProjectMoneyModal,
      ProjectCategoryModal
		},
		data() {
			return {
			  model:{},
        tabKey:'0',
			  ptype:'',
				title: "操作",
				width: '90%',
				visible: false,
				disableSubmit: false,
				loading: false,
			}
		},
		methods: {
      handleChange(tabKey){
        let that = this;
        if(tabKey == '0'){
          setTimeout(() => {
            that.$refs.overView.edit(this.model);
          }, 300)
        }
        else if(tabKey == '1'){
          setTimeout(() => {
            that.$refs.realForm.edit(this.model);
          }, 300)
        }
        else if(tabKey == '2'){
          setTimeout(() => {
            that.$refs.money.edit(this.model);
          }, 300)
        }
        else if(tabKey == '3'){
          setTimeout(() => {

          }, 300)
        }
        else if(tabKey == '4'){
          setTimeout(() => {
            that.$refs.contractModal.edit(this.model);
          }, 300)
        }
        else if(tabKey == '5'){
          setTimeout(() => {
            setTimeout(() => {
              that.$refs.category.edit(this.model);
            }, 300)
          }, 300)
        }
      },
			add() {
				this.visible = true;
        this.ptype = 'add';
				this.$nextTick(() => {
					this.$refs.realForm.add();
				})
			},
			view(record) {
        let that = this;
        that.visible = true;
        that.ptype = 'view';
        that.model = record;
        that.tabKey = '0';
        setTimeout(() => {
          that.$refs.overView.edit(record);
        }, 300)
			},
			edit(record,type) {
			  this.ptype = 'edit';
        this.model = record;
				this.visible = true;
				this.$nextTick(() => {
					this.$refs.realForm.edit(record,type);
				});
			},
			close() {
				this.$emit('close');
				this.visible = false;
			},
			submitCallback() {
				this.$emit('ok');
				this.visible = false;
			},
      handleDraft(){
        this.$refs.realForm.submitDraft();
      },
			handleOk() {
				this.$refs.realForm.submitForm();
			},
			handleCancel() {
				this.close()
			}
		}
	}
</script>

<style lang="less" scoped>
	/** Button按钮间距 */

	  .ant-row.ant-form-item {
		margin-bottom: 12px;
	  }

	.drawer-footer {
		position: absolute;
		bottom: -8px;
		width: 100%;
		border-top: 1px solid #e8e8e8;
		padding: 10px 16px;
		text-align: center;
		left: 0;
		background: #fff;
		border-radius: 0 0 2px 2px;
	}
</style>
