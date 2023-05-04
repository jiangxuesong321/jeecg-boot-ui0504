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
    <!-- 查询区域 -->
<!--    <div class="table-page-search-wrapper">-->
<!--      <a-form layout="inline" @keyup.enter.native="searchQuery">-->
<!--        <a-row :gutter="24">-->
<!--          <a-col :xl="6" :lg="7" :md="8" :sm="24">-->
<!--            <a-form-item label="供应商名">-->
<!--              <a-input placeholder="请输入供应商名" v-model="queryParam.supplierName"></a-input>-->
<!--            </a-form-item>-->
<!--          </a-col>-->
<!--          <a-col :xl="6" :lg="7" :md="8" :sm="24">-->
<!--            <a-form-item label="指标内容">-->
<!--              <a-input placeholder="请输入指标内容" v-model="queryParam.assessmentContent"></a-input>-->
<!--            </a-form-item>-->
<!--          </a-col>-->
<!--          <template v-if="toggleSearchStatus">-->
<!--            <a-col :xl="6" :lg="7" :md="8" :sm="24">-->
<!--              <a-form-item label="指标分类">-->
<!--                <a-input placeholder="请输入指标分类" v-model="queryParam.assessmentCategory"></a-input>-->
<!--              </a-form-item>-->
<!--            </a-col>-->
<!--          </template>-->
<!--          <a-col :xl="6" :lg="7" :md="8" :sm="24">-->
<!--            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">-->
<!--              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>-->
<!--              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>-->
<!--              <a @click="handleToggleSearch" style="margin-left: 8px">-->
<!--                {{ toggleSearchStatus ? '收起' : '展开' }}-->
<!--                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>-->
<!--              </a>-->
<!--            </span>-->
<!--          </a-col>-->
<!--        </a-row>-->
<!--      </a-form>-->
<!--    </div>-->
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
<!--      <a-button type="primary" icon="download" @click="handleExportXls('供应商细项目考核指标表')">导出</a-button>-->
<!--      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">-->
<!--        <a-button type="primary" icon="import">导入</a-button>-->
<!--      </a-upload>-->
      <!-- 高级查询区域 -->
<!--      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>-->
<!--      <a-dropdown v-if="selectedRowKeys.length > 0">-->
<!--        <a-menu slot="overlay">-->
<!--          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>-->
<!--        </a-menu>-->
<!--        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>-->
<!--      </a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
<!--      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">-->
<!--        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项-->
<!--        <a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
<!--      </div>-->

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
            dataIndex: 'supplierId_dictText'
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
        this.modelDefault = JSON.parse(JSON.stringify(record));
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