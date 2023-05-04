<template>
  <a-card :bordered="false">
    <div class="card-title">
      汇率维护
    </div>
    <!-- 查询区域-END -->
    <div>
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
      <list-columns-setter v-model="columns" :def-columns="columns" style="float: right;z-index:999" />
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

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a @click="handleDetail(record)">查看每天汇率</a>
        </span>

      </a-table>
    </div>

    <bas-rate-main-modal ref="modalForm" @ok="modalFormOk"></bas-rate-main-modal>
    <a-drawer
      title="明细"
      width=50%
      placement="right"
      :closable="false"
      :headerStyle="{ textAlign: 'center'}"
      @close="handleCancel"
      destroyOnClose
      :visible="visible">
      <bas-rate-detail-list ref="listForm"></bas-rate-detail-list>
      <div style="text-align: center;margin-top: 10px">
        <a-button key="cancel" @click="handleCancel" style="margin-left:10px;"  type="primary" ghost>取消</a-button>
      </div>
    </a-drawer>

  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BasRateMainModal from './modules/BasRateMainModal'
  import BasRateDetailList from '@views/rate/BasRateDetailList'
  import ListColumnsSetter from '@views/components/ListColumnsSetter'

  export default {
    name: 'BasRateMainList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      BasRateMainModal,
      BasRateDetailList,
      ListColumnsSetter
    },
    data () {
      return {
        visible:false,
        description: 'bas_rate_main管理页面',
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:100,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'源币种',
            align:"center",
            dataIndex: 'currencyA',
            width:180,
            sorter: true,
          },
          {
            title:'源币种值',
            dataIndex: 'valueA',
            width:100,
            sorter: true,
            customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
              const obj = {
                children: value,
                attrs: {},
              };
              obj.attrs.align = 'center';//控制表体内容居右
              return obj;
            }
          },
          {
            title:'目标币种',
            align:"center",
            dataIndex: 'currencyB',
            width:180,
            sorter: true,
          },
          {
            title:'目标币种值',
            dataIndex: 'valueB',
            sorter: true,
            width:100,
            customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
              const obj = {
                children: value,
                attrs: {},
              };
              obj.attrs.align = 'center';//控制表体内容居右
              return obj;
            }
          },
          {
            title:'月份',
            align:"center",
            dataIndex: 'month',
            sorter: true,
            width:180,
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/srm/basRateMain/list",
          delete: "/srm/basRateMain/delete",
          deleteBatch: "/srm/basRateMain/deleteBatch",
          exportXlsUrl: "/srm/basRateMain/exportXls",
          importExcelUrl: "srm/basRateMain/importExcel",

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
    methods: {
      handleCancel(){
        this.visible = false;
      },
      handleDetail:function(record){
        let that = this;
        that.visible = true;
        setTimeout(() => {
          that.$refs.listForm.initData(record);
        }, 300)

      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>