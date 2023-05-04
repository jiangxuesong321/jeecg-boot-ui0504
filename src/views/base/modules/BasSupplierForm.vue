<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="8" >
            <a-form-model-item label="供应商名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  prop="name">
              <a-input v-model="model.name" placeholder="请输入供应商名称" :maxLength="50"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="供应商简称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  prop="shortName">
              <a-input v-model="model.shortName" placeholder="请输入供应商简称" :maxLength="50"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="网站地址" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  prop="website">
              <a-input v-model="model.website" placeholder="请输入网站地址" :maxLength="200"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="法人" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  >
              <a-input v-model="model.corporate" placeholder="请输入法人" style="width:100%"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="法人联系方式" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" >
              <a-input v-model="model.corporatePhone" placeholder="请输入法人联系方式" style="width:100%"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="注册资本(万元)" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  prop="registerCapital">
              <a-input-number v-model="model.registerCapital" placeholder="请输入注册资本(万元)" style="width:100%"></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="注册资本币种" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" >
              <j-dict-select-tag type="select" v-model="model.registerCurrency" dictCode="register_currency" placeholder="请输入注册资本币种"></j-dict-select-tag>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="注册地址" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  prop="registerArea">
              <a-input v-model="model.registerArea" placeholder="请输入注册地址" :maxLength="100"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="经营地址" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  prop="bizArea">
              <a-input v-model="model.bizArea" placeholder="请输入经营地址" :maxLength="100"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="开票地址" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  prop="invoiceAddress">
              <a-input v-model="model.invoiceAddress" placeholder="请输入开票地址" :maxLength="100"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="开户银行" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  prop="bankName">
              <a-input v-model="model.bankName" placeholder="请输入开户银行" :maxLength="100"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="银行开户行" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  prop="bankBranch">
              <a-input v-model="model.bankBranch" placeholder="请输入银行开户行" :maxLength="100"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="银行账号" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  prop="bankAccount">
              <a-input v-model="model.bankAccount" placeholder="请输入银行账号" :maxLength="100"></a-input>
            </a-form-model-item>
          </a-col>
<!--          <a-col :span="8" >-->
<!--            <a-form-model-item label="法人代表" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  prop="corporate">-->
<!--              <a-input v-model="model.corporate" placeholder="请输入法人代表" :maxLength="50"></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="8" >-->
<!--            <a-form-model-item label="法人电话" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  prop="corporatePhone">-->
<!--              <a-input v-model="model.corporatePhone" placeholder="请输入法人电话" :maxLength="11"></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
          <a-col :span="8" >
            <a-form-model-item label="供应商电话" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  prop="telephone">
              <a-input v-model="model.telephone" placeholder="请输入供应商电话" :maxLength="20"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="供应商传真" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  prop="fax">
              <a-input v-model="model.fax" placeholder="请输入供应商传真" :maxLength="20"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="供应商邮箱" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  prop="email">
              <a-input v-model="model.email" placeholder="请输入供应商邮箱" :maxLength="30"></a-input>
            </a-form-model-item>
          </a-col>
<!--          <a-col :span="8" >-->
<!--            <a-form-model-item label="供应商有效期" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  prop="endTime">-->
<!--              <a-date-picker v-model="model.endTime" placeholder="请输入供应商有效期" style="width: 100%" @change="handleDateChange"/>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->

          <a-col :span="8" >
            <a-form-model-item label="供应商区域" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <j-dict-select-tag type="select" v-model="model.supplierProp" dictCode="supp_prop" placeholder="请选择供应商区域" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="服务范围" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <j-multi-select-tag type="select" v-model="model.supplierType" dictCode="supp_type" placeholder="请选择服务范围" />
            </a-form-model-item>
          </a-col>

          <a-col :span="8" >
            <a-form-model-item label="是否收费" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  prop="isCharge">
              <j-dict-select-tag type="select" v-model="model.isCharge" dictCode="yn" placeholder="请选择是否收费" />
            </a-form-model-item>
          </a-col>

          <a-col :span="8" >
            <a-form-model-item label="供应商等级" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <j-dict-select-tag type="select" v-model="model.supplierGrade" dictCode="supp_grade" placeholder="请选择供应商等级" />
            </a-form-model-item>
          </a-col>

          <a-col :span="8" v-if="model.startTime != null && model.startTime != '' && model.startTime != undefined">
            <a-form-model-item label="有效期(开始时间)" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  >
              <a-date-picker v-model="model.startTime" placeholder="供应商有效开始时间" style="width: 100%" disabled/>
            </a-form-model-item>
          </a-col>

          <a-col :span="8" v-if="model.endTime != null && model.endTime != '' && model.endTime != undefined">
            <a-form-model-item label="有效期(结束时间)" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  >
              <a-date-picker v-model="model.endTime" placeholder="供应商有效开始时间" style="width: 100%" disabled/>
            </a-form-model-item>
          </a-col>

          <a-col :span="8" v-if="model.fnStartTime != null && model.fnStartTime != '' && model.fnStartTime != undefined">
            <a-form-model-item label="冻结开始时间" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  >
              <a-date-picker v-model="model.fnStartTime" placeholder="冻结开始时间" style="width: 100%" disabled/>
            </a-form-model-item>
          </a-col>

          <a-col :span="8" v-if="model.fnEndTime != null && model.fnEndTime != '' && model.fnEndTime != undefined">
            <a-form-model-item label="冻结结束时间" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  >
              <a-date-picker v-model="model.fnEndTime" placeholder="冻结结束时间" style="width: 100%" disabled/>
            </a-form-model-item>
          </a-col>

        </a-row>
        <a-row>
          <a-col :span="8" >
            <a-form-model-item label="备注" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  prop="remark">
              <a-input v-model="model.remark" placeholder="请输入备注" type="textarea" :maxLength="200"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8" >
            <a-form-model-item label="logo" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  prop="logoUrl">
              <j-image-upload isMultiple  v-model="model.logoUrl" :isMultiple="false"></j-image-upload>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="营业执照" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"  prop="supplierAttachment">
              <j-image-upload isMultiple  v-model="model.supplierAttachment" ></j-image-upload>
            </a-form-model-item>
          </a-col>

        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey">
      <a-tab-pane tab="联系人信息" key="0">
        <a-button style="margin-bottom: 10px" type="primary" @click="addRow('contact')" :disabled="formDisabled">新增</a-button>
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :scroll="{x:true,y:300}"
          :columns="basSupplierContactTable.columns"
          :dataSource="basSupplierContactTable.dataSource"
        >

          <template slot-scope="text,record,index" slot="contacter">
            <a-input v-model="record.contacter" placeholder="联系人" :disabled="formDisabled" :maxLength="20"></a-input>
          </template>

          <template slot-scope="text,record,index" slot="contacterEmail">
            <a-input v-model="record.contacterEmail" placeholder="联系人邮箱" :disabled="formDisabled" :maxLength="30"></a-input>
          </template>

          <template slot-scope="text,record,index" slot="contacterTel">
            <a-input v-model="record.contacterTel" placeholder="联系人电话" :disabled="formDisabled" :maxLength="11"></a-input>
          </template>

          <template slot-scope="text,record,index" slot="contacterPosition">
            <a-input v-model="record.contacterPosition" placeholder="联系人职位" :disabled="formDisabled" :maxLength="20"></a-input>
          </template>

          <template slot-scope="text,record,index" slot="contacterDepartment">
            <a-input v-model="record.contacterDepartment" placeholder="联系人部门" :disabled="formDisabled" :maxLength="20"></a-input>
          </template>

          <template slot-scope="text,record,index" slot="contacterAddress">
            <a-input v-model="record.contacterAddress" placeholder="联系人地址" :disabled="formDisabled" :maxLength="100"></a-input>
          </template>

          <template slot-scope="text,record,index" slot="isDefault">
<!--            <a-input v-model="record.isDefault" placeholder="是否默认"></a-input>-->
            <j-dict-select-tag type="select" v-model="record.isDefault" dictCode="yn" placeholder="是否默认" style="width: 100%" :disabled="formDisabled"/>
          </template>

          <template slot-scope="text,record,index" slot="remark">
            <a-input v-model="record.remark" placeholder="备注" type="textarea" :disabled="formDisabled" :maxLength="200" :rows="1"></a-input>
          </template>

          <template slot-scope="text,record,index" slot="action">
            <a @click="delRow('contact',index)" :disabled="formDisabled">删除</a>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane tab="资质证书" key="1">
        <a-button style="margin-bottom: 10px" type="primary" @click="addRow('qualification')" :disabled="formDisabled">新增</a-button>
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :scroll="{x:400,y:300}"
          :columns="basSupplierQualificationTable.columns"
          :dataSource="basSupplierQualificationTable.dataSource"
        >

          <template slot-scope="text,record,index" slot="qualificationName">
            <a-input v-model="record.qualificationName" placeholder="资质证书名称" :disabled="formDisabled" :maxLength="20"></a-input>
          </template>

          <template slot-scope="text,record,index" slot="qualUrl">
            <j-upload v-model="record.qualUrl" :trigger-change="true" disabled style="width: 200px"></j-upload>
          </template>

          <template slot-scope="text,record,index" slot="valideDateBegin">
<!--            <a-input v-model="record.valideDateBegin" placeholder="有效开始日期"></a-input>-->
            <a-date-picker v-model="record.valideDateBegin" placeholder="有效开始日期" style="width: 100%" :disabled="formDisabled"/>
          </template>

          <template slot-scope="text,record,index" slot="valideDateEnd">
<!--            <a-input v-model="record.valideDateEnd" placeholder="有效结束日期"></a-input>-->
            <a-date-picker v-model="record.valideDateEnd" placeholder="有效结束日期" style="width: 100%" :disabled="formDisabled"/>
          </template>

          <template slot-scope="text,record,index" slot="remark">
            <a-input v-model="record.remark" placeholder="备注" type="textarea" :disabled="formDisabled" :maxLength="200" :rows="1"></a-input>
          </template>

          <template slot-scope="text,record,index" slot="action">
            <a @click="delRow('qualification',index)" :disabled="formDisabled">删除</a>
            <a @click="uploadFile(record, index, 'qualification')" :disabled="formDisabled" style='margin-left: 10px'>上传文件</a>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane tab="银行账号" key="2">
        <a-button style="margin-bottom: 10px" type="primary" @click="addRow('bank')" :disabled="formDisabled">新增</a-button>
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :scroll="{x:true,y:300}"
          :columns="basSupplierBankTable.columns"
          :dataSource="basSupplierBankTable.dataSource"
        >
          <template slot-scope="text,record,index" slot="bankAccountName">
            <a-input v-model="record.bankAccountName" placeholder="账户名称" :disabled="formDisabled" :maxLength="20"></a-input>
          </template>

          <template slot-scope="text,record,index" slot="bankAccountNum">
            <a-input v-model="record.bankAccountNum" placeholder="银行账号" :disabled="formDisabled" :maxLength="30"></a-input>
          </template>

          <template slot-scope="text,record,index" slot="bankBranch">
            <a-input v-model="record.bankBranch" placeholder="开户行" :disabled="formDisabled" :maxLength="20"></a-input>
          </template>

          <template slot-scope="text,record,index" slot="bankName">
            <a-input v-model="record.bankName" placeholder="所属银行" :disabled="formDisabled" :maxLength="20"></a-input>
          </template>

          <template slot-scope="text,record,index" slot="currency">
            <j-dict-select-tag style="width:100%;" v-model="record.currency" placeholder="币种"
                               dictCode="currency_type" :disabled="formDisabled" :getPopupContainer="getParentContainer"/>
          </template>

          <template slot-scope="text,record,index" slot="swiftCode">
            <a-input v-model="record.swiftCode" placeholder="swiftCode" :disabled="formDisabled" :maxLength="20"></a-input>
          </template>

          <template slot-scope="text,record,index" slot="type">
<!--            <a-input v-model="record.type" placeholder="账户性质" :disabled="formDisabled" ></a-input>-->
            <j-dict-select-tag style="width:100%;" v-model="record.type" placeholder="账户性质"
                               dictCode="account_type" :disabled="formDisabled" :getPopupContainer="getParentContainer"/>
          </template>
S
          <template slot-scope="text,record,index" slot="isDefault">
            <!--            <a-input v-model="record.isDefault" placeholder="是否默认"></a-input>-->
            <j-dict-select-tag type="select" v-model="record.isDefault" dictCode="yn" placeholder="是否默认" style="width: 100%" :disabled="formDisabled" :getPopupContainer="getParentContainer"/>
          </template>

          <template slot-scope="text,record,index" slot="remark">
            <a-input v-model="record.remark" placeholder="备注" type="textarea" :disabled="formDisabled" :maxLength="200" :rows="1"></a-input>
          </template>

          <template slot-scope="text,record,index" slot="action">
            <a @click="delRow('bank',index)" :disabled="formDisabled">删除</a>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane tab="寄件信息" key="3">
        <a-button style="margin-bottom: 10px" type="primary" @click="addRow('fast')" :disabled="formDisabled">新增</a-button>
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          class="j-table-force-nowrap"
          :scroll="{x:true,y:300}"
          :columns="basSupplierFastTable.columns"
          :dataSource="basSupplierFastTable.dataSource"
        >
          <template slot-scope="text,record,index" slot="sender">
            <a-input v-model="record.sender" placeholder="寄件人" :disabled="formDisabled" :maxLength="20"></a-input>
          </template>

          <template slot-scope="text,record,index" slot="senderTel">
            <a-input v-model="record.senderTel" placeholder="寄件人联系方式" :disabled="formDisabled" :maxLength="30"></a-input>
          </template>

          <template slot-scope="text,record,index" slot="areaList">
            <a-cascader v-model="record.areaList" :options="options" placeholder="寄件地区" :getPopupContainer='getParentContainer' style='width: 100%' :disabled="formDisabled"/>
          </template>

          <template slot-scope="text,record,index" slot="address">
            <a-input v-model="record.address" placeholder="寄件地址" :disabled="formDisabled" type='cascader'></a-input>
          </template>

          <template slot-scope="text,record,index" slot="type">
            <j-dict-select-tag type="select" v-model="record.type" dictCode="mail_type" placeholder="寄件地址"
                               :getPopupContainer='getPopupContainer'
                               style="width: 100%" :disabled="formDisabled"/>
          </template>

          <template slot-scope="text,record,index" slot="remark">
            <a-input v-model="record.remark" placeholder="备注" :disabled="formDisabled" :rows="1" type="textarea"></a-input>
          </template>

          <template slot-scope="text,record,index" slot="action">
            <a @click="delRow('fast',index)" :disabled="formDisabled">删除</a>
          </template>
        </a-table>
      </a-tab-pane>

      <a-tab-pane tab="现场审查" key="4">
        <a-button style="margin-bottom: 10px" type="primary" @click="addRow('resume')" :disabled="formDisabled">新增</a-button>
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :scroll="{x:true}"
          :columns="basSupplierResumeTable.columns"
          :dataSource="basSupplierResumeTable.dataSource"
        >
          <template slot-scope="text,record,index" slot="filePath">
            <j-upload v-model="record.filePath" :trigger-change="true" disabled style="width: 200px"></j-upload>
          </template>
          <template slot-scope="text,record,index" slot="remark">
            <a-input v-model="record.remark" placeholder="请输入备注" type="textarea" :disabled="formDisabled"></a-input>
          </template>
          <template slot-scope="text,record,index" slot="action">
            <a @click="delRow('resume',index)" :disabled="formDisabled">删除</a>
            <a @click="uploadFile(record, index, 'resume')" :disabled="formDisabled" style='margin-left: 10px'>上传文件</a>
          </template>
        </a-table>
      </a-tab-pane>

    </a-tabs>

    <j-modal
      title="附件管理"
      width="30%"
      :visible="visible"
      :maskClosable="false"
      switchFullscreen
      :fullscreen="false"
      @cancel="handleClose">
      <template slot="footer">
        <a-button key="cancel" @click="handleClose" type="primary" >取消</a-button>
        <a-button key="submit" @click="handleSubmit" type="primary" v-if="!disabled">提交</a-button>
      </template>
      <j-upload v-model="attachment" :trigger-change="true" :disabled="disabled"></j-upload>
    </j-modal>
  </a-spin>
</template>

<script>

import { JVxeTableModelMixin } from '@/mixins/JVxeTableModelMixin.js'
import JFormContainer from '@/components/jeecg/JFormContainer'
import { httpAction, getAction, deleteAction } from '@/api/manage'
import { isNotNullOrEmpty, isNullOrEmpty,validateMobile,validateEmail } from '@/utils/util'
import { billModalMixin } from '../../mixins/billModalMixin'
import {isMobile,isPhone} from '@/utils/validate'
import { AreaOptions } from '@/mixins/AreaOptions.js'

export default {
    name: 'BasSupplierForm',
    mixins: [
      JVxeTableModelMixin,
      billModalMixin,
      AreaOptions,
    ],
    components: {
      JFormContainer,
    },
    data() {
      return {
        basSupplierFastTable:{
          loading: false,
          dataSource: [],
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
              title: '寄件类型',
              dataIndex: 'type',
              width:120,
              scopedSlots: { customRender: 'type' },
            },
            {
              title: '寄件人',
              dataIndex: 'sender',
              width:200,
              scopedSlots: { customRender: 'sender' },
            },
            {
              title: '寄件人联系方式',
              dataIndex: 'senderTel',
              width:200,
              scopedSlots: { customRender: 'senderTel' },
            },
            {
              title: '寄件地区',
              dataIndex: 'areaList',
              width:200,
              scopedSlots: { customRender: 'areaList' },
            },
            {
              title: '寄件地址',
              dataIndex: 'address',
              width:200,
              scopedSlots: { customRender: 'address' },
            },
            {
              title: '备注',
              dataIndex: 'remark',
              width:200,
              scopedSlots: { customRender: 'remark' },
            },
            {
              title: '操作',
              dataIndex: 'action',
              align:"center",
              width:80,
              scopedSlots: { customRender: 'action' },
            }
          ]
        },
        attachment:'',
        index: -1,
        attachmentType: '',
        visible:false,
        activeKey:'0',
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        model:{
         },
        // 新增时子表默认添加几行空数据
        addDefaultRowNum: 1,
        validatorRules: {
          name: [
            { required: true, message: '请输入供应商名称!'},
          ],
          endTime: [
            { required: true, message: '请输入供应商有效期!'},
          ],
          supplierProp: [
            { required: true, message: '请选择供应商区域!'},
          ],
          supplierType: [
            { required: true, message: '请选择供应商性质!'},
          ],
          supplierGrade: [
            { required: true, message: '请选择供应商等级!'},
          ],
          isCharge: [{
            required: true, message: '请选择是否收费!'
          }],
        },
        basSupplierContactTable: {
          loading: false,
          dataSource: [],
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
              title: '联系人',
              dataIndex: 'contacter',
              width:200,
              scopedSlots: { customRender: 'contacter' },
            },
            {
              title: '联系人邮箱',
              dataIndex: 'contacterEmail',
              width:200,
              scopedSlots: { customRender: 'contacterEmail' },
            },
            {
              title: '联系人电话',
              dataIndex: 'contacterTel',
              width:200,
              scopedSlots: { customRender: 'contacterTel' },
            },
            {
              title: '联系人职位',
              dataIndex: 'contacterPosition',
              width:200,
              scopedSlots: { customRender: 'contacterPosition' },
            },
            {
              title: '联系人部门',
              dataIndex: 'contacterDepartment',
              width:200,
              scopedSlots: { customRender: 'contacterDepartment' },
            },
            {
              title: '联系人地址',
              dataIndex: 'contacterAddress',
              width:200,
              scopedSlots: { customRender: 'contacterAddress' },
            },
            {
              title: '是否默认',
              dataIndex: 'isDefault',
              width:200,
              scopedSlots: { customRender: 'isDefault' },
            },
            {
              title: '备注',
              dataIndex: 'remark',
              width:200,
              scopedSlots: { customRender: 'remark' },
            },
            {
              title: '操作',
              dataIndex: 'action',
              align:"center",
              width:80,
              scopedSlots: { customRender: 'action' },
            }
          ]
        },
        basSupplierQualificationTable: {
          loading: false,
          dataSource: [],
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
              title: '资质证书名称',
              dataIndex: 'qualificationName',
              width:200,
              defaultValue:'',
              scopedSlots: { customRender: 'qualificationName' },
            },
            {
              title: '有效开始日期',
              dataIndex: 'valideDateBegin',
              width:200,
              scopedSlots: { customRender: 'valideDateBegin' },
            },
            {
              title: '有效结束日期',
              dataIndex: 'valideDateEnd',
              width:200,
              scopedSlots: { customRender: 'valideDateEnd' },
            },
            {
              title: '资质证书',
              dataIndex: 'qualUrl',
              width:200,
              defaultValue:'',
              scopedSlots: { customRender: 'qualUrl' },
            },
            {
              title: '备注',
              dataIndex: 'remark',
              width:200,
              scopedSlots: { customRender: 'remark' },
            },
            {
              title: '操作',
              dataIndex: 'action',
              align:"center",
              width:80,
              scopedSlots: { customRender: 'action' },
            }
          ]
        },
        basSupplierBankTable: {
          loading: false,
          dataSource: [],
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
              title: '账户名称',
              dataIndex: 'bankAccountName',
              width:200,
              scopedSlots: { customRender: 'bankAccountName' },
            },
            {
              title: '银行账号',
              dataIndex: 'bankAccountNum',
              width:200,
              scopedSlots: { customRender: 'bankAccountNum' },
            },
            {
              title: '开户行',
              dataIndex: 'bankBranch',
              width:200,
              scopedSlots: { customRender: 'bankBranch' },
            },
            {
              title: '所属银行',
              dataIndex: 'bankName',
              width:200,
              scopedSlots: { customRender: 'bankName' },
            },
            {
              title: '币种',
              dataIndex: 'currency',
              width:200,
              scopedSlots: { customRender: 'currency' },
            },
            {
              title: 'SWIFT CODE',
              dataIndex: 'swiftCode',
              width:200,
              scopedSlots: { customRender: 'swiftCode' },
            },
            {
              title: '账户性质',
              dataIndex: 'type',
              width:200,
              scopedSlots: { customRender: 'type' },
            },
            {
              title: '是否默认',
              dataIndex: 'isDefault',
              width:200,
              scopedSlots: { customRender: 'isDefault' },
            },
            {
              title: '备注',
              dataIndex: 'remark',
              width:200,
              scopedSlots: { customRender: 'remark' },
            },
            {
              title: '操作',
              dataIndex: 'action',
              align:"center",
              width:80,
              scopedSlots: { customRender: 'action' },
            }
          ]
        },
        basSupplierResumeTable: {
          loading: false,
          dataSource: [],
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
              title: '附件',
              dataIndex: 'filePath',
              width:200,
              scopedSlots: { customRender: 'filePath' },
            },
            {
              title: '备注',
              dataIndex: 'remark',
              width:400,
              scopedSlots: { customRender: 'remark' },
            },
            {
              title: '操作',
              dataIndex: 'action',
              align:"center",
              width:80,
              scopedSlots: { customRender: 'action' },
            }
          ]
        },

        url: {
          add: "/srm/basSupplier/add",
          edit: "/srm/basSupplier/edit",
          queryById: "/srm/basSupplier/queryById",
          basSupplierContact: {
            list: '/srm/basSupplier/queryBasSupplierContactByMainId'
          },
          basSupplierQualification: {
            list: '/srm/basSupplier/queryBasSupplierQualificationByMainId'
          },
          basSupplierBank: {
            list: '/srm/basSupplier/queryBasSupplierBankByMainId'
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

      getPopupContainer(node) {
        let element = (() => {
          // nodeType 8	: Comment	: 注释
          if (this.$el && this.$el.nodeType !== 8) {
            return this.$el
          }
          let doc = document.getElementById(this.caseId + 'inputTable')
          if (doc != null) {
            return doc
          }
          return node.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
        })()

        // 递归判断是否带有 overflow: hidden；的父元素
        const ifParent = (child) => {
          let currentOverflow = null
          if (child['currentStyle']) {
            currentOverflow = child['currentStyle']['overflow']
          } else if (window.getComputedStyle) {
            currentOverflow = window.getComputedStyle(child)['overflow']
          }
          if (currentOverflow != null) {
            if (currentOverflow === 'hidden') {
              // 找到了带有 hidden 的标签，判断它的父级是否还有 hidden，直到遇到完全没有 hidden 或 body 的时候才停止递归
              let temp = ifParent(child.parentNode)
              return temp != null ? temp : child.parentNode
            }
            // 当前标签没有 hidden ，如果有父级并且父级不是 body 的话就继续递归判断父级
            else if (child.parentNode && child.parentNode.tagName.toLocaleLowerCase() !== 'body') {
              return ifParent(child.parentNode)
            } else {
              // 直到 body 都没有遇到有 hidden 的标签
              return null
            }
          } else {
            return child
          }
        }

        let temp = ifParent(element)
        return temp != null ? temp : element
      },
      handleSubmit(){
        if (this.attachmentType === 'resume') {
          this.basSupplierResumeTable.dataSource[this.index].filePath = this.attachment;
        } else {
          this.basSupplierQualificationTable.dataSource[this.index].qualUrl = this.attachment;
        }
        this.handleClose();
      },
      uploadFile(record,index, type){
        this.visible = true;
        this.index = index;
        this.attachmentType = type;
        if (type === 'resume') {
          this.attachment = this.basSupplierResumeTable.dataSource[this.index].filePath;
        } else {
          this.attachment = this.basSupplierQualificationTable.dataSource[this.index].qualUrl;
        }
      },
      handleClose(){
        this.visible = false;
      },
      getParentContainer(node) {
        let element = (() => {
          // nodeType 8	: Comment	: 注释
          if (this.$el && this.$el.nodeType !== 8) {
            return this.$el
          }
          let doc = document.getElementById(this.caseId + 'inputTable')
          if (doc != null) {
            return doc
          }
          return node.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
        })()

        // 递归判断是否带有 overflow: hidden；的父元素
        const ifParent = (child) => {
          let currentOverflow = null
          if (child['currentStyle']) {
            currentOverflow = child['currentStyle']['overflow']
          } else if (window.getComputedStyle) {
            currentOverflow = window.getComputedStyle(child)['overflow']
          }
          if (currentOverflow != null) {
            if (currentOverflow === 'hidden') {
              // 找到了带有 hidden 的标签，判断它的父级是否还有 hidden，直到遇到完全没有 hidden 或 body 的时候才停止递归
              let temp = ifParent(child.parentNode)
              return temp != null ? temp : child.parentNode
            }
            // 当前标签没有 hidden ，如果有父级并且父级不是 body 的话就继续递归判断父级
            else if (child.parentNode && child.parentNode.tagName.toLocaleLowerCase() !== 'body') {
              return ifParent(child.parentNode)
            } else {
              // 直到 body 都没有遇到有 hidden 的标签
              return null
            }
          } else {
            return child
          }
        }

        let temp = ifParent(element)
        return temp != null ? temp : element
      },
      handleReject(){
        let that = this;
        that.$confirm({
          content: `是否确认提交`,
          onOk: () => {
            let url = "/srm/basSupplier/editEntity";
            that.model.status = '2';
            httpAction(url,that.model,'put').then((res)=> {
              if (res.success) {
                that.$message.success("提交成功");
                that.$emit('ok');
              } else {
                that.$message.warning("提交失败");
              }
            })
          }
        })
      },
      handlePass(){
        let that = this;
        that.$confirm({
          content: `是否确认提交`,
          onOk: () => {
            let url = "/srm/basSupplier/editEntity";
            that.model.status = '1';
            httpAction(url,that.model,'put').then((res)=> {
              if (res.success) {
                that.$message.success("提交成功");
                that.$emit('ok');
              } else {
                that.$message.warning("提交失败");
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
            if(that.model.id){
              post = 'put';
              url = this.url.edit;
            }else{
              post = 'post';
              url = this.url.add;
            }

            // let corporatePhone = that.model.corporatePhone;
            // if(isNotNullOrEmpty(corporatePhone) && !validateMobile(corporatePhone)){
            //   that.$message.warning('法人电话格式不正确');
            //   return;
            // }

            // let telephone = that.model.telephone;
            // if(isNotNullOrEmpty(telephone) && !(isMobile(telephone) || isPhone(telephone))){
            //   that.$message.warning('供应商电话格式不正确');
            //   return;
            // }

            let contact = that.basSupplierContactTable.dataSource;
            if(contact != null && contact.length > 0){
              let isDefault = [];
              for(let i = 0; i < contact.length; i++){
                let contacter = contact[i].contacter;
                if(isNullOrEmpty(contacter)){
                  that.$message.warning('第' + (i + 1) + '行,联系人为空');
                  return;
                }

                let contacterEmail = contact[i].contacterEmail;
                if(isNullOrEmpty(contacterEmail)){
                  that.$message.warning('第' + (i + 1) + '行,联系人邮箱为空');
                  return;
                }
                if(!validateEmail(contacterEmail)){
                  that.$message.warning('第' + (i + 1) + '行,联系人邮箱格式不正确');
                  return;
                }

                let contacterTel = contact[i].contacterTel;
                if(isNullOrEmpty(contacterTel)){
                  that.$message.warning('第' + (i + 1) + '行,联系人电话为空');
                  return;
                }
                if(!validateMobile(contacterTel)){
                  that.$message.warning('第' + (i + 1) + '行,联系人电话格式不正确');
                  return;
                }

                if(contact[i].isDefault == '1'){
                  isDefault.push(contact[i].isDefault);
                }
              }
              if(isDefault != null && isDefault.length > 1){
                that.$message.warning('只允许存在一个默认联系人信息');
                return;
              }
            }
            that.model.basSupplierContactList = contact;

            let qualification = that.basSupplierQualificationTable.dataSource;
            if(qualification != null && qualification.length > 0){
              for(let i = 0; i < qualification.length; i++){
                let qualificationName = qualification[i].qualificationName;
                if(isNullOrEmpty(qualificationName)){
                  that.$message.warning('第' + (i + 1) + '行,资质证书名称为空');
                  return;
                }

                // let qualUrl = qualification[i].qualUrl;
                // if(isNullOrEmpty(qualUrl)){
                //   that.$message.warning('第' + (i + 1) + '行,资质证书为空');
                //   return;
                // }

                let valideDateBegin = qualification[i].valideDateBegin;
                if(isNullOrEmpty(valideDateBegin)){
                  that.$message.warning('第' + (i + 1) + '行,有效开始日期为空');
                  return;
                }

                let valideDateEnd = qualification[i].valideDateEnd;
                if(isNullOrEmpty(valideDateEnd)){
                  that.$message.warning('第' + (i + 1) + '行,有效结束日期为空');
                  return;
                }
              }
            }
            that.model.basSupplierQualificationList = qualification;

            let bank = that.basSupplierBankTable.dataSource;
            if(bank != null && bank.length > 0){
              let isDefault = [];


              for(let i = 0; i < bank.length; i++){

                let index = 0;

                let bankAccountName = bank[i].bankAccountName;
                if(isNullOrEmpty(bankAccountName)){
                  that.$message.warning('第' + (i + 1) + '行,账户名称为空');
                  return;
                }

                let bankAccountNum = bank[i].bankAccountNum;
                if(isNullOrEmpty(bankAccountNum)){
                  that.$message.warning('第' + (i + 1) + '行,账户账号为空');
                  return;
                }

                let bankBranch = bank[i].bankBranch;
                if(isNullOrEmpty(bankBranch)){
                  that.$message.warning('第' + (i + 1) + '行,开户行为空');
                  return;
                }

                let bankName = bank[i].bankName;
                if(isNullOrEmpty(bankName)){
                  that.$message.warning('第' + (i + 1) + '行,所属银行为空');
                  return;
                }

                let currency = bank[i].currency;
                if(isNullOrEmpty(currency)){
                  that.$message.warning('第' + (i + 1) + '行,币种为空');
                  return;
                }

                let swiftCode = bank[i].swiftCode;
                if(isNullOrEmpty(swiftCode) && "RMB" != currency){
                  that.$message.warning('第' + (i + 1) + '行,外币SWIFT CODE不能为空');
                  return;
                }

                let type = bank[i].type;
                if(isNullOrEmpty(type)){
                  that.$message.warning('第' + (i + 1) + '行,账户性质不能为空');
                  return;
                }

                if(bank[i].isDefault == '1'){
                  let key = currency + ";" + bank[i].isDefault + ";" + type;
                  if(isDefault.indexOf(key) == -1){
                    isDefault.push(key);
                  }else{
                    that.$message.warning('同一币种只允许存在一个默认银行信息');
                    return;
                  }
                }

                bank.filter(item => {
                  if(bankAccountNum == item.bankAccountNum && currency == item.currency && type == item.type){
                    index = index + 1;
                  }
                })

                if(index > 1){
                  that.$message.warning('同账号同币种同账户性质存在重复数据');
                  return;
                }
              }
            }
            that.model.basSupplierBankList = bank;

            let fast = that.basSupplierFastTable.dataSource;

            // if(fast == null || fast.length == 0 || fast.length < 2){
            //   that.$message.warning('请填写合同、询证函 寄件地址');
            //   return;
            // }

            //判断是否有重复类型
            let contract = 0;
            let xzh = 0;
            this.$log(fast)
            if(fast != null && fast.length > 0){
              for(let i = 0; i < fast.length; i++){

                if(isNullOrEmpty(fast[i].type)){
                  that.$message.warning('第' + (i + 1) + '行,寄件类型为空');
                  return;
                }
                if(fast[i].type == '0'){
                  contract = contract + 1;
                }
                if(fast[i].type == '1'){
                  xzh = xzh + 1;
                }

                if(isNullOrEmpty(fast[i].sender)){
                  that.$message.warning('第' + (i + 1) + '行,寄件人为空');
                  return;
                }
                if(isNullOrEmpty(fast[i].senderTel)){
                  that.$message.warning('第' + (i + 1) + '行,寄件人联系方式为空');
                  return;
                }
                if(fast[i].areaList == null || fast[i].areaList.length == 0){
                  that.$message.warning('第' + (i + 1) + '行,寄件地区为空');
                  return;
                }
                fast[i].area = fast[i].areaList.join(",");
                if(isNullOrEmpty(fast[i].address)){
                  that.$message.warning('第' + (i + 1) + '行,寄件地址为空');
                  return;
                }

                if(fast[i].type == '2' && isNullOrEmpty(fast[i].remark)){
                  that.$message.warning('第' + (i + 1) + '行,寄件类型为其他,则备注必填');
                  return;
                }
              }

              if(contract != 1){
                that.$message.warning('缺少 合同 寄件地址或寄件类型重复');
                return;
              }
              if(xzh != 1){
                that.$message.warning('缺少 询证函 寄件地址或寄件类型重复');
                return;
              }
            }

            that.model.basSupplierFastList = fast;

            const resume = this.basSupplierResumeTable.dataSource;
            that.model.basSupplierResumeList = resume;
            
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
      handleDateChange(mom, dateStr) {
        this.model.endTime = dateStr
      },
      delRow(type,index){
        let that = this;
        that.$confirm({
          title: "确认删除",
          content: "是否删除选中数据?",
          onOk: function () {
            if(type == 'contact'){
              that.basSupplierContactTable.dataSource.splice(index,1);
            }else if(type == 'qualification'){
              that.basSupplierQualificationTable.dataSource.splice(index,1);
            }else if(type == 'bank'){
              that.basSupplierBankTable.dataSource.splice(index,1);
            }else if(type == 'fast'){
              that.basSupplierFastTable.dataSource.splice(index,1);
            }else if(type == 'resume'){
              that.basSupplierResumeTable.dataSource.splice(index,1);
            }
          }
        });

      },
      addRow(type){
        let that = this;
        that.$confirm({
          title: "确认添加",
          content: "是否确认添加?",
          onOk: function () {
            if(type == 'contact'){
              if(that.basSupplierContactTable.dataSource == null){
                that.basSupplierContactTable.dataSource = [];
              }
              let row = {
                contacter : '',
                contacterEmail : '',
                contacterTel : '',
                contacterPosition : '',
                contacterDepartment : '',
                contacterAddress : '',
                isDefault : '0',
                remark : '',
              }
              that.basSupplierContactTable.dataSource.push(row);
            }else if(type == 'qualification'){
              if(that.basSupplierQualificationTable.dataSource == null){
                that.basSupplierQualificationTable.dataSource = [];
              }
              let row = {
                qualificationName : '',
                valideDateBegin : '',
                valideDateEnd : '',
                qualUrl : '',
                remark : '',
              }
              that.basSupplierQualificationTable.dataSource.push(row);
            }else if(type == 'bank'){
              if(that.basSupplierBankTable.dataSource == null){
                that.basSupplierBankTable.dataSource = [];
              }
              let row = {
                bankAccountName : '',
                bankAccountNum : '',
                bankBranch : '',
                bankName : '',
                currency : '',
                swiftCode : '',
                isDefault : '0',
                remark : '',
              }
              that.basSupplierBankTable.dataSource.push(row);
            }else if(type == 'fast'){
              if(that.basSupplierFastTable.dataSource == null){
                that.basSupplierBankTable.dataSource = [];
              }
              let row = {
                areaList:[],
                area:'',
                sender:'',
                senderTel:'',
                address:''
              }
              that.basSupplierFastTable.dataSource.push(row);
            }else if(type == 'resume'){
              if(that.basSupplierResumeTable.dataSource == null){
                that.basSupplierResumeTable.dataSource = [];
              }
              let row = {
                filePath: '',
                remark:'',
              }
              that.basSupplierResumeTable.dataSource.push(row);
            }
          }
        });
      },
      addBefore(){
        this.model = {};
        this.model.isCharge = '1';
        this.basSupplierContactTable.dataSource = [];
        this.basSupplierQualificationTable.dataSource = [];
        this.basSupplierBankTable.dataSource = [];
        this.basSupplierFastTable.dataSource = [];
        this.basSupplierResumeTable.dataSource = [];
      },
      /** 调用完edit()方法之后会自动调用此方法 */
      edit(record) {
        this.model = record;
        if(this.model.id){
          this.fetchContactList(this.model.id);
          this.fetchQualificationList(this.model.id);
          this.fetchBankList(this.model.id);
          this.fetchResumeList(this.model.id);
        }
      },
      fetchFastList(supplierId){
        this.basSupplierBankTable.dataSource = [];
        let url = "/srm/basSupplier/queryBasSupplierFastByMainId";
        let param = {
          id : supplierId
        }
        getAction(url,param).then(res => {
          this.basSupplierFastTable.dataSource = res.result;
        })
      },
      fetchBankList(supplierId){
        this.basSupplierBankTable.dataSource = [];
        let url = "/srm/basSupplier/queryBasSupplierBankByMainId";
        let param = {
          id : supplierId
        }
        getAction(url,param).then(res => {
          this.basSupplierBankTable.dataSource = res.result;
        })
      },
      fetchQualificationList(supplierId){
        this.basSupplierQualificationTable.dataSource = [];
        let url = "/srm/basSupplier/queryBasSupplierQualificationByMainId";
        let param = {
          id : supplierId
        }
        getAction(url,param).then(res => {
          this.basSupplierQualificationTable.dataSource = res.result;
        })
      },
      fetchContactList(supplierId){
        this.basSupplierContactTable.dataSource = [];
        let url = "/srm/basSupplier/queryBasSupplierContactByMainId";
        let param = {
          id : supplierId
        }
        getAction(url,param).then(res => {
          this.basSupplierContactTable.dataSource = res.result;
        })
      },
      fetchResumeList(supplierId){
        let url = "/srm/basSupplier/queryBasSupplierResumeByMainId";
        let param = {
          id : supplierId
        }
        getAction(url,param).then(res => {
          this.basSupplierResumeTable.dataSource = res.result;
        })
      },
    }
  }
</script>

<style scoped>
.ant-row.ant-form-item {
  margin-bottom: 12px;
}
</style>