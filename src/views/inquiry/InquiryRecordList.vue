<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="询价单号">
              <a-input placeholder="请输入询价单号" v-model="queryParam.inquiryId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('询价单主表')">导出</a-button>
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
        bordered
        rowKey="id"
        class="j-table-force-nowrap"
        :scroll="{x:true}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
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
        <span slot="action2" slot-scope="text, record">

            <a @click="handleEdit(record)">询价大厅</a>
<a-divider type="vertical"  v-if="record.status =='0'" />
            <a @click="handleEdit(record)"  v-if="record.status =='0'">比价</a>
<a-divider type="vertical"  v-if="record.status =='0'" />
            <a @click="handleEdit(record)"  v-if="record.status =='0'">开标</a>
<a-divider type="vertical" />
            <a @click="handleEdit(record)">生成合同</a>
        </span>
        <span slot="action" slot-scope="text, record">

            <a @click="handleEdit(record)">查看供应商</a>
<a-divider type="vertical" />
            <a @click="handleEdit(record)" v-if="record.status =='0'">筛选供应商</a>
<a-divider type="vertical" v-if="record.status =='0'"/>
            <a @click="handleEdit(record)" v-if="record.status =='0'">再次发布</a>
<a-divider type="vertical"  v-if="record.status =='0'"/>
            <a @click="handleEdit(record)" v-if="record.status =='0'">审核资质</a>
          <a-divider type="vertical" v-if="record.status !='0'" />
            <a @click="handleEdit(record)" v-if="record.status !='0'">发布中标报告</a>

          <!--        <a @click="handleEdit(record)">编辑</a>

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
                  </a-dropdown>-->
        </span>

      </a-table>
    </div>

    <inquiry-list-modal ref="modalForm" @ok="modalFormOk"/>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import InquiryListModal from './modules/InquiryListModal'
  import '@/assets/less/TableExpand.less'

  export default {
    name: "InquiryRecordList",
    mixins:[JeecgListMixin],
    components: {
      InquiryListModal
    },
    data () {
      return {
        description: '询价明细管理页面',
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


            title:'询价项目',
            align:"center",
            dataIndex: 'projectName'
          },

          {


            title:'询价设备编号',
            align:"center",
            dataIndex: 'productNo'
          },

          {


            title:'询价设备',
            align:"center",
            dataIndex: 'productName'
          },

          {


            title:'询价设备描述',
            align:"center",
            dataIndex: 'productSpec'
          },

          {

            title:'数量',
            align:"center",
            dataIndex: 'recordNumber'

          },
          {

            title:'单位',
            align:"center",
            dataIndex: 'recordUnit'

          },
          {

            title:'询价时间',
            align:"center",
            dataIndex: 'createTime'
          },
          {

            title:'交期',
            align:"center",
            dataIndex: 'recordDeliveryTime'
          },
          {

            title:'询价状态',
            align:"center",
            dataIndex: 'status',
            customRender: (text) => (!text ? "" : (text == "0" ? "询价中" : "已结束"))
          },

          {
            title:'备注',
            align:"center",
            dataIndex: 'comment'
          },
          {
            title: '询价大厅',
            dataIndex: 'action2',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action2' },
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:10,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/srm/inquiryRecordList/list",
          delete: "/srm/inquiryList/delete",
          deleteBatch: "/srm/inquiryList/deleteBatch",
          exportXlsUrl: "/srm/inquiryList/exportXls",
          importExcelUrl: "srm/inquiryList/importExcel",

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
      }
    },
    methods: {
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];

        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>