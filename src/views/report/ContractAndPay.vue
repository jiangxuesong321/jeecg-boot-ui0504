<template>
	<a-card :bordered="false">
    <div class="card-title">
      合同管理及支付明细报表
    </div>
    <a-row>
      <a-col :span="6" >
        <a-range-picker
          :placeholder="['开始月份', '结束月份']"
          format="YYYY-MM"
          valueFormat="YYYY-MM"
          :value="queryParam.monthList"
          :mode="mode2"
          @panelChange="handlePanelChange2"
          :allowClear="false"
          :disabled-date="disabledDate"
        />
      </a-col>
      <a-col :span="6">
        <j-dict-select-tag v-model="queryParam.projId" placeholder="请选择项目"
                           :allow-clear="true"
                           dictCode="proj_base,proj_name,id,del_flag = '0' order by create_time desc"
                           @change="searchQuery" style="width: 80%"/>
      </a-col>
      <a-col :span="6">
        <a-input v-model="queryParam.contractNumber" placeholder="请选择合同编码" style="width: 80%" @change="searchQuery"></a-input>
      </a-col>
      <a-col :span="6">
        <a-input v-model="queryParam.suppName" placeholder="请选择供应商" style="width: 80%" @change="searchQuery"></a-input>
      </a-col>
    </a-row>
    <a-row style="margin-top: 10px">
      <a-col :span='6' :style="{ marginBottom: '24px' }">
        <a-card class="card-main-index">
          <div class="right-content orange-money">
            <div style="display: inline-block;">
              <div class="intu">合同总数</div>
              <div class="cont-data">{{iegAmount(Math.trunc(model.contractNum),'total')}}</div>
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :span='6' :style="{ marginBottom: '24px' }">
        <a-card class="card-main-index">
          <div class="right-content pink-money">
            <div style="display: inline-block;">
              <div class="intu">合同金额</div>
              <div class="cont-data">{{iegAmount(Math.trunc(model.contractAmountTax),'total')}}</div>
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :span='6' :style="{ marginBottom: '24px' }">
        <a-card class="card-main-index">
          <div class="right-content orange-money">
            <div style="display: inline-block;">
              <div class="intu">开票金额</div>
              <div class="cont-data">{{iegAmount(Math.trunc(model.invoiceAmountTax),'total')}}</div>
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :span='6' :style="{ marginBottom: '24px' }">
        <a-card class="card-main-index">
          <div class="right-content pink-money">
            <div style="display: inline-block;">
              <div class="intu">开票进度</div>
              <div class="cont-data">{{iegAmount(model.invoiceProgress,'total')}}%</div>
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :span='6' :style="{ marginBottom: '24px' }">
        <a-card class="card-main-index">
          <div class="right-content blue-money">
            <div style="display: inline-block;">
              <div class="intu">付款金额</div>
              <div class="cont-data">{{iegAmount(Math.trunc(model.payAmount),'total')}}</div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span='6' :style="{ marginBottom: '24px' }">
        <a-card class="card-main-index">
          <div class="right-content blue-money">
            <div style="display: inline-block;">
              <div class="intu">付款进度</div>
              <div class="cont-data">{{iegAmount(model.payProgress,'total')}}%</div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span='6' :style="{ marginBottom: '24px' }">
        <a-card class="card-main-index">
          <div class="right-content blue-money">
            <div style="display: inline-block;">
              <div class="intu">剩余款项</div>
              <div class="cont-data">{{iegAmount(Math.trunc(model.remainPayAmount),'total')}}</div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
		<a-row>
        <div class="table-operator">
          <list-columns-setter v-model="columns" :def-columns="columns" style="float: right;" />
        </div>
        <a-button type="primary" icon="download" @click="handleExportXls('合同管理及支付明细报表')" style="float:right;z-index:99;margin-top: -8px;margin-right: 10px">导出</a-button>
        <a-table
          ref="table"
          size="middle"
          :scroll="{x:true,y:500}"
          bordered
          rowKey="recordId"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          @change="handleTableChange"
          @expand="openExpand"
          :expandedRowKeys="expandedRowKeys">
          <div slot="expandedRowRender" slot-scope="text">
            <div class="rfq-content rfq-content2" style="max-width: 50%">
              <table>
                <thead>
                <tr>
                  <th style="width:30px !important;" v-for="(item,index) in text.payList">付款{{index + 1}} &nbsp;&nbsp;&nbsp;{{item.createTime}}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td style="text-align: center" v-for="(item, index) in text.payList">
                    <span v-if="text.contractCurrency == 'RMB'">
                      ¥
                    </span>
                    <span v-if="text.contractCurrency == 'JPY'">
                      Ұ
                    </span>
                    <span v-if="text.contractCurrency == 'USD'">
                      $
                    </span>
                    <span v-if="text.contractCurrency == 'EUR'">
                      €
                    </span>
                    {{iegAmount(item.amount,'total')}}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <template slot="pay1" slot-scope="text,record">
            <div style="text-align: right">
              <span v-if="record.contractCurrency == 'RMB'">
                    ¥
              </span>
              <span v-if="record.contractCurrency == 'JPY'">
                    Ұ
              </span>
              <span v-if="record.contractCurrency == 'USD'">
                    $
              </span>
              <span v-if="record.contractCurrency == 'EUR'">
                    €
              </span>
              {{iegAmount(text,'total')}}
            </div>
            <div v-if="isNotNullOrEmpty(record.contractAmountTax) && record.contractAmountTax > 0" style="float: right">
              <a-tag color="blue">
                {{preciseNum(text / record.contractAmountTax * 100,2)}}%
              </a-tag>
            </div>
          </template>

          <template slot="pay2" slot-scope="text,record">
            <div style="text-align: right">
              <span v-if="record.contractCurrency == 'RMB'">
                    ¥
              </span>
              <span v-if="record.contractCurrency == 'JPY'">
                    Ұ
              </span>
              <span v-if="record.contractCurrency == 'USD'">
                    $
              </span>
              <span v-if="record.contractCurrency == 'EUR'">
                    €
              </span>
              {{iegAmount(text,'total')}}
            </div>
            <div v-if="isNotNullOrEmpty(record.contractAmountTax) && record.contractAmountTax > 0" style="float: right">
              <a-tag color="blue">
                {{preciseNum(text / record.contractAmountTax * 100,2)}}%
              </a-tag>
            </div>
          </template>

          <template slot="pay3" slot-scope="text,record">
            <div style="text-align: right">
              <span v-if="record.contractCurrency == 'RMB'">
                    ¥
              </span>
              <span v-if="record.contractCurrency == 'JPY'">
                    Ұ
              </span>
              <span v-if="record.contractCurrency == 'USD'">
                    $
              </span>
              <span v-if="record.contractCurrency == 'EUR'">
                    €
              </span>
              {{iegAmount(text,'total')}}
            </div>
            <div v-if="isNotNullOrEmpty(record.contractAmountTax) && record.contractAmountTax > 0" style="float: right">
              <a-tag color="blue">
                {{preciseNum(text / record.contractAmountTax * 100,2)}}%
              </a-tag>
            </div>
          </template>

          <template slot="pay4" slot-scope="text,record">
            <div style="text-align: right">
              <span v-if="record.contractCurrency == 'RMB'">
                    ¥
              </span>
              <span v-if="record.contractCurrency == 'JPY'">
                    Ұ
              </span>
              <span v-if="record.contractCurrency == 'USD'">
                    $
              </span>
              <span v-if="record.contractCurrency == 'EUR'">
                    €
              </span>
              {{iegAmount(text,'total')}}
            </div>
            <div v-if="isNotNullOrEmpty(record.contractAmountTax) && record.contractAmountTax > 0" style="float: right">
              <a-tag color="blue">
                {{preciseNum(text / record.contractAmountTax * 100,2)}}%
              </a-tag>
            </div>
          </template>

          <template slot="pay5" slot-scope="text,record">
            <div style="text-align: right">
              <span v-if="record.contractCurrency == 'RMB'">
                    ¥
              </span>
              <span v-if="record.contractCurrency == 'JPY'">
                    Ұ
              </span>
              <span v-if="record.contractCurrency == 'USD'">
                    $
              </span>
              <span v-if="record.contractCurrency == 'EUR'">
                    €
              </span>
              {{iegAmount(text,'total')}}
            </div>
            <div v-if="isNotNullOrEmpty(record.contractAmountTax) && record.contractAmountTax > 0" style="float: right">
              <a-tag color="blue">
                {{preciseNum(text / record.contractAmountTax * 100,2)}}%
              </a-tag>
            </div>
          </template>


          <template slot="payProgress" slot-scope="text,record">
            {{text}}%
          </template>
          <template slot="payingProgress" slot-scope="text,record">
            {{text}}%
          </template>
          <template slot="invoiceProgress" slot-scope="text,record">
            {{text}}%
          </template>

          <template slot="contractNumber" slot-scope="text,record">
            <a @click="handleContract(record)">{{text}}</a>
          </template>
        </a-table>
      <contract-base-modal ref="modalForm"/>
		</a-row>
	</a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { billListMixin } from '../mixins/billListMixin'
import { billModalMixin } from '../mixins/billModalMixin'
import ListColumnsSetter from '@views/components/ListColumnsSetter'
import { getAction } from '@/api/manage'
import moment from 'moment'
import ContractBaseModal from '@views/contract/modules/ContractBaseModal'
import {
  iegAmount,
  isNotNullOrEmpty, isNullOrEmpty,
  preciseNum
} from '@/utils/util'
export default {
		name: 'ContractAndPay',
		mixins: [JeecgListMixin, mixinDevice, billListMixin, billModalMixin],
		components: {
      ListColumnsSetter,
      ContractBaseModal,
      moment,
		},
		data() {
			return {
        moment,

        mode2: ['month', 'month'],
        expandedRowKeys:[],
        preciseNum,
        iegAmount,
        isNotNullOrEmpty,
        open: false,
        height: 420,
        queryParam:{
          monthList:[],
          year: moment(),
          projId:null
        },
        model:{},
        key: 0,
        columns : [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: 'center',
            customRender: function(t, r, index) {
              return parseInt(index) + 1
            }
          },
          {
            title: '项目名称',
            dataIndex: 'projName',
            align: 'center',
            sorter: true,
            width: 180,
          },
          {
            title: '项目子类',
            align: "center",
            dataIndex: 'model_dictText',
            sorter: true,
            width: 120,
          },
          {
            title: '签订日期',
            align: "center",
            dataIndex: 'contractSignDate',
            sorter: true,
            width: 140,
          },
          {
            title: '合同编号',
            align: "center",
            dataIndex: 'contractNumber',
            sorter: true,
            width: 120,
            scopedSlots: { customRender: 'contractNumber' }
          },
          {
            title: '合同名称',
            align: "center",
            dataIndex: 'contractName',
            sorter: true,
            width: 180,
          },
          {
            title: '设备供应商',
            align: "center",
            dataIndex: 'suppName',
            sorter: true,
            width: 140,
          },
          // {
          //   title: '发票代码',
          //   align: "center",
          //   dataIndex: 'invoiceCode',
          //   width: 120,
          // },
          {
            title: '合同金额',
            dataIndex: 'contractAmountTax',
            sorter: true,
            width: 120,
            customRender:function (t,r,index) {
              let icon = "";
              if(r.contractCurrency == 'RMB'){
                icon = '¥';
              }else if(r.contractCurrency == 'JPY'){
                icon = 'Ұ';
              }else if(r.contractCurrency == 'USD'){
                icon = '$';
              }else if(r.contractCurrency == 'EUR'){
                icon = '€';
              }
              const obj = {
                children: icon + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
          {
            title: '已付款金额',
            dataIndex: 'payAmount',
            width: 120,
            customRender:function (t,r,index) {
              let icon = "";
              if(r.contractCurrency == 'RMB'){
                icon = '¥';
              }else if(r.contractCurrency == 'JPY'){
                icon = 'Ұ';
              }else if(r.contractCurrency == 'USD'){
                icon = '$';
              }else if(r.contractCurrency == 'EUR'){
                icon = '€';
              }
              const obj = {
                children: icon + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
          {
            title: '付款进度',
            align: "center",
            dataIndex: 'payProgress',
            width: 120,
            scopedSlots: { customRender: 'payProgress' }
          },
          {
            title: '请款金额',
            dataIndex: 'payingAmount',
            width: 120,
            customRender:function (t,r,index) {
              let icon = "";
              if(r.contractCurrency == 'RMB'){
                icon = '¥';
              }else if(r.contractCurrency == 'JPY'){
                icon = '￥';
              }else if(r.contractCurrency == 'USD'){
                icon = '$';
              }else if(r.contractCurrency == 'EUR'){
                icon = '€';
              }
              const obj = {
                children: icon + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
          {
            title: '请款进度',
            align: "center",
            dataIndex: 'payingProgress',
            width: 120,
            scopedSlots: { customRender: 'payingProgress' }
          },
          {
            title: '开票金额',
            dataIndex: 'invoiceAmount',
            sorter: true,
            width: 120,
            customRender:function (t,r,index) {
              let icon = "";
              if(r.contractCurrency == 'RMB'){
                icon = '¥';
              }else if(r.contractCurrency == 'JPY'){
                icon = '￥';
              }else if(r.contractCurrency == 'USD'){
                icon = '$';
              }else if(r.contractCurrency == 'EUR'){
                icon = '€';
              }
              const obj = {
                children: icon + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
          {
            title: '开票进度',
            align: "center",
            dataIndex: 'invoiceProgress',
            width: 120,
            scopedSlots: { customRender: 'invoiceProgress' }
          },
          // {
          //   title: '付款明细',
          //   align: "center",
          //   children:[
          //     {
          //       title: '一',
          //       dataIndex: 'pay1',
          //       width: 120,
          //       scopedSlots: { customRender: 'pay1' }
          //     },
          //     {
          //       title: '二',
          //       dataIndex: 'pay2',
          //       width: 120,
          //       scopedSlots: { customRender: 'pay2' }
          //     },
          //     {
          //       title: '三',
          //       dataIndex: 'pay3',
          //       width: 120,
          //       scopedSlots: { customRender: 'pay3' }
          //     },
          //     {
          //       title: '四',
          //       dataIndex: 'pay4',
          //       width: 120,
          //       scopedSlots: { customRender: 'pay4' }
          //     },
          //     {
          //       title: '五',
          //       dataIndex: 'pay5',
          //       width: 120,
          //       scopedSlots: { customRender: 'pay5' }
          //     },
          //   ],
          // },
          {
            title: '剩余款项',
            dataIndex: 'remainPayAmount',
            width: 120,
            customRender:function (t,r,index) {
              let icon = "";
              if(r.contractCurrency == 'RMB'){
                icon = '¥';
              }else if(r.contractCurrency == 'JPY'){
                icon = '￥';
              }else if(r.contractCurrency == 'USD'){
                icon = '$';
              }else if(r.contractCurrency == 'EUR'){
                icon = '€';
              }
              const obj = {
                children: icon + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
          // {
          //   title: '备注',
          //   align: "center",
          //   dataIndex: 'comment',
          //   width: 200,
          // },
        ],
				description: 'proj_base管理页面',
				url: {
					list: "/srm/report/fetchContractAndPayPageList",
          exportXlsUrl: "/srm/report/exportContractAndPayPageList",
				},
				dictOptions: {},
				superFieldList: [],
			}
		},
		created() {
      //获取当前年月
      let myDate = new Date()	//创建Date对象
      let year = myDate.getFullYear()   //获取当前完整年份
      let startMonth = year + '-01'
      let endMonth = year + '-12'
      this.queryParam.startMonth = startMonth
      this.queryParam.endMonth = endMonth
      this.queryParam.monthList.push(this.moment(startMonth))
      this.queryParam.monthList.push(this.moment(endMonth))

      this.fetchContractAndPay();
      this.initData();
		},
    mounted() {

    },
    watch : {
      queryParam: {
        handler(newObj, oldName) {
          if(isNullOrEmpty(newObj.projId)){
            newObj.projId = undefined;
            this.queryParam.projId = undefined;
          }
          console.log("============",newObj)
        },
        immediate: true,
        deep: true
      }
    },
		computed: {
      importExcelUrl: function() {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
		},
		methods: {
      handleTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        //TODO 筛选
        console.log(pagination)
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        this.ipagination = pagination;
        this.initData();
      },
      disabledDate(current) {
        console.log("月份判断结果",current < moment("2023-01-16"))
        return current && current < moment("2023-01");
      },
		  initData(arg){
		    this.dataSource = [];
        if(!this.url.list){
          this.$message.error("请设置url.list属性!")
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        var params = this.getQueryParams();//查询条件
        this.loading = true;
        getAction(this.url.list, params).then((res) => {
          if (res.success) {
            //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
            this.dataSource = res.result.records||res.result;
            if(res.result.total)
            {
              this.ipagination.total = res.result.total;
            }else{
              this.ipagination.total = 0;
            }
            //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
          }else{
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      loadData(arg) {

      },
      getDistanceMonth(startTime, endTime) {
        startTime = new Date(startTime)
        endTime = new Date(endTime)

        let dateToMonth = 0
        const startDate = startTime.getDate() + startTime.getHours() / 24 + startTime.getMinutes() / 24 / 60
        const endDate = endTime.getDate() + endTime.getHours() / 24 + endTime.getMinutes() / 24 / 60

        if (endDate >= startDate) {
          dateToMonth = 0
        } else {
          dateToMonth = -1
        }

        const yearToMonth = (endTime.getYear() - startTime.getYear()) * 12
        const monthToMonth = endTime.getMonth() - startTime.getMonth()

        return yearToMonth + monthToMonth + dateToMonth + 1
      },
      moment,
      handlePanelChange2(value, mode) {
        this.queryParam.monthList = value
        if (value != null && value.length > 0) {
          let startMonth = this.moment(value[0]).format('YYYY-MM')
          let endMonth = this.moment(value[1]).format('YYYY-MM')
          this.queryParam.startMonth = startMonth
          this.queryParam.endMonth = endMonth

          let days = this.getDistanceMonth(startMonth, endMonth)
          if (days > 24) {
            this.$message.error('只能选择近两年内的数据')
            return
          }
        }
        this.mode2 = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]]
        this.searchQuery()
      },
      openExpand(expanded, row) {
        this.childList = []
        if (expanded) {

          this.expandedRowKeys = []
          this.expandedRowKeys.push(row.recordId)
        } else {
          this.expandedRowKeys = []
        }
      },
      handleContract(record){
        let that = this;
        //获取合同信息
        let url = "/srm/contractBase/queryById";
        getAction(url,{id:record.id}).then(res => {
          let contract = res.result;
          that.$refs.modalForm.detail(contract);
        })
      },
      openChange(status) {
        if (status) {
          this.open = true;
        } else {
          this.open = false;
        }
      },
      panelChange(value){
        let that = this;
        that.queryParam.year = value;
        that.open = false;

        that.searchQuery();
      },
      searchQuery(){
        this.fetchContractAndPay();
        this.initData();
      },
      fetchContractAndPay(){
        let url = "/srm/report/fetchContractAndPay";
        let param = {
          year:this.queryParam.year,
          projId: this.queryParam.projId,
          contractNumber:this.queryParam.contractNumber,
          suppName:this.queryParam.suppName,
          startMonth:this.queryParam.startMonth,
          endMonth:this.queryParam.endMonth
        }
        getAction(url,param).then(res => {
          this.model = res.result;
        })
      }
		}
	}
</script>
<style scoped>
	@import '~@assets/less/common.less';
</style>
<style lang="less" scoped>
  .ant-row.ant-form-item {
    margin-bottom: 12px;
  }
</style>
<style>
.resize-table-th {
  position: relative;
}
.table-draggable-handle {
  height: 100% !important;
  bottom: 0;
  left: auto !important;
  right: -5px;
  cursor: col-resize;
  touch-action: none;
  position: absolute;
  top: 0px;
  z-index: 1;
  user-select: auto;
  width: 10px;
  transform: none !important;
}
rfq-content {
  min-height: 50px;
  display: flex;
}
.rfq-content table {
  width: 100%;
  margin-left: 5px;
  margin-right: 5px;
  border: 1px #ccc solid;
}
.rfq-content table thead th {
  text-align: center;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  transition: background 0.3s ease;
}
.rfq-content table tbody tr td {
  font-size: 12px;
  border-right: 1px #ccc solid;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom: 1px #ccc solid;
}
</style>