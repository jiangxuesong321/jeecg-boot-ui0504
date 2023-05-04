<template>
  <a-drawer
    :headerStyle="{ textAlign: 'center'}"
    :closable="false"
    :title="title"
    :width="width"
    :visible="visible"
    >

      <a-form-model ref="form" :model="model" :rules="validatorRules">
        <a-form-model-item label="物料大类" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="pid">
          <j-tree-select
            ref="treeSelect"
            placeholder="请选择物料大类"
            v-model="model.pid"
            dict="bas_material_category,name,id"
            pidField="pid"
            pidValue="0"
            hasChildField="has_child"
            :disabled="model.id"
            >
          </j-tree-select>
        </a-form-model-item>
<!--        <a-form-model-item label="是否有子节点" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="hasChild">-->
<!--          <j-switch v-model="model.hasChild" ></j-switch>-->
<!--        </a-form-model-item>-->
        <a-form-model-item label="编码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="code">
          <a-input v-model="model.code" placeholder="请输入编码" :disabled="model.id" :maxLength="10"></a-input>
        </a-form-model-item>
        <a-form-model-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
          <a-input v-model="model.name" placeholder="请输入名称" :maxLength="20"></a-input>
        </a-form-model-item>
<!--        <a-form-model-item label="全名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="fullname">-->
<!--          <a-input v-model="model.fullname" placeholder="请输入全名" ></a-input>-->
<!--        </a-form-model-item>-->
<!--        <a-form-model-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isEnabled">-->
<!--          <j-switch v-model="model.isEnabled" ></j-switch>-->
<!--        </a-form-model-item>-->

      </a-form-model>
    <div style="text-align: center;">
      <a-button key="approved"  @click="handleOk" type="primary" >提交</a-button>
      <a-button key="cancel" @click="handleCancel" style="margin-left:10px;"  type="primary" ghost>取消</a-button>
    </div>

  </a-drawer>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  export default {
    name: "BasMaterialCategoryModal",
    components: {
    },
    data () {
      return {
        title:"操作",
        width:800,
        visible: false,
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
           code: [
              { required: true, message: '请输入编码!'},
           ],
           name: [
              { required: true, message: '请输入名称!'},
           ],
           isEnabled: [
              { required: true, message: '请输入是否启用!'},
           ],
        },
        url: {
          add: "/srm/basMaterialCategory/add",
          edit: "/srm/basMaterialCategory/edit",
        },
        expandedRowKeys:[],
        pidField:"pid",
      }
    },
    created () {
       //备份model原始值
       this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      add (obj,disabled) {
        this.modelDefault.pid=''
        this.edit(Object.assign(this.modelDefault , obj));
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.$refs.form.clearValidate()
      },
      handleOk () {
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
             if(this.model.id && this.model.id === this.model[this.pidField]){
              that.$message.warning("父级节点不能选择自己");
              that.confirmLoading = false;
              return;
            }
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
                that.close();
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }else{
             return false
          }
        })
      },
      handleCancel () {
        this.close()
      },
      submitSuccess(formData,flag){
        if(!formData.id){
          let treeData = this.$refs.treeSelect.getCurrTreeData()
          this.expandedRowKeys=[]
          this.getExpandKeysByPid(formData[this.pidField],treeData,treeData)
          this.$emit('ok',formData,this.expandedRowKeys.reverse());
        }else{
          this.$emit('ok',formData,flag);
        }
      },
      getExpandKeysByPid(pid,arr,all){
        if(pid && arr && arr.length>0){
          for(let i=0;i<arr.length;i++){
            if(arr[i].key==pid){
              this.expandedRowKeys.push(arr[i].key)
              this.getExpandKeysByPid(arr[i]['parentId'],all,all)
            }else{
              this.getExpandKeysByPid(pid,arr[i].children,all)
            }
          }
        }
      }


    }
  }
</script>
<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: center;
}
.drawer-footer{
  position: absolute;
  bottom: -8px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>