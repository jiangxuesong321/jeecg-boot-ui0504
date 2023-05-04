<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="card-title">
      评标管理
    </div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="招标名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input placeholder="请输入招标名称" v-model="queryParam.biddingName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="招标编码" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input placeholder="请输入招标编码" v-model="queryParam.biddingNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="评标时间" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-range-picker v-model="queryParam.dateTime" @change="onChange" format="YYYY-MM-DD"/>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="评标状态" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-select placeholder="评标状态" v-model="queryParam.status">
                <a-select-option value="0">待评标</a-select-option>
                <a-select-option value="1">已评标</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: right;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <list-columns-setter v-model="columns" :def-columns="columns" style="float: right;z-index:999" />
    </div>
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        :scroll="{x:true,y:500}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange">
        <template slot="status" slot-scope="text,record">
			<!-- <span v-if="text == '0'">
				待评标
			</span>
			<span v-if="text == '1'" style="color: #00ff80">
				我已评标
			</span> -->
			<a-tag v-if="text == '0'" class="tag-gray">
			  待评标
			</a-tag>
			<a-tag v-if="text == '1'" class="tag-green">
			  已评标
			</a-tag>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="openBidding(record)" v-if="record.status == '0' && record.operation == '1'">进入评标</a>
          <a @click="openBidding(record)" v-if="record.status == '1'">查看评标</a>
        </span>

      </a-table>
    </div>
    <bidding-evaluate-form ref="modalForm" @backQuery="searchQuery"></bidding-evaluate-form>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import '@/assets/less/TableExpand.less'
import { billListMixin } from '../mixins/billListMixin'
import { billModalMixin } from '../mixins/billModalMixin'
import JEllipsis from '@/components/jeecg/JEllipsis'
import BiddingEvaluateForm from '@views/bidding/modules/BiddingEvaluateForm'
import ListColumnsSetter from '@views/components/ListColumnsSetter'
import Vue from 'vue'
import Sortable from 'sortablejs'

let columns = [
  {
    title: '序号',
    dataIndex: '',
    key: 'rowIndex',
    width: 60,
    align: 'center',
    customRender: function(t, r, index) {
      return parseInt(index) + 1
    }
  },
  {
    title: '招标编码',
    align: 'center',
    dataIndex: 'biddingNo',
    sorter: true,
    width: 120,
  },
  {
    title: '招标名称',
    align: 'center',
    dataIndex: 'biddingName',
    sorter: true,
    width: 180,
  },
  {
    title: '评标专家',
    align: 'center',
    dataIndex: 'professionalId_dictText',
    sorter: true,
    width: 120,
  },
  {
    title: '评标开始时间',
    align: 'center',
    dataIndex: 'biddingStartTime',
    sorter: true,
    width: 120,
  },
  {
    title: '评标结束时间',
    align: 'center',
    dataIndex: 'biddingEndTime',
    sorter: true,
    width: 120,
  },
  {
    title: '评标状态',
    align: 'center',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    sorter: true,
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: 100,
    scopedSlots: { customRender: 'action' }
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
  name: 'BiddingMainList',
  mixins: [JeecgListMixin, billListMixin, billModalMixin],
  components: {
    JEllipsis,
    BiddingEvaluateForm,
    ListColumnsSetter
  },
  data() {
    return {
      columns,
      queryParam:{
        biddingStatus:'1'
      },
      description: '招标主表管理页面',
      // 表头
      // columns: [
      //   {
      //     title: '序号',
      //     dataIndex: '',
      //     key: 'rowIndex',
      //     width: 60,
      //     align: 'center',
      //     customRender: function(t, r, index) {
      //       return parseInt(index) + 1
      //     }
      //   },
      //   {
      //     title: '招标编码',
      //     align: 'center',
      //     dataIndex: 'biddingNo',
      //     width: 120,
      //   },
      //   {
      //     title: '招标名称',
      //     align: 'center',
      //     dataIndex: 'biddingName',
      //     width: 180,
      //   },
      //   {
      //     title: '评标开始时间',
      //     align: 'center',
      //     dataIndex: 'biddingStartTime',
      //     width: 120,
      //   },
      //   {
      //     title: '评标结束时间',
      //     align: 'center',
      //     dataIndex: 'biddingEndTime',
      //     width: 120,
      //   },
      //   {
      //     title: '评标状态',
      //     align: 'center',
      //     dataIndex: 'status',
      //     scopedSlots: { customRender: 'status' },
      //     width: 120,
      //   },
      //   {
      //     title: '操作',
      //     dataIndex: 'action',
      //     align: 'center',
      //     width: 100,
      //     scopedSlots: { customRender: 'action' }
      //   }
      // ],
      url: {
        list: '/srm/biddingMain/evaluateList',
        delete: '/srm/biddingMain/delete',
        deleteBatch: '/srm/biddingMain/deleteBatch',
        exportXlsUrl: '/srm/biddingMain/exportXls',
        importExcelUrl: 'srm/biddingMain/importExcel'

      },
      dictOptions: {},
      superFieldList: []
    }
  },
  created() {

  },
  mounted() {
    this.columnsDrop()
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
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
    openBidding(record){
      this.$refs.modalForm.edit(record);
    },
    onChange(date, dateString) {
      this.queryParam.startTime = dateString[0] + " 00:00:00";
      this.queryParam.endTime = dateString[1] + " 23:59:59";
    },
    searchReset() {
      this.queryParam = {};
      this.queryParam.biddingStatus = '1';
      this.loadData(1);
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
	.tag-orange{
		color: #F1B149!important;
		background: #FFF3DD!important;
		border: none!important;
	}
	.tag-blue{
		color: #789FDA!important;
		background: #E9F0FC!important;
		border: none!important;
	}
	.tag-green{
		color: #4CBF75!important;
		background: #DAF2E1!important;
		border: none!important;
	}
	.tag-red{
		color: #DD7373!important;
		background: #F7D6D5!important;
		border: none!important;
	}
	.tag-gray{
		color: #B8B8BA!important;
		background: #F0F2F5!important;
		border: none!important;
	}
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
</style>