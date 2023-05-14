<template>
  <a-card :bordered="false">
    <div class="card-title">
      项目进度
    </div>
    <div class="table-page-search-wrapper">
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="项目列表" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                <a-select placeholder="请选择项目" v-model="projectSelect" :value='projectSelect' :key="projectSelect"
                  @change="searchQuery1" :options="projectListOptions" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 页面阶段步骤条 -->
      <a-steps v-model:current="current" type="navigation" :style="stepStyle" @change="handleChange">
        <a-step v-for="item in dataSource" :title="item.title"></a-step>
      </a-steps>

    </div>
    <div style="display: flex;">
      <!-- 左侧目录 -->
      <span style="width: 15%">
        <a-tree style="line-height: 2.5" v-if='dataSourceChild.length' show-line :default-expanded-keys="['0-0']"
          @select="onSelect" class="tree-data" :treeData="dataSourceChild" :replaceFields='replaceFields'>
          <a-icon slot="switcherIcon" type="down" />
          <div slot="custom" slot-scope="item" class="custom-item">
            <a-tooltip placement="top">
              <template slot="title">
                <div>{{ item.title }}</div>
              </template>
              <span class="tree-title">
                {{ item.title }}
              </span>
            </a-tooltip>
          </div>
        </a-tree>
      </span>

      <!-- 右侧table需求阶段页面 -->
      <a-table v-if="current == '0'" ref="table" style="width: 85%;margin-top: -42px;" :scroll="{ x: 1200, y: 500 }"
        rowKey="id" :columns="columns" :dataSource="tableModel" :pagination="false" :loading="loading"
        @change="handleTableChange">
        <template slot="reqTitle" slot-scope="text,record">
          <div style="width: 180px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="text">
            {{ text }}
          </div>
        </template>
        <template slot="projectName" slot-scope="text,record">
          <div style="width: 180px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="text">
            {{ text }}
          </div>
        </template>
        <template slot="reqStatus_dictText" slot-scope="text,record">
          <span v-if="record.reqStatus == '0'">
            <a-tag color="orange" class="tag-orange">
              {{ text }}
            </a-tag>
          </span>
          <span v-if="record.reqStatus == '1'">
            <a-tag color="#2db7f5" class="tag-blue">
              {{ text }}
            </a-tag>
          </span>
          <span v-if="record.reqStatus == '2'">
            <a-tag color="#87d068" class="tag-green">
              {{ text }}
            </a-tag>
          </span>
          <span v-if="record.reqStatus == '3'">
            <a-tag color="red" class="tag-red">
              {{ text }}
            </a-tag>
          </span>
          <span v-if="record.reqStatus == '4'">
            <a-tag color="#DDDDDD" class="tag-gray">
              {{ text }}
            </a-tag>
          </span>
        </template>

        <span slot="action" slot-scope="text, record">
          <a-divider type="vertical" v-show="record.reqStatus == '0' || record.reqStatus == '3'" />
          <a @click="handleBidding(record)">发布招标</a>
        </span>
      </a-table>

      <!-- 评估设计阶段区域-begin -->
      <a-table v-if="current == '1'" ref="table" style="width: 85%;margin-top: -42px;" :scroll="{ x: 1200, y: 500 }"
        rowKey="id" :columns="columns1" :dataSource="table1Model" :pagination="false" :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'checkbox' }">
      </a-table>
      <!-- 评估设计阶段区域-end -->

      <!-- 决策阶段区域-begin -->
      <a-table v-if="current == '2'" ref="table" style="width: 85%;margin-top: -42px;" :scroll="{ x: 1200, y: 500 }"
        rowKey="id" :columns="columns1" :dataSource="table2Model" :pagination="false" :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'checkbox' }">
      </a-table>
       <!-- 决策阶段区域 end -->

             <!-- 决策阶段区域-begin -->
      <a-table v-if="current == '3'" ref="table" style="width: 85%;margin-top: -42px;" :scroll="{ x: 1200, y: 500 }"
        rowKey="id" :columns="columns1" :dataSource="table3Model" :pagination="false" :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'checkbox' }">
      </a-table>
       <!-- 决策阶段区域 end -->
    </div>
   
    <div style="text-align: right;margin-top:15px;" v-if="current == '1'">
      <a-button type="primary" style="margin-left:10px;">询价问价</a-button>
      <a-button type="primary" style="margin-left:10px;">发布招标</a-button>
    </div>
    <bidding-main-modal ref="modalBidding" @ok="modalFormOk" />
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
import { getAction, postAction } from '@/api/manage'
import { getTreeDate, queryTreeDate, DelDate } from "@api/api"
import BiddingMainModal from './modules/BiddingMainModal'
import { ColumnProps } from 'ant-design-vue/es/table/interface';


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
    title: '申请编号',
    align: "center",
    dataIndex: 'reqCode',
    // sorter: true,
    scopedSlots: { customRender: 'reqCode' },
    width: 120,
  },
  {
    title: '申请标题',
    align: "center",
    // sorter: true,
    dataIndex: 'reqTitle',
    width: 180,
    scopedSlots: { customRender: 'reqTitle' },
  },
  {
    title: '项目名称',
    align: "center",
    // sorter: true,
    dataIndex: 'projectName',
    width: 180,
    scopedSlots: { customRender: 'projectName' },
  },
  {
    title: '采购类型',
    align: "center",
    // sorter: true,
    dataIndex: 'reqType_dictText',
    width: 120,
  },
  {
    title: '申请部门',
    align: "center",
    // sorter: true,
    dataIndex: 'reqOrgId_dictText',
    width: 120,
  },
  {
    title: '申请人',
    align: "center",
    // sorter: true,
    dataIndex: 'applyUserId_dictText',
    width: 120,
  },
  {
    title: '申请日期',
    align: "center",
    dataIndex: 'reqDate',
    // sorter: true,
    customRender: function (text) {
      return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
    },
    width: 120,
  },
  {
    title: '审核状态',
    align: "center",
    // sorter: true,
    dataIndex: 'reqStatus_dictText',
    width: 120,
    scopedSlots: {
      customRender: 'reqStatus_dictText'
    },
  },

  {
    title: '操作',
    dataIndex: 'action',
    align: "center",
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
  mixins: [JeecgListMixin, billListMixin, billModalMixin],
  components: {
    ProjBaseModal,
    ListColumnsSetter,
    BiddingMainModal
  },
  data() {
    return {
      countnum: 0,
      data: [],
      projectSelect: 0,//项目选择key
      projectSelect1: 0,//项目选择key
      projectListOptions: [],//项目列表
      dataSourceChild: [],
      tableModel: [],
      table1Model: [],
      table2Model: [],
      table3Model: [],
      zhaobiaoModel: [],
      xunjiaModel: [],
      // xunjiaModel: [{
      //   "inquiryCode":"123",
      //   "inquiryName":"11"

      // },
      // {
      //   "inquiryCode":"123",
      //   "inquiryName":"11"

      // },
      // {
      //   "inquiryCode":"123",
      //   "inquiryName":"11"

      // }
      // ],
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
        list: "/srm/projProgress/request_main/list",
        modelList: "/srm/projBase/list",
        // fetchLastCategory: "srm/projBase/fetchLastCategory",
        xunjiaList: "/srm/projProgress/list", //询价单列表
        zhaobiaoList: "/srm/projProgress/zb/list", //招标列表
        fetchLastCategory: "/srm/projProgress/fetchCategory",
        htList: "/srm/projProgress/ht/list",

      },
      replaceFields: {
        children: 'children', title: 'gccategoryId_dictText_name', key: 'categoryId' // 看你的接口返回字段是什么，对应匹配就行了
      },

      columns1: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 50,
          align: "center",
          customRender: function (t, r, index) {
            return parseInt(index) + 1;
          }
        },
        {
          title: '申请编号',
          align: "center",
          // sorter: true,
          dataIndex: 'reqCode',
          width: 130,
          customRender(_, row) {
            return { children: row.reqCode, attrs: { rowSpan: row.reqCodeRowSpan } }

          },
        },
        {
          title: '编号',
          align: "center",
          // sorter: true,
          dataIndex: 'inquiryCode',
          width: 130,
        },

        {
          title: '名称',
          align: "center",
          // sorter: true,
          dataIndex: 'inquiryName',
          width: 160,
        },

        {
          title: '邀请方式',
          align: "center",
          // sorter: true,
          dataIndex: 'invitationMethod_dictText',
          width: 120,
        },

        {
          title: '状态',
          align: "center",
          // sorter: true,
          dataIndex: 'inquiryStatus_dictText',
          width: 120,
        },
        {
          title: '发布人',
          align: "center",
          // sorter: true,
          dataIndex: 'createUser',
          width: 120,
        },
        {
          title: '发布时间',
          align: "center",
          // sorter: true,
          dataIndex: 'createTime',
          customRender: function (text) {
            return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
          },
          width: 120,
        },
        {
          title: '报价截止日期',
          align: "center",
          // sorter: true,
          dataIndex: 'quotationDeadline',
          customRender: function (text) {
            return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
          },
          width: 120,
        }
      ]


    }
  },
  created() {
  },
  mounted() {
    this.mergeRowCell(this.table1Model)
  },
  computed: {

  },
  methods: {
    onSelect(selectedKeys, e) {
      if (e.selectedNodes !== undefined && e.selectedNodes[0] !== undefined) {
        if (this.current == "0") {

          var seletKey = e.selectedNodes[0].data.props.id
          this.loadTableData(seletKey);
        }
        if (this.current == "1") {
          var seletKey = e.selectedNodes[0].data.props.id
          this.loadTableData1(seletKey);
        }
      }
    },

    rowSpan(key, data) {
      const arr = data.reduce((result, item) => {
        if (result.indexOf(item[key]) < 0) {
          result.push(item[key])
        }
        return result
      }, []).reduce((result, keys) => {
        const children = data.filter(item => item[key] === keys)
        result = result.concat(children.map((item, index) => ({
          ...item, [`${key}RowSpan`]: index === 0 ? children.length : 0
        })))
        return result
      }, [])
      return arr
    },// 表格合并
    mergeRowCell(data) {
      let tableData = this.rowSpan('reqCode', data)

      this.table1Model = tableData
    },

    searchQuery1() {
      this.loadChildData();
      this.loadTableData();
      this.loadTableData1();
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
      if (!this.url.modelList) {
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
      getAction(this.url.modelList, params1).then((res) => {
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
      // 加载需求阶段table数据
      this.loadTableData();

    },
    // 加载子分类数据
    loadChildData() {
      var that = this;
      this.loading = true;
      var params = this.getQueryParams1();//查询条件
      getAction(this.url.fetchLastCategory, params).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records || res.result;
          this.dataSourceChild = res.result[0].children;

        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },

    getQueryParams2() {
      let paramTarget = {}
      if (this.dynamicParam) {
        //处理自定义参数
        Object.keys(this.dynamicParam).map(key => {
          paramTarget['self_' + key] = this.dynamicParam[key]
        })
      }
      let param = Object.assign(paramTarget, this.queryParam, this.iSorter);

      // param.disabled = true;
      return filterObj(param);
    },
    // 加载需求阶段table数据
    loadTableData(key) {
      var that = this;
      this.loading = true;
      var params = this.getQueryParams();//查询条件
      if (key) {
        params.categoryId = key;
      } else {
        params.categoryId = "";
      }

      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.tableModel = res.result.records || res.result;
          // if (res.result.total) {
          //   this.ipagination.total = res.result.total;
          // } else {
          //   this.ipagination.total = 0;
          // }
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 加载评估设计阶段数据
    loadTableData1(key) {
      var that = this;
      this.loading = true
      var params = this.getQueryParams();//查询条件

      params.categoryId = "c5fbc2d4-b1df-40aa-8410-ea5cf3d9cd5f";
      getAction(this.url.xunjiaList, params).then((res) => {
        if (res.success) {
          that.xunjiaModel = res.result.records || res.result;
          that.table1Model = Object.assign([], that.xunjiaModel);
          if (key) {
            params.categoryId = key;
          } else {

          }
          getAction(this.url.zhaobiaoList, params).then((res) => {
            if (res.success) {
              that.zhaobiaoModel = res.result.records || res.result;
              for (var i = 0; i < that.zhaobiaoModel.length; i++) {
                var tempList = [];
                tempList.reqCode = that.zhaobiaoModel[i].reqCode;//编码
                tempList.inquiryCode = that.zhaobiaoModel[i].biddingNo;//编码
                tempList.inquiryName = that.zhaobiaoModel[i].biddingName;//编码名称
                tempList.invitationMethod_dictText = that.zhaobiaoModel[i].biddingType_dictText;//邀请方式
                tempList.inquiryStatus_dictText = that.zhaobiaoModel[i].biddingStatus_dictText;//询价状态
                tempList.createUser = that.zhaobiaoModel[i].createUser;//创建人
                tempList.createTime = that.zhaobiaoModel[i].createTime;//创建时间
                tempList.quotationDeadline = that.zhaobiaoModel[i].biddingDeadline;//招标截止时间
                that.table1Model.push(tempList)
                this.loading = false
              }
            } else {
              this.$message.warning(res.message)
            }
          }).finally(() => {

          })
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
    handleBidding: function (record) {
      this.$refs.modalBidding.edit(record)
    },

    handleChange(tabKey) {
      if (tabKey == '0') {
        this.dataSourceChild = this.dataSource[0].children;
        this.loadTableData(this.dataSource[0].children[0].id);

      } else if (tabKey == '1') {
        this.dataSourceChild = this.dataSource[1].children;
        this.loadTableData1();
        this.loadTableData1(this.dataSource[1].children[0].id);

      } else if (tabKey == '2') {
        this.dataSourceChild = this.dataSource[2].children;

      } else if (tabKey == '3') {
        this.dataSourceChild = this.dataSource[3].children;

      }

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

.tree-data {

  .custom-item {
    display: flex;
    align-items: center;
  }

  .tree-title {
    width: 100%;
    font-weight: bold;
    // font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
<style>
.resize-table-th {
  position: relative;
}

/* .table-draggable-handle {
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
} */

/* rfq-content {
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
} */

/*设置奇数行颜色*/
/* table tr:nth-child(odd) {
  background: #EEEEEE;
} */
</style>