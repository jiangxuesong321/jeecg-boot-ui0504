<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="付款月份">
              <a-month-picker v-model="queryParam.planMonth" placeholder="请输入付款月份" style="width: 100%" @change="onChange"/>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="付款计划单号">
              <a-input v-model="queryParam.code" placeholder="付款计划单号"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="合同编码">
              <a-input v-model="queryParam.contractNumber" placeholder="合同编码"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="合同名称">
              <a-input v-model="queryParam.contractName" placeholder="合同名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
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
        rowKey="id"
        :scroll="{x:1200,y:500}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange">
        <template slot="contractNumber" slot-scope="text,record">
          <a @click="handleContract(record)">{{text}}</a>
        </template>

        <template slot="payStatus_dictText" slot-scope="text,record">
          {{text}}
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleDetail(record)">详情</a>
        </span>

      </a-table>
    </div>

    <contract-base-modal ref="modalForm1"/>
    <pur-pay-plan-modal ref="modalForm" @ok="modalFormOk"/>

  </a-card>
</template>

<script>

import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import PurPayPlanModal from './modules/PurPayPlanModal'
import '@/assets/less/TableExpand.less'
import { getAction } from '@api/manage'
import ListColumnsSetter from '@views/components/ListColumnsSetter'
import Vue from 'vue'
import Sortable from 'sortablejs'
import ApproveModal from '@views/contract/modules/ApproveModal'
import { iegAmount } from '@/utils/util'
import ContractBaseModal from '@views/contract/modules/ContractBaseModal'

let columns = [
  {
    title: '序号',
    dataIndex: '',
    key:'rowIndex',
    width:60,
    align:"center",
    customRender:function (t,r,index) {
      return parseInt(index)+1;
    }
  },
  {
    title:'付款计划单号',
    align:"center",
    dataIndex: 'code',
    width: 120,
  },
  {
    title:'合同名称',
    align:"center",
    dataIndex: 'contractName',
    width: 180,
    ellipsis:true
  },
  {
    title:'合同编码',
    align:"center",
    dataIndex: 'contractNumber',
    width: 140,
    scopedSlots: { customRender: 'contractNumber' }
  },
  {
    title:'付款月份',
    align:"center",
    dataIndex: 'planMonth',
    width: 120,
  },
  {
    title:'应付本币',
    dataIndex: 'payAmountCope',
    width: 120,
    customRender:function (t,r,index) {
      let icon = "";
      icon = '¥';
      const obj = {
        children: icon + iegAmount(t,'total'),
        attrs: {},
      };
      obj.attrs.align = 'right';//控制表体内容居右
      return obj;
      // return icon + iegAmount(t,'total')
    },
  },
  {
    title:'应付(美元)',
    dataIndex: 'payAmountUsd',
    width: 120,
    customRender:function (t,r,index) {
      let icon = "";
      icon = '$';

      const obj = {
        children: icon + iegAmount(t,'total'),
        attrs: {},
      };
      obj.attrs.align = 'right';//控制表体内容居右
      return obj;
      // return icon + iegAmount(t,'total')
    },
  },
  {
    title:'应付(日元)',
    dataIndex: 'payAmountJpy',
    width: 120,
    customRender:function (t,r,index) {
      let icon = "";
      icon = '￥';

      const obj = {
        children: icon + iegAmount(t,'total'),
        attrs: {},
      };
      obj.attrs.align = 'right';//控制表体内容居右
      return obj;
      // return icon + iegAmount(t,'total')
    },
  },
  {
    title:'应付(欧元)',
    dataIndex: 'payAmountEur',
    width: 120,
    customRender:function (t,r,index) {
      let icon = "";
      icon = '€';
      const obj = {
        children: icon + iegAmount(t,'total'),
        attrs: {},
      };
      obj.attrs.align = 'right';//控制表体内容居右
      return obj;
      // return icon + iegAmount(t,'total')
    },
  },
  {
    title:'支付状态',
    align:"center",
    dataIndex: 'payStatus_dictText',
    scopedSlots: { customRender: 'payStatus_dictText' },
    width: 120,

  },
  {
    title:'申请人',
    align:"center",
    dataIndex: 'createUser_dictText',
    width: 120,
  },
  {
    title:'备注',
    align:"center",
    dataIndex: 'comment',
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'action',
    align:"center",
    width:147,
    scopedSlots: { customRender: 'action' },
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
  name: "PurPayPlanList",
  mixins:[JeecgListMixin],
  props:['categoryId'],
  components: {
    PurPayPlanModal,
    ListColumnsSetter,
    ApproveModal,
    ContractBaseModal
  },
  data () {
    return {
      iegAmount,
      model:{},
      visible:false,
      columns,
      tabKey:'0',
      totalList:[],
      description: '付款计划管理页面',
      // 表头
      // columns: [
      //   {
      //     title: '序号',
      //     dataIndex: '',
      //     key:'rowIndex',
      //     width:60,
      //     align:"center",
      //     customRender:function (t,r,index) {
      //       return parseInt(index)+1;
      //     }
      //   },
      //   {
      //     title:'付款计划单号',
      //     align:"center",
      //     dataIndex: 'code',
      //     width: 120,
      //   },
      //   {
      //     title:'付款月份',
      //     align:"center",
      //     dataIndex: 'planMonth'
      //   },
      //   {
      //     title:'应付本币',
      //     align:"center",
      //     dataIndex: 'payAmountCope'
      //   },
      //   {
      //     title:'应付(美元)',
      //     align:"center",
      //     dataIndex: 'payAmountUsd'
      //   },
      //   {
      //     title:'应付(日元)',
      //     align:"center",
      //     dataIndex: 'payAmountJpy'
      //   },
      //   {
      //     title:'应付(欧元)',
      //     align:"center",
      //     dataIndex: 'payAmountEur'
      //   },
      //   {
      //     title:'支付状态',
      //     align:"center",
      //     dataIndex: 'payStatus_dictText'
      //   },
      //   {
      //     title:'申请人',
      //     align:"center",
      //     dataIndex: 'createUser'
      //   },
      //   {
      //     title:'备注',
      //     align:"center",
      //     dataIndex: 'comment'
      //   },
      //   {
      //     title: '操作',
      //     dataIndex: 'action',
      //     align:"center",
      //     width:147,
      //     scopedSlots: { customRender: 'action' },
      //   }
      // ],
      url: {
        list: "/srm/purPayPlan/list",
        delete: "/srm/purPayPlan/delete",
        deleteBatch: "/srm/purPayPlan/deleteBatch",
        exportXlsUrl: "/srm/purPayPlan/exportXls",
        importExcelUrl: "srm/purPayPlan/importExcel",

      },
      dictOptions:{},
      superFieldList:[],
      isorter:{
        column: 'code',
        order: 'desc',
      },
    }
  },
  created() {
  },
  mounted() {
    this.columnsDrop()
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
  methods: {

    handleContract(record){
      let that = this;
      //获取合同信息
      let url = "/srm/contractBase/queryById";
      getAction(url,{id:record.contractId}).then(res => {
        let contract = res.result;
        that.$refs.modalForm1.detail(contract);
      })
    },
    openRecord(record){
      this.$refs.approveModal.visible = true;
      this.$refs.approveModal.loadData(record.id);
    },
    handleCancel(){
      this.visible = false;
    },
    handleApprove(record){
      this.model = JSON.parse(JSON.stringify(record));
      // this.model.contractStatus = null;
      // this.model.isLast = 0;
      this.model.approver = null;
      this.visible = true;
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
    handleChange(tabKey){
      this.searchReset();
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
      params.payStatus = '2';
      params.categoryId = this.categoryId;
      params.source = 'report';
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
    searchReset() {
      this.queryParam = {}
      this.loadData(1);
      this.getTotalAmountByCurrency();
    },
    searchQuery() {
      this.loadData(1);
      this.getTotalAmountByCurrency();
    },
    //币种金额汇总
    getTotalAmountByCurrency(){
      this.totalList = [];
      let url = "/srm/purPayPlan/getTotalAmountByCurrency";
      let params = this.getQueryParams();//查询条件
      if(this.tabKey == '1'){
        params.payStatus = '2';
      }else{
        params.payStatus = '0,1,3'
      }
      getAction(url,params).then(res => {
        this.totalList = res.result;
      })
    },
    onChange(date, dateString) {
      this.queryParam.planMonth = dateString;
    },
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
</style>