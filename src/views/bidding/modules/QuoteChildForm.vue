<template>
  <a-drawer
    :title="title"
    :width="width"
    placement="right"
    :closable="false"
    :headerStyle="{ textAlign: 'center'}"
    @close="handleCancel"
    destroyOnClose
    :visible="visible">

    <a-table
      ref="table"
      size="middle"
      bordered
      :scroll="{x:true}"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false">

    </a-table>

    <div  style="text-align: center;margin-top:15px;">
      <a-button key="cancel" @click="handleCancel" style="margin-left:10px;" type="primary" ghost>取消</a-button>
    </div>

  </a-drawer>

</template>

<script>

import JFormContainer from '@/components/jeecg/JFormContainer'
import { billListMixin } from '../../mixins/billListMixin'
import { billModalMixin } from '../../mixins/billModalMixin'
import JSelectSupplierModal from '@comp/jeecgbiz/modal/JSelectSupplierModal'
import { getAction } from '@/api/manage'
export default {
  name: 'InquiryListForm',
  mixins: [ billListMixin, billModalMixin],
  components: {
    JFormContainer,
    JSelectSupplierModal
  },
  data() {
    return {
      columns:[
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
          title:'配套产品',
          align:"center",
          dataIndex: 'prodName',
          width: 180,
        },
        {
          title:'品牌',
          align:"center",
          dataIndex: 'brandName',
          width: 180,
        },
        {
          title:'规格型号',
          align:"center",
          dataIndex: 'speType',
          width: 180,
        },
        {
          title:'数量',
          align:"center",
          dataIndex: 'qty',
          width: 120,
        },
        {
          title:'税率(%)',
          align:"center",
          dataIndex: 'taxRate',
          width: 120,
        },
        {
          title:'单价',
          align:"center",
          dataIndex: 'priceTax',
          width: 120,
        },
        {
          title:'总价',
          align:"center",
          dataIndex: 'amountTax',
          width: 120,
        },

      ],
      confirmLoading:false,
      visible:false,
      show:false,
      title:'配套产品',
      width:'80%',
      dataSource:[],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      model: {

      },
      validatorRules: {

      },
      url: {
        list: '/srm/biddingQuoteRecordChild/queryList',
      }
    }
  },
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    }
  },
  created() {
  },
  methods: {
    handleCancel(){
      this.visible = false;
    },
    edit(param) {
      this.visible = true;
      this.fetchChildList(param);
    },
    fetchChildList(param){
      let url = "/srm/biddingQuoteRecordChild/queryList";
      getAction(url,param).then(res => {
        this.dataSource = res.result;
      })
    },
  }
}
</script>

<style lang="less" scoped>
.ant-row.ant-form-item {
  margin-bottom: 12px;
}
</style>