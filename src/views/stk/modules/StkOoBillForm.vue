<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
       <a-col :span="12" >
            <a-form-model-item label="单据编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="billNo">
              <a-input v-model="model.billNo" placeholder="请输入单据编号" ></a-input>
            </a-form-model-item>
          </a-col>
       <a-col :span="12" >
            <a-form-model-item label="出入库类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="stockIoType">
              <a-input v-model="model.stockIoType" placeholder="请输入出入库类型(00:领料出库,10:盘亏)" ></a-input>
            </a-form-model-item>
          </a-col>
       <a-col :span="12" >
            <a-form-model-item label="单据日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="billDate">
              <j-date placeholder="请选择单据日期" v-model="model.billDate" style="width: 100%" />
            </a-form-model-item>
          </a-col>
       <a-col :span="12" >
            <a-form-model-item label="领用人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="clerkId">
              <a-input v-model="model.clerkId" placeholder="请输入领用人ID" ></a-input>
            </a-form-model-item>
          </a-col>

       <a-col :span="12" >
            <a-form-model-item label="仓库" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="whId">
              <a-input v-model="model.whId" placeholder="请输入仓库ID" ></a-input>
            </a-form-model-item>
          </a-col>
       <a-col :span="12" >
            <a-form-model-item label="设备安装点" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="equAdd">
              <a-input v-model="model.equAdd" placeholder="请输入设备安装点" ></a-input>
            </a-form-model-item>
          </a-col>
       <a-col :span="12" >
            <a-form-model-item label="附件" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="attachment">
              <a-input v-model="model.attachment" placeholder="请输入附件" ></a-input>
            </a-form-model-item>
          </a-col>
       <a-col :span="12" >
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
              <a-input v-model="model.remark" placeholder="请输入备注" ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="出库明细" :key="refKeys[0]" :forceRender="true">
        <j-vxe-table
          keep-source
          :ref="refKeys[0]"
          :loading="stkOoBillDeliveryTable.loading"
          :columns="stkOoBillDeliveryTable.columns"
          :dataSource="stkOoBillDeliveryTable.dataSource"
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
    name: 'StkOoBillForm',
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
           billNo: [
              { required: true, message: '请输入单据编号!'},
           ],
           stockIoType: [
              { required: true, message: '请输入出入库类型!'},
           ],
           billDate: [
              { required: true, message: '请输入单据日期!'},
           ],
        },
        refKeys: ['stkOoBillDelivery', ],
        tableKeys:['stkOoBillDelivery', ],
        activeKey: 'stkOoBillDelivery',
        // 出库明细
        stkOoBillDeliveryTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '源单分录号',
              key: 'sourceEntryNo',
               type: JVXETypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '物料',
              key: 'materialId',
               type: JVXETypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '计量单位',
              key: 'unitId',
               type: JVXETypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '数量',
              key: 'qty',
               type: JVXETypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '批次号',
              key: 'batchNo',
               type: JVXETypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '仓库',
              key: 'warehouseId',
               type: JVXETypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
  /*          {
              title: '结算数量',
              key: 'settleQty',
               type: JVXETypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },*/

            {
              title: '库区',
              key: 'whaId',
               type: JVXETypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '物料名称',
              key: 'prodName',
               type: JVXETypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '物料编码',
              key: 'prodCode',
               type: JVXETypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '物料大类',
              key: 'catalogName',
               type: JVXETypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '订单编码',
              key: 'orderNumber',
               type: JVXETypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '备注',
              key: 'remark',
              type: JVXETypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
          ]
        },
        url: {
          add: "/srm/stkOoBill/add",
          edit: "/srm/stkOoBill/edit",
          queryById: "/srm/stkOoBill/queryById",
          stkOoBillDelivery: {
            list: '/srm/stkOoBill/queryStkOoBillDeliveryByMainId'
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
        this.stkOoBillDeliveryTable.dataSource=[]
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
          this.requestSubTableData(this.url.stkOoBillDelivery.list, params, this.stkOoBillDeliveryTable)
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
          stkOoBillDeliveryList: allValues.tablesValue[0].tableData,
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