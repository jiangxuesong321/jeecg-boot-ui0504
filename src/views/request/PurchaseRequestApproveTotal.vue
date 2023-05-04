<template>
  <a-card :bordered="false">
    <div class="card-title">
      需求审批
    </div>
    <!-- 查询区域 -->
    <div>
      <a-tabs defaultActiveKey="1" v-model="tabKey" @change="handleChange">
        <a-tab-pane tab="待审批" key="1">
          <todo-list ref="todoList"></todo-list>
        </a-tab-pane>
        <a-tab-pane tab="审批历史" key="2">
          <hasdo-list ref="hasdoList"></hasdo-list>
        </a-tab-pane>
      </a-tabs>
    </div>

  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import TodoList from '@views/request/TodoList'
import HasdoList from '@views/request/HasdoList'

export default {
  name: "PurchaseRequestApproveTotal",
  mixins: [],
  components: {
    TodoList,
    HasdoList
  },
  data() {
    return {
      tabKey:'1',
    }
  },
  created() {

  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
  methods: {

    handleChange(tabKey){
      if(tabKey == '1'){

      }else if(tabKey == '2'){
        // hasdoList
        this.$nextTick(()=>{
          this.$refs.hasdoList.loadData(1);
          this.$refs.hasdoList.columnsDrop(1);

        })
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
