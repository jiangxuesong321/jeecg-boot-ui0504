<template>
      <a-table
        ref="table"
        size="middle"
        bordered
        :scroll="{x:true, y:400}"
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
            title:'地区',
            align:"center",
            dataIndex: 'name',
            width:120,
          },

          {
            title:'厂区',
            align:"center",
            dataIndex: 'area',
            width:120,
          },
          {
            title:'供应商名称',
            align:"center",
            dataIndex: 'suppName',
            width:120,
          },
          {
            title:'供应商规格型号',
            align:"center",
            dataIndex: 'prodSpecType',
            width:120,
          },
          {
            title:'数量',
            dataIndex: 'stockQty',
            width:120,
            customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
              const obj = {
                children: value,
                attrs: {},
              };
              obj.attrs.align = 'center';//控制表体内容居右
              return obj;
            }
          },
          {
            title:'设备序号',
            align:"center",
            dataIndex: 'sort',
            width:120,
          },
          {
            title:'到厂日期',
            align:"center",
            dataIndex: 'createTime',
            width:120,
          },
          {
            title:'使用部门',
            align:"center",
            dataIndex: 'deptId_dictText',
            width:120,
          },
        ],
        url: {
          list: "/srm/stkIoBill/queryDetailPageList",

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