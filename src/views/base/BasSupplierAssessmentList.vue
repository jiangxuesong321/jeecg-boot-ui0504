<template>
  <a-drawer
    :title="description"
    width=90%
    placement="right"
    :closable="false"
    @close="close"
    class="drawer-body"
    destroyOnClose
    :visible="visible">
  <a-card :bordered="false">
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
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
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
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
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <bas-supplier-assessment-modal ref="modalForm" @ok="modalFormOk"></bas-supplier-assessment-modal>
  </a-card>
  </a-drawer>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BasSupplierAssessmentModal from './modules/BasSupplierAssessmentModal'

  export default {
    name: 'BasSupplierAssessmentList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      BasSupplierAssessmentModal
    },
    data () {
      return {
        model:{},
        visible: false,
        description: '供应商细项目考核指标表管理页面',
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
            title:'供应商ID',
            align:"center",
            // dataIndex: 'supplierId_dictText'
            dataIndex: 'supplierId'
          },
          {
            title:'供应商名',
            align:"center",
            dataIndex: 'supplierName'
          },
          {
            title:'指标内容',
            align:"center",
            dataIndex: 'assessmentContent'
          },
          {
            title:'指标分数',
            align:"center",
            dataIndex: 'assessmentScore'
          },
          {
            title:'删除标识',
            align:"center",
            dataIndex: 'delFlag'
          },
          {
            title:'指标分类',
            align:"center",
            dataIndex: 'assessmentCategory_dictText'
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
          list: "/srm/basSupplierAssessment/list",
          delete: "/srm/basSupplierAssessment/delete",
          deleteBatch: "/srm/basSupplierAssessment/deleteBatch",
          exportXlsUrl: "/srm/basSupplierAssessment/exportXls",
          importExcelUrl: "srm/basSupplierAssessment/importExcel",
          
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
      initDictConfig(record){
        this.model = Object.assign({}, record);
      },
      setData(record){
        this.loadData(record);
        window.localStorage.setItem("localRecord",JSON.stringify(record));
      

        // this.$refs.modalForm.add(record);
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'supplierId',text:'供应商ID',dictCode:''})
        fieldList.push({type:'string',value:'supplierName',text:'供应商名',dictCode:''})
        fieldList.push({type:'string',value:'assessmentContent',text:'指标内容',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'assessmentScore',text:'指标分数',dictCode:''})
        fieldList.push({type:'string',value:'delFlag',text:'删除标识',dictCode:''})
        fieldList.push({type:'string',value:'assessmentCategory',text:'指标分类',dictCode:''})
        this.superFieldList = fieldList
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>