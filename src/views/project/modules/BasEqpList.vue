<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="物料名称">
              <a-input placeholder="请输入物料名称" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="物料编码">
              <a-input placeholder="请输入物料编码" v-model="queryParam.code"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a-button type="primary" @click="handleBatch" icon="reload" style="margin-left: 8px"
                        :disabled="selectedRowKeys == null || selectedRowKeys.length == 0">批量添加</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div>

    <a-table
      ref="table"
      size="middle"
      :scroll="{x:true}"
      bordered
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :rowSelection="{selectedRowKeys: selectedRowKeys,selectionRows : selectionRows, onChange: onSelectChange}"
      class="j-table-force-nowrap"
      @change="handleTableChange">
    </a-table>
    </div>
  </a-card>
</template>

<script>
import Vue from 'vue'
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import VueDraggableResizable from 'vue-draggable-resizable'
import Sortable from 'sortablejs'
import ListColumnsSetter from '@views/components/ListColumnsSetter'
import { getAction } from '@api/manage'


  export default {
    name: 'BasMaterialList',
    mixins:[JeecgListMixin, mixinDevice],
    props:['ptype','projId','reqId','categoryId'],
    components: {
      VueDraggableResizable,
      Sortable,
      ListColumnsSetter,
    },
    data () {
      return {
        columns : [
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:120,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'物料编码',
            align:"center",
            dataIndex: 'code',
            width: 180,
          },
          {
            title:'物料名称',
            align:"center",
            dataIndex: 'name',
            width: 260,
          },
          {
            title:'产品类别',
            align:"center",
            dataIndex: 'model_dictText',
            width: 180,
          },
          {
            title:'规格型号',
            align:"center",
            dataIndex: 'speType',
            width: 180,
          },
          {
            title:'产地',
            align:"center",
            dataIndex: 'country',
            width: 120,
          },
          {
            title:'单位',
            align:"center",
            dataIndex: 'unitId_dictText',
            width: 120,
          },
          {
            title:'物料大类',
            align:"center",
            dataIndex: 'categoryName',
            width: 260,
          },
        ],
        key: 0,
        options:[],
        isorter:{
          column: 'createTime',
          order: 'asc',
        },
        description: '物料管理管理页面',
        url: {
          list: "/srm/basMaterial/list",
          delete: "/srm/basMaterial/delete",
          deleteBatch: "/srm/basMaterial/deleteBatch",
          exportXlsUrl: "/srm/basMaterial/exportXls",
          importExcelUrl: "srm/basMaterial/importExcel",

        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
      if(this.ptype == 'req'){
        this.columns = [
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:120,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'设备编码',
            align:"center",
            dataIndex: 'code',
            width: 180,
          },
          {
            title:'物料名称',
            align:"center",
            dataIndex: 'name',
            width: 260,
          },
          {
            title:'模块规划产能(万片/月)',
            align:"center",
            dataIndex: 'capacity',
            width: 180,
          },
          {
            title:'规格型号',
            align:"center",
            dataIndex: 'speType',
            width: 180,
          },
          {
            title:'产地',
            align:"center",
            dataIndex: 'country',
            width: 120,
          },
          {
            title:'单位',
            align:"center",
            dataIndex: 'unitId_dictText',
            width: 120,
          },
          {
            title:'数量',
            align:"center",
            dataIndex: 'qty',
            width: 120,
          },
          {
            title:'已下达需求数量',
            align:"center",
            dataIndex: 'hasReqQty',
            width: 120,
          },
          {
            title:'预算单价(元)',
            align:"center",
            dataIndex: 'budgetPrice',
            width: 120,
          },
        ];
      }else if(this.ptype == 'proj'){
        this.columns = [
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:120,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'物料编码',
            align:"center",
            dataIndex: 'code',
            width: 180,
          },
          {
            title:'物料名称',
            align:"center",
            dataIndex: 'name',
            width: 260,
          },
          {
            title:'产品类别',
            align:"center",
            dataIndex: 'model_dictText',
            width: 180,
          },
          {
            title:'规格型号',
            align:"center",
            dataIndex: 'speType',
            width: 180,
          },
          {
            title:'产地',
            align:"center",
            dataIndex: 'country',
            width: 120,
          },
          {
            title:'单位',
            align:"center",
            dataIndex: 'unitId_dictText',
            width: 120,
          },
          {
            title:'物料大类',
            align:"center",
            dataIndex: 'categoryName',
            width: 260,
          },
        ];
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    mounted() {

    },
    methods: {
      handleTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        //TODO 筛选
        console.log(pagination)
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        this.ipagination = pagination;
        this.selectedRowKeys = [];
        this.selectionRows = [];
        if(this.ptype == 'req'){
          this.initDataTwo();
        }
        //项目页面
        else if(this.ptype == 'proj'){
          this.initData();
        }
      },
      handleBatch(){
        let selectionRows = this.selectionRows;
        if(selectionRows == null || selectionRows.length == 0){
          this.$message.warning("请选择需要添加的设备");
          return;
        }
        this.$emit('back', selectionRows);
        setTimeout(()=>{
          this.selectedRowKeys = [];
          this.selectionRows = [];
        },300)
      },
      searchReset() {
        this.queryParam = {}
        //采购需求
        if(this.ptype == 'req'){
          this.initDataTwo(1);
        }
        //项目页面
        else if(this.ptype == 'proj'){
          this.initData(1);
        }

      },
      searchQuery() {
        //采购需求
        if(this.ptype == 'req'){
          this.initDataTwo(1);
        }
        //项目页面
        else if(this.ptype == 'proj'){
          this.initData(1);
        }
        this.selectedRowKeys = []
        this.selectionRows = []
      },
      //项目页面选择设备
      initData(arg){
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
      //采购需求页面选择设备(通过项目ID查询所能选择到的设备)
      initDataTwo(arg){
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        var params = this.getQueryParams();//查询条件
        this.loading = true;
        params.projId = this.projId;
        params.reqId = this.reqId;
        params.categoryId = this.categoryId;
        let url = "/srm/projBase/fetchEqpPageListByProjId";
        getAction(url, params).then((res) => {
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

      loadData(){

      },
      handleExportDemo(fileName){
        window.location = '/设备模板.xls';
      },

      // handleExportDemo( filename) {
      //   let url = "/设备模板.xls";
      //   return fetch(url).then(res => res.blob().then(blob => {
      //     let a = document.createElement('a');
      //     let url = window.URL.createObjectURL(blob);
      //     a.href = url;
      //     a.download = filename;
      //     a.click();
      //     window.URL.revokeObjectURL(url);
      //   }))
      // },


      getPopupContainer(node) {
        let element = (() => {
          // nodeType 8	: Comment	: 注释
          if (this.$el && this.$el.nodeType !== 8) {
            return this.$el
          }
          let doc = document.getElementById(this.caseId + 'inputTable')
          if (doc != null) {
            return doc
          }
          return node.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
        })()

        // 递归判断是否带有 overflow: hidden；的父元素
        const ifParent = (child) => {
          let currentOverflow = null
          if (child['currentStyle']) {
            currentOverflow = child['currentStyle']['overflow']
          } else if (window.getComputedStyle) {
            currentOverflow = window.getComputedStyle(child)['overflow']
          }
          if (currentOverflow != null) {
            if (currentOverflow === 'hidden') {
              // 找到了带有 hidden 的标签，判断它的父级是否还有 hidden，直到遇到完全没有 hidden 或 body 的时候才停止递归
              let temp = ifParent(child.parentNode)
              return temp != null ? temp : child.parentNode
            }
            // 当前标签没有 hidden ，如果有父级并且父级不是 body 的话就继续递归判断父级
            else if (child.parentNode && child.parentNode.tagName.toLocaleLowerCase() !== 'body') {
              return ifParent(child.parentNode)
            } else {
              // 直到 body 都没有遇到有 hidden 的标签
              return null
            }
          } else {
            return child
          }
        }

        let temp = ifParent(element)
        return temp != null ? temp : element
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
.resize-table-th .ant-table-header-column .ant-table-column-title .ant-table-selection .ant-checkbox-wrapper .ant-checkbox {
  margin-left: 20px;
}
</style>