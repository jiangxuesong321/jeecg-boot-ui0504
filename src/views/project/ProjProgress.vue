<template>
  <a-card :bordered="false">
    <div class="card-title">
      项目进度
    </div>
    <div class="table-page-search-wrapper">

      <a-steps v-model:current="current" type="navigation" :style="stepStyle">
        <a-step title="需求阶段">

        </a-step>
        <a-step title="评估设计阶段">

        </a-step>
        <a-step title="决策阶段">

        </a-step>
        <a-step title="采购执行">

        </a-step>
      </a-steps>
    </div>

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="项目列表" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-select placeholder="请选择项目" v-model="projectSelect" :value='projectSelect' :key="projectSelect"
                @change="searchQuery" :options="projectListOptions" />
            </a-form-item>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <div style="display: flex;">
      <a-steps v-model:current="currentChild" direction="vertical" style="width: 15%" size="small" progress-dot>
        <a-step v-for=" item  in  dataSourceChild " :key="item.name" :title="item.name"></a-step>
      </a-steps>
      <a-table ref="table" size="middle" bordered rowKey="id" class="j-table-force-nowrap" :columns="columns"
        :dataSource="dataSource" :scroll="{ x: true, y: 400 }" :pagination="ipagination" :loading="loading"
        @change="handleTableChange" style="width: 85%;margin-top: -42px;">

      </a-table>
    </div>

  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { filterObj } from '@/utils/util'

import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ProjBaseModal from './modules/ProjBaseModal'
import { iegAmount, isNullOrEmpty } from '@/utils/util'
import { billListMixin } from '../mixins/billListMixin'
import { billModalMixin } from '../mixins/billModalMixin'
import ListColumnsSetter from '@views/components/ListColumnsSetter'
import Vue from 'vue'
import Sortable from 'sortablejs'

// import ProjRateModal from '@views/project/modules/ProjRateModal'
import { getAction, postAction } from '@/api/manage'


let columns = [
  {
    title: '序号',
    dataIndex: '',
    key: 'rowIndex',
    width: 60,
    align: "center",
    customRender: function (t, r, index) {
      return parseInt(index) + 1;
    }
  },
  {
    title: '采购申请单号',
    dataIndex: 'reqCode',
    align: 'center',
    sorter: true,
    scopedSlots: { customRender: 'reqCode' },
    width: 120,
  },
  {
    title: '采购申请标题',
    dataIndex: 'reqTitle',
    align: 'center',
    sorter: true,
    width: 180,
  },
  {
    title: '产品名称',
    width: 120,
    align: 'center',
    sorter: true,
    dataIndex: 'prodName'
  },
  {
    title: '产品编码',
    width: 120,
    align: 'center',
    sorter: true,
    dataIndex: 'prodCode'
  },

  {
    title: '审批时间',
    dataIndex: 'approveTime',
    align: 'center',
    sorter: true,
    width: 120,
    customRender: function (text) {
      return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
    }
  },

  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: 100,
    scopedSlots: {
      customRender: 'action'
    },
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
  name: 'ProjProgress',
  // mixins: [JeecgListMixin, mixinDevice, billListMixin, billModalMixin],
  mixins: [JeecgListMixin, billListMixin, billModalMixin],
  components: {
    ProjBaseModal,
    ListColumnsSetter,
    // ProjRateModal
  },
  data() {
    return {
      projectSelect: 0,//项目选择key
      projectSelect1: 0,//项目选择key
      projectListOptions: [],//项目列表
      dataSourceChild: [],
      //子列表
      childColumns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: "center",
          customRender: function (t, r, index) {
            return parseInt(index) + 1;
          }
        },
        {
          title: '项目子项',
          dataIndex: 'model_dictText',
          width: 160,
        },
        {
          title: '执行金额',
          dataIndex: 'budgetAmount',
          width: 120,
          customRender: function (t, r, index) {
            return iegAmount(t, 'total')
          }
        },
        {
          title: '形象进度',
          dataIndex: 'iprogress',
          width: 120,
        },
        {
          title: '产能',
          dataIndex: 'neck',
          width: 120,
          scopedSlots: { customRender: 'neck' },
        },
      ],
      current: 0,
      currentChild: 0,
      stepStyle: {
        boxShadow: '0px -1px 0 0 #e8e8e8 inset',
      },
      width: '50%',
      visible: false,
      subkeyVisible: false,
      iegAmount,
      isDisabled: false,
      childList: [],
      subkeyList: [],
      key: 0,
      columns,
      description: 'proj_base管理页面',
      url: {
        list: "/srm/projBase/list",
        fetchLastCategory: "srm/projBase/fetchLastCategory",
      },
    }
  },
  created() {

  },
  mounted() {
    this.columnsDrop()
    // this.projectSelect = this.projectListOptions[0].value;
    // this.checkApprove()
  },
  computed: {

  },
  methods: {
    searchQuery() {
      this.loadTableData();
    },
    customRow(record, index) {
      return {
        style: {
          // 行背景色
          'background-color': index % 2 == 0 ? '#EEEEEE' : '#FFFFFF',
          height: '100px'
        }
      }
    },
    close() {
      this.visible = false;
    },
    closeSubkey() {
      this.subkeyVisible = false;
    },

    handleSubkey(record) {
      this.subkeyVisible = true;
      this.subkeyList = [];
      this.fetchSubkeyChild(record.id);
    },
    getQueryParams1() {
      let paramTarget = {}
      if (this.dynamicParam) {
        //处理自定义参数
        Object.keys(this.dynamicParam).map(key => {
          paramTarget['self_' + key] = this.dynamicParam[key]
        })
      }
      let param = Object.assign(paramTarget, this.queryParam, this.iSorter);
      let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g")
      if (reg.test(this.projectSelect)) {
        param.projectId = this.projectSelect1;
      } else {
        param.projectId = this.projectSelect;
      }

      param.disabled = true;
      return filterObj(param);
    },
    loadData(arg) {
      var that = this;
      if (!this.url.list) {
        this.$message.error("请设置url.list属性!")
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1;
      }


      // 获取项目列表下拉数据
      var params1 = this.getQueryParams();//查询条件
      params1.source = 'pageList';

      let url = location.search; //获取url中"?"符后的字串
      if (url.indexOf("?") != -1) {
        let str = url.substr(1);
        let subject = str.split("=")[1];
        params1.subject = subject;
      }
      this.loading = true;
      params1.pageSize = "";
      getAction(this.url.list, params1).then((res) => {
        if (res.success) {
          that.projectList = res.result.records || res.result;
          if (res.result.total) {
            that.projectList.total = res.result.total;

          } else {
            that.projectList.total = 0;
          }
          that.projectList.forEach(value => {
            var arr = [];
            arr.value = value.id;
            arr.label = value.projName;
            that.projectListOptions.push(arr);
          })
          that.projectSelect = that.projectListOptions[0].value;
          that.projectSelect1 = that.projectListOptions[0].label;
          var params = that.getQueryParams1();//查询条件
          getAction(that.url.fetchLastCategory, params).then((res) => {
            if (res.success) {
              that.dataSource = res.result.records || res.result;
              that.dataSourceChild = res.result[0].children;
              if (res.result.total) {
                that.ipagination.total = res.result.total;
              } else {
                that.ipagination.total = 0;
              }
            } else {
              that.$message.warning(res.message)
            }
          }).finally(() => {
            that.loading = false
          })
        } else {
          that.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })


    },
    // 加载table数据
    loadTableData() {
      var that = this;
      var params = this.getQueryParams1();//查询条件
      getAction(this.url.fetchLastCategory, params).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records || res.result;
          this.dataSourceChild = res.result[0].children;
          if (res.result.total) {
            this.ipagination.total = res.result.total;
          } else {
            this.ipagination.total = 0;
          }
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },

    handleEdit: function (record, type) {
      this.$refs.modalForm.edit(record, type);
      this.$refs.modalForm.title = "编辑";
      this.$refs.modalForm.disableSubmit = false;
    },
    handleDetail: function (record) {
      this.$refs.modalForm.view(record);
      this.$refs.modalForm.title = "详情";
      this.$refs.modalForm.disableSubmit = true;
    },
    getFilterOptions() {
    },

    columnsDrop() {
      const wrapperTr = document.querySelector('.ant-table-thead tr')
      this.sortable = Sortable.create(wrapperTr, {
        animation: 180,
        delay: 0,
        handle: '.ant-table-header-column', //~~可进行拖拽对应的类名~~~~~~
        onEnd: evt => {

          const oldItem = this.columns[evt.oldIndex - 1]
          this.columns.splice(evt.oldIndex - 1, 1)
          this.columns.splice(evt.newIndex - 1, 0, oldItem)
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

/*设置奇数行颜色*/
table tr:nth-child(odd) {
  background: #EEEEEE;
}
</style>