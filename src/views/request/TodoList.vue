<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="申请编号" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <j-input placeholder="请输入申请编号" v-model="queryParam.reqCode"></j-input>
            </a-form-item>
          </a-col>

          <a-col :span="6">
            <a-form-item label="申请标题" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <j-input placeholder="请输入申请标题" v-model="queryParam.reqTitle"></j-input>
            </a-form-item>
          </a-col>

          <a-col :span="6">
            <a-form-item label="采购类型" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <j-dict-select-tag v-model="queryParam.reqType" placeholder="请选择采购类型" dictCode="req_type"/>
            </a-form-item>
          </a-col>

          <a-col :span="6">
            <a-form-item label="申请人名" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <j-dict-select-tag v-model="queryParam.applyUserId" placeholder="请选择申请人名" dictCode="sys_user,realname,id,username!='admin' and status = '1'"/>
            </a-form-item>
          </a-col>

          <!--          <a-col :span="6">-->
          <!--            <a-form-item label="审核状态" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">-->
          <!--              <j-dict-select-tag v-model="queryParam.reqStatus" placeholder="请选择审核状态" dictCode="approve_status"/>-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->

          <span style="float: right;overflow: hidden;" class="table-page-search-submitButtons">
						<a-col :md="6" :sm="24">
							<a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
							<a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px;left: 10px" ghost>重置</a-button>
						</a-col>
					</span>

        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <list-columns-setter v-model="columns" :def-columns="columns" style="float: right;z-index:999" />
    </div>

    <div>

      <a-table
        ref="table"
        size="middle"
        :scroll="{x:true}"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template slot="projectName" slot-scope="text,record">
          <div style="width: 180px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="text">
            {{text}}
          </div>
        </template>

        <template slot="reqCode" slot-scope="text,record">
          <a @click='handleView(record)'>{{text}}</a>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleDetail(record)" >审核</a>
				</span>

      </a-table>
    </div>

    <purchase-request-main-modal ref="modalForm" @ok="modalFormOk" :ptype="ptype"/>

    <purchase-request-goods-main-modal ref="modalGoodsForm" @ok="modalFormOk" :ptype="ptype"/>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import PurchaseRequestMainModal from './modules/PurchaseRequestMainModal'
import PurchaseRequestGoodsMainModal from './modules/PurchaseRequestGoodsMainModal'
import '@/assets/less/TableExpand.less'
import { billListMixin } from '../mixins/billListMixin'
import { billModalMixin } from '../mixins/billModalMixin'
import ListColumnsSetter from '@views/components/ListColumnsSetter'
import Vue from 'vue'
import Sortable from 'sortablejs'
import { getAction } from '@api/manage'

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
    title: '申请编号',
    align: "center",
    dataIndex: 'reqCode',
    sorter: true,
    scopedSlots: { customRender: 'reqCode' },
    width: 120,
  },
  {
    title: '申请标题',
    align: "center",
    dataIndex: 'reqTitle',
    sorter: true,
    width: 180,
  },
  // {
  //   title: '项目名称',
  //   align: "center",
  //   dataIndex: 'projectName',
  //   sorter: true,
  //   width: 180,
  //   scopedSlots: {
  //     customRender: 'projectName'
  //   },
  // },
  // {
  //   title: '采购类型',
  //   align: "center",
  //   dataIndex: 'reqType_dictText',
  //   sorter: true,
  //   width: 120,
  // },
  {
    title: '申请部门',
    align: "center",
    sorter: true,
    dataIndex: 'reqOrgId_dictText',
    width: 120,
  },
  {
    title: '申请人',
    align: "center",
    sorter: true,
    dataIndex: 'applyUserId_dictText',
    width: 120,
  },
  {
    title: '申请日期',
    align: "center",
    dataIndex: 'reqDate',
    sorter: true,
    customRender: function(text) {
      return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
    },
    width: 120,
  },
  {
    title: '审核状态',
    align: "center",
    sorter: true,
    dataIndex: 'reqStatus_dictText',
    width: 120,
  },
  {
    title: '备注',
    align: "center",
    dataIndex: 'comment',
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: "center",
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
  name: "TodoList",
  mixins: [JeecgListMixin, billListMixin, billModalMixin],
  components: {
    PurchaseRequestMainModal,
    PurchaseRequestGoodsMainModal,
    ListColumnsSetter
  },
  data() {
    return {
      ptype:'approve',
      isDisabled:false,
      columns,
      queryParam:{
        reqStatus:'1'
      },
      tabKey:'1',
      description: 'purchase_request_main管理页面',
      // 表头
      // columns: [
      //   {
      //     title: '序号',
      //     dataIndex: '',
      //     key: 'rowIndex',
      //     width: 60,
      //     align: "center",
      //     customRender: function(t, r, index) {
      //       return parseInt(index) + 1;
      //     }
      //   },
      //   {
      //     title: '申请编号',
      //     align: "center",
      //     dataIndex: 'reqCode',
      //     scopedSlots: { customRender: 'reqCode' },
      //     width: 120,
      //   },
      //   {
      //     title: '申请标题',
      //     align: "center",
      //     dataIndex: 'reqTitle',
      //     width: 180,
      //   },
      //   {
      //     title: '项目名称',
      //     align: "center",
      //     dataIndex: 'projectName',
      //     width: 180,
      //   },
      //   {
      //     title: '采购类型',
      //     align: "center",
      //     dataIndex: 'reqType_dictText',
      //     width: 120,
      //   },
      //   {
      //     title: '申请部门',
      //     align: "center",
      //     dataIndex: 'reqOrgId_dictText',
      //     width: 120,
      //   },
      //   {
      //     title: '申请人',
      //     align: "center",
      //     dataIndex: 'applyUserId_dictText',
      //     width: 120,
      //   },
      //   {
      //     title: '申请日期',
      //     align: "center",
      //     dataIndex: 'reqDate',
      //     customRender: function(text) {
      //       return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
      //     },
      //     width: 120,
      //   },
      //   {
      //     title: '审核状态',
      //     align: "center",
      //     dataIndex: 'reqStatus_dictText',
      //     width: 120,
      //   },
      //   {
      //     title: '备注',
      //     align: "center",
      //     dataIndex: 'comment',
      //     width: 200,
      //   },
      //   {
      //     title: '操作',
      //     dataIndex: 'action',
      //     align: "center",
      //     width: 100,
      //     scopedSlots: {
      //       customRender: 'action'
      //     },
      //   }
      // ],
      url: {
        list: "/srm/purchaseRequestMain/list",
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
    // this.checkApprove()
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
  methods: {
    handleDetail:function(record){
      this.ptype = 'approve';

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
    handleView:function(record){
      this.ptype = 'hasdo';
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title="详情";
      this.$refs.modalForm.disableSubmit = true;
    },
    checkApprove() {
      let url = "/srm/approveSetting/checkApprove";
      getAction(url, {type:'requistion'}).then(res => {
        if(res.success){
          this.isDisabled = res.result;
        }
      })
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
    searchReset() {
      this.queryParam = {}
      this.queryParam.reqStatus = '1';
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