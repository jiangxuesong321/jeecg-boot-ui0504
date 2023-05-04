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
    <a-spin :spinning="confirmLoading">
      <table width="100%" style="border: 1px solid black; border-collapse:collapse;">
            <thead>
              <tr style="height: 50px">
                <th style="background-color:#fafafa; border: 1px solid #DDDDDD;width: 100px">序号</th>
                <th style="background-color:#fafafa; border: 1px solid #DDDDDD;width: 180px">物料信息</th>
                <th style="background-color:#fafafa; border: 1px solid #DDDDDD;width: 120px">采购量</th>
                <th style="background-color:#fafafa; border: 1px solid #DDDDDD;width: 180px">供应商</th>
                <th style="background-color:#fafafa; border: 1px solid #DDDDDD;width: 120px">币种</th>
                <th style="background-color:#fafafa; border: 1px solid #DDDDDD;width: 120px">税率(%)</th>
                <th style="background-color:#fafafa; border: 1px solid #DDDDDD;width: 140px">报价单价(含税单价)</th>
                <th style="background-color:#fafafa; border: 1px solid #DDDDDD;width: 120px">贸易方式</th>
                <th style="background-color:#fafafa; border: 1px solid #DDDDDD;width: 120px">运费</th>
                <th style="background-color:#fafafa; border: 1px solid #DDDDDD;width: 120px">议价价格</th>
                <th style="background-color:#fafafa; border: 1px solid #DDDDDD;width: 120px">议价运费</th>
              </tr>
            </thead>
            <tbody >
              <tr v-for="(item, index) in dataSource">
                <td style="background-color:#fafafa; border: 1px solid #DDDDDD;text-align: center" >
                  {{index + 1}}
                </td>
                <td style="background-color:#fafafa; border: 1px solid #DDDDDD;" >
                  <div>
                    物料编码:{{item.prodCode}}
                  </div>
                  <div>
                    物料名称:{{item.prodName}}
                  </div>
                  <div>
                    物料大类:{{item.categoryName}}
                  </div>
                  <div>
                    规格型号:{{item.speType}}
                  </div>
                </td>
                <td style="background-color:#fafafa; border: 1px solid #DDDDDD;text-align: center" >
                  {{item.qty}}
                </td>
                <td style="background-color:#fafafa; border: 1px solid #DDDDDD;height: 80px;text-align: center">
                  {{item.name}}
                </td>
                <td style="background-color:#fafafa; border: 1px solid #DDDDDD;text-align: center">
                  {{item.currencyName}}
                </td>
                <td style="background-color:#fafafa; border: 1px solid #DDDDDD;text-align: center">
                  {{item.taxRate}}
                </td>
                <td style="background-color:#fafafa; border: 1px solid #DDDDDD;text-align: center">
                  {{item.orderPriceTax}}
                </td>
                <td style="background-color:#fafafa; border: 1px solid #DDDDDD;text-align: center">
                  {{item.tradeTypeName}}
                </td>
                <td style="background-color:#fafafa; border: 1px solid #DDDDDD;text-align: center">
                  {{item.fareAmount}}
                </td>

                <td style="background-color:#fafafa; border: 1px solid #DDDDDD;text-align: center">
                  <a-input-number v-model="item.bgOrderPriceTax" style="width: 100%"></a-input-number>
                </td>
                <td style="background-color:#fafafa; border: 1px solid #DDDDDD;text-align: center">
                  <a-input-number v-model="item.bgFareAmount" style="width: 100%"></a-input-number>
                </td>
              </tr>
            </tbody>
          </table>
    </a-spin>
    <div  style="text-align: center;margin-top:15px;">
      <a-button key="cancel" @click="handleCancel" style="margin-left:10px;" type="primary" ghost>取消</a-button>
      <a-button  @click="handleOk" type="primary" style="margin-left:10px;">提交</a-button>
    </div>
  </a-drawer>

</template>

<script>

import { getAction, httpAction } from '@/api/manage'
import JFormContainer from '@/components/jeecg/JFormContainer'
import { billListMixin } from '../../mixins/billListMixin'
import { billModalMixin } from '../../mixins/billModalMixin'
import { isNullOrEmpty } from '@/utils/util'

export default {
  name: 'InquiryListForm',
  mixins: [ billListMixin, billModalMixin],
  components: {
    JFormContainer,
  },
  data() {
    return {
      confirmLoading:false,
      visible:false,
      show:false,
      title:'议价',
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
      validatorRules: {

      },
      url: {
        add: '/srm/inquiryList/add',
        edit: '/srm/inquiryList/edit',
        queryById: '/srm/inquiryList/queryById',
        inquiryRecord: {
          list: '/srm/inquiryList/queryInquiryRecordByMainId'
        },
        inquirySupplier: {
          list: '/srm/inquiryList/queryInquirySupplierByMainId'
        }
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
    handleOk(){
      let that = this;
      let dataSource = [];
      let index = 1;
      let flag = false;
      that.dataSource.filter(child => {
        if(child.status == '1' || child.status == '3'){
          if(isNullOrEmpty(child.bgOrderPriceTax)){
            that.$message.error("第" + (index) + "行,请输入议价价格");
            flag = true;
            throw "第" + (index) + "行,请输入议价价格";
          }
          if(isNullOrEmpty(child.bgFareAmount)){
            that.$message.error("第" + (index) + "行,请输入议价运费");
            flag = true;
            throw "第" + (index) + "行,请输入议价运费";
          }
          dataSource.push(child);
          index = index + 1;
        }
      })
      if(flag){
        return;
      }
      that.$confirm({
        content: `是否确认提交`,
        onOk: () => {
          let url = "/srm/supBargain/addAll";
          let post = "post";
          httpAction(url,dataSource,post).then((res)=> {
            if (res.success) {
              that.$message.success(res.message);
              that.handleCancel();
              that.$emit('ok');
            } else {
              that.$message.warning(res.message);
            }
          })
        }
      })
    },
    edit(dataSource) {
      this.dataSource = [];
      this.visible = true;
      this.dataSource = dataSource;
    },
  }
}
</script>

<style lang="less" scoped>
.ant-row.ant-form-item {
  margin-bottom: 12px;
}
</style>