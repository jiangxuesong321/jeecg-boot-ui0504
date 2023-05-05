<template>
  <a-card :bordered="false">
    <div class="card-title">
      招标列表
    </div>
    <div>
      <!-- <a-tabs defaultActiveKey="all" v-model="tabKey" @change="handleChange">
       <a-tab-pane tab="全部" key="all"></a-tab-pane>
     <a-tab-pane tab="待开标" key="0"></a-tab-pane>
       <a-tab-pane tab="已开标" key="1"></a-tab-pane>
        <a-tab-pane tab="评标" key="2"></a-tab-pane>
     <a-tab-pane tab="定标" key="3"></a-tab-pane>
     </a-tabs> -->
      <a-steps defaultActiveKey="all" progress-dot :current=1 v-model="tabKey" @change="handleChange">
        <a-step title="全部" />
        <a-step title="待开标" />
        <a-step title="已开标"  />
        <a-step title="评标" />
        <a-step title="定标"  />
      </a-steps>
    </div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="招标名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input placeholder="请输入招标名称" v-model="queryParam.biddingName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="招标编码" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input placeholder="请输入招标编码" v-model="queryParam.biddingNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="招标类型" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <!--              <a-input placeholder="请输入招标类型" v-model="queryParam.biddingNo"></a-input>-->
              <j-dict-select-tag type="select" v-model="queryParam.biddingType" dictCode="bidding_type"
                placeholder="请输入招标类型" />
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
      <a-table ref="table" size="middle" bordered rowKey="id" class="j-table-force-nowrap" :scroll="{ x: true }"
        :columns="columns" :dataSource="dataSource" :pagination="ipagination" :loading="loading"
        @change="handleTableChange">

        <template slot="projName" slot-scope="text,record">
          <div style="width: 180px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="text">
            {{ text }}
          </div>
        </template>

        <template slot="biddingName" slot-scope="text,record">
          <div style="width: 180px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="text">
            {{ text }}
          </div>
        </template>

        <template slot="biddingNo" slot-scope="text,record">
          <a @click="openBidding(record, 'view')">{{ text }}</a>
        </template>

        <span slot="action" slot-scope="text, record">
          <span v-if="record.biddingStatus != '4'">
            <a @click="giveUp(record)">废标</a>
            <a-divider type="vertical" />
          </span>
          <span v-if="record.biddingStatus == '0'">
            <a @click="toChange(record)">发布变更</a>
            <a-divider type="vertical" />
            <a @click="toChange(record)">专家调整</a>
            <a-divider type="vertical" />
          </span>
          <!--          <span v-if="record.biddingStatus == '1'">-->
          <!--            <div>-->
          <!--              <a @click="frozen(record)">冻结</a>-->
          <!--              <a-divider type="vertical"/>-->
          <!--              <a @click="stop(record)">暂停</a>-->
          <!--            </div>-->
          <!--           </span>-->
          <a @click="openBidding(record, 'edit')" v-if="record.biddingStatus == '0'">开标</a>
          <a-divider type="vertical" v-if="record.biddingStatus == '0'" />
          <a v-if="record.biddingStatus == '3'" @click="handleFix(record)">查看定标结果</a>
          <a-divider type="vertical" v-if="record.biddingStatus == '3'" />
          <!--           <a v-if="record.biddingStatus == '3' && record.isNotice == '0'" @click="sendNotice(record)">发布公告</a>-->
          <!--           <a-divider type="vertical" v-if="record.biddingStatus == '3' && record.isNotice == '0'"/>-->
          <!--招标详情-->
          <a @click="handleEdit(record, '0')">查看详情</a>
          <!--招标汇总-->
          <a-divider type="vertical" v-if="record.biddingStatus != '0'" />
          <a @click="handleEdit(record, '1')" v-if="record.biddingStatus != '0'">评标详情</a>

          <a-divider type="vertical" v-if="record.biddingStatus == '8'" v-has="'bidding:sure'" />
          <a @click="handleOpen(record, '2')" v-if="record.biddingStatus == '8'" v-has="'bidding:sure'">进入定标</a>

          <a-divider type="vertical" v-if="record.biddingStatus == '8' || record.biddingStatus == '2'" />
          <a @click="openProfessionals(record, '2')"
            v-if="record.biddingStatus == '8' || record.biddingStatus == '2'">重新评标</a>
        </span>

      </a-table>
    </div>

    <bidding-main-modal ref="modalForm" @ok="modalFormOk" />
    <open-bidding-form ref="openForm" @ok="modalFormOk"></open-bidding-form>
    <bidding-main-to-evaluate-form ref="evaluateForm" @ok="modalFormOk"></bidding-main-to-evaluate-form>
    <fix-bidding-form ref="fixForm" @ok="modalFormOk"></fix-bidding-form>

    <a-modal title="重新评标" width="30%" :visible="visible1" @ok="toSubmit" @cancel="toCancel">
      <a-row>
        <a-col :span="4">
          <span>
            评标人员:
          </span>
        </a-col>
        <a-col :span="8">
          <a-select style="width: 100%" v-model="ruleForm.professionalId">
            <a-select-option v-for="(item, index) in userList" :key="item.professionalId" :value="item.professionalId">
              {{ item.professionalName }}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </a-modal>


    <a-modal title="废标原因" width="30%" :visible="toFail" @ok="submitToFail" @cancel="cancelToFail">
      <div>
        <span style="float: left">
          废标原因:
        </span>
        <a-input type="textarea" v-model="nowRow.reason" style="width: 70%"></a-input>
      </div>
    </a-modal>

    <a-modal title="流标原因" width="30%" :visible="toFlow" @ok="submitToFlow" @cancel="cancelToFlow">
      <div>
        <span style="float: left">
          流标原因:
        </span>
        <a-input type="textarea" v-model="nowRow.reason" style="width: 70%"></a-input>
      </div>
    </a-modal>

    <a-modal title="冻结原因" width="30%" :visible="toFrozen" @ok="submitToFrozen" @cancel="cancelToFrozen">
      <div>
        <span style="float: left">
          冻结原因:
        </span>
        <a-input type="textarea" v-model="nowRow.reason" style="width: 70%"></a-input>
      </div>
    </a-modal>

    <a-modal title="暂停原因" width="30%" :visible="toStop" @ok="submitToStop" @cancel="cancelToStop">
      <div>
        <span style="float: left">
          暂停原因:
        </span>
        <a-input type="textarea" v-model="nowRow.reason" style="width: 70%"></a-input>
      </div>
    </a-modal>
  </a-card>
</template>

<script>

import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import BiddingMainModal from './modules/BiddingMainModal'
import '@/assets/less/TableExpand.less'
import { billListMixin } from '../mixins/billListMixin'
import { billModalMixin } from '../mixins/billModalMixin'
import JEllipsis from '@/components/jeecg/JEllipsis'
import OpenBiddingForm from '@views/bidding/modules/OpenBiddingForm'
import { postAction, putAction, getAction, httpAction } from '@api/manage'
import { isNullOrEmpty } from '@/utils/util'
import BiddingMainToEvaluateForm from '@views/bidding/modules/BiddingMainToEvaluateForm'
import FixBiddingForm from '@views/bidding/modules/FixBiddingForm'
import Sortable from 'sortablejs'
import Vue from 'vue'
import ListColumnsSetter from '@views/components/ListColumnsSetter'
let columns = [
  {
    title: '序号',
    dataIndex: '',
    key: 'rowIndex',
    width: 60,
    align: 'center',
    customRender: function (t, r, index) {
      return parseInt(index) + 1
    }
  },
  {
    title: '招标编码',
    align: 'center',
    dataIndex: 'biddingNo',
    width: 120,
    sorter: true,
    scopedSlots: { customRender: 'biddingNo' }
  },
  {
    title: '招标名称',
    align: 'center',
    sorter: true,
    dataIndex: 'biddingName',
    width: 180,
    scopedSlots: { customRender: 'biddingName' }
  },
  {
    title: '项目名称',
    align: 'center',
    sorter: true,
    dataIndex: 'projName',
    width: 180,
    scopedSlots: { customRender: 'projName' }
  },
  {
    title: '招标类型',
    align: 'center',
    sorter: true,
    dataIndex: 'biddingType_dictText',
    width: 120,
  },
  {
    title: '招标状态',
    align: 'center',
    sorter: true,
    dataIndex: 'biddingStatus_dictText',
    width: 120,
  },
  {
    title: '发布时间',
    align: 'center',
    dataIndex: 'createTime',
    sorter: true,
    customRender: function (text) {
      return !text ? '' : (text.length > 10 ? text.substr(0, 10) : text)
    },
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: 147,
    scopedSlots: { customRender: 'action' }
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
  name: 'BiddingMainList',
  mixins: [JeecgListMixin, billListMixin, billModalMixin],
  components: {
    BiddingMainModal,
    JEllipsis,
    OpenBiddingForm,
    BiddingMainToEvaluateForm,
    FixBiddingForm,
    ListColumnsSetter

  },
  data() {
    return {
      ruleForm: {
        professionalId: '',
        biddingId: ''
      },
      userList: [],
      visible1: false,
      columns,
      toStop: false,
      toFrozen: false,
      toFlow: false,
      nowRow: {},
      toFail: false,
      queryParam: {
        biddingStatus: 'all'
      },
      tabKey: 'all',
      description: '招标主表管理页面',
      // 表头
      // columns: [
      //   {
      //     title: '序号',
      //     dataIndex: '',
      //     key: 'rowIndex',
      //     width: 60,
      //     align: 'center',
      //     customRender: function(t, r, index) {
      //       return parseInt(index) + 1
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
      //     align: 'center',
      //     width: 147,
      //     scopedSlots: { customRender: 'action' }
      //   }
      // ],
      url: {
        list: '/srm/biddingMain/pageList',
        delete: '/srm/biddingMain/delete',
        deleteBatch: '/srm/biddingMain/deleteBatch',
        exportXlsUrl: '/srm/biddingMain/exportXls',
        importExcelUrl: 'srm/biddingMain/importExcel'

      },
      dictOptions: {},
      superFieldList: []
    }
  },
  created() {

  },
  mounted() {
    this.columnsDrop()
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    toSubmit() {
      let that = this;
      let professionalId = that.ruleForm.professionalId;
      if (isNullOrEmpty(professionalId)) {
        that.$message.error("请选择需要退回的评标人员");
        return;
      }
      let url = "/srm/biddingMain/toProfessionals";
      that.$confirm({
        content: `是否确认提交`,
        onOk: () => {
          postAction(url, that.ruleForm).then(res => {
            if (res.success) {
              that.$message.success("提交成功");
              that.toCancel();
              that.searchQuery();
            } else {
              that.$message.error("提交失败");
            }
          })
        }
      })

    },
    toCancel() {
      this.visible1 = false;
    },
    openProfessionals(record) {
      this.visible1 = true;
      this.ruleForm.professionalId = "";
      this.ruleForm.biddingId = record.id;
      let url = "/srm/biddingMain/fetchHasProfessionals";
      getAction(url, { id: record.id }).then(res => {
        this.userList = res.result;
      })
    },
    sendNotice(record) {
      let url = "/srm/biddingMain/sendNotice";
      postAction(url, record).then(res => {
        if (res.success) {
          this.$message.success("提交成功");
        } else {
          this.$message.success("提交失败");
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
    handleFix(record) {
      this.$refs.fixForm.edit(record, 'view');
    },
    handleOpen(record) {
      this.$refs.fixForm.edit(record, 'open');
    },
    toChange(record) {
      this.$refs.modalForm.editTwo(record, 'change');
      this.$refs.modalForm.title = "编辑";
      this.$refs.modalForm.disableSubmit = false;
    },
    //暂停
    stop(record) {
      this.toStop = true;
      this.nowRow = record;
      this.nowRow.reason = '';
    },
    cancelToStop() {
      this.toStop = false;
    },
    submitToStop() {
      let that = this;
      let url = "/srm/biddingMain/editEntity";
      let reason = that.nowRow.reason;
      if (isNullOrEmpty(reason)) {
        that.$message.error("请输入暂停原因");
        return;
      }
      let param = {
        id: that.nowRow.id,
        biddingStatus: '7',
        reason: reason
      }
      that.$confirm({
        content: `是否确认提交`,
        onOk: () => {
          putAction(url, param).then(res => {
            that.$message.success("提交成功");
            that.cancelToStop();
            that.searchQuery();
          })
        }
      })
    },
    //冻结
    frozen(record) {
      this.toFrozen = true;
      this.nowRow = record;
      this.nowRow.reason = '';
    },
    cancelToFrozen() {
      this.toFrozen = false;
    },
    submitToFrozen() {
      let that = this;
      let url = "/srm/biddingMain/editEntity";
      let reason = that.nowRow.reason;
      if (isNullOrEmpty(reason)) {
        that.$message.error("请输入冻结原因");
        return;
      }
      let param = {
        id: that.nowRow.id,
        biddingStatus: '6',
        reason: reason
      }
      that.$confirm({
        content: `是否确认提交`,
        onOk: () => {
          putAction(url, param).then(res => {
            that.$message.success("提交成功");
            that.cancelToFrozen();
            that.searchQuery();
          })
        }
      })
    },
    //流标
    cancelToFlow() {
      this.toFlow = false;
    },
    submitToFlow() {
      let that = this;
      let url = "/srm/biddingMain/editEntity";
      let reason = that.nowRow.reason;
      if (isNullOrEmpty(reason)) {
        that.$message.error("请输入流标原因");
        return;
      }
      let param = {
        id: that.nowRow.id,
        biddingStatus: '5',
        reason: reason
      }
      that.$confirm({
        content: `是否确认提交`,
        onOk: () => {
          putAction(url, param).then(res => {
            that.$message.success("提交成功");
            that.cancelToFlow();
            that.searchQuery();
          })
        }
      })
    },
    flow(record) {
      this.toFlow = true;
      this.nowRow = record;
      this.nowRow.reason = '';
    },
    //废标
    submitToFail() {
      let that = this;
      let reason = that.nowRow.reason;
      if (isNullOrEmpty(reason)) {
        that.$message.error("请输入废标原因");
        return;
      }
      let url = "/srm/biddingMain/editEntity";
      let param = {
        id: that.nowRow.id,
        biddingStatus: '4',
        reason: reason
      }
      that.$confirm({
        content: `是否确认提交`,
        onOk: () => {
          putAction(url, param).then(res => {
            if (res.success) {
              that.$message.success("提交成功");
              that.cancelToFail();
              that.searchQuery();
            } else {
              that.$message.error(res.message);
            }
          })
        }
      })
    },
    cancelToFail() {
      this.toFail = false;
    },
    giveUp(record) {
      this.toFail = true;
      this.nowRow = record;
      this.nowRow.reason = '';
    },
    openBidding(record, type) {
      if (type == 'edit') {
        this.$refs.openForm.edit(record);
      } else {
        this.$refs.openForm.view(record);
      }

    },
    handleEdit(record, type) {
      if (type == '0') {
        this.$refs.modalForm.editTwo(record, 'view');
        this.$refs.modalForm.title = "编辑";
        this.$refs.modalForm.disableSubmit = true;
      } else if (type == '1') {
        this.$refs.evaluateForm.edit(record);
      }
    },
    handleChange(tabKey) {
      this.searchReset();
    },
    searchReset() {
      this.queryParam = {};

      if (this.tabKey == 0) {
        this.tabKey1 = "all";
      } else {
        this.tabKey1 = this.tabKey - 1;

        if (this.tabKey1 == '2') {
          this.queryParam.biddingStatus = '2,8';
        } else {
          this.queryParam.biddingStatus = this.tabKey1;
        }
      }


      this.loadData(1);
    },
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
<style lang="less" scoped>
.ant-row.ant-form-item {
  margin-bottom: 12px;
}
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