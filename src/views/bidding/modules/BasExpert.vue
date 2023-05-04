<template>
  <a-drawer
    :title="title"
    :width="width"
    placement="right"
    :closable="false"
    @close="close"
    destroyOnClose
    :visible="visible">
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="名称">
                <j-input placeholder="请输入名称" v-model="queryParam.nickName"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="员工号">
                <j-input placeholder="请输入员工号" v-model="queryParam.code"></j-input>
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
          class="j-table-force-nowrap"
          @change="handleTableChange">
          <template slot="action" slot-scope="text,record">
            <a @click="toBack(record)">选择</a>
          </template>
        </a-table>
      </div>
    </a-card>
    <div class="drawer-footer" style="text-align: center;" >
      <a-button  @click="close" style="margin-left:10px;"  type="primary" ghost>关闭</a-button>
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
    name: 'BasMaterialList',
    mixins:[JeecgListMixin, mixinDevice],
    props:['userCategory','record'],
    components: {
      VueDraggableResizable,
      Sortable,
      ListColumnsSetter,
    },
    data () {
      return {
        labelCol3: {span: 6},
        wrapperCol3: {span: 18},
        visible:false,
        width:'80%',
        title:'选择专家',
        columns : [
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
            title:'员工号',
            align:"center",
            dataIndex: 'code',
            width:140,
          },
          {
            title:'姓名',
            align:"center",
            dataIndex: 'nickName',
            width:140,
          },
          {
            title:'专家分类',
            align:"center",
            dataIndex: 'userCategory',
            width:140,
            customRender:function (t,r,index) {
              if(t == '0'){
                return '技术专家';
              }else if(t == '1'){
                return '商务专家';
              }else if(t == '2'){
                return '法务';
              }else if(t == '3'){
                return '行政';
              }
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:100,
            scopedSlots: { customRender: 'action' }
          }
        ],
        key: 0,
        options:[],
        isorter:{
          column: 'createTime',
          order: 'asc',
        },
        description: '选择专家',
        url: {
          list: "/srm/basProfessionals/list",
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
      toBack(record){
        this.$emit('ok', record,this.record);
        this.close();
      },
      close(){
        this.visible = false;
      },
      showModel(){
        this.visible = true;
        this.loadData(1);
      },
      //项目页面选择设备
      loadData(arg){
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        var params = this.getQueryParams();//查询条件
        this.loading = true;
        params.userCategory = this.userCategory;
        params.isEnabled = '1';
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
.resize-table-th .ant-table-header-column .ant-table-column-title .ant-table-selection .ant-checkbox-wrapper .ant-checkbox {
  margin-left: 20px;
}
</style>