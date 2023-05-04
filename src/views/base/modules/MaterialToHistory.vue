<template>
  <div>
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
      <template slot="contractNumber" slot-scope="text,record">
        <a @click="handleContract(record)">{{text}}</a>
      </template>
    </a-table>
    <contract-base-modal ref="modalForm"/>
  </div>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction } from '@api/manage'
  import {
    iegAmount
  } from '@/utils/util'
  import ContractBaseModal from '@views/contract/modules/ContractBaseModal'

  export default {
    name: "MaterialToGoods",
    mixins:[JeecgListMixin],
    props:['prodCode'],
    components: {
      ContractBaseModal
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
            title:'合同编号',
            align:"center",
            dataIndex: 'contractNumber',
            width:180,
            scopedSlots: { customRender: 'contractNumber' }
          },

          {
            title:'合同名称',
            align:"center",
            dataIndex: 'contractName',
            width:180,
          },
          {
            title:'供应商名称',
            align:"center",
            dataIndex: 'suppName',
            width:180,
          },
          {
            title:'供应商规格型号',
            align:"center",
            dataIndex: 'prodSpecType',
            width:140,
          },
          {
            title:'品牌',
            align:"center",
            dataIndex: 'brandName',
            width:140,
          },
          {
            title:'币种',
            align:"center",
            dataIndex: 'contractCurrency_dictText',
            width:120,
          },
          {
            title:'合同数量',
            dataIndex: 'qty',
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
            title:'合同单价',
            dataIndex: 'contractPriceTax',
            width:120,
            customRender:function (t,r,index) {
              let icon = "";
              if(r.contractCurrency == 'RMB'){
                icon = '¥';
              }else if(r.contractCurrency == 'JPY'){
                icon = 'Ұ';
              }else if(r.contractCurrency == 'USD'){
                icon = '$';
              }else if(r.contractCurrency == 'EUR'){
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
            title:'合同总额',
            dataIndex: 'contractAmountTax',
            width:120,
            customRender:function (t,r,index) {
              let icon = "";
              if(r.contractCurrency == 'RMB'){
                icon = '¥';
              }else if(r.contractCurrency == 'JPY'){
                icon = 'Ұ';
              }else if(r.contractCurrency == 'USD'){
                icon = '$';
              }else if(r.contractCurrency == 'EUR'){
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
            title:'合同生效时间',
            align:"center",
            dataIndex: 'contractValidDate',
            width:140,
          },
        ],
        url: {
          list: "/srm/contractBase/fetchEqpPriceByContract",

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
      handleContract(record){
        let that = this;
        //获取合同信息
        let url = "/srm/contractBase/queryById";
        getAction(url,{id:record.id}).then(res => {
          let contract = res.result;
          that.$refs.modalForm.detail(contract);
        })
      },
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