<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="card-title">
      贸易方式
    </div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="贸易方式">
              <j-dict-select-tag placeholder="请输入贸易方式" v-model="queryParam.tradeType" dictCode="trade_type"/>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
						<span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
							<a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
							<a-button type="dashed" @click="searchReset" icon="reload" style="margin-left: 8px">重置
							</a-button>
						</span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
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
        @change="handleTableChange">


        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
        </span>

      </a-table>
      <div class="table-operator" :style="dataSource != null && dataSource.length > 0 ? 'z-index:99;margin-top:-43px;' : 'z-index:99;margin-top:10px;'">
        <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      </div>
    </div>

    <bas-trade-modal ref="modalForm" @ok="modalFormOk"></bas-trade-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BasTradeModal from './modules/BasTradeModal'
  import { iegAmount } from '@/utils/util'

  export default {
    name: 'BasTradeList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      BasTradeModal
    },
    data () {
      return {
        description: 'bas_trade管理页面',
        // 表头
        columns: [
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
            title:'贸易方式',
            align:"center",
            dataIndex: 'tradeType',
            sorter: true,
            width:120,
          },
          {
            title:'运费及通关杂费总计',
            align:"center",
            dataIndex: 'amount',
            sorter: true,
            width:120,
            customRender:function (t,r,index) {
              let icon = "";
              icon = '¥';
              const obj = {
                children: icon + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            },
          },
          {
            title:'增值税税率',
            align:"center",
            dataIndex: 'addTaxBas',
            sorter: true,
            width:120,
            customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
              const obj = {
                children: value + '%',
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          },
          {
            title:'关税税率',
            align:"center",
            dataIndex: 'customsTaxBas',
            sorter: true,
            width:120,
            customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
              const obj = {
                children: value + '%',
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          },
          {
            title:'公式说明',
            align:"center",
            dataIndex: 'formula',
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
          list: "/srm/basTrade/list",
          delete: "/srm/basTrade/delete",
          deleteBatch: "/srm/basTrade/deleteBatch",
          exportXlsUrl: "/srm/basTrade/exportXls",
          importExcelUrl: "srm/basTrade/importExcel",

        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
    this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'tradeType',text:'贸易方式'})
        fieldList.push({type:'number',value:'amount',text:'运费及通过杂费总计'})
        fieldList.push({type:'number',value:'addTax',text:'增值税税率'})
        fieldList.push({type:'number',value:'customsTax',text:'关税税率'})
        fieldList.push({type:'int',value:'sort',text:'排序'})
        fieldList.push({type:'string',value:'tenantId',text:'租户ID'})
        fieldList.push({type:'string',value:'delFlag',text:'删除标志位'})
        fieldList.push({type:'string',value:'createUser',text:'创建人'})
        fieldList.push({type:'string',value:'updateUser',text:'更新人'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>