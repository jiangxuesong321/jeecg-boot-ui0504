<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('供应商合同')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <!-- 高级查询区域 -->
      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text,record">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" :preview="record.id" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">查看</a>

          <a-divider type="vertical" />
                <a @click="handleEdit(record)">修改</a>

          <a-divider type="vertical" />
                <a >作废</a>

<!--          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>-->
        </span>

      </a-table>
    </div>

    <bas-supplier-contract-modal ref="modalForm" @ok="modalFormOk"></bas-supplier-contract-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BasSupplierContractModal from './modules/BasSupplierContractModal'

  export default {
    name: 'BasSupplierContractList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      BasSupplierContractModal
    },
    data () {
      return {
        description: '供应商合同管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'合同编号',
            align:"center",
            dataIndex: 'contractNum'
          },
          {
            title:'状态',
            align:"center",
            dataIndex: 'status'
          },
          {
            title:'币种',
            align:"center",
            dataIndex: 'currency'
          },
          {
            title:'合同类型',
            align:"center",
            dataIndex: 'contractCategory'
          },
          {
            title:'合同总金额本币',
            align:"center",
            dataIndex: 'totalAmountRmb'
          },
          {
            title:'税率',
            align:"center",
            dataIndex: 'rate'
          },
          {
            title:'合同总金额原币',
            align:"center",
            dataIndex: 'totalAmountOther'
          },
          {
            title:'已付总金额本币',
            align:"center",
            dataIndex: 'payAmountRmb'
          },
          {
            title:'已付总金额原币',
            align:"center",
            dataIndex: 'payAmountOther'
          },
          {
            title:'开票总金额本币',
            align:"center",
            dataIndex: 'invoiceAmountRmb'
          },
          {
            title:'开票总金额原币',
            align:"center",
            dataIndex: 'invoiceAmountOther'
          },
          {
            title:'合同名称',
            align:"center",
            dataIndex: 'contractName'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/srm/basSupplierContract/list",
          delete: "/srm/basSupplierContract/delete",
          deleteBatch: "/srm/basSupplierContract/deleteBatch",
          exportXlsUrl: "/srm/basSupplierContract/exportXls",
          importExcelUrl: "srm/basSupplierContract/importExcel",

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
        fieldList.push({type:'int',value:'contractNum',text:'合同编号',dictCode:''})
        fieldList.push({type:'int',value:'status',text:'状态',dictCode:''})
        fieldList.push({type:'string',value:'currency',text:'币种',dictCode:''})
        fieldList.push({type:'string',value:'contractCategory',text:'合同类型',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'totalAmountRmb',text:'合同总金额本币',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'rate',text:'税率',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'totalAmountOther',text:'合同总金额原币',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'payAmountRmb',text:'已付总金额本币',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'payAmountOther',text:'已付总金额原币',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'invoiceAmountRmb',text:'开票总金额本币',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'invoiceAmountOther',text:'开票总金额原币',dictCode:''})
        fieldList.push({type:'string',value:'contractName',text:'合同名称',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>