<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
<!--          <a-col :span="24">
            <a-form-model-item label="审核人信息" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="approver">
              <j-select-user-by-dep v-model="model.approver" :multi="false" />
            </a-form-model-item>
          </a-col>-->
          <a-col :span="24">
            <a-form-model-item label="邮件被抄送人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="cpoySendUserIds">
              <j-select-user-by-dep v-model="model.cpoySendUserIds" />
            </a-form-model-item>
          </a-col>
<!--          <a-col :span="24">
            <a-form-model-item label="是否默认" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isDefault">
              <a-input v-model="model.isDefault" placeholder="请输入是否默认"  ></a-input>
            </a-form-model-item>
          </a-col>-->
<!--          <a-col :span="24">
            <a-form-model-item label="使用该配置的类型（备用）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type">
              <a-input v-model="model.type" placeholder="请输入使用该配置的类型（备用）"  ></a-input>
            </a-form-model-item>
          </a-col>-->
          <a-col :span="24">
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
              <a-input v-model="model.remark" placeholder="请输入备注"  ></a-input>
            </a-form-model-item>
          </a-col>
<!--          <a-col :span="24">
            <a-form-model-item label="租户ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="tenantId">
              <a-input v-model="model.tenantId" placeholder="请输入租户ID"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="删除标志位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="delFlag">
              <a-input v-model="model.delFlag" placeholder="请输入删除标志位"  ></a-input>
            </a-form-model-item>
          </a-col>-->
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'ApproverCcMailForm',
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
          add: "/srm/approverCcMail/add",
          edit: "/srm/approverCcMail/edit",
          queryById: "/srm/approverCcMail/queryById"
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