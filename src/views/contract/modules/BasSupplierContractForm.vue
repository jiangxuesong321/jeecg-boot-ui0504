<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="合同编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="contractNum">
              <a-input-number v-model="model.contractNum" placeholder="请输入合同编号" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="合同名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="contractName">
              <a-input v-model="model.contractName" placeholder="请输入合同名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="供应商名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="supplierName">
              <a-input v-model="model.supplierName" placeholder="请输入供应商名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="项目名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectName">
              <a-input v-model="model.projectName" placeholder="请输入项目名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status">
              <a-input-number v-model="model.status" placeholder="请输入状态" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="币种" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="currency">
              <a-input v-model="model.currency" placeholder="请输入币种"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="税率" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="rate">
              <a-input-number v-model="model.rate" placeholder="请输入税率" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="合同类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="contractCategory">
              <a-input v-model="model.contractCategory" placeholder="请输入合同类型"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="合同总金额本币" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="totalAmountRmb">
              <a-input-number v-model="model.totalAmountRmb" placeholder="请输入合同总金额本币" style="width: 100%" />
            </a-form-model-item>
          </a-col>

          <a-col :span="24">
            <a-form-model-item label="合同总金额原币" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="totalAmountOther">
              <a-input-number v-model="model.totalAmountOther" placeholder="请输入合同总金额原币" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="已付总金额本币" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="payAmountRmb">
              <a-input-number v-model="model.payAmountRmb" placeholder="请输入已付总金额本币" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="已付总金额原币" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="payAmountOther">
              <a-input-number v-model="model.payAmountOther" placeholder="请输入已付总金额原币" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="开票总金额本币" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="invoiceAmountRmb">
              <a-input-number v-model="model.invoiceAmountRmb" placeholder="请输入开票总金额本币" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="开票总金额原币" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="invoiceAmountOther">
              <a-input-number v-model="model.invoiceAmountOther" placeholder="请输入开票总金额原币" style="width: 100%" />
            </a-form-model-item>
          </a-col>

        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'BasSupplierContractForm',
    components: {
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        model:{
         },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
        },
        url: {
          add: "/srm/basSupplierContract/add",
          edit: "/srm/basSupplierContract/edit",
          queryById: "/srm/basSupplierContract/queryById"
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }

        })
      },
    }
  }
</script>