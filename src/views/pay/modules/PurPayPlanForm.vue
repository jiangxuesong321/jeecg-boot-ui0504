<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container>
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>

<!--          <a-divider orientation="left" style="color: #00A0E9" v-if="model.payStatus == '2'">-->
<!--            OA回传附件-->
<!--          </a-divider>-->
<!--          <a-col :span="24" v-if="model.payStatus == '2'">-->
<!--            <a-button type="primary" style="float:right;z-index: 999;margin-top: -30px;" size="small"-->
<!--                      @click="changeFileName(model.id,model.oaAttachment,'oa_attachment','oaAttachment')" v-if="model.oaAttachment != null && model.oaAttachment != ''">修改文件名</a-button>-->
<!--            <a-form-item label="付款附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1" required>-->
<!--              <j-upload v-model="model.oaAttachment" :trigger-change="true" :disabled="formDisabled"></j-upload>-->
<!--            </a-form-item>-->
<!--          </a-col>-->
          <a-divider orientation="left" style="color: #00A0E9">
            基本信息
          </a-divider>
          <a-col :span="8" >
            <a-form-model-item label="付款月份" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="planMonth">
<!--              <a-input v-model="model.planMonth" placeholder="请输入付款月份" ></a-input>-->
              <a-month-picker v-model="model.planMonth" placeholder="请输入付款月份" style="width: 100%" @change="onChange" :disabled="disabled"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="应付（本币）" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="payAmountCope">
              <a-input-number v-model="model.payAmountCope" placeholder="请输入应付款金额本币" style="width: 100%" disabled
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\$\s?|(,*)/g, '')"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="应付（美元）" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="payAmountUsd">
              <a-input-number v-model="model.payAmountUsd" placeholder="请输入应付款金额美元" style="width: 100%" disabled
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\$\s?|(,*)/g, '')"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="应付（日元）" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="payAmountJpy">
              <a-input-number v-model="model.payAmountJpy" placeholder="请输入应付款金额日元" style="width: 100%" disabled
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\$\s?|(,*)/g, '')"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="应付（欧元）" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="payAmountEur">
              <a-input-number v-model="model.payAmountEur" placeholder="请输入应付款金额欧元" style="width: 100%" disabled
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\$\s?|(,*)/g, '')"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="付款备注" :labelCol="spans.labelCol2" :wrapperCol="spans.wrapperCol2" prop="comment">
              <a-input v-model="model.comment" placeholder="请输入付款备注" type="textarea" :disabled="disabled" style="width:60%"></a-input>
            </a-form-model-item>
          </a-col>
          <a-divider orientation="left" style="color: #00A0E9">
            应付款明细
          </a-divider>
          <a-button type="primary" style="float: right;z-index: 99999" @click="openDrawer" v-if="!formDisabled">添加应付款</a-button>
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :scroll="{x:true,y:500}"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="false">
            <template slot="action" slot-scope="text,record,index">
              <a @click="delRow(index)" v-if="!formDisabled">删除</a>
            </template>
            <template slot="applyCode" slot-scope="text,record,index">
              <a @click="handleDetail(record)">{{text}}</a>
            </template>
          </a-table>

<!--          <a-divider orientation="left" style="color: #00A0E9">-->
<!--            发票-->
<!--          </a-divider>-->
<!--          <a-col :span="24" >-->
<!--            <a-form-model-item label="" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1" >-->
<!--              <j-upload v-model="model.invoiceAttachment" :trigger-change="true"></j-upload>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
          <a-divider orientation="left" style="color: #00A0E9">
            付款附件
          </a-divider>
          <a-col :span="24" >
            <a-button type="primary" style="float:right;z-index: 999;margin-top: -28px;" size="small"
                      @click="changeFileName(model.id,model.attachment,'attachment','attachment')" v-if="model.attachment != null && model.attachment != ''">修改文件名</a-button>
            <a-form-model-item label="附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1" >
              <j-upload v-model="model.attachment" :trigger-change="true" :disabled="disabled"></j-upload>
            </a-form-model-item>
          </a-col>
          <a-divider orientation="left" style="color: #00A0E9" v-if="model.payStatus == '2'">
            OA回传附件
          </a-divider>
          <a-col :span="24" v-if="model.payStatus == '2'">
            <a-button type="primary" style="float:right;z-index: 999;margin-top: -28px;" size="small"
                      @click="changeFileName(model.id,model.oaAttachment,'oa_attachment','oaAttachment')" v-if="model.oaAttachment != null && model.oaAttachment != ''">修改文件名</a-button>
            <a-form-model-item label="OA附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1" >
              <j-upload v-model="model.oaAttachment" :trigger-change="true" :disabled="disabled"></j-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <pur-pay-modal ref="modalForm" @back="back"></pur-pay-modal>
      <pur-pay-apply-modal ref="payForm" />
      <change-file-name ref="cfn" @back="toSetUrl"></change-file-name>
    </j-form-container>
  </a-spin>
</template>

<script>
import ChangeFileName from '@comp/jeecgbiz/ChangeFileName'
import JFormContainer from '@/components/jeecg/JFormContainer'
import { billModalMixin } from '../../mixins/billModalMixin'
import PurPayModal from '@views/pay/modules/PurPayModal'
import { httpAction,getAction } from '@api/manage'
import { isNotNullOrEmpty, isNullOrEmpty,preciseNum } from '@/utils/util'
import PurPayApplyModal from '@views/pay/modules/PurPayApplyModal'
import {
  iegAmount
} from '@/utils/util'
export default {
    name: 'PurPayPlanForm',
    mixins: [billModalMixin],
    components: {
      JFormContainer,
      PurPayModal,
      PurPayApplyModal,
      ChangeFileName
    },
    data() {
      return {
        param:{},
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
            title:'付款申请单号',
            align:"center",
            dataIndex: 'applyCode',
            width:180,
            scopedSlots: { customRender: 'applyCode' },
          },
          {
            title:'供应商名称',
            align:"center",
            dataIndex: 'suppName',
            width:160,
          },
          {
            title:'合同名称',
            align:"center",
            dataIndex: 'contractName',
            width:160,
          },
          {
            title:'申请时间',
            align:"center",
            dataIndex: 'createTime',
            width:120,
          },
          {
            title:'币种',
            align:"center",
            dataIndex: 'currency_dictText',
            width:100,
          },
          {
            title:'付款类型',
            align:"center",
            dataIndex: 'payType_dictText',
            width:100,
          },
          {
            title:'支付方式',
            align:"center",
            dataIndex: 'payMethod_dictText',
            width:100,
          },
          {
            title:'付款比例(%)',
            dataIndex: 'payRate',
            width:100,
            customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
              const obj = {
                children: value + '%',
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          },
          {
            title:'付款金额原币',
            dataIndex: 'payAmountOther',
            width:120,
            customRender:function (t,r,index) {
              let icon = "";
              if(r.currency == 'RMB'){
                icon = '¥';
              }else if(r.currency == 'JPY'){
                icon = 'Ұ';
              }else if(r.currency == 'USD'){
                icon = '$';
              }else if(r.currency == 'EUR'){
                icon = '€';
              }
              const obj = {
                children: icon + iegAmount(t,'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
          {
            title:'付款金额本币',
            dataIndex: 'payAmount',
            width:120,
            customRender:function (t,r,index) {
              let icon = "";
              icon = '¥';
              const obj = {
                children: icon + iegAmount(t,'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
          {
            title:'备注',
            align:"center",
            dataIndex: 'comment',
            width:200,
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:100,
            scopedSlots: { customRender: 'action' },
          }
        ],
        confirmLoading:false,
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
          planMonth: [{ required: true, message: '请选择付款月份' }] ,
        },
        url: {
          add: "/srm/purPayPlan/add",
          edit: "/srm/purPayPlan/edit",
          queryById: "/srm/purPayPlan/queryById",
          purPayPlanDetail: {
            list: '/srm/purPayPlan/queryPurPayPlanDetailByMainId'
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
        that.param.table = "pur_pay_plan";
        that.$refs.cfn.initData(that.param);
      },
      handleDetail:function(record){
        this.$refs.payForm.edit(record);
        this.$refs.payForm.title="详情";
        this.$refs.payForm.disableSubmit = true;
        this.$refs.payForm.action = 'view';
      },
      onChange(date, dateString) {
        this.model.planMonth = dateString;
      },
      handleOk(){
        const that = this
        // 触发表单验证
        that.$refs.form.validate(valid => {
          if (valid) {
            let post = "";
            let url = "";
            post = 'post';
            url = this.url.add;
            let dataSource = that.dataSource;
            if(dataSource == null || dataSource.length == 0){
              that.$message.warning("应付款明细不能为空");
              return;
            }
            that.model.purPayPlanDetailList = dataSource;
            console.log(that.model);
            that.$confirm({
              content: `是否确认提交`,
              onOk: () => {
                that.confirmLoading = true;
                that.$emit('changeDisabled',true);
                httpAction(url,that.model,post).then((res)=> {
                  if (res.success) {
                    that.$message.success(res.message);
                    that.$emit('ok');
                  } else {
                    that.$message.warning(res.message);
                  }
                }).finally(() => {
                  this.confirmLoading = false
                })
              }
            })
          }else{
            return false;
          }
        })
      },
      delRow(index){
        this.dataSource.splice(index,1);

        this.model.payAmountCope = 0;
        this.model.payAmountUsd = 0;
        this.model.payAmountJpy = 0;
        this.model.payAmountEur = 0;
        if(this.dataSource == null || this.dataSource.length == 0){

        }else{
          this.dataSource.filter(item => {
            if(item.currency == "RMB"){
              let payAmountCope = Number(this.model.payAmountCope) + Number(item.payAmountOther);
              this.model.payAmountCope = Number(preciseNum(payAmountCope,2));
            }else if(item.currency == "USD"){
              let payAmountUsd = Number(this.model.payAmountUsd) + Number(item.payAmountOther);
              this.model.payAmountUsd = Number(preciseNum(payAmountUsd,2));
            }else if(item.currency == "EUR"){
              let payAmountEur = Number(this.model.payAmountEur) + Number(item.payAmountOther);
              this.model.payAmountEur = Number(preciseNum(payAmountEur,2));
            }else if(item.currency == "JPY"){
              let payAmountJpy = Number(this.model.payAmountJpy) + Number(item.payAmountOther);
              this.model.payAmountJpy = Number(preciseNum(payAmountJpy,2));
            }
          })
        }
      },
      back(rows){
        let that = this;
        let contractId = null;
        let payMethod = null;
        let same = false;
        if(that.dataSource == null || that.dataSource.length == 0){
          that.dataSource = [];
        }else{
          contractId = that.dataSource[0].contractId;
          payMethod = that.dataSource[0].payMethod;
        }

        rows.filter(item => {
          if(isNotNullOrEmpty(contractId) && contractId != item.contractId){
            same = true;
            that.$message.error("同一个付款计划只能是同一个合同");
            throw "同一个付款计划只能是同一个合同";
          }
          if(isNotNullOrEmpty(payMethod) && payMethod != item.payMethod){
            same = true;
            that.$message.error("同一个付款计划只能是一种付款方式");
            throw "同一个付款计划只能是一种付款方式";
          }
          let flag = false;
          that.dataSource.filter(child => {
            if(item.id == child.id){
              flag = true;
              return;
            }
          })
          if(!flag){
            that.dataSource.push(item);
            if(item.currency == "RMB"){
              let payAmountCope = Number(that.model.payAmountCope) + Number(item.payAmountOther);
              that.model.payAmountCope = Number(preciseNum(payAmountCope,2));
              that.$forceUpdate();
            }else if(item.currency == "USD"){
              let payAmountUsd = Number(that.model.payAmountUsd) + Number(item.payAmountOther);
              that.model.payAmountUsd = Number(preciseNum(payAmountUsd,2));
              that.$forceUpdate();
            }else if(item.currency == "EUR"){
              let payAmountEur = Number(that.model.payAmountEur) + Number(item.payAmountOther);
              that.model.payAmountEur = Number(preciseNum(payAmountEur,2));
              that.$forceUpdate();
            }else if(item.currency == "JPY"){
              let payAmountJpy = Number(that.model.payAmountJpy) + Number(item.payAmountOther);
              that.model.payAmountJpy = Number(preciseNum(payAmountJpy,2));
              that.$forceUpdate();
            }
          }
        })
        setTimeout(() => {
          that.$message.success("添加成功");
        }, 200)
      },
      openDrawer(){
        this.$refs.modalForm.initData()
      },
      add(){
        this.edit(this.modelDefault);
      },
      edit(record) {
        this.dataSource = [];
        this.model = Object.assign({}, record);
        if(!this.model.id){
          this.model.payAmountCope = 0;
          this.model.payAmountUsd = 0;
          this.model.payAmountJpy = 0;
          this.model.payAmountEur = 0;
        }else {
          this.fetchDetailList(this.model.id);
        }
      },
      fetchDetailList(id){
        let url = "/srm/purPayPlan/queryPurPayPlanDetailByMainId";
        let param = {
          id:id
        }
        getAction(url,param).then(res => {
          this.dataSource = res.result;
        })
      },
    }
  }
</script>

<style scoped>
</style>