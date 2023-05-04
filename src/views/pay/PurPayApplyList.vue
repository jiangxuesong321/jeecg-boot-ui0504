<template>
  <a-card :bordered="false">
    <div class="card-title">
      付款申请
    </div>
    <div>
      <a-tabs  v-model="tabKey" @change="handleChange">
        <a-tab-pane tab="待处理" key="0"></a-tab-pane>
        <a-tab-pane tab="已处理" key="1"></a-tab-pane>
      </a-tabs>
    </div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="付款申请单号">
              <a-input placeholder="请输入付款付款申请单号" v-model="queryParam.applyCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="供应商名称">
              <a-input placeholder="请输入供应商名称" v-model="queryParam.suppName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="审核状态">
              <j-dict-select-tag type="select" v-model="queryParam.applyStatus"  :trigger-change="true" dictCode="applyStatus" placeholder="请选择审核状态"/>
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
        :scroll="{x:true,y:500}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange">

        <template slot="contractNumber" slot-scope="text,record">
          <a @click="handleContract(record)">{{text}}</a>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleDetail(record)">详情</a>
          <a-divider type="vertical" v-if="record.applyStatus =='10' && record.isDisabled == '1'" />
          <a @click="handleEdit(record)" v-if="record.applyStatus =='10'  && record.isDisabled == '1'">审核</a>
        </span>

      </a-table>
    </div>

    <pur-pay-apply-modal ref="modalForm" @ok="modalFormOk"/>
    <contract-base-modal ref="contractForm" @ok="modalFormOk"/>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import PurPayApplyModal from './modules/PurPayApplyModal'
  import '@/assets/less/TableExpand.less'
  import { getAction } from '@api/manage'
  import ListColumnsSetter from '@views/components/ListColumnsSetter'
  import Vue from 'vue'
  import Sortable from 'sortablejs'
  import {
    iegAmount
  } from '@/utils/util'
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
      title:'付款申请单号',
      align:"center",
      dataIndex: 'applyCode',
      sorter: true,
      width:160,
    },
    {
      title:'付款金额',
      dataIndex: 'payAmountOther',
      sorter: true,
      width:120,
      // customRender:function (t,r,index) {
      //   return iegAmount(t,'total')
      // }
      customRender:function (t,r,index) {
        let icon = "";
        if(r.currency == 'RMB'){
          icon = '¥';
        }else if(r.currency == 'JPY'){
          icon = 'Ұ';
        }else if(r.currency == 'USD'){
          icon = '$';
        }else if(r.currency == 'EUR'){
          icon = '€';
        }
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
      title:'付款金额(本币)',
      dataIndex: 'payAmount',
      sorter: true,
      width:120,
      // customRender:function (t,r,index) {
      //   return iegAmount(t,'total')
      // }
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
      title:'币种',
      align:"center",
      sorter: true,
      dataIndex: 'currency_dictText',
      width:120,
    },
    {
      title:'付款方式',
      align:"center",
      sorter: true,
      dataIndex: 'payMethod_dictText',
      width:120,
    },
    {
      title:'付款类型',
      align:"center",
      sorter: true,
      dataIndex: 'payType_dictText',
      width:120,
    },
    {
      title:'付款比例(%)',
      dataIndex: 'payRate',
      sorter: true,
      width:120,
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
      title:'供应商名称',
      align:"center",
      sorter: true,
      dataIndex: 'suppName',
      width:160,
    },
    {
      title:'合同编码',
      align:"center",
      sorter: true,
      dataIndex: 'contractNumber',
      width:160,
      scopedSlots: { customRender: 'contractNumber' },
    },
    {
      title:'项目名称',
      align:"center",
      sorter: true,
      dataIndex: 'projectName',
      width:160,
    },
    {
      title:'申请状态',
      align:"center",
      sorter: true,
      dataIndex: 'applyStatus_dictText',
      width:120,
    },
    {
      title:'申请时间',
      align:"center",
      sorter: true,
      dataIndex: 'applyTime',
      customRender:function (text) {
        return !text?"":(text.length>10?text.substr(0,10):text)
      },
      width:120,
    },
    {
      title: '操作',
      dataIndex: 'action',
      align:"center",
      width:100,
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
    name: "PurPayApplyList",
    mixins:[JeecgListMixin],
    components: {
      PurPayApplyModal,
      ListColumnsSetter,
      ContractBaseModal
    },
    data () {
      return {
        tabKey:'0',
        columns,
        description: '付款申请管理页面',
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
        //     title:'付款申请单号',
        //     align:"center",
        //     dataIndex: 'applyCode',
        //     width:160,
        //   },
        //
        //   {
        //     title:'付款金额',
        //     align:"center",
        //     dataIndex: 'payAmount',
        //     width:120,
        //   },
        //   {
        //     title:'币种',
        //     align:"center",
        //     dataIndex: 'currency_dictText',
        //     width:120,
        //   },
        //   {
        //     title:'付款方式',
        //     align:"center",
        //     dataIndex: 'payMethod_dictText',
        //     width:120,
        //   },
        //   {
        //     title:'付款类型',
        //     align:"center",
        //     dataIndex: 'payType_dictText',
        //     width:120,
        //   },
        //   {
        //     title:'付款比例',
        //     align:"center",
        //     dataIndex: 'payRate',
        //     width:120,
        //   },
        //   {
        //     title:'供应商名称',
        //     align:"center",
        //     dataIndex: 'suppName',
        //     width:160,
        //   },
        //   {
        //     title:'项目名称',
        //     align:"center",
        //     dataIndex: 'projectName',
        //     width:160,
        //   },
        //   {
        //     title:'申请状态',
        //     align:"center",
        //     dataIndex: 'applyStatus_dictText',
        //     width:120,
        //   },
        //   {
        //     title:'申请时间',
        //     align:"center",
        //     dataIndex: 'applyTime',
        //     customRender:function (text) {
        //       return !text?"":(text.length>10?text.substr(0,10):text)
        //     },
        //     width:120,
        //   },
        //   {
        //     title: '操作',
        //     dataIndex: 'action',
        //     align:"center",
        //     width:100,
        //     scopedSlots: { customRender: 'action' },
        //   }
        // ],
        url: {
          list: "/srm/purPayApply/list",
          delete: "/srm/purPayApply/delete",
          deleteBatch: "/srm/purPayApply/deleteBatch",
          exportXlsUrl: "/srm/purPayApply/exportXls",
          importExcelUrl: "srm/purPayApply/importExcel",

        },
        dictOptions:{},
        superFieldList:[],
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
          that.$refs.contractForm.detail(contract);
        })
      },
      handleChange(tabKey){
        this.searchReset();
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
        params.source = 'apply';
        params.tabKey = this.tabKey;
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
      handleEdit: function (record) {
        this.$refs.modalForm.edit(record);
        this.$refs.modalForm.title = "编辑";
        this.$refs.modalForm.disableSubmit = false;
        this.$refs.modalForm.action = 'edit';
      },
      handleDetail:function(record){
        this.$refs.modalForm.edit(record);
        this.$refs.modalForm.title="详情";
        this.$refs.modalForm.disableSubmit = true;
        this.$refs.modalForm.action = 'view';
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