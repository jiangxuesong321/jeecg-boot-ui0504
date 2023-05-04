<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
	<div class="card-title">
		审核人设置
	</div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="付款类型">
              <j-dict-select-tag placeholder="请输入付款类型" v-model="queryParam.payMethod" dictCode="payType"/>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="审核项">
              <j-dict-select-tag placeholder="请输入审核项" v-model="queryParam.type" dictCode="approve_type"/>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="审核人">
              <a-input v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="地区">
              <j-dict-select-tag v-model="queryParam.company" placeholder="请输入地区"
                                 dictCode="sys_depart,depart_name,id,parent_id = '-1'"/>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
          <span style="float: right;overflow: hidden;" class="table-page-search-submitButtons">
            <a-button type="primary" @click="searchQuery" icon="search" style="width: 112px">查询</a-button>
            <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px;width: 112px">重置</a-button>
          </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
<!--    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
    </div> -->
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
        :scroll="{x:true,y:500}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">


        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />

          <a @click="handleDelete(record.id)">删除</a>
        </span>

      </a-table>
			<div class="table-operator" :style="dataSource != null && dataSource.length > 0 ? 'z-index:99;margin-top:-43px;' : 'z-index:99;margin-top:10px;'">
				<a-button @click="handleAdd" type="primary" icon="plus" style="width: 112px">新增</a-button>
        <a-button type="primary" @click="batchDel" icon="reload" style="margin-left: 8px;width: 112px">批量删除</a-button>
			</div>
    </div>

    <approve-setting-modal ref="modalForm" @ok="modalFormOk"/>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import ApproveSettingModal from '@views/base/modules/ApproveSettingModal'
  import '@/assets/less/TableExpand.less'
  import { deleteAction } from '@api/manage'
  import ListColumnsSetter from '@views/components/ListColumnsSetter'

  export default {
    name: "PurPayApplyList",
    mixins:[JeecgListMixin],
    components: {
      ApproveSettingModal,
	  ListColumnsSetter
    },
    data () {
      return {
        description: '审核人配置',
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
            title:'审核项',
            align:"center",
            dataIndex: 'type_dictText',
            width:120,
            sorter: true,
          },
          {
            title:'付款类型',
            align:"center",
            dataIndex: 'payMethod_dictText',
            width:120,
            sorter: true,
          },
          {
            title:'地区',
            align:"center",
            dataIndex: 'company_dictText',
            width:120,
            sorter: true,
          },
          {
            title:'审核人',
            align:"center",
            dataIndex: 'username_dictText',
            width:120,
            sorter: true,
          },

          {
            title:'更新时间',
            align:"center",
            dataIndex: 'updateTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            },
            width:120,
            sorter: true,
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:100,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/srm/approveSetting/list",
          delete: "/srm/approveSetting/delete",
          deleteBatch: "/srm/approveSetting/deleteBatch",
          exportXlsUrl: "/srm/approveSetting/exportXls",
          importExcelUrl: "srm/approveSetting/importExcel",

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
      handleDelete(id){
        let that = this;
        that.$confirm({
          title: '提示',
          content: '是否确认提交?',
          onOk() {
            deleteAction(that.url.delete, {id: id}).then((res) => {
              if (res.success) {
                //重新计算分页问题
                that.reCalculatePage(1)
                that.$message.success("提交成功");
                that.searchQuery();
              } else {
                that.$message.warning(res.message);
              }
            });
          },
          onCancel() {
          },
        });
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

	.ant-table {
		margin-top: 40px;
	}
</style>