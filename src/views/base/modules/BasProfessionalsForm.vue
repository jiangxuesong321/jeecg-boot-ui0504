<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="专家分类" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="userCategory">
              <j-dict-select-tag type="list" v-model="model.userCategory" dictCode="expert_category" placeholder="请选择专家分类" disabled/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="选择专家" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="code">
              <j-select-user-by-dep :multi="false" v-model="model.code" @change="toBack"></j-select-user-by-dep>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="部门" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="department">
              <a-input v-model="model.department" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="公司" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="company">
              <a-input v-model="model.company" disabled></a-input>
            </a-form-model-item>
          </a-col>
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="email">-->
<!--              <a-input v-model="model.email" placeholder="请输入邮箱"  ></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { isNotNullOrEmpty, isNullOrEmpty, validateDuplicateValue, validateEmail } from '@/utils/util'
  import { queryall } from '@/api/api'

  export default {
    name: 'BasProfessionalsForm',
    components: {
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      },
      activeKey:{
        type: String,
        default: false,
        required: false
      }
    },
    data () {
      return {
        model:{
          userCategory:'',
          code:'',
          department:'',
          email:''
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
           code: [
              { required: true, message: '请选择专家'},
           ],
           isEnabled: [
              { required: true, message: '请输入是否启用!'},
           ],
        },
        rolesOptions:[],
        disableSubmit:false,
        url: {
          add: "/srm/basProfessionals/add",
          edit: "/srm/basProfessionals/edit",
          queryById: "/srm/basProfessionals/queryById"
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
      toBack(usernames,rows){
        let username = usernames;
        this.model.email = rows[0].email;
        this.model.nickName = rows[0].realname;
        let url = "/sys/user/fetchDeptByUsername";
        getAction(url,{username:username}).then(res => {
          let data = res;
          if(data != null){
            this.model.department = data.departName;
            this.model.company = data.company;
            this.$forceUpdate();
          }
        })
      },
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        if(isNullOrEmpty(this.model.userCategory)){
          this.model.userCategory = this.activeKey;
        }
        this.visible = true;
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let email = that.model.email;
            if(isNotNullOrEmpty(email) && !validateEmail(email)){
              that.$message.warning('邮箱格式不正确');
              return;
            }
            that.$confirm({
              content: `是否确认提交`,
              onOk: () => {
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