<template>
	<a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="合同名称">
              <a-input placeholder="请输入合同名称" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="乙方名称">
              <a-input placeholder="请输入乙方名称" v-model="queryParam.company"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="发票号码">
              <a-input placeholder="请输入发票号码" v-model="queryParam.invoiceCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
								<span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
									<a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
									<a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置
									</a-button>
								</span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-row :gutter="24">
        <a-col :span="5">发票总金额(元)：</a-col><a-col :span="2"><span style="color:coral;font-weight: bold;font-size:18px;">{{budgetAmount}}</span></a-col>
        <a-col :span="5">剩余总金额(元)：</a-col><a-col :span="2"><span style="color:coral;font-weight: bold;font-size:18px;">{{remainAmount}}</span></a-col>
      </a-row>
    </div>
    <a-table ref="tableSet" size="middle" rowKey="id" class="j-table-force-nowrap" :scroll="{x:true}"
             :columns="columns" :dataSource="dataSource" :pagination="ipagination"
             :loading="loading" @change="handleTableChange">
    </a-table>
	</a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

export default {
		name: 'BasInvoiceModal',
		mixins: [JeecgListMixin],
		components: {

		},
		data() {
			return {
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
            title: '合同编号',
            align: "center",
            dataIndex: 'code',
            width: 180,
          },
          {
            title: '合同日期',
            align: "center",
            dataIndex: 'contractTime',
            width: 180,
          },
          {
            title: '合同名称',
            align: "center",
            dataIndex: 'name',
            width: 120,
          },
          {
            title: '乙方名称',
            align: "center",
            dataIndex: 'company',
            width: 120,
          },
          {
            title: '付款类型',
            align: "center",
            dataIndex: 'payMethod',
            width: 120,
          },
          {
            title: '币种',
            align: "center",
            dataIndex: 'currency',
            width: 120,
          },
          {
            title: '机台信息',
            align: "center",
            dataIndex: 'eqp',
            width: 120,
          },
          {
            title: '发票号码',
            align: "center",
            dataIndex: 'invoiceCode',
            width: 120,
          },
          {
            title: '开票日期',
            align: "center",
            dataIndex: 'invoiceTime',
            width: 120,
          },
          {
            title: '开票类型',
            align: "center",
            dataIndex: 'invoiceType',
            width: 120,
          },
          {
            title: '税率',
            align: "center",
            dataIndex: 'taxRate',
            width: 120,
          },
          {
            title: '金额(含税)',
            align: "center",
            dataIndex: 'amountTax',
            width: 120,
          },
          {
            title: '金额(未税)',
            align: "center",
            dataIndex: 'amount',
            width: 120,
          },
          {
            title: '税额',
            align: "center",
            dataIndex: 'tax',
            width: 120,
          },
          {
            title: '附件',
            align: "center",
            dataIndex: 'attachment',
            width: 120,
          },
        ],
				url: {
					list: "/srm/projBase/list",
					delete: "/srm/projBase/delete",
					deleteBatch: "/srm/projBase/deleteBatch",
					exportXlsUrl: "/srm/projBase/exportXls",
					importExcelUrl: "srm/projBase/importExcel",

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