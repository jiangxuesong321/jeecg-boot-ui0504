<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->

    <!-- 	<div class="card-title">
        供应商管理
      </div> -->
    <div class="card-title">
      供应商库
    </div>
    <a-tabs v-model:activeKey="activeKey" @change="handleChange">
      <a-tab-pane key="0" tab="全部"></a-tab-pane>
      <a-tab-pane key="1" tab="待审核"></a-tab-pane>
      <a-tab-pane key="2" tab="合格供应商"></a-tab-pane>
      <a-tab-pane key="3" tab="已失效"></a-tab-pane>
      <a-tab-pane key="4" tab="黑名单"></a-tab-pane>
    </a-tabs>

    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="供应商名称">
              <a-input placeholder="请输入供应商名称" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="供应商编码">
              <a-input placeholder="供应商编码" v-model="queryParam.code"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="供应商属性">
              <j-dict-select-tag type="select" v-model="queryParam.supplierProp" dictCode="supp_prop" placeholder="请选择供应商属性" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="服务范围">
              <j-dict-select-tag type="select" v-model="queryParam.supplierType" dictCode="supp_type" placeholder="请选择服务范围" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24" v-if="activeKey == '0'">
            <a-form-item label="供应商状态">
              <j-dict-select-tag type="select" v-model="queryParam.status" dictCode="supp_status" placeholder="请选择状态" @change="setVal"/>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24" v-if="activeKey != '0'">
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: right;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a-button type="primary" icon="download" @click="handleExportXls('供应商基本信息')" style="margin-left: 8px">导出</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">

      <!--      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">-->
      <!--        <a-button type="primary" icon="import">导入</a-button>-->
      <!--      </a-upload>-->
      <!-- 高级查询区域 -->
      <!--      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
           -->
      <list-columns-setter v-model="columns" :def-columns="columns" style="float: right;z-index:999"/>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-row>
        <a-col :span="4">
          内贸供应商数量:{{total.gn}}
        </a-col>
        <a-col :span="4">
          外贸供应商数量:{{total.gw}}
        </a-col>
        <a-col :span="4">
          代理供商数量:{{total.dl}}
        </a-col>
        <a-col :span="4">
          制造商数量:{{total.zzs}}
        </a-col>
        <a-col :span="4">
          合同数量:{{total.contract}}
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="4">
          执行中合同数量:{{total.contracting}}
        </a-col>
        <a-col :span="4">
          正常供应商数量:{{total.normal}}
        </a-col>
        <a-col :span="4">
          黑名单供应商数量:{{total.black}}
        </a-col>
        <a-col :span="4">
          活跃供应商数量:{{total.active}}
        </a-col>
      </a-row>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :scroll="{x:1200, y:500}"
        :key="key"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :components="components"
        :loading="loading"
        @change="handleTableChange">

        <template slot="resume" slot-scope="text,record">
          <a @click="toResume(record)">查看履历</a>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleApprove(record)" v-if="record.status == '0' && isDisabled">审核</a>
          <a-divider type="vertical" v-if="record.status == '0'  && isDisabled"/>

          <a @click="handleEdit(record)" v-if="record.status == '1'  || record.status == '6'">编辑</a>

          <a-divider type="vertical" v-if="record.status == '1'  || record.status == '6'"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>

              <a-menu-item>
                <a @click="handleResume(record)">新增履历</a>
              </a-menu-item>

              <a-menu-item>
                <a @click="handleAssessment(record)">供应商考核指标</a>
              </a-menu-item>
              <a-menu-item v-if=" record.status == '6'">
                <a-popconfirm title="确定停用吗?" @confirm="() => handleStop(record)">
                  <a>停用</a>
                </a-popconfirm>
              </a-menu-item>

              <a-menu-item v-if="record.status == '4'">
                <a-popconfirm title="确定启用吗?" @confirm="() => handleEnable(record)">
                  <a>启用</a>
                </a-popconfirm>
              </a-menu-item>

                             <a-menu-item v-if="record.status == '6'">
                              <a-popconfirm title="确定拉黑吗?" @confirm="() => handleBlack(record)">
                                <a>拉黑</a>
                              </a-popconfirm>
                            </a-menu-item>

              <a-menu-item v-if="record.status == '6'">
                <a @click="handleFrozen(record)">冻结</a>
              </a-menu-item>

              <a-menu-item v-if="record.status == '7'">
                  <a @click="handleReNew(record)">续费</a>
              </a-menu-item>

              <a-menu-item v-if="isNullOrEmpty(record.sysAccount) && record.status == '1'">
                  <a @click="handleSetAccount(record)">账号设置</a>
              </a-menu-item>

              <a-menu-item v-if="isNotNullOrEmpty(record.sysAccount) && record.status == '6'">
                  <a @click="handleReSetAccount(record)">密码重置</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
      <div :style="dataSource != null && dataSource.length > 0 ? 'z-index:99;margin-top:-43px;' : 'z-index:99;margin-top:10px;'">
        <a-button @click="handleAdd" type="primary" icon="plus" v-show="activeKey == '0'">新增</a-button>
        <a-button type="primary" @click="createBatchAccount"  style="margin-left: 8px">批量开通账号</a-button>
      </div>
    </div>

    <bas-supplier-modal ref="modalForm" @ok="modalFormOk"/>
    <bas-supplier-detail-modal ref="detailForm"></bas-supplier-detail-modal>
    <bas-supplier-assessment ref="assessmentForm"></bas-supplier-assessment>
    <bas-supplier-assessment-modal ref="assessmentModal" @ok="modalFormOk" visible="false"></bas-supplier-assessment-modal>
    <bas-supplier-account-modal ref="modalAccountForm" @ok="modalFormOk"/>
    <bas-supplier-reset-account-modal ref="modalResetAccountForm" @ok="modalFormOk"></bas-supplier-reset-account-modal>

    <a-drawer
      title="履历"
      :width="width"
      placement="right"
      :closable="false"
      destroyOnClose
      :visible="visible2">
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :scroll="{x:true, y:500}"
        :columns="columns1"
        :dataSource="resumeList"
        :pagination="false"
        :loading="loading">
      </a-table>
      <div class="drawer-footer" style="text-align: center;margin-top:15px;">
        <a-button key="cancel" @click="close" style="margin-left:10px;" type="primary" ghost>取消</a-button>
      </div>
    </a-drawer>

    <a-drawer
      title="履历"
      :width="width"
      placement="right"
      :closable="false"
      destroyOnClose
      :visible="visible1">
      <j-form-container >
        <a-form-model ref="form1" :model="model" slot="detail">
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="备注" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
                <a-input v-model="model.remark" placeholder="请输入备注" type="textarea"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :span="24">
              <a-form-model-item label="附件" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
                <j-upload v-model="resumeAttrUrl" :trigger-change="true"></j-upload>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </j-form-container>
      <div class="drawer-footer" style="text-align: center;margin-top:15px;">
        <a-button key="approved" @click="toSubmit" type="primary">提交</a-button>
        <a-button key="cancel" @click="handleClose" style="margin-left:10px;" type="primary" ghost>取消</a-button>
      </div>
    </a-drawer>

    <a-drawer
      title="冻结"
      :width="width"
      placement="right"
      :closable="false"
      destroyOnClose
      :visible="visible">
      <!-- 主表单区域 -->
      <j-form-container >
        <a-form-model ref="form" :model="model" slot="detail">
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="供应商代码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="code">
                <a-input v-model="model.code" placeholder="请输入供应商代码" disabled></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="供应商名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
                <a-input v-model="model.name" placeholder="请输入供应商名称" disabled></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="供应商有效期" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-date-picker v-model="model.startTime" placeholder="请输入开始日期" style="width: 47%" disabled/>
                ---
                <a-date-picker v-model="model.endTime" placeholder="请输入结束日期" style="width: 47%" disabled/>
              </a-form-model-item>
            </a-col>

            <a-col :span="24">
              <a-form-model-item label="冻结日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-date-picker v-model="model.fnStartTime" placeholder="请输入开始日期" style="width: 47%" />
                ---
                <a-date-picker v-model="model.fnEndTime" placeholder="请输入结束日期" style="width: 47%" />
              </a-form-model-item>
            </a-col>

          </a-row>
        </a-form-model>
      </j-form-container>
      <div class="drawer-footer" style="text-align: center;margin-top:15px;">
        <a-button key="approved" @click="handleOk" type="primary">冻结</a-button>
        <a-button key="cancel" @click="handleCancel" style="margin-left:10px;" type="primary" ghost>取消</a-button>
      </div>
    </a-drawer>
  </a-card>
</template>

<script>
import { getAction, putAction,postAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import BasSupplierModal from './modules/BasSupplierModal'
import BasSupplierDetailModal from '@views/base/modules/BasSupplierDetailModal'
import '@/assets/less/TableExpand.less'
import { isNotNullOrEmpty, isNullOrEmpty } from '@/utils/util'
import BasSupplierAccountModal from './modules/BasSupplierAccountModal'
import ListColumnsSetter from '@views/components/ListColumnsSetter'
import Vue from 'vue'
import Sortable from 'sortablejs'
import BasSupplierResetAccountModal from '@views/base/modules/BasSupplierResetAccountModal'
import BasSupplierAssessment from '@views/base/BasSupplierAssessmentList'
import BasSupplierAssessmentModal from './modules/BasSupplierAssessmentModal'

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
    title:'供应商编号',
    align:"center",
    dataIndex: 'code',
    width:120,
    sorter: true,
  },
  {
    title:'供应商名称',
    align:"center",
    dataIndex: 'name',
    width:200,
    sorter: true,
  },
  {
    title:'供应商区域',
    align:"center",
    dataIndex: 'supplierPropDict',
    width:100,
    sorter: true,
  },
  {
    title:'供应商等级',
    align:"center",
    dataIndex: 'supplierGradeDict',
    width:160,
    ellipsis: true,
  },
  {
    title:'服务范围',
    align:"center",
    dataIndex: 'supplierTypeDict',
    width:160,
    ellipsis: true,
  },
  {
    title:'注册资本(万元)',
    align:"center",
    dataIndex: 'registerCapital',
    width:140,
    sorter: true,
  },
  {
    title:'注册资本币种',
    align:"center",
    dataIndex: 'registerCurrency_dictText',
    width:120,
    sorter: true,
  },
  // {
  //   title:'法人代表',
  //   align:"center",
  //   dataIndex: 'corporate'
  // },
  {
    title:'默认联系人',
    align:"center",
    dataIndex: 'contacter',
    width:120,
    sorter: true,
  },
  {
    title:'联系方式',
    align:"center",
    dataIndex: 'contacterTel',
    width:120,
    sorter: true,
  },
  // {
  //   title:'合同数量',
  //   align:"center",
  //   dataIndex: 'contractNumber',
  //   width:120,
  //   sorter: true,
  // },
  // {
  //   title:'执行中合同数量',
  //   align:"center",
  //   dataIndex: 'contractingNumber',
  //   width:120,
  //   sorter: true,
  // },
  // {
  //   title:'合同金额',
  //   align:"center",
  //   dataIndex: 'contractAmountTaxLocal',
  //   width:120,
  //   sorter: true,
  // },
  // {
  //   title:'已付款金额',
  //   align:"center",
  //   dataIndex: 'payAmountTaxLocal',
  //   width:120,
  //   sorter: true,
  // },
  {
    title:'到期日',
    align:"center",
    dataIndex: 'endTime',
    width:120,
    sorter: true,
  },
  {
    title:'状态',
    align:"center",
    dataIndex: 'status_dictText',
    width:120,
    sorter: true,
  },
  {
    title:'履历',
    align:"center",
    dataIndex: 'resume',
    width:120,
    scopedSlots: { customRender: 'resume' },
  },
  {
    title: '操作',
    dataIndex: 'action',
    align:"center",
    width:120,
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
  const {key, ...restProps} = props;
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
  name: "BasSupplierList",
  mixins:[JeecgListMixin],
  components: {
    BasSupplierModal,
    BasSupplierAccountModal,
    ListColumnsSetter,
    BasSupplierResetAccountModal,
    BasSupplierDetailModal,
    BasSupplierAssessment,
    BasSupplierAssessmentModal
  },
  data () {
    this.components = {
      header: {
        cell: ResizeableTitle,
      },
    };
    return {
      resumeList:[],
      visible2:false,
      visible1:false,
      isDisabled:false,
      labelCol1: {span: 2},
      wrapperCol1: {span: 22},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      width:'40%',
      visible:false,
      columns,
      key: 0,
      options:[],
      activeKey:'0',
      isNullOrEmpty,
      isNotNullOrEmpty,
      description: '供应商基本信息管理页面',
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
          title:'备注',
          align:"center",
          dataIndex: 'remark',
          width: 200,
        },
        {
          title:'创建时间',
          align:"center",
          dataIndex: 'createTime',
          width: 120,
        },
        {
          title:'附件',
          align:"center",
          dataIndex: 'filePath',
          customRender: (text) => {
            return <j-upload vModel={text} disabled style={{width: '200px'}}></j-upload>
          }
        },
      ],
      url: {
        list: "/srm/basSupplier/list",
        delete: "/srm/basSupplier/delete",
        deleteBatch: "/srm/basSupplier/deleteBatch",
        exportXlsUrl: "/srm/basSupplier/exportXls",
        importExcelUrl: "srm/basSupplier/importExcel",
      },
      dictOptions:{},
      superFieldList:[],
      model:{},
      total:{
        gn:0,
        gw:0,
        dl:0,
        zzs:0,
        contract:0,
        contracting:0,
        normal:0,
        black:0,
        active:0
      },

      // resume related
      resumeAttrUrl: '',
    }
  },
  created() {
    this.fetchNum();
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
  mounted() {
    this.columnsDrop(),
      this.checkApprove()
  },
  methods: {
    searchQuery() {
      this.loadData(1);
      this.fetchNum();
    },
    fetchNum(){
      this.total = {
        gn:0,
        gw:0,
        dl:0,
        zzs:0,
        contract:0,
        contracting:0,
        normal:0,
        black:0,
        active:0
      };
      let params = this.getQueryParams();//查询条件
      //供应商属性(国内、国外)
      let url = "/srm/basSupplier/fetchSuppCategory";
      getAction(url,params).then(res => {
        let data = res.result;
        if(data != null && data.length > 0){
          data.filter(item => {
            if(item.supplierProp == 'gn'){
              this.total.gn = item.num;
            }else if(item.supplierProp == 'gw'){
              this.total.gw = item.num;
            }
          })
        }
      })


      //供应商分类
      url = "/srm/basSupplier/fetchSuppType";
      getAction(url,params).then(res => {
        let data = res.result;
        if(data != null && data.length > 0){
          data.filter(item => {
            if(item.supplierType == '2'){
              this.total.dl = item.num;
            }else if(item.supplierType == '0'){
              this.total.zzs = item.num;
            }
          })
        }
      })

      //供应商合同
      url = "/srm/basSupplier/fetchSuppContract";
      getAction(url,params).then(res => {
        let data = res.result;
        if(data != null){
          this.total.contract = data.num;
        }
      })

      //供应商合同
      url = "/srm/basSupplier/fetchSuppContracting";
      getAction(url,params).then(res => {
        let data = res.result;
        if(data != null){
          this.total.contracting = data.num;
        }
      })

      //供应商状态
      url = "/srm/basSupplier/fetchSuppStatus";
      getAction(url,params).then(res => {
        let data = res.result;
        if(data != null && data.length > 0){
          data.filter(item => {
            if(item.status == '0'){
              this.total.black = item.num;
            }else if(item.status == '1'){
              this.total.normal = item.num;
            }
          })
        }
      })

      //供应商状态
      url = "/srm/basSupplier/fetchSuppActive";
      getAction(url,params).then(res => {
        let data = res.result;
        if(data != null ){
          this.total.active = data.num;
        }
      })
    },

    createBatchAccount(){
      let url = "/srm/basSupplier/createBatchSrmAccount";
      postAction(url).then(res => {

      })
    },
    setVal(){
      this.$forceUpdate();
    },
    close(){
      this.visible2 = false;
    },
    toResume(record){
      this.visible2 = true;
      let url = "/srm/basSupplierResume/list";
      let param = {
        suppId:record.id,
      }
      getAction(url,param).then(res => {
        this.resumeList = res.result;
      })
    },
    toSubmit(){
      let that = this;
      if(isNullOrEmpty(that.model.remark)){
        that.$message.error("请输入备注");
        return;
      }
      let url = "/srm/basSupplierResume/add";
      let param = {
        suppId:that.model.id,
        remark:that.model.remark,
        filePath: this.resumeAttrUrl,
      }
      that.$confirm({
        title: "",
        content: "是否确认提交?",
        onOk: function () {
          postAction(url,param).then(res => {
            if(res.success){
              that.$message.success("提交成功");
              that.handleClose();
              that.searchQuery();
            }else{
              that.$message.error("提交失败");
            }
          })
        }
      });
    },
    handleClose(){
      this.visible1 = false;
    },
    handleResume(record){
      this.visible1 = true;
      this.model = record;
      this.model.remark = '';
      this.resumeAttrUrl = '';
    },
    checkApprove() {
      let url = "/srm/approveSetting/checkApprove";
      getAction(url, {type:'supp'}).then(res => {
        if(res.success){
          this.isDisabled = res.result;
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
    handleApprove: function (record) {
      this.$refs.modalForm.approve(record);
      this.$refs.modalForm.title = "审核";
      this.$refs.modalForm.disableSubmit = true;
    },
    handleDetail:function(record){
      this.$refs.detailForm.edit(record);
      this.$refs.detailForm.title="详情";
      this.$refs.detailForm.disableSubmit = true;
    },
    handleAssessment:function(record){
// this.$refs.assessmentModal.add(record);
//       this.$refs.assessmentModal.setData(record);
      this.$refs.assessmentModal.visible=false;
      // this.$refs.assessmentForm.title="供应商考核指标";
      this.$refs.assessmentForm.visible=true;
      // this.$refs.assessmentForm.setData(record);
      // this.$refs.assessmentForm.disableSubmit = true;
    },
    searchReset() {
      this.queryParam = {};

      if(this.activeKey == '0'){
        this.queryParam.status = '';
      }else if(this.activeKey == '1'){
        this.queryParam.status = '0';
      }else if(this.activeKey == '2'){
        this.queryParam.status = '6';
      }else if(this.activeKey == '3'){
        this.queryParam.status = '7';
      }else if(this.activeKey == '4'){
        this.queryParam.status = '5';
      }else if(this.activeKey == '5'){
        this.queryParam.status = '4';
      }else if(this.activeKey == '6'){
        this.queryParam.status = '3';
      }
      this.fetchNum();
      this.loadData(1);
    },
    handleCancel(){
      this.visible = false;
    },
    handleOk(){
      let that = this;
      let url = "/srm/basSupplier/editEntity";
      let row = that.model;
      row.status = '3';
      if(isNullOrEmpty(that.model.fnStartTime)){
        that.$message.error("请输入冻结开始时间");
        return;
      }
      if(isNullOrEmpty(that.model.fnEndTime)){
        that.$message.error("请输入冻结结束时间");
        return;
      }
      that.$confirm({
        title: '是否确认提交?',
        content: '',
        onOk() {
          putAction(url,row).then(res => {
            that.$message.success("提交成功");
            that.searchQuery();
            that.handleCancel();
          })
        },
        onCancel() {}
      })
    },
    handleFrozen(record){
      this.visible = true;
      let row = JSON.parse(JSON.stringify(record));
      this.model = row;
      this.model.fStartTime = null;
      this.model.fEndTime = null;
    },
    handleBlack(record){
      let url = "/srm/basSupplier/editEntity";
      let row = JSON.parse(JSON.stringify(record));
      row.status = '5';
      putAction(url,row).then(res => {
        this.$message.success("提交成功");
        this.searchQuery();
      })
    },
    handleEnable(record){
      let url = "/srm/basSupplier/editEntity";
      let row = JSON.parse(JSON.stringify(record));
      row.status = '6';
      putAction(url,row).then(res => {
        this.$message.success("提交成功");
        this.searchQuery();
      })
    },
    handleStop(record){
      let url = "/srm/basSupplier/editEntity";
      let row = JSON.parse(JSON.stringify(record));
      row.status = '4';
      putAction(url,row).then(res => {
        this.$message.success("提交成功");
        this.searchQuery();
      })
    },
    handleChange(tabKey){
      if(tabKey == '0'){
        this.queryParam.status = '';
      }else if(tabKey == '1'){
        this.queryParam.status = '0';
      }else if(tabKey == '2'){
        this.queryParam.status = '6';
      }else if(tabKey == '3'){
        this.queryParam.status = '7';
      }else if(tabKey == '4'){
        this.queryParam.status = '5';
      }else if(tabKey == '5'){
        this.queryParam.status = '4';
      }else if(tabKey == '6'){
        this.queryParam.status = '3';
      }
      this.searchQuery();
    },
    getFilterOptions() {
    },
    // 列拖拽的初始化~~~~
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
    handleReNew(record){
      let row = JSON.parse(JSON.stringify(record));
      row.startTime = null;
      row.endTime = null;
      row.payTime = null;
      this.$refs.modalAccountForm.openModal(row,'1')
    },
    handleReSetAccount(record){
      this.$refs.modalResetAccountForm.openModal(record)
    },
    handleSetAccount(record) {
      let row = JSON.parse(JSON.stringify(record));
      this.$refs.modalAccountForm.openModal(row,'0')
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
  margin-top:40px;
}
</style>