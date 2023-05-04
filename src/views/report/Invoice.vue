<template>
	<a-card :bordered="false">
    <div class="card-title">
      合同发票管理统计表
    </div>
    <a-row>
      <a-col :span="24" >
        <a-date-picker
          :allowClear = 'false'
          style="float: right"
          format="YYYY"
          mode="year"
          :value="queryParam.year"
          :open="open"
          @openChange="openChange"
          @panelChange="panelChange"
        />
      </a-col>
    </a-row>
    <a-row>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <a-card class="card-main-index">
          <div class="right-content blue-money">
            <div style="display: inline-block;">
              <div class="intu">合同金额</div>
              <div class="cont-data">{{iegAmount(Math.trunc(model.contractAmountTax),'total')}}</div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <a-card class="card-main-index">
          <div class="right-content green-money">
            <div style="display: inline-block;">
              <div class="intu">已收发票</div>
              <div class="cont-data">{{iegAmount(Math.trunc(model.hasAmountTax),'total')}}</div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <a-card class="card-main-index">
          <div class="right-content blue-money">
            <div style="display: inline-block;">
              <div class="intu">待收发票</div>
              <div class="cont-data">{{iegAmount(Math.trunc(model.remainAmountTax),'total')}}</div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <a-card class="card-main-index">
          <div class="right-content pink-money">
            <div style="display: inline-block;">
              <div class="intu">发票总额</div>
              <div class="cont-data">{{iegAmount(Math.trunc(model.invoiceAmountTax),'total') }}</div>
            </div>
          </div>
        </a-card>
      </a-col>
<!--      <a-col :sm="24" :md="12" :xl="4" :style="{ marginBottom: '24px' }">-->
<!--        <a-card class="card-main-index">-->
<!--          <div class="right-content blue-money">-->
<!--            <div style="display: inline-block;">-->
<!--              <div class="intu">普票</div>-->
<!--              <div class="cont-data">{{Math.trunc(model.normalAmountTax)}}</div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </a-card>-->
<!--      </a-col>-->
<!--      <a-col :sm="24" :md="12" :xl="4" :style="{ marginBottom: '24px' }">-->
<!--        <a-card class="card-main-index">-->
<!--          <div class="right-content orange-money">-->
<!--            <div style="display: inline-block;">-->
<!--              <div class="intu">专票</div>-->
<!--              <div class="cont-data">{{Math.trunc(model.specialAmountTax)}}</div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </a-card>-->
<!--      </a-col>-->
    </a-row>
		<a-row>

      <a-col :span="24">
        <h3>合同发票明细列表</h3>
        <div class="table-operator">
          <list-columns-setter v-model="columns" :def-columns="columns" style="float: right;" />
        </div>
        <a-button type="primary" icon="download" @click="handleExportXls('合同发票明细列表')" style="float:right;z-index:99;margin-top: 0px;margin-right: 10px">导出</a-button>
        <a-table
          ref="table"
          size="middle"
          :scroll="{x:true,y:500}"
          bordered
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          @change="handleTableChange">
          <template slot="contractNumber" slot-scope="text,record">
            <a @click="handleContract(record)">{{text}}</a>
          </template>

          <template slot="invoiceNo" slot-scope="text,record">
            <a @click="handleInvoice(record)">{{text}}</a>
          </template>
        </a-table>
        <purchase-pay-inovice-modal ref="modalForm1" @ok="modalFormOk"></purchase-pay-inovice-modal>
        <contract-base-modal ref="modalForm"/>
      </a-col>
<!--      <a-col :span="6">-->
<!--        <a-row>-->
<!--          <h3>月份统计信息</h3>-->
<!--          <a-table-->
<!--            ref="table"-->
<!--            size="middle"-->
<!--            :scroll="{x:true}"-->
<!--            bordered-->
<!--            rowKey="id"-->
<!--            :columns="columns1"-->
<!--            :dataSource="dataSource1"-->
<!--            :pagination="false">-->
<!--          </a-table>-->
<!--        </a-row>-->
<!--      </a-col>-->
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
  iegAmount, isNullOrEmpty
} from '@/utils/util'
import PurchasePayInoviceModal from '@views/pay/modules/PurchasePayInoviceModal'

export default {
		name: 'Invoice',
		mixins: [JeecgListMixin, mixinDevice, billListMixin, billModalMixin],
		components: {
      ListColumnsSetter,
      ContractBaseModal,
      PurchasePayInoviceModal
		},
		data() {
			return {
        isorter:{
          column: 'contractNumber',
          order: 'desc',
        },
        iegAmount,
        open: false,
        height: 420,
        queryParam:{
          year: moment(),
        },
        model:{},
        key: 0,
        dataSource1:[],
        columns1:[
          {
            title: '月份',
            dataIndex: 'month',
            width: 120,
            align: "center",
          },
          {
            title: '价税合计',
            dataIndex: 'invoiceAmountTax',
            width: 120,
            align: "center",
            customRender:function (t,r,index) {
              return iegAmount(t,'total')
            }
          },
          {
            title: '未税金额',
            dataIndex: 'invoiceAmount',
            width: 120,
            align: "center",
            customRender:function (t,r,index) {
              return iegAmount(t,'total')
            }
          },
          {
            title: '税额',
            dataIndex: 'tax',
            width: 120,
            align: "center",
            customRender:function (t,r,index) {
              return iegAmount(t,'total')
            }
          },
        ],
        columns : [
          {
            title: '合同日期',
            dataIndex: 'contractValidDate',
            width: 120,
            align: "center",
            sorter: true,
          },
          {
            title: '合同编码',
            dataIndex: 'contractNumber',
            width: 120,
            scopedSlots: { customRender: 'contractNumber' },
            align: "center",
            sorter: true,
          },
          {
            title: '项目负责人',
            align: "center",
            dataIndex: 'projUser',
            width: 120,
            sorter: true,
          },
          {
            title: '对方单位',
            align: "center",
            dataIndex: 'suppName',
            width: 140,
            sorter: true,
          },
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
            title: '开票日期',
            align: "center",
            dataIndex: 'invoiceDate',
            width: 120,
            sorter: true,
          },
          {
            title: '发票号码',
            align: "center",
            dataIndex: 'invoiceNo',
            width: 120,
            sorter: true,
            scopedSlots: { customRender: 'invoiceNo' },
          },
          // {
          //   title: '发票代码',
          //   align: "center",
          //   dataIndex: 'invoiceCode',
          //   width: 120,
          // },
          {
            title: '发票类型',
            align: "center",
            dataIndex: 'invoiceType_dictText',
            sorter: true,
            width: 120,
            customRender:function (t,r,index) {
              return isNullOrEmpty(t) ? r.invoiceType : t;
            },
          },
          {
            title: '税率(%)',
            dataIndex: 'taxRate',
            sorter: true,
            width: 120,
            customRender:function (t,r,index) {
              const obj = {
                children: t + "%",
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
          {
            title: '开票比例(%)',
            dataIndex: 'invoiceRate',
            sorter: true,
            width: 120,
            customRender:function (t,r,index) {
              const obj = {
                children: t + "%",
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
          {
            title: '开票金额(含税)',
            dataIndex: 'invoiceAmountTax',
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
            title: '开票金额(未税)',
            dataIndex: 'invoiceAmount',
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
            title: '税额',
            dataIndex: 'tax',
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
          // {
          //   title: '备注',
          //   align: "center",
          //   dataIndex: 'comment',
          //   width: 200,
          // },

        ],
				description: 'proj_base管理页面',
				url: {
					list: "/srm/report/fetchContractToInvoice",
          exportXlsUrl: "/srm/report/exportContractToInvoice",
				},
				dictOptions: {},
				superFieldList: [],
			}
		},
		created() {
		  //金额
      this.fetchAmountTotal();
      //月份汇总
      this.fetchContractToInvoiceByMonth();

		},
    mounted() {

    },
		computed: {
      importExcelUrl: function() {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
		},
		methods: {
      handleInvoice(record){
        //查询发票
        let url = "/srm/purchasePayInovice/queryById";
        let param = {
          id:record.invoiceId
        }
        getAction(url,param).then(res => {
          let row = res.result;

          this.$refs.modalForm1.edit(row);
          this.$refs.modalForm1.title="详情";
          this.$refs.modalForm1.disableSubmit = true;
        })

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
      loadData(arg) {
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
      searchQuery(){
        //金额
        this.fetchAmountTotal();
        //月份汇总
        this.fetchContractToInvoiceByMonth();

        this.loadData();
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
      fetchContractToInvoiceByMonth(){
        this.dataSource1 = [];
        let url = "/srm/report/fetchContractToInvoiceByMonth";
        let param = {
          year:this.queryParam.year,
        }
        getAction(url,param).then(res => {
          this.dataSource1 = res.result;
        })
      },
      fetchAmountTotal(){
        this.model = {};
        let url = "/srm/report/fetchAmountTotal";
        let param = {
          year:this.queryParam.year,
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