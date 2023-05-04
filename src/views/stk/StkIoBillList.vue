<template>
  <a-card :bordered="false">
    <div class="card-title">
      入库管理
    </div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="单据编号">
              <a-input placeholder="请输入单据编号" v-model="queryParam.billNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="合同编码">
              <a-input placeholder="请输入合同编码" v-model="queryParam.contractNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="仓库名称">
              <a-input placeholder="请输入仓库名称" v-model="queryParam.whName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a-button type="primary" icon="download" @click="handleExportXls('入库列表')" style='margin-left: 8px'>导出</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <list-columns-setter v-model="columns" :def-columns="columns" style="float: right;z-index:999" />
    </div>

    <!-- table区域-begin -->
    <div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :scroll="{x:1500,y:500}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange">
        <template slot="projectName" slot-scope="text,record">
          <div style="width: 160px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="text">
            {{text}}
          </div>
        </template>
        <template slot="contractNumber" slot-scope="text,record">
          <a @click="handleContract(record)">{{text}}</a>
        </template>
        <template slot="attachment" slot-scope="text,record">
          <j-upload v-model="record.attachment" :trigger-change="true" disabled></j-upload>
        </template>
        <template slot="deviceName" slot-scope="text,record">
          <div v-for="item in companyCut(text)">
            {{item}}<br>
          </div>
        </template>

        <template slot="deviceSerialNumber" slot-scope="text,record">
          <div v-for="item in companyCut(text)">
            {{item}}<br>
          </div>
        </template>

        <template slot="qty" slot-scope="text,record">
          <div v-for="item in companyCut(text)">
            {{iegAmount(item, 'total')}}
            <br>
          </div>
        </template>

        <template slot="contractQty" slot-scope="text,record">
          <div v-for="item in companyCut(text)">
            {{iegAmount(item, 'total')}}
            <br>
          </div>
        </template>


        <span slot="action" slot-scope="text, record">
          <a @click="handleDetail(record)">详情</a>

          <a-divider type="vertical"  v-has="'io:cost'"/>
          <a @click="handleCost(record)" v-has="'io:cost'">费用维护</a>

        </span>

      </a-table>
      <div :style="dataSource != null && dataSource.length > 0 ? 'z-index:99;margin-top:-43px;' : 'z-index:99;margin-top:10px;'">
        <a-button @click="handleAdd" type="primary" icon="plus" v-has="'io:action'">Demo设备入库</a-button>
      </div>
    </div>

    <stk-io-bill-modal ref="modalForm" @ok="modalFormOk"/>
    <contract-base-modal ref="modalForm1"/>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import StkIoBillModal from './modules/StkIoBillModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import '@/assets/less/TableExpand.less'
  import { getAction } from '@api/manage'
  import ListColumnsSetter from '@views/components/ListColumnsSetter'
  import Vue from 'vue'
  import Sortable from 'sortablejs'
  import ContractBaseModal from '@views/contract/modules/ContractBaseModal'
  import { iegAmount, isNullOrEmpty } from '@/utils/util'

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
      title:'单据编号',
      align:"center",
      sorter: true,
      dataIndex: 'billNo',
      width:120,
    },
    {
      title:'出入库类型',
      align:"center",
      sorter: true,
      dataIndex: 'stockIoType_dictText',
      width:120,
    },
    // {
    //   title:'单据日期',
    //   align:"center",
    //   sorter: true,
    //   dataIndex: 'billDate',
    //   customRender:function (text) {
    //     return !text?"":(text.length>10?text.substr(0,10):text)
    //   },
    //   width:120,
    // },
    {
      title:'供应商名称',
      align:"center",
      sorter: true,
      dataIndex: 'suppName',
      width:120,
    },
    // {
    //   title:'合同名称',
    //   align:"center",
    //   sorter: true,
    //   dataIndex: 'contractName',
    //   width:120,
    // },
    {
      title:'合同编码',
      align:"center",
      sorter: true,
      dataIndex: 'contractNumber',
      width:120,
      scopedSlots: { customRender: 'contractNumber' }
    },
    {
      title:'项目名称',
      align:"center",
      sorter: true,
      dataIndex: 'projectName',
      width:180,
      scopedSlots: { customRender: 'projectName' }
    },
    {
      title:'物料名称',
      align:"center",
      dataIndex: 'deviceName',
      width:150,
      scopedSlots: { customRender: 'deviceName' }
    },
    {
      title:'设备序号',
      align:"center",
      dataIndex: 'deviceSerialNumber',
      width:150,
      scopedSlots: { customRender: 'deviceSerialNumber' }
    },
    {
      title:'数量',
      align:"center",
      dataIndex: 'qty',
      width:120,
      scopedSlots: { customRender: 'qty' }
    },
    {
      title:'合同数量',
      align:"center",
      sorter: true,
      dataIndex: 'contractQty',
      width:120,
      scopedSlots: { customRender: 'contractQty' }
    },
    // {
    //   title:'业务员',
    //   align:"center",
    //   sorter: true,
    //   dataIndex: 'createBy_dictText',
    //   width:120,
    // },
    {
      title:'仓库名称',
      align:"center",
      sorter: true,
      dataIndex: 'whName',
      width:120,
    },
    {
      title:'入库状态',
      align:"center",
      sorter: true,
      dataIndex: 'status_dictText',
      width:120,
    },
    // {
    //   title:'备注',
    //   align:"center",
    //   dataIndex: 'remark',
    //   width:200,
    // },
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
    name: "StkIoBillList",
    mixins:[JeecgListMixin],
    components: {
      StkIoBillModal,
      ListColumnsSetter,
      ContractBaseModal
    },
    data () {
      return {
        iegAmount,
        columns,
        description: '入库单管理页面',
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
        //     title:'单据编号',
        //     align:"center",
        //     dataIndex: 'billNo',
        //     width:120,
        //   },
        //   {
        //     title:'出入库类型',
        //     align:"center",
        //     dataIndex: 'stockIoType_dictText',
        //     width:120,
        //   },
        //   {
        //     title:'单据日期',
        //     align:"center",
        //     dataIndex: 'billDate',
        //     customRender:function (text) {
        //       return !text?"":(text.length>10?text.substr(0,10):text)
        //     },
        //     width:120,
        //   },
        //   {
        //     title:'供应商名称',
        //     align:"center",
        //     dataIndex: 'suppName',
        //     width:120,
        //   },
        //   {
        //     title:'合同名称',
        //     align:"center",
        //     dataIndex: 'contractName',
        //     width:120,
        //   },
        //   {
        //     title:'项目名称',
        //     align:"center",
        //     dataIndex: 'projectName',
        //     width:120,
        //   },
        //   {
        //     title:'业务员',
        //     align:"center",
        //     dataIndex: 'createBy_dictText',
        //     width:120,
        //   },
        //   {
        //     title:'入库状态',
        //     align:"center",
        //     dataIndex: 'status_dictText',
        //     width:120,
        //   },
        //   // {
        //   //   title:'附件',
        //   //   align:"center",
        //   //   dataIndex: 'attachment',
        //   //   scopedSlots: { customRender: 'attachment' },
        //   //   width:200,
        //   // },
        //   {
        //     title:'备注',
        //     align:"center",
        //     dataIndex: 'remark',
        //     width:200,
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
          list: "/srm/stkIoBill/list",
          delete: "/srm/stkIoBill/delete",
          deleteBatch: "/srm/stkIoBill/deleteBatch",
          exportXlsUrl: "/srm/stkIoBill/exportXls",
          importExcelUrl: "srm/stkIoBill/importExcel",

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
      }
    },
    mounted() {
      this.columnsDrop()
    },
    methods: {
      companyCut(name){
        let company=name.split(";")
        return company
      },
      handleContract(record){
        let that = this;
        //获取合同信息
        let url = "/srm/contractBase/queryById";
        getAction(url,{id:record.contractId}).then(res => {
          let contract = res.result;
          that.$refs.modalForm1.detail(contract);
        })
      },
      handleCost: function (record) {
        this.$refs.modalForm.editCost(record);
        this.$refs.modalForm.title = "编辑";
        this.$refs.modalForm.disableSubmit = true;
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
        params.status = '1'
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
      handleReturn(record){
        this.$refs.modalForm.return(record);
        this.$refs.modalForm.title="详情";
        this.$refs.modalForm.disableSubmit = true;
      },
      handleDetail:function(record){
        this.$refs.modalForm.view(record);
        this.$refs.modalForm.title="详情";
        this.$refs.modalForm.disableSubmit = true;
      },
      handleApprove:function(record){
        this.$refs.modalForm.approve(record);
        this.$refs.modalForm.title="详情";
        this.$refs.modalForm.disableSubmit = true;
      },
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'billNo',text:'单据编号',dictCode:''})
        fieldList.push({type:'string',value:'stockIoType',text:'出入库类型(00:托管入库,01:期初导入,10:盘盈入库)',dictCode:''})
        fieldList.push({type:'date',value:'billDate',text:'单据日期'})
        fieldList.push({type:'string',value:'clerkId',text:'业务员',dictCode:''})
        fieldList.push({type:'string',value:'supplierId',text:'供应商',dictCode:''})
        fieldList.push({type:'string',value:'attachment',text:'附件',dictCode:''})
        fieldList.push({type:'string',value:'remark',text:'备注',dictCode:''})
        fieldList.push({type:'string',value:'billProcStatus',text:'单据处理状态',dictCode:''})
        fieldList.push({type:'date',value:'createTime',text:'创建时间'})
        fieldList.push({type:'int',value:'isEnabled',text:'是否启用',dictCode:'yn'})
        fieldList.push({type:'string',value:'supplierName',text:'供应商名称',dictCode:''})
        fieldList.push({type:'string',value:'contractName',text:'合同名称',dictCode:''})
        fieldList.push({type:'string',value:'projectName',text:'项目名称',dictCode:''})
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