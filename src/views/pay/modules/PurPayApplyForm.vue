<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container >
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model"  slot="detail">
        <a-row>
          <a-divider orientation="left" style="color: #00A0E9">
            基本信息
          </a-divider>
          <a-col :span="8" >
            <a-form-model-item label="付款申请单号" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="applyCode">
              <a-input v-model="model.applyCode" placeholder="请输入付款申请单号" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="合同名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractName">
              <a-input v-model="model.contractName" placeholder="请输入合同名称" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="合同编码" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractNumber">
              <a-input v-model="model.contractNumber" placeholder="请输入合同编码" disabled style="width: 79%"></a-input>
              <a-button type="primary" @click="handleContract" style="padding-top: 1px">查看合同</a-button>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="项目名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="projectName">
              <a-input v-model="model.projectName" placeholder="请输入项目名称" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="付款金额原币" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="payAmountOther">
              <a-input-number v-model="model.payAmountOther" placeholder="请输入付款金额原币" style="width: 100%" disabled
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\$\s?|(,*)/g, '')"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="付款金额本币" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="payAmount">
              <a-input-number v-model="model.payAmount" placeholder="请输入付款金额" style="width: 100%" disabled
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\$\s?|(,*)/g, '')"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="付款比例(%)" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="payRate">
              <a-input-number v-model="model.payRate" placeholder="请输入付款比例" style="width: 100%" disabled/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="税率" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="taxRate">
<!--              <a-input-number v-model="model.taxRate" placeholder="请输入税率" style="width: 100%" disabled/>-->
              <j-dict-select-tag style="width:100%;" v-model="model.taxRate" placeholder="税率" dictCode="tax_rate" :disabled="true"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="付款方式" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="payMethod">
<!--              <a-input v-model="model.payMethod" placeholder="请输入付款方式" disabled></a-input>-->
              <j-dict-select-tag style="width:100%;" v-model="model.payMethod" placeholder="付款方式" dictCode="payMethod" :disabled="true"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="币种" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="currency">
<!--              <a-input v-model="model.currency" placeholder="请输入币种" disabled></a-input>-->
              <j-dict-select-tag style="width:100%;" v-model="model.currency" placeholder="请输入币种" dictCode="currency_type" :disabled="true"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="付款类型" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="payType">
<!--              <a-input v-model="model.payType" placeholder="请输入付款类型" disabled></a-input>-->
              <j-dict-select-tag style="width:100%;" v-model="model.payType" placeholder="付款类型" dictCode="payType" :disabled="true"/>
            </a-form-model-item>
          </a-col>
          <a-divider orientation="left" style="color: #00A0E9">
            付款信息
          </a-divider>
          <a-col :span="8" >
            <a-form-model-item label="供应商名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="suppName">
              <a-input v-model="model.suppName" placeholder="请输入供应商名称" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="收款账号" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="receivingNumber">
              <a-input v-model="model.receivingNumber" placeholder="请输入收款账号" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="收款开户行" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="receivingBank">
              <a-input v-model="model.receivingBank" placeholder="请输入收款开户行" disabled></a-input>
            </a-form-model-item>
          </a-col>

<!--          <a-col :span="8" >-->
<!--            <a-form-model-item label="应付款日期" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="dueDate">-->
<!--              <j-date placeholder="请选择应付款日期" v-model="model.dueDate" style="width: 100%" disabled/>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
          <a-col :span="8" >
            <a-form-model-item label="备注" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="comment">
              <a-textarea v-model="model.comment" placeholder="请输入备注"  disabled></a-textarea>
            </a-form-model-item>
          </a-col>

          <a-divider orientation="left" style="color: #00A0E9">
            付款申请明细
          </a-divider>

          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :scroll="{x:true,y:500}"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="false"
            >
            </a-table>

          <a-divider orientation="left" style="color: #00A0E9">
            供应商附件
          </a-divider>
          <a-col :span="24" >
            <a-button type="primary" style="float:right;z-index: 999;margin-top: -30px;" size="small"
                      @click="changeFileName(model.id,model.suppAttachment,'supp_attachment','suppAttachment')" v-if="model.suppAttachment != null && model.suppAttachment != ''">修改文件名</a-button>
            <a-form-model-item label="供应商附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
              <j-upload v-model="model.suppAttachment" :trigger-change="true" disabled ></j-upload>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="供应商发票" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
              <j-upload v-model="model.invoiceAttachment" :trigger-change="true" disabled ></j-upload>
            </a-form-model-item>
          </a-col>



          <a-divider orientation="left" style="color: #00A0E9">
            货代附件
          </a-divider>
          <a-col :span="24" >
            <a-button type="primary" style="float:right;z-index: 999;margin-top: -30px;" size="small"
                      @click="changeFileName(model.id,model.forwarderAttachment,'forwarder_attachment','forwarderAttachment')" v-if="model.forwarderAttachment != null && model.forwarderAttachment != ''">修改文件名</a-button>
            <a-form-model-item label="货代附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
              <j-upload v-model="model.forwarderAttachment" :trigger-change="true" :disabled="formDisabled"></j-upload>
            </a-form-model-item>
          </a-col>

          <a-divider orientation="left" style="color: #00A0E9">
            其他附件
          </a-divider>
          <a-col :span="24" >
            <a-button type="primary" style="float:right;z-index: 999;margin-top: -30px;" size="small"
                      @click="changeFileName(model.id,model.attachment,'attachment','attachment')" v-if="model.attachment != null && model.attachment != ''">修改文件名</a-button>
            <a-form-model-item label="其他附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
              <j-upload v-model="model.attachment" :trigger-change="true" :disabled="formDisabled" ></j-upload>
            </a-form-model-item>
          </a-col>

          <a-divider orientation="left" style="color: #00A0E9">
            资料核对
          </a-divider>
          <a-col :span="8" >
            <a-form-model-item label="合同" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" >
              <a-checkbox v-model="model.isContract">
              </a-checkbox>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="发货通知" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" >
              <a-checkbox v-model="model.isSend">
              </a-checkbox>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="到货签收单" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" >
              <a-checkbox v-model="model.isReceive">
              </a-checkbox>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="验收报告" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" >
              <a-checkbox v-model="model.isCheck">
              </a-checkbox>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="进度资料" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" >
              <a-checkbox v-model="model.isProgress">
              </a-checkbox>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="保函" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" >
              <a-checkbox v-model="model.isQa">
              </a-checkbox>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="结算资料" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" >
              <a-checkbox v-model="model.isSettle">
              </a-checkbox>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="质保到期单" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" >
              <a-checkbox v-model="model.isQaDue">
              </a-checkbox>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="发票/形式发票" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" >
              <a-checkbox v-model="model.isInvoice">
              </a-checkbox>
            </a-form-model-item>
          </a-col>

          <a-divider orientation="left" style="color: #00A0E9" v-if="action == 'edit'">
            审核
          </a-divider>
          <a-col :span="24" v-if="action == 'edit'">
            <a-form-model-item label="审核人" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
              {{model.approver}}
            </a-form-model-item>
          </a-col>
          <a-col :span="24" v-if="action == 'edit'">
            <a-form-model-item label="审批意见" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
              <a-textarea v-model="model.approveComment" placeholder="请输入备注" style="width: 45%"></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <change-file-name ref="cfn" @back="toSetUrl"></change-file-name>
    <contract-base-modal ref="contractForm"/>
  </a-spin>
</template>

<script>
import { deleteAction, getAction, putAction } from '@api/manage'
import JFormContainer from '@/components/jeecg/JFormContainer'
import { billModalMixin } from '../../mixins/billModalMixin'
import { isNullOrEmpty } from '@/utils/util'
import ChangeFileName from '@comp/jeecgbiz/ChangeFileName'
import ContractBaseModal from '@views/contract/modules/ContractBaseModal'
export default {
    name: 'PurPayApplyForm',
    mixins: [billModalMixin],
    components: {
      JFormContainer,
      ChangeFileName,
      ContractBaseModal
    },
    data() {
      return {
        param:{},
        confirmLoading:false,
        model:{
         },
        // 付款申请明细
        dataSource: [],
        columns: [
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
            title:'物料编码',
            align:"center",
            dataIndex: 'prodCode',
            width:120,
          },
          {
            title:'物料名称',
            align:"center",
            dataIndex: 'prodName',
            width:120,
          },
          {
            title:'规格、型号参数',
            align:"center",
            dataIndex: 'speType',
            width:140,
          },
          {
            title:'采购数量',
            align:"center",
            dataIndex: 'qty',
            width:100,
          },
          {
            title:'计量单位',
            align:"center",
            dataIndex: 'unitId_dictText',
            width:120,
          },
          {
            title:'发货合同设备序号',
            align:"center",
            dataIndex: 'no',
            width:120,
          },
          {
            title:'发货时间',
            align:"center",
            dataIndex: 'sendTime',
            width:120,
          },
          {
            title: '设备单价(原币)',
            dataIndex: 'priceTax',
            align:"center",
            width:120,
          },
          {
            title: '付款金额(原币)',
            dataIndex: 'contractAmountTax',
            align:"center",
            width:140,
          },
          {
            title: '付款比例(%)',
            dataIndex: 'payRate',
            align:"center",
            width:120,
          },
          // {
          //   title:'预估到货日期',
          //   align:"center",
          //   dataIndex: 'planLeadTime',
          //   width:120,
          // },
        ],
        url: {
          add: "/srm/purPayApply/add",
          edit: "/srm/purPayApply/edit",
          queryById: "/srm/purPayApply/queryById",
          purPayApplyDetail: {
            list: '/srm/purPayApply/queryPurPayApplyDetailByMainId'
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
        default: false,
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
      toSetUrl(url){
        this.model[this.param.filed] = url;
      },
      changeFileName(id,url,column,filed){
        //判断文件列表是否为空
        let that = this;
        if(isNullOrEmpty(url)){
          that.$message.error("当前没有可修改的文件");
          return;
        }
        let urls = url.split(',');
        let urlList = [];
        urls.filter(item => {
          let url = {
            oldUrl:item,
            newUrl:'',
          }
          urlList.push(url);
        })
        that.param.id = id;
        that.param.urlList = urlList;
        that.param.filed = filed;
        that.param.column = column;
        that.param.table = "pur_pay_apply";
        that.$refs.cfn.initData(that.param);
      },
      handlePass(){
        let that = this;
        let url = "/srm/purPayApply/toApprove";
        that.model.applyStatus = "30";
        console.log(that.model)
        that.$confirm({
          title: "",
          content: "是否确认提交?",
          onOk: function () {
            putAction(url,that.model).then(res => {
              if(res.success){
                that.$message.success('提交成功');
                that.$emit('ok');
              }else{
                that.$message.error('提交失败');
              }
            })
          }
        });
      },
      handleReject(){
        let that = this;
        let approveComment = that.model.approveComment;
        if(isNullOrEmpty(approveComment)){
          that.$message.error("请输入审核原因");
          return;
        }
        let url = "/srm/purPayApply/toApprove";
        that.model.applyStatus = "20";
        that.$confirm({
          title: "",
          content: "是否确认提交?",
          onOk: function () {
            putAction(url,that.model).then(res => {
              if(res.success){
                that.$message.success('提交成功');
                that.$emit('ok');
              }else{
                that.$message.error('提交失败');
              }
            })
          }
        });
      },
      edit(record) {
        this.dataSource = [];
        this.model = Object.assign({}, record);
        if(isNullOrEmpty(this.model.approver)){
          this.model.approver = this.$store.getters.userInfo.realname;
          this.model.approveComment = "";
        }
        this.fetchApplyDetailList(this.model.id);
      },
      fetchApplyDetailList(id){
        let url = "/srm/purPayApply/queryPurPayApplyDetailByMainId";
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