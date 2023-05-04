<template>
  <a-card :bordered="false">
    <div class="card-title">
      评标模板
    </div>
    <a-tabs v-model:activeKey="activeKey" @change="handleChange">
      <a-tab-pane key="0" tab="技术型"></a-tab-pane>
      <a-tab-pane key="1" tab="商务型"></a-tab-pane>
    </a-tabs>

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="模板编码" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <j-input placeholder="请输入编码" v-model="queryParam.templateCode"></j-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="模板名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <j-input placeholder="请输入项目名称" v-model="queryParam.templateName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="模板状态" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <j-dict-select-tag placeholder="请选择模板状态" v-model="queryParam.templateStatus"
                                 dictCode="evaluate_template_status" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <span class="table-page-search-submitButtons" style="float: right;overflow: hidden;">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!--    <div class="table-operator">
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
          <list-columns-setter v-model="columns" :def-columns="columns" style="float: right;"/>
        </div> -->
    <div>
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
      <list-columns-setter v-model="columns" :def-columns="columns" style="float: right;z-index:999" />
    </div>
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :scroll="{x:1000, y:500}"
        :columns="columns"
        :key="key"
        :dataSource="dataSource"
        :pagination="ipagination"
        :components="components"
        :loading="loading"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)" v-if="record.templateStatus == '1'">编辑</a>

          <a-divider type="vertical" v-if="record.templateStatus == '1'" />

          <a v-if="record.templateStatus == '0'" @click="handleStatus(record,'1')">启用</a>

          <a v-if="record.templateStatus == '1'" @click="handleStatus(record,'0')">停用</a>

        </span>

      </a-table>
      <div class="table-operator" :style="dataSource != null && dataSource.length > 0 ? 'z-index:99;margin-top:-43px;' : 'z-index:99;margin-top:10px;'">
        <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      </div>
    </div>

    <bidding-evaluate-template-modal ref="modalForm" @ok="modalFormOk" :templateType="this.activeKey" />
  </a-card>
</template>

<script>

import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import BiddingEvaluateTemplateModal from './modules/BiddingEvaluateTemplateModal'
import '@/assets/less/TableExpand.less'
import { billListMixin } from '../mixins/billListMixin'
import { billModalMixin } from '../mixins/billModalMixin'
import { httpAction } from '@api/manage'
import ListColumnsSetter from '@views/components/ListColumnsSetter'
import Vue from 'vue'
import Sortable from 'sortablejs'

let columns = [
  {
    title: '序号',
    dataIndex: '',
    key: 'rowIndex',
    width: 100,
    align: 'center',
    customRender: function(t, r, index) {
      return parseInt(index) + 1
    }
  },
  {
    title: '模板编码',
    align: 'center',
    width: 120,
    sorter: true,
    dataIndex: 'templateCode'
  },
  {
    title: '模板名称',
    align: 'center',
    sorter: true,
    dataIndex: 'templateName',
    width: 180,
  },
  {
    title: '模板说明',
    align: 'center',
    dataIndex: 'comment',
    width: 200,
    ellipsis:true
  },
  {
    title: '模板状态',
    align: 'center',
    sorter: true,
    dataIndex: 'templateStatus_dictText',
    width: 100
  },
  {
    title: '创建人',
    align: 'center',
    sorter: true,
    dataIndex: 'createUser_dictText',
    width:120
  },
  {
    title: '创建时间',
    align: 'center',
    sorter: true,
    dataIndex: 'createTime',
    customRender: function(text) {
      return !text ? '' : (text.length > 10 ? text.substr(0, 10) : text)
    },
    width: 120
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: 147,
    //fixed:"right",
    //width:147,
    scopedSlots: { customRender: 'action' }
  }
]
const draggingMap = {}
columns.forEach(col => {
  draggingMap[col.key] = col.width
})
const draggingState = Vue.observable(draggingMap)
const ResizeableTitle = (h, props, children) => {
  let thDom = null
  const { key, ...restProps } = props
  const col = columns.find(col => {
    const k = col.dataIndex || col.key
    return k === key
  })
  if (!col.width) {
    return h('th', {
      ...restProps
    }, [
      children
    ])
  }
  const onDrag = x => {
    draggingState[key] = 0
    col.width = Math.max(x, 1)
  }
  const onDragstop = () => {
    draggingState[key] = thDom.getBoundingClientRect().width
  }
  return (
    h('th', {
      ...restProps,
      attrs: {
        width: col.width
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
          resizable: false
        }
      })
    ])
  )
}

export default {
  name: 'BiddingEvaluateTemplateList',
  mixins: [JeecgListMixin, billListMixin, billModalMixin],
  components: {
    BiddingEvaluateTemplateModal,
    ListColumnsSetter
  },
  data() {
    this.components = {
      header: {
        cell: ResizeableTitle
      }
    }
    return {
      queryParam: {
        templateType: '0'
      },
      key: 0,
      columns,
      activeKey: '0',
      description: '评标模板表管理页面',
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
      //     title:'模板编码',
      //     align:"center",
      //     dataIndex: 'templateCode'
      //   },
      //   {
      //     title:'模板名称',
      //     align:"center",
      //     dataIndex: 'templateName'
      //   },
      //   {
      //     title:'创建人',
      //     align:"center",
      //     dataIndex: 'createUser_dictText'
      //   },
      //   {
      //     title:'创建时间',
      //     align:"center",
      //     dataIndex: 'createTime',
      //     customRender:function (text) {
      //       return !text?"":(text.length>10?text.substr(0,10):text)
      //     }
      //   },
      //   {
      //     title:'模板说明',
      //     align:"center",
      //     dataIndex: 'comment'
      //   },
      //   {
      //     title:'模板状态',
      //     align:"center",
      //     dataIndex: 'templateStatus_dictText'
      //   },
      //   {
      //     title: '操作',
      //     dataIndex: 'action',
      //     align:"center",
      //     fixed:"right",
      //     width:147,
      //     scopedSlots: { customRender: 'action' },
      //   }
      // ],
      url: {
        list: '/srm/biddingEvaluateTemplate/list',
        delete: '/srm/biddingEvaluateTemplate/delete',
        deleteBatch: '/srm/biddingEvaluateTemplate/deleteBatch',
        exportXlsUrl: '/srm/biddingEvaluateTemplate/exportXls',
        importExcelUrl: 'srm/biddingEvaluateTemplate/importExcel'

      },
      dictOptions: {},
      superFieldList: []
    }
  },
  created() {

  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  mounted() {
    this.columnsDrop(),
      this.getFilterOptions()
  },
  methods: {
    handleStatus(record, status) {
      let row = JSON.parse(JSON.stringify(record))
      row.templateStatus = status
      let url = '/srm/biddingEvaluateTemplate/editById'
      let that = this
      let alterMessageTitle = '是否确认停用模板'
      let successMessage = '停用成功'
      if (status == '1') {
        alterMessageTitle = '是否确认启用模板'
        successMessage = '启用成功'
      }
      alterMessageTitle = alterMessageTitle + '【' + record.templateName + '】'
      that.$confirm({
        content: alterMessageTitle,
        onOk: () => {
          httpAction(url, row, 'post').then((res) => {
            if (res.success) {
              that.$message.success(successMessage)
              that.searchQuery()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    searchReset() {
      this.queryParam = {}
      this.queryParam.templateType = this.activeKey
      this.loadData(1)
    },
    handleAdd: function() {
      this.$refs.modalForm.add()
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
    },
    handleChange(tabKey) {
      if (tabKey == '0') {
        this.queryParam.templateType = tabKey
      } else if (tabKey == '1') {
        this.queryParam.templateType = tabKey
      }
      this.searchQuery()
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
          this.key += 1
          this.$nextTick(() => {
            this.columnsDrop()
          })
        }
      })
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