<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="地区" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="area">
<!--              <a-input v-model="model.area" placeholder="请输入地区"  :maxLength="10"></a-input>-->
              <j-dict-select-tag v-model="model.area" placeholder="请输入地区" dictCode="sys_depart,depart_name,id,parent_id = '-1'" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="厂区" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model="model.name" placeholder="请输入厂区"  :maxLength="10"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isEnabled">
              <j-dict-select-tag type="select" v-model="model.isEnabled" dictCode="dict_item_status"
                                 placeholder="请选择是否启用" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
              <a-input v-model="model.remark" placeholder="请输入备注"  type="textarea" :maxLength="200"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

import { httpAction } from '@/api/manage'
import { isNotNullOrEmpty, isNullOrEmpty, validateMobile } from '@/utils/util'

export default {
    name: 'BasWarehouseForm',
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
          code:'',
          name:'',
          master:'',
          phone:'',
          remark:''
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
          area: [
              { required: true, message: '请输入地区!'},
           ],
          name: [
            { required: true, message: '请输入厂区名称!'},
          ],
          status: [
            { required: true, message: '请选择状态!'},
          ],
        },
        url: {
          add: "/srm/basWarehouse/add",
          edit: "/srm/basWarehouse/edit",
          queryById: "/srm/basWarehouse/queryById"
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
        this.model.phone = rows[0].phone;
      },
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        if(isNullOrEmpty(this.model.isEnabled)){
          this.model.isEnabled = '1';
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
            let phone = that.model.phone;
            if(isNotNullOrEmpty(phone) && !validateMobile(phone)){
              that.$message.warning('联系方式格式不正确');
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