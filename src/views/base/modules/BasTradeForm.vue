<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="贸易方式" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="tradeType">
<!--              <a-input v-model="model.tradeType" placeholder="请输入贸易方式"  ></a-input>-->
              <j-dict-select-tag placeholder="请输入贸易方式" v-model="model.tradeType" dictCode="trade_type"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="运费及通关杂费总计" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="amount">
              <a-input-number v-model="model.amount" placeholder="请输入运费及通关杂费总计" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="增值税税率" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="addTaxBas">
              <a-input-number v-model="model.addTaxBas" placeholder="请输入增值税税率" style="width: 100%" :formatter="value => `${value}%`"
                              :parser="value => value.replace('%', '')"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="关税税率" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="customsTaxBas">
              <a-input-number v-model="model.customsTaxBas" placeholder="请输入关税税率" style="width: 100%" :formatter="value => `${value}%`"
                              :parser="value => value.replace('%', '')"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="公式说明" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="formula">
              <a-input type="textarea" v-model="model.formula" placeholder="请输入公式说明" style="width: 100%" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

import { httpAction, getAction, putAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'BasTradeForm',
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
          amount:[
            { required: true, message: '请输入运费及通关杂费总计!'},
          ],
          tradeType: [
              { required: true, message: '请选择贸易方式!'},
           ],
          addTaxBas: [
              { required: true, message: '请输入增值税税率!'},
           ],
          customsTaxBas: [
              { required: true, message: '请输入关税税率!'},
           ],
        },
        url: {
          add: "/srm/basTrade/add",
          edit: "/srm/basTrade/edit",
          queryById: "/srm/basTrade/queryById"
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
        that.$refs.form.validate(valid => {
          if (valid) {
            that.$confirm({
              content: `是否确认提交?`,
              onOk: () => {
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
          }
        })
      },
    }
  }
</script>