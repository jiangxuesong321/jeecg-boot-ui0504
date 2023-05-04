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
            <a-form-item label="OA审批单号">
              <a-input placeholder="请输入OA审批单号" v-model="queryParam.oaCode"></a-input>
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
		name: 'BasPayModal',
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
            title: 'OA审批单号',
            align: "center",
            dataIndex: 'oaCode',
            width: 120,
          },
          {
            title: '合同编号',
            align: "center",
            dataIndex: 'code',
            width: 180,
          },
          {
            title: '合同名称',
            align: "center",
            dataIndex: 'name',
            width: 120,
          },
          {
            title: '产品信息',
            align: "center",
            dataIndex: 'prodName',
            width: 120,
          },
          {
            title: '合同总额',
            align: "center",
            dataIndex: 'totalAmount',
            width: 120,
          },
          {
            title: '已付款金额',
            align: "center",
            dataIndex: 'hasPayAmount',
            width: 120,
          },
          {
            title: '剩余付款金额',
            align: "center",
            dataIndex: 'remainPayAMOUNT',
            width: 120,
          },
          {
            title: '付款时间',
            align: "center",
            dataIndex: 'payTime',
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