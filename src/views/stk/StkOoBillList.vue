<template>
  <a-card :bordered="false">
    <div class="card-title">
      出库管理
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
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
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
        :scroll="{x:true,y:500}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
        @expand="open"
        :expandedRowKeys="expandedRowKeys">
        <template slot="contractNumber" slot-scope="text,record">
          <a @click="handleContract(record)">{{text}}</a>
        </template>

        <div slot="expandedRowRender" slot-scope="text">
          <div class="rfq-content rfq-content2" style="width: 80%">
            <table>
              <thead>
              <tr>
                <th width="3%">序号</th>
                <th width="10%">物料编码</th>
                <th width="10%">物料名称</th>
                <th width="10%">规格型号</th>
                <th width="10%">出库数量</th>
                <th width="10%">单位</th>
                <th width="10%">厂内编号</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in childList">
                <td style="text-align: center">{{index + 1}}</td>
                <td style="text-align: center">{{item.prodCode}}</td>
                <td style="text-align: center">{{item.prodName}}</td>
                <td style="text-align: center">
                  <div style="width: 180px;height: auto;word-wrap: break-word;overflow: hidden; text-overflow: ellipsis;white-space: nowrap;"
                       :title="item.prodSpecType">
                    {{item.prodSpecType}}
                  </div>
                </td>
                <td style="text-align: right">{{item.qty}}</td>
                <td style="text-align: center">
                  {{item.unitId_dictText}}
                </td>
                <td style="text-align: center">
                  {{item.entryNo}}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </a-table>
    </div>

    <stk-oo-bill-modal ref="modalForm" @ok="modalFormOk"/>
    <contract-base-modal ref="modalForm1"/>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import StkOoBillModal from './modules/StkOoBillModal'
  import '@/assets/less/TableExpand.less'
  import { getAction } from '@api/manage'
  import ListColumnsSetter from '@views/components/ListColumnsSetter'
  import Vue from 'vue'
  import Sortable from 'sortablejs'

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
      title:'单据编号',
      align:"center",
      dataIndex: 'billNo',
      sorter: true,
      width:120,
    },
    {
      title:'出库类型',
      align:"center",
      sorter: true,
      dataIndex: 'stockIoType_dictText',
      width:120,
    },
    {
      title:'单据日期',
      align:"center",
      dataIndex: 'billDate',
      sorter: true,
      customRender:function (text) {
        return !text?"":(text.length>10?text.substr(0,10):text)
      },
      width:120,
    },
    {
      title:'供应商名称',
      align:"center",
      dataIndex: 'suppName',
      sorter: true,
      width:120,
    },
    {
      title:'合同名称',
      align:"center",
      dataIndex: 'contractName',
      sorter: true,
      width:120,
    },
    {
      title:'合同编码',
      align:"center",
      dataIndex: 'contractNumber',
      sorter: true,
      width:120,
      scopedSlots: { customRender: 'contractNumber' }
    },
    {
      title:'项目名称',
      align:"center",
      sorter: true,
      dataIndex: 'projectName',
      width:120,
    },
    {
      title:'业务员',
      align:"center",
      sorter: true,
      dataIndex: 'createBy_dictText',
      width:120,
    },
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
    name: "StkOoBillList",
    mixins:[JeecgListMixin],
    components: {
      StkOoBillModal,
      ListColumnsSetter,
      ContractBaseModal
    },
    data () {
      return {
        columns,
        childList:[],
        expandedRowKeys:[],
        description: '出库单管理页面',
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
        //   },
        //   {
        //     title:'出库类型',
        //     align:"center",
        //     dataIndex: 'stockOoType_dictText',
        //   },
        //   {
        //     title:'单据日期',
        //     align:"center",
        //     dataIndex: 'billDate',
        //     customRender:function (text) {
        //       return !text?"":(text.length>10?text.substr(0,10):text)
        //     },
        //   },
        //   {
        //     title:'仓库',
        //     align:"center",
        //     dataIndex: 'whId_dictText',
        //   },
        //   {
        //     title:'领用人',
        //     align:"center",
        //     dataIndex: 'clerkId_dictText',
        //   },
        // ],
        url: {
          list: "/srm/stkOoBill/list",
          delete: "/srm/stkOoBill/delete",
          deleteBatch: "/srm/stkOoBill/deleteBatch",
          exportXlsUrl: "/srm/stkOoBill/exportXls",
          importExcelUrl: "srm/stkOoBill/importExcel",

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
      handleContract(record){
        let that = this;
        //获取合同信息
        let url = "/srm/contractBase/queryById";
        getAction(url,{id:record.contractId}).then(res => {
          let contract = res.result;
          that.$refs.modalForm1.detail(contract);
        })
      },
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
      open(expanded, row) {
        this.childList = []
        if (expanded) {
          let url = "";
          if(row.stockIoType == '0'){
            url = '/srm/stkOoBill/queryStkOoBillDeliveryByMainId'
          }else if(row.stockIoType == '1'){
            url = '/srm/stkOoBill/queryStkOoBillDeliveryByMainId'
          }
          let param = {
            id: row.id
          }
          getAction(url, param).then(res => {
            this.childList = res.result
          })
          this.expandedRowKeys = []
          this.expandedRowKeys.push(row.id)
        } else {
          this.expandedRowKeys = []
        }
      },
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'billNo',text:'单据编号',dictCode:''})
        fieldList.push({type:'string',value:'stockIoType',text:'出入库类型(00:领料出库,10:盘亏)',dictCode:''})
        fieldList.push({type:'date',value:'billDate',text:'单据日期'})
        fieldList.push({type:'string',value:'clerkId',text:'领用人ID',dictCode:''})
        fieldList.push({type:'string',value:'attachment',text:'附件',dictCode:''})
        fieldList.push({type:'string',value:'remark',text:'备注',dictCode:''})
        fieldList.push({type:'string',value:'whId',text:'仓库ID',dictCode:''})
        fieldList.push({type:'string',value:'equAdd',text:'设备安装点',dictCode:''})
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