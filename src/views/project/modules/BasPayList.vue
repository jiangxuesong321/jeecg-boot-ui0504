<template>
  <a-drawer title="付款详情" :width="width" placement="right" :closable="false" :headerStyle="{ textAlign: 'center'}"
            @close="close" destroyOnClose :visible="visible">
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
      class="j-table-force-nowrap"
      @change="handleTableChange">
    </a-table>

    <div  style="text-align: center;margin-top:15px;">
      <a-button @click="close" type="primary" ghost>关闭</a-button>
    </div>
  </a-drawer>
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
    name: 'BasPayList',
    mixins:[JeecgListMixin, mixinDevice],
    props:['contractId'],
    components: {
      VueDraggableResizable,
      Sortable,
      ListColumnsSetter,
    },
    data () {
      return {
        visible:false,
        width:'40%',
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
            title:'付款计划单号',
            align:"center",
            dataIndex: 'code',
            width: 180,
          },
          {
            title:'付款月份',
            align:"center",
            dataIndex: 'planMonth',
            width: 120,
          },
          {
            title:'付款金额',
            align:"center",
            dataIndex: 'payAmount',
            width: 120,
          },
        ],
        key: 0,
        options:[],
        isorter:{
          column: 'createTime',
          order: 'asc',
        },
        description: '付款记录',
        url: {
          list: "/srm/purPayPlan/fetchPageList",

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
      },
    },
    mounted() {

    },
    methods: {
      close(){
        this.visible = false;
      },
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
        this.initData();
      },

      //项目页面选择设备
      initData(arg){
        this.visible = true;
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        var params = this.getQueryParams();//查询条件
        this.loading = true;
        params.contractId = this.contractId;
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
      loadData(){

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