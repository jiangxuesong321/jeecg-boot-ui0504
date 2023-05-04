<template>
  <a-card :bordered="false">
    <div class="card-title">
      付款计划
    </div>
    <div>
      <a-tabs defaultActiveKey="0" v-model="tabKey" @change="handleChange">
        <a-tab-pane tab="已付款" key="1"></a-tab-pane>
        <a-tab-pane tab="待付款" key="0"></a-tab-pane>
      </a-tabs>
    </div>
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
              <a-button type="primary"  icon="download" style="margin-left: 8px" @click="handleExportXls('付款计划')">导出</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <list-columns-setter v-model="columns" :def-columns="columns" style="float: right;z-index:999" />

      <span style="float: right" v-if="totalList != null && totalList.length > 0">
        <a-tag color="orange">
          人民币:{{iegAmount(totalList[0].payAmountCope,'total')}}
        </a-tag>
        <a-tag color="green" >
          美元:{{iegAmount(totalList[0].payAmountUsd,'total')}}
        </a-tag>
        <a-tag color="cyan">
          欧元:{{iegAmount(totalList[0].payAmountEur,'total')}}
        </a-tag>
        <a-tag color="blue">
          日元:{{iegAmount(totalList[0].payAmountJpy,'total')}}
        </a-tag>
      </span>
    </div>
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :customRow="customRow"
        :scroll="{x:1200,y:500}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange">
        <template slot="contractName" slot-scope="text,record">
          <div v-if='text != null && text != "" && text != undefined'>
            <div v-if="text.split('-') != null && text.split('-').length > 0 " style="width: 200px;height: auto;word-wrap: break-word;overflow: hidden; text-overflow: ellipsis;white-space: nowrap;"
                 :title="text.split('-')[0]">
              {{text.split('-')[0]}}
            </div>
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

        <template slot="payStatus_dictText" slot-scope="text,record">
          <a @click="openRecord(record)">{{text}}</a>
        </template>

        <span slot="action" slot-scope="text, record">
          <a  @click='uploadFile(record)' v-if="record.payStatus == '2'">OA附件回传</a>
          <a-divider type="vertical" v-if="record.payStatus == '2'"/>

          <a @click="handleOA(record)" v-if="record.payStatus == '9'">发起OA审批</a>
          <a-divider type="vertical" v-if="record.payStatus == '9'"/>
          <a @click="handleEdit(record)" v-if="record.payStatus == '1'">编辑</a>
          <a-divider type="vertical" v-if="record.payStatus == '1'"/>
          <a @click="handleDetail(record)">详情</a>

          <a-divider type="vertical" v-if="record.payStatus == '0'"/>
          <a @click="handleApprove(record)" v-if="record.payStatus == '0'">手工录入OA节点</a>
        </span>

      </a-table>

      <div :style="dataSource != null && dataSource.length > 0 ? 'z-index:99;margin-top:-43px;' : 'z-index:99;margin-top:10px;'" v-if="tabKey == '0'">
        <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      </div>
    </div>

    <contract-base-modal ref="modalForm1"/>
    <pur-pay-plan-modal ref="modalForm" @ok="modalFormOk"/>
    <approve-modal ref="approveModal" type="OA_PLAN"></approve-modal>

    <a-drawer
      title="OA审批"
      width=40%
      placement="right"
      :closable="false"
      :headerStyle="{ textAlign: 'center'}"
      @close="handleCancel"
      destroyOnClose
      :visible="visible">
      <a-form-model ref="form" :model="model">
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="审核节点" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
              <a-input v-model="model.name"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="审核人" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
              <a-input v-model="model.approver"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="泛微单号" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
              <a-input v-model="model.processCode"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="审核状态" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
              <a-select v-model="model.payStatus" style="width: 100%;">
                <a-select-option value="0">审批中</a-select-option>
                <a-select-option value="2">审批通过</a-select-option>
                <a-select-option value="1">审批驳回</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <div style="text-align: left;">
        <a-button key="cancel" @click="handleCancel"  type="primary" ghost>取消</a-button>
        <a-button  @click="handleOk" type="primary" style="margin-left:10px;" >提交</a-button>
      </div>
    </a-drawer>

    <j-modal
      title="附件管理"
      width="30%"
      :visible="visible1"
      :maskClosable="false"
      switchFullscreen
      :fullscreen="false"
      @cancel="handleClose">
      <template slot="footer">
        <a-button key="submit" @click="handleClose" type="primary" >取消</a-button>
        <a-button key="submit" @click="handleSubmit" type="primary" >提交</a-button>
      </template>
      <j-upload v-model="ruleForm.oaAttachment" :trigger-change="true" ></j-upload>
    </j-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import PurPayPlanModal from './modules/PurPayPlanModal'
  import '@/assets/less/TableExpand.less'
  import { downFile, getAction, httpAction, putAction } from '@api/manage'
  import ListColumnsSetter from '@views/components/ListColumnsSetter'
  import Vue from 'vue'
  import Sortable from 'sortablejs'
  import ApproveModal from '@views/contract/modules/ApproveModal'
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
      title:'付款计划单号',
      align:"center",
      dataIndex: 'code',
      sorter: true,
      width: 120,
    },
    {
      title:'合同名称',
      align:"center",
      dataIndex: 'contractName',
      sorter: true,
      width: 200,
      ellipsis:true,
      scopedSlots: { customRender: 'contractName' }
    },
    {
      title:'合同编码',
      align:"center",
      dataIndex: 'contractNumber',
      sorter: true,
      width: 140,
      scopedSlots: { customRender: 'contractNumber' }
    },
    {
      title:'付款月份',
      align:"center",
      dataIndex: 'planMonth',
      sorter: true,
      width: 120,
    },
    {
      title:'应付(人民币)',
      dataIndex: 'payAmountCope',
      sorter: true,
      width: 120,
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
      title:'应付(美元)',
      dataIndex: 'payAmountUsd',
      sorter: true,
      width: 120,
      // customRender:function (t,r,index) {
      //   return iegAmount(t,'total')
      // }
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
      sorter: true,
      width: 120,
      // customRender:function (t,r,index) {
      //   return iegAmount(t,'total')
      // }
      customRender:function (t,r,index) {
        let icon = "";
        icon = 'Ұ';
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
      sorter: true,
      width: 120,
      // customRender:function (t,r,index) {
      //   return iegAmount(t,'total')
      // }
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
      sorter: true,
      scopedSlots: { customRender: 'payStatus_dictText' },
      width: 120,

    },
    {
      title:'申请人',
      align:"center",
      sorter: true,
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
      width:160,
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
    components: {
      PurPayPlanModal,
      ListColumnsSetter,
      ApproveModal,
      ContractBaseModal
    },
    data () {
      return {
        spans: {
          labelCol1: {span: 3},
          wrapperCol1: {span: 21},
        },
        visible1:false,
        ruleForm:{},
        iegAmount,
        model:{},
        visible:false,
        columns,
        tabKey:'1',
        totalList:[],
        description: '付款计划管理页面',

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
      this.getTotalAmountByCurrency();
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
      customRow(record, index) {
        return {
          style: {
            // 行背景色
            'background-color': index % 2 == 0 ? '#EEEEEE' : '#FFFFFF',
          }
        }
      },
      handleSubmit(){
        let url = "/srm/purPayPlan/uploadOaAttachment";
        let that = this;
        that.$confirm({
          content: `是否确认提交?`,
          onOk: () => {
            putAction(url,that.ruleForm).then(res => {
              if(res.success){
                that.$message.success("提交成功");
                that.handleClose();
              }else{
                that.$message.error("提交失败");
              }
            })
          }
        })
      },
      handleClose(){
        this.visible1 = false;
      },
      uploadFile(record){
        this.ruleForm = {};
        this.visible1 = true;

        this.ruleForm =  JSON.parse(JSON.stringify(record));
      },

      handleOA(record){
        let url = "/srm/purPayPlan/toOa";
        let that = this;
        that.$confirm({
          content: `是否确认提交?`,
          onOk: () => {
            putAction(url,record).then(res => {
              that.$message.success("提交成功");
              that.handleCancel();
              that.searchQuery();
            })
          }
        })

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
      openRecord(record){
        this.$refs.approveModal.visible = true;
        this.$refs.approveModal.loadData(record.id);
      },
      handleCancel(){
        this.visible = false;
      },
      handleOk(){
        let that = this;
        let url = "/srm/purPayPlan/toApprove";
        putAction(url,that.model).then(res => {
          that.$message.success("提交成功");
          that.handleCancel();
          that.searchQuery();
        })
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
      handleExportXls(fileName){
        if(!fileName || typeof fileName != "string"){
          fileName = "导出文件"
        }
        let param = this.getQueryParams();
        if(this.tabKey == '1'){
          param.payStatus = '2';
        }else{
          param.payStatus = '0,1,3,9'
        }
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
        if(this.tabKey == '1'){
          params.payStatus = '2';
        }else{
          params.payStatus = '0,1,3,9'
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