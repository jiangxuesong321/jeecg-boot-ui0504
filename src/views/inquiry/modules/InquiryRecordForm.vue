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
    <a-spin :spinning="confirmLoading" >
      <j-form-container>
        <!-- 主表单区域 -->
        <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
          <a-card class="card" title="基本信息" :bordered="false" style="margin-top: 15px;">
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="询价单号" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                  <a-input v-model="model.inquiryCode" placeholder="自动生成" disabled></a-input>
                  <!--                  {{ model.inquiryCode }}-->
                </a-form-model-item>
              </a-col>

              <a-col :span="8">
                <a-form-model-item label="询报价名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                   prop="inquiryName">
                  <!--                  <span v-if="formDisabled">{{ model.inquiryName }}</span>-->
                  <a-input  v-model="model.inquiryName" placeholder="询报价名称" :disabled="formDisabled"></a-input>
                </a-form-model-item>
              </a-col>

              <a-col :span="8">
                <a-form-model-item label="邀请方式" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                   prop="invitationMethod">
                  <!--                <a-input v-model="model.invitationMethod" placeholder="邀请方式"></a-input>-->
                  <j-dict-select-tag placeholder="请输入邀请方式" v-model="model.invitationMethod" dictCode="invitation_method"
                                     :disabled="formDisabled" />
                </a-form-model-item>
              </a-col>

              <!--              <a-col :span="8">-->
              <!--                <a-form-model-item label="采购员" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"-->
              <!--                                   prop="inquirer">-->
              <!--                  &lt;!&ndash;                <a-input v-model="model.inquirer" placeholder="请输入采购员"></a-input>&ndash;&gt;-->
              <!--                  <j-dict-select-tag v-model="model.inquirer" placeholder="请输入采购员" dictCode="sys_user,realname,username"-->
              <!--                                     :disabled="formDisabled" />-->
              <!--                </a-form-model-item>-->
              <!--              </a-col>-->

              <!--              <a-col :span="8">-->
              <!--                <a-form-model-item label="联系电话" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"-->
              <!--                                   prop="inquirerTel">-->
              <!--&lt;!&ndash;                  <span v-if="formDisabled">{{ model.inquirerTel }}</span>&ndash;&gt;-->
              <!--                  <a-input  v-model="model.inquirerTel" placeholder="请输入联系电话" :disabled="formDisabled"></a-input>-->
              <!--                </a-form-model-item>-->
              <!--              </a-col>-->

              <!--              <a-col :span="8">
                              <a-form-model-item label="币种" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                                 prop="currency">
                                &lt;!&ndash;                <a-input v-model="model.currency" placeholder="请输入联系电话"></a-input>&ndash;&gt;
                                <j-dict-select-tag placeholder="请输入币种" v-model="model.currency" dictCode="currency_type"
                                                   :disabled="formDisabled" />
                              </a-form-model-item>
                            </a-col>-->

              <a-col :span="8">
                <a-form-model-item label="是否单一供应商" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                   prop="isOne">
                  <!--                <a-input v-model="model.isOne" placeholder="请选择是否单一供应商"></a-input>-->
                  <j-dict-select-tag placeholder="是否单一供应商" v-model="model.isOne" dictCode="is_one"
                                     :disabled="formDisabled" />
                </a-form-model-item>
              </a-col>

              <a-col :span="8">
                <a-form-model-item label="报价截止日期" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                   prop="quotationDeadline">
                  <!--                  <span v-if="formDisabled">{{ model.quotationDeadline }}</span>-->
                  <j-date  placeholder="请选择报价截止日期" v-model="model.quotationDeadline" style="width: 100%"
                           :disabled="formDisabled" />
                </a-form-model-item>
              </a-col>

              <!--              <a-col :span="8">-->
              <!--                <a-form-model-item label="中标公告" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"-->
              <!--                                   prop="isNotice">-->
              <!--                  <a-radio-group v-model="model.isNotice" name="isNotice" :disabled="formDisabled">-->
              <!--                    <a-radio value="1">自动发布</a-radio>-->
              <!--                    <a-radio value="0">手动发布</a-radio>-->
              <!--                  </a-radio-group>-->
              <!--                </a-form-model-item>-->
              <!--              </a-col>-->

              <a-col :span="8" v-if="model.isOne == '1'">
                <a-form-model-item label="单一供应商附件" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                   prop="otherAttachment">
                  <j-upload v-model="model.otherAttachment" :trigger-change="true" :disabled="formDisabled"></j-upload>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-card>
          <a-card class="card card-baojia" title="报价信息" :bordered="false">
            <a-button class="float-btn" v-if="!show" @click="toBargainAll" type="dashed">全部发起议价</a-button>
            <table width="100%" class="inquiry-div" style="">
              <thead>
              <tr style="height: 50px">
                <th style="width: 40px;">序号</th>
                <th style="width: 160px;">物料信息</th>
                <th style="width: 80px;">采购量</th>
                <th style="width: 180px;">供应商</th>
                <th style="width: 55px;">币种</th>
                <th style="width: 60px;">税率(%)</th>
                <th style="width: 140px;">首次报价(含税单价)</th>
                <th style="width: 100px;">二次议价</th>
                <th style="width: 120px;">贸易方式</th>
                <!--                <th style="width: 80px;">运费</th>-->
                <th style="width: 100px;">中标数量</th>
                <th style="width: 120px;">报价品牌</th>
                <th style="width: 120px;">报价规格</th>
                <th style="width: 280px;" colspan="2">操作</th>
              </tr>
              </thead>
              <tbody v-for="(item, index) in dataSource">
              <tr v-for="(child,idx) in item.suppList">
                <td style="background-color:#fafafa; border: 1px solid #DDDDDD;text-align: center"
                    :rowspan="item.rowSpan" v-if="idx == '0'">
                  {{ index + 1 }}
                </td>
                <td style="background-color:#fafafa; border: 1px solid #DDDDDD; padding: 10px;" :rowspan="item.rowSpan"
                    v-if="idx == '0'">
                  <div style="margin-bottom: 10px;">
                    物料标识:<span style="color: #0000CC!important;text-decoration: underline;">{{ item.prodCode }}</span>
                  </div>
                  <div style="margin-bottom: 10px;">
                    物料名称:{{ item.prodName }}
                  </div>
                  <div style="margin-bottom: 10px;" v-if="model.reqType == '0'">
                    物料分类:{{ item.categoryName }}
                  </div>
                  <div style="margin-bottom: 10px;" v-if="model.reqType == '0'">
                    规格型号:{{ item.speType }}
                  </div>
                </td>
                <td style="background-color:#fafafa; border: 1px solid #DDDDDD;text-align: center"
                    :rowspan="item.rowSpan" v-if="idx == '0'">
                  {{ item.qty }}
                </td>
                <td
                  style="background-color:#fafafa; border: 1px solid #DDDDDD;min-height: 40px;padding-top: 10px;padding-bottom: 10px;text-align: center">
                  {{ child.name }}
                </td>
                <td style="background-color:#fafafa; border: 1px solid #DDDDDD;text-align: center">
                  {{ child.currencyName }}
                </td>
                <td style="background-color:#fafafa; border: 1px solid #DDDDDD;text-align: center">
                  <span v-if="child.taxRate != '100'">
                    {{ child.taxRate }} %
                  </span>
                  <span v-else-if="child.taxRate == '100'">
                    其他
                  </span>
                  <span v-else>-</span>
                </td>
                <td style="background-color:#fafafa; border: 1px solid #DDDDDD;text-align: right">
                  <span v-if="child.orderPriceTax != null && child.orderPriceTax != '' && child.orderPriceTax != undefined">
                     <span v-if="child.currency == 'RMB'">
                      ¥
                    </span>
                    <span v-if="child.currency == 'JPY'">
                      Ұ
                    </span>
                    <span v-if="child.currency == 'USD'">
                      $
                    </span>
                    <span v-if="child.currency == 'EUR'">
                      €
                    </span>
                  </span>
                  {{ child.orderPriceTax }}
                </td>
                <td style="background-color:#fafafa; border: 1px solid #DDDDDD;text-align: right">
                  <span v-if="child.bgOrderPriceTax != null && child.bgOrderPriceTax != '' && child.bgOrderPriceTax != undefined">
                    <span v-if="child.currency == 'RMB'">
                      ¥
                    </span>
                    <span v-if="child.currency == 'JPY'">
                      Ұ
                    </span>
                    <span v-if="child.currency == 'USD'">
                      $
                    </span>
                    <span v-if="child.currency == 'EUR'">
                      €
                    </span>
                  </span>
                  {{ child.bgOrderPriceTax }}
                  <span v-if="child.isRecommend == '1' && model.inquiryStatus == '2' && child.isContract != '1' && child.isBargin == '1'" style="color: red">
                    (议价中)
                  </span>
                  <span v-if="child.isRecommend == '1' && model.inquiryStatus == '2' && child.isContract != '1' && child.isBargin == '2'" style="color: red">
                    (已回复)
                  </span>
                </td>
                <td style="background-color:#fafafa; border: 1px solid #DDDDDD;text-align: center;padding: 5px;">
                  {{ child.tradeTypeName }}
                </td>
                <!--                <td style="background-color:#fafafa; border: 1px solid #DDDDDD;text-align: center">-->
                <!--                  {{ child.fareAmount }}-->
                <!--                </td>-->
                <td style="background-color:#fafafa; border: 1px solid #DDDDDD;text-align: center">
                  <span v-if="child.isRecommend != '1' || show"> {{ child.inquiryQty }} </span>
                  <a-input-number v-else v-model="child.inquiryQty" style="width: 90%; text-align: center;"
                                  :disabled="child.isRecommend != '1' || show" @change="setValue"></a-input-number>
                </td>
                <td style="background-color:#fafafa; border: 1px solid #DDDDDD;text-align: center">
                  <a-input v-model="child.brandName" v-if="child.quoteId != null && child.quoteId != undefined" :disabled="show"></a-input>
                </td>
                <td style="background-color:#fafafa; border: 1px solid #DDDDDD;text-align: center">
                  <a-input v-model="child.speType" v-if="child.quoteId != null && child.quoteId != undefined" :disabled="show"></a-input>
                </td>
                <td
                  style="background-color:#fafafa; border: 1px solid #DDDDDD;width: 120px;text-align: left;padding-left: 10px;">
                  <a-checkbox v-model="child.isRecommend" @change="clearRadio(item,child)" :disabled="show"
                              style="color: #618dfa;">推荐
                  </a-checkbox>
                  <a style="margin-left: 10px" v-if="!show && (child.status == '1' || child.status == '3')"@click="goBargin(item,idx)">发起议价</a>
                  <a style="margin-left: 10px" @click="handleHistory(item,child)">历史报价</a>
                  <a style="margin-left: 10px" @click="handleChild(item,child)">配套产品</a>
                  <a style="margin-left: 10px" @click="toEndBargin(item,child)"
                     v-if="child.isRecommend == '1' && model.inquiryStatus == '2' && child.isContract != '1' && (child.isBargin == '0' || child.isBargin == '2')">再次议价</a>
                </td>
              </tr>
              </tbody>
            </table>

          </a-card>
          <a-card class="card" title="附件" :bordered="false" style="margin-top: 15px;">
            <a-row>
              <a-col :span="24">
                <a-button type="primary" style="float: right;z-index: 999;margin-top: -55px;" size="small"
                          @click="changeFileName(model.id,model.attachment,'attachment','attachment')" v-if="model.attachment != null && model.attachment != ''">修改文件名</a-button>
                <a-form-item label="附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
                  <j-upload v-model="model.attachment" :trigger-change="true" :disabled="formDisabled"></j-upload>
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>
          <!--          <a-card class="card" title="备注" :bordered="false" style="margin-top: 15px;">-->
          <!--            <a-row>-->
          <!--              <a-col :span="24">-->
          <!--                <a-form-item label="采购说明" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">-->
          <!--                  <span v-if="formDisabled">{{ model.inquiryName }}</span>-->
          <!--                  <a-input v-else v-model="model.remark" placeholder="请输入采购说明" :rows="3" type="textarea"-->
          <!--                           :disabled="formDisabled">-->
          <!--                  </a-input>-->
          <!--                </a-form-item>-->
          <!--              </a-col>-->
          <!--            </a-row>-->
          <!--            <a-row>-->
          <!--              <a-col :span="24">-->
          <!--                <a-form-item label="投标须知" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">-->
          <!--                  <span v-if="formDisabled">{{ model.comment }}</span>-->
          <!--                  <a-input v-else v-model="model.comment" placeholder="请输入投标须知" :rows="3" type="textarea"-->
          <!--                           :disabled="formDisabled">-->
          <!--                  </a-input>-->
          <!--                </a-form-item>-->
          <!--              </a-col>-->
          <!--            </a-row>-->
          <!--          </a-card>-->
          <!--          <a-card class="card" title="需求附件" :bordered="false" style="margin-top: 15px;">-->
          <!--            <a-row>-->
          <!--              <a-col :span="24">-->
          <!--                <a-form-item label="需求附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">-->
          <!--                  <j-upload v-model="model.purOtherAttachment" :trigger-change="true" :disabled="true">-->
          <!--                  </j-upload>-->
          <!--                </a-form-item>-->
          <!--              </a-col>-->
          <!--            </a-row>-->
          <!--          </a-card>-->
          <!--          <a-card class="card" title="规格配置附件" :bordered="false" style="margin-top: 15px;">-->
          <!--            <a-row>-->
          <!--              <a-col :span="24">-->
          <!--                <a-form-item label="规格配置附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">-->
          <!--                  <j-upload v-model="model.purAttachment" :trigger-change="true" :disabled="true">-->
          <!--                  </j-upload>-->
          <!--                </a-form-item>-->
          <!--              </a-col>-->
          <!--            </a-row>-->
          <!--          </a-card>-->
          <!--          <a-card class="card" title="规格配置说明" :bordered="false" style="margin-top: 15px;">-->
          <!--            <a-row>-->
          <!--              <a-col :span="24">-->
          <!--                <a-form-item label="规格配置说明" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">-->
          <!--                  <a-input v-model="model.purComment" placeholder="" :rows="3" type='textarea' :disabled="true">-->
          <!--                  </a-input>-->
          <!--                </a-form-item>-->
          <!--              </a-col>-->
          <!--            </a-row>-->
          <!--          </a-card>-->
        </a-form-model>
      </j-form-container>
    </a-spin>
    <div style="text-align: center;margin-top:15px;">
      <a-button key="cancel" @click="handleCancel" style="margin-left:10px;" type="primary" ghost>取消</a-button>
      <a-button @click="handleEnd" type="primary" style="margin-left:10px;" v-if="!show">结束比价</a-button>
      <a-button @click="handleOk" type="primary" style="margin-left:10px;" v-if="!show">提交</a-button>
    </div>
    <bargain-form ref="modalForm" @ok="toBack"></bargain-form>
    <bargain-all-form ref="modalAllForm" @ok="toBack"></bargain-all-form>
    <price-history-form ref="priceForm"></price-history-form>
    <quote-child-form ref="quoteForm"></quote-child-form>
    <change-file-name ref="cfn" @back="toSetUrl"></change-file-name>
  </a-drawer>

</template>

<script>

import { getAction, httpAction } from '@/api/manage'
import JFormContainer from '@/components/jeecg/JFormContainer'
import { billListMixin } from '../../mixins/billListMixin'
import { billModalMixin } from '../../mixins/billModalMixin'
import JSelectSupplierModal from '@comp/jeecgbiz/modal/JSelectSupplierModal'
import BargainForm from '@views/inquiry/modules/BargainOneForm'
import PriceHistoryForm from '@views/inquiry/modules/PriceHistoryForm'
import { isNotNullOrEmpty, isNullOrEmpty, preciseNum } from '@/utils/util'
import BargainAllForm from '@views/inquiry/modules/BargainAllForm'
import QuoteChildForm from '@views/inquiry/modules/QuoteChildForm'
import ChangeFileName from '@comp/jeecgbiz/ChangeFileName'
export default {
  name: 'InquiryListForm',
  mixins: [billListMixin, billModalMixin],
  components: {
    JFormContainer,
    JSelectSupplierModal,
    BargainForm,
    BargainAllForm,
    PriceHistoryForm,
    QuoteChildForm,
    ChangeFileName
  },
  data() {
    return {
      param:{},
      confirmLoading: false,
      visible: false,
      show: false,
      title: '查看比价',
      width: '90%',
      dataSource: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      model: {
        inquirer: '',
        inquirerTel: '',
        inquiryName: '',
        invitationMethod: '',
        currency: '',
        quotationDeadline: '',
        isNotice: '',
        isOne: ''
      },
      validatorRules: {},
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
    toEndBargin(item,child){
      let record = JSON.parse(JSON.stringify(child))
      record.qty = item.qty
      record.prodName = item.prodName
      record.prodCode = item.prodCode
      record.categoryName = item.categoryName
      record.speType = item.speType
      if(isNotNullOrEmpty(record.bgOrderPriceTax)){
        record.orderPriceTax = record.bgOrderPriceTax;
      }
      if (isNullOrEmpty(record.bgOrderPriceTax)) {
        record.bgOrderPriceTax = record.orderPriceTax
      }
      record.bgFareAmount = record.fareAmount
      this.$refs.modalForm.edit(record)
    },
    toSetUrl(url){
      this.model[this.param.filed] = url;
    },
    changeFileName(id,url,column,filed){
      //判断文件列表是否为空
      let that = this;
      if(isNullOrEmpty(url)){
        that.$message.error("当前没有可修改的文件");
        return;
      }
      let urls = url.split(',');
      let urlList = [];
      urls.filter(item => {
        let url = {
          oldUrl:item,
          newUrl:'',
        }
        urlList.push(url);
      })
      that.param.id = id;
      that.param.urlList = urlList;
      that.param.filed = filed;
      that.param.column = column;
      that.param.table = "inquiry_list";
      that.$refs.cfn.initData(that.param);
    },
    handleHistory(item, child) {
      let recordId = item.id
      let suppId = child.supplierId
      let param = {
        recordId: recordId,
        suppId: suppId
      }
      this.$refs.priceForm.edit(param)
    },
    toBack() {
      this.getDetailList(this.model.id)
    },
    toBargainAll() {
      let dataSource = JSON.parse(JSON.stringify(this.dataSource))
      let dataList = []
      //议价价格、运费默认 报价价格
      dataSource.filter(item => {
        let suppList = item.suppList
        suppList.filter(child => {
          if (child.status == '1' || child.status == '3') {
            if (isNotNullOrEmpty(child.bgOrderPriceTax)) {
              child.orderPriceTax = child.bgOrderPriceTax
            } else {
              child.bgOrderPriceTax = child.orderPriceTax
            }
            child.bgFareAmount = child.fareAmount
            child.suppId = child.supplierId

            child.qty = item.qty
            child.prodName = item.prodName
            child.prodCode = item.prodCode
            child.categoryName = item.categoryName
            child.speType = item.speType
            dataList.push(child)
          }
        })
      })
      if (dataList == null || dataList.length == 0) {
        this.$message.error('当前没有可议价的供应商')
        return
      }
      this.$refs.modalAllForm.edit(dataList)
    },
    handleChild(item,child){
      let quoteId = child.quoteId;
      this.$refs.quoteForm.edit({quoteId:quoteId});
    },
    goBargin(item, index) {
      let record = JSON.parse(JSON.stringify(item.suppList[index]))
      record.qty = item.qty
      record.prodName = item.prodName
      record.prodCode = item.prodCode
      record.categoryName = item.categoryName
      record.speType = item.speType
      if (isNullOrEmpty(record.bgOrderPriceTax)) {
        record.bgOrderPriceTax = record.orderPriceTax
      }
      record.bgFareAmount = record.fareAmount
      record.suppId = record.supplierId
      this.$refs.modalForm.edit(record)
    },
    handleCancel() {
      this.visible = false
    },
    handleOk() {
      let that = this
      let ruleForm = JSON.parse(JSON.stringify(that.model))
      ruleForm.recordList = that.dataSource
      let dataSource = that.dataSource
      for (let i = 0; i < dataSource.length; i++) {
        //询价数量
        let qty = dataSource[i].qty
        let suppList = dataSource[i].suppList
        let inquiryQty = 0
        let flag = false
        suppList.filter(item => {
          if (item.isRecommend == '1') {
            item.isRecommend = 1
            flag = true
            if (isNullOrEmpty(item.inquiryQty) || item.inquiryQty <= 0) {
              that.$message.error('第' + (i + 1) + '行,请输入中标数量')
              throw '第' + (i + 1) + '行,请输入中标数量'
            }
            inquiryQty = Number(inquiryQty) + Number(item.inquiryQty)
          } else {
            item.isRecommend = 0
          }
        })
        if (!flag) {
          that.$message.error('第' + (i + 1) + '行,请选择中标供应商')
          return
        }
        inquiryQty = Number(preciseNum(inquiryQty, 2))
        if (Number(qty) < Number(inquiryQty)) {
          that.$message.error('第' + (i + 1) + '行,中标数量不能大于询价数量')
          return
        }
      }
      that.$confirm({
        content: `是否确认提交`,
        onOk: () => {
          let url = '/srm/inquiryList/toRecommend'
          let post = 'post'
          httpAction(url, ruleForm, post).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.handleCancel()
              that.$emit('ok')
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    handleEnd() {
      let that = this
      let ruleForm = JSON.parse(JSON.stringify(that.model))
      ruleForm.inquiryStatus = '2'
      ruleForm.recordList = that.dataSource
      let dataSource = that.dataSource
      for (let i = 0; i < dataSource.length; i++) {
        //询价数量
        let qty = dataSource[i].qty
        let suppList = dataSource[i].suppList
        let inquiryQty = 0
        let flag = false
        suppList.filter(item => {
          if (item.isRecommend == '1') {
            flag = true
            item.isRecommend = 1
            if (isNullOrEmpty(item.inquiryQty) || item.inquiryQty <= 0) {
              that.$message.error('第' + (i + 1) + '行,请输入中标数量')
              throw '第' + (i + 1) + '行,请输入中标数量'
            }
            inquiryQty = Number(inquiryQty) + Number(item.inquiryQty)
          } else {
            item.isRecommend = 0
          }
        })
        if (!flag) {
          that.$message.error('第' + (i + 1) + '行,请选择中标供应商')
          return
        }
        inquiryQty = Number(preciseNum(inquiryQty, 2))
        if (Number(qty) < Number(inquiryQty)) {
          that.$message.error('第' + (i + 1) + '行,中标数量不能大于询价数量')
          return
        }
      }
      that.$confirm({
        content: `是否确认提交`,
        onOk: () => {
          let url = '/srm/inquiryList/toRecommand'
          let post = 'post'
          that.confirmLoading = true;
          httpAction(url, ruleForm, post).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.handleCancel()
              that.$emit('ok')
            } else {
              that.$message.warning(res.message)
            }
          }).finally(() => {
            this.confirmLoading = false
          })
        }
      })
    },
    setValue() {
      this.$forceUpdate()
    },
    clearRadio(item, child) {
      child.inquiryQty = null
      // //当前点击行id
      // let id = child.id;
      // item.suppList.filter(itx => {
      //   itx.isRecommend = '0';
      //   if(itx.id == id){
      //     itx.isRecommend = '1';
      //   }
      //   this.$forceUpdate();
      // })
    },
    edit(record) {
      this.show = false
      if (record.inquiryStatus == '2' || record.inquiryStatus == '3' || record.inquiryStatus == '4') {
        this.show = true
      }
      this.dataSource = []
      this.visible = true
      this.model = Object.assign({}, record)
      if (this.model.id) {
        this.getDetailList(this.model.id)
      }
    },
    getDetailList(id) {
      let url = '/srm/inquiryList/queryRecordList'
      getAction(url, { id: id }).then(res => {
        this.dataSource = res.result
      })
    }

  }
}
</script>
<style>
.float-btn {
  float: right;
  margin-bottom: 10px;
  margin-top: -50px;
}

.card-baojia {
  margin-top: 15px;
}

.card-baojia .ant-card-body {
  padding-left: 0;
  padding-right: 0;
}

.inquiry-div {
  border: 1px solid black;
  border-collapse: collapse;
  width: 100%;
}

.inquiry-div thead tr th {
  background-color: #fafafa;
  border: 1px solid #DDDDDD;
  text-align: center;
}

</style>
<style lang="less" scoped>
.ant-row.ant-form-item {
  margin-bottom: 12px;
}
</style>