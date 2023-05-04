<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="审核项" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type">
              <j-dict-select-tag placeholder="请输入审核项" v-model="model.type" dictCode="approve_type" @change="clearData" v-if="model.id"/>
              <j-multi-select-tag placeholder="请输入审核项" v-model="model.type" dictCode="approve_type" @change="clearData" v-if="!model.id"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" v-if="model.type != null && model.type.indexOf('pay') > -1">
            <a-form-model-item label="付款类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="payMethod">
              <j-dict-select-tag placeholder="请输入付款类型" v-model="model.payMethod" dictCode="payType" @change="setVal" v-if="model.id"/>
              <j-multi-select-tag placeholder="请输入付款类型" v-model="model.payMethod" dictCode="payType" @change="setVal" v-if="!model.id"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" v-if="model.type != 'supp'">
            <a-form-model-item label="地区" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="company">
              <j-dict-select-tag v-model="model.company" placeholder="请输入地区" dictCode="sys_depart,depart_name,id,parent_id = '-1'" v-if="model.id"/>
              <j-multi-select-tag v-model="model.company" placeholder="请输入地区" dictCode="sys_depart,depart_name,id,parent_id = '-1'" v-if="!model.id"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="审核人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="username">
              <j-select-user-by-dep :multi="false" v-model="model.username" @change="toBack"></j-select-user-by-dep>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>

  </a-spin>
</template>

<script>

import { getAction, httpAction } from '@/api/manage'
  import { JVxeTableModelMixin } from '@/mixins/JVxeTableModelMixin.js'
  import { JVXETypes } from '@/components/jeecg/JVxeTable'
  import { getRefPromise,VALIDATE_FAILED} from '@/components/jeecg/JVxeTable/utils/vxeUtils.js'
  import { isNullOrEmpty, validateDuplicateValue } from '@/utils/util'
  import JFormContainer from '@/components/jeecg/JFormContainer'

  export default {
    name: 'ApproveSetting',
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
          payMethod:'',
          type:'',
          company:'',
          username:''
         },
        validatorRules: {
          payMethod: [
            { required: true, message: '请选择付款方式!'},
          ],
          company: [
            { required: true, message: '请选择合同签约甲方!'},
          ],
          username: [
            { required: true, message: '请选择审核人!'},
          ],
        },
        url: {
          add: "/srm/approveSetting/add",
          edit: "/srm/approveSetting/edit",
          queryById: "/srm/approveSetting/queryById",
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
      setVal(){
        this.$forceUpdate();
      },
      clearData(){
        this.model.payMethod = null;
      },
      handleOk(){
        const that = this
        // 触发表单验证
        that.$refs.form.validate(valid => {
          if (valid) {
            let post = "";
            let url = "";
            if(that.model.id){
              post = 'put';
              url = this.url.edit;
            }else{
              post = 'post';
              url = this.url.add;
            }
            that.$confirm({
              content: `是否确认提交`,
              onOk: () => {
                httpAction(url,that.model,post).then((res)=> {
                  if (res.success) {
                    that.$message.success(res.message);
                    that.$emit('ok');
                  } else {
                    that.$message.warning(res.message);
                  }
                })
              }
            })
          }else{
            return false;
          }
        })
      },
      toBack(usernames,rows){

      },
      add () {
        this.edit({
          payMethod:'',
          type:'',
          company:'',
          username:''
        });
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
    }
  }
</script>

<style scoped>
</style>