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
      <template slot="attachment" slot-scope="text,record" >
        <j-upload v-model="record.attachment" :trigger-change="true" disabled></j-upload>
      </template>
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
import {
  iegAmount
} from '@/utils/util'
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
        // {
        //   title:'币种',
        //   align:"center",
        //   dataIndex: 'currency_dictText',
        //   width: 120,
        // },
        // {
        //   title:'税率(%)',
        //   customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
        //     const obj = {
        //       children: value,
        //       attrs: {},
        //     };
        //     obj.attrs.align = 'right';//控制表体内容居右
        //     return obj;
        //   },
        //   dataIndex: 'taxRate',
        //   width: 120,
        // },
        {
          title:'报价价格',
          align:"center",
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
            const obj = {
              children: icon + iegAmount(t,'total'),
              attrs: {},
            };
            obj.attrs.align = 'right';//控制表体内容居右
            return obj;
            // return icon + iegAmount(t,'total')
          },
          dataIndex: 'orderPriceTax',
          width: 120,
        },
        {
          title:'附件',
          align:"center",
          dataIndex: 'attachment',
          scopedSlots: { customRender: 'attachment' },
          width: 180,
        },
        // {
        //   title:'贸易方式',
        //   align:"center",
        //   dataIndex: 'tradeType_dictText',
        //   width: 120,
        // },
        // {
        //   title:'运费',
        //   customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
        //     const obj = {
        //       children: value,
        //       attrs: {},
        //     };
        //     obj.attrs.align = 'right';//控制表体内容居右
        //     return obj;
        //   },
        //   dataIndex: 'fareAmount',
        //   width: 120,
        // },
        {
          title:'报价时间',
          align:"center",
          dataIndex: 'createTime',
          width: 120,
        },
      ],
      confirmLoading:false,
      visible:false,
      show:false,
      title:'历史报价',
      width:'90%',
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
        add: '/srm/inquiryList/add',
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
      this.fetchPriceHistory(param);
    },
    fetchPriceHistory(param){
      let url = "/srm/supQuote/fetchPriceHistory";
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