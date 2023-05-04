<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container>
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="发货单号" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input v-model="model.billNo" placeholder="发货单号自动生成"  disabled></a-input>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="项目名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input v-model="model.projectName" placeholder="项目名称"  disabled></a-input>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="合同名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"prop="contractId">
              <a-input v-model="model.contractName" placeholder="合同名称"  disabled></a-input>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="合同编码" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractNumber">
<!--              <a-input v-model="model.contractNumber" placeholder="合同编码"  disabled></a-input>-->
              <a-input v-model="model.contractNumber" placeholder="请输入合同编码" disabled style="width: 79%"></a-input>
              <a-button type="primary" @click="handleContract" style="padding-top: 1px">查看合同</a-button>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="供应商" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="suppName">
              <a-input v-model="model.suppName" placeholder="供应商"  disabled></a-input>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="发货人" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="sendUser">
              <a-input v-model="model.sendUser" placeholder="请输入发货人" style="width: 100%" :disabled="formDisabled"/>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="发货人联系方式" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="sendUserTel">
              <a-input v-model="model.sendUserTel" placeholder="请输入发货人联系方式" style="width: 100%" :disabled="formDisabled"/>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="收货人" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="receiveUser">
              <a-input v-model="model.receiveUser" placeholder="请输入收货人" style="width: 100%" :disabled="formDisabled"/>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="收货人联系方式" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="receiveUserTel">
              <a-input v-model="model.receiveUserTel" placeholder="请输入收货人联系方式" style="width: 100%" :disabled="formDisabled"/>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="承运单位" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" >
              <a-input v-model="model.fastUnit" placeholder="请输入承运单位" style="width: 100%" :disabled="formDisabled"/>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="承运联系人" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input v-model="model.fastUser" placeholder="请输入承运联系人" style="width: 100%" :disabled="formDisabled"/>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="承运人联系方式" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="receiveUserTel">
              <a-input v-model="model.fastUserTel" placeholder="请输入承运人联系方式" style="width: 100%" :disabled="formDisabled"/>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="收货部门" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input v-model="model.departName" placeholder="收货部门" style="width: 100%" :disabled="formDisabled"/>
            </a-form-model-item>
          </a-col>

          <a-col :span="8" v-if="roleCode.indexOf('project_center') > -1">
            <a-form-model-item label="发货设备总价" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input-number v-model="model.amountTax" placeholder="发货设备总价" style="width: 100%" disabled/>
            </a-form-model-item>
          </a-col>


<!--          <a-col :span="8">-->
<!--            <a-form-model-item label="发货时间" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="sendTime">-->
<!--              <a-date-picker v-model="model.sendTime" placeholder="发货时间" style="width: 100%;" :disabled="formDisabled"/>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
        </a-row>

        <a-divider orientation="left" style="color: #00A0E9">
          设备明细
        </a-divider>
        <a-button type='primary' @click='openDrawer' icon='plus' style='float: right;z-index: 999' :disabled="formDisabled">选择合同设备</a-button>
        <a-table
          ref="table"
          size="small"
          rowKey="id"
          bordered
          :scroll="{x:1500,y:500}"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false">
          <template slot='seqNo' slot-scope='text,record'>
            <a-input v-model='record.seqNo' :disabled="formDisabled"></a-input>
          </template>
          <template slot='socialNo' slot-scope='text,record'>
            <a-input v-model='record.socialNo' :disabled="formDisabled"></a-input>
          </template>
          <span slot="action" slot-scope="text, record,index">
              <a @click='handleDelete(index)' :disabled="formDisabled">删除</a>
					  </span>
        </a-table>
        <a-divider orientation="left" style="color: #00A0E9">
          备注
        </a-divider>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="备注" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="sendRemark">
              <a-input v-model="model.sendRemark" placeholder="备注" :disabled="formDisabled" type='textarea'/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-divider orientation="left" style="color: #00A0E9" v-if="action == 'approve'">
          审批原因
        </a-divider>
        <a-row v-if="action == 'approve'">
          <a-col :span="8">
            <a-form-model-item label="审批原因" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" >
              <a-input v-model="model.approveComment" placeholder="审批原因" type='textarea'/>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>

      <contract-base-modal ref="contractForm"/>

    </j-form-container>
  </a-spin>
</template>

<script>

import { getAction, httpAction,postAction } from '@/api/manage'
import { isNullOrEmpty } from '@/utils/util'
import { billListMixin } from '../../mixins/billListMixin'
import { billModalMixin } from '../../mixins/billModalMixin'
import ContractBaseModal from '@views/contract/modules/ContractBaseModal'

export default {
    name: 'SendGoodsForm',
    mixins: [billListMixin, billModalMixin],
    components: {
      ContractBaseModal
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      },
      action: {
        type: String,
        default: null,
        required: false
      },
      approverId: {
        type: String,
        default: null,
        required: false
      },
      roleCode:{
        type: String,
        default: null,
        required: false
      },
    },
    data () {
      return {
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
            title: '物料名称',
            align: "center",
            dataIndex: 'prodName',
            width: 120,
          },
          {
            title: '规格型号',
            align: "center",
            dataIndex: 'prodSpecType',
            ellipsis:true,
            width: 120,
          },
          {
            title: '合同数量',
            align: "center",
            dataIndex: 'contractQty',
            width: 120,
          },
          {
            title: '发货数量',
            align: "center",
            dataIndex: 'qty',
            width: 120,
          },
          {
            title: '设备序号',
            align: "center",
            dataIndex: 'sort',
            width: 120,
          },
          {
            title: '序列号',
            align: "center",
            dataIndex: 'seqNo',
            width: 120,
            scopedSlots: {customRender: 'seqNo'}
          },
          {
            title: '信用证编码',
            align: "center",
            dataIndex: 'socialNo',
            width: 120,
            scopedSlots: {customRender: 'socialNo'}
          },
          {
            title: '箱单编号',
            align: "center",
            dataIndex: 'packNo',
            width: 120,
          },
          {
            title: '发货日期',
            align: "center",
            dataIndex: 'sendTime',
            width: 120,
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            width: 100,
            scopedSlots: {customRender: 'action'}
          }
        ],
        dataSource:[],
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
          add: "/srm/stkIoBill/add",
          edit: "/srm/stkIoBill/edit",
          queryById: "/srm/purchaseApplyInvoice/queryById"
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
      handleContract(){
        let that = this;
        let contractId = that.model.contractId;
        //获取合同信息
        let url = "/srm/contractBase/queryById";
        getAction(url,{id:contractId}).then(res => {
          let contract = res.result;
          that.$refs.contractForm.detail(contract);
        })
      },
      back(rows){
        rows.filter(item => {
          let flag = false;
          this.dataSource.filter(child => {
            if(item.id == child.orderDetailId){
              flag = true;
              return;
            }
          })
          if(!flag){
            item.materialId = item.prodId;
            item.orderDetailId = item.id;
            this.dataSource.push(item);
          }
        })
        this.$message.success("添加成功");
        // setTimeout(() => {
        //   this.setAmount();
        // }, 500)
      },
      handleDelete(index){
        this.dataSource.splice(index,1);
      },
      openDrawer(){
        let contractId = this.model.contractId;
        if(isNullOrEmpty(contractId)){
          this.$message.error("请选择合同");
          return;
        }
        this.$refs.modal.loadData();
      },
      backUser(ids,rows){
        this.model.contractName = rows[0].contractName;
        this.model.contractNumber = rows[0].contractNumber;
        this.model.projectId = rows[0].projectId;
        this.dataSource = [];
        this.$forceUpdate();
      },
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        let that = this;
        this.model = Object.assign({}, record);
        //项目中心看价格
        if(this.roleCode.indexOf('project_center') > -1){
          let columns = [
            {
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
              title: '设备名称',
              align: "center",
              dataIndex: 'prodName',
              width: 120,
            },
            {
              title: '规格型号',
              align: "center",
              dataIndex: 'prodSpecType',
              ellipsis:true,
              width: 120,
            },
            {
              title: '合同数量',
              align: "center",
              dataIndex: 'contractQty',
              width: 120,
            },
            {
              title: '发货数量',
              align: "center",
              dataIndex: 'qty',
              width: 120,
            },
            {
              title: '设备单价',
              align: "center",
              dataIndex: 'priceTax',
              width: 120,
            },
            {
              title: '付款信息',
              align: "center",
              dataIndex: 'payRate',
              width: 120,
              customRender: function(t, r, index) {
                return t + "%";
              }
            },
            {
              title: '设备序号',
              align: "center",
              dataIndex: 'sort',
              width: 120,
            },
            {
              title: '序列号',
              align: "center",
              dataIndex: 'seqNo',
              width: 120,
              scopedSlots: {customRender: 'seqNo'}
            },
            {
              title: '信用证编码',
              align: "center",
              dataIndex: 'socialNo',
              width: 120,
              scopedSlots: {customRender: 'socialNo'}
            },
            {
              title: '箱单编号',
              align: "center",
              dataIndex: 'packNo',
              width: 120,
            },
            {
              title: '发货日期',
              align: "center",
              dataIndex: 'sendTime',
              width: 120,
            },
            {
              title: '操作',
              dataIndex: 'action',
              align: "center",
              width: 100,
              scopedSlots: {customRender: 'action'}
            }
          ];
          this.columns = columns;
        }
        //使用部门不看价格
        else{
          let columns = [
            {
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
              title: '设备名称',
              align: "center",
              dataIndex: 'prodName',
              width: 120,
            },
            {
              title: '规格型号',
              align: "center",
              dataIndex: 'prodSpecType',
              ellipsis:true,
              width: 120,
            },
            {
              title: '合同数量',
              align: "center",
              dataIndex: 'contractQty',
              width: 120,
            },
            {
              title: '发货数量',
              align: "center",
              dataIndex: 'qty',
              width: 120,
            },
            {
              title: '设备序号',
              align: "center",
              dataIndex: 'sort',
              width: 120,
            },
            {
              title: '序列号',
              align: "center",
              dataIndex: 'seqNo',
              width: 120,
              scopedSlots: {customRender: 'seqNo'}
            },
            {
              title: '信用证编码',
              align: "center",
              dataIndex: 'socialNo',
              width: 120,
              scopedSlots: {customRender: 'socialNo'}
            },
            {
              title: '箱单编号',
              align: "center",
              dataIndex: 'packNo',
              width: 120,
            },
            {
              title: '发货日期',
              align: "center",
              dataIndex: 'sendTime',
              width: 120,
            },
            {
              title: '操作',
              dataIndex: 'action',
              align: "center",
              width: 100,
              scopedSlots: {customRender: 'action'}
            }
          ];
          this.columns = columns;
        }

        this.visible = true;
        if(that.model.id){
          this.fetchDetailList(that.model.id);
          this.fetchDepartName(that.model.approverUser);
        }
      },
      fetchDepartName(username){
        let url = "/sys/user/fetchDeptByUsername";
        getAction(url,{username:username}).then(res => {
          this.model.departName = res.departName;
          this.$forceUpdate();
        })
      },
      fetchDetailList(id){
        this.model.amountTax = 0;
        let amountTax = 0;
        let url = "/srm/stkIoBill/queryStkIoBillEntryByMainId";
        getAction(url,{id:id}).then(res => {
          this.dataSource = res.result;
          if(this.dataSource != null && this.dataSource.length > 0){
            this.dataSource.filter(item => {
              this.model.amountTax = Number(this.model.amountTax) + item.amountTax;
              this.$forceUpdate();
            })
          }
        })
      },
      handlePass(){
        let that = this;
        that.$confirm({
          content: `是否确认提交?`,
          onOk: () => {
            let url = "/srm/stkIoBill/handleSendPass";
            let param = {id:that.model.id,approverId:that.approverId,approveComment:that.model.approveComment};
            postAction(url,param).then(res => {
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            })
          }
        })
      },
      handleReject(){
        let that = this;
        that.$confirm({
          content: `是否确认提交?`,
          onOk: () => {
            let url = "/srm/stkIoBill/handleSendReject";
            let param = {id:that.model.id,approverId:that.approverId,approveComment:that.model.approveComment};
            postAction(url,param).then(res => {
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            })
          }
        })
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        that.$refs.form.validate(valid => {
          if (valid) {
            let httpurl = '';
            let method = '';
            if(!that.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let dataSource = that.dataSource;
            if(dataSource == null || dataSource.length == 0){
              that.$message.error("请选择发货明细");
              return;
            }
            that.model.stkIoBillEntryList = dataSource;
            that.$confirm({
              content: `是否确认提交?`,
              onOk: () => {
                httpAction(httpurl,this.model,method).then((res)=>{
                  if(res.success){
                    that.$message.success(res.message);
                    that.$emit('ok');
                  }else{
                    that.$message.warning(res.message);
                  }
                })
              }
            })
          }
        })
      },
    }
  }
</script>