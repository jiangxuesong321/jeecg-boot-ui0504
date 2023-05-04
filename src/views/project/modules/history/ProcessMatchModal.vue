<template>
	<a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="采购单号">
              <a-input placeholder="请输入采购单号" v-model="queryParam.reqCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="采购订单名称">
              <a-input placeholder="请输入采购订单名称" v-model="queryParam.reqTitle"></a-input>
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
        <a-col :span="4">预算总金额(元)：</a-col><a-col :span="2"><span style="color:coral;font-weight: bold;font-size:18px;">{{budgetAmount}}</span></a-col>
        <a-col :span="4">剩余可用金额(元)：</a-col><a-col :span="2"><span style="color:coral;font-weight: bold;font-size:18px;">{{remainAmount}}</span></a-col>
      </a-row>
    </div>
    <a-table ref="tableSet" size="middle" class="j-table-force-nowrap" :scroll="{x:true}"
             :columns="columns" :dataSource="dataSource" :pagination="ipagination" :loading="loading"
             @change="handleTableChange">
    </a-table>
	</a-card>
</template>

<script>
import '@assets/less/TableExpand.less'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@api/manage'

export default {
		name: 'ProcessMatchModal',
		mixins: [JeecgListMixin],
    props:['projId'],
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
            title: '采购单号',
            align: "center",
            dataIndex: 'reqCode',
            width: 120,
          },
          {
            title: '采购单名称',
            align: "center",
            dataIndex: 'reqTitle',
            width: 180,
          },
          // {
          //   title: '币种',
          //   align: "center",
          //   dataIndex: 'currency',
          //   width: 120,
          // },
          {
            title: '工艺配套金额',
            align: "center",
            dataIndex: 'workAmount',
            width: 120,
          },
          {
            title: '冻结金额',
            align: "center",
            dataIndex: 'freezeAmount',
            width: 120,
          },
          {
            title: '使用金额',
            align: "center",
            dataIndex: 'usedAmount',
            width: 120,
          },
          {
            title: '审核状态',
            align: "center",
            dataIndex: 'reqStatus_dictText',
            width: 120,
          },
          {
            title: '备注',
            align: "center",
            dataIndex: 'remark',
            width: 200,
          },
        ],
				url: {
					list: "/srm/projBase/fetchChildList",
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
        this.queryParam.projectId = this.projId;
        this.queryParam.reqType = '1'
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