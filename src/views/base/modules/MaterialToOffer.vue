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
  import {
    iegAmount
  } from '@/utils/util'


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
            dataIndex: 'suppCode',
            width:120,
          },
          {
            title:'供应商名称',
            align:"center",
            dataIndex: 'suppName',
            width:180,
          },
          {
            title:'供应商类型',
            align:"center",
            dataIndex: 'supplierType',
            width:120,
          },
          {
            title:'供应商规格型号',
            align:"center",
            dataIndex: 'speType',
            width:180,
          },
          {
            title:'报价币种',
            align:"center",
            dataIndex: 'currency_dictText',
            width:120,
          },
          {
            title:'报价',
            dataIndex: 'priceTax',
            width:120,
            customRender:function (t,r,index) {
              let icon = "";
              if(r.currency == 'RMB'){
                icon = '¥';
              }else if(r.currency == 'JPY'){
                icon = 'Ұ';
              }else if(r.currency == 'USD'){
                icon = '$';
              }else if(r.currency == 'EUR'){
                icon = '€';
              }
              // return icon + iegAmount(t,'total')
              const obj = {
                children: icon + iegAmount(t,'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          },
          {
            title:'报价时间',
            align:"center",
            dataIndex: 'createTime',
            width:120,
          },
          {
            title:'是否中标',
            align:"center",
            dataIndex: 'isRecommend',
            customRender:function (t,r,index) {
              return t == '1' ? '是' : '否'
            },
            width:120,
          },
        ],
        url: {
          list: "/srm/basMaterial/fetchHistoryQuote",

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
        params.code = this.prodCode;
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