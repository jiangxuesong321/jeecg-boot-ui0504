<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container >
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-divider orientation="left" style="color: #00A0E9">
          基础信息
        </a-divider>
        <a-row>
          <a-col :span="8" >
            <a-form-model-item label="单据编号" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="billNo">
              <a-input v-model="model.billNo" placeholder="自动生成" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="入库类型" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="stockIoType">
              <j-dict-select-tag  v-model="model.stockIoType"  placeholder="请选择入库类型" dictCode="stk_io_type" disabled v-if="action == 'add'"/>
              <j-dict-select-tag  v-model="model.stockIoType"  placeholder="请选择入库类型" dictCode="stk_io_type" :disabled="formDisabled" v-else/>
            </a-form-model-item>
          </a-col>

          <a-col :span="8" >
            <a-form-model-item label="仓库" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="whId" v-if="action == 'add' || model.approverId == 'prod_line'">
              <j-dict-select-tag v-model="model.whId" placeholder="请输入仓库" dictCode="bas_warehouse,name,id,del_flag = '0' and is_enabled = '1'" />
            </a-form-model-item>
            <a-form-model-item label="仓库" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" v-else>
              <j-dict-select-tag v-model="model.whId" placeholder="请输入仓库" dictCode="bas_warehouse,name,id,del_flag = '0' and is_enabled = '1'" disabled/>
            </a-form-model-item>
          </a-col>

          <a-col :span="8" >
            <a-form-model-item label="合同名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractId">
              <j-select-contract ref='contract' v-model="model.contractId" :multi="false" @change="backUser" :disabled="formDisabled" :param="{contractType:'0',isDemo:'1'}"></j-select-contract>
            </a-form-model-item>
          </a-col>

          <a-col :span="8" >
            <a-form-model-item label="供应商" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="suppName">
              <a-input v-model="model.suppName" disabled></a-input>
            </a-form-model-item>
          </a-col>

          <a-col :span="8" >
            <a-form-model-item label="发货时间" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="sendTime">
              <j-date placeholder="请选择发货时间" v-model="model.sendTime" style="width: 100%" v-if="action == 'add'"/>
              <j-date placeholder="请选择发货时间" v-model="model.sendTime" style="width: 100%" v-else disabled/>
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


          <a-col :span="8" >
            <a-form-model-item label="币种" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractCurrency">
              <j-dict-select-tag style="width:100%;" v-model="model.contractCurrency" placeholder="币种"
                                 dictCode="currency_type" :disabled="true"/>
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

          <a-col :span="8" >
            <a-form-model-item label="物流费" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="logisticsCost">
              <a-input-number v-model="model.logisticsCost" placeholder="请输入物流费" @change="setAmount"
                              style="width: 100%" v-if="(action == 'cost' || action == 'edit' || model.approverId == 'project_center') && action != 'view' && action != 'check'"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\$\s?|(,*)/g, '')"/>
              <a-input-number v-model="model.logisticsCost" placeholder="请输入物流费" @change="setAmount"
                              style="width: 100%" v-else disabled
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\$\s?|(,*)/g, '')"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="进口关税" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="importTariff">
              <a-input-number v-model="model.importTariff" placeholder="请输入进口关税" @change="setAmount"
                              style="width: 100%" v-if="(action == 'cost' || action == 'edit' || model.approverId == 'project_center') && action != 'view'  && action != 'check'"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\$\s?|(,*)/g, '')"/>
              <a-input-number v-model="model.importTariff" placeholder="请输入进口关税" @change="setAmount"
                              style="width: 100%" v-else disabled
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\$\s?|(,*)/g, '')"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="增值税" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="valueAddedTax">
              <a-input-number v-model="model.valueAddedTax" placeholder="请输入增值税" @change="setAmount"
                              style="width: 100%" v-if="(action == 'cost' || action == 'edit' || model.approverId == 'project_center') && action != 'view'  && action != 'check'"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\$\s?|(,*)/g, '')"/>
              <a-input-number v-model="model.valueAddedTax" placeholder="请输入增值税" @change="setAmount"
                              style="width: 100%" v-else disabled
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\$\s?|(,*)/g, '')"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="通关杂费" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="customsClearanceFees">
              <a-input-number v-model="model.customsClearanceFees" placeholder="请输入通关杂费" @change="setAmount"
                              style="width: 100%" v-if="(action == 'cost' || action == 'edit' || model.approverId == 'project_center') && action != 'view'  && action != 'check'"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\$\s?|(,*)/g, '')"/>
              <a-input-number v-model="model.customsClearanceFees" placeholder="请输入通关杂费" @change="setAmount"
                              style="width: 100%" v-else disabled
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\$\s?|(,*)/g, '')"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="汇率" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="exchangeRate">
              <a-input-number v-model="model.exchangeRate" placeholder="请输入汇率" @change="setExchangeRate"
                              style="width: 100%" v-if="(action == 'cost' || action == 'edit' || model.approverId == 'project_center') && action != 'view'  && action != 'check'"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\$\s?|(,*)/g, '')"/>
              <a-input-number v-model="model.exchangeRate" placeholder="请输入汇率" @change="setExchangeRate"
                              style="width: 100%" v-else disabled
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\$\s?|(,*)/g, '')"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="其他费用" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="otherFee">
              <a-input-number v-model="model.otherFee" placeholder="请输入其他费用" @change="setAmount"
                              style="width: 100%" v-if="(action == 'cost' || action == 'edit' || model.approverId == 'project_center') && action != 'view'  && action != 'check'"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\$\s?|(,*)/g, '')"/>
              <a-input-number v-model="model.otherFee" placeholder="请输入其他费用" @change="setAmount"
                              style="width: 100%" v-else disabled
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\$\s?|(,*)/g, '')"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="设备结算金额" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input-number v-model="model.totalAmount" placeholder="请输入设备结算金额" style="width: 100%" disabled
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\$\s?|(,*)/g, '')"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="实际到货时间" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="actualArrivalDate">
              <j-date placeholder="请选择实际到货时间" v-model="model.actualArrivalDate" style="width: 100%" v-if="action == 'add' || model.approverId == 'prod_line'"/>
              <j-date placeholder="请选择实际到货时间" v-model="model.actualArrivalDate" style="width: 100%" v-else disabled/>
            </a-form-model-item>
          </a-col>
        </a-row>



        <a-divider orientation="left" style="color: #00A0E9">
          入库明细
        </a-divider>
        <a-button type='primary' @click='openDrawer' icon='plus' style='float: right;z-index: 999' :disabled="formDisabled">选择合同设备</a-button>
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
<!--          <template slot="qty" slot-scope="text,record">-->
<!--            <a-input-number v-model="record.qty" style="width: 100%" :disabled="formDisabled"></a-input-number>-->
<!--          </template>-->
          <template slot="entryNo" slot-scope="text,record">
            <a-input v-model="record.entryNo" style="width:80%" :disabled="(model.approverId != 'prod_line' && action != 'add') || action == 'cost' "></a-input>
          </template>
          <template slot="action" slot-scope="text,record,index">
            <a @click="delRow(index)" :disabled="formDisabled">删除</a>
          </template>
        </a-table>

        <a-divider orientation="left" style="color: #00A0E9" >
          设备签收单
        </a-divider>
        <a-row>
          <a-col :span="24" >
            <a-button type="primary" style="float: right;z-index: 999;margin-top: -30px;" size="small"
                      @click="changeFileName(model.id,model.attachment,'attachment','attachment')" v-if="model.attachment != null && model.attachment != ''">修改文件名</a-button>
            <a-form-model-item label="设备签收单" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1" prop="attachment">
              <j-upload v-model="model.attachment" :trigger-change="true" :disabled="action != 'add'"></j-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
<!--        <a-divider orientation="left" style="color: #00A0E9">-->
<!--          其他附件-->
<!--        </a-divider>-->
<!--        <a-row>-->
<!--          <a-col :span="24" >-->
<!--            <a-button type="primary" style="float: right;z-index: 999;margin-top: -30px;" size="small"-->
<!--                      @click="changeFileName(model.id,model.otherAttachment,'other_attachment','otherAttachment')" v-if="model.otherAttachment != null && model.otherAttachment != ''">修改文件名</a-button>-->
<!--            <a-form-model-item label="其他附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1" prop="otherAttachment">-->
<!--              <j-upload v-model="model.otherAttachment" :trigger-change="true" v-if="(action == 'add' || model.approverId == 'project_center') && action != 'view'"></j-upload>-->
<!--              <j-upload v-model="model.otherAttachment" :trigger-change="true" v-else :disabled="true"></j-upload>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--        </a-row>-->
<!--        <a-divider orientation="left" style="color: #00A0E9">-->
<!--          备注-->
<!--        </a-divider>-->
<!--        <a-row>-->
<!--          <a-col :span="24" >-->
<!--            <a-form-model-item label="备注" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1" prop="remark">-->
<!--              <a-input v-model="model.remark" placeholder="请输入备注" type="textarea" :disabled="formDisabled" style="width: 50%"></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--        </a-row>-->
      </a-form-model>
      <contract-object-modal ref='modal' :contractId='model.contractId' @ok='back' ptype="entry"></contract-object-modal>
      <change-file-name ref="cfn" @back="toSetUrl"></change-file-name>
    </j-form-container>
  </a-spin>
</template>

<script>
import ChangeFileName from '@comp/jeecgbiz/ChangeFileName'
import { getAction, httpAction,putAction } from '@/api/manage'
  import JSelectContract from '@comp/jeecgbiz/JSelectContract'
  import JFormContainer from '@/components/jeecg/JFormContainer'
import { iegAmount, isNotNullOrEmpty, isNullOrEmpty, preciseNum } from '@/utils/util'
  import ContractObjectModal from '@views/stk/modules/ContractObjectModal'
import { billModalMixin } from '../../mixins/billModalMixin'

  export default {
    name: 'StkIoBillForm',
    mixins: [billModalMixin],

    components: {
      JFormContainer,
      JSelectContract,
      ContractObjectModal,
      ChangeFileName
    },
    data() {
      return {
        param:{},
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
            title: '设备编号',
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
            align:"center",
            dataIndex: 'unitId_dictText',
            width:120,
          },
          {
            title: '数量',
            dataIndex: 'qty',
            align:"center",
            width:120,
            scopedSlots: { customRender: 'qty' },
          },
          {
            title: '发货序号',
            dataIndex: 'sort',
            align:"center",
            width:100,
          },
          {
            title: '序列号',
            dataIndex: 'seqNo',
            align:"center",
            width:140,
          },
          {
            title: '信用证编码',
            dataIndex: 'socialNo',
            align:"center",
            width:140,
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
          // {
          //   title: '厂内编号',
          //   dataIndex: 'entryNo',
          //   align:"center",
          //   width:120,
          //   scopedSlots: { customRender: 'entryNo' },
          // },
          // {
          //   title: '到厂金额',
          //   dataIndex: 'contractAmountTaxLocal',
          //   align:"center",
          //   width:120,
          //   customRender:function (t,r,index) {
          //     let icon = "";
          //     const obj = {
          //       children: icon + iegAmount(Math.trunc(t),'total'),
          //       attrs: {},
          //     };
          //     obj.attrs.align = 'right';//控制表体内容居右
          //     return obj;
          //   }
          // },
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
          attachment:[
            { required: true, message: '请上传签收单!'},
          ],
          exchangeRate:[
            { required: true, message: '请输入汇率!'},
          ],
          contractId:[
            { required: true, message: '请选择合同!'},
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
          add: "/srm/stkIoBill/add",
          edit: "/srm/stkIoBill/edit",
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
        that.param.table = "stk_io_bill";
        that.$refs.cfn.initData(that.param);
      },

      setAmount(){
        let totalAmount = Number(this.model.tmpTotalAmount);
        let logisticsCost = this.model.logisticsCost;
        if(isNotNullOrEmpty(logisticsCost)){
          totalAmount = totalAmount + Number(logisticsCost);
        }
        let selfInsurancePremium = this.model.selfInsurancePremium;
        if(isNotNullOrEmpty(selfInsurancePremium)){
          totalAmount = totalAmount + Number(selfInsurancePremium);
        }
        let importTariff = this.model.importTariff;
        if(isNotNullOrEmpty(importTariff)){
          totalAmount = totalAmount + Number(importTariff);
        }
        let inlandCargoInsurance = this.model.inlandCargoInsurance;
        if(isNotNullOrEmpty(inlandCargoInsurance)){
          totalAmount = totalAmount + Number(inlandCargoInsurance);
        }
        let valueAddedTax = this.model.valueAddedTax;
        if(isNotNullOrEmpty(valueAddedTax)){
          totalAmount = totalAmount + Number(valueAddedTax);
        }
        let customsClearanceFees = this.model.customsClearanceFees;
        if(isNotNullOrEmpty(customsClearanceFees)){
          totalAmount = totalAmount + Number(customsClearanceFees);
        }
        let selfDeliveryFreight = this.model.selfDeliveryFreight;
        if(isNotNullOrEmpty(selfDeliveryFreight)){
          totalAmount = totalAmount + Number(selfDeliveryFreight);
        }
        let otherFee = this.model.otherFee;
        if(isNotNullOrEmpty(otherFee)){
          totalAmount = totalAmount + Number(otherFee);
        }
        totalAmount = preciseNum(totalAmount,2);
        this.model.totalAmount = Number(totalAmount);
        this.$forceUpdate();
      },
      handleReject(){
        let that = this;
        // that.model.status = '2';
        let url = "/srm/stkIoBill/toReject";
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
      handleCheck(){
        let that = this;
        let url = "/srm/stkIoBill/toApproveCheck";
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
        let url = "/srm/stkIoBill/toApprove";
        that.model.recordList = that.dataSource;
        // if(this.action != 'cost'){
        //   for(let i = 0; i < that.dataSource.length; i++){
        //     if(isNullOrEmpty(that.dataSource[i].entryNo)){
        //       that.$message.error("第" + (i+1) + "行,请输入厂内编号");
        //       return;
        //     }
        //   }
        // }
        // let attachment = that.model.attachment;
        // if(isNullOrEmpty(attachment)){
        //   that.$message.error("请上传设备到厂签收单");
        //   return;
        // }

        let whId = that.model.whId;
        if(isNullOrEmpty(whId)){
          that.$message.error("请选择仓库");
          return;
        }
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
            if(this.action != 'cost'){
              for(let i = 0; i < datasource.length; i++){
                if(isNullOrEmpty(datasource[i].qty)){
                  that.$message.error("第" + (i+1) + "行,请输入入库数量");
                  return;
                }
                if(isNullOrEmpty(that.dataSource[i].entryNo)){
                  that.$message.error("第" + (i+1) + "行,请输入厂内编号");
                  return;
                }
              }
            }

            that.model.stkIoBillEntryList = datasource;
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
          }else{
            that.$message.error('请检查项目信息必填项!')
          }
        })
      },
      delRow(index){
        this.dataSource.splice(index,1);
        this.setDataAmount();
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
            item.orderDetailId = item.id;
            this.dataSource.push(item);
            this.$message.success("添加成功");
          }
        })
        setTimeout(() => {
          this.setDataAmount();
        }, 500)
      },
      setDataAmount(){
        //汇率
        let exchangeRate = this.model.exchangeRate;
        if(isNullOrEmpty(exchangeRate)){
          return;
        }
        //本币未税金额
        let taxRate = this.model.taxRate;
        if(taxRate == 100){
          taxRate = 0;
        }
        taxRate = Number(taxRate) / 100 + 1;

        let contractAmount = 0;
        let contractAmountTax = 0;
        let contractAmountLocal = 0;
        let contractAmountTaxLocal = 0;

        this.dataSource.filter(item => {
          let amountTaxLocal = Number(item.contractAmountTax) / Number(exchangeRate);
          amountTaxLocal = Number(preciseNum(amountTaxLocal,2));
          item.contractAmountTaxLocal = amountTaxLocal;
          item.contractPriceTaxLocal = amountTaxLocal;

          let amountLocal = preciseNum(amountTaxLocal / taxRate,2);
          amountLocal = Number(amountLocal);
          item.contractAmountLocal = amountLocal;
          item.contractPriceLocal = amountLocal;

          contractAmount = Number(contractAmount) + Number(item.contractAmount);
          contractAmountTax = Number(contractAmountTax) + Number(item.contractAmountTax);
          contractAmountLocal = Number(contractAmountLocal) + Number(item.contractAmountLocal);
          contractAmountTaxLocal = Number(contractAmountTaxLocal) + Number(item.contractAmountTaxLocal);
        })

        contractAmount = Number(preciseNum(contractAmount,2));
        this.model.contractAmount = contractAmount;
        contractAmountTax = Number(preciseNum(contractAmountTax,2));
        this.model.contractAmountTax = contractAmountTax;
        contractAmountLocal = Number(preciseNum(contractAmountLocal,2));
        this.model.contractAmountLocal = contractAmountLocal;
        contractAmountTaxLocal = Number(preciseNum(contractAmountTaxLocal,2));
        this.model.contractAmountTaxLocal = contractAmountTaxLocal;

        this.model.tmpTotalAmount = contractAmountTaxLocal;
        this.setAmount();
      },
      setExchangeRate(){
        //汇率
        let exchangeRate = this.model.exchangeRate;
        if(isNullOrEmpty(exchangeRate)){
          return;
        }
        //原币含税金额
        let contractAmountTax = this.model.contractAmountTax;
        //本币含税金额
        let contractAmountTaxLocal = Number(contractAmountTax) / Number(exchangeRate);
        contractAmountTaxLocal = Number(preciseNum(contractAmountTaxLocal,2));
        this.model.contractAmountTaxLocal = contractAmountTaxLocal;
        this.model.tmpTotalAmount = contractAmountTaxLocal;
        this.model.totalAmount = contractAmountTaxLocal;
        //本币未税金额
        let taxRate = this.model.taxRate;
        if(taxRate == 100){
          taxRate = 0;
        }
        taxRate = Number(taxRate) / 100 + 1;
        let contractAmountLocal = preciseNum(contractAmountTaxLocal / taxRate,2);
        contractAmountLocal = Number(contractAmountLocal);
        this.model.contractAmountLocal = contractAmountLocal;

        this.dataSource.filter(item => {
          let amountTaxLocal = Number(item.contractAmountTax) / Number(exchangeRate);
          amountTaxLocal = Number(preciseNum(amountTaxLocal,2));
          item.contractAmountTaxLocal = amountTaxLocal;
          item.contractPriceTaxLocal = amountTaxLocal;

          let amountLocal = preciseNum(amountTaxLocal / taxRate,2);
          amountLocal = Number(amountLocal);
          item.contractAmountLocal = amountLocal;
          item.contractPriceLocal = amountLocal;

        })

        this.setAmount();
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
        this.model.contractCurrency = rows[0].contractCurrency;
        this.model.suppName = rows[0].contractSecondParty;
        this.model.suppId = rows[0].contractSecondPartyId;
        this.model.exchangeRate = rows[0].contractExchangeRate;
        this.getProjectById(rows[0].projectId);
        this.fetchExchangeRate(this.model.contractCurrency);
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
        this.model.tmpTotalAmount = this.model.contractAmountTaxLocal;
        // this.model.approver = "";
        // this.model.approveComment = "";

        // if(isNullOrEmpty(this.model.approver)){
        //   this.model.approver = this.$store.getters.userInfo.realname;
        // }

        if(this.model.id){
          this.fetchDetailList(this.model.id);
          this.fetchContractCurrency(this.model.contractId);
          // if(this.action != 'approve'){
          //   this.fetchApprove(this.model.id);
          // }
        }else{
          this.model.stockIoType = '1';
        }
        //获取最新汇率
        if(isNullOrEmpty(this.model.exchangeRate) || this.model.exchangeRate == 0){
          setTimeout(() => {
            this.fetchExchangeRate(this.model.contractCurrency);
          }, 500)
        }
      },
      fetchExchangeRate(currency){
        let url = "/srm/basRateMain/queryExchangeRateByCurrency";
        let param = {
          currencyB:currency
        }
        getAction(url,param).then(res => {
          this.model.exchangeRate = res.result.valueB;
          this.$forceUpdate();
        })
      },
      fetchContractCurrency(id){
        let url = "/srm/contractBase/queryById";
        let param = {
          id:id
        }
        getAction(url,param).then(res => {
          this.model.contractCurrency = res.result.contractCurrency;
          this.$forceUpdate();
        })
      },
      fetchApprove(id){
        let url = "/srm/stkIoBill/queryApprove";
        let param = {
          id:id
        }
        getAction(url,param).then(res => {
          this.model.approver = res.result.approver;
          this.model.approveComment = res.result.approveComment;
        })
      },
      fetchDetailList(id){
        let url = "/srm/stkIoBill/queryStkIoBillEntryByMainId";
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