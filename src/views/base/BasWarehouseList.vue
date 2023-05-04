<template>
	<a-card :bordered="false">
		<!-- 查询区域 -->
		<div class="card-title">
			仓库管理
		</div>
		<div class="table-page-search-wrapper">
			<a-form layout="inline" @keyup.enter.native="searchQuery">
				<a-row :gutter="24">
					<a-col :xl="6" :lg="7" :md="8" :sm="24">
						<a-form-item label="仓库编码">
							<a-input placeholder="请输入仓库编码" v-model="queryParam.code"></a-input>
						</a-form-item>
					</a-col>
					<a-col :xl="6" :lg="7" :md="8" :sm="24">
						<a-form-item label="厂区名称">
							<a-input placeholder="请输入厂区名称" v-model="queryParam.name"></a-input>
						</a-form-item>
					</a-col>
					<a-col :xl="6" :lg="7" :md="8" :sm="24">
						<a-form-item label="是否启用">
							<j-dict-select-tag type="select" v-model="queryParam.isEnabled" dictCode="dict_item_status"
								placeholder="请选择是否启用" />
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
		<!--    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
    </div> -->
		<div class="table-operator">
			<list-columns-setter v-model="columns" :def-columns="columns" style="float: right;z-index:999" />
		</div>
		<!-- table区域-begin -->
		<div>

			<a-table ref="table" size="middle" :scroll="{x:true}" bordered rowKey="id" :columns="columns"
				:dataSource="dataSource" :pagination="ipagination" :loading="loading" class="j-table-force-nowrap"
				@change="handleTableChange">


				<span slot="action" slot-scope="text, record">
					<a @click="handleEdit(record)">编辑</a>

					<a-divider type="vertical" />
					<a-dropdown>
						<a class="ant-dropdown-link">更多
							<a-icon type="down" />
						</a>
						<a-menu slot="overlay">
							<a-menu-item>
								<a @click="handleDetail(record)">详情</a>
							</a-menu-item>
							<a-menu-item v-if="record.isEnabled == '0'">
								<a-popconfirm title="确定启用吗?" @confirm="() => handleEnable(record)">
									<a>启用</a>
								</a-popconfirm>
							</a-menu-item>
							<a-menu-item v-if="record.isEnabled == '1'">
								<a-popconfirm title="确定禁用吗?" @confirm="() => handleDisable(record)">
									<a>禁用</a>
								</a-popconfirm>
							</a-menu-item>
              <a-menu-item>
								<a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
									<a>删除</a>
								</a-popconfirm>
							</a-menu-item>
						</a-menu>
					</a-dropdown>
				</span>
			</a-table>
			<div :style="dataSource != null && dataSource.length > 0 ? 'z-index:99;margin-top:-43px;' : 'z-index:99;margin-top:10px;'">
				<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
			</div>
		</div>

		<bas-warehouse-modal ref="modalForm" @ok="modalFormOk"></bas-warehouse-modal>
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
	import BasWarehouseModal from './modules/BasWarehouseModal'
	import {
		putAction
	} from '@api/manage'
	import ListColumnsSetter from '@views/components/ListColumnsSetter'
	import Vue from 'vue'
	import Sortable from 'sortablejs'
	let columns = [
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
			title: '仓库编码',
			align: "center",
			dataIndex: 'code',
			width: 120,
      sorter: true,
		},
		{
			title: '地区',
			align: "center",
			dataIndex: 'area_dictText',
			width: 180,
      sorter: true,
		},
    {
      title: '厂区',
      align: "center",
      dataIndex: 'name',
      width: 180,
      sorter: true,
    },
    {
      title: '种类数',
      dataIndex: 'countNum',
      width: 120,
      sorter: true,
      customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
        const obj = {
          children: value,
          attrs: {},
        };
        obj.attrs.align = 'center';//控制表体内容居右
        return obj;
      }
    },
    {
      title: '台套数',
      dataIndex: 'qty',
      sorter: true,
      width: 120,
      customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
        const obj = {
          children: value,
          attrs: {},
        };
        obj.attrs.align = 'center';//控制表体内容居右
        return obj;
      }
    },
		{
			title: '是否启用',
			align: "center",
      sorter: true,
			dataIndex: 'isEnabled',
			customRender: (text) => (text == '1' ? '启用' : '禁用'),
			width: 120,
		},
		{
			title: '备注',
			align: "center",
			dataIndex: 'remark',
			width: 200,
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
	];
	const draggingMap = {};
	columns.forEach(col => {
		draggingMap[col.key] = col.width;
	});
	const draggingState = Vue.observable(draggingMap);
	const ResizeableTitle = (h, props, children) => {
		let thDom = null;
		const {
			key,
			...restProps
		} = props;
		const col = columns.find(col => {
			const k = col.dataIndex || col.key;
			return k === key;
		});
		if (!col.width) {
			return h('th', {
				...restProps
			}, [
				children
			])
		}
		const onDrag = x => {
			draggingState[key] = 0;
			col.width = Math.max(x, 1);
		};
		const onDragstop = () => {
			draggingState[key] = thDom.getBoundingClientRect().width;
		};
		return (
			h('th', {
				...restProps,
				attrs: {
					width: col.width,
				},
				'v-ant-ref': r => (thDom = r),
				class: 'resize-table-th'
			}, [
				children,
				h('vue-draggable-resizable', {
					class: 'table-draggable-handle',
					on: {
						dragging: onDrag,
						dragstop: onDragstop
					},
					key: col.key,
					props: {
						w: 10,
						x: draggingState[key] || col.width,
						z: 1000,
						axis: 'x',
						resizable: false,
					}
				})
			])
		);
	};
	export default {
		name: 'BasWarehouseList',
		mixins: [JeecgListMixin, mixinDevice],
		components: {
			BasWarehouseModal,
			ListColumnsSetter
		},
		data() {
			return {
				description: '仓库管理页面',
				columns,
				url: {
					list: "/srm/basWarehouse/list",
					delete: "/srm/basWarehouse/delete",
					deleteBatch: "/srm/basWarehouse/deleteBatch",
					exportXlsUrl: "/srm/basWarehouse/exportXls",
					importExcelUrl: "srm/basWarehouse/importExcel",

				},
				dictOptions: {},
				superFieldList: [],
			}
		},
		created() {},
		computed: {
			importExcelUrl: function() {
				return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
			},
		},
		mounted() {
		  this.columnsDrop()
		},
		methods: {
			columnsDrop() {
			  const wrapperTr = document.querySelector('.ant-table-thead tr')
			  this.sortable = Sortable.create(wrapperTr, {
			    animation: 180,
			    delay: 0,
			    handle: '.ant-table-header-column', //~~可进行拖拽对应的类名~~~~~~
			    onEnd: evt => {
			      const oldItem = this.columns[evt.oldIndex]
			      this.columns.splice(evt.oldIndex, 1)
			      this.columns.splice(evt.newIndex, 0, oldItem)
			      console.log(this.columns)
			      /**
			       此处是因为在拖拽后，内容排序正常，表头错乱的问题 ---强制进行了重新渲染
			       **/
			      this.key += 1;
			      this.$nextTick(() => {
			        this.columnsDrop();
			      });
			    }
			  })
			},
			handleDisable(record) {
				let url = "/srm/basWarehouse/edit";
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
				let url = "/srm/basWarehouse/edit";
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
		}
	}
</script>
<style scoped>
	@import '~@assets/less/common.less';
</style>
<style>


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
</style>
