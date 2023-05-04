<template>
  <a-card :bordered="false">
    <div class="card-title">
      采购任务
    </div>
    <div>
      <a-tabs defaultActiveKey="1" v-model='tabKey' @change="callback">
        <a-tab-pane tab="待处理" key="1"></a-tab-pane>
        <a-tab-pane tab="已处理" key="2"></a-tab-pane>
      </a-tabs>
    </div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="采购申请单号" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input placeholder="请输入采购申请单号" v-model="queryParam.reqCode"></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="6">
            <a-form-item label="采购申请标题" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input placeholder="请输入采购申请标题" v-model="queryParam.reqTitle"></a-input>
            </a-form-item>
          </a-col>

          <!--          <a-col :span="6">-->
          <!--            <a-form-item label="处理状态" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">-->
          <!--              <a-select v-model="queryParam.status"  style="width: 100%;">-->
          <!--                <a-select-option value="0" v-if="tabKey == '1'">待处理</a-select-option>-->
          <!--                <a-select-option value="1">部分处理</a-select-option>-->
          <!--                <a-select-option value="2" v-if="tabKey == '2'">全部处理</a-select-option>-->
          <!--              </a-select>-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->

          <!--          <a-col :span="6">-->
          <!--            <a-form-item label="采购类型" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">-->
          <!--              <j-dict-select-tag v-model="queryParam.reqType" placeholder="请选择采购类型" dictCode="req_type"/>-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->

          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
						<a-col :md="6" :sm="24">
							<a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
							<a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px;left: 10px" ghost>重置</a-button>
              <a-button type="primary" @click="batchAdd" icon="plus" style="margin-left: 8px;left: 10px" v-if="tabKey == '1'" >批量询价</a-button>
						</a-col>
					</span>

        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <list-columns-setter v-model="columns" :def-columns="columns" style="float: right;z-index:999" />
    </div>
    <a-table
      ref="table"
      size="middle"
      :scroll="{x:true,y:500}"
      bordered
      rowKey="recordId"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type: 'checkbox'}"
      @change="handleTableChange">
      <template slot="reqCode" slot-scope="text,record">
        <a @click='handleDetail(record)'>{{text}}</a>
      </template>
      <span slot="action" slot-scope="text, record" v-if="tabKey == '1'">
          <a @click="handleBidding(record)" v-if="record.dealType == '0' || record.dealType == '1'">发布招标</a>
        <!--          <a-divider type="vertical" v-if="record.dealType == '0'"/>-->
        <!--          <a @click="handleInquiry(record)" v-if="record.dealType == '0' || record.dealType == '2'">发起询价</a>-->
        </span>
    </a-table>
    <purchase-request-main-modal ref="modalForm" @ok="modalFormOk" ptype="normal"/>
    <purchase-request-goods-main-modal ref="modalGoodsForm" @ok="modalFormOk" :ptype="'normal'"/>
    <bidding-main-modal ref="modalBidding" @ok="modalFormOk"/>
    <inquiry-list-modal ref="modalInquiry" @ok="modalFormOk"/>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import PurchaseRequestMainModal from './modules/PurchaseRequestMainModal'
import PurchaseRequestGoodsMainModal from './modules/PurchaseRequestGoodsMainModal'
import '@/assets/less/TableExpand.less'
import { billListMixin } from '../mixins/billListMixin'
import { billModalMixin } from '../mixins/billModalMixin'
import JEllipsis from '@/components/jeecg/JEllipsis'
import BiddingMainModal from '@/views/bidding/modules/BiddingMainModal'
import InquiryListModal from '@/views/inquiry/modules/InquiryListModal'
import { getAction } from '@api/manage'
import ListColumnsSetter from '@views/components/ListColumnsSetter'
import Vue from 'vue'
import Sortable from 'sortablejs'

let columns = [
  {
    title: '序号',
    reqTitle: '',
    dataIndex: '',
    key: 'rowIndex',
    width: 60,
    align:'center',
    customRender: function(t, r, index) {
      return parseInt(index) + 1;
    }
  },
  {
    title: '采购申请单号',
    dataIndex: 'reqCode',
    align:'center',
    sorter: true,
    scopedSlots: { customRender: 'reqCode' },
    width: 120,
  },
  {
    title: '采购申请标题',
    dataIndex: 'reqTitle',
    align:'center',
    sorter: true,
    width: 180,
  },
  {
    title: '产品名称',
    width: 120,
    align:'center',
    sorter: true,
    dataIndex: 'prodName'
  },
  {
    title: '产品编码',
    width: 120,
    align:'center',
    sorter: true,
    dataIndex: 'prodCode'
  },
  // {
  //   title: '采购类型',
  //   dataIndex: 'reqType_dictText',
  //   align:'center',
  //   sorter: true,
  //   width: 120,
  // },
  {
    title: '审批时间',
    dataIndex: 'approveTime',
    align:'center',
    sorter: true,
    width: 120,
    customRender:function (text) {
      return !text?"":(text.length>10?text.substr(0,10):text)
    }
  },

  // {
  //   title: '采购员',
  //   width: 120,
  //   align:'center',
  //   sorter: true,
  //   dataIndex: 'buyerId_dictText'
  // },
  {
    title: '处理状态',
    width: 120,
    dataIndex: 'status',
    sorter: true,
    align:'center',
    customRender:function (text) {
      if(text == '0'){
        return '待处理';
      }else if(text == '1'){
        return '部分处理';
      }else if(text == '2'){
        return '全部处理';
      }
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    align:'center',
    width: 100,
    scopedSlots: {
      customRender: 'action'
    },
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
  name: "PurchaseRequestTaskTotal",
  mixins: [JeecgListMixin, billListMixin, billModalMixin],
  components: {
    JEllipsis,
    PurchaseRequestMainModal,
    PurchaseRequestGoodsMainModal,
    BiddingMainModal,
    InquiryListModal,
    ListColumnsSetter
  },
  data() {
    return {
      columns,
      description: 'purchase_request_main管理页面',
      queryParam: {
        reqCode:'',
        reqTitle:'',
        reqStatus:'',
        reqType:'',
      },
      tabKey: "1",
      // 表头
      columns1: [
        {
          title: '序号',
          reqTitle: '',
          dataIndex: '',
          key: 'rowIndex',
          align:'center',
          width: 60,

          customRender: function(t, r, index) {
            return parseInt(index) + 1;
          }
        },
        {
          title: '采购申请单号',
          dataIndex: 'reqCode',
          align:'center',
          sorter: true,
          scopedSlots: { customRender: 'reqCode' },
          width: 120,
        },
        {
          title: '采购申请标题',
          dataIndex: 'reqTitle',
          align:'center',
          sorter: true,
          width: 180,
        },
        {
          title: '采购类型',
          dataIndex: 'reqType_dictText',
          align:'center',
          sorter: true,
          width: 120,
        },
        {
          title: '审批时间',
          dataIndex: 'approveTime',
          align:'center',
          sorter: true,
          width: 120,
          customRender:function (text) {
            return !text?"":(text.length>10?text.substr(0,10):text)
          }
        },
        {
          title: '采购员',
          width: 120,
          align:'center',
          sorter: true,
          dataIndex: 'buyerId_dictText'
        },
        {
          title: '单据处理类型',
          width: 120,
          dataIndex: 'dealType',
          sorter: true,
          align:'center',
          customRender:function (text) {
            if(text == '1'){
              return "招投标";
            }else if(text == '2'){
              return "询比价";
            }
          }
        },
        {
          title: '处理状态',
          width: 120,
          dataIndex: 'status',
          sorter: true,
          align:'center',
          customRender:function (text) {
            if(text == '0'){
              return '待处理';
            }else if(text == '1'){
              return '部分处理';
            }else if(text == '2'){
              return '全部处理';
            }
          }
        },
      ],
      // columns: [
      //   {
      // 		title: '序号',
      // 		reqTitle: '',
      // 		dataIndex: '',
      // 		key: 'rowIndex',
      // 		width: 60,
      //
      // 		customRender: function(t, r, index) {
      // 			return parseInt(index) + 1;
      // 		}
      // 	},
      // 	{
      // 		title: '采购申请单号',
      // 		dataIndex: 'reqCode',
      // 		scopedSlots: { customRender: 'reqCode' },
      //     width: 120,
      // 	},
      //   {
      //     title: '采购申请标题',
      //     dataIndex: 'reqTitle',
      //     width: 180,
      //   },
      //   {
      //     title: '采购类型',
      //     dataIndex: 'reqType_dictText',
      //     width: 120,
      //   },
      //   {
      //     title: '审批时间',
      //     dataIndex: 'approveTime',
      //     width: 120,
      //     customRender:function (text) {
      //       return !text?"":(text.length>10?text.substr(0,10):text)
      //     }
      //   },
      // 	{
      // 		title: '采购员',
      //     width: 120,
      // 		dataIndex: 'buyerId_dictText'
      // 	},
      // 	{
      // 		title: '操作',
      // 		dataIndex: 'action',
      // 		width: 100,
      // 		scopedSlots: {
      // 			customRender: 'action'
      // 		},
      // 	}
      // ],
      url: {
        list: "/srm/purchaseRequestMain/todoPageList",
        delete: "/srm/purchaseRequestMain/delete",
        deleteBatch: "/srm/purchaseRequestMain/deleteBatch",
        exportXlsUrl: "/srm/purchaseRequestMain/exportXls",
        importExcelUrl: "/srm/purchaseRequestMain/importExcel",

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
    }
  },
  methods: {
    batchAdd(){
      let selectedRowKeys = this.selectedRowKeys;
      if(selectedRowKeys == null || selectedRowKeys.length == 0){
        this.$message.warning("请选择需要询价的明细");
        return;
      }
      this.$refs.modalInquiry.editList(selectedRowKeys)
    },
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
    handleBidding(record) {
      this.$refs.modalBidding.edit(record)
    },
    handleInquiry(record) {
      // record.comment = '';
      this.$refs.modalInquiry.edit(record)
    },
    callback(key){
      let that=this;
      that.queryParam.reqStatus=key;
      that.loadData(1);
    },
    onDateChange: function (value, dateString) {
      this.queryParam.reqDate_begin=dateString[0];
      this.queryParam.reqDate_end=dateString[1];
    },
    onDateOk(value) {
      console.log(value);
    },
    handleDetail:function(record){
      // this.$refs.modalForm.hasdo(record);
      // this.$refs.modalForm.title="详情";
      // this.$refs.modalForm.disableSubmit = true;

      if(record.reqCategory =='1'){
        this.$refs.modalGoodsForm.edit(record);
        this.$refs.modalGoodsForm.title="详情";
        this.$refs.modalGoodsForm.disableSubmit = true;

      }else{
        this.$refs.modalForm.edit(record);
        this.$refs.modalForm.title="详情";
        this.$refs.modalForm.disableSubmit = true;

      }

    },
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
      params.source = this.tabKey;
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
</style>