<template>
	<a-card :bordered="false">
		<div class="card-title">
			专家列表
		</div>
		<a-tabs v-model:activeKey="activeKey" @change="handleChange">
			<a-tab-pane key="0" tab="技术专家"></a-tab-pane>
			<a-tab-pane key="1" tab="商务专家"></a-tab-pane>
		</a-tabs>
		<!-- 查询区域 -->
		<div class="table-page-search-wrapper">
			<a-form layout="inline" @keyup.enter.native="searchQuery">
				<a-row :gutter="24">
					<a-col :xl="6" :lg="7" :md="8" :sm="24">
						<a-form-item label="姓名">
							<j-input placeholder="请输入姓名" v-model="queryParam.nickName"></j-input>
						</a-form-item>
					</a-col>
					<a-col :xl="6" :lg="7" :md="8" :sm="24">
						<a-form-item label="员工号">
							<j-input placeholder="请输入员工号" v-model="queryParam.code"></j-input>
						</a-form-item>
					</a-col>
					<a-col :xl="6" :lg="7" :md="8" :sm="24">
						<a-form-item label="部门">
							<j-input placeholder="请输入部门" v-model="queryParam.department"></j-input>
						</a-form-item>
					</a-col>
					<a-col :xl="6" :lg="7" :md="8" :sm="24">
						<a-form-item label="账号状态">
							<j-dict-select-tag type="select" v-model="queryParam.isEnabled" dictCode="dict_item_status"
								placeholder="请选择账号状态" />
						</a-form-item>
					</a-col>

					<a-col :xl="6" :lg="7" :md="8" :sm="24">
						<span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
							<a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
							<a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置
							</a-button>
						</span>
					</a-col>
				</a-row>
			</a-form>
		</div>
		<!-- 查询区域-END -->

		<!-- 操作按钮区域 -->
		<div>
			<!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
			<list-columns-setter v-model="columns" :def-columns="columns" style="float: right;z-index:999" />
		</div>

		<!-- table区域-begin -->
		<div>
			<a-table ref="table" size="middle" :scroll="{x:true, y:500}" bordered rowKey="id" :columns="columns"
				:dataSource="dataSource" :pagination="ipagination" :loading="loading"
				@change="handleTableChange">


				<span slot="action" slot-scope="text, record">
					<a @click="handleEdit(record)">编辑</a>

					<a-divider type="vertical" />
<!--          <a-popconfirm title="确定启用吗?" @confirm="() => handleEnable(record)" v-if="record.isEnabled == '0'">-->
<!--            <a>启用</a>-->
<!--          </a-popconfirm>-->
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDisable(record)" v-if="record.isEnabled == '1'">
            <a>删除</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a @click="handleBidding(record)">评标记录</a>
				</span>
			</a-table>
			<div :style="dataSource != null && dataSource.length > 0 ? 'z-index:99;margin-top:-43px;' : 'z-index:99;margin-top:10px;'">
				<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
				<a-button type="primary" icon="download" @click="handleExportXls('专家列表')" style="margin-left:8px;">导出</a-button>
			</div>
		</div>

		<bas-professionals-modal ref="modalForm" @ok="modalFormOk" :activeKey="activeKey"></bas-professionals-modal>
    <bidding-record-modal ref="modal"></bidding-record-modal>
	</a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import BasProfessionalsModal from './modules/BasProfessionalsModal'
import { putAction } from '@api/manage'
import ListColumnsSetter from '@views/components/ListColumnsSetter'
import BiddingRecordModal from '@views/base/modules/BiddingRecordModal'

export default {
		name: 'BasProfessionalsList',
		mixins: [JeecgListMixin, mixinDevice],
		components: {
			BasProfessionalsModal,
			ListColumnsSetter,
      BiddingRecordModal
		},
		data() {
			return {
				queryParam: {
					userCategory: '0'
				},
				activeKey: '0',
				description: '专家列表管理页面',
				// 表头
				columns: [{
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
						title: '员工号',
						align: "center",
						dataIndex: 'code',
						width: 140,
            sorter: true,
					},
					{
						title: '姓名',
						align: "center",
						dataIndex: 'nickName',
						width: 140,
            sorter: true,
					},
          {
            title: '公司',
            align: "center",
            dataIndex: 'company',
            width: 140,
            sorter: true,
          },
					{
						title: '部门',
						align: "center",
						dataIndex: 'department',
            sorter: true,
						width: 140,
					},
					// {
					// 	title: '邮箱',
					// 	align: "center",
					// 	dataIndex: 'email',
					// 	width: 120,
					// },
					{
						title: '账号状态',
						align: "center",
						dataIndex: 'isEnabled',
            sorter: true,
						customRender: (text) => (text == '1' ? '启用' : '禁用'),
						width: 100,
					},
					{
						title: '操作',
						dataIndex: 'action',
						align: "center",
						width: 100,
						scopedSlots: {
							customRender: 'action'
						}
					}
				],
				url: {
					list: "/srm/basProfessionals/list",
					delete: "/srm/basProfessionals/delete",
					deleteBatch: "/srm/basProfessionals/deleteBatch",
					exportXlsUrl: "/srm/basProfessionals/exportXls",
					importExcelUrl: "srm/basProfessionals/importExcel",

				},
				dictOptions: {},
				superFieldList: [],
			}
		},
		created() {
			this.$set(this.dictOptions, 'isEnabled', [{
				text: '是',
				value: 'Y'
			}, {
				text: '否',
				value: 'N'
			}])
		},
		computed: {
			importExcelUrl: function() {
				return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
			},
		},
		methods: {
      handleBidding(record){
        this.$refs.modal.edit(record);
      },
			searchReset() {
				this.queryParam = {};
				this.queryParam.userCategory = this.activeKey;
				this.loadData(1);
			},
			handleDisable(record) {
				let url = "/srm/basProfessionals/edit";
				let row = JSON.parse(JSON.stringify(record));
				row.isEnabled = '0';
				putAction(url, row).then(res => {
					if (res.success) {
						this.$message.success('提交成功');
						this.searchQuery();
					} else {
						this.$message.error('提交失败');
					}
				})
			},
			handleEnable(record) {
				let url = "/srm/basProfessionals/edit";
				let row = JSON.parse(JSON.stringify(record));
				row.isEnabled = '1';
				putAction(url, row).then(res => {
					if (res.success) {
						this.$message.success('提交成功');
						this.searchQuery();
					} else {
						this.$message.error('提交失败');
					}
				})
			},
			handleChange(tabKey) {
				if (tabKey == '0') {
					this.queryParam.userCategory = '0';
				} else if (tabKey == '1') {
					this.queryParam.userCategory = '1';
				}
				this.searchQuery();
			},
		}
	}
</script>
<style scoped>
	@import '~@assets/less/common.less';
</style>
