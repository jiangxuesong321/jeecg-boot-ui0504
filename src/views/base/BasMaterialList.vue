<template>
	<a-card :bordered="false">
		<!-- 查询区域 -->
		<div class="card-title">
			物料管理
		</div>
		<div class="table-page-search-wrapper">
			<a-form layout="inline" @keyup.enter.native="searchQuery">
				<a-row :gutter="24">
					<a-col :xl="6" :lg="7" :md="8" :sm="24">
						<a-form-item label="物料名称">
							<a-input placeholder="请输入物料名称" v-model="queryParam.name"></a-input>
						</a-form-item>
					</a-col>
					<a-col :xl="6" :lg="7" :md="8" :sm="24">
						<a-form-item label="物料编码">
							<a-input placeholder="请输入物料编码" v-model="queryParam.code"></a-input>
						</a-form-item>
					</a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="产地">
              <j-input placeholder="请输入产地" v-model="queryParam.country"></j-input>
            </a-form-item>
          </a-col>
					<a-col :xl="6" :lg="7" :md="8" :sm="24">
						<span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
							<a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
							<a-button type="dashed" @click="searchReset" icon="reload" style="margin-left: 8px">重置
							</a-button>
						</span>
					</a-col>
				</a-row>
			</a-form>
		</div>
		<!-- 查询区域-END -->

		<!-- 操作按钮区域 -->
		<div class="table-operator">
			<list-columns-setter v-model="columns" :def-columns="columns" style="float: right;" />
		</div>

		<!-- table区域-begin -->
		<div>
			<a-table ref="table" size="middle" :scroll="{x:1000, y:500}" rowKey="id" :key="key"
				:columns="columns" :dataSource="dataSource" :pagination="ipagination" :loading="loading"
               :components="components" @change="handleTableChange" bordered>

        <div
          slot="filterDropdown"
          slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
          style="padding: 8px"
        >

          <a-input
            v-model="columnParam[column.dataIndex]"
            :placeholder="`Search ${column.dataIndex}`"
            style="width: 188px; margin-bottom: 8px; display: block;"
          />
          <a-button
            type="primary"
            icon="search"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
          >
            查询
          </a-button>
          <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters,selectedKeys, confirm, column.dataIndex,setSelectedKeys)">
            重置
          </a-button>
        </div>

        <a-icon
          slot="filterIcon"
          slot-scope="filtered,column"
          type="search"
          :style="{ color: columnParam[column.dataIndex] ? '#108ee9' : undefined }">
        </a-icon>


				<template slot="categoryId" slot-scope="text,record">
					<a-cascader v-model="record.categoryIds" :options="options" placeholder="请输入分类名称" style="width: 80%"
						:allowClear="false" disabled />
				</template>
				<span slot="action" slot-scope="text, record">
					<a @click="handleEdit(record)">编辑</a>
					<a-divider type="vertical" />
					<a style="margin-right: 10px" @click="openModel(record,'1')">历史采购明细</a>
				</span>
			</a-table>
			<div class="table-operator" :style="dataSource != null && dataSource.length > 0 ? 'z-index:99;margin-top:-43px;' : 'z-index:99;margin-top:10px;'">
				<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
				<a-button type="primary" icon="download" @click="handleExportXls('物料管理')">导出</a-button>
				<a-button type="primary" icon="download" @click="handleExportDemo('物料模板')">模板下载</a-button>
				<a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader"
					:action="importExcelUrl" @change="handleImportExcel">
					<a-button type="primary" icon="import">导入</a-button>
				</a-upload>
			</div>
		</div>

		<bas-material-modal ref="modalForm" @ok="modalFormOk"></bas-material-modal>
		<bas-material-info ref="modelDrawer"></bas-material-info>
	</a-card>
</template>

<script>
import Vue from 'vue'
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import BasMaterialModal from './modules/BasMaterialModal'
import VueDraggableResizable from 'vue-draggable-resizable'
import Sortable from 'sortablejs'
import ListColumnsSetter from '@views/components/ListColumnsSetter'
import BasMaterialInfo from '@views/base/modules/BasMaterialInfo'

  let searchInput = null;
  let filteredInfo = {
    code:''
  };
  let columns = [
	  {
			title: '序号',
			dataIndex: 'rowIndex',
      align: "center",
			width: 120,
			customRender: function(t, r, index) {
				return parseInt(index) + 1;
			}
      // customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
      //   const obj = {
      //     children: parseInt(index) + 1,
      //     attrs: {},
      //   };
      //   obj.attrs.align = 'right';//控制表体内容居右
      //   return obj;
      // }
		},
		{
			title: '物料编码',
			align: "center",
			dataIndex: 'code',
      key: 'code',
			width: 180,
      sorter: true,
      // filteredValue:[filteredInfo.code],
      scopedSlots: {
        filterDropdown: 'filterDropdown',
        filterIcon: 'filterIcon',
        customRender: 'customRender',
      },
      onFilter: (value, record) =>
        record.code
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: visible => {
        if (visible) {

        }
      },
    },
		{
			title: '物料名称',
			align: "center",
			dataIndex: 'name',
      sorter: true,
			width: 180,
      ellipsis:true,
      scopedSlots: {
        filterDropdown: 'filterDropdown',
        filterIcon: 'filterIcon',
        customRender: 'customRender',
      },
      onFilter: (value, record) =>
        record.name
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: visible => {
        if (visible) {

        }
      },
		},
		{
			title: '产品类别',
			align: "center",
      sorter: true,
			dataIndex: 'model_dictText',
			width: 180,
      scopedSlots: {
        filterDropdown: 'filterDropdown',
        filterIcon: 'filterIcon',
        customRender: 'customRender',
      },
      onFilter: (value, record) =>
        record.model_dictText
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: visible => {
        if (visible) {

        }
      },
		},
		// {
		//   title:'单位',
		//   align:"center",
		//   dataIndex: 'unit'
		// },
    {
      title: '规格型号',
      dataIndex: 'speType',
      sorter: true,
      align: "center",
      width: 180,
      ellipsis:true,
      scopedSlots: {
        filterDropdown: 'filterDropdown',
        filterIcon: 'filterIcon',
        customRender: 'customRender',
      },
      onFilter: (value, record) =>
        record.name
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: visible => {
        if (visible) {

        }
      },
    },
    {
      title: '产地',
      dataIndex: 'country',
      sorter: true,
      align: "center",
      width: 180,
      ellipsis:true,
      scopedSlots: {
        filterDropdown: 'filterDropdown',
        filterIcon: 'filterIcon',
        customRender: 'customRender',
      },
      onFilter: (value, record) =>
        record.name
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: visible => {
        if (visible) {

        }
      },
    },
		{
			title: '已采购台套数',
			dataIndex: 'qty',
			width: 100,
      align: "center",
      customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
        const obj = {
          children: value,
          attrs: {},
        };
        // obj.attrs.align = 'right';//控制表体内容居右
        return obj;
      }
		},
		{
			title: '物料类型',
			align: "center",
			dataIndex: 'categoryName',
      sorter: true,
			// scopedSlots: { customRender: 'categoryId' }
			width: 260,
      scopedSlots: {
        filterDropdown: 'filterDropdown',
        filterIcon: 'filterIcon',
        customRender: 'customRender',
      },
      onFilter: (value, record) =>
        record.categoryName
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: visible => {
        if (visible) {

        }
      },
		},
		{
			title: '操作',
			dataIndex: 'action',
			align: "center",
			width: 147,
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
		name: 'BasMaterialList',
		mixins: [JeecgListMixin, mixinDevice],
		components: {
			BasMaterialModal,
			VueDraggableResizable,
			Sortable,
			ListColumnsSetter,
			BasMaterialInfo
		},
		data() {
			this.components = {
				header: {
					cell: ResizeableTitle,
				},
			};
			return {
        columnParam:{},
        filteredInfo,
        searchedColumn:'',
        searchInput,
        searchText:"",
				columns,
				key: 0,
				options: [],
				isorter: {
					column: 'code',
					order: 'asc',
				},
				description: '物料管理管理页面',
				url: {
					list: "/srm/basMaterial/list",
					delete: "/srm/basMaterial/delete",
					deleteBatch: "/srm/basMaterial/deleteBatch",
					exportXlsUrl: "/srm/basMaterial/exportXls",
					importExcelUrl: "srm/basMaterial/importExcel",

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
		mounted() {
			this.columnsDrop(),
				this.getFilterOptions()
		},
		methods: {
      searchReset() {
        this.searchText = "";
        this.searchedColumn = "";
        this.columnParam = {};
        this.queryParam = {};
        this.loadData(1);
        // window.location.reload();
      },

      handleSearch(selectedKeys, confirm, dataIndex) {
        confirm();
        this.searchText = this.columnParam[dataIndex];
        this.searchedColumn = dataIndex;
        this.queryParam[dataIndex] = this.searchText;
        this.searchQuery();
      },

      handleReset(clearFilters,selectedKeys, confirm, dataIndex,setSelectedKeys) {
        clearFilters();
        this.searchText = '';
        this.queryParam[dataIndex] = null;
        this.columnParam[dataIndex] = null;
        this.searchQuery();
      },


			openModel(row, type) {
				this.$refs.modelDrawer.initData(row, type);
			},
			getFilterOptions() {},
			// 列拖拽的初始化~~~~
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
			handleExportDemo(fileName) {
				window.location = '/设备模板.xls';
			},
			getPopupContainer(node) {
				let element = (() => {
					// nodeType 8	: Comment	: 注释
					if (this.$el && this.$el.nodeType !== 8) {
						return this.$el
					}
					let doc = document.getElementById(this.caseId + 'inputTable')
					if (doc != null) {
						return doc
					}
					return node.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
				})()

				// 递归判断是否带有 overflow: hidden；的父元素
				const ifParent = (child) => {
					let currentOverflow = null
					if (child['currentStyle']) {
						currentOverflow = child['currentStyle']['overflow']
					} else if (window.getComputedStyle) {
						currentOverflow = window.getComputedStyle(child)['overflow']
					}
					if (currentOverflow != null) {
						if (currentOverflow === 'hidden') {
							// 找到了带有 hidden 的标签，判断它的父级是否还有 hidden，直到遇到完全没有 hidden 或 body 的时候才停止递归
							let temp = ifParent(child.parentNode)
							return temp != null ? temp : child.parentNode
						}
						// 当前标签没有 hidden ，如果有父级并且父级不是 body 的话就继续递归判断父级
						else if (child.parentNode && child.parentNode.tagName.toLocaleLowerCase() !== 'body') {
							return ifParent(child.parentNode)
						} else {
							// 直到 body 都没有遇到有 hidden 的标签
							return null
						}
					} else {
						return child
					}
				}

				let temp = ifParent(element)
				return temp != null ? temp : element
			},


		}
	}
</script>
<style scoped>
	@import '~@assets/less/common.less';

</style>
<style>

	/*.resize-table-th {*/
  /*  text-align: center !important;*/
	/*	position: relative;*/
	/*}*/

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

</style>
