<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container >
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-divider orientation="left" style="color: #00A0E9">
            合同附件
          </a-divider>
          <a-col :span="24">
            <a-button type="primary" style="float:right;z-index: 999;margin-top: -30px;" size="small"
                      @click="changeFileName(model.id,model.wordAttachment,'word_attachment','wordAttachment')" v-if="model.wordAttachment != null && model.wordAttachment != ''">修改文件名</a-button>
            <a-form-item label="合同附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1" required>
              <j-upload v-model="model.wordAttachment" :trigger-change="true" disabled></j-upload>
            </a-form-item>
          </a-col>
          <a-divider orientation="left" style="color: #00A0E9">
            基本信息
          </a-divider>
          <a-col :span="8" >
            <a-form-model-item label="合同标题" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractName">
              <a-input v-model="model.contractName" placeholder="请输入合同标题" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="创建日期" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="createTime">
              <a-input v-model="model.createTime" placeholder="请输入创建日期" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="费用分类" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <j-dict-select-tag  v-model="model.categoryId" placeholder="请选择费用分类" dictCode="project_category,name,id" disabled/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="合同等级" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractLevel">
              <a-input v-model="model.contractLevel" placeholder="请输入合同等级" :disabled="formDisabled" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="合同币种" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractCurrency">
              <j-dict-select-tag style="width:100%;" v-model="model.contractCurrency" placeholder="币种"
                                 dictCode="currency_type" :disabled="true"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="合同份数" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractCopiesNumber">
              <a-input-number v-model="model.contractCopiesNumber" placeholder="请输入合同份数" style="width: 100%" disabled/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="合同金额(原币)" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractAmountTax">
              <a-input-number v-model="model.contractAmountTax" placeholder="请输入合同金额" style="width: 100%" :disabled="formDisabled"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="合同金额(本币)" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractAmountTaxLocal">
              <a-input-number v-model="model.contractAmountTaxLocal" placeholder="请输入合同金额" style="width: 100%" :disabled="formDisabled"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="合同税率" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractTaxRate">
              <j-dict-select-tag style="width:100%;" v-model="model.contractTaxRate" placeholder="合同税率"
                                 dictCode="tax_rate" disabled/>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="合同模板" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <j-select-contract-template v-model="model.templateId" @change="back" :multi="false" disabled></j-select-contract-template>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="是否Demo设备" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="isDemo">
              <j-dict-select-tag style="width:100%;" v-model="model.isDemo" placeholder="是否Demo设备"
                                 dictCode="yn" disabled @change="setValue"/>
            </a-form-model-item>
          </a-col>

          <a-col :span="8" v-if="model.contractValidDate != null && model.contractValidDate != '' && model.contractValidDate != undefined">
            <a-form-model-item label="合同生效时间" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input v-model="model.contractValidDate" placeholder="请输入合同生效时间" disabled></a-input>
            </a-form-model-item>
          </a-col>

          <a-divider orientation="left" style="color: #00A0E9">
            合同标的
          </a-divider>
          <a-col :span="8">项目编号:<span>{{model.projCode}}</span></a-col>
          <a-col :span="8">项目名称:<span>{{model.projName}}</span></a-col>

<!--          @expand="open"-->
<!--          :expandedRowKeys="expandedRowKeys"-->

          <a-table
            v-if="model.reqType == '0'"
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :rowSelection="{selectedRowKeys: selectedRowKeys1, onChange: onSelectChange1,type: 'checkbox' }"
            :scroll="{x:true,y:500}"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="false"
            >
            <template slot="prodCode" slot-scope="text,record">
              <a @click="openChild(record)">{{text}}</a>
            </template>

            <template slot="qty" slot-scope="text,record">
              <a-input-number v-model="record.qty" style="width: 100%" @change="countAmountLocal"></a-input-number>
            </template>

            <template slot="speType" slot-scope="text,record">
              <a-input v-model="record.speType" style="width: 100%"></a-input>
            </template>

            <template slot="priceTax" slot-scope="text,record">
              <a-input-number v-model="record.priceTax" style="width: 100%" @change="countAmountLocal"></a-input-number>
            </template>

            <template slot="no" slot-scope="text,record">
<!--              <a-input v-model="record.no" style="width: 100%" readonly placeholder="请选择对应的序号"></a-input>-->
              {{text}}
            </template>

            <template slot="action" slot-scope="text,record">
              <a @click="stQty(record)">选择序号</a>
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
            :columns="columns1"
            :dataSource="dataSource"
            :pagination="false">
          </a-table>

          <a-divider orientation="left" style="color: #00A0E9">
            合同条款
          </a-divider>
          <a-button @click="addcolumns2" type="primary" icon="plus" style='float: right;z-index: 999' disabled>新增</a-button>
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            class="j-table-force-nowrap"
            :scroll="{x:true}"
            :columns="columns2"
            :dataSource="dataSource2"
            :pagination="false">

          </a-table>

          <a-divider orientation="left" style="color: #00A0E9">
            支付方式
          </a-divider>
          <a-button @click="addcolumns3" type="primary" icon="plus" style='float: right;z-index: 999' disabled>新增</a-button>
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            class="j-table-force-nowrap"
            :scroll="{x:true}"
            :columns="columns3"
            :dataSource="dataSource3"
            :pagination="false">

            <template slot='payMethod' slot-scope='text,record'>
              <j-dict-select-tag style="width:100%;" v-model="record.payMethod" placeholder="支付方式" dictCode="payMethod" disabled />
            </template>

            <template slot='payType' slot-scope='text,record'>
              <j-dict-select-tag placeholder="请输入付款类型" v-model="record.payType" dictCode="payType" disabled/>
            </template>


          </a-table>

          <a-divider orientation="left" style="color: #00A0E9">
            甲方信息
          </a-divider>
          <a-col :span="8" >
            <a-form-model-item label="甲方" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractFirstParty">
<!--              <a-input v-model="model.contractFirstParty" placeholder="请输入甲方" ></a-input>-->
              <j-dict-select-tag v-model="model.contractFirstParty" placeholder="请输入甲方" dictCode="sys_depart,depart_name,id,parent_id = '-1'"
                                 disabled/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="甲方地址" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" >
              <a-input v-model="model.contractFirstAddress" placeholder="请输入甲方地址" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="甲方电话" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" >
              <a-input v-model="model.contractFirstTelphone" placeholder="请输入甲方电话" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="甲方传真" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" >
              <a-input v-model="model.contractFirstFax" placeholder="请输入甲方传真" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="甲方联系人" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input v-model="model.contractFirstContact" placeholder="请输入甲方联系人" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="甲方法人" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" >
              <a-input v-model="model.contractFirstLegalPerson" placeholder="请输入甲方法人" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="甲方代理人" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractFirstAgent">
              <a-input v-model="model.contractFirstAgent" placeholder="请输入甲方代理人" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="甲方开户行" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractFirstOpeningBank">
              <a-input v-model="model.contractFirstOpeningBank" placeholder="请输入甲方开户行" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="甲方银行账号" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractFirstBankAccount">
              <a-input v-model="model.contractFirstBankAccount" placeholder="请输入甲方银行账号" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="甲方邮政编码" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractFirstPostCode">
              <a-input v-model="model.contractFirstPostCode" placeholder="请输入甲方邮政编码" disabled></a-input>
            </a-form-model-item>
          </a-col>

          <a-divider orientation="left" style="color: #00A0E9">
            乙方信息
          </a-divider>
          <a-col :span="8" >
            <a-form-model-item label="乙方" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractSecondParty">
              <a-input v-model="model.contractSecondParty" placeholder="请输入乙方" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="乙方地址" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractSecondAddress">
              <a-input v-model="model.contractSecondAddress" placeholder="请输入乙方地址" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="乙方电话" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractSecondTelphone">
              <a-input v-model="model.contractSecondTelphone" placeholder="请输入乙方电话" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="乙方传真" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractSecondFax">
              <a-input v-model="model.contractSecondFax" placeholder="请输入乙方传真" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="乙方联系人" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractSecondContact">
              <a-input v-model="model.contractSecondContact" placeholder="请输入乙方联系人" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="乙方法人" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractSecondLegalPerson">
              <a-input v-model="model.contractSecondLegalPerson" placeholder="请输入乙方法人" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="乙方代理人" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractSecondAgent">
              <a-input v-model="model.contractSecondAgent" placeholder="请输入乙方代理人" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="乙方开户行" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractSecondOpeningBank">
              <a-input v-model="model.contractSecondOpeningBank" placeholder="请输入乙方开户行" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="乙方银行账号" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractSecondBankAccount">
              <a-input v-model="model.contractSecondBankAccount" placeholder="请输入乙方银行账号" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="乙方邮政编码" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractSecondPostCode">
              <a-input v-model="model.contractSecondPostCode" placeholder="请输入乙方邮政编码" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-divider orientation="left" style="color: #00A0E9">
            其他附件
          </a-divider>
          <a-col :span="24">
            <a-button type="primary" style="float:right;z-index: 999;margin-top: -30px;" size="small"
                      @click="changeFileName(model.id,model.otherAttachment,'other_attachment','otherAttachment')" v-if="model.otherAttachment != null && model.otherAttachment != ''">修改文件名</a-button>
            <a-form-item label="其他附件资料" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
              <j-upload v-model="model.otherAttachment" :trigger-change="true" disabled></j-upload>
            </a-form-item>
          </a-col>
          <a-divider orientation="left" style="color: #00A0E9">
            备注
          </a-divider>
          <a-col :span="12" >
            <a-form-model-item label="备注" :labelCol="spans.labelCol2" :wrapperCol="spans.wrapperCol2" prop="comment">
              <a-input v-model="model.comment" placeholder="请输入备注" type="textarea" disabled></a-input>
            </a-form-model-item>
          </a-col>

        </a-row>
      </a-form-model>
    </j-form-container>

    <a-drawer
      :title="title"
      width=40%
      placement="right"
      :closable="false"
      :headerStyle="{ textAlign: 'center'}"
      @close="close"
      destroyOnClose
      :visible="visible">
      <a-table
        ref="table1"
        :scroll="{x:true,y:500}"
        :columns="columns5"
        :dataSource="childList"
        :pagination="ipagination"
        @change="handleTableChange">
      </a-table>
      <div style="text-align: left;">
        <a-button key="cancel" @click="close"  type="primary" ghost>取消</a-button>
      </div>
    </a-drawer>

    <a-modal
      title=""
      width=25%
      :closable="false"
      @cancel="close1"
      @ok="toSubmit"
      :visible="visible1">
      <a-form-model ref="ruleForm" :model="ruleForm" >
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="合同编码" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" required>
              <a-input v-model="ruleForm.contractNumber" placeholder="请输入合同编码"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="OA合同类型" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" required>
              <j-dict-select-tag  v-model="ruleForm.oaType" placeholder="请选择OA合同类型" dictCode="oa_type"/>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>

    <a-drawer
      title=""
      width=40%
      :closable="false"
      @close="close2"
      :visible="visible2">
      <a-table
        ref="table3"
        :scroll="{x:true,y:500}"
        :columns="columns5"
        :dataSource="childList"
        :pagination="ipagination"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type: 'checkbox' }"
        @change="handleTableChange">
      </a-table>
      <div style="text-align: left;margin-top: 10px">
        <a-button key="cancel" @click="close2"  type="primary" ghost >取消</a-button>
        <a-button  @click="doSubmit"  type="primary" style="margin-left: 10px">提交</a-button>
      </div>
    </a-drawer>

    <change-file-name ref="cfn" @back="toSetUrl"></change-file-name>
  </a-spin>
</template>

<script>
import ChangeFileName from '@comp/jeecgbiz/ChangeFileName'
import { getAction, httpAction } from '@/api/manage'
import JFormContainer from '@/components/jeecg/JFormContainer'
import { billModalMixin } from '../../mixins/billModalMixin'
import { preciseNum, isNullOrEmpty, isNotNullOrEmpty, triggerWindowResizeEvent } from '@/utils/util'
import JSelectContractTemplate from '@comp/jeecgbiz/JSelectContractTemplate'

import {
  iegAmount
} from '@/utils/util'
export default {
    name: 'ContractBaseChildForm',
    mixins: [billModalMixin],
    components: {
      JFormContainer,
      JSelectContractTemplate,
      ChangeFileName
    },
    data() {
      return {
        selectionRows1: [],
        selectedRowKeys1: [],
        selectionRows: [],
        selectedRowKeys: [],
        ipagination:{
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        visible2:false,
        param:{},
        ruleForm:{},
        visible1:false,
        columns5:[
          {
            title: '序号',
            dataIndex: 'sort',
            align:"center",
            width:100,
          },
          {
            title: '数量',
            dataIndex: 'qty',
            align:"center",
            width:120,
          },
          {
            title: '交期',
            align:"center",
            dataIndex: 'planDeliveryDate',
            width:120,
          },
        ],
        title:'明细',
        visible:false,
        childList:[],
        expandedRowKeys:[],
        dataSource3:[],
        columns3:[
          {
            title: '条款名称',
            dataIndex: 'termsName',
            width:140,
            align:"center",
            scopedSlots: {
              customRender: 'termsName'
            },
          },
          {
            title: '条款内容',
            dataIndex: 'termsContent',
            width:180,
            align:"center",
            scopedSlots: {
              customRender: 'termsContent'
            },
          },
          {
            title: '支付方式',
            dataIndex: 'payMethod',
            width:120,
            align:"center",
            scopedSlots: {
              customRender: 'payMethod'
            },
          },
          {
            title: '支付比例(%)',
            dataIndex: 'payRate',
            width:120,
            align:"center",
            scopedSlots: {
              customRender: 'payRate'
            },
          },
          {
            title: '付款类型',
            dataIndex: 'payType',
            width:120,
            align:"center",
            scopedSlots: {
              customRender: 'payType'
            },
          },
        ],
        dataSource2:[],
        columns2:[
          {
            title: '条款名称',
            dataIndex: 'termsName',
            width:140,
            align:"center",
            scopedSlots: {
              customRender: 'termsName'
            },
          },
          {
            title: '条款序号',
            dataIndex: 'number',
            width:120,
            align:"center",
            scopedSlots: {
              customRender: 'number'
            },
          },
          {
            title: '合同条款',
            dataIndex: 'termsContent',
            width:180,
            align:"center",
            scopedSlots: {
              customRender: 'termsContent'
            },
          },
          {
            title: '备注',
            dataIndex: 'comment',
            width:180,
            align:"center",
            scopedSlots: {
              customRender: 'comment'
            },
          },
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
            align:"center",
            width:140,
          },
          {
            title: '合同数量',
            dataIndex: 'qty',
            width:120,
            customRender:function (t,r,index) {
              // return iegAmount(t,'total')
              const obj = {
                children: t,
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          },
          {
            title: '单价',
            dataIndex: 'priceTax',
            width:120,
            customRender: (t,r,index) => {
              let _this = this;
              let icon = "";
              if(_this.model.contractCurrency == 'RMB'){
                icon = '¥';
              }else if(_this.model.contractCurrency == 'JPY'){
                icon = '￥';
              }else if(_this.model.contractCurrency == 'USD'){
                icon = '$';
              }else if(_this.model.contractCurrency == 'EUR'){
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
          },
          {
            title: '小计',
            dataIndex: 'amountTax',
            width:120,
            customRender: (t,r,index) => {
              let _this = this;
              let icon = "";
              if(_this.model.contractCurrency == 'RMB'){
                icon = '¥';
              }else if(_this.model.contractCurrency == 'JPY'){
                icon = '￥';
              }else if(_this.model.contractCurrency == 'USD'){
                icon = '$';
              }else if(_this.model.contractCurrency == 'EUR'){
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
          },
          // {
          //   title: '交货日期',
          //   dataIndex: 'leadTime',
          //   width:120,
          // },
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
            title: '设备编号',
            dataIndex: 'prodCode',
            width:120,
            align:"center",
            scopedSlots: { customRender: 'prodCode' }
          },
          {
            title: '物料名称',
            align:"center",
            dataIndex: 'prodName',
            width:120,
          },
          {
            title: '规格、型号参数',
            dataIndex: 'speType',
            align:"center",
            width:180,
            scopedSlots: {customRender: 'speType'},
          },
          {
            title: '品牌',
            dataIndex: 'prodBrand',
            align:"center",
            width:180,
          },
          {
            title: '产地',
            dataIndex: 'country',
            align:"center",
            width:120,
          },
          {
            title: '设备产能',
            dataIndex: 'capacity',
            align:"center",
            width:120,
          },
          {
            title: '合同数量',
            dataIndex: 'qty',
            align:"center",
            width:120,
            scopedSlots: {customRender: 'qty'},
          },
          {
            title: '设备序号',
            dataIndex: 'no',
            align:"center",
            width:160,
            scopedSlots: {customRender: 'no'},
          },
          {
            title: '单位',
            dataIndex: 'unitId_dictText',
            align:"center",
            width:120,
          },
          {
            title: '设备单价',
            dataIndex: 'priceTax',
            align:"center",
            width:120,
            scopedSlots: {customRender: 'priceTax'},
          },
          {
            title: '小计',
            dataIndex: 'amountTax',
            width:120,
            customRender: (t,r,index) => {
              let _this = this;
              let icon = "";
              if(_this.model.contractCurrency == 'RMB'){
                icon = '¥';
              }else if(_this.model.contractCurrency == 'JPY'){
                icon = '￥';
              }else if(_this.model.contractCurrency == 'USD'){
                icon = '$';
              }else if(_this.model.contractCurrency == 'EUR'){
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
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:120,
            scopedSlots: {customRender: 'action'},
          },
          // {
          //   title: '交货日期',
          //   dataIndex: 'leadTime',
          //   width:120,
          // },
        ],
        dataSource:[],
        confirmLoading:false,
        model:{
         },
        // 新增时子表默认添加几行空数据
        addDefaultRowNum: 1,
        validatorRules: {
          contractAmountTax: [
            { required: true, message: '合同金额(原币)金额!'},
          ],
          contractAmountTaxLocal: [
            { required: true, message: '合同金额(本币)金额!'},
          ],
          contractName: [
              { required: true, message: '请输入合同标题!'},
           ],
          contractType: [
              { required: true, message: '请选择合同类型!'},
           ],
          contractCurrency: [
              { required: true, message: '请选择合同币种!'},
           ],
          contractCopiesNumber: [
            { required: true, message: '请输入合同份数!'},
          ],
          contractTaxRate: [
            { required: true, message: '请选择合同税率!'},
          ],
          contractFirstParty:[
            { required: true, message: '请输入甲方!'},
          ],
          contractFirstAddress:[
            { required: true, message: '请输入甲方地址!'},
          ],
          contractFirstTelphone:[
            { required: true, message: '请输入甲方电话!'},
          ],
          contractFirstFax:[
            { required: true, message: '请输入甲方传真!'},
          ],
          contractFirstContact:[
            { required: true, message: '请输入甲方联系人!'},
          ],
          contractFirstLegalPerson:[
            { required: true, message: '请输入甲方法人!'},
          ],
        },
        refKeys: [],
        url: {
          add: "/srm/contractBase/add",
          draft: "/srm/contractBase/draft",
          edit: "/srm/contractBase/edit",
        },
        nowRow:{},
      }
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      },
      action:{
        type: String,
        default: '',
        required: false
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
    },
    methods: {
      onSelectChange1(selectedRowKeys, selectionRows) {
        this.selectedRowKeys1 = selectedRowKeys;
        this.selectionRows1 = selectionRows;
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
      },
      handleTableChange(pagination, filters, sorter) {
        this.ipagination = pagination;
        this.loadChildQty(this.nowRow);
      },
      doSubmit(){
        let selectionRows = this.selectionRows;
        if(selectionRows == null || selectionRows.length == 0){
          this.$message.error("请选择序号");
          return;
        }
        let noList = [];
        let ids = [];
        for(let i = 0; i < selectionRows.length; i++){
          noList.push(selectionRows[i].sort);
          ids.push(selectionRows[i].id);
        }
        this.nowRow.no = noList.join(",");
        this.nowRow.ids = ids.join(",");
        this.close2();
      },
      close2(){
        this.visible2 = false;
      },
      stQty(record){
        this.selectedRowKeys = [];
        this.selectionRows = [];
        this.nowRow = record;
        this.loadChildQty(record);
        setTimeout(() => {
          this.visible2 = true;
        }, 300)

      },
      setValue(){
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
        that.param.table = "contract_base";
        that.$refs.cfn.initData(that.param);
      },
      toSubmit(){
        let that = this;
        let post = "";
        let url = "";
        post = 'post';
        url = this.url.edit;
        let contractNumber = that.ruleForm.contractNumber;
        if(isNullOrEmpty(contractNumber)){
          that.$message.warn("请指定正式合同编码");
          return;
        }
        let oaType = that.ruleForm.oaType;
        if(isNullOrEmpty(oaType)){
          that.$message.warn("请选择OA对应合同类型");
          return;
        }

        let row = JSON.parse(JSON.stringify(that.model));
        row.contractStatus = '8';
        row.contractNumber = that.ruleForm.contractNumber;
        row.oaType = that.ruleForm.oaType;
        that.$confirm({
          content: `是否确认提交`,
          onOk: () => {
            httpAction(url,row,post).then((res)=> {
              if (res.success) {
                that.$message.success(res.message);
                that.visible1 = false;
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            })
          }
        })
      },
      close1(){
        this.visible1 = false;
      },
      back(ids,rows){
        if(isNotNullOrEmpty(rows[0].attachment)){
          this.model.wordAttachment = rows[0].attachment;
        }
      },
      close(){
        this.visible = false;
      },
      loadChildQty(row){
        this.childList = [];
        let url = '/srm/contractObjectQty/fetchList'
        let param = {
          recordId: row.id,
          suppId:this.model.contractSecondPartyId
        }
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        getAction(url, param).then(res => {
          this.childList = res.result.records||res.result;
          if(res.result.total)
          {
            this.ipagination.total = res.result.total;
          }else{
            this.ipagination.total = 0;
          }
        })
      },
      openChild(row){
        this.nowRow = row;
        this.loadChildQty(row);
        setTimeout(() => {
          this.visible = true;
        }, 300)
      },
      open(expanded, row) {
        this.childList = [];
        if (expanded) {
          let url = '/srm/contractObjectQty/fetchList'
          let param = {
            recordId: row.id,
            suppId:this.model.contractSecondPartyId
          }
          getAction(url, param).then(res => {
            this.childList = res.result
          })
          this.expandedRowKeys = []
          this.expandedRowKeys.push(row.id)
        } else {
          this.expandedRowKeys = []
        }
      },
      delRow3(record,index){
        this.dataSource3.splice(index,1);
      },
      delRow2(record,index){
        this.dataSource2.splice(index,1);
      },
      addcolumns3(){
        let row = {
          termsName:'',
          payMethod:'',
          termsContent:'',
          payRate:0,
          payType:''
        }
        this.dataSource3.push(row);
      },
      addcolumns2(){
        let row = {
          termsName:'',
          number:'',
          termsContent:'',
          comment:'',
        }
        this.dataSource2.push(row);
      },
      handleOA(){
        const that = this
        // 触发表单验证
        that.$refs.form.validate(valid => {
          if (valid) {
            let post = "";
            let url = "";
            post = 'post';
            url = this.url.edit;
            let row = JSON.parse(JSON.stringify(that.model));
            row.contractStatus = '8';
            // that.$confirm({
            //   content: `是否确认提交`,
            //   onOk: () => {
                // httpAction(url,row,post).then((res)=> {
                //   if (res.success) {
                //     that.$message.success(res.message);
                //     that.$emit('ok');
                //   } else {
                //     that.$message.warning(res.message);
                //   }
                // })
              that.visible1 = true;
              // }
            // })
          }else{
            return false;
          }
        })
      },
      handleDraft(){
        const that = this
        // 触发表单验证
        let post = "";
        let url = "";
        post = 'post';
        url = this.url.draft;
        let dataSource = that.dataSource;
        if(dataSource == null || dataSource.length == 0){
          that.$message.warning("合同标的不能为空");
          return;
        }
        that.model.contractObjectList = dataSource;
        that.model.contractPayStepList = that.dataSource3;
        that.model.contractTermsList = that.dataSource2;
        that.$confirm({
          content: `是否确认提交`,
          onOk: () => {
            httpAction(url,that.model,post).then((res)=> {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            })
          }
        })
      },
      handleReject(){
        let that = this;
        let post = "";
        let url = "";
        post = 'post';
        url = "/srm/contractBase/reject";
        let row = JSON.parse(JSON.stringify(that.model));
        row.contractStatus = '1';
        that.$confirm({
          content: `是否确认提交`,
          onOk: () => {
            httpAction(url,row,post).then((res)=> {
              if (res.success) {
                that.$message.success("提交成功");
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            })
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
            url = "/srm/contractBase/addChild";
            let dataSource = that.selectionRows1;
            if(dataSource == null || dataSource.length == 0){
              that.$message.warning("请选择合同标的");
              return;
            }
            for(let i = 0; i < dataSource.length; i++){
              let maxQty = dataSource[i].maxQty;
              let qty = dataSource[i].qty;
              if(Number(qty) > Number(maxQty)){
                that.$message.warning("第" + (i+1) + "行,子合同数量不能大于主合同数量");
                return;
              }

              let priceTax = dataSource[i].priceTax;
              let maxPriceTax = dataSource[i].maxPriceTax;
              if(Number(priceTax) > Number(maxPriceTax)){
                that.$message.warning("第" + (i+1) + "行,子合同单价不能大于主合同单价");
                return;
              }

              let no = dataSource[i].no;
              if(isNullOrEmpty(no)){
                that.$message.warning("第" + (i+1) + "行,请输入序号");
                return;
              }
              let noList = no.split(",");
              if(noList.length != qty){
                that.$message.warning("第" + (i+1) + "行,序号与数量不一致");
                return;
              }
            }
            that.model.contractObjectList = dataSource;
            that.$confirm({
              content: `是否确认提交`,
              onOk: () => {
                httpAction(url,that.model,post).then((res)=> {
                  if (res.success) {
                    that.$message.success(res.message);
                    that.$emit('ok');
                  } else {
                    that.$message.warning(res.message);
                  }
                })
              }
            })
          }else{
            return false;
          }
        })
      },
      edit(record,type) {
        this.selectedRowKeys1 = [];
        this.selectionRows1 = [];
        this.dataSource = [];
        this.model = Object.assign({}, record);
        this.model.comment = '';
        this.model.createTime = '';
        this.model.createTime = this.formatDate(new Date(),'yyyy-MM-dd');
        if(isNullOrEmpty(this.model.isDemo)){
          this.model.isDemo = '0';
        }
        //获取汇率
        let param = {
          projectId:record.projectId,
          currency:record.biddingCurrency || record.currency,
        }
        this.getExchangeRate(param);
        //招投标
        if(type == '1'){
          this.model.source = '1';
          this.model.contractCurrency = record.biddingCurrency;
          this.model.requestId = this.model.id;
          this.model.contractType = this.model.reqType;
          this.model.contractTaxRate = this.model.taxRate;

          this.getBiddingDetailList(this.model.bsId);
          this.getBiddingSuppInfo(this.model.bsId);

        }
        //询报价
        else if(type == '0'){
          this.model.source = '0';
          this.model.contractCurrency = record.currency;
          this.model.requestId = this.model.inquiryId;
          this.model.contractType = this.model.reqType;
          this.model.contractTaxRate = this.model.taxRate;

          this.getInquiryDetailList(this.model.bsId);
          this.getInquirySuppInfo(this.model.bsId);
          this.model.projName = this.model.projectName;
        }
        setTimeout(()=>{
          this.countAmountLocal();
        },800)
        this.model.id = null;
      },
      editTwo(record) {
        this.dataSource = [];
        this.model = Object.assign({}, record);
        this.model.approver = this.$store.getters.userInfo.realname;
        this.model.approveComment = "";
        this.model.contractExchangeRate = record.contractExchangeRate;
        this.getContractDetailList(this.model.id);
        this.getPayList(this.model.id);
        this.getTerms(this.model.id);
      },
      getExchangeRate(param){
        let url = "/srm/contractBase/getExchangeRate";
        getAction(url,param).then(res => {
          this.model.exchangeRate = res.result;
        })
      },
      getTerms(contractId){
        let url = "/srm/contractBase/queryContractTermsByMainId";
        getAction(url,{id:contractId}).then(res => {
          if(res.result != null && res.result.length > 0){
            this.dataSource2 = res.result;
          }
        })
      },

      getPayList(contractId){
        let url = "/srm/contractBase/queryContractPayStepByMainId";
        getAction(url,{id:contractId}).then(res => {
          if(res.result != null && res.result.length > 0){
            this.dataSource3 = res.result;
          }
        })
      },
      getApprove(contractId,type){
        let url = "/srm/contractBase/queryApprove";
        getAction(url,{id:contractId,type:type}).then(res => {
          if(res.result != null){
            if(type == 'contract_supp'){
              this.model.suppApproveComment = res.result.approveComment;
              this.model.suppApprover = res.result.approver;
            }else{
              this.model.approveComment = res.result.approveComment;
              this.model.approver = res.result.approver;
            }
            this.$forceUpdate();
          }
        })
      },
      getContractDetailList(id){
        let url = "/srm/contractBase/getContractDetailList";
        getAction(url,{id:id}).then(res => {
          this.dataSource = res.result;
        })
      },
      getBiddingSuppInfo(id){
        let url = "/srm/biddingMain/getSuppInfo";
        getAction(url,{id:id}).then(res => {
          let data = res.result;
          this.model.contractSecondPartyId = data.id;
          this.model.contractSecondParty = data.name;
          this.model.contractSecondAddress = data.address;
          this.model.contractSecondTelphone = data.telephone;
          this.model.contractSecondFax = data.fax;
          this.model.contractSecondContact = data.contacter;
          this.model.contractSecondLegalPerson = data.corporate;

          this.model.contractSecondAgent = '';
          this.model.contractSecondOpeningBank = data.bankBranch;
          this.model.contractSecondBankAccount = data.bankAccount;
          this.model.contractSecondPostCode = '';
          this.$forceUpdate();
        })
      },
      countAmountLocal(){
        let amountTax = 0;
        let amountTaxLocal = 0;
        let exchangeRate = this.model.exchangeRate;
        if(this.dataSource != null && this.dataSource.length > 0){
          this.dataSource.filter(item => {
            //原币金额
            amountTax = Number(amountTax) + Number(preciseNum(Number(item.priceTax) * Number(item.qty),2));
            item.amountTax = Number(preciseNum(Number(item.priceTax) * Number(item.qty),2));
            //本币金额
            let priceTaxLocal = Number(item.priceTax) / Number(exchangeRate);
            priceTaxLocal = Number(item.priceTax) * Number(item.addTax) * Number(item.customsTax) + Number(item.otherAmount);
            let amount = Number(preciseNum(priceTaxLocal,4)) * item.qty;
            amountTaxLocal = Number(amountTaxLocal) + Number(amount);
          })
        }
        this.model.contractAmountTax = Number(preciseNum(amountTax,2));
        this.model.contractAmountTaxLocal = amountTaxLocal;
        this.$forceUpdate();
      },
      getBiddingDetailList(id){
        let url = "/srm/biddingMain/queryRecordList";
        getAction(url,{id:id}).then(res => {
          this.dataSource = res.result;
        })
      },
      getInquirySuppInfo(id){
        let url = "/srm/inquiryList/getSuppInfo";
        getAction(url,{id:id}).then(res => {
          let data = res.result;
          this.model.contractSecondPartyId = data.id;
          this.model.contractSecondParty = data.name;
          this.model.contractSecondAddress = data.address;
          this.model.contractSecondTelphone = data.telephone;
          this.model.contractSecondFax = data.fax;
          this.model.contractSecondContact = data.contacter;
          this.model.contractSecondLegalPerson = data.corporate;

          this.model.contractSecondAgent = '';
          this.model.contractSecondOpeningBank = data.bankBranch;
          this.model.contractSecondBankAccount = data.bankAccount;
          this.model.contractSecondPostCode = '';
          this.$forceUpdate();
        })
      },
      getInquiryDetailList(id){
        let url = "/srm/inquiryList/getRecordById";
        getAction(url,{id:id}).then(res => {
          this.dataSource = res.result;
          let amount = 0;
          let amountTax = 0;
          if(this.dataSource != null && this.dataSource.length > 0){
            this.dataSource.filter(item => {
              amount = Number(amount) + Number(item.amount);
              amountTax = Number(amountTax) + Number(item.amountTax);
            })
            amount = preciseNum(amount,2);
            amountTax = preciseNum(amountTax,2);
          }
          this.model.contractAmountTax = amountTax;
          this.model.contractAmount = amount;
          this.model.contractCurrency = this.dataSource[0].contractCurrency;
        })
      },
      formatDate(){
        let getDate = new Date();
        let year = getDate.getFullYear();
        let month = getDate.getMonth() + 1;
        let day = getDate.getDate();
        if(month < 10){
          month =  "0" + month;
        }
        return year + "-" + month + "-" + day;
      }
    }
  }
</script>

<style scoped>
</style>

<style>
	.pass-img{
		position: absolute;
		right: 0;
		top: -60px;
		z-index: 99;
		width: 100px;
		opacity: 0.8;
	}
	.nopass-div2{
		position: absolute;
		z-index: 99;
		right: 10px;
		top: -10px;
		width: 200px;
		max-height: 100px;
		border: 1px red solid;
		padding: 10px;
		background: #fff;
		/* border-radius: 50%; */
		text-align: left;
		padding-top: 5px;
	}
	.nopass-div2 .title{
		font-size: 15px;
		font-weight: bold;
		color: red;
		padding-top: 0px;
		padding-bottom: 0px;
	}
	.nopass-div2 .content{
		font-size: 13px;
		color: red;
		display: -webkit-box;
		 -webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
rfq-content {
  min-height: 50px;
  display: flex;
}
.rfq-content table {
  width: 100%;
  margin-left: 5px;
  margin-right: 5px;
  border: 1px #ccc solid;
}
.rfq-content table thead th {
  text-align: center;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  transition: background 0.3s ease;
}
.rfq-content table tbody tr td {
  font-size: 12px;
  border-right: 1px #ccc solid;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom: 1px #ccc solid;
}
</style>