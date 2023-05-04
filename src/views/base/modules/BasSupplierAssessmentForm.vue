<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="供应商ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="supplierId">
              <j-dict-select-tag type="radio" v-model="model.supplierId" dictCode="" placeholder="请选择供应商ID" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="供应商名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="supplierName">
              <a-input v-model="model.supplierName" placeholder="请输入供应商名"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="指标内容" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="assessmentContent">
              <a-textarea v-model="model.assessmentContent" rows="4" placeholder="请输入指标内容" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="指标分数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="assessmentScore">
              <a-input-number v-model="model.assessmentScore" placeholder="请输入指标分数" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="删除标识" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="delFlag">
              <a-input v-model="model.delFlag" placeholder="请输入删除标识"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="指标分类" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="assessmentCategory">
              <j-dict-select-tag type="radio" v-model="model.assessmentCategory" dictCode="" placeholder="请选择指标分类" />
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
    name: 'BasSupplierAssessmentForm',
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
          add: "/srm/basSupplierAssessment/add",
          edit: "/srm/basSupplierAssessment/edit",
          queryById: "/srm/basSupplierAssessment/queryById"
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
      add (record) {
        // this.edit(this.modelDefault);
        this.model = Object.assign({}, record);
        this.visible = true;
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