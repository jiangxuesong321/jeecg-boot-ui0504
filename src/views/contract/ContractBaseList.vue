<template>
  <a-card :bordered="false">
    <div class="card-title">
      合同生成
    </div>
    <div>
      <a-tabs defaultActiveKey="all" v-model="tabKey" @change="handleChange">
        <a-tab-pane tab="招投标" key="1"></a-tab-pane>
        <a-tab-pane tab="询比价" key="0"></a-tab-pane>
      </a-tabs>
    </div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <!--招标-->
          <a-col :xl="6" :lg="7" :md="8" :sm="24" v-if="tabKey == '1'">
            <a-form-item label="招标编码">
              <a-input placeholder="请输入招标编码" v-model="queryParam.biddingNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24" v-if="tabKey == '1'">
            <a-form-item label="招标名称">
              <a-input placeholder="请输入招标名称" v-model="queryParam.biddingName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24" v-if="tabKey == '1'">
            <a-form-item label="招标类型">
              <j-dict-select-tag type="select" v-model="queryParam.biddingType" dictCode="bidding_type" placeholder="请输入招标类型" />
            </a-form-item>
          </a-col>
          <!--询比价-->
          <a-col :xl="6" :lg="7" :md="8" :sm="24" v-if="tabKey == '0'">
            <a-form-item label="询价单号">
              <a-input placeholder="请输入询价单号" v-model="queryParam.inquiryCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24" v-if="tabKey == '0'">
            <a-form-item label="询价名称">
              <a-input placeholder="请输入询价名称" v-model="queryParam.inquiryName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24" v-if="tabKey == '0'">
            <a-form-item label="邀请方式">
              <j-dict-select-tag placeholder="请输入邀请方式" v-model="queryParam.invitationMethod" dictCode="invitation_method"/>
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
    <!-- 查询区域-END -->
    <div class="table-operator">
      <list-columns-setter v-model="columns" :def-columns="columns" style="float: right;z-index:999" />
    </div>
    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        :scroll="{x:true,y:500}"
        :columns="tabKey == '0' ? columns1 : columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange">


        <span slot="action" slot-scope="text, record">
          <a @click="handleGen(record,tabKey)">生成合同</a>
        </span>
      </a-table>
    </div>

    <contract-base-modal ref="modalForm" @ok="modalFormOk"></contract-base-modal>
  </a-card>
</template>

<script>

import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ContractBaseModal from './modules/ContractBaseModal'
import '@/assets/less/TableExpand.less'
import { getAction } from '@api/manage'
import Sortable from 'sortablejs'
import ListColumnsSetter from '@views/components/ListColumnsSetter'
import Vue from 'vue'

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
    title: '招标编码',
    align: 'center',
    dataIndex: 'biddingNo',
    sorter: true,
    width: 120,
    scopedSlots: { customRender: 'biddingNo' }
  },
  {
    title: '招标名称',
    align: 'center',
    dataIndex: 'biddingName',
    sorter: true,
    width: 180,
  },
  {
    title: '项目名称',
    align: 'center',
    dataIndex: 'projName',
    sorter: true,
    width: 180,
  },
  {
    title: '招标类型',
    align: 'center',
    dataIndex: 'biddingType_dictText',
    sorter: true,
    width: 120,
  },
  {
    title: '中标供应商',
    align: 'center',
    dataIndex: 'suppName',
    sorter: true,
    width: 120,
  },
  {
    title: '招标状态',
    align: 'center',
    dataIndex: 'biddingStatus_dictText',
    sorter: true,
    width: 120,
  },
  {
    title: '发布时间',
    align: 'center',
    dataIndex: 'createTime',
    sorter: true,
    customRender: function(text) {
      return !text ? '' : (text.length > 10 ? text.substr(0, 10) : text)
    },
    width: 120,
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
  name: "ContractBaseList",
  mixins:[JeecgListMixin],
  components: {
    ContractBaseModal,
    ListColumnsSetter
  },
  data () {
    return {
      isDisabled:false,
      columns,
      queryParam:{

      },
      tabKey:'1',
      description: '合同基本信息表管理页面',
      // 表头
      columns1: [
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
          title:'询比价编码',
          align:"center",
          dataIndex: 'inquiryCode',
          sorter: true,
          width: 120,
        },
        {
          title:'询比价名称',
          align:"center",
          dataIndex: 'inquiryName',
          sorter: true,
          width: 160,
        },
        {
          title:'中标供应商',
          align:"center",
          dataIndex: 'suppName',
          sorter: true,
          width: 120,
        },
        // {
        //   title:'项目名称',
        //   align:"center",
        //   dataIndex: 'projectName',
        //   sorter: true,
        //   width: 160,
        // },
        {
          title:'设备编码',
          align:"center",
          dataIndex: 'prodCode',
          sorter: true,
          width: 120,
        },
        {
          title:'设备名称',
          align:"center",
          dataIndex: 'prodName',
          sorter: true,
          width: 160,
        },
        {
          title:'中标数量',
          align:"center",
          dataIndex: 'qty',
          sorter: true,
          width: 120,
          customRender: function(t, r, index) {
            if(r.unitId_dictText != null && r.unitId_dictText != '' && r.unitId_dictText != undefined){
              return r.qty + r.unitId_dictText;
            }else{
              return r.qty;
            }
          },
        },
        {
          title:'邀请方式',
          align:"center",
          dataIndex: 'invitationMethod_dictText',
          sorter: true,
          width: 120,
        },
        // {
        //   title:'采购类型',
        //   align:"center",
        //   dataIndex: 'reqType_dictText',
        //   sorter: true,
        //   width: 120,
        // },
        {
          title:'询价状态',
          align:"center",
          dataIndex: 'inquiryStatus_dictText',
          sorter: true,
          width: 120,
        },
        {
          title:'发布时间',
          align:"center",
          dataIndex: 'createTime',
          sorter: true,
          customRender:function (text) {
            return !text?"":(text.length>10?text.substr(0,10):text)
          },
          width: 120,
        },
        {
          title: '操作',
          dataIndex: 'action',
          align:"center",
          width: 147,
          scopedSlots: { customRender: 'action' },
        }
      ],
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
      //     title: '招标编码',
      //     align: 'center',
      //     dataIndex: 'biddingNo',
      //     width: 120,
      //     scopedSlots: { customRender: 'biddingNo' }
      //   },
      //   {
      //     title: '招标名称',
      //     align: 'center',
      //     dataIndex: 'biddingName',
      //     width: 180,
      //   },
      //   {
      //     title: '项目名称',
      //     align: 'center',
      //     dataIndex: 'projName',
      //     width: 180,
      //   },
      //   {
      //     title: '招标类型',
      //     align: 'center',
      //     dataIndex: 'biddingType_dictText',
      //     width: 120,
      //   },
      //   {
      //     title: '招标状态',
      //     align: 'center',
      //     dataIndex: 'biddingStatus_dictText',
      //     width: 120,
      //   },
      //   {
      //     title: '发布时间',
      //     align: 'center',
      //     dataIndex: 'createTime',
      //     customRender: function(text) {
      //       return !text ? '' : (text.length > 10 ? text.substr(0, 10) : text)
      //     },
      //     width: 120,
      //   },
      //   {
      //     title: '操作',
      //     dataIndex: 'action',
      //     align:"center",
      //     fixed:"right",
      //     width:147,
      //     scopedSlots: { customRender: 'action' },
      //   }
      // ],
      url: {
        list: '',
        delete: "/srm/contractBase/delete",
        deleteBatch: "/srm/contractBase/deleteBatch",
        exportXlsUrl: "/srm/contractBase/exportXls",
        importExcelUrl: "srm/contractBase/importExcel",

      },
      dictOptions:{},
      superFieldList:[],
    }
  },
  created() {

  },
  mounted() {
    this.columnsDrop(),
      this.checkApprove()
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
  methods: {
    handleBar(record,tabKey){

    },
    checkApprove() {
      let url = "/srm/approveSetting/checkApprove";
      getAction(url, {type:'contract'}).then(res => {
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
    handleGen(record,type){
      this.$refs.modalForm.edit(record,type);
    },
    loadData(arg) {
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1;
      }

      var params = this.getQueryParams();//查询条件
      if(this.tabKey == '0'){
        this.url.list = '/srm/inquiryList/queryPageToDetailList';
        params.inquiryStatus = '2';
        params.source = 'todo';
      }else if(this.tabKey == '1'){
        this.url.list = '/srm/biddingMain/list';
        params.biddingStatus = '3';
        params.isContract = '0';
        params.source = 'todo';
      }
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
    handleChange(tabKey){
      this.searchReset();
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