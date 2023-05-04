<template>
      <a-table
        ref="table"
        size="middle"
        bordered
        :scroll="{x:true, y:500}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange">

      </a-table>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction } from '@api/manage'


  export default {
    name: "MaterialToGoods",
    mixins:[JeecgListMixin],
    props:['prodCode'],
    components: {

    },
    data () {
      return {
        description: '供应商供货信息',
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
            title:'供应商编码',
            align:"center",
            dataIndex: 'code',
            width:180,
          },

          {
            title:'供应商名称',
            align:"center",
            dataIndex: 'name',
            width:180,
          },
          {
            title:'供应商类型',
            align:"center",
            dataIndex: 'supplierTypeDict',
            width:180,
          },
          {
            title:'品牌',
            align:"center",
            dataIndex: 'brandName',
            width:120,
          },
          {
            title:'供应商规格型号',
            align:"center",
            dataIndex: 'prodSpecType',
            width:180,
          },
          {
            title:'所在地',
            align:"center",
            dataIndex: 'registerArea',
            width:180,
          },
          {
            title:'默认联系人',
            align:"center",
            dataIndex: 'contacter',
            width:120,
          },
          {
            title:'联系电话',
            align:"center",
            dataIndex: 'contacterTel',
            width:120,
          },
        ],
        url: {
          list: "/srm/contractBase/fetchEqpSuppByContract",

        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {

    },
    computed: {

    },
    methods: {
      loadData(arg) {
        if(!this.url.list){
          this.$message.error("请设置url.list属性!")
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        var params = this.getQueryParams();//查询条件
        params.prodCode = this.prodCode;
        this.loading = true;
        getAction(this.url.list, params).then((res) => {
          if (res.success) {
            //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
            this.dataSource = res.result.records||res.result;
            if(res.result.total)
            {
              this.ipagination.total = res.result.total;
            }else{
              this.ipagination.total = 0;
            }
            //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
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