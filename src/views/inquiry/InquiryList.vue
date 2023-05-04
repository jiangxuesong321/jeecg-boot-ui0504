<template>
  <a-card :bordered="false">
    <div class="card-title">
      询比价
    </div>
    <a-tabs v-model:activeKey="activeKey" @change="handleChange">
      <a-tab-pane key="0" tab="全部"></a-tab-pane>
      <a-tab-pane key="1" tab="待比价"></a-tab-pane>
      <a-tab-pane key="2" tab="比价中"></a-tab-pane>
      <a-tab-pane key="3" tab="已结束"></a-tab-pane>
    </a-tabs>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="询比价单号">
              <a-input placeholder="请输入询价单号" v-model="queryParam.inquiryCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="询比价名称">
              <a-input placeholder="请输入询比价名称" v-model="queryParam.inquiryName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
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

    <!-- table区域-begin -->
    <div class="table-operator">
      <list-columns-setter v-model="columns" :def-columns="columns" style="float: right;z-index:999" />
    </div>
    <div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        class="j-table-force-nowrap"
        :scroll="{x:true}"
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

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">查看比价</a>

          <a-divider type="vertical" v-if="record.inquiryStatus != '4'"/>
          <a @click="handleCancel(record,'4')" v-if="record.inquiryStatus != '4'">作废</a>

          <!--          <a-divider type="vertical" v-if="record.inquiryStatus == '2' && record.isNotice == '0'"/>-->
          <!--          <a v-if="record.inquiryStatus == '2' && record.isNotice == '0'" @click="sendNotice(record)">发布公告</a>-->

          <a-divider type="vertical" v-if="record.inquiryStatus != '2'"/>
          <a-dropdown v-if="record.inquiryStatus != '2'">
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item v-if="record.inquiryStatus == '1'">
                <a @click="handleStop(record,'3')">暂停</a>
              </a-menu-item>
              <a-menu-item v-if="record.inquiryStatus == '3'">
                <a @click="handleStop(record,'1')">启用</a>
              </a-menu-item>
              <a-menu-item v-if="record.inquiryStatus == '1'">
                <a @click="updateTime(record)">修改结束时间</a>
              </a-menu-item>
              <a-menu-item v-if="record.inquiryStatus != '2'">
                <a @click="handlePush(record)">再次发布需求</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <inquiry-list-modal ref="modalForm" @ok="modalFormOk"/>
    <inquiry-record-form ref="viewForm"  @ok="searchQuery"></inquiry-record-form>
  </a-card>
</template>

<script>

import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import InquiryListModal from './modules/InquiryListModal'
import '@/assets/less/TableExpand.less'
import InquiryRecordForm from '@views/inquiry/modules/InquiryRecordForm'
import { getAction,putAction,postAction } from '@/api/manage'
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
    title:'询比价编码',
    align:"center",
    sorter: true,
    dataIndex: 'inquiryCode',
    width: 120,
  },
  {
    title:'询比价名称',
    align:"center",
    sorter: true,
    dataIndex: 'inquiryName',
    width: 160,
  },
  // {
  //   title:'项目名称',
  //   align:"center",
  //   sorter: true,
  //   dataIndex: 'projectName',
  //   width: 160,
  //   scopedSlots: { customRender: 'projectName' },
  // },
  {
    title:'邀请方式',
    align:"center",
    sorter: true,
    dataIndex: 'invitationMethod_dictText',
    width: 120,
  },
  // {
  //   title:'采购类型',
  //   align:"center",
  //   sorter: true,
  //   dataIndex: 'reqType_dictText',
  //   width: 120,
  // },
  // {
  //   title:'当前轮次',
  //   align:"center",
  //   dataIndex: 'roundNum',
  //   width: 120,
  // },
  {
    title:'询价状态',
    align:"center",
    sorter: true,
    dataIndex: 'inquiryStatus_dictText',
    width: 120,
  },
  {
    title:'发布人',
    align:"center",
    sorter: true,
    dataIndex: 'createUser_dictText',
    width: 120,
  },
  {
    title:'发布时间',
    align:"center",
    sorter: true,
    dataIndex: 'createTime',
    customRender:function (text) {
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
    width: 120,
  },
  {
    title:'报价截止日期',
    align:"center",
    sorter: true,
    dataIndex: 'quotationDeadline',
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
  name: "InquiryListList",
  mixins:[JeecgListMixin],
  components: {
    InquiryListModal,
    InquiryRecordForm,
    ListColumnsSetter
  },
  data () {
    return {
      columns,
      activeKey:'0',
      description: '询价单主表管理页面',
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
      //     title:'询比价编码',
      //     align:"center",
      //     dataIndex: 'inquiryCode',
      //     width: 120,
      //   },
      //   {
      //     title:'询比价名称',
      //     align:"center",
      //     dataIndex: 'inquiryName',
      //     width: 160,
      //   },
      //   {
      //     title:'项目名称',
      //     align:"center",
      //     dataIndex: 'projectName',
      //     width: 160,
      //   },
      //   {
      //     title:'邀请方式',
      //     align:"center",
      //     dataIndex: 'invitationMethod_dictText',
      //     width: 120,
      //   },
      //   {
      //     title:'采购类型',
      //     align:"center",
      //     dataIndex: 'reqType_dictText',
      //     width: 120,
      //   },
      //   {
      //     title:'当前轮次',
      //     align:"center",
      //     dataIndex: 'roundNum',
      //     width: 120,
      //   },
      //   {
      //     title:'询价状态',
      //     align:"center",
      //     dataIndex: 'inquiryStatus_dictText',
      //     width: 120,
      //   },
      //   {
      //     title:'发布人',
      //     align:"center",
      //     dataIndex: 'createUser_dictText',
      //     width: 120,
      //   },
      //   {
      //     title:'发布时间',
      //     align:"center",
      //     dataIndex: 'createTime',
      //     customRender:function (text) {
      //       return !text?"":(text.length>10?text.substr(0,10):text)
      //     },
      //     width: 120,
      //   },
      //   {
      //     title:'报价截止日期',
      //     align:"center",
      //     dataIndex: 'quotationDeadline',
      //     customRender:function (text) {
      //       return !text?"":(text.length>10?text.substr(0,10):text)
      //     },
      //     width: 120,
      //   },
      //   {
      //     title: '操作',
      //     dataIndex: 'action',
      //     align:"center",
      //     width: 147,
      //     scopedSlots: { customRender: 'action' },
      //   }
      // ],
      url: {
        list: "/srm/inquiryList/list",
        delete: "/srm/inquiryList/delete",
        deleteBatch: "/srm/inquiryList/deleteBatch",
        exportXlsUrl: "/srm/inquiryList/exportXls",
        importExcelUrl: "srm/inquiryList/importExcel",

      },
      dictOptions:{},
      superFieldList:[],
    }
  },
  created() {

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
    searchReset() {
      this.queryParam = {};
      if(this.activeKey == '0'){
        this.queryParam.inquiryStatus = 'all';
      }else if(this.activeKey == '1'){
        this.queryParam.inquiryStatus = '0';
      }else if(this.activeKey == '2'){
        this.queryParam.inquiryStatus = '1';
      }else if(this.activeKey == '3'){
        this.queryParam.inquiryStatus = '2';
      }
      this.loadData(1);
    },
    handleCancel(record,status){
      let that = this;
      let url = "/srm/inquiryList/editEntity";
      let param = {
        id:record.id,
        inquiryStatus:status,
      }
      that.$confirm({
        title:"确认操作",
        content:"是否确认提交?",
        onOk: function(){
          putAction(url,param).then(res => {
            if(res.success){
              that.$message.success("提交成功");
              that.searchQuery();
            }else{
              that.$message.error(res.message);
            }
          })
        }
      });
    },
    sendNotice(record){
      let url = "/srm/inquiryList/sendNotice";
      postAction(url,record).then(res => {
        if(res.success){
          this.$message.success("提交成功");
        }else{
          this.$message.error("提交失败");
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
    handlePush(record){
      let that = this;
      let url = "/srm/inquiryList/handlePush";
      let param = {
        id:record.id,
      }
      that.$confirm({
        title:"确认操作",
        content:"是否确认提交?",
        onOk: function(){
          putAction(url,param).then(res => {
            if(res.success){
              that.$message.success("提交成功");
              that.searchQuery();
            }else{
              that.$message.error("提交失败");
            }
          })
        }
      });
    },
    updateTime(record){
      this.$refs.modalForm.editTime(record);
      this.$refs.modalForm.title = "修改结束时间";
      this.$refs.modalForm.disabled = true;
    },
    handleStop(record,status){
      let that = this;
      let url = "/srm/inquiryList/editEntity";
      let param = {
        id:record.id,
        inquiryStatus:status,
      }
      that.$confirm({
        title:"确认操作",
        content:"是否确认提交?",
        onOk: function(){
          putAction(url,param).then(res => {
            if(res.success){
              that.$message.success("提交成功");
              that.searchQuery();
            }else{
              that.$message.error("提交失败");
            }
          })
        }
      });
    },
    handleEdit: function (record) {
      this.$refs.viewForm.edit(record);
      this.$refs.viewForm.title = "查看比价";
      this.$refs.viewForm.disabled = true;
    },
    handleChange(tabKey){
      if(tabKey == '0'){
        this.queryParam.inquiryStatus = 'all';
      }else if(tabKey == '1'){
        this.queryParam.inquiryStatus = '0';
      }else if(tabKey == '2'){
        this.queryParam.inquiryStatus = '1';
      }else if(tabKey == '3'){
        this.queryParam.inquiryStatus = '2';
      }
      this.searchQuery();
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