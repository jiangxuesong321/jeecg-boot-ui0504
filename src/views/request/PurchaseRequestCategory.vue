<template>
  <a-card :bordered="false">
    <div class="card-title">
      采购申请
    </div>
    <!-- 查询区域 -->
    <div>
      <a-tabs defaultActiveKey="1" v-model="tabKey" @change="handleChange">
        <a-tab-pane tab="订单采购" key="1">
          <project-list ref="projectList"></project-list>
        </a-tab-pane>
        <a-tab-pane tab="物料采购" key="2">
          <goods-list ref="goodsList"></goods-list>
        </a-tab-pane>
      </a-tabs>
    </div>

  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import ProjectList from '@views/request/PurchaseRequestMainList'
import GoodsList from '@views/request/PurchaseRequestGoodsList'

export default {
  name: "PurchaseRequestCategory",
  mixins: [],
  components: {
    ProjectList,
    GoodsList
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
          this.$refs.goodsList.loadData(1);
          this.$refs.goodsList.columnsDrop(1);

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
