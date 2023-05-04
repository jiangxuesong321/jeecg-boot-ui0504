<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
	<div class="card-title">
		合同模板
	</div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="合同模板编号">
              <j-input placeholder="请输入合同模板编号" v-model="queryParam.temNo"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="模板名称">
              <j-input placeholder="请输入模板名称" v-model="queryParam.temName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="合同类型">
<!--              <a-input placeholder="请输入模板名称" v-model="queryParam.temName"></a-input>-->
              <j-dict-select-tag  v-model="queryParam.contractCategory" placeholder="请选择合同类型" dictCode="contract_category"/>
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
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
	<div class="table-operator">
		<list-columns-setter v-model="columns" :def-columns="columns" style="float: right;z-index:999" />
	</div>
    <!-- table区域-begin -->
    <div>

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
        @change="handleTableChange">
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a v-if="record.status == '0'" @click="handleStatus(record,'1')">启用</a>
          <a v-if="record.status == '1'" @click="handleStatus(record,'0')">停用</a>
        </span>
      </a-table>
	  <div class="table-operator" :style="dataSource != null && dataSource.length > 0 ? 'z-index:99;margin-top:-43px;' : 'z-index:99;margin-top:10px;'">
	    <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
	  </div>
    </div>

    <bas-contract-template-modal ref="modalForm" @ok="modalFormOk"/>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BasContractTemplateModal from './modules/BasContractTemplateModal'
  import '@/assets/less/TableExpand.less'
  import { httpAction } from '@api/manage'
  import ListColumnsSetter from '@views/components/ListColumnsSetter'

  export default {
    name: "BasContractTemplateList",
    mixins:[JeecgListMixin],
    components: {
      BasContractTemplateModal,
	  ListColumnsSetter
    },
    data () {
      return {
        isorter:{
          column: 'temNo',
          order: 'asc',
        },
        description: '合同模板主表管理页面',
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
            title:'合同模板编号',
            align:"center",
            dataIndex: 'temNo',
            sorter: true,
            width:120,
          },
          {
            title:'模板名称',
            align:"center",
            dataIndex: 'temName',
            sorter: true,
            width:120,
          },
          {
            title:'合同类型',
            align:"center",
            dataIndex: 'contractCategory_dictText',
            sorter: true,
            width:120,
          },
          {
            title:'发布人',
            align:"center",
            dataIndex: 'createBy_dictText',
            sorter: true,
            width:120,
          },
          {
            title:'创建时间',
            align:"center",
            dataIndex: 'createTime',
            sorter: true,
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            },
            width:120,
          },
          {
            title:'模板状态',
            align:"center",
            dataIndex: 'status',
            sorter: true,
            customRender:function (text) {
              return text == '1' ? '启用' : '停用'
            },
            width:120,
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:147,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/srm/basContractTemplate/list",
          delete: "/srm/basContractTemplate/delete",
          deleteBatch: "/srm/basContractTemplate/deleteBatch",
          exportXlsUrl: "/srm/basContractTemplate/exportXls",
          importExcelUrl: "srm/basContractTemplate/importExcel",

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
      }
    },
    methods: {
      handleStatus(record,status){
        let row = JSON.parse(JSON.stringify(record));
        row.status = status;
        let url = "/srm/basContractTemplate/editById";
        let that = this;
        that.$confirm({
          content: `是否确认提交`,
          onOk: () => {
            httpAction(url,row,'post').then((res)=> {
              if (res.success) {
                that.$message.success("提交成功");
                that.searchQuery();
              } else {
                that.$message.warning(res.message);
              }
            })
          }
        })
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>