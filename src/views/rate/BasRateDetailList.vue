<template>
  <a-card :bordered="false">

    <div>
      <a-table
        ref="table"
        size="middle"
        :scroll="{x:true}"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
        class="j-table-force-nowrap"
        @change="handleTableChange">
      </a-table>
    </div>


  </a-card>
</template>

<script>

import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@api/manage'

export default {
    name: 'BasRateDetailList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {

    },
    data () {
      return {
        description: 'bas_rate_detail管理页面',
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:100,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'源币种',
            align:"center",
            dataIndex: 'currencyA',
            width:180,
          },
          {
            title:'源币种值',
            dataIndex: 'valueA',
            width:100,
            customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
              const obj = {
                children: value,
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          },
          {
            title:'目标币种',
            align:"center",
            dataIndex: 'currencyB',
            width:180,
          },
          {
            title:'目标币种值',
            dataIndex: 'valueB',
            width:100,
            customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
              const obj = {
                children: value,
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          },
          {
            title:'日期',
            align:"center",
            dataIndex: 'day',
            width:180,
          },
        ],
        url: {
          list: "/srm/basRateDetail/list",
          delete: "/srm/basRateDetail/delete",
          deleteBatch: "/srm/basRateDetail/deleteBatch",
          exportXlsUrl: "/srm/basRateDetail/exportXls",
          importExcelUrl: "srm/basRateDetail/importExcel",

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
      },
    },
    methods: {
      loadData(arg){

      },
      initData(record) {
        if(!this.url.list){
          this.$message.error("请设置url.list属性!")
          return
        }
        var params = record;//查询条件
        this.loading = true;
        getAction(this.url.list, params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records||res.result;
          }else{
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.loading = false
        })
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>