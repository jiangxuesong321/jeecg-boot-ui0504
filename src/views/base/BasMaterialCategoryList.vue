<template>
	<a-card :bordered="false">
		<!-- 查询区域 -->
		<div class="card-title">
			物料分类
		</div>
		<div class="table-page-search-wrapper">
			<a-form layout="inline" @keyup.enter.native="searchQuery">
				<a-row :gutter="24">
					<a-col :xl="6" :lg="7" :md="8" :sm="24">
						<a-form-item label="分类">
							<j-input placeholder="请输入分类" v-model="queryParam.name"></j-input>
						</a-form-item>
					</a-col>
					<a-col :xl="6" :lg="7" :md="8" :sm="24">
						<a-form-item label="编码">
							<j-input placeholder="请输入编码" v-model="queryParam.code"></j-input>
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
		<div class="table-operator">
			<list-columns-setter v-model="columns" :def-columns="columns" style="float: right;z-index:999" />
		</div>

		<!-- table区域-begin -->
		<div>
			<!--      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->

			<a-table ref="table" size="middle" rowKey="id" :scroll="{x:true, y:500}"
				:columns="columns" :dataSource="dataSource" :pagination="ipagination" :loading="loading"
				:expandedRowKeys="expandedRowKeys" @change="handleTableChange" @expand="handleExpand"
				v-bind="tableProps" bordered>

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
          <a @click="handleAddChild(record)">新增子类</a>
					<a-divider type="vertical" />
					<a @click="handleEdit(record)">编辑</a>
					<a-divider type="vertical" />
					<a @click="handleDeleteNode(record.id)">删除</a>
<!-- 					<a-dropdown>
						<a class="ant-dropdown-link">更多
							<a-icon type="down" />
						</a>
						<a-menu slot="overlay">
							<a-menu-item>
								<a @click="handleAddChild(record)">添加下级</a>
							</a-menu-item>
							<a-menu-item>
								<a-popconfirm title="确定删除吗?" @confirm="() => handleDeleteNode(record.id)"
									placement="topLeft">
									<a>删除</a>
								</a-popconfirm>
							</a-menu-item>
						</a-menu>
					</a-dropdown> -->
				</span>
			</a-table>
			<div class="table-operator" style="z-index:99;margin-top:-40px;">
				<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
			</div>
		</div>

		<basMaterialCategory-modal ref="modalForm" @ok="modalFormOk"></basMaterialCategory-modal>
	</a-card>
</template>

<script>
import {
  getAction,
  deleteAction, putAction
} from '@/api/manage'
	import {
		JeecgListMixin
	} from '@/mixins/JeecgListMixin'
	import BasMaterialCategoryModal from './modules/BasMaterialCategoryModal'
	import {
		filterMultiDictText
	} from '@/components/dict/JDictSelectUtil'
	import {
		filterObj
	} from '@/utils/util';
	import ListColumnsSetter from '@views/components/ListColumnsSetter'

	export default {
		name: "BasMaterialCategoryList",
		mixins: [JeecgListMixin],
		components: {
			BasMaterialCategoryModal,
			ListColumnsSetter
		},
		data() {
			return {
				description: '物料分类管理页面',
				// 表头
				columns: [{
						title: '名称',
						dataIndex: 'name',
						width:140,
            // align:'center',
            sorter: true,
					},
					{
						title: '编码',
						dataIndex: 'code',
						width:120,
            align:'center',
            sorter: true,
					},
					// {
					//   title:'全名',
					//   align:"left",
					//   dataIndex: 'fullname'
					// },
					// {
					//   title:'是否启用',
					//   align:"left",
					//   dataIndex: 'isEnabled',
					//   customRender: (text) => (!text ? "" : (text == "1" ? "是" : "否"))
					// },
					{
						title: '创建时间',
						dataIndex: 'createTime',
						width:120,
            align:'center',
            sorter: true,
					},
					{
						title: '操作',
						dataIndex: 'action',
            align:'center',
						//fixed: "right",
						//width: 165,
						width:147,
						scopedSlots: {
							customRender: 'action'
						},
					}
				],
				url: {
					list: "/srm/basMaterialCategory/rootList",
					childList: "/srm/basMaterialCategory/childList",
					getChildListBatch: "/srm/basMaterialCategory/getChildListBatch",
					delete: "/srm/basMaterialCategory/delete",
					deleteBatch: "/srm/basMaterialCategory/deleteBatch",
					exportXlsUrl: "/srm/basMaterialCategory/exportXls",
					importExcelUrl: "srm/basMaterialCategory/importExcel",
				},
				expandedRowKeys: [],
				hasChildrenField: "hasChild",
				pidField: "pid",
				dictOptions: {},
				loadParent: false,
				superFieldList: [],
				isorter: {
					column: 'createTime',
					order: 'asc',
				},
			}
		},
		created() {
			this.getSuperFieldList();
		},
		computed: {
			importExcelUrl() {
				return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
			},
			tableProps() {
				let _this = this
				return {
					// 列表项是否可选择
/* 					rowSelection: {
						selectedRowKeys: _this.selectedRowKeys,
						onChange: (selectedRowKeys) => _this.selectedRowKeys = selectedRowKeys
					} */
				}
			}
		},
		methods: {
			loadData(arg) {
				if (arg == 1) {
					this.ipagination.current = 1
				}
				this.loading = true
				let params = this.getQueryParams()
				params.hasQuery = 'false'
				getAction(this.url.list, params).then(res => {
					if (res.success) {
						let result = res.result
						if (Number(result.total) > 0) {
							this.ipagination.total = Number(result.total)
							this.dataSource = this.getDataByResult(res.result.records)
							return this.loadDataByExpandedRows(this.dataSource)
						} else {
							this.ipagination.total = 0
							this.dataSource = []
						}
					} else {
						this.$message.warning(res.message)
					}
				}).finally(() => {
					this.loading = false
				})
			},
			// 根据已展开的行查询数据（用于保存后刷新时异步加载子级的数据）
			loadDataByExpandedRows(dataList) {
				if (this.expandedRowKeys.length > 0) {
					return getAction(this.url.getChildListBatch, {
						parentIds: this.expandedRowKeys.join(',')
					}).then(res => {
						if (res.success && res.result.records.length > 0) {
							//已展开的数据批量子节点
							let records = res.result.records
							const listMap = new Map();
							for (let item of records) {
								let pid = item[this.pidField];
								if (this.expandedRowKeys.join(',').includes(pid)) {
									let mapList = listMap.get(pid);
									if (mapList == null) {
										mapList = [];
									}
									mapList.push(item);
									listMap.set(pid, mapList);
								}
							}
							let childrenMap = listMap;
							let fn = (list) => {
								if (list) {
									list.forEach(data => {
										if (this.expandedRowKeys.includes(data.id)) {
											data.children = this.getDataByResult(childrenMap.get(data
												.id))
											fn(data.children)
										}
									})
								}
							}
							fn(dataList)
						}
					})
				} else {
					return Promise.resolve()
				}
			},
			getQueryParams(arg) {
				//获取查询条件
				let sqp = {}
				let param = {}
				if (this.superQueryParams) {
					sqp['superQueryParams'] = encodeURI(this.superQueryParams)
					sqp['superQueryMatchType'] = this.superQueryMatchType
				}
				if (arg) {
					param = Object.assign(sqp, this.isorter, this.filters);
				} else {
					param = Object.assign(sqp, this.queryParam, this.isorter, this.filters);
				}
				if (JSON.stringify(this.queryParam) === "{}" || arg) {
					param.hasQuery = 'false'
				} else {
					param.hasQuery = 'true'
				}
				param.field = this.getQueryField();
				param.pageNo = this.ipagination.current;
				param.pageSize = this.ipagination.pageSize;
				return filterObj(param);
			},
			searchReset() {
				//重置
				this.expandedRowKeys = []
				this.queryParam = {}
				this.loadData(1);
			},
			getDataByResult(result) {
				if (result) {
					return result.map(item => {
						//判断是否标记了带有子节点
						if (item[this.hasChildrenField] == '1') {
							let loadChild = {
								id: item.id + '_loadChild',
								name: 'loading...',
								isLoading: true
							}
							item.children = [loadChild]
						}
						return item
					})
				}
			},
			handleExpand(expanded, record) {
				// 判断是否是展开状态
				if (expanded) {
					this.expandedRowKeys.push(record.id)
					if (record.children.length > 0 && record.children[0].isLoading === true) {
						let params = this.getQueryParams(1); //查询条件
						params[this.pidField] = record.id
						params.hasQuery = 'false'
						params.superQueryParams = ""
						getAction(this.url.childList, params).then((res) => {
							if (res.success) {
								if (res.result.records) {
									record.children = this.getDataByResult(res.result.records)
									this.dataSource = [...this.dataSource]
								} else {
									record.children = ''
									record.hasChildrenField = '0'
								}
							} else {
								this.$message.warning(res.message)
							}
						})
					}
				} else {
					let keyIndex = this.expandedRowKeys.indexOf(record.id)
					if (keyIndex >= 0) {
						this.expandedRowKeys.splice(keyIndex, 1);
					}
				}
			},
			handleAddChild(record) {
				this.loadParent = true
				let obj = {}
				obj[this.pidField] = record['id'];
				this.$refs.modalForm.add(obj);
			},
			handleDeleteNode(id) {
				let that = this;
        that.$confirm({
          title: "",
          content: "是否确认提交?",
          onOk: function () {
            deleteAction(that.url.delete, {
              id: id
            }).then((res) => {
              if (res.success) {
                that.loadData(1)
              } else {
                that.$message.warning(res.message);
              }
            });
          }
        });

			},
			batchDel() {
				if (this.selectedRowKeys.length <= 0) {
					this.$message.warning('请选择一条记录！');
					return false;
				} else {
					let ids = "";
					let that = this;
					that.selectedRowKeys.forEach(function(val) {
						ids += val + ",";
					});
					that.$confirm({
						title: "确认删除",
						content: "是否删除选中数据?",
						onOk: function() {
							that.handleDeleteNode(ids)
						}
					});
				}
			},
			getSuperFieldList() {
				let fieldList = [];
				fieldList.push({
					type: 'string',
					value: 'pid',
					text: '父节点',
					dictCode: ''
				})
				fieldList.push({
					type: 'switch',
					value: 'hasChild',
					text: '是否有子节点'
				})
				fieldList.push({
					type: 'string',
					value: 'code',
					text: '编码',
					dictCode: ''
				})
				fieldList.push({
					type: 'string',
					value: 'name',
					text: '名称',
					dictCode: ''
				})
				fieldList.push({
					type: 'string',
					value: 'fullname',
					text: '全名',
					dictCode: ''
				})
				fieldList.push({
					type: 'switch',
					value: 'isEnabled',
					text: '是否启用'
				})
				this.superFieldList = fieldList
			}
		}
	}
</script>
<style scoped>
	@import '~@assets/less/common.less';
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

	.ant-table {
		margin-top: 40px;
	}

  .ant-table-middle > .ant-table-content > .ant-table-header > table > .ant-table-thead > tr > th, .ant-table-middle > .ant-table-content > .ant-table-body > table > .ant-table-thead > tr > th, .ant-table-middle > .ant-table-content > .ant-table-scroll > .ant-table-header > table > .ant-table-thead > tr > th, .ant-table-middle > .ant-table-content > .ant-table-scroll > .ant-table-body > table > .ant-table-thead > tr > th, .ant-table-middle > .ant-table-content > .ant-table-fixed-left > .ant-table-header > table > .ant-table-thead > tr > th, .ant-table-middle > .ant-table-content > .ant-table-fixed-right > .ant-table-header > table > .ant-table-thead > tr > th, .ant-table-middle > .ant-table-content > .ant-table-fixed-left > .ant-table-body-outer > .ant-table-body-inner > table > .ant-table-thead > tr > th, .ant-table-middle > .ant-table-content > .ant-table-fixed-right > .ant-table-body-outer > .ant-table-body-inner > table > .ant-table-thead > tr > th, .ant-table-middle > .ant-table-content > .ant-table-header > table > .ant-table-tbody > tr > td, .ant-table-middle > .ant-table-content > .ant-table-body > table > .ant-table-tbody > tr > td, .ant-table-middle > .ant-table-content > .ant-table-scroll > .ant-table-header > table > .ant-table-tbody > tr > td, .ant-table-middle > .ant-table-content > .ant-table-scroll > .ant-table-body > table > .ant-table-tbody > tr > td, .ant-table-middle > .ant-table-content > .ant-table-fixed-left > .ant-table-header > table > .ant-table-tbody > tr > td, .ant-table-middle > .ant-table-content > .ant-table-fixed-right > .ant-table-header > table > .ant-table-tbody > tr > td, .ant-table-middle > .ant-table-content > .ant-table-fixed-left > .ant-table-body-outer > .ant-table-body-inner > table > .ant-table-tbody > tr > td, .ant-table-middle > .ant-table-content > .ant-table-fixed-right > .ant-table-body-outer > .ant-table-body-inner > table > .ant-table-tbody > tr > td{
    padding: 12px 0px !important;
  }
</style>