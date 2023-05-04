<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="源币种" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="currencyA">
              <a-input v-model="model.currencyA" placeholder="请输入源币种"  disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="源币种值" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="valueA">
              <a-input-number v-model="model.valueA" placeholder="请输入源币种" style="width: 100%" disabled/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="目标币种" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="currencyB">
              <a-input v-model="model.currencyB" placeholder="请输入目标币种"  disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="目标币种值" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="valueB">
              <a-input-number v-model="model.valueB" placeholder="请输入目标币种值" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="月份" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="month">
              <a-input v-model="model.month" placeholder="请输入月份"  disabled></a-input>
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
    name: 'BasRateMainForm',
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
          add: "/srm/basRateMain/add",
          edit: "/srm/basRateMain/edit",
          queryById: "/srm/basRateMain/queryById"
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