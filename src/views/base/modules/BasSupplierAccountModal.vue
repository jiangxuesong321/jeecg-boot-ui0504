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
			<j-form-container>
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
								<a-input v-model="model.sysAccount" placeholder="请输入系统账号" :disabled="disabled"></a-input>
							</a-form-model-item>
						</a-col>
						<a-col :span="24">
							<a-form-model-item label="初始密码" :labelCol="labelCol" :wrapperCol="wrapperCol"
								prop="sysPwd">
								<a-input v-model="model.sysPwd" placeholder="请输入初始密码" :disabled="disabled"></a-input>
							</a-form-model-item>
						</a-col>

            <a-col :span="24">
              <a-form-model-item label="付款日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-date-picker v-model="model.payTime" placeholder="请输入付款日期" style="width: 100%"/>
              </a-form-model-item>
            </a-col>

            <a-col :span="24">
              <a-form-model-item label="供应商有效期" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
                <a-date-picker v-model="model.startTime" placeholder="请输入开始日期" style="width: 47%"/>
                ---
                <a-date-picker v-model="model.endTime" placeholder="请输入结束日期" style="width: 47%"/>
              </a-form-model-item>
            </a-col>
					</a-row>
				</a-form-model>
			</j-form-container>
		</a-spin>
		<div class="drawer-footer" style="text-align: center;margin-top:15px;">
			<a-button key="approved" @click="handleOk" type="primary" v-if="!disabled">开通</a-button>
      <a-button key="approved" @click="handleReNew" type="primary" v-if="disabled">续费</a-button>
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
  import { postAction, putAction } from '@/api/manage'
  import { isNullOrEmpty } from '@/utils/util'

	export default {
		name: 'BasSupplierModal',
		mixins: [JVxeTableModelMixin, billListMixin, billModalMixin],
		components: {
			BasSupplierForm
		},
		data() {
			return {
			  disabled : false,
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
          payTime : [
            { required: true, message: '请输入付款日期!'},
          ],
          startTime : [
            { required: true, message: '请输入生效开始日期!'},
          ],
          endTime : [
            { required: true, message: '请输入生效结束日期!'},
          ]
				}
			}
		},
		computed: {

		},
		methods: {
			add() {
				this.visible = true
				this.$nextTick(() => {
					this.$refs.realForm.add();
				})
			},
			openModal(record,type) {
				this.visible = true;
				this.model = record;
				this.model.id = record.id;
				this.model.sysAccount = record.code;
				if(type == '1'){
				  this.disabled = true;
        }else{
          this.disabled = false;
        }
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
      handleReNew(){
			  let that = this;
        that.$refs.form.validate((ok, err) => {
          if (ok) {
            let startTime = that.model.startTime;
            if(isNullOrEmpty(startTime)){
              that.$message.error("请输入有效开始时间");
              return;
            }
            let endTime = that.model.endTime;
            if(isNullOrEmpty(endTime)){
              that.$message.error("请输入有效结束时间");
              return;
            }
            that.loading = true
            postAction('/srm/basSupplier/reNew', that.model).then(({success, result, message}) => {
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
			handleOk() {
        let that = this;
        that.$refs.form.validate((ok, err) => {
				if (ok) {
				  let startTime = that.model.startTime;
				  if(isNullOrEmpty(startTime)){
            that.$message.error("请输入有效开始时间");
            return;
          }
				  let endTime = that.model.endTime;
				  if(isNullOrEmpty(endTime)){
            that.$message.error("请输入有效结束时间");
            return;
          }
          that.$confirm({
            title: "",
            content: "是否确认提交?",
            onOk: function () {
              postAction('/srm/basSupplier/createSrmAccount', that.model).
              then(({success, result, message}) => {
                if (success) {
                  that.$message.success("提交成功");
                  that.visible = false;
                  that.$emit('ok')
                } else {
                  that.$message.warning(message)
                }
              })
            }
          });
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
