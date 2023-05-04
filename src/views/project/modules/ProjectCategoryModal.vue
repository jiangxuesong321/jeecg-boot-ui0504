<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
    </div>
    <a-table ref="table" size="middle" :scroll="{x:true, y:500}"
             :columns="columns" :dataSource="dataSource" :pagination="false"
             :expandedRowKeys="expandedRowKeys" @expand="handleExpand"
             >
      <template slot="action" slot-scope="text,record">
        <a v-if="record.isLast == '1'" @click="openList(record)">关联清单</a>
      </template>
    </a-table>

    <a-drawer
      title="关联清单"
      width=90%
      placement="right"
      :closable="false"
      @close="handleCancel"
      destroyOnClose
      :visible="visible">

      <bas-eqp-modal ref="eqpModal" v-show="isEqp" :projId="nowRow.projectId" :categoryId="nowRow.id"></bas-eqp-modal>
      <bas-not-eqp-modal ref="notEqpModal" v-show="!isEqp" :projId="nowRow.projectId" :categoryId="nowRow.id"></bas-not-eqp-modal>

      <div style="text-align: center;margin-top: 10px">
        <a-button key="cancel" @click="handleCancel" style="margin-left:10px;"  type="primary" ghost>取消</a-button>
      </div>
    </a-drawer>

  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@api/manage'
import BasEqpModal from '@views/project/modules/BasEqpModal'
import BasNotEqpModal from '@views/project/modules/BasNotEqpModal'
import {
  iegAmount
} from '@/utils/util'
export default {
  name: 'BasContractModal',
  mixins: [JeecgListMixin],
  components: {
    BasEqpModal,
    BasNotEqpModal
  },
  data() {
    return {
      nowRow:{},
      isEqp:false,
      visible:false,
      expandedRowKeys:[],
      description: 'proj_base管理页面',
      // 表头
      columns: [
        {
          title: '分类名称',
          dataIndex: 'title',
          width:120,
        },
        {
          title: '执行金额',
          dataIndex: 'budgetAmount',
          width:120,
          customRender:function (t,r,index) {
            let icon = "";
            icon = '¥';
            return icon + iegAmount(t,'total')
          }
        },
        // {
        //   title: '冻结金额',
        //   dataIndex: 'reqAmount',
        //   width:120,
        //   customRender:function (t,r,index) {
        //     return iegAmount(t,'total')
        //   }
        // },
        {
          title: '使用金额',
          dataIndex: 'contractAmount',
          width:120,
          customRender:function (t,r,index) {
            let icon = "";
            icon = '¥';
            return icon + iegAmount(t,'total')
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width:100,
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: "/srm/projectCategory/list",
      },
      dictOptions: {},
      superFieldList: [],
    }
  },
  created() {

  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    },
  },
  methods: {
    handleCancel(){
      this.visible = false;
    },
    openList(record){
      let that = this;
      that.nowRow = record;
      that.visible = true;
      if(record.isEqp == '1'){
        this.isEqp = true;
        setTimeout(() => {
          that.$refs.eqpModal.loadData(1);
        }, 300)
      }else{
        this.isEqp = false;
        setTimeout(() => {
          that.$refs.notEqpModal.loadData(1);
        }, 300)
      }
    },
    edit(record){
      this.model = record;
      //费用类型统计
      this.fetchCategory(record.id);
    },
    fetchCategory(projectId){
      let url = "/srm/projBase/fetchCategoryToAmount";
      let param = {
        projectId:projectId
      }
      getAction(url,param).then(res => {
        this.dataSource = res.result;
      })
    },
    loadData(){

    },
    tableProps() {
      let _this = this
      return {
        // 列表项是否可选择
        /* 					rowSelection: {
                    selectedRowKeys: _this.selectedRowKeys,
                    onChange: (selectedRowKeys) => _this.selectedRowKeys = selectedRowKeys
                  } */
      }
    },
    handleExpand(expanded, record) {
      // 判断是否是展开状态
      if (expanded) {
        this.expandedRowKeys.push(record.id)
      } else {
        let keyIndex = this.expandedRowKeys.indexOf(record.id)
        if (keyIndex >= 0) {
          this.expandedRowKeys.splice(keyIndex, 1);
        }
      }
    },
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
<style lang="less" scoped>
.ant-row.ant-form-item {
  margin-bottom: 12px;
}
</style>