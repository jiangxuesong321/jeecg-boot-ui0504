<template>
  <a-card :bordered="false">
    <div class="card-title">
      应付管理
    </div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :span='6'>
            <a-form-item label="申请单号">
              <a-input placeholder="请输入申请单号" v-model="queryParam.applyCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span='6'>
            <a-form-item label="付款类型">
              <j-dict-select-tag style="width:100%;" v-model="queryParam.payType" placeholder="付款类型" dictCode="payType" />
            </a-form-item>
          </a-col>
          <a-col :span='6'>
            <a-form-item label="合同">
              <j-dict-select-tag v-model="queryParam.contractId" placeholder="合同" dictCode="contract_base,contract_name,id,del_flag = '0'"/>
            </a-form-item>
          </a-col>
          <a-col :span='6'>
            <a-form-item label="项目">
              <j-dict-select-tag v-model="queryParam.projectId" placeholder="项目" dictCode="proj_base,proj_name,id,del_flag = '0'"/>
            </a-form-item>
          </a-col>
          <a-col :span='6'>
            <a-form-item label="供应商名称">
              <a-input placeholder="请输入供应商名称" v-model="queryParam.suppName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span='6'>
            <a-form-item label="支付方式">
              <j-dict-select-tag style="width:100%;" v-model="queryParam.payMethod" placeholder="支付方式" dictCode="payMethod" />
            </a-form-item>
          </a-col>
          <a-col :span='6'>
            <a-form-item label="币种">
              <j-dict-select-tag style="width:100%;" v-model="queryParam.currency" placeholder="币种" dictCode="currency_type" />
            </a-form-item>
          </a-col>
          <a-col :span='6'>
            <a-form-item label="时间">
              <a-range-picker v-model="queryParam.dateTime" @change="onChange" format="YYYY-MM-DD"/>
            </a-form-item>
          </a-col>

          <a-col :span='6'>
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a-button type="primary"  icon="download" style="margin-left: 8px" @click="handleExportXls('应付管理')">导出</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->
    <div class="table-operator">
      <list-columns-setter v-model="columns" :def-columns="columns" style="float: right;z-index:999" />
      <div style="float: right;margin-right: 10px;margin-top: 7px">
        <span v-for="(item,index) in totalList">
        <a-tag color="orange" v-if="item.currency == 'RMB'">
          人民币:{{iegAmount(item.payAmountOther,'total')}}
        </a-tag>
        <a-tag color="green" v-if="item.currency == 'JPY'">
          日元:{{iegAmount(item.payAmountOther,'total')}}
        </a-tag>
        <a-tag color="cyan" v-if="item.currency == 'USD'">
          美元:{{iegAmount(item.payAmountOther,'total')}}
        </a-tag>
        <a-tag color="blue" v-if="item.currency == 'EUR'">
          欧元:{{iegAmount(item.payAmountOther,'total')}}
        </a-tag>
<!--          <span>{{item.currency_dictText}}合计:<span>{{item.payAmountOther}}</span></span>-->
        </span>
      </div>
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
        @change="handleTableChange">
        <template slot="contractNumber" slot-scope="text,record">
          <a @click="handleContract(record)">{{text}}</a>
        </template>
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
import { downFile, getAction } from '@/api/manage'
import Sortable from 'sortablejs'
import ListColumnsSetter from '@views/components/ListColumnsSetter'
import Vue from 'vue'
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
    width:180,
  },
  {
    title:'供应商名称',
    align:"center",
    dataIndex: 'suppName',
    sorter: true,
    width:180,
  },
  {
    title:'项目名称',
    align:"center",
    dataIndex: 'projectName',
    sorter: true,
    width:160,
  },
  {
    title:'合同名称',
    align:"center",
    dataIndex: 'contractName',
    sorter: true,
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
    title:'申请时间',
    align:"center",
    dataIndex: 'createTime',
    sorter: true,
    width:120,
  },
  {
    title:'币种',
    align:"center",
    dataIndex: 'currency_dictText',
    sorter: true,
    width:120,
  },
  {
    title:'付款类型',
    align:"center",
    dataIndex: 'payType_dictText',
    sorter: true,
    width:120,
  },
  {
    title:'支付方式',
    align:"center",
    dataIndex: 'payMethod_dictText',
    sorter: true,
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
    title:'付款金额原币',
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
    title:'付款金额本币',
    dataIndex: 'payAmount',
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
    title:'备注',
    align:"center",
    dataIndex: 'comment',
    width:200,
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
    name: "PurPayList",
    mixins:[JeecgListMixin],
    components: {
      PurPayApplyModal,
      ListColumnsSetter,
      ContractBaseModal
    },
    data () {
      return {
        iegAmount,
        columns,
        totalList:[],
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
        //     width:180,
        //   },
        //   {
        //     title:'供应商名称',
        //     align:"center",
        //     dataIndex: 'suppName',
        //     width:180,
        //   },
        //   {
        //     title:'项目名称',
        //     align:"center",
        //     dataIndex: 'projectName',
        //     width:160,
        //   },
        //   {
        //     title:'合同名称',
        //     align:"center",
        //     dataIndex: 'contractName',
        //     width:160,
        //   },
        //   {
        //     title:'申请时间',
        //     align:"center",
        //     dataIndex: 'createTime',
        //     width:120,
        //   },
        //   {
        //     title:'币种',
        //     align:"center",
        //     dataIndex: 'currency_dictText',
        //     width:120,
        //   },
        //   {
        //     title:'付款类型',
        //     align:"center",
        //     dataIndex: 'payType_dictText',
        //     width:120,
        //   },
        //   {
        //     title:'支付方式',
        //     align:"center",
        //     dataIndex: 'payMethod_dictText',
        //     width:120,
        //   },
        //   {
        //     title:'付款比例',
        //     align:"center",
        //     dataIndex: 'payRate',
        //     width:120,
        //   },
        //   {
        //     title:'付款金额原币',
        //     align:"center",
        //     dataIndex: 'payAmountOther',
        //     width:120,
        //   },
        //   {
        //     title:'付款金额本币',
        //     align:"center",
        //     dataIndex: 'payAmount',
        //     width:120,
        //   },
        //   {
        //     title:'备注',
        //     align:"center",
        //     dataIndex: 'comment',
        //     width:200,
        //   },
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
        queryParam:{
          applyStatus:'30'
        },
      }
    },
    created() {
      this.getTotalAmountByCurrency();
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
          that.$refs.contractForm.detail(contract);
        })
      },
      handleExportXls(fileName){
        if(!fileName || typeof fileName != "string"){
          fileName = "导出文件"
        }
        let param = this.getQueryParams();
        param.applyStatus = '30';
        param.source = 'actPay';
        param.isPlan = '0';
        downFile(this.url.exportXlsUrl,param).then((data)=>{
          if (!data) {
            this.$message.warning("文件下载失败")
            return
          }
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data],{type: 'application/vnd.ms-excel'}), fileName+'.xls')
          }else{
            let url = window.URL.createObjectURL(new Blob([data],{type: 'application/vnd.ms-excel'}))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName+'.xls')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link); //下载完成移除元素
            window.URL.revokeObjectURL(url); //释放掉blob对象
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
        let url = "/srm/purPayApply/getTotalAmountByCurrency";
        let params = this.getQueryParams();//查询条件
        params.applyStatus = '30';
        params.source = 'actPay';
        params.isPlan = '0';
        getAction(url,params).then(res => {
          this.totalList = res.result;
        })
      },
      onChange(date, dateString) {
        this.queryParam.startTime = dateString[0] + " 00:00:00";
        this.queryParam.endTime = dateString[1] + " 23:59:59";
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
        params.applyStatus = '30';
        params.source = 'actPay';
        params.isPlan = '0';
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