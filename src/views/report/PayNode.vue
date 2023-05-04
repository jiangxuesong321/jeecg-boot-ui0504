<template>
	<a-card :bordered="false">
    <div class="card-title">
      付款流程节点报表
    </div>
		<div class="table-page-search-wrapper">
			<a-form layout="inline" @keyup.enter.native="searchQuery">
				<a-row :gutter="24">
					<a-col :span="6">
						<a-form-item label="项目名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input v-model="queryParam.projName"></a-input>
						</a-form-item>
					</a-col>
          <a-col :span="6">
            <a-form-item label="合同编码" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input v-model="queryParam.contractNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="合同名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input v-model="queryParam.contractName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="设备名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input v-model="queryParam.prodName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="设备供应商" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input v-model="queryParam.suppName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="设备型号" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input v-model="queryParam.speType"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="设备产地" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input v-model="queryParam.country"></a-input>
            </a-form-item>
          </a-col>



          <a-col :span="10">
            <a-button type='primary' @click='searchQuery' icon='search'>查询</a-button>
            <a-button type='primary' @click='searchReset' icon='reload' style='margin-left: 8px'>重置</a-button>
            <a-button type="primary" icon="download" @click="handleExportXls('付款流程节点报表')" style='margin-left: 8px'>导出</a-button>
          </a-col>
				</a-row>
			</a-form>
		</div>
		<!-- 操作按钮区域 -->
		<div class="table-operator">
      <list-columns-setter v-model="columns" :def-columns="columns" style="float: right;"/>
		</div>

		<div>
      <!--
       @change="handleTableChange"
        @expand="open"
      -->
			<a-table
        ref="table"
        size="middle"
        :scroll="{x:true}"
        bordered
        rowKey="id"
        :key="key"
        :columns="columns"
				:dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :components="components"
				class="j-table-force-nowrap"
        @change="handleTableChange">
        <template slot="contractName" slot-scope="text,record">
          <div style="width: 180px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="text">
            {{text}}
          </div>
        </template>
			</a-table>
		</div>
	</a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { iegAmount } from '@/utils/util'
import { billListMixin } from '../mixins/billListMixin'
import { billModalMixin } from '../mixins/billModalMixin'
import ListColumnsSetter from '@views/components/ListColumnsSetter'
import Vue from 'vue'
import Sortable from 'sortablejs'
import { getAction } from '@/api/manage'

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
    		title: '项目名称',
    		dataIndex: 'projName',
        align: "center",
        sorter: true,
        width: 180,
    	},
      {
        title: '合同编码',
        dataIndex: 'contractNumber',
        align: "center",
        sorter: true,
        width: 180,
      },
      {
        title: '合同名称',
        dataIndex: 'contractName',
        align: "center",
        sorter: true,
        width: 180,
        scopedSlots: { customRender: 'contractName' },
      },
      {
        title: '设备名称',
        align: "center",
        sorter: true,
        dataIndex: 'prodName',
        width: 180,
      },
      {
        title: '设备品牌',
        align: "center",
        sorter: true,
        dataIndex: 'brandName',
        width: 120,
      },
    	{
    		title: '设备供应商',
    		align: "center",
        sorter: true,
    		dataIndex: 'suppName',
        width: 180,
    	},
    	{
    		title: '设备型号',
        sorter: true,
    		align: "center",
    		dataIndex: 'speType',
        width: 120,
    	},
      {
        title: '设备产地',
        align: "center",
        sorter: true,
        dataIndex: 'country',
        width: 120,
      },
    	{
    		title: '设备数量',
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
    		title: '付款种类',
    		align: "center",
        sorter: true,
    		dataIndex: 'payType_dictText',
        width: 120,
    	},
      {
        title: '付款比例(%)',
        sorter: true,
        dataIndex: 'payRate',
        width: 100,
        customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
          const obj = {
            children: value + '%',
            attrs: {},
          };
          obj.attrs.align = 'right';//控制表体内容居右
          return obj;
        }
      },
      {
        title: '付款金额',
        sorter: true,
        dataIndex: 'payAmount',
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
        title: '付款泛微流程号',
        align: "center",
        sorter: true,
        dataIndex: 'processCode',
        width: 120,
      },
      {
        title: '付款发起流程日期',
        align: "center",
        sorter: true,
        dataIndex: 'processCreateTime',
        width: 120,
      },
      // {
      //   title: '流程状态',
      //   align: "center",
      //   sorter: true,
      //   dataIndex: 'processStatus',
      //   width: 120,
      //   customRender: function(t, r, index) {
      //     if(t == '0'){
      //       return '待审核';
      //     }else if(t == '1'){
      //       return '驳回';
      //     }else if(t == '2'){
      //       return '审核通过';
      //     }
      //   }
      // },
      {
        title: '流程节点',
        align: "center",
        sorter: true,
        dataIndex: 'processNode',
        width: 120,
      },
      // {
      //   title: '备注',
      //   align: "center",
      //   dataIndex: 'comment',
      //   width: 200,
      // },

  ];
  const draggingMap = {};
  columns.forEach(col => {
    draggingMap[col.key] = col.width;
  });
  const draggingState = Vue.observable(draggingMap);
  const ResizeableTitle = (h, props, children) => {
    let thDom = null;
    const {key, ...restProps} = props;
    // const col = columns.find(col => {
    //   const k = col.dataIndex || col.key;
    //   return k === key;
    // });
    let col = null;
    if (key === 'selection-column') {
      //支持复选框
      col = {
        dataIndex: 'selection-column',
        key: 'selection-column',
        width: 40
      }

    }else if(key === 'rc-table-expand-icon-cell'){
      col = {
        dataIndex: 'rc-table-expand-icon-cell',
        key: 'rc-table-expand-icon-cell',
        width: 40
      }
    }
    else {
      col = columns.find(col => {
        const k = col.dataIndex || col.key
        return k === key
      })
    }
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
		name: 'ProjBaseList',
		mixins: [JeecgListMixin, mixinDevice, billListMixin, billModalMixin],
		components: {
      ListColumnsSetter,
		},
		data() {
      this.components = {
        header: {
          cell: ResizeableTitle,
        },
      };
			return {
        isorter:{
          column: 'processCreateTime',
          order: 'desc',
        },
        key: 0,
        columns,
				description: 'proj_base管理页面',
				url: {
					list: "/srm/report/fetchPayProgressPageList",
          exportXlsUrl: "/srm/report/exportPayProgressPageList",
				},
				dictOptions: {},
				superFieldList: [],
			}
		},
		created() {

		},
    mounted() {
      this.columnsDrop()
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
      // 列拖拽的初始化~~~~
      // columnsDrop() {
      //   const wrapperTr = document.querySelector('.ant-table-thead tr')
      //   this.sortable = Sortable.create(wrapperTr, {
      //     animation: 180,
      //     delay: 0,
      //     handle: '.ant-table-header-column', //~~可进行拖拽对应的类名~~~~~~
      //     onEnd: evt => {
      //       const oldItem = this.columns[evt.oldIndex - 1]
      //       this.columns.splice(evt.oldIndex - 1, 1)
      //       this.columns.splice(evt.newIndex - 1, 0, oldItem)
      //       console.log(this.columns)
      //       /**
      //        此处是因为在拖拽后，内容排序正常，表头错乱的问题 ---强制进行了重新渲染
      //        **/
      //       this.key += 1;
      //       this.$nextTick(() => {
      //         this.columnsDrop();
      //       });
      //     }
      //   })
      // },
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
rfq-content {
  min-height: 50px;
  display: flex;
}
.rfq-content table {
  width: 100%;
  margin-left: 5px;
  margin-right: 5px;
  border: 1px #ccc solid;
}
.rfq-content table thead th {
  text-align: center;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  transition: background 0.3s ease;
}
.rfq-content table tbody tr td {
  font-size: 12px;
  border-right: 1px #ccc solid;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom: 1px #ccc solid;
}
</style>