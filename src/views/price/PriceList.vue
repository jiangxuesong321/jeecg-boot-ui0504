<template>
	<a-card :bordered="false">
		<div class="table-page-search-wrapper">
			<a-form layout="inline" @keyup.enter.native="searchQuery">
				<a-row :gutter="24">
					<a-col :span="6">
						<a-form-item label="物料编码" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
							<a-input placeholder="请输入物料编码" v-model="queryParam.projCode"></a-input>
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="物料名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
							<a-input placeholder="请输入物料名称" v-model="queryParam.projName"></a-input>
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
		<!-- 查询区域-END -->

		<!-- 操作按钮区域 -->
<!-- 		<div class="table-operator">
			<a-button type='primary' @click='searchQuery' icon='search'>查询</a-button>
			<a-button @click='searchReset' icon='reload' style='margin-left: 8px'>重置</a-button>
			<a-button type="primary" icon="download" @click="handleExportXls('proj_base')">导出</a-button>
		</div> -->

		<!-- table区域-begin -->
		<div>
<!-- 			<div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
				<i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a
					style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
				<a style="margin-left: 24px" @click="onClearSelected">清空</a>
			</div> -->

			<a-table ref="table" size="middle" :scroll="{x:true}" bordered rowKey="id" :columns="columns"
				:dataSource="dataSource" :pagination="ipagination" :loading="loading"
				:rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
				class="j-table-force-nowrap" @change="handleTableChange">
				<template slot="htmlSlot" slot-scope="text">
					<div v-html="text"></div>
				</template>
				<template slot="imgSlot" slot-scope="text,record">
					<span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
					<img v-else :src="getImgView(text)" :preview="record.id" height="25px" alt=""
						style="max-width:80px;font-size: 12px;font-style: italic;" />
				</template>
				<template slot="fileSlot" slot-scope="text">
					<span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
					<a-button v-else :ghost="true" type="primary" icon="download" size="small"
						@click="downloadFile(text)">
						下载
					</a-button>
				</template>
				<span slot="action" slot-scope="text, record">
					<a @click="handleHistoryPrice(record)">查看历史价格趋势</a>
				</span>
			</a-table>
		</div>

		<price-trend-modal ref="historyPriceForm" @ok="modalFormOk"></price-trend-modal>
	</a-card>
</template>

<script>
	import '@/assets/less/TableExpand.less'
	import {
		mixinDevice
	} from '@/utils/mixin'
	import {
		JeecgListMixin
	} from '@/mixins/JeecgListMixin'
	// import ProjBaseModal from './modules/ProjBaseModal.Style#Drawer'
	import {
		iegAmount
	} from '@/utils/util'
	import { billListMixin } from '../mixins/billListMixin'
	import { billModalMixin } from '../mixins/billModalMixin'
	import PriceTrendModal from './modules/PriceTrendModal'
	export default {
		name: 'PriceList',
		mixins: [JeecgListMixin, mixinDevice, billListMixin, billModalMixin],
		components: {
			PriceTrendModal
		},
		data() {
			return {
				description: '设备价格页面',
				// 表头
				columns: [{
						title: '#',
						dataIndex: '',
						key: 'rowIndex',
						width: 60,
						align: "center",
						customRender: function(t, r, index) {
							return parseInt(index) + 1;
						}
					},
					{
						title: '物料编码',
						align: "center",
						dataIndex: 'productCode'
					},
					{
						title: '物料名称',
						//align: "center",
						dataIndex: 'productName',
						customRender: (value, row, index) => { //表体的数据列样式
							const obj = {
						  children: value,
								attrs: {},
							};
							obj.attrs.align = 'left';
							return obj;
						}
					},
					{
						title: '单位',
						align: "center",
						dataIndex: 'unitName'
					},
					{
						title: '成交最高价(元)',
						align: "center",
						dataIndex: 'highPrice'
					},

					{
						title: '成交最低价(元)',
						align: "center",
						dataIndex: 'lowPrice'
					},
					{
						title: '历史平均价(元)',
						align: "center",
						dataIndex: 'historyPrice'
					},
					{
						title: '最近合同价格(元)',
						align: "center",
						dataIndex: 'newPrice',
					},
					{
						title: '操作',
						dataIndex: 'action',
						align: "center",
						fixed: "right",
						width: 147,
						scopedSlots: {
							customRender: 'action'
						}
					}
				],
				url: {
					list: "/srm/price/list",
					delete: "/srm/price/delete",
					deleteBatch: "/srm/price/deleteBatch",
					exportXlsUrl: "/srm/price/exportXls",
					importExcelUrl: "srm/price/importExcel",

				},
				disableMixinCreated: true,
				dictOptions: {},
				superFieldList: [],
				dataSource: [
					{productCode:'2022062028',productName:'切割机',unitName:'台',highPrice:'10,000.00',lowPrice:'8,000.00',historyPrice:'8,500.00',newPrice:'9,000.00'},
					{productCode:'2021031018',productName:'火炉',unitName:'台',highPrice:'2,000.00',lowPrice:'1,000.00',historyPrice:'1,800.00',newPrice:'1,500.00'},
					{productCode:'2022051510',productName:'振金',unitName:'台',highPrice:'500.00',lowPrice:'400.00',historyPrice:'460.00',newPrice:'420.00'},
				]
			}
		},
		created() {
			this.getSuperFieldList();
		},
		computed: {
			importExcelUrl: function() {
				return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
			},
		},
		methods: {
			handleHistoryPrice(record) {
				this.$refs.historyPriceForm.edit(record);
			},
			initDictConfig() {},
			getSuperFieldList() {
				let fieldList = [];
				fieldList.push({
					type: 'string',
					value: 'projId',
					text: '项目ID'
				})
				fieldList.push({
					type: 'string',
					value: 'projName',
					text: '项目名称'
				})
				fieldList.push({
					type: 'string',
					value: 'projCode',
					text: '项目编码'
				})
				fieldList.push({
					type: 'string',
					value: 'projType',
					text: '项目类别'
				})
				fieldList.push({
					type: 'string',
					value: 'projDescription',
					text: '项目简介'
				})
				fieldList.push({
					type: 'string',
					value: 'projBackground',
					text: '项目背景'
				})
				fieldList.push({
					type: 'date',
					value: 'projInitiationDate',
					text: '项目立项日期'
				})
				fieldList.push({
					type: 'string',
					value: 'applyOrgId',
					text: '申请部门ID'
				})
				fieldList.push({
					type: 'string',
					value: 'projStatus',
					text: '项目状态 '
				})
				fieldList.push({
					type: 'string',
					value: 'comment',
					text: '备注'
				})
				fieldList.push({
					type: 'int',
					value: 'sort',
					text: '排序'
				})
				fieldList.push({
					type: 'string',
					value: 'tenantId',
					text: '租户ID'
				})
				fieldList.push({
					type: 'string',
					value: 'delFlag',
					text: '删除标志位'
				})
				fieldList.push({
					type: 'string',
					value: 'createUser',
					text: '创建人'
				})
				fieldList.push({
					type: 'string',
					value: 'updateUser',
					text: '更新人'
				})
				fieldList.push({
					type: 'string',
					value: 'projectManager',
					text: '项目经理'
				})
				fieldList.push({
					type: 'string',
					value: 'applyUserId',
					text: '申请人ID'
				})
				fieldList.push({
					type: 'string',
					value: 'applyUserName',
					text: '申请人名称'
				})
				fieldList.push({
					type: 'string',
					value: 'applyOrgName',
					text: '申请部门名称'
				})
				fieldList.push({
					type: 'number',
					value: 'budgetAmount',
					text: '预算金额'
				})
				fieldList.push({
					type: 'number',
					value: 'freezeAmount',
					text: '冻结金额'
				})
				fieldList.push({
					type: 'number',
					value: 'usedAmount',
					text: '已用金额'
				})
				this.superFieldList = fieldList
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