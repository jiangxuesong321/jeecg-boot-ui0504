<template>
	<a-drawer
	  title="供应商账号开通"
	  :width="width"
	  placement="right"
	  :closable="false"
	  :headerStyle="{ textAlign: 'center'}"
	  @close="close"
	  destroyOnClose
	  :visible="visible">
		<a-spin :spinning="confirmLoading">
			<j-form-container :disabled="formDisabled">
				<!-- 主表单区域 -->
				<a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
					<a-row>
						<a-col :span="24">
							<a-form-model-item label="供应商代码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="code">
								<a-input v-model="model.code" placeholder="请输入供应商代码" disabled></a-input>
							</a-form-model-item>
						</a-col>
						<a-col :span="24">
							<a-form-model-item label="供应商名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
								<a-input v-model="model.name" placeholder="请输入供应商名称" disabled></a-input>
							</a-form-model-item>
						</a-col>
						<a-col :span="24">
							<a-form-model-item label="系统账号" :labelCol="labelCol" :wrapperCol="wrapperCol"
								prop="sysAccount">
								<a-input v-model="model.sysAccount" placeholder="请输入系统账号" disabled></a-input>
							</a-form-model-item>
						</a-col>
						<a-col :span="24">
							<a-form-model-item label="初始密码" :labelCol="labelCol" :wrapperCol="wrapperCol"
								prop="sysPwd">
								<a-input v-model="model.sysPwd" placeholder="请输入初始密码" disabled></a-input>
							</a-form-model-item>
						</a-col>
            <a-col :span="24">
              <a-form-model-item label="新密码" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                 prop="newSysPwd">
                <a-input v-model="model.newSysPwd" placeholder="请输入新密码"></a-input>
              </a-form-model-item>
            </a-col>
					</a-row>
				</a-form-model>
			</j-form-container>
		</a-spin>
		<div class="drawer-footer" style="text-align: center;margin-top:15px;">
			<a-button key="approved" @click="handleOk" type="primary" v-if="!disableSubmit">重置</a-button>
			<a-button key="cancel" @click="handleCancel" style="margin-left:10px;" type="primary" ghost>取消</a-button>
		</div>
	</a-drawer>
</template>

<script>
	import JFormContainer from '@/components/jeecg/JFormContainer'
	import BasSupplierForm from './BasSupplierForm'
	import {
		billListMixin
	} from '../../mixins/billListMixin'
	import {
		billModalMixin
	} from '../../mixins/billModalMixin'
	import {
		JVxeTableModelMixin
	} from '@/mixins/JVxeTableModelMixin.js'
	import { postAction } from '@/api/manage'

	export default {
		name: 'BasSupplierModal',
		mixins: [JVxeTableModelMixin, billListMixin, billModalMixin],
		components: {
			BasSupplierForm
		},
		data() {
			return {
				title: '',
				width: '40%',
				visible: false,
				disableSubmit: false,
				validatorRules: {
				   sysAccount: [
					  { required: true, message: '请输入系统账号!'},
				   ],
				   sysPwd: [
					  { required: true, message: '请输入初始密码!'},
				   ],
          newSysPwd : [
            { required: true, message: '请输入新密码!'},
          ]
				}
			}
		},
		computed: {
		  formDisabled(){
		    return this.disabled
		  },
		},
		methods: {
			add() {
				this.visible = true
				this.$nextTick(() => {
					this.$refs.realForm.add();
				})
			},
			openModal(record) {
				this.visible = true
				this.model = record
				this.model.id = record.id
				this.model.sysAccount = record.code
			},
			edit(record) {
				this.visible = true
				this.$nextTick(() => {
					this.$refs.realForm.edit(record);
				})
			},
			close() {
				this.$emit('close');
				this.visible = false;
			},
			handleOk() {
			  let that = this;
        that.$refs.form.validate((ok, err) => {
				if (ok) {
          that.loading = true;
				  if(that.model.sysPwd == that.model.newSysPwd){
            that.$message.warning("新密码不能与旧密码一致");
            return;
          }
				  postAction('/srm/basSupplier/resetSrmAccount', that.model).then(({success, result, message}) => {
					if (success) {
            that.$message.success("提交成功");
            that.visible = false;
					} else {
            that.$message.warning(message)
					}
				  }).finally(() => that.$emit('ok'))
				}
			  })
			},
			submitCallback() {
				this.$emit('ok');
				this.visible = false;
			},
			handleCancel() {
				this.close()
			}
		}
	}
</script>

<style scoped>
</style>
