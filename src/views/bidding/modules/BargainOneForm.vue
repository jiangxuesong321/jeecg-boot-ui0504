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
      <a-form-model ref="form" :model="model" >
        <a-card class="card" title="设备信息" :bordered="false" style="margin-top: 15px;">
          <a-row>
            <a-col :span="8">
              <a-form-model-item label="物料编码" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                {{model.prodCode}}
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="物料名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                {{model.prodName}}
              </a-form-model-item>
            </a-col>
<!--            <a-col :span="8">-->
<!--              <a-form-model-item label="物料大类" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">-->
<!--                {{model.categoryName}}-->
<!--              </a-form-model-item>-->
<!--            </a-col>-->
            <a-col :span="8">
              <a-form-model-item label="规格型号" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                {{model.speType}}
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="采购数量" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                {{model.qty}}
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card class="card" title="报价信息" :bordered="false" style="margin-top: 15px;">
          <a-row>
            <a-col :span="8">
              <a-form-model-item label="供应商" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                {{model.name}}
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="币种" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                {{filterDictTextByCache('currency_type', model.currency)}}
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="税率(%)" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                {{Math.trunc(model.taxRate)}}
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="报价(含税)" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                {{iegAmount(model.priceTax,'total')}}
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="贸易方式" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                {{filterDictTextByCache('trade_type', model.tradeType)}}
              </a-form-model-item>
            </a-col>
<!--            <a-col :span="8">-->
<!--              <a-form-model-item label="运费" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">-->
<!--                {{model.fareAmount}}-->
<!--              </a-form-model-item>-->
<!--            </a-col>-->
          </a-row>
        </a-card>
        <a-card class="card" title="议价" :bordered="false" style="margin-top: 15px;">
          <a-row>
            <a-col :span="8">
              <a-form-model-item label="议价价格" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                <a-input-number v-model="model.bgPriceTax" style="width: 100%" @change="setValue"></a-input-number>
              </a-form-model-item>
            </a-col>
<!--            <a-col :span="8">-->
<!--              <a-form-model-item label="运费" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">-->
<!--                <a-input-number v-model="model.bgFareAmount" style="width: 100%" @change="setValue"></a-input-number>-->
<!--              </a-form-model-item>-->
<!--            </a-col>-->
          </a-row>
        </a-card>
      </a-form-model>
    </a-spin>
    <div  style="text-align: center;margin-top:15px;">
      <a-button key="cancel" @click="handleCancel" style="margin-left:10px;" type="primary" ghost>取消</a-button>
      <a-button  @click="handleOk" type="primary" style="margin-left:10px;" >提交</a-button>
    </div>

  </a-drawer>

</template>

<script>
import { filterDictTextByCache } from '@comp/dict/JDictSelectUtil'
import JFormContainer from '@/components/jeecg/JFormContainer'
import { billListMixin } from '../../mixins/billListMixin'
import { billModalMixin } from '../../mixins/billModalMixin'
import JSelectSupplierModal from '@comp/jeecgbiz/modal/JSelectSupplierModal'
import { isNullOrEmpty } from '@/utils/util'
import { httpAction } from '@api/manage'

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
      filterDictTextByCache,
      iegAmount,
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
      model: {

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
    setValue(){
      this.$forceUpdate()
    },
    handleOk(){
      let that = this;
      let bgPriceTax = that.model.bgPriceTax;
      if(isNullOrEmpty(bgPriceTax)){
        this.$message.error("请输入议价价格");
        return;
      }
      // let bgFareAmount = that.model.bgFareAmount;
      // if(isNullOrEmpty(bgFareAmount)){
      //   this.$message.error("请输入运费");
      //   return;
      // }
      that.$confirm({
        content: `是否确认提交`,
        onOk: () => {
          let url = "/srm/biddingBarginRecord/add";
          let post = "post";
          httpAction(url,that.model,post).then((res)=> {
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
    handleCancel(){
      this.visible = false;
    },
    edit(record) {
      this.visible = true;
      this.model = record;
    },
  }
}
</script>

<style lang="less" scoped>
.ant-row.ant-form-item {
  margin-bottom: 12px;
}
</style>