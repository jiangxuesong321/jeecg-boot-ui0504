<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-button type="primary" style="float: right;z-index: 99" @click="addField">字段自定义</a-button>
        <a-row>
          <a-divider orientation="left" style="color: #00A0E9">
            基础信息
          </a-divider>
          <a-col :span="8">
            <a-form-model-item label="物料名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model="model.name" placeholder="请输入物料名称"  :maxLength="50"></a-input>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="产品类别" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag placeholder="请输入产品类别" v-model="model.model" dictCode="model" :disabled="model.id != null && model.id != '' && model.id != undefined"/>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="物料大类" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="categoryId">
              <a-cascader v-model="model.categoryId" :options="options" placeholder="请输入分类名称" />
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="单位名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="unitId">
              <j-dict-select-tag placeholder="请选择单位名称" v-model="model.unitId" dictCode="unit"/>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="设备型号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="speType">
              <a-input v-model="model.speType" placeholder="请输入设备型号"  :maxLength="100"></a-input>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="设备产地" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="country">
              <a-input v-model="model.country" placeholder="请输入设备产地"  :maxLength="100"></a-input>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="设备品牌" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="brandName">
              <a-input v-model="model.brandName" placeholder="请输入设备品牌"  :maxLength="100"></a-input>
            </a-form-model-item>
          </a-col>

          <a-col :span="8" v-for="(item,index) in basFieldList">
            <a-form-model-item :label="item.keyField" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-model="item.valueField" :placeholder="'请输入'+item.keyField"  :maxLength="100" style="width: 95%"></a-input>
              <a-icon type="delete" style="color: red" @click="delField(index,'0')"/>
            </a-form-model-item>
          </a-col>

          <a-col :span="24" style="margin-left: -24px">
            <a-form-model-item label="设备描述" :labelCol="labelCol1" :wrapperCol="wrapperCol1" prop="remark">
              <a-input v-model="model.remark" placeholder="请输入设备描述"  type="textarea" :maxLength="200" style="width: 40%"></a-input>
            </a-form-model-item>
          </a-col>
          <a-divider orientation="left" style="color: #00A0E9">
            设备规格配置
          </a-divider>
          <a-col :span="8" >
            <a-form-model-item label="工艺要求" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input  v-model="model.workReq" :maxLength="100"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="自动化要求" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input  v-model="model.autoReq" :maxLength="100"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="信息化要求" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input  v-model="model.infoReq" :maxLength="100"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-for="(item,index) in otherFieldList">
            <a-form-model-item :label="item.keyField" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-model="item.valueField" :placeholder="'请输入'+item.keyField"  :maxLength="100" style="width: 95%"></a-input>
              <a-icon type="delete" style="color: red" @click="delField(index,'1')"/>
            </a-form-model-item>
          </a-col>
          <a-divider orientation="left" style="color: #00A0E9">
            设备耗材及配件
          </a-divider>
          <a-col :span="24" style="margin-left: -24px">
              <a-table ref="table" size="middle" :scroll="{x:1000, y:500}" rowKey="id"
                       :columns="columns" :dataSource="dataSource" :pagination="false"
                        bordered>
                <template slot="action" slot-scope="text,record,index">
                  <a @click="delRow(index)">删除</a>
                </template>

                <template slot="name" slot-scope="text,record,index">
                  <a-input v-model="record.name" :maxLength="100"></a-input>
                </template>

                <template slot="brandName" slot-scope="text,record,index">
                  <a-input v-model="record.brandName" :maxLength="100"></a-input>
                </template>

                <template slot="speType" slot-scope="text,record,index">
                  <a-input v-model="record.speType" :maxLength="100"></a-input>
                </template>

                <template slot="qty" slot-scope="text,record,index">
                  <a-input-number v-model="record.qty" style="width:100%"></a-input-number>
                </template>
              </a-table>
              <a-icon type="plus-circle" style="float: right;z-index: 99;font-size: 30px;color: #00A0E9;margin-top: 10px" @click="addRow"/>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
    <a-modal
      title="自定义字段"
      :width="600"
      :visible="visible1"
      @cancel="handleClose"
      @ok="handleOk">
      <a-form-model ref="form1" :model="form">
        <a-form-model-item label="字段类型" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
          <a-select v-model="form.type" style="width: 100%;">
            <a-select-option value="0">基础字段</a-select-option>
            <a-select-option value="1">设备规格配置</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="字段名" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
          <a-input v-model="form.keyField" :maxLength="20"></a-input>
        </a-form-model-item>
        <a-form-model-item label="字段值" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-model="form.valueField" :maxLength="100"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { isNullOrEmpty, validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'BasMaterialForm',
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
        basFieldList:[],
        otherFieldList:[],
        form:{
          name:'',
          type:'',
          keyField:'',
          valueField:''
        },
        visible1:false,
        dataSource:[],
        columns: [{
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: "center",
          customRender: function(t, r, index) {
            return parseInt(index) + 1;
          }
          },
          {
            title: '耗材及配件名称',
            align: "center",
            dataIndex: 'name',
            width: 140,
            scopedSlots: {
              customRender: 'name'
            }
          },
          {
            title: '品牌',
            align: "center",
            dataIndex: 'brandName',
            width: 140,
            scopedSlots: {
              customRender: 'brandName'
            }
          },
          {
            title: '型号',
            align: "center",
            dataIndex: 'speType',
            width: 140,
            scopedSlots: {
              customRender: 'speType'
            }
          },
          {
            title: '数量',
            align: "center",
            dataIndex: 'qty',
            width: 100,
            scopedSlots: {
              customRender: 'qty'
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            width: 100,
            scopedSlots: {
              customRender: 'action'
            }
          }
        ],
        options:[],
        model:{
         },
        labelCol1: {span: 2},
        wrapperCol1: {span: 22},
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
          unitId:[
            { required: true, message: '请选择单位!'},
          ],
          buyer:[
            { required: true, message: '请选择采购员!'},
          ],
          code: [
            { required: true, message: '请输入物料编码!'},
          ],
           name: [
              { required: true, message: '请输入物料名称!'},
           ],
          categoryId: [
            { required: true, message: '请输入物料大类!'},
          ],
           model: [
              { required: true, message: '请输入设备类别!'},
           ],
        },
        url: {
          add: "/srm/basMaterial/add",
          edit: "/srm/basMaterial/edit",
          queryById: "/srm/basMaterial/queryById"
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
      this.loadRoot();
    },
    methods: {
      delField(index,type){
        if(type == '0'){
          this.basFieldList.splice(index,1);
        }else{
          this.otherFieldList.splice(index,1);
        }
      },
      handleOk(){
        let that = this;
        let form = that.form;
        if(isNullOrEmpty(form.type)){
          that.$message.error("请选择字段类型")
          return
        }
        if(isNullOrEmpty(form.keyField)){
          that.$message.error("请输入字段名称")
          return
        }
        // if(isNullOrEmpty(form.value)){
        //   that.$message.error("请选择字段类型")
        //   return
        // }
        if(form.type == '0'){
          if(that.basFieldList == null){
            that.basFieldList = [];
          }
          that.basFieldList.push(form);
        }else{
          if(that.otherFieldList == null){
            that.otherFieldList = [];
          }
          that.otherFieldList.push(form);
        }
        that.handleClose();
      },
      handleClose(){
        this.visible1 = false;
      },
      addField(){
        this.form = {
          type:'',
          keyField:'',
          valueField:'',
          name:''
        }
        this.visible1 = true;
      },
      delRow(index){
        this.dataSource.splice(index,1);
      },
      addRow(){
        let row = {
          name:'',
          brandName:'',
          speType:'',
          qty:0,
        }
        this.dataSource.push(row);
      },
      loadRoot(){
        this.options = [];
        let param = {
          pcode:'',
          async:false
        }
        let url = "/srm/basMaterialCategory/loadTreeRoot";
        getAction(url,param).then(res=>{
          if(res.success && res.result){
            this.options = [...res.result]
          }else{
            console.log("树一级节点查询结果-else",res)
          }
        })
      },

      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.dataSource = [];
        this.otherFieldList = [];
        this.basFieldList = [];
        this.model = Object.assign({}, record);
        if(this.model.id){
          this.model.categoryId = this.model.categoryIds;

          //加载耗材
          this.fetchChildList(this.model.id);
          //基础字段
          this.fetchFieldList(this.model.id,'0');
          //其他字段
          this.fetchFieldList(this.model.id,'1');
        }
        this.visible = true;
      },
      fetchFieldList(prodId,type){
        let url = "/srm/basMaterial/fetchFieldList";
        getAction(url,{prodId:prodId,type:type}).then(res => {
          if(type == '0'){
            this.basFieldList = res.result;
          }else{
            this.otherFieldList = res.result;
          }
        })
      },
      fetchChildList(prodId){
        let url = "/srm/basMaterial/fetchChildList";
        getAction(url,{prodId:prodId}).then(res => {
          this.dataSource = res.result;
        })
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
            let obj = JSON.parse(JSON.stringify(this.model));
            obj.categoryId = obj.categoryId.join(",");
            obj.childList = that.dataSource;
            obj.basFieldList = that.basFieldList;
            obj.otherFieldList = that.otherFieldList;
            httpAction(httpurl,obj,method).then((res)=>{
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