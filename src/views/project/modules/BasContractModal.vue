<template>
	<a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="合同编码">
              <a-input placeholder="合同编码" v-model="queryParam.contractNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="合同名称">
              <a-input placeholder="合同名称" v-model="queryParam.contractName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="币种">
              <j-dict-select-tag type="select" v-model="queryParam.contractCurrency" dictCode="currency_type"></j-dict-select-tag>
            </a-form-item>
          </a-col>
          <a-col :span="6" v-if="!disabled">
            <a-form-item label="费用类型">
              <a-tree-select
                tree-default-expand-all
                allowClear
                :getPopupContainer="(node) => node.parentNode"
                style="width: 100%"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                v-model="queryParam.categoryId"
                :treeData="treeData"
                :multiple="multiple"
                @change="onChange">
              </a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <span style="float: right;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-table ref="tableSet" size="middle" :scroll="{x:1200,y:400}"
             :columns="columns" :dataSource="dataSource" :pagination="ipagination"
             :loading="loading" @change="handleTableChange" bordered>
      <template slot="payAmount" slot-scope="text,record">
        <a @click="handlePay(record)">{{text}}</a>
      </template>
      <template slot="invoiceAmount" slot-scope="text,record">
        <a @click="handleInvoice(record)">{{text}}</a>
      </template>

      <template slot="contractNumber" slot-scope="text,record">
        <a @click="handleContract(record)">{{text}}</a>
      </template>

      <template slot="contractName" slot-scope="text,record">
        <div style="width: 200px;height: auto;word-wrap: break-word;overflow: hidden; text-overflow: ellipsis;white-space: nowrap;" :title="text">
          {{text}}
        </div>
        <div style="width: 200px;height: auto;word-wrap: break-word;overflow: hidden; text-overflow: ellipsis;white-space: nowrap;" :title="record.prodName">
          {{record.prodName}}
        </div>
        <div style="width: 200px;height: auto;word-wrap: break-word;overflow: hidden; text-overflow: ellipsis;white-space: nowrap;" :title="record.suppName">
          {{record.suppName}}
        </div>
      </template>
    </a-table>

    <bas-pay-list ref="payModal" :contractId="contractId"></bas-pay-list>
    <bas-invoice-list ref="invoiceModal" :contractId="contractId"></bas-invoice-list>
    <contract-base-modal ref="modalForm"/>
	</a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@api/manage'
import BasPayList from '@views/project/modules/BasPayList'
import BasInvoiceList from '@views/project/modules/BasInvoiceList'
import {
  iegAmount, isNotNullOrEmpty
} from '@/utils/util'
import ContractBaseModal from '@views/contract/modules/ContractBaseModal'
export default {
		name: 'BasContractModal',
		mixins: [JeecgListMixin],
		components: {
      BasPayList,
      BasInvoiceList,
      ContractBaseModal
		},
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    categoryId:{
      type: String,
      default: '',
      required: ''
    }
  },
		data() {
			return {
			  contractId:'',
        multiple:false,
        treeData:[],
			  model:{},
			  budgetAmount:0,
        remainAmount:0,
				description: 'proj_base管理页面',
				// 表头
        columns: [
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
            title: '合同编码',
            align: "center",
            dataIndex: 'contractNumber',
            width: 120,
            scopedSlots: { customRender: 'contractNumber' },
            sorter: true,
          },
          {
            title: '合同名称',
            align: "center",
            dataIndex: 'contractName',
            width: 200,
            sorter: true,
            scopedSlots: { customRender: 'contractName' },
          },
          {
            title: '费用类型',
            align: "center",
            dataIndex: 'name',
            width: 120,
            sorter: true,
          },
          {
            title: '币种',
            align: "center",
            dataIndex: 'contractCurrency_dictText',
            width: 120,
            sorter: true,
          },
          {
            title: '采购数量',
            align: "center",
            dataIndex: 'qty',
            width: 100,
            sorter: true,
          },
          {
            title: '合同总额',
            dataIndex: 'contractAmountTax',
            width: 120,
            sorter: true,
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
            title: '合同生效时间',
            align: "center",
            dataIndex: 'contractValidDate',
            sorter: true,
            width: 120,
          },
          {
            title: '已付款金额',
            dataIndex: 'payAmount',
            sorter: true,
            width: 120,
            scopedSlots: { customRender: 'payAmount' },
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
            title: '剩余付款金额',
            dataIndex: 'remainPayAmount',
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
            title: '发票总额',
            dataIndex: 'invoiceAmount',
            sorter: true,
            width: 120,
            scopedSlots: { customRender: 'invoiceAmount' },
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
            title: '剩余开票总额',
            dataIndex: 'remainInvoiceAmount',
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
        ],
				url: {
					list: "/srm/contractBase/fetchContractListByProjId",
				},
				dictOptions: {},
				superFieldList: [],
			}
		},
		created() {

		},
		computed: {
			importExcelUrl: function() {
				return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
			},
		},
		methods: {
      onChange(value){
        this.queryParam.categoryId = value;
        this.$forceUpdate();
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
      handleInvoice(record){
        let that = this;
        that.contractId = record.id;
        setTimeout(() => {
          that.$refs.invoiceModal.initData(1);
        }, 500)
      },
      handlePay(record){
        let that = this;
        that.contractId = record.id;
        setTimeout(() => {
          that.$refs.payModal.initData(1);
        }, 500)
      },
      fetchCategory(){
        this.treeData = [];
        let url = "/srm/projBase/fetchLastCategory";
        let param = {
          projectId:this.model.id,
          disabled:false,
        }
        getAction(url,param).then(res => {
          this.treeData = res.result;
        })
      },
      edit(record){
        this.model = record;
        this.loadData(1);
        this.fetchCategory();
      },
      loadData(arg) {
        if(!this.url.list){
          this.$message.error("请设置url.list属性!")
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        var params = this.getQueryParams();//查询条件
        params.projectId = this.model.id;
        if(isNotNullOrEmpty(this.categoryId)){
          params.categoryId = this.categoryId;
        }
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