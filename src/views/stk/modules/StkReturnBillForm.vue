<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container >
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="8" >
            <a-form-model-item label="单据编号" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="billNo">
              <a-input v-model="model.billNo" placeholder="自动生成" disabled></a-input>
            </a-form-model-item>
          </a-col>

          <a-col :span="8" >
            <a-form-model-item label="合同名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractId">
              <j-select-contract ref='contract' v-model="model.contractId" :multi="false" @change="backUser" :disabled="formDisabled" :param="{contractType:'0'}"></j-select-contract>
            </a-form-model-item>
          </a-col>

          <a-col :span="8" >
            <a-form-model-item label="供应商" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="suppName">
              <a-input v-model="model.suppName" placeholder="请输入供应商" disabled></a-input>
            </a-form-model-item>
          </a-col>

          <a-col :span="8" >
            <a-form-model-item label="项目名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="projectName">
              <a-input v-model="model.projectName" placeholder="请输入项目名称" disabled></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12" >
            <a-form-model-item label="附件" :labelCol="spans.labelCol2" :wrapperCol="spans.wrapperCol2" prop="attachment">
              <j-upload v-model="model.attachment" :trigger-change="true" :disabled="formDisabled"></j-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12" >
            <a-form-model-item label="备注" :labelCol="spans.labelCol2" :wrapperCol="spans.wrapperCol2" prop="remark">
              <a-input v-model="model.remark" placeholder="请输入备注" type="textarea" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-divider orientation="left" style="color: #00A0E9">
          退货明细
        </a-divider>
        <a-button type='primary' @click='openDrawer' icon='plus' style='float: right;z-index: 999' :disabled="formDisabled">选择合同明细</a-button>
        <a-table
          style="clear:both"
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :scroll="{x:true,y:500}"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false">
          <template slot="toInQty" slot-scope="text,record">
            <a-input-number v-model="record.toInQty" style="width: 100%" :disabled="formDisabled"></a-input-number>
          </template>
          <template slot="action" slot-scope="text,record,index">
            <a @click="delRow(index)" :disabled="formDisabled">删除</a>
          </template>
        </a-table>
        <a-divider orientation="left" style="color: #00A0E9" v-if="action =='approve' || (action =='view' && approveList != null && approveList.length > 0)">
          审核信息
        </a-divider>
        <span v-if="action =='approve' || action =='view'" v-for="(item,index) in approveList">
          <a-row>
            <a-col :span="12" >
              <a-form-model-item label="审核人" :labelCol="spans.labelCol2" :wrapperCol="spans.wrapperCol2">
                {{item.approver}}
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12" >
              <a-form-model-item label="审核意见" :labelCol="spans.labelCol2" :wrapperCol="spans.wrapperCol2">
                <a-textarea v-model="item.approveComment" placeholder="请输入备注" style="width: 45%" disabled></a-textarea>
              </a-form-model-item>
            </a-col>
          </a-row>
        </span>

        <a-row v-if="action =='approve'">
          <a-col :span="12" >
            <a-form-model-item label="审核人" :labelCol="spans.labelCol2" :wrapperCol="spans.wrapperCol2">
              {{model.approver}}
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-if="action =='approve'">
          <a-col :span="12" >
            <a-form-model-item label="审核意见" :labelCol="spans.labelCol2" :wrapperCol="spans.wrapperCol2">
              <a-textarea v-model="model.approveComment" placeholder="请输入备注" style="width: 45%" :disabled="action != 'approve'"></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <contract-object-modal ref='modal' :contractId='model.contractId' @ok='back' ptype="return"></contract-object-modal>
    </j-form-container>
  </a-spin>
</template>

<script>

import { getAction, httpAction, putAction } from '@/api/manage'
import JSelectContract from '@comp/jeecgbiz/JSelectContract'
import JFormContainer from '@/components/jeecg/JFormContainer'
import { isNullOrEmpty } from '@/utils/util'
import { billModalMixin } from '../../mixins/billModalMixin'
import ContractObjectModal from '@views/stk/modules/ContractObjectModal'

export default {
    name: 'StkIoBillForm',
    mixins: [billModalMixin],

    components: {
      JFormContainer,
      JSelectContract,
      ContractObjectModal
    },
    data() {
      return {
        approveList:[],
        confirmLoading:false,
        columns:[
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title: '物料编号',
            align: "center",
            dataIndex: 'prodCode',
            width: 120,
          },
          {
            title: '物料名称',
            align: "center",
            dataIndex: 'prodName',
            width: 180,
          },
          {
            title: '规格型号',
            align: "center",
            dataIndex: 'prodSpecType',
            width: 120,
          },
          {
            title: '单位',
            dataIndex: 'unitId_dictText',
            width:120,
          },
          {
            title: '待退货数量',
            dataIndex: 'qty',
            width:120,
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:100,
            scopedSlots: { customRender: 'action' },
          }
        ],
        dataSource:[],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        model:{
         },

        validatorRules: {
          billId:[
            { required: true, message: '请选择入库单!'},
          ],
           whId: [
              { required: true, message: '请选择仓库!'},
           ],
           stockIoType: [
              { required: true, message: '请输入入库类型!'},
           ],

           billDate: [
              { required: true, message: '请输入单据日期!'},
           ],
        },
        url: {
          add: "/srm/stkReturnBill/add",
          edit: "/srm/stkReturnBill/edit",
          queryById: "/srm/stkIoBill/queryById",
          stkIoBillEntry: {
            list: '/srm/stkIoBill/queryStkIoBillEntryByMainId'
          },
        }
      }
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
        default: '',
        required: false
      },
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
    },
    methods: {

      handleReject(){
        let that = this;
        that.model.status = '2';
        let url = "/srm/stkReturnBill/toApprove";
        that.$confirm({
          content: `是否确认提交`,
          onOk: () => {
            putAction(url,that.model).then(res => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            })
          }
        })
      },
      handlePass(){
        let that = this;
        let url = "/srm/stkReturnBill/toApprove";
        that.model.status = '1';
        that.$confirm({
          content: `是否确认提交`,
          onOk: () => {
            putAction(url,that.model).then(res => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            })
          }
        })
      },
      handleOk() {
        const that = this;
        // 触发表单验证
        that.$refs.form.validate(valid => {
          if (valid) {
            let httpurl = '';
            let method = '';
            if (!that.model.id) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'put';
            }
            let datasource = that.dataSource;
            if(datasource == null || datasource.length == 0){
              that.$message.error("请选择需要入库的设备");
              return;
            }
            for(let i = 0; i < datasource.length; i++){
              if(isNullOrEmpty(datasource[i].qty)){
                that.$message.error("第" + (i+1) + "行,请输入入库数量");
                return;
              }
            }
            that.model.detailList = datasource;
            that.$confirm({
              content: `是否确认提交`,
              onOk: () => {
                that.confirmLoading = true;
                httpAction(httpurl, that.model, method).then((res) => {
                  if (res.success) {
                    that.$message.success(res.message);
                    that.$emit('ok');
                  } else {
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
      delRow(index){
        this.dataSource.splice(index,1);
      },
      back(rows){
        rows.filter(item => {
          let flag = false;
          this.dataSource.filter(child => {
            if(item.id == child.id){
              flag = true;
              return;
            }
          })
          if(!flag){
            item.billDetailId = item.id;
            this.dataSource.push(item);
            this.$message.success("添加成功");
          }
        })
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
        this.model.suppName = rows[0].contractSecondParty;
        this.model.suppId = rows[0].contractSecondPartyId;
        this.getProjectById(rows[0].projectId);
        this.$forceUpdate();
      },
      getProjectById(id){
        let url = "/srm/projBase/queryById";
        let param = {
          id:id
        }
        getAction(url,param).then(res => {
          this.model.projectId = res.result.id;
          this.model.projectName = res.result.projName;
          this.$forceUpdate();
        })
      },
      add() {
        this.edit(this.modelDefault);
      },

      edit(record) {
        this.dataSource = [];
        this.model = Object.assign({}, record);
        this.model.approver = "";
        this.model.approveComment = "";

        if(isNullOrEmpty(this.model.approver)){
          this.model.approver = this.$store.getters.userInfo.realname;
        }

        if(this.model.id){
          this.fetchDetailList(this.model.id);
          this.fetchApprove(this.model.id);
        }
      },
      fetchApprove(id){
        let url = "/srm/stkReturnBill/queryApprove";
        let param = {
          id:id
        }
        getAction(url,param).then(res => {
          this.approveList = res.result;
        })
      },
      fetchDetailList(id){
        let url = "/srm/stkReturnBill/queryDetailListByMainId";
        let param = {
          id:id
        }
        getAction(url,param).then(res => {
          this.dataSource = res.result;
        })
      }
    }
  }
</script>

<style scoped>
</style>