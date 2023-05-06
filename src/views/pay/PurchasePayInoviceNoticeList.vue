<template>
  <a-card :bordered="false">
    <div class="card-title">
      发票通知列表
    </div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="发票编号">
              <a-input placeholder="请输入发票编号" v-model="queryParam.invoiceNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="开票日期">
              <j-date placeholder="请选择开票日期" v-model="queryParam.invoiceDate" style="width: 100%"></j-date>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="供应商名称">
              <a-input placeholder="请输入供应商名称" v-model="queryParam.supplierName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="项目名称">
<!--              <a-input placeholder="请输入项目名称" v-model="queryParam.projectName"></a-input>-->
              <j-multi-select-tag style="width: 100%" v-model="queryParam.projectId" :allow-clear="true" @change="searchQuery"
                                  placeholder="请选择项目" dictCode="proj_base,proj_name,id,del_flag = '0' order by create_time desc">

              </j-multi-select-tag>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="合同名称">
              <a-input placeholder="请输入合同名称" v-model="queryParam.contractName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="合同编码">
              <a-input placeholder="请输入合同编码" v-model="queryParam.contractNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a-button type="primary" icon="download" @click="handleExportXls('发票列表')" style='margin-left: 8px'>导出</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <list-columns-setter v-model="columns" :def-columns="columns" style="float: right;z-index:999" />
    </div>

    <!-- table区域-begin -->
    <div>

      <a-table
        ref="table"
        size="middle"
        :scroll="{x:1200,y:500}"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template slot="contractName" slot-scope="text,record">
          <div v-if='text != null && text != "" && text != undefined'>
            <div v-if="text.split('-') != null && text.split('-').length > 1 " style="width: 200px;height: auto;word-wrap: break-word;overflow: hidden; text-overflow: ellipsis;white-space: nowrap;"
                 :title="text.split('-')[1]">
              {{text.split('-')[1]}}
            </div>
            <div v-if="text.split('-') != null && text.split('-').length > 2" style="width: 200px;height: auto;word-wrap: break-word;overflow: hidden; text-overflow: ellipsis;white-space: nowrap;"
                 :title="text.split('-')[2]">
              {{text.split('-')[2]}}
            </div>
          </div>
        </template>

        <template slot="contractNumber" slot-scope="text,record">
          <a @click="handleContract(record)">{{text}}</a>
        </template>
        <template slot="invoiceNo" slot-scope="text,record">
          <div style="width: 100px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="text">
            <a @click="handleDetail(record)">{{text}}</a>
          </div>
        </template>
        <template slot="invoiceAmountTax" slot-scope="text,record">
          <div style="width: 100px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="text">
            <a @click="handleDetail(record)">{{text}}</a>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleDetail(record)">详情</a>
        </span>
      </a-table>
    </div>

    <purchase-pay-inovice-notice-modal ref="modalForm" @ok="modalFormOk"></purchase-pay-inovice-notice-modal>
    <contract-base-modal ref="modalForm1"/>
  </a-card>
</template>

<script>
  import ContractBaseModal from '@views/contract/modules/ContractBaseModal'
  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import PurchasePayInoviceNoticeModal from './modules/PurchasePayInoviceNoticeModal'
  import Sortable from 'sortablejs'
  import ListColumnsSetter from '@views/components/ListColumnsSetter'
  import Vue from 'vue'
  import { getAction } from '@api/manage'
  import {
    iegAmount
  } from '@/utils/util'
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
      title:'供应商名称',
      align:"center",
      sorter: true,
      dataIndex: 'supplierName',
      width:160,
      ellipsis:true,
    },

    // {
    //   title:'项目名称',
    //   align:"center",
    //   sorter: true,
    //   dataIndex: 'projectName',
    //   width:200,
    //   ellipsis:true,
    // },
    // {
    //   title:'合同名称',
    //   align:"center",
    //   sorter: true,
    //   dataIndex: 'contractName',
    //   width:200,
    //   ellipsis:true,
    //   scopedSlots: {
    //     customRender: 'contractName'
    //   },
    // },
    {
      title:'合同编码',
      align:"center",
      sorter: true,
      dataIndex: 'contractNumber',
      width:200,
      ellipsis:true,
      scopedSlots: { customRender: 'contractNumber' }
    },

    // {
    //   title:'付款类型',
    //   align:"center",
    //   dataIndex: 'payType'
    // },

    {
      title:'币种',
      align:"center",
      sorter: true,
      dataIndex: 'currency_dictText',

      width:120,
    },
    // {
    //   title:'开票原币金额（未税）',
    //   sorter: true,
    //   dataIndex: 'invoiceAmount',
    //   width:140,
    //   customRender:function (t,r,index) {
    //     let icon = "";
    //     if(r.currency == 'RMB'){
    //       icon = '¥';
    //     }else if(r.currency == 'JPY'){
    //       icon = '￥';
    //     }else if(r.currency == 'USD'){
    //       icon = '$';
    //     }else if(r.currency == 'EUR'){
    //       icon = '€';
    //     }
    //     const obj = {
    //       children: icon + iegAmount(t,'total'),
    //       attrs: {},
    //     };
    //     obj.attrs.align = 'right';//控制表体内容居右
    //     return obj;
    //     // return icon + iegAmount(t,'total')
    //   },
    // },
    {
      title:'开票原币金额（含税）',
      sorter: true,
      dataIndex: 'invoiceAmountTax',

      width:140,
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
    // {
    //   title:'开票本币金额（未税）',
    //   sorter: true,
    //   dataIndex: 'invoiceAmountLocal',
    //   width:140,
    //   // customRender:function (t,r,index) {
    //   //   return iegAmount(t,'total')
    //   // }
    //   customRender:function (t,r,index) {
    //     let icon = "";
    //     icon = '¥';
    //     const obj = {
    //       children: icon + iegAmount(t,'total'),
    //       attrs: {},
    //     };
    //     obj.attrs.align = 'right';//控制表体内容居右
    //     return obj;
    //     // return icon + iegAmount(t,'total')
    //   },
    // },
    {
      title:'开票本币金额（含税）',
      sorter: true,
      dataIndex: 'invoiceAmountTaxLocal',
      width:140,
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
      title:'开票日期',
      align:"center",
      sorter: true,
      dataIndex: 'invoiceDate',
      customRender:function (text) {
        return !text?"":(text.length>10?text.substr(0,10):text)
      },
      width:120,
    },
    {
      title:'发票税率(%)',
      sorter: true,
      dataIndex: 'taxRate',
      width:120,
      customRender:function (text) {
        if(text == '100'){
          return '其他'
        }else{
          return text;
        }
      },
    },
    // {
    //   title:'发票编号',
    //   align:"center",
    //   sorter: true,
    //   dataIndex: 'invoiceNo',
    //
    //   width:120,
    // },
    {
      title:'发票类型',
      align:"center",
      sorter: true,
      dataIndex: 'invoiceType_dictText',
      width:120,
    },
    {
      title:'备注',
      align:"center",
      dataIndex: 'remark',
      width:200,
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
    name: 'PurchasePayInoviceNoticeList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      PurchasePayInoviceNoticeModal,
      ListColumnsSetter,
      ContractBaseModal
    },
    data () {
      return {
        columns,
        description: '发票登记管理页面',
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
        //     title:'发票编号',
        //     align:"center",
        //     dataIndex: 'invoiceNo'
        //   },
        //   {
        //     title:'项目名称',
        //     align:"center",
        //     dataIndex: 'projectName'
        //   },
        //   {
        //     title:'合同名称',
        //     align:"center",
        //     dataIndex: 'contractName'
        //   },
        //   {
        //     title:'供应商名称',
        //     align:"center",
        //     dataIndex: 'supplierName'
        //   },
        //   {
        //     title:'付款类型',
        //     align:"center",
        //     dataIndex: 'payType'
        //   },
        //   {
        //     title:'发票类型',
        //     align:"center",
        //     dataIndex: 'invoiceType'
        //   },
        //   {
        //     title:'币种',
        //     align:"center",
        //     dataIndex: 'currency'
        //   },
        //   {
        //     title:'开票金额（未税）',
        //     align:"center",
        //     dataIndex: 'invoiceAmount'
        //   },
        //   {
        //     title:'开票金额（含税）',
        //     align:"center",
        //     dataIndex: 'invoiceAmountTax'
        //   },
        //   {
        //     title:'开票日期',
        //     align:"center",
        //     dataIndex: 'invoiceDate',
        //     customRender:function (text) {
        //       return !text?"":(text.length>10?text.substr(0,10):text)
        //     }
        //   },
        //   {
        //     title:'发票税率',
        //     align:"center",
        //     dataIndex: 'taxRate'
        //   },
        //   {
        //     title:'备注',
        //     align:"center",
        //     dataIndex: 'remark'
        //   },
        // ],
        url: {
          list: "/srm/purchasePayInovice/list",
          delete: "/srm/purchasePayInovice/delete",
          deleteBatch: "/srm/purchasePayInovice/deleteBatch",
          exportXlsUrl: "/srm/purchasePayInovice/exportXls",
          importExcelUrl: "srm/purchasePayInovice/importExcel",

        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
    this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    mounted() {
      this.columnsDrop()
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
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'invoiceNo',text:'发票编号',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'taxRate',text:'发票税率',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'invoiceTax',text:'税额',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'invoiceAmount',text:'开票金额（未税）',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'invoiceAmountTax',text:'开票金额（含税）',dictCode:''})
        fieldList.push({type:'date',value:'invoiceDate',text:'开票日期'})
        fieldList.push({type:'string',value:'supplierId',text:'供应商ID',dictCode:''})
        fieldList.push({type:'string',value:'supplierName',text:'供应商名称',dictCode:''})
        fieldList.push({type:'string',value:'remark',text:'备注',dictCode:''})
        fieldList.push({type:'string',value:'status',text:'确认状态（00；待确认，10确认）',dictCode:''})
        fieldList.push({type:'string',value:'projectId',text:'项目ID',dictCode:''})
        fieldList.push({type:'string',value:'projectName',text:'项目名称',dictCode:''})
        fieldList.push({type:'string',value:'contractId',text:'合同ID',dictCode:''})
        fieldList.push({type:'string',value:'contractName',text:'合同名称',dictCode:''})
        fieldList.push({type:'string',value:'payType',text:'付款类型',dictCode:''})
        fieldList.push({type:'string',value:'invoiceType',text:'发票类型',dictCode:''})
        fieldList.push({type:'string',value:'currency',text:'币种',dictCode:''})
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
</style>