<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="付款申请单号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="applyCode">
              <a-input v-model="model.applyCode" placeholder="请输入付款申请单号" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="付款金额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="payAmount">
              <a-input-number v-model="model.payAmount" placeholder="请输入付款金额" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="税率" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="taxRate">
              <a-input-number v-model="model.taxRate" placeholder="请输入税率" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="付款方式" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="payMethod">
              <a-input v-model="model.payMethod" placeholder="请输入付款方式" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="币种" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="currency">
              <a-input v-model="model.currency" placeholder="请输入币种" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="申请理由" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="applyReason">
              <a-input v-model="model.applyReason" placeholder="请输入申请理由" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="申请状态：00：待审核10：已驳回20:已受理,30:部分付款,40:付款完成" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="applyStatus">
              <a-input v-model="model.applyStatus" placeholder="请输入申请状态：00：待审核10：已驳回20:已受理,30:部分付款,40:付款完成" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="申请时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="applyTime">
              <j-date placeholder="请选择申请时间" v-model="model.applyTime" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="收款开户行" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="receivingBank">
              <a-input v-model="model.receivingBank" placeholder="请输入收款开户行" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="收款账号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="receivingNumber">
              <a-input v-model="model.receivingNumber" placeholder="请输入收款账号" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="应付款日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="dueDate">
              <j-date placeholder="请选择应付款日期" v-model="model.dueDate" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="供应商id" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="suppId">
              <a-input v-model="model.suppId" placeholder="请输入供应商id" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="驳回理由" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="returnReason">
              <a-input v-model="model.returnReason" placeholder="请输入驳回理由" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="是否需要发票" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isNeedInvoice">
              <a-input v-model="model.isNeedInvoice" placeholder="请输入是否需要发票" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="comment">
              <a-input v-model="model.comment" placeholder="请输入备注" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sort">
              <a-input-number v-model="model.sort" placeholder="请输入排序" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="租户ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="tenantId">
              <a-input v-model="model.tenantId" placeholder="请输入租户ID" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="删除标志位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="delFlag">
              <a-input v-model="model.delFlag" placeholder="请输入删除标志位" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="创建人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="createUser">
              <a-input v-model="model.createUser" placeholder="请输入创建人" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="修改人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="updateUser">
              <a-input v-model="model.updateUser" placeholder="请输入修改人" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="付款状态【0：未付款；1：部分付款；2：已完成付款；3已关闭】" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="payStatus">
              <a-input v-model="model.payStatus" placeholder="请输入付款状态【0：未付款；1：部分付款；2：已完成付款；3已关闭】" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="审核人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="auditor">
              <a-input v-model="model.auditor" placeholder="请输入审核人" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="审核日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="auditorDate">
              <j-date placeholder="请选择审核日期" v-model="model.auditorDate" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="发票金额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="invoiceAmount">
              <a-input-number v-model="model.invoiceAmount" placeholder="请输入发票金额" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="发票号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="invoiceNumber">
              <a-input v-model="model.invoiceNumber" placeholder="请输入发票号" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="发票时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="invoiceDate">
              <j-date placeholder="请选择发票时间" v-model="model.invoiceDate" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="发票代码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="invoiceCode">
              <a-input v-model="model.invoiceCode" placeholder="请输入发票代码" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="审批人ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="approvalUserId">
              <a-input v-model="model.approvalUserId" placeholder="请输入审批人ID" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="审批人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="approvalUserName">
              <a-input v-model="model.approvalUserName" placeholder="请输入审批人" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="审批时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="approvalTime">
              <j-date placeholder="请选择审批时间" v-model="model.approvalTime" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="付款类型：00：预付款 10：月结款" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="payType">
              <a-input v-model="model.payType" placeholder="请输入付款类型：00：预付款 10：月结款" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="贸易商自己的付款方式" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="traderPayment">
              <a-input v-model="model.traderPayment" placeholder="请输入贸易商自己的付款方式" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="付款追加类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="addToType">
              <a-input v-model="model.addToType" placeholder="请输入付款追加类型" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="流程实例ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="processInstanceId">
              <a-input v-model="model.processInstanceId" placeholder="请输入流程实例ID" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="审批状态(0:待审批,1:审批通过)" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="checkStatus">
              <a-input v-model="model.checkStatus" placeholder="请输入审批状态(0:待审批,1:审批通过)" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="受理审批" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="acceptComment">
              <a-input v-model="model.acceptComment" placeholder="请输入受理审批" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="是否整单(1：整单支付 2：部分支付)" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isWholeSheet">
              <a-input v-model="model.isWholeSheet" placeholder="请输入是否整单(1：整单支付 2：部分支付)" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="付款比例(%)" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="payRate">
              <a-input-number v-model="model.payRate" placeholder="请输入付款比例" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="供应商名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="suppName">
              <a-input v-model="model.suppName" placeholder="请输入供应商名称" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="付款申请金额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="applyPayAmount">
              <a-input-number v-model="model.applyPayAmount" placeholder="请输入付款申请金额" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="付款申请来源（00：非月结，10月结）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="applySource">
              <a-input v-model="model.applySource" placeholder="请输入付款申请来源（00：非月结，10月结）" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="申请附件地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="attachment">
              <a-textarea v-model="model.attachment" rows="4" placeholder="请输入申请附件地址" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="实际付款金额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="actPayAmount">
              <a-input-number v-model="model.actPayAmount" placeholder="请输入实际付款金额" style="width: 100%" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="付款申请明细" :key="refKeys[0]" :forceRender="true">
        <j-vxe-table
          keep-source
          :ref="refKeys[0]"
          :loading="purPayApplyDetailTable.loading"
          :columns="purPayApplyDetailTable.columns"
          :dataSource="purPayApplyDetailTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :toolbar="true"
          />
      </a-tab-pane>
    </a-tabs>
  </a-spin>
</template>

<script>

  import { getAction } from '@/api/manage'
  import { JVxeTableModelMixin } from '@/mixins/JVxeTableModelMixin.js'
  import { JVXETypes } from '@/components/jeecg/JVxeTable'
  import { getRefPromise,VALIDATE_FAILED} from '@/components/jeecg/JVxeTable/utils/vxeUtils.js'
  import { validateDuplicateValue } from '@/utils/util'
  import JFormContainer from '@/components/jeecg/JFormContainer'

  export default {
    name: 'PurPayApplyForm',
    mixins: [JVxeTableModelMixin],
    components: {
      JFormContainer,
    },
    data() {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        model:{
         },
        // 新增时子表默认添加几行空数据
        addDefaultRowNum: 1,
        validatorRules: {
        },
        refKeys: ['purPayApplyDetail', ],
        tableKeys:['purPayApplyDetail', ],
        activeKey: 'purPayApplyDetail',
        // 付款申请明细
        purPayApplyDetailTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '付款申请ID',
              key: 'applyId',
               type: JVXETypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '采购订单ID',
              key: 'purchaseOrderId',
               type: JVXETypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '入库单明细ID',
              key: 'billDetailId',
               type: JVXETypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '备注',
              key: 'comment',
               type: JVXETypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '付款比例(%)',
              key: 'payRate',
               type: JVXETypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '付款金额',
              key: 'payAmount',
               type: JVXETypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '付款状态【0：未付款；1：部分付款；2：已完成付款；3已关闭】',
              key: 'payStatus',
               type: JVXETypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '0:采购订单，1：退货单',
              key: 'payType',
               type: JVXETypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
          ]
        },
        url: {
          add: "/srm/purPayApply/add",
          edit: "/srm/purPayApply/edit",
          queryById: "/srm/purPayApply/queryById",
          purPayApplyDetail: {
            list: '/srm/purPayApply/queryPurPayApplyDetailByMainId'
          },
        }
      }
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
    },
    methods: {
      addBefore(){
        this.purPayApplyDetailTable.dataSource=[]
      },
      getAllTable() {
        let values = this.tableKeys.map(key => getRefPromise(this, key))
        return Promise.all(values)
      },
      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter() {
        this.$nextTick(() => {
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.purPayApplyDetail.list, params, this.purPayApplyDetailTable)
        }
      },
      //校验所有一对一子表表单
        validateSubForm(allValues){
            return new Promise((resolve,reject)=>{
              Promise.all([
              ]).then(() => {
                resolve(allValues)
              }).catch(e => {
                if (e.error === VALIDATE_FAILED) {
                  // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
                  this.activeKey = e.index == null ? this.activeKey : this.refKeys[e.index]
                } else {
                  console.error(e)
                }
              })
            })
        },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)
        return {
          ...main, // 展开
          purPayApplyDetailList: allValues.tablesValue[0].tableData,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },

    }
  }
</script>

<style scoped>
</style>