<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container >
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <!-- <div style="background-color: red"
            v-if="model.contractStatus == '3' && model.suppApproveComment != null && model.suppApproveComment != undefined && model.suppApproveComment != ''">
            <h2>供应商驳回原因:{{model.suppApproveComment}}</h2>
          </div> -->
          <a-tag color="red" style="line-height: 30px;padding: 5px 10px;font-size: 14px;" v-if="model.contractStatus == '3' && model.suppApproveComment != null && model.suppApproveComment != undefined && model.suppApproveComment != ''">
            驳回原因：<span>{{model.suppApproveComment}}</span>
          </a-tag>
          <a-divider orientation="left" style="color: #00A0E9">
            合同附件
          </a-divider>
          <a-col :span="24">
            <a-button type="primary" style="float:right;z-index: 999;margin-top: -30px;" size="small"
                      @click="changeFileName(model.id,model.wordAttachment,'word_attachment','wordAttachment')" v-if="model.wordAttachment != null && model.wordAttachment != ''">修改文件名</a-button>
            <a-form-item label="合同附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1" required>
              <j-upload v-model="model.wordAttachment" :trigger-change="true" :disabled="formDisabled"></j-upload>
            </a-form-item>
          </a-col>
<!--          <a-divider orientation="left" style="color: #00A0E9" v-if="model.contractStatus == '4'">-->
<!--            OA回传附件-->
<!--          </a-divider>-->
<!--          <a-col :span="24" v-if="model.contractStatus == '4'">-->
<!--            <a-button type="primary" style="float:right;z-index: 999;margin-top: -30px;" size="small"-->
<!--                      @click="changeFileName(model.id,model.oaAttachment,'oa_attachment','oaAttachment')" v-if="model.oaAttachment != null && model.oaAttachment != ''">修改文件名</a-button>-->
<!--            <a-form-item label="合同附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1" required>-->
<!--              <j-upload v-model="model.oaAttachment" :trigger-change="true" :disabled="formDisabled"></j-upload>-->
<!--            </a-form-item>-->
<!--          </a-col>-->
          <a-divider orientation="left" style="color: #00A0E9">
            基本信息
          </a-divider>
          <a-col :span="8" >
            <a-form-model-item label="合同标题" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractName">
              <a-input v-model="model.contractName" placeholder="请输入合同标题" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="创建日期" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="createTime">
              <a-input v-model="model.createTime" placeholder="请输入创建日期" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="合同类型" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractCategory">
              <j-dict-select-tag  v-model="model.contractCategory" placeholder="请选择合同类型" dictCode="contract_type" :disabled="formDisabled"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="是否补充协议" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="isSag">
              <j-dict-select-tag  v-model="model.isSag" placeholder="请选择是否补充协议" dictCode="yn" :disabled="formDisabled" @change="clearMain"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="model.isSag == '1'">
            <a-form-model-item label="关联合同" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="mainId">
              <j-select-contract ref='contract' v-model="model.mainId" :multi="false" @change="backUser" :disabled="formDisabled" :param="{isSag:'0'}"></j-select-contract>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="费用分类" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <j-dict-select-tag  v-model="model.categoryId" placeholder="请选择费用分类" dictCode="project_category,name,id" disabled/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="合同等级" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractLevel">
              <a-input v-model="model.contractLevel" placeholder="请输入合同等级" :disabled="formDisabled"></a-input>
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
              <a-input-number v-model="model.contractCopiesNumber" placeholder="请输入合同份数" style="width: 100%" :disabled="formDisabled"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="合同金额(原币)" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractAmountTax">
              <a-input-number v-model="model.contractAmountTax" placeholder="请输入合同金额" style="width: 100%" :disabled="formDisabled"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                              @change="setValue"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="合同金额(本币)" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractAmountTaxLocal">
              <a-input-number v-model="model.contractAmountTaxLocal" placeholder="请输入合同金额" style="width: 100%" :disabled="formDisabled"
                              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                              @change="setValue"/>
            </a-form-model-item>
          </a-col>
<!--          <a-col :span="8">-->
<!--            <a-form-model-item label="合同税率" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractTaxRate">-->
<!--              <j-dict-select-tag style="width:100%;" v-model="model.contractTaxRate" placeholder="合同税率"-->
<!--                                 dictCode="tax_rate" disabled/>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->

          <a-col :span="8">
            <a-form-model-item label="合同模板" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <j-select-contract-template v-model="model.templateId" @change="back" :multi="false" :disabled="formDisabled"></j-select-contract-template>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="是否Demo设备" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="isDemo">
              <j-dict-select-tag style="width:100%;" v-model="model.isDemo" placeholder="是否Demo设备"
                                 dictCode="yn" :disabled="formDisabled" @change="setValue"/>
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
            v-if="model.reqType == '0' || model.contractType == '0'"
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :scroll="{x:true,y:500}"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="false"
            @expand="open"
            :expandedRowKeys="expandedRowKeys"
            >
            <template slot="prodCode" slot-scope="text,record">
              <a @click="openChild(record)">{{text}}</a>
            </template>

            <div slot="expandedRowRender" slot-scope="text">
              <div class="rfq-content rfq-content2" style="width:400px">
                <table>
                  <thead>
                  <tr>
                    <th style="width: 80px">序号</th>
                    <th style="width: 200px">配套产品</th>
                    <th style="width: 200px">品牌</th>
                    <th style="width: 200px">规格型号</th>
                    <th style="width: 180px">税率</th>
                    <th style="width: 180px">数量</th>
                    <th style="width: 180px">单价</th>
                    <th style="width: 180px">总价</th>
                    <th style="width: 100px">操作</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item, index) in text.objList">
                    <td style="width: 80px">{{index + 1}}</td>
                    <td style="width: 200px">
                      <a-input v-model='item.prodName' placeholder="配套设备" disabled></a-input>
                    </td>
                    <td style="width: 200px">
                      <a-input v-model='item.brandName' placeholder="品牌"  disabled></a-input>
                    </td>
                    <td style="width: 200px">
                      <a-input v-model='item.speType' placeholder="规格型号" disabled></a-input>
                    </td>
                    <td style="width: 180px">
                      <j-dict-select-tag placeholder="请输入税率" v-model="item.taxRate" dictCode="tax_rate"  disabled/>
                    </td>
                    <td style="width: 180px">
                      <a-input-number v-model='item.qty' placeholder="数量" style='width: 100%' @change="setVal(item)" :disabled="formDisabled"></a-input-number>
                    </td>
                    <td style="width: 180px">
                      <a-input-number v-model='item.priceTax' placeholder="单价" style='width: 100%' @change='setVal(item)' :disabled="formDisabled"></a-input-number>
                    </td>

                    <td style="width: 180px">
                      {{item.amountTax}}
                    </td>
                    <td style="width: 100px">
                      <a @click='delRow(index,text.childList)' :disabled="formDisabled">删除</a>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </a-table>
          <a-table
            v-else
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :scroll="{x:true}"
            :columns="columns1"
            :dataSource="dataSource"
            :pagination="false">
          </a-table>

          <a-divider orientation="left" style="color: #00A0E9">
            合同条款
          </a-divider>
          <a-button @click="addcolumns2" type="primary" icon="plus" style='float: right;z-index: 999' :disabled="formDisabled">新增</a-button>
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
            <template slot='termsName' slot-scope='text,record'>
              <a-input v-model='record.termsName' :disabled="formDisabled"></a-input>
            </template>
            <template slot='number' slot-scope='text,record'>
              <a-input v-model='record.number' :disabled="formDisabled"></a-input>
            </template>
            <template slot='termsContent' slot-scope='text,record'>
              <a-input v-model='record.termsContent' :disabled="formDisabled"></a-input>
            </template>
            <template slot='comment' slot-scope='text,record'>
              <a-input v-model='record.comment' type='textarea' :disabled="formDisabled"></a-input>
            </template>
            <template slot='action' slot-scope='text,record,index'>
              <a @click='delRow2(record,index)' :disabled="formDisabled">删除</a>
            </template>
          </a-table>

          <a-divider orientation="left" style="color: #00A0E9">
            支付方式
          </a-divider>
          <a-button @click="addcolumns3" type="primary" icon="plus" style='float: right;z-index: 999' :disabled="formDisabled">新增</a-button>
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
            <template slot='termsName' slot-scope='text,record'>
              <a-input v-model='record.termsName' :disabled="formDisabled"></a-input>
            </template>

            <template slot='termsContent' slot-scope='text,record'>
              <a-input v-model='record.termsContent' :disabled="formDisabled"></a-input>
            </template>
            <template slot='payMethod' slot-scope='text,record'>
              <j-dict-select-tag style="width:100%;" v-model="record.payMethod" placeholder="支付方式" dictCode="payMethod":disabled="formDisabled" />
            </template>
            <template slot='payRate' slot-scope='text,record'>
              <a-input-number v-model='record.payRate' :disabled="formDisabled" style='width: 100%'></a-input-number>
            </template>
            <template slot='payType' slot-scope='text,record'>
              <j-dict-select-tag placeholder="请输入付款类型" v-model="record.payType" dictCode="payType" :disabled="formDisabled"/>
            </template>
            <template slot='action' slot-scope='text,record,index'>
              <a @click='delRow3(record,index)' :disabled="formDisabled">删除</a>
            </template>
          </a-table>

          <a-divider orientation="left" style="color: #00A0E9">
            甲方信息
          </a-divider>
          <a-col :span="8" >
            <a-form-model-item label="甲方" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractFirstParty">
<!--              <a-input v-model="model.contractFirstParty" placeholder="请输入甲方" ></a-input>-->
              <j-dict-select-tag v-model="model.contractFirstParty" placeholder="请输入甲方" dictCode="sys_depart,depart_name,id,parent_id = '-1'"
                                 />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="甲方地址" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" >
              <a-input v-model="model.contractFirstAddress" placeholder="请输入甲方地址" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="甲方电话" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" >
              <a-input v-model="model.contractFirstTelphone" placeholder="请输入甲方电话" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="甲方传真" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" >
              <a-input v-model="model.contractFirstFax" placeholder="请输入甲方传真" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="甲方联系人" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input v-model="model.contractFirstContact" placeholder="请输入甲方联系人" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="甲方法人" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" >
              <a-input v-model="model.contractFirstLegalPerson" placeholder="请输入甲方法人" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="甲方代理人" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractFirstAgent">
              <a-input v-model="model.contractFirstAgent" placeholder="请输入甲方代理人" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="甲方开户行" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractFirstOpeningBank">
              <a-input v-model="model.contractFirstOpeningBank" placeholder="请输入甲方开户行" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="甲方银行账号" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractFirstBankAccount">
              <a-input v-model="model.contractFirstBankAccount" placeholder="请输入甲方银行账号" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="甲方邮政编码" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractFirstPostCode">
              <a-input v-model="model.contractFirstPostCode" placeholder="请输入甲方邮政编码" :disabled="formDisabled"></a-input>
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
              <a-input v-model="model.contractSecondAddress" placeholder="请输入乙方地址" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="乙方电话" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractSecondTelphone">
              <a-input v-model="model.contractSecondTelphone" placeholder="请输入乙方电话" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="乙方传真" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractSecondFax">
              <a-input v-model="model.contractSecondFax" placeholder="请输入乙方传真" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="乙方联系人" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractSecondContact">
              <a-input v-model="model.contractSecondContact" placeholder="请输入乙方联系人" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="乙方法人" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractSecondLegalPerson">
              <a-input v-model="model.contractSecondLegalPerson" placeholder="请输入乙方法人" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="乙方代理人" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractSecondAgent">
              <a-input v-model="model.contractSecondAgent" placeholder="请输入乙方代理人" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="乙方开户行" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractSecondOpeningBank">
              <a-input v-model="model.contractSecondOpeningBank" placeholder="请输入乙方开户行" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="乙方银行账号" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractSecondBankAccount">
              <a-input v-model="model.contractSecondBankAccount" placeholder="请输入乙方银行账号" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="乙方邮政编码" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractSecondPostCode">
              <a-input v-model="model.contractSecondPostCode" placeholder="请输入乙方邮政编码" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
<!--          <a-divider orientation="left" style="color: #00A0E9">
            其他附件
          </a-divider>
          <a-col :span="24">
            <a-button type="primary" style="float:right;z-index: 999;margin-top: -30px;" size="small"
                      @click="changeFileName(model.id,model.otherAttachment,'other_attachment','otherAttachment')" v-if="model.otherAttachment != null && model.otherAttachment != ''">修改文件名</a-button>
            <a-form-item label="其他附件资料" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
              <j-upload v-model="model.otherAttachment" :trigger-change="true" :disabled="formDisabled"></j-upload>
            </a-form-item>
          </a-col>-->
          <a-divider orientation="left" style="color: #00A0E9">
            备注
          </a-divider>
          <a-col :span="12" >
            <a-form-model-item label="备注" :labelCol="spans.labelCol2" :wrapperCol="spans.wrapperCol2" prop="comment">
              <a-input v-model="model.comment" placeholder="请输入备注" type="textarea" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
          <a-divider orientation="left" style="color: #00A0E9" v-if="model.contractStatus == '4'">
            OA回传附件
          </a-divider>
          <a-col :span="24" v-if="model.contractStatus == '4'">
            <a-form-model-item label="OA附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
              <j-upload v-model="model.oaAttachment" :trigger-change="true" :disabled="formDisabled"></j-upload>
            </a-form-model-item>
          </a-col>

          <a-divider orientation="left" style="color: #00A0E9" v-if="model.id">
            供应商相关附件
          </a-divider>
          <a-col :span="24" v-if="model.id">
            <a-form-model-item label="合同附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
              <j-upload v-model="model.contractAttachment" :trigger-change="true" :disabled="formDisabled"></j-upload>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" v-if="model.id">
            <a-form-model-item label="规格书附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
              <j-upload v-model="model.specificationAttachment" :trigger-change="true" :disabled="formDisabled"></j-upload>
            </a-form-model-item>
          </a-col>

          <a-divider orientation="left" style="color: #00A0E9" v-if="model.contractStatus == 2 && action == 'approve'">
            合同审批
          </a-divider>
          <a-col :span="24" v-if="model.contractStatus == 2 && action == 'approve'">
            <a-form-model-item label="审批人" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1" >
              {{model.approver}}
            </a-form-model-item>
          </a-col>
          <a-col :span="24" v-if="model.contractStatus == 2 && action == 'approve'">
            <a-form-model-item label="审批意见" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
              <a-input v-model="model.approveComment" placeholder="请输入备注" type="textarea" style="width: 45%"></a-input>
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
      :confirmLoading="confirmLoading"
      @ok="toSubmit"
      :visible="visible1">
      <a-spin :spinning="confirmLoading">
        <a-form-model ref="ruleForm" :model="ruleForm" >
          <a-row>
<!--            <a-col :span="24" >-->
<!--              <a-form-model-item label="合同编码" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" required>-->
<!--                <a-input v-model="ruleForm.contractNumber" placeholder="请输入合同编码"></a-input>-->
<!--              </a-form-model-item>-->
<!--            </a-col>-->
            <a-col :span="24" >
              <a-form-model-item label="流程发起人" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" >
                {{ruleForm.approver}}
              </a-form-model-item>
            </a-col>
            <a-col :span="24" >
              <a-form-model-item label="OA合同类型" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" required>
                <j-dict-select-tag  v-model="ruleForm.oaType" placeholder="请选择OA合同类型" dictCode="oa_type"/>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-spin>
    </a-modal>

    <change-file-name ref="cfn" @back="toSetUrl"></change-file-name>
  </a-spin>
</template>

<script>
import ChangeFileName from '@comp/jeecgbiz/ChangeFileName'
import { getAction, httpAction } from '@/api/manage'
import JFormContainer from '@/components/jeecg/JFormContainer'
import { billModalMixin } from '../../mixins/billModalMixin'
import { iegAmount, isNotNullOrEmpty, isNullOrEmpty, preciseNum } from '@/utils/util'
import JSelectContractTemplate from '@comp/jeecgbiz/JSelectContractTemplate'
import JSelectContract from '@comp/jeecgbiz/JSelectContract'
export default {
    name: 'ContractBaseForm',
    mixins: [billModalMixin],
    components: {
      JFormContainer,
      JSelectContractTemplate,
      ChangeFileName,
      JSelectContract
    },
    data() {
      return {
        nowRow:{},
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
        param:{},
        ruleForm:{},
        visible1:false,
        columns5:[
          {
            title: '序号',
            align:'center',
            dataIndex: 'sort',
            width:100,
          },
          {
            title: '数量',
            align:'center',
            dataIndex: 'qty',
            width:120,
          },
          {
            title: '交期',
            align:'center',
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
          // {
          //   title: '条款名称',
          //   dataIndex: 'termsName',
          //   width:140,
          //   align:"center",
          //   scopedSlots: {
          //     customRender: 'termsName'
          //   },
          // },
          {
            title: '付款类型',
            dataIndex: 'payType',
            width:120,
            align:"center",
            scopedSlots: {
              customRender: 'payType'
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
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:100,
            scopedSlots: {
              customRender: 'action'
            },
          },
        ],
        dataSource2:[],
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
            title: '条款名称',
            dataIndex: 'termsName',
            width:140,
            align:"center",
            scopedSlots: {
              customRender: 'termsName'
            },
          },
          // {
          //   title: '条款序号',
          //   dataIndex: 'number',
          //   width:120,
          //   align:"center",
          //   scopedSlots: {
          //     customRender: 'number'
          //   },
          // },
          {
            title: '条款内容',
            dataIndex: 'termsContent',
            width:180,
            align:"center",
            scopedSlots: {
              customRender: 'termsContent'
            },
          },
          // {
          //   title: '备注',
          //   dataIndex: 'comment',
          //   width:180,
          //   align:"center",
          //   scopedSlots: {
          //     customRender: 'comment'
          //   },
          // },
          {
            title: '操作',
            dataIndex: 'action',
            width:100,
            scopedSlots: {
              customRender: 'action'
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
          // {
          //   title: '需求数量',
          //   dataIndex: 'reqQty',
          //   width:120,
          // },
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
              obj.attrs.align = 'center';//控制表体内容居右
              return obj;
            }
          },
          {
            title: '税率(%)',
            dataIndex: 'contractTaxRate',
            align:"center",
            width:120,
            customRender:function (t,r,index) {
              if(t == '100'){
                return '其他';
              }else{
                return t + "%";
              }
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
                icon = 'Ұ';
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
                icon = 'Ұ';
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
          // {
          //   title: '品牌',
          //   dataIndex: 'brandName',
          //   width:120,
          // },
          {
            title: '设备产能',
            dataIndex: 'capacity',
            align:"center",
            width:120,
          },
          // {
          //   title: '需求数量',
          //   dataIndex: 'reqQty',
          //   width:120,
          // },
          {
            title: '合同数量',
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
            title: '单位',
            dataIndex: 'unitId_dictText',
            align:"center",
            width:120,
          },
          {
            title: '税率(%)',
            dataIndex: 'contractTaxRate',
            align:"center",
            width:120,
            customRender:function (t,r,index) {
              if(t == '100'){
                return '其他';
              }else{
                return t + "%";
              }
            }
          },
          {
            title: '设备单价',
            dataIndex: 'priceTax',
            width:120,
            customRender: (t,r,index) => {
              let _this = this;
              let icon = "";
              if(_this.model.contractCurrency == 'RMB'){
                icon = '¥';
              }else if(_this.model.contractCurrency == 'JPY'){
                icon = 'Ұ';
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
                icon = 'Ұ';
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
        dataSource:[],
        confirmLoading:false,
        model:{
         },
        // 新增时子表默认添加几行空数据
        addDefaultRowNum: 1,
        validatorRules: {
          mainId:[
            { required: true, message: '请选择关联合同!'},
          ],
          isSag:[
            { required: true, message: '请选择是否补充协议!'},
          ],
          contractCategory:[
            { required: true, message: '请选择合同类型!'},
          ],
          contractAmountTax: [
            { required: true, message: '合同金额(原币)金额!'},
          ],
          contractAmountTaxLocal: [
            { required: true, message: '请合同金额(本币)金额!'},
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
      setVal(item){
        let qty = item.qty;
        let orderPriceTax = item.priceTax;
        let fareAmount = item.fareAmount;
        if(isNullOrEmpty(fareAmount)){
          fareAmount = 0;
        }
        if(isNotNullOrEmpty(qty) && isNotNullOrEmpty(orderPriceTax)){
          let orderAmountTax = preciseNum(Number(qty) * Number(orderPriceTax) + Number(fareAmount),2);
          item.amountTax = Number(orderAmountTax);
        }

        this.$forceUpdate();
      },
      clearMain(){
        this.model.mainId = "";
        this.model.mainNumber = "";
      },
      backUser(ids,rows){
        this.model.mainNumber = rows[0].contractNumber;
        this.model.mainId = rows[0].id;
        this.$forceUpdate();
      },
      setValue(){
        this.$forceUpdate();
      },
      toSetUrl(url){
        this.model[this.param.filed] = url;
        this.$forceUpdate();
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
        // let contractNumber = that.ruleForm.contractNumber;
        // if(isNullOrEmpty(contractNumber)){
        //   that.$message.warn("请指定正式合同编码");
        //   return;
        // }
        let oaType = that.ruleForm.oaType;
        if(isNullOrEmpty(oaType)){
          that.$message.warn("请选择OA对应合同类型");
          return;
        }

        let row = JSON.parse(JSON.stringify(that.model));
        row.contractStatus = '3';
        // row.contractNumber = that.ruleForm.contractNumber;
        row.oaType = that.ruleForm.oaType;
        that.$confirm({
          content: `是否确认提交`,
          onOk: () => {
            that.confirmLoading = true;
            httpAction(url,row,post).then((res)=> {
              if (res.success) {
                that.$message.success(res.message);
                that.visible1 = false;
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              // 这里是无论成功或失败都会执行的方法，在这里关闭loading
              this.confirmLoading = false
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
      handleTableChange(pagination, filters, sorter) {
        this.ipagination = pagination;
        this.loadChildQty(this.nowRow);
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
          //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
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
          // this.loadChildQty(row);
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
            let row = JSON.parse(JSON.stringify(that.model));
            row.contractStatus = '3';
            that.visible1 = true;
            //获取合同对应的审核人
            let url = "/srm/approveSetting/fetchProcessUser";
            let param = {
              type:'oaContract',
              company:row.contractFirstPartyId
            }
            getAction(url,param).then(res => {
              if(res.success){
                that.ruleForm.approver = res.result.realname;
                that.$forceUpdate();
              }
            })
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
        //判断标的金额与明细金额是否一致
        for(let i = 0; i < dataSource.length; i++){
          let amount = dataSource[i].amountTax;
          let total = 0;
          let child = dataSource[i].objList;
          child.filter(item => {
            total = Number(total) + Number(item.amountTax);
          })
          if(amount != total){
            that.$message.warning("合同标的与子项金额不一致");
            return;
          }
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
            url = that.url.add;
            let wordAttachment = that.model.wordAttachment;
            if(isNullOrEmpty(wordAttachment)){
              that.$message.warning("请上传合同附件");
              return;
            }

            let dataSource = that.dataSource;
            if(dataSource == null || dataSource.length == 0){
              that.$message.warning("合同标的不能为空");
              return;
            }

            //判断标的金额与明细金额是否一致
            let exchangeRate = that.model.exchangeRate;
            let msg = "";
            for(let i = 0; i < dataSource.length; i++){
              //判断合同单价是否大于合同执行单价

              if(that.model.reqType == '0' || that.model.contractType == '0'){
                //本币金额
                let priceTaxLocal = Number(dataSource[i].priceTax) / Number(exchangeRate);
                priceTaxLocal = Number(priceTaxLocal) * Number(dataSource[i].addTax) * Number(dataSource[i].customsTax) + Number(dataSource[i].otherAmount);
                //设备执行金额
                let budgetPrice = Number(dataSource[i].budgetPrice);
                if(priceTaxLocal > budgetPrice){
                  // that.$message.warning("第"+(i+1)+"行,合同单价高于执行单价");
                  msg = msg + "第"+(i+1)+"行,合同单价高于执行单价;";
                }
              }

              let amount = dataSource[i].amountTax;
              let total = 0;
              let child = dataSource[i].objList;
              child.filter(item => {
                total = Number(total) + Number(item.amountTax);
              })
              if(amount != total){
                that.$message.warning("合同标的与子项金额不一致");
                return;
              }
            }

            that.model.contractObjectList = dataSource;
            let dataSource2 = that.dataSource2;
            if(dataSource2 != null && dataSource2.length > 0){
              // for(let i = 0; i < dataSource2.length; i++){
              //   if(isNullOrEmpty(dataSource2[i].termsName)){
              //     that.$message.warning("第" + (i+1) + "行,条款名称为空");
              //     return;
              //   }
              //   if(isNullOrEmpty(dataSource2[i].number)){
              //     that.$message.warning("第" + (i+1) + "行,条款序号为空");
              //     return;
              //   }
              //   if(isNullOrEmpty(dataSource2[i].termsContent)){
              //     that.$message.warning("第" + (i+1) + "行,合同条款为空");
              //     return;
              //   }
              // }
              that.model.contractTermsList = dataSource2;
            }

            let dataSource3 = that.dataSource3;
            if(dataSource3 != null && dataSource3.length > 0){
              for(let i = 0; i < dataSource3.length; i++){
                // if(isNullOrEmpty(dataSource3[i].termsName)){
                //   that.$message.warning("第" + (i+1) + "行,条款名称为空");
                //   return;
                // }
                if(isNullOrEmpty(dataSource3[i].termsContent)){
                  that.$message.warning("第" + (i+1) + "行,条款内容为空");
                  return;
                }

                if(isNullOrEmpty(dataSource3[i].payMethod)){
                  that.$message.warning("第" + (i+1) + "行,支付方式为空");
                  return;
                }
                if(isNullOrEmpty(dataSource3[i].payRate)){
                  that.$message.warning("第" + (i+1) + "行,支付比例为空");
                  return;
                }
                if(isNullOrEmpty(dataSource3[i].payType)){
                  that.$message.warning("第" + (i+1) + "行,付款类型为空");
                  return;
                }
              }
              that.model.contractPayStepList = dataSource3;
            }
            //如果执行单价小于合同单价则需要双重提示
            if(isNotNullOrEmpty(msg)){
              that.$confirm({
                content: msg,
                onOk: () => {
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
                }
              })
            }else{
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
            }

          }else{
            return false;
          }
        })
      },
      edit(record,type) {
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
        this.getContractDetailList(this.model.id);
        //获取汇率
        let param = {
          projectId:record.projectId,
          currency:this.model.contractCurrency,
        }
        this.getExchangeRate(param);
        // this.getApprove(this.model.id);
        this.getPayList(this.model.id);
        this.getTerms(this.model.id);
        //如果存在供应商驳回的情况,则带出供应商驳回原因
        if("3" == this.model.contractStatus){
          this.getApprove(this.model.id,'contract_supp');
        }
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
            amountTax = Number(amountTax) + Number(item.amountTax);

            //本币金额
            let priceTaxLocal = Number(item.priceTax) / Number(exchangeRate);
            priceTaxLocal = Number(priceTaxLocal) * Number(item.addTax) * Number(item.customsTax) + Number(item.otherAmount);
            let amount = Number(preciseNum(priceTaxLocal,2)) * item.qty;
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