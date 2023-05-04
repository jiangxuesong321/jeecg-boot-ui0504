<template>
	<a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="版本编号" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input placeholder="请输入版本编号" v-model="queryParam.sort"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-button type='primary' @click='searchQuery' icon='search'>查询</a-button>
            <a-button type='primary' @click='searchReset' icon='reload' style='margin-left: 8px'>重置</a-button>
            <a-button type="primary" icon="download" @click="handleExportXls('项目变更')" style='margin-left: 8px'>导出</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-table ref="tableChange" size="middle" rowKey="id" class="j-table-force-nowrap" :scroll="{x:1000}"
             :columns="columns" :dataSource="dataSource" :pagination="ipagination" :loading="loading"
             @change="handleTableChange">
      <template slot="content" slot-scope="text,record">
        <span v-if="text != null && text != '' && text != undefined">
          <div v-for="(item,index) in text.split(';')" v-if="item != null && item != '' && item != undefined">
            <a-tag color="#2db7f5">
              {{item}}
            </a-tag>
          </div>
        </span>
      </template>
    </a-table>
	</a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@api/manage'

export default {
		name: 'BasAutoModal',
		mixins: [JeecgListMixin],
    props:['projId'],
		components: {

		},
		data() {
			return {
        spans: {
          labelCol3: {span: 6},
          wrapperCol3: {span: 18},
        },
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
            title: '版本编号',
            align: "center",
            dataIndex: 'sort',
            width: 120,
          },
          {
            title: '变更环节',
            align: "center",
            dataIndex: 'type',
            width: 120,
          },
          {
            title: '立项人',
            align: "center",
            dataIndex: 'createUser_dictText',
            width: 120,
          },
          {
            title: '变更内容',
            align: "center",
            dataIndex: 'content',
            // scopedSlots: {
            //   customRender: 'content'
            // },
            ellipsis:true,
            width: 200,
          },
          {
            title: '变更金额',
            align: "center",
            dataIndex: 'changeAmount',
            width: 120,
          },
          {
            title: '变更时间',
            align: "center",
            dataIndex: 'updateTime',
            width: 120,
          },
        ],
				url: {
					list: "/srm/projChange/list",
					delete: "/srm/projBase/delete",
					deleteBatch: "/srm/projBase/deleteBatch",
					exportXlsUrl: "/srm/projChange/exportXls?projectId=" + this.projId,
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
        this.loading = true;
        params.projectId = this.projId;
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