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
            <a-col :span="6">
              <a-form-item label="模板编码" :labelCol="labelCol3" :wrapperCol="wrapperCol3">
                <j-input placeholder="请输入编码" v-model="queryParam.templateCode"></j-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="模板名称" :labelCol="labelCol3" :wrapperCol="wrapperCol3">
                <j-input placeholder="请输入项目名称" v-model="queryParam.templateName"></j-input>
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
          :scroll="{x:1000}"
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
    props:['templateType'],
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
        title:'选择模板',
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
            title:'模板编码',
            align:"center",
            dataIndex: 'templateCode',
            width:120,
          },
          {
            title:'模板名称',
            align:"center",
            dataIndex: 'templateName',
            width:180,
          },
          {
            title:'创建人',
            align:"center",
            dataIndex: 'createUser_dictText',
            width:120,
          },
          {
            title:'创建时间',
            align:"center",
            dataIndex: 'createTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            },
            width:120,
          },
          {
            title:'模板说明',
            align:"center",
            dataIndex: 'comment',
            width:200,
            ellipsis:true
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:100,
            scopedSlots: { customRender: 'action' },
          }
        ],
        key: 0,
        options:[],
        isorter:{
          column: 'createTime',
          order: 'asc',
        },
        description: '物料管理管理页面',
        url: {
          list: "/srm/biddingEvaluateTemplate/list",
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
        this.$emit('ok', record);
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
        params.templateType = this.templateType;
        params.templateStatus = '1';
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