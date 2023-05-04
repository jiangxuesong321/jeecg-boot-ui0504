<template>
	<a-spin :spinning="confirmLoading">
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="招标信息" key="0">
        <j-form-container >
          <!-- 主表单区域 -->
          <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
            <a-card class="card" title="基本信息" :bordered="false" style="margin-top: 15px;">
              <a-row>
                <a-col :span="8">
                  <a-form-model-item label="招标编码" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="biddingNo">
                    <a-input v-model="model.biddingNo" placeholder="编码自动生成" disabled></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="招标名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                     prop="biddingName">
                    <a-input v-model="model.biddingName" placeholder="请输入招标名称" :disabled="formDisabled"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="招标类型" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
<!--                    <a-input v-model="model.biddingType" placeholder="请输入招标类型"></a-input>-->
                    <j-dict-select-tag type="select" v-model="model.biddingType" dictCode="bidding_type" placeholder="请输入招标类型" :disabled="formDisabled"/>
                  </a-form-model-item>
                </a-col>
<!--                <a-col :span="8">-->
<!--                  <a-form-model-item label="招标币种" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"-->
<!--                                     >-->
<!--&lt;!&ndash;                    <a-input v-model="model.biddingCurrency" placeholder="请输入招标币种"></a-input>&ndash;&gt;-->
<!--                    <j-dict-select-tag type="select" v-model="model.biddingCurrency" dictCode="currency_type" placeholder="请输入招标币种" :disabled="formDisabled"/>-->
<!--                  </a-form-model-item>-->
<!--                </a-col>-->
                <a-col :span="8">
                  <a-form-model-item label="开标方式" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                     prop="openBiddingType">
<!--                    <a-input v-model="model.openBiddingType" placeholder="请输入开标方式"></a-input>-->
                    <j-dict-select-tag type="select" v-model="model.openBiddingType" dictCode="open_bidding_type" placeholder="请输入开标方式" :disabled="formDisabled"/>
                  </a-form-model-item>
                </a-col>
<!--                <a-col :span="8">-->
<!--                  <a-form-model-item label="评标方式" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"-->
<!--                                     prop="biddingMethod">-->
<!--&lt;!&ndash;                    <a-input v-model="model.biddingMethod" placeholder="请输入评标方式"></a-input>&ndash;&gt;-->
<!--                    <j-dict-select-tag type="select" v-model="model.biddingMethod" dictCode="bidding_method" placeholder="请输入评标方式" :disabled="formDisabled"/>-->

<!--                  </a-form-model-item>-->
<!--                </a-col>-->
                <a-col :span="8">
                  <a-form-model-item label="开标地址" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                     prop="openBiddingAddress">
<!--                    <a-input v-model="model.openBiddingAddress" placeholder="请输入开标地址" :disabled="formDisabled"></a-input>-->
                    <j-dict-select-tag v-model="model.openBiddingAddress" placeholder="请输入开标地址"
                                       dictCode="sys_depart,depart_name,id,parent_id = '-1'"
                                       :disabled="formDisabled" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="投标截至时间" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                     prop="biddingDeadline">
                    <j-date placeholder="请选择投标截至时间" v-model="model.biddingDeadline" style="width: 100%" :disabled="formDisabled"/>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="开标时间" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                     prop="openBiddingDate">
                    <j-date placeholder="请选择开标时间" v-model="model.openBiddingDate" style="width: 100%" :disabled="formDisabled"/>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="评标时间" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                     prop="date">
                    <a-range-picker
                      v-model = "model.date"
                      format="YYYY-MM-DD"
                      :placeholder="['开始时间', '结束时间']"
                      @change="onBirthdayChange"
                      :disabled="formDisabled"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="是否显示供应商排名" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="isSort">
                    <a-radio-group v-model="model.isSort" name="isSort" :disabled="formDisabled" @change="setVal">
                      <a-radio value="1">是</a-radio>
                      <a-radio value="0">否</a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </a-col>
<!--                <a-col :span="8">-->
<!--                  <a-form-model-item label="中标公告" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="isNotice">-->
<!--                    <a-radio-group v-model="model.isNotice" name="isNotice" :disabled="formDisabled" @change="setVal">-->
<!--                      <a-radio value="1">自动发布</a-radio>-->
<!--                      <a-radio value="0">手动发布</a-radio>-->
<!--                    </a-radio-group>-->
<!--                  </a-form-model-item>-->
<!--                </a-col>-->
                <a-col :span="8">
                  <a-form-model-item label="是否多次报价" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="isQuotes">
                    <a-radio-group v-model="model.isQuotes" name="isQuotes" :disabled="formDisabled" @change="setVal">
                      <a-radio value="1">是</a-radio>
                      <a-radio value="0">否</a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </a-col>

                <a-col :span="8">
                  <a-form-model-item label="盲标" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="isMangbiao">
                    <a-radio-group v-model="model.isMangbiao" name="isMangbiao" :disabled="formDisabled" @change="setVal">
                      <a-radio value="1">是</a-radio>
                      <a-radio value="0">否</a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-card>
            <a-card class="card" title="招标明细" :bordered="false" style="margin-top: 15px;">
              <a-table
                v-if="model.reqType == '0'"
                ref="table"
                size="middle"
                bordered
                rowKey="id"
                class="j-table-force-nowrap"
                :scroll="{x:true}"
                :columns="ptype == 'normal' ? columns : columns5"
                :dataSource="dataSource"
                :row-selection="{ selectedRowKeys: selectedRowKeys,onChange: onSelectChange }"
                :pagination="false">
                <template slot="qty" slot-scope="text,record">
                  <a-input-number v-model="record.qty" :disabled="formDisabled" :max="record.maxQty - record.purcQty" v-if="ptype != 'change'"></a-input-number>
                  <span v-else>
                    {{text}}
                  </span>
                </template>
                <template slot="leadTime" slot-scope="text,record">
                  <a-date-picker v-model="record.leadTime" style="width: 100%" :disabled="formDisabled"/>
                </template>
              </a-table>
              <a-table
                v-if="model.reqType != '0'"
                ref="table"
                size="middle"
                bordered
                rowKey="id"
                class="j-table-force-nowrap"
                :scroll="{x:true}"
                :row-selection="{ selectedRowKeys: selectedRowKeys,onChange: onSelectChange }"
                :columns="ptype == 'normal' ? columns1 : columns6"
                :dataSource="dataSource"
                :pagination="false"
              >
                <template slot="qty" slot-scope="text,record" >
                  <a-input-number v-model="record.qty" :disabled="formDisabled" :max="record.maxQty - record.purcQty" v-if="ptype != 'change'"></a-input-number>
                  <span v-else>
                    {{text}}
                  </span>
                </template>
                <template slot="leadTime" slot-scope="text,record">
                  <a-date-picker v-model="record.leadTime" style="width: 100%" :disabled="formDisabled"/>
                </template>
              </a-table>
            </a-card>
            <a-card class="card" title="邀请供应商" :bordered="false" style="margin-top: 15px;">
              <a-button type="primary" style="float: right;overflow: hidden;margin-bottom: 10px;z-index: 99999" @click="selectSupp" :disabled="formDisabled">选择供应商</a-button>
              <a-table
                ref="table"
                size="middle"
                bordered
                rowKey="code"
                class="j-table-force-nowrap"
                :scroll="{x:true}"
                :columns="columns2"
                :dataSource="suppList"
                :pagination="false"
              >
                <template slot="action" slot-scope="text,record,index">
                  <a @click="delRow(index)" :disabled="formDisabled">删除</a>
                </template>
              </a-table>
              <j-select-supplier-modal ref="suppForm" modalWidth="80%" :multi="true" @ok="toBack"></j-select-supplier-modal>
            </a-card>
            <!-- 子表单区域 -->
            <a-card class="card" title="附件" :bordered="false" style="margin-top: 15px;">
              <a-row>
                <a-col :span="24">
                  <a-button type="primary" style="float: right;z-index: 999;margin-top: -55px;" size="small"
                            @click="changeFileName(model.id,model.attachment,'attachment','attachment')" v-if="model.attachment != null && model.attachment != ''">修改文件名</a-button>
                  <a-form-item label="附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
                    <j-upload v-model="model.attachment" :trigger-change="true" :disabled="formDisabled">
                    </j-upload>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>
            <a-card class="card" title="投标须知" :bordered="false" style="margin-top: 15px;">
              <a-row>
                <a-col :span="24">
                  <a-form-item label="投标须知" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
                    <a-input v-model="model.comment" placeholder="请输入投标须知" :rows="3" type='textarea' :disabled="formDisabled">
                    </a-input>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>
            <a-card class="card" title="需求附件" :bordered="false" style="margin-top: 15px;">
              <a-row>
                <a-col :span="24">
                  <a-form-item label="需求附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
                    <j-upload v-model="model.purOtherAttachment" :trigger-change="true" :disabled="true">
                    </j-upload>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>
            <a-card class="card" title="规格配置附件" :bordered="false" style="margin-top: 15px;">
              <a-row>
                <a-col :span="24">
                <a-form-item label="规格配置附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
                    <j-upload v-model="model.purAttachment" :trigger-change="true" :disabled="true">
                    </j-upload>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>
            <a-card class="card" title="规格配置说明" :bordered="false" style="margin-top: 15px;">
              <a-row>
                <a-col :span="24">
                  <a-form-item label="规格配置说明" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
                    <a-input v-model="model.purComment" placeholder="" :rows="3" type='textarea' :disabled="true">
                    </a-input>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>
          </a-form-model>
        </j-form-container>
      </a-tab-pane>
      <a-tab-pane tab="评标模板" key="1">
<!--        <a-button style="float: right;position: absolute;margin-top: -60px;margin-left: 90%" icon="plus" type="primary" @click="openTemplate" :disabled="formDisabled">选择评标类型</a-button>-->

        <j-modal
          width="30%"
          :visible="visible"
          title="评标类型"
          switchFullscreen
          wrapClassName="j-user-select-modal"
          @cancel="close"
          style="top:50px"
          cancelText="关闭">
          <a-checkbox-group v-model:value="checkValues" style="width: 100%" @change="clearData">
            <a-row>
              <a-col :span="8">
                <a-checkbox value="0">技术标评审</a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox value="1">商务标评审</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
          <template slot="footer" >
            <a-button @click="close" type="primary" style="margin-right: 0.8rem">关闭</a-button>
          </template>
        </j-modal>
        <!--技术标评审-->
        <div v-if="checkValues != null && checkValues.indexOf('0') > -1">
          <a-row>
            <a-col :span="6">
              <a-tag color="#2db7f5">技术标评审</a-tag>
            </a-col>
            <a-col :span="6">
              <span>
                权重
                <a-input-number
                  style="width: 40%"
                  v-model="weight[checkValues.indexOf('0')]"
                  :min="0"
                  :max="100"
                  disabled
                />
              </span>
            </a-col>
            <a-col :span="6"></a-col>
            <a-col :span="6">
              <a-button  type="primary" style="float: right" @click="openTemp('0')" :disabled="formDisabled">选择评分模板</a-button>
            </a-col>
          </a-row>

          <a-table
            style="margin-top: 10px"
            ref="table"
            size="middle"
            :scroll="{x:true}"
            bordered
            :columns="columns3"
            :dataSource="templateList"
            :pagination="false"
            class="j-table-force-nowrap">

            <template slot="action" slot-scope="text,record,index">
              <a @click="openExpert(record,'0')" :disabled="formDisabled">选择评标专家</a>
            </template>

            <template slot="itemName" slot-scope="text,record,index">
              <a-icon type="minus-circle" @click="delRecord(index,'0')" v-if="!formDisabled"/>
              <a-input v-model="record.itemName" :maxLength="50" :disabled="formDisabled" style="width: 80%;margin-left: 10px"></a-input>
            </template>

            <template slot="itemStandard" slot-scope="text,record,index">
              <a-input v-model="record.itemStandard" :maxLength="250"  :disabled="formDisabled"></a-input>
            </template>

            <template slot="itemScore" slot-scope="text,record,index">
              <a-input-number v-model="record.itemScore" style="width: 100%"  :disabled="formDisabled" @change="changeVal('0')" :min="0" :max="100"></a-input-number>
            </template>

            <template slot="professionalId" slot-scope="text,record,index">
              <span v-if="record.professionalName != null && record.professionalName != '' && record.professionalName != undefined">
                <span v-for="(item,index) in record.professionalName.split(',')">
                  <a-tag color="#2db7f5">{{item}}<a-icon type="close" @click="delChild(item,'0',index)" v-if="!formDisabled"/></a-tag>
                </span>
              </span>
            </template>
          </a-table>

          <div v-if="!formDisabled" @click="addRow('0')">
            <a-icon type="plus-circle" />
            <span style="font-size:16px;matgin-top:20px;color: #00348b;position: relative;" >添加</span>
          </div>
        </div>

        <!--商务标评审-->
        <div v-if="checkValues != null && checkValues.indexOf('1') > -1" style="margin-top: 40px">
          <a-row>
            <a-col :span="6">
              <a-tag color="#2db7f5">商务标评审</a-tag>
            </a-col>
            <a-col :span="6">
              <span>
                权重
                <a-input-number
                  style="width: 40%"
                  v-model="weight[checkValues.indexOf('1')]"
                  :min="0"
                  :max="100"
                  disabled
                />
              </span>
            </a-col>
            <a-col :span="6"></a-col>
            <a-col :span="6">
              <a-button  type="primary" style="float: right" @click="openTemp('1')" :disabled="formDisabled">选择评分模板</a-button>
            </a-col>
          </a-row>
          <a-table
            style="margin-top: 10px"
            ref="table"
            size="middle"
            :scroll="{x:true}"
            bordered
            :columns="columns4"
            :dataSource="templateList1"
            :pagination="false"
            class="j-table-force-nowrap">
            <template slot="action" slot-scope="text,record,index">
              <a @click="openExpert(record,'1')" :disabled="formDisabled">选择评标专家</a>
            </template>

            <template slot="itemName" slot-scope="text,record,index">
              <a-icon type="minus-circle" @click="delRecord(index,'1')" v-if="!formDisabled"/>
              <a-input v-model="record.itemName" :maxLength="50" :disabled="formDisabled" style="width: 80%;margin-left: 10px"></a-input>
            </template>

            <template slot="itemStandard" slot-scope="text,record,index">
              <a-input v-model="record.itemStandard" :maxLength="250" :disabled="formDisabled"></a-input>
            </template>

            <template slot="itemScore" slot-scope="text,record,index">
              <a-input-number v-model="record.itemScore" style="width: 100%" :disabled="formDisabled" @change="changeVal('1')" :min="0" :max="100"></a-input-number>
            </template>

            <template slot="professionalId" slot-scope="text,record,index">
              <span v-if="record.professionalName != null && record.professionalName != '' && record.professionalName != undefined">
                <span v-for="(item,index) in record.professionalName.split(',')">
                  <a-tag color="#2db7f5">{{item}}<a-icon type="close" @click="delChild(item,'1',index)" v-if="!formDisabled"/></a-tag>
                </span>
              </span>
            </template>
          </a-table>
          <div v-if="!formDisabled" @click="addRow('1')">
            <a-icon type="plus-circle" />
            <span style="font-size:16px;matgin-top:20px;color: #00348b;position: relative;"  :disabled="formDisabled">添加</span>
          </div>
        </div>
        <bas-template ref="basTemplate" :templateType="templateType" @ok="back"></bas-template>
        <bas-expert ref="basExpert" :userCategory="userCategory" @ok="goBack" :record="record"></bas-expert>
      </a-tab-pane>
    </a-tabs>
    <change-file-name ref="cfn" @back="toSetUrl"></change-file-name>
	</a-spin>
</template>

<script>
import { getAction, httpAction } from '@/api/manage'
import { JVxeTableModelMixin } from '@/mixins/JVxeTableModelMixin.js'
import JFormContainer from '@/components/jeecg/JFormContainer'
import { billListMixin } from '../../mixins/billListMixin'
import { billModalMixin } from '../../mixins/billModalMixin'
import JSelectSupplierModal from '@comp/jeecgbiz/modal/JSelectSupplierModal'
import BasTemplate from '@views/bidding/modules/BasTemplate'
import BasExpert from '@views/bidding/modules/BasExpert'
import { isNotNullOrEmpty, isNullOrEmpty } from '@/utils/util'
import ChangeFileName from '@comp/jeecgbiz/ChangeFileName'
export default {
		name: 'BiddingMainForm',
		mixins: [JVxeTableModelMixin,billListMixin, billModalMixin],
		components: {
			JFormContainer,
      JSelectSupplierModal,
      BasTemplate,
      BasExpert,
      ChangeFileName
		},
		data() {
			return {
        param:{},
        selectedRowKeys: [],
        selectionRows:[],
        record:{},
        userCategory:'',
        templateType:'',
        weight:[],
        checkValues:['0','1'],
        visible:false,
        suppList:[],
        templateList1:[],
        templateList:[],
        columns4:[
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
            title: '评分项',
            dataIndex: 'itemName',
            align:"center",
            width:140,
            scopedSlots: { customRender: 'itemName' },
          },
          {
            title: '评分标准',
            align:"center",
            dataIndex: 'itemStandard',
            width:140,
            scopedSlots: { customRender: 'itemStandard' },
          },
          {
            title: '满分',
            align:"center",
            dataIndex: 'itemScore',
            width:140,
            scopedSlots: { customRender: 'itemScore' },
          },
          {
            title: '评标专家',
            align:"center",
            dataIndex: 'professionalId',
            width:140,
            scopedSlots: { customRender: 'professionalId' },
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:100,
            // scopedSlots: { customRender: 'action' },
            customRender: (value, row, index) => {
              let obj = {
                children: this.$createElement(
                  'a',
                  {
                    on: {
                      click: () => {
                        this.openExpert(row, '1')
                      }
                    },
                  },
                  [
                    !this.formDisabled ? '选择专家' : ''
                  ]
                ),
                attrs: {}
              }
              if (index === 0) {
                obj.attrs.rowSpan = 99;
              }
              if (index >= 1) {
                obj.attrs.rowSpan = 0;
              }
              return obj
            }
          }
        ],
        columns3:[
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
            title: '评分项',
            align:"center",
            dataIndex: 'itemName',
            width:140,
            scopedSlots: { customRender: 'itemName' },
          },
          {
            title: '评分标准',
            align:"center",
            dataIndex: 'itemStandard',
            width:140,
            scopedSlots: { customRender: 'itemStandard' },
          },
          {
            title: '满分',
            align:"center",
            dataIndex: 'itemScore',
            width:140,
            scopedSlots: { customRender: 'itemScore' },
          },
          {
            title: '评标专家',
            align:"center",
            dataIndex: 'professionalId',
            width:140,
            scopedSlots: { customRender: 'professionalId' },
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:100,
            // scopedSlots: { customRender: 'action' },
            customRender: (value, row, index) => {
              let obj = {
                children: this.$createElement(
                  'a',
                  {
                    on: {
                      click: () => {
                        this.openExpert(row, '0')
                      }
                    },
                  },
                  [
                    !this.formDisabled ? '选择专家' : ''
                  ]
                ),
                attrs: {}
              }
              if (index === 0) {
                obj.attrs.rowSpan = 99;
              }
              if (index >= 1) {
                obj.attrs.rowSpan = 0;
              }
              return obj
            }
          }
        ],
        columns2:[
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
            title: '供应商名称',
            dataIndex: 'name',
            align:"center",
            width:140,
          },
          // {
          //   title: '统一社会信用代码',
          //   dataIndex: 'socialCode',
          //   width:140,
          // },
          {
            title: '供应商联系人',
            dataIndex: 'contacter',
            align:"center",
            width:140,
          },
          {
            title: '供应商联系方式',
            dataIndex: 'contacterTel',
            align:"center",
            width:140,
          },
          {
            title: '供应商邮箱',
            dataIndex: 'contacterEmail',
            align:"center",
            width:140,
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:100,
            scopedSlots: { customRender: 'action' },
          }
        ],
        columns1:[
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
            title: '购置名称',
            dataIndex: 'prodName',
            width:140,
            align:"center",
          },
          {
            title: '采购申请数量',
            dataIndex: 'maxQty',
            align:"center",
            width:120,
          },
          {
            title: '招标数量',
            dataIndex: 'qty',
            width:120,
            align:"center",
            scopedSlots: { customRender: 'qty' },
          },
          {
            title: '已处理数量',
            dataIndex: 'purcQty',
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
            title: '交货日期',
            dataIndex: 'leadTime',
            align:"center",
            scopedSlots: { customRender: 'leadTime' },
            width:120,
          },
        ],
        columns6:[
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
            title: '购置名称',
            dataIndex: 'prodName',
            align:"center",
            width:140,
          },
          {
            title: '采购申请数量',
            dataIndex: 'maxQty',
            align:"center",
            width:120,
          },
          {
            title: '招标数量',
            dataIndex: 'qty',
            align:"center",
            width:120,
            scopedSlots: { customRender: 'qty' },
          },
          {
            title: '交货日期',
            dataIndex: 'leadTime',
            align:"center",
            scopedSlots: { customRender: 'leadTime' },
            width:120,
          },
        ],
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
            title: '购置物料名称',
            dataIndex: 'prodName',
            align:"center",
            width:120,
          },
          {
            title: '意向规格型号',
            dataIndex: 'speType',
            width:140,
            align:"center",
          },
          {
            title: '意向品牌',
            dataIndex: 'brandName',
            width:140,
            align:"center",
          },
          {
            title: '物料类型',
            dataIndex: 'model_dictText',
            align:"center",
            width:120,
          },
          {
            title: '采购申请数量',
            dataIndex: 'maxQty',
            align:"center",
            width:120,
          },
          {
            title: '模块规划产能',
            dataIndex: 'capacity',
            width:120,
            align:"center",
          },
          {
            title: '单台产能',
            dataIndex: 'singleCapacity',
            width:120,
            align:"center",
          },
          {
            title: '招标数量',
            dataIndex: 'qty',
            align:"center",
            width:120,
            scopedSlots: { customRender: 'qty' },
          },
          {
            title: '合计产能',
            dataIndex: 'totalCapacity',
            width:120,
            align:"center",
            customRender:function (t,r,index) {
              if(isNotNullOrEmpty(r.qty) && isNotNullOrEmpty(r.singleCapacity)){
                return r.qty * r.singleCapacity;
              }else{
                return 0;
              }
            }
          },
          {
            title: '已处理数量',
            dataIndex: 'purcQty',
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
            title: '计量单位',
            dataIndex: 'unitId_dictText',
            align:"center",
            width:120,
          },
          {
            title: '交货日期',
            dataIndex: 'leadTime',
            align:"center",
            width:120,
            scopedSlots: { customRender: 'leadTime' },
          },
        ],
        columns5:[
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
            title: '购置物料名称',
            dataIndex: 'prodName',
            align:"center",
            width:120,
          },
          {
            title: '意向规格型号',
            dataIndex: 'speType',
            width:140,
            align:"center",
          },
          {
            title: '意向品牌',
            dataIndex: 'brandName',
            width:140,
            align:"center",
          },
          {
            title: '物料类型',
            dataIndex: 'model_dictText',
            align:"center",
            width:120,
          },
          {
            title: '采购申请数量',
            dataIndex: 'maxQty',
            align:"center",
            width:120,
          },
          {
            title: '模块规划产能',
            dataIndex: 'capacity',
            width:120,
            align:"center",
          },
          {
            title: '单台产能',
            dataIndex: 'singleCapacity',
            width:120,
            align:"center",
          },
          {
            title: '招标数量',
            dataIndex: 'qty',
            width:120,
            align:"center",
            scopedSlots: { customRender: 'qty' },
          },
          {
            title: '合计产能',
            dataIndex: 'totalCapacity',
            width:120,
            align:"center",
            customRender:function (t,r,index) {
              if(isNotNullOrEmpty(r.qty) && isNotNullOrEmpty(r.singleCapacity)){
                return r.qty * r.singleCapacity;
              }else{
                return 0;
              }
            }
          },
          {
            title: '计量单位',
            dataIndex: 'unitId_dictText',
            align:"center",
            width:120,
          },
          {
            title: '交货日期',
            dataIndex: 'leadTime',
            align:"center",
            width:120,
            scopedSlots: { customRender: 'leadTime' },
          },
        ],
        dataSource:[],
				labelCol: {
					xs: {
						span: 24
					},
					sm: {
						span: 5
					},
				},
				wrapperCol: {
					xs: {
						span: 24
					},
					sm: {
						span: 16
					},
				},
				model: {
        },
				// 新增时子表默认添加几行空数据
				validatorRules: {
          biddingName: [
            { required: true,  message: '招标名称不能为空', trigger: 'blur' }
          ],
          biddingType: [
            { required: true,  message: '招标类型不能为空', trigger: 'blur' }
          ],
          biddingCurrency: [
            { required: false,  message: '招标币种不能为空', trigger: 'blur' }
          ],
          openBiddingType: [
            { required: true,  message: '开标方式不能为空', trigger: 'blur' }
          ],
          biddingMethod: [
            { required: true,  message: '评标方式不能为空', trigger: 'blur' }
          ],
          openBiddingAddress: [
            { required: true,  message: '开标地址不能为空', trigger: 'blur' }
          ],
          biddingDeadline: [
            { required: true,  message: '投标截止日期不能为空', trigger: 'blur' }
          ],
          openBiddingDate: [
            { required: true,  message: '开标时间不能为空', trigger: 'blur' }
          ],
          date: [
            { required: true,  message: '评标时间不能为空', trigger: 'blur' }
          ],
          isSort: [
            { required: true,  message: '是否显示供应商排名不能为空', trigger: 'blur' }
          ],
          isNotice: [
            { required: true,  message: '中标公告不能为空', trigger: 'blur' }
          ],
          isQuotes: [
            { required: true,  message: '是否多次报价不能为空', trigger: 'blur' }
          ],
        },
				activeKey: '0',
				url: {
					add: "/srm/biddingMain/add",
					edit: "/srm/biddingMain/edit",
					queryById: "/srm/biddingMain/queryById",
					biddingRecord: {
						list: '/srm/biddingMain/queryBiddingRecordByMainId'
					},
					biddingSupplier: {
						list: '/srm/biddingMain/queryBiddingSupplierByMainId'
					},
					biddingProfessionals: {
						list: '/srm/biddingMain/queryBiddingProfessionalsByMainId'
					},
				}
			}
		},
		props: {
			//表单禁用
			disabled: {
				type: Boolean,
				default: false,
				required: false
			},
      ptype:{
        type: String,
        default: false,
        required: false
      }
		},
		computed: {
			formDisabled() {
				return this.disabled
			},
		},
		created() {},
		methods: {
      changeVal(type){
        if(type == "0"){
          let weight = 0;
          this.templateList.filter(item => {
            weight = Number(weight) + Number(item.itemScore);
          })
          this.weight[this.checkValues.indexOf('0')] = weight;
          this.$forceUpdate();
        }else if(type == "1"){
          let weight = 0;
          this.templateList1.filter(item => {
            weight = Number(weight) + Number(item.itemScore);
          })
          this.weight[this.checkValues.indexOf('1')] = weight;
          this.$forceUpdate();
        }
      },
      setVal(){
        this.$forceUpdate();
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
        that.param.table = "bidding_main";
        that.$refs.cfn.initData(that.param);
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
      },
      delRecord(index,type){
        if(type == '0'){
          this.templateList.splice(index,1);
        }else if(type == '1'){
          this.templateList1.splice(index,1);
        }
        this.changeVal(type);
      },
      addRow(type){
        if(type == '0'){
          let row = {
            itemName:'',
            itemStandard:'',
            itemScore:'',
            professionalId:'',
          }
          this.templateList.push(row);
        }else if(type == '1'){
          let row = {
            itemName:'',
            itemStandard:'',
            itemScore:'',
            professionalId:'',
          }
          this.templateList1.push(row);
        }
      },
      clearData(){
        if(this.checkValues.indexOf("0") == -1){
          this.templateList = [];
        }
        if(this.checkValues.indexOf("1") == -1){
          this.templateList1 = [];
        }
      },
      handleChange(){
        const that = this
        // 触发表单验证
        that.$refs.form.validate(valid => {
          if (valid) {
            let post = "";
            let url = "";
            post = 'post';
            url = this.url.edit;
            let dataSource = that.dataSource;
            if(dataSource == null || dataSource.length == 0){
              that.$message.warning("标的需求不能为空");
              return;
            }
            for(let i = 0; i < dataSource.length; i++){
              if(isNullOrEmpty(dataSource[i].qty) || dataSource[i].qty <= 0){
                that.$message.warning("第" + (i+1) + "行,请填写数量");
                return;
              }
              if(isNullOrEmpty(dataSource[i].leadTime)){
                that.$message.warning("第" + (i+1) + "行,请填写交期");
                return;
              }
            }
            that.model.recordList = dataSource;
            let suppList = that.suppList;
            if(suppList == null || suppList.length == 0){
              that.$message.warning("供应商不能为空");
              return;
            }
            that.model.suppList = suppList;
            let checkValues = that.checkValues;
            if(checkValues == null || checkValues.length == 0){
              that.$message.warning("请选择评标模板");
              return;
            }
            //技术标
            let weightList = [];
            if(checkValues.indexOf('0') > -1){
              let weight = that.weight[checkValues.indexOf('0')];
              if(isNullOrEmpty(weight) || weight <= 0){
                that.$message.warning("请输入技术标评审的权重");
                return;
              }
              // weightList.push(weight);
              if(that.templateList == null || that.templateList.length == 0){
                that.$message.warning("请选择技术标评审的模板");
                return;
              }
              for(let i = 0; i < that.templateList.length; i++){
                if(isNullOrEmpty(that.templateList[i].itemName)){
                  that.$message.warning("第" + (i+1) + "行,技术标评审评分项为空");
                  return;
                }
                if(isNullOrEmpty(that.templateList[i].itemStandard)){
                  that.$message.warning("第" + (i+1) + "行,技术标评审评分标准为空");
                  return;
                }
                if(isNullOrEmpty(that.templateList[i].itemScore) || that.templateList[i].itemScore <= 0){
                  that.$message.warning("第" + (i+1) + "行,技术标评审满分为空");
                  return;
                }
                if(isNullOrEmpty(that.templateList[i].professionalId)){
                  that.$message.warning("第" + (i+1) + "行,技术标评审评分专家为空");
                  return;
                }
                that.templateList[i].weight = weight;
              }
              that.model.templateList = that.templateList;
            }
            //商务标
            if(checkValues.indexOf('1') > -1){
              let weight = that.weight[checkValues.indexOf('1')];
              if(isNullOrEmpty(weight) || weight <= 0){
                that.$message.warning("请输入商务标评审的权重");
                return;
              }
              // weightList.push(weight);
              if(that.templateList1 == null || that.templateList1.length == 0){
                that.$message.warning("请选择商务标评审的模板");
                return;
              }
              for(let i = 0; i < that.templateList1.length; i++){
                if(isNullOrEmpty(that.templateList1[i].itemName)){
                  that.$message.warning("第" + (i+1) + "行,商务标评审评分项为空");
                  return;
                }
                if(isNullOrEmpty(that.templateList1[i].itemStandard)){
                  that.$message.warning("第" + (i+1) + "行,商务标评审评分标准为空");
                  return;
                }
                if(isNullOrEmpty(that.templateList1[i].itemScore) || that.templateList1[i].itemScore <= 0){
                  that.$message.warning("第" + (i+1) + "行,商务标评审满分为空");
                  return;
                }
                if(isNullOrEmpty(that.templateList1[i].professionalId)){
                  that.$message.warning("第" + (i+1) + "行,商务标评审评分专家为空");
                  return;
                }
                that.templateList1[i].weight = weight;
              }
              that.model.templateList1 = that.templateList1;
            }
            let weight = 0;
            for(let i = 0; i < that.weight.length; i++){
              weight = Number(weight) + Number(that.weight[i]);
            }
            if(weight != 100){
              that.$message.warning("权重不等于100");
              return;
            }
            that.model.checkValues = that.checkValues;
            // that.model.weight = weightList;
            that.$confirm({
              content: `是否确认提交`,
              onOk: () => {
                that.confirmLoading = true;
                that.$emit('changeDisable',true);
                httpAction(url,that.model,post).then((res)=> {
                  if (res.success) {
                    that.$message.success(res.message);
                    that.$emit('ok');
                    that.confirmLoading = false;
                    that.$emit('changeDisable',false);
                  } else {
                    that.$message.warning(res.message);
                    that.confirmLoading = false;
                    that.$emit('changeDisable',false);
                  }
                }).finally(e => {
                  that.confirmLoading = false;
                  that.$emit('changeDisable',false);
                })
              }
            })
          }else{
            return false;
          }
        })
      },
      handleOk(){
        const that = this
        // 触发表单验证
        that.$refs.form.validate(valid => {
          if (valid) {
            let post = "";
            let url = "";
            post = 'post';
            url = this.url.add;
            let dataSource = that.selectionRows;

            if(dataSource == null || dataSource.length == 0){
              that.$message.warning("招标信息 - 请选择标的需求");
              return;
            }
            for(let i = 0; i < dataSource.length; i++){
              if(isNullOrEmpty(dataSource[i].qty) || dataSource[i].qty <= 0){
                that.$message.warning("第" + (i+1) + "行,请填写数量");
                return;
              }
              if(isNullOrEmpty(dataSource[i].leadTime)){
                that.$message.warning("第" + (i+1) + "行,请填写交期");
                return;
              }
            }
            that.model.recordList = dataSource;
            let suppList = that.suppList;
            if(suppList == null || suppList.length == 0){
              that.$message.warning("供应商不能为空");
              return;
            }
            that.model.suppList = suppList;
            let checkValues = that.checkValues;
            if(checkValues == null || checkValues.length == 0){
              that.$message.warning("请选择评标模板");
              return;
            }
            if(checkValues.length < 2){
              that.$message.warning("技术、商务评审都需要选择");
              return;
            }
            //技术标
            let weightList = [];
            if(checkValues.indexOf('0') > -1){
              let weight = that.weight[checkValues.indexOf('0')];
              if(isNullOrEmpty(weight) || weight <= 0){
                that.$message.warning("请输入技术标评审的权重");
                return;
              }
              // weightList.push(weight);
              if(that.templateList == null || that.templateList.length == 0){
                that.$message.warning("请选择技术标评审的模板");
                return;
              }
              for(let i = 0; i < that.templateList.length; i++){
                if(isNullOrEmpty(that.templateList[i].itemName)){
                  that.$message.warning("第" + (i+1) + "行,技术标评审评分项为空");
                  return;
                }
                if(isNullOrEmpty(that.templateList[i].itemStandard)){
                  that.$message.warning("第" + (i+1) + "行,技术标评审评分标准为空");
                  return;
                }
                if(isNullOrEmpty(that.templateList[i].itemScore) || that.templateList[i].itemScore <= 0){
                  that.$message.warning("第" + (i+1) + "行,技术标评审满分为空");
                  return;
                }
                if(isNullOrEmpty(that.templateList[i].professionalId)){
                  that.$message.warning("第" + (i+1) + "行,技术标评审评分专家为空");
                  return;
                }
                that.templateList[i].weight = weight;
              }
              that.model.templateList = that.templateList;
            }
            //商务标
            if(checkValues.indexOf('1') > -1){
              let weight = that.weight[checkValues.indexOf('1')];
              if(isNullOrEmpty(weight) || weight <= 0){
                that.$message.warning("请输入商务标评审的权重");
                return;
              }
              // weightList.push(weight);
              if(that.templateList1 == null || that.templateList1.length == 0){
                that.$message.warning("请选择商务标评审的模板");
                return;
              }
              for(let i = 0; i < that.templateList1.length; i++){
                if(isNullOrEmpty(that.templateList1[i].itemName)){
                  that.$message.warning("第" + (i+1) + "行,商务标评审评分项为空");
                  return;
                }
                if(isNullOrEmpty(that.templateList1[i].itemStandard)){
                  that.$message.warning("第" + (i+1) + "行,商务标评审评分标准为空");
                  return;
                }
                if(isNullOrEmpty(that.templateList1[i].itemScore) || that.templateList1[i].itemScore <= 0){
                  that.$message.warning("第" + (i+1) + "行,商务标评审满分为空");
                  return;
                }
                if(isNullOrEmpty(that.templateList1[i].professionalId)){
                  that.$message.warning("第" + (i+1) + "行,商务标评审评分专家为空");
                  return;
                }
                that.templateList1[i].weight = weight;
              }
              that.model.templateList1 = that.templateList1;
            }
            that.model.checkValues = that.checkValues;
            let weight = 0;
            for(let i = 0; i < that.weight.length; i++){
              weight = Number(weight) + Number(that.weight[i]);
            }
            if(weight != 100){
              that.$message.warning("权重不等于100");
              return;
            }
            // that.model.weight = weightList;
            that.$confirm({
              content: `是否确认提交`,
              onOk: () => {
                that.confirmLoading = true;
                that.$emit('changeDisable',true);
                httpAction(url,that.model,post).then((res)=> {
                  if (res.success) {
                    that.$message.success(res.message);
                    that.$emit('ok');
                    that.confirmLoading = false;
                    that.$emit('changeDisable',false);
                  } else {
                    that.$message.warning(res.message);
                    that.confirmLoading = false;
                    that.$emit('changeDisable',false);
                  }
                }).finally(e => {
                  that.confirmLoading = false;
                  that.$emit('changeDisable',false);
                })
              }
            })
          }else{
            that.$message.warning("招标信息 - 请检查必填项");
            return false;
          }
        })
      },
      delChild(code,type,index){
        if(type == '0'){
          let ids = this.templateList[0].professionalId.split(',');
          let names = this.templateList[0].professionalName.split(',');
          ids.splice(index,1);
          names.splice(index,1);

          this.templateList.filter(item => {
            item.professionalId = ids.join(",");
            item.professionalName = names.join(",");
          })
          this.$forceUpdate();
        }else if(type == '1'){
          let ids = this.templateList1[0].professionalId.split(',');
          let names = this.templateList1[0].professionalName.split(',');
          ids.splice(index,1);
          names.splice(index,1);

          this.templateList1.filter(item => {
            item.professionalId = ids.join(",");
            item.professionalName = names.join(",");
          })
          this.$forceUpdate();
        }
      },
      goBack(row,record){
        let professionalId = record.professionalId;
        let professionalName = record.professionalName;
        if(isNullOrEmpty(professionalId)){
          professionalId = row.code;
          professionalName = row.nickName;
        }else{
          if(professionalId.indexOf(row.code) > -1){
            return;
          }
          professionalId = professionalId + "," + row.code;
          professionalName = professionalName + "," + row.nickName;
        }
        record.professionalId = professionalId;
        record.professionalName = professionalName;
        if(this.userCategory == '0'){
          this.templateList.filter(item => {
            item.professionalId = professionalId;
            item.professionalName = professionalName;
          })
        }else if(this.userCategory == '1'){
          this.templateList1.filter(item => {
            item.professionalId = professionalId;
            item.professionalName = professionalName;
          })
        }

        this.$forceUpdate();
      },
      openExpert(record,type){
        let that = this;
        that.userCategory = type;
        that.record = record;
        setTimeout(() => {
          that.$refs.basExpert.showModel();
        }, 300)
      },
      back(record){
        this.fetchItemList(record.id);
      },
      fetchItemList(id){
        let url = "/srm/biddingEvaluateTemplate/queryBiddingEvaluateTemplateItemByMainId";
        getAction(url,{id:id}).then(res => {
            let dataList = res.result;
            if(this.templateType == '0'){
              this.templateList = res.result;
              let weight = 0;
              dataList.filter(item => {
                weight = Number(weight) + Number(item.itemScore);
              })
              this.weight[this.checkValues.indexOf('0')] = weight;
              this.$forceUpdate();
            }else if(this.templateType == '1'){
              this.templateList1 = res.result;
              let weight = 0;
              dataList.filter(item => {
                weight = Number(weight) + Number(item.itemScore);
              })
              this.weight[this.checkValues.indexOf('1')] = weight;
              this.$forceUpdate();
            }
        })
      },
      openTemp(type){
        let that = this;
        that.templateType = type;
        setTimeout(() => {
          that.$refs.basTemplate.showModel();
        }, 300)
      },
      handleSubmit(){
        if(this.checkValues == null || this.checkValues.length == 0){
          this.$message.error('请选择评标类型');
          return;
        }
        this.visible = false;
      },
      close(){
        this.visible = false;
      },
      openTemplate(){
        this.visible = true;
      },
      delRow(index){
        this.suppList.splice(index,1);
      },
      toBack(rows){
        let suppList = this.suppList;
        if(suppList == null){
          suppList = [];
        }
        if(rows == null || rows.length == 0){
          return;
        }
        rows.filter(item => {
          let flag = false;
          for(let i = 0; i < suppList.length; i++){
            if(item.id == suppList[i].id){
              flag = true;
              return;
            }
          }
          if(!flag){
            suppList.push(item);
          }
        })
      },
      selectSupp(){
        this.$refs.suppForm.showModal()
      },
      onBirthdayChange: function (value, dateString) {
        this.model.biddingStartTime = dateString[0] + " 00:00:00";
        this.model.biddingEndTime = dateString[1] + " 23:59:59";
      },
      add() {
        this.edit(this.modelDefault);
      },
      //发起招标
      edit(record) {
        this.activeKey = '0';
        this.dataSource = [];
        this.suppList = [];
        this.templateList = [];
        this.templateList1 = [];
        this.checkValues = ['0','1'];
        this.weight = [];
        this.model = Object.assign({}, record);
        this.model.isSort = '1';
        this.model.isNotice = '0';
        this.model.isQuotes = '0';
        this.model.attachment = '';
        this.model.comment = '';
        this.model.purAttachment = record.attachment;
        this.model.purOtherAttachment = record.otherAttachment;
        this.model.purComment = record.comment;
        this.model.biddingType = '0';
        this.model.openBiddingType = '0';
        if(this.model.id){
          this.getDetailList(this.model.id);
        }
      },
      //招标详情
      editTwo(record){
        this.activeKey = '0';
        this.dataSource = [];
        this.suppList = [];
        this.templateList = [];
        this.templateList1 = [];
        this.checkValues = ['0','1'];
        this.weight = [];
        this.model = Object.assign({}, record);
        if(this.model.id){
          this.getRecordList(this.model.id);
          this.getSuppList(this.model.id);
          this.getTemplateList(this.model.id);
          this.model.date = [];
          this.model.date.push(this.model.biddingStartTime);
          this.model.date.push(this.model.biddingEndTime);

        }
      },
      //查看评标专家
      editThree(record){
        this.activeKey = '1';
        this.dataSource = [];
        this.suppList = [];
        this.templateList = [];
        this.templateList1 = [];
        this.checkValues = ['0','1'];
        this.weight = [];
        this.model = Object.assign({}, record);
        if(this.model.id){
          // this.getRecordList(this.model.id);
          // this.getSuppList(this.model.id);
          this.getTemplateList(this.model.id);
          // this.model.date = [];
          // this.model.date.push(this.model.biddingStartTime);
          // this.model.date.push(this.model.biddingEndTime);

        }
      },
      getTemplateList(id){
        let url = "/srm/biddingMain/queryTemplateList";
        getAction(url,{id:id}).then(res => {
          let data = res.result;
          if(data != null && data.length > 0){
            let weight0 = 0;
            let weight1 = 0;
            data.filter(item => {
              if(item.biddingEvaluateType == '0'){
                this.templateList.push(item);
                if(this.checkValues.indexOf("0") > -1){
                  this.checkValues.push("0");
                  weight0 = item.weight;
                  // this.weight.push(item.weight);
                }
              }else if(item.biddingEvaluateType == '1'){
                this.templateList1.push(item);
                if(this.checkValues.indexOf("1") > -1){
                  this.checkValues.push("1");
                  weight1 = item.weight;
                  // this.weight.push(item.weight);
                }
              }
            })
            this.weight.push(weight0);
            this.weight.push(weight1);
          }
        })
      },
      getSuppList(id){
        let url = "/srm/biddingMain/querySuppList";
        getAction(url,{id:id}).then(res => {
          this.suppList = res.result;
        })
      },
      getRecordList(id){
        let url = "/srm/biddingMain/queryRecordListByMainId";
        getAction(url,{id:id}).then(res => {
          this.dataSource = res.result;
        })
      },
      getDetailList(id){
        let url = "/srm/purchaseRequestMain/queryPurchaseRequestDetail";
        getAction(url,{id:id}).then(res => {
          this.dataSource = res;
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
