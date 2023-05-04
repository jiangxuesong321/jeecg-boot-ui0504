<template>
  <a-spin  :spinning="confirmLoading">
    <j-form-container>
      <a-form-model ref="form"  :model="model"
                    :rules="validatorRules" slot="detail">
        <a-tabs v-model="tabKey" @change="handleChange">
          <a-tab-pane key="0" tab="基本信息" v-if="(ptype == 'edit' && tab == '0') || ptype != 'edit'">
            <!--            <a-card class="card" title="基本信息" :bordered="false">-->
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="项目名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                   prop="projName">
                  <a-input  v-model="model.projName" placeholder="请输入项目名称"
                           :disabled="formDisabled"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="项目编码" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                  <a-input  v-model="model.projCode" placeholder="编码自动生成" disabled></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="立项金额" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="projAmount">
                  <a-input-number v-model="model.projAmount" placeholder="请输入立项金额" :disabled="formDisabled" style="width: 100%"
                                  :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                  :parser="value => value.replace(/\$\s?|(,*)/g, '')"></a-input-number>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="执行金额" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="budgetAmount">
                  <a-input-number v-model="model.budgetAmount" placeholder="请输入执行金额" :disabled="formDisabled" style="width: 100%"
                                  :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                  :parser="value => value.replace(/\$\s?|(,*)/g, '')"></a-input-number>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="项目立项日期" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                   prop="projInitiationDate">
                  <j-date  placeholder="请选择项目立项日期" v-model="model.projInitiationDate"
                          style="width: 100%" :disabled="formDisabled" />

                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="主体" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                   prop="subject">
                  <j-dict-select-tag v-model="model.subject" placeholder="请输入主体"
                                     dictCode="sys_depart,depart_name,id,parent_id = '-1'"
                                     :disabled="formDisabled" />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="项目类型" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                   prop="projType">
                  <j-dict-select-tag v-model="model.projType" placeholder="请输入项目类型"
                                     dictCode="proj_type"
                                     :disabled="formDisabled" />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="申请人名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                   prop="applyUserId">
                  <j-select-user-by-dep v-model="model.applyUserId" :multi="false" @change="backUser"
                                        :disabled="formDisabled"></j-select-user-by-dep>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="申请部门名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                   prop="applyOrgId">
                  <j-dict-select-tag v-model="model.applyOrgId" placeholder="请输入申请部门"
                                     dictCode="sys_depart,depart_name,id" disabled />
                </a-form-model-item>
              </a-col>
              <!--              <a-col :span="8">-->
              <!--                <a-form-model-item label="预算金额" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"-->
              <!--                                   prop="budgetAmount">-->
              <!--                  <a-input-number v-model="model.budgetAmount" placeholder="请输入预算金额" style="width: 100%" disabled/>-->
              <!--                </a-form-model-item>-->
              <!--              </a-col>-->
              <a-col :span="24">
                <a-form-model-item label="项目背景" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1"
                                   prop="projBackground">
                  <a-input  v-model="model.projBackground" placeholder="请输入项目背景" type="textarea"
                           :rows="3" :disabled="formDisabled"></a-input>

                </a-form-model-item>
              </a-col>
            </a-row>
            <!--          </a-card>-->

            <a-card class="card" title="项目子类" :bordered="false" v-if="ptype == 'view'">
              <a-table
                style="clear:both"
                ref="table"
                size="middle"
                bordered
                :scroll="{x:true,y:300}"
                :columns="childColumns"
                :dataSource="childList"
                :pagination="false">
              </a-table>
            </a-card>
            <a-card class="card" title="外部文件" :bordered="false">
              <a-row>
                <a-col :span="24">
                  <a-button type="primary" style="float: right;z-index: 999;margin-top: -55px;" size="small" @click="changeFileName(model.id,model.outAttachment,'out_attachment','outAttachment')" v-if="model.outAttachment != null">修改文件名</a-button>
                  <a-form-item label="文件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
                    <j-upload v-model="model.outAttachment" :trigger-change="true" :disabled="formDisabled"></j-upload>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>
            <a-card class="card" title="内部文件" :bordered="false">
              <a-row>
                <a-col :span="24">
                  <a-button type="primary" style="float: right;z-index: 999;margin-top: -55px;" size="small" @click="changeFileName(model.id,model.inAttachment,'in_attachment','inAttachment')" v-if="model.inAttachment != null">修改文件名</a-button>
                  <a-form-item label="文件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1" required>
                    <j-upload v-model="model.inAttachment" :trigger-change="true" :disabled="formDisabled"></j-upload>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>
            <a-card class="card" title="其他文件" :bordered="false">
              <a-row>
                <a-col :span="24">
                  <a-button type="primary" style="float: right;z-index: 999;margin-top: -55px;" size="small" @click="changeFileName(model.id,model.otherAttachment,'other_attachment','otherAttachment')" v-if="model.otherAttachment != null">修改文件名</a-button>
                  <a-form-item label="文件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
                    <j-upload v-model="model.otherAttachment" :trigger-change="true"
                              :disabled="formDisabled"></j-upload>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>

            <a-card class="card" title="项目汇率" :bordered="false" v-if="!formDisabled">
              <a-button v-if="!formDisabled" @click="addRate" type="primary" style="float: right;z-index: 99"
                        :disabled="formDisabled">添加汇率
              </a-button>
              <a-table ref="tableSet"
                       size="middle"
                       rowKey="id"
                       :scroll="{x:true}"
                       :columns="rateColumns"
                       :dataSource="rateList"
                       :pagination="false">
                <template slot="currencyA" slot-scope="text,record">
                  <j-dict-select-tag v-model="record.currencyA" disabled dictCode="currency_type"
                                     style="width: 80%"></j-dict-select-tag>
                </template>
                <template slot="valueA" slot-scope="text,record">
                  <a-input-number v-model="record.valueA" disabled style="width: 80%"></a-input-number>
                </template>
                <template slot="currencyB" slot-scope="text,record">
                  <j-dict-select-tag v-model="record.currencyB" dictCode="currency_type" style="width: 80%"
                                     :disabled="formDisabled"></j-dict-select-tag>
                </template>
                <template slot="valueB" slot-scope="text,record">
                  <a-input-number v-model="record.valueB" style="width: 80%" :disabled="formDisabled"></a-input-number>
                </template>
                <template slot="action" slot-scope="text,record,index">
                  <a @click="delRate(index)" :disabled="formDisabled">删除</a>
                </template>
              </a-table>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="1" tab="费用分类" v-if="(ptype == 'edit' && tabKey == '1') || ptype != 'edit'">
            <div style="margin-top: 10px">
              <a-row>
                <a-col :span="6">
                  <div style="margin-bottom: 10px;">
                    <a-button @click="addCategory" type="primary" style="margin-right: 10px" :disabled="formDisabled">
                      添加费用分类
                    </a-button>
                    <a-button @click="addChildCategory" type="primary"
                              v-if="selectedKeys != null && selectedKeys.length > 0" :disabled="formDisabled">添加下级分类
                    </a-button>
                  </div>
                  <template>
                    <span style="user-select: none">
                      <a-tree
                        :defaultExpandAll="true"
                        @select="onSelect"
                        @rightClick="rightHandle"
                        class="tree-data"
                        :selectedKeys="selectedKeys"
                        :treeData="gData"
                        :checkStrictly="checkStrictly"
                        :expandedKeys="iExpandedKeys"
                        :autoExpandParent="autoExpandParent"
                        @expand="onExpand">
                          <div slot="custom" slot-scope="item" class="custom-item">
                            <a-tooltip placement="top">
                              <template slot="title">
                                <div>{{ item.title }}</div>
                              </template>
                            <span class="tree-title">
                              {{ item.title }}
                            </span>
                            </a-tooltip>
                            <a v-if="item.children == null || item.children.length == 0" style="margin-right: 10px"
                               @click="delTree(item)" :disabled="formDisabled">删除</a>
                            <a v-if="item.isLast == '0' && item.level < 4" @click="addChildCategory1(item)"
                               :disabled="formDisabled">添加下级</a>
                            <a v-if="item.isLast == '1' && item.isEqp == '0' && formDisabled" @click="handlePay(item,'1')">付款金额维护</a>
                            <a-divider type="vertical"></a-divider>
                            <a v-if="item.isLast == '1' && item.isEqp == '0' && formDisabled" @click="handlePay(item,'0')">合同金额维护</a>
                          </div>
                      </a-tree>
                    </span>
                  </template>
                </a-col>
                <a-col :span="18" style="border-left: 1px #ccc solid; padding-left: 10px;">
                  <a-row>
                    <a-col :span="8" v-if="selectedKeys != null && selectedKeys.length > 0" style="margin-top: 0px">
                      <a-form-model ref="form1" :model="form">
                        <a-col :span="24">
                          <a-form-model-item label="上级分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-input v-model="form.pname" placeholder="请输入分类名称" disabled></a-input>
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="24">
                          <a-form-model-item label="分类名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-input v-model="form.name" placeholder="请输入分类名称" :disabled="formDisabled"
                                     @change="setValue"></a-input>
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="24">
                          <a-form-model-item label="预算费用" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-input-number v-model="form.budgetAmount" placeholder="请输入预算费用" style="width:100%"
                                            :disabled="formDisabled || form.isLast != '1'" @change="doAmount(gData,form.parentId)"></a-input-number>
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="24">
                          <a-form-model-item label="是否末级" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-radio-group v-model="form.isLast" placeholder="请选择是否末级" @change="clearData('isLast')"
                                           :disabled="formDisabled">
                              <a-radio :value="0">
                                否
                              </a-radio>
                              <a-radio :value="1">
                                是
                              </a-radio>
                            </a-radio-group>
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="24" v-if="form.isLast == '1'">
                          <a-form-model-item label="是否是清单管理" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-radio-group v-model="form.isEqp" placeholder="请选择是否是清单管理" @change="clearData('isEqp')"
                                           :disabled="formDisabled">
                              <a-radio :value="0">
                                否
                              </a-radio>
                              <a-radio :value="1">
                                是
                              </a-radio>
                            </a-radio-group>
                          </a-form-model-item>
                        </a-col>
                      </a-form-model>
                    </a-col>
                    <a-col :span="selectedKeys != null && selectedKeys.length > 0 ? 16:24"
                           v-if="childList != null && childList.length > 0" style="margin-top: 0px">
                      <a-table
                        :class="formDisabled?'none-none-one':'none-none-two'"
                        ref="table"
                        size="middle"
                        bordered
                        :scroll="{x:true,y:300}"
                        :columns="childColumns"
                        :dataSource="childList"
                        :pagination="false">
                        <template slot="iprogress" slot-scope="text,record">
                          <a-input-number  v-model="record.iprogress" style="width:100%;text-align: right"
                                          @change="setIprogress(record)" :disabled="formDisabled " :formatter="value => `${value}%`"
                                          :parser="value => value.replace('%', '')"></a-input-number>
                        </template>

                        <template slot="capacity" slot-scope="text,record">
                          <a-input-number v-model="record.capacity" style="width:100%;text-align: right"  :disabled="formDisabled" @change="setCapacity(record)"></a-input-number>
                        </template>

                        <template slot="actCapacity" slot-scope="text,record">
                          <a-input-number v-model="record.actCapacity" style="width:100%;text-align: right"  :disabled="formDisabled" ></a-input-number>
                        </template>

                      </a-table>
                    </a-col>
                  </a-row>
                  <a-row v-if="form != null && form.isEqp == '1'">
                    <div style="margin-top:10px">
                      <a-button type="primary" :disabled="formDisabled"
                                style="float: right;overflow: hidden;margin-bottom: 10px;z-index: 99999;margin-left: 10px"
                                @click="openDialog">选择物料
                      </a-button>
                      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader"
                                :disabled="formDisabled"
                                style="float: right;overflow: hidden;margin-bottom: 10px;"
                                :action="importExcelUrl" @change="handleImport">
                        <a-button type="primary" icon="import" :disabled="formDisabled" style="z-index: 99999;margin-left: 10px">导入模板</a-button>
                      </a-upload>
                      <a-button type="primary" :disabled="formDisabled"
                                style="float: right;overflow: hidden;margin-bottom: 10px;z-index: 99999;margin-left: 10px"
                                @click="handleExport">物料模板
                      </a-button>
                      <a-tag color="blue" style="font-size: 18px;font-weight:bold;float: left;height: 30px" >
                        <span style="align-items: center;height: 27px;display: flex;justify-content: center;">
                          立项总额:
                          ¥{{ iegAmount(createAmount, 'total') }}
                        </span>
                      </a-tag>
                      <a-tag color="green" style="font-size: 18px;font-weight:bold;float: left;height: 30px">
                        <span style="align-items: center;height: 27px;display: flex;justify-content: center;">
                          执行总额:
                          ¥{{ iegAmount(executeAmount, 'total') }}
                        </span>
                      </a-tag>
                    </div>
                    <a-table
                      ref="table"
                      size="middle"
                      bordered
                      rowKey="id"
                      :scroll="{x:true,y:500}"
                      :columns="columns"
                      :dataSource="dataSource"
                      :pagination="false">

                      <template slot="projQty" slot-scope="text,record,index">
                        <a-input-number v-model="record.projQty" style="width: 100%;float: right" @blur="setAmount(record)"
                                        :disabled="ptype != 'add' && record.type != 'add'"></a-input-number>
                      </template>

                      <template slot="projPrice" slot-scope="text,record,index">
                        <a-input-number v-model="record.projPrice" style="width: 100%;float: right" @blur="setAmount(record)"
                                        :disabled="ptype != 'add' && record.type != 'add'"></a-input-number>
                      </template>


                      <template slot="capacity" slot-scope="text,record">
                        <a-input-number v-model="record.capacity" :disabled="formDisabled" style="float: right"></a-input-number>
                      </template>

                      <template slot="qty" slot-scope="text,record,index">
                        <a-input-number v-model="record.qty" style="width: 100%;float: right"
                                        :disabled="formDisabled" @blur="setAmount(record)"></a-input-number>
                      </template>

                      <template slot="budgetPrice" slot-scope="text,record,index">
                        <a-input-number v-model="record.budgetPrice" style="width: 100%;float: right" @blur="setAmount(record)"
                                        :disabled="formDisabled"></a-input-number>
                      </template>

                      <template slot="action" slot-scope="text,record,index">
                        <a @click="delRow(index)" :disabled="formDisabled">删除</a>
                      </template>
                    </a-table>
                  </a-row>
                </a-col>
              </a-row>

            </div>
          </a-tab-pane>
        </a-tabs>
      </a-form-model>
    </j-form-container>
    <a-drawer
      title="设备列表"
      width="90%"
      placement="right"
      :closable="false"
      @close="handleCancel"
      destroyOnClose
      :visible="visible">
      <bas-eqp-list ref="eqpList" @back="back" ptype="proj"></bas-eqp-list>
      <div style="text-align: center;margin-top: 10px">
        <a-button key="cancel" @click="handleCancel" style="margin-left:10px;" type="primary" ghost>取消</a-button>
      </div>
    </a-drawer>
    <a-drawer
      title="费用分类"
      width="50%"
      placement="right"
      :closable="false"
      @close="close"
      destroyOnClose
      :visible="visible1">
      <a-form-model ref="form2" :model="ruleForm">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="上级分类名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input v-model="ruleForm.pname" placeholder="请输入分类名称" disabled></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="分类名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" required>
              <a-input v-model="ruleForm.name" placeholder="请输入分类名称"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-if="ruleForm.isLast == '1'">
          <a-col :span="12">
            <a-form-model-item label="预算费用" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" required>
              <a-input-number v-model="ruleForm.budgetAmount" placeholder="请输入预算费用" style="width:100%"
                              :precision="2"></a-input-number>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="是否末级" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" required>
              <a-radio-group v-model="ruleForm.isLast" placeholder="请选择是否末级">
                <a-radio value="0">
                  否
                </a-radio>
                <a-radio value="1">
                  是
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-if="ruleForm.isLast == '1'">
          <a-col :span="12">
            <a-form-model-item label="是否是清单管理" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" required>
              <a-radio-group v-model="ruleForm.isEqp" placeholder="请选择是否是清单管理">
                <a-radio value="0">
                  否
                </a-radio>
                <a-radio value="1">
                  是
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>


      <div style="text-align: center;margin-top: 10px">
        <a-button @click="close" style="margin-left:10px;" type="primary" ghost>取消</a-button>
        <a-button @click="toSumbit" style="margin-left:10px;" type="primary">提交</a-button>
      </div>

    </a-drawer>

    <a-drawer
      title="费用支出"
      width="30%"
      placement="right"
      :closable="false"
      @close="closeVis"
      destroyOnClose
      :visible="visible2">
      <a-form-model ref="form" :model="payForm">
        <a-col :span="24">
          <a-form-model-item label="分类名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
            {{payForm.name}}
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item label="预算费用" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
            ¥{{iegAmount(payForm.budgetAmount,'total')}}
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item :label="payForm.type == '1' ? '已维护支出金额' : '已维护合同金额'" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
            ¥{{iegAmount(payForm.hasPayAmountTax,'total')}}
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item :label="payForm.type == '1' ? '维护支出金额' : '维护合同金额'" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
            <a-input-number v-model="payForm.payAmount" style="width:50%"></a-input-number>
          </a-form-model-item>
        </a-col>
      </a-form-model>
      <div style="text-align: center;margin-top: 10px">
        <a-button key="cancel" @click="closeVis" style="margin-left:10px;" type="primary" ghost>取消</a-button>
        <a-button key="cancel" @click="submitPay" style="margin-left:10px;" type="primary">提交</a-button>
      </div>
    </a-drawer>

    <change-file-name ref="cfn" @back="toSetUrl"></change-file-name>
  </a-spin>
</template>

<script>
import { httpAction, getAction, postAction, downFile, putAction } from '@/api/manage'
import { billListMixin } from '../../mixins/billListMixin'
import { billModalMixin } from '../../mixins/billModalMixin'
import BasEqpList from '@views/project/modules/BasEqpList'
import { isNotNullOrEmpty, isNullOrEmpty, preciseNum } from '@/utils/util'
import Vue from 'vue'
import { ACCESS_TOKEN, TENANT_ID } from '@/store/mutation-types'
import store from '@/store'
import {
  iegAmount
} from '@/utils/util'
import ChangeFileName from '@comp/jeecgbiz/ChangeFileName'
export default {
  name: 'ProjBaseForm',
  mixins: [billListMixin, billModalMixin],
  components: {
    BasEqpList,
    ChangeFileName
  },
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    ptype: {
      type: String,
      default: false,
      required: false
    }
  },
  data() {
    return {
      createAmount:0,
      executeAmount:0,
      payForm:{},
      visible2:false,
      param:{

      },
      tab:'',
      iegAmount,
      map: new Map(),
      map1:new Map(),
      rateList: [],
      rateColumns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '源币种',
          align: 'center',
          dataIndex: 'currencyA',
          width: 120,
          scopedSlots: { customRender: 'currencyA' }
        },
        {
          title: '源币种基数',
          align: 'center',
          dataIndex: 'valueA',
          width: 120,
          scopedSlots: { customRender: 'valueA' }
        },
        {
          title: '目标币种',
          align: 'center',
          dataIndex: 'currencyB',
          width: 120,
          scopedSlots: { customRender: 'currencyB' }
        },
        {
          title: '汇率',
          align: 'center',
          dataIndex: 'valueB',
          width: 180,
          scopedSlots: { customRender: 'valueB' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      childList: [],
      expandedRowKeys: [],
      form: {},
      autoExpandParent: true,
      iExpandedKeys: [],
      checkStrictly: true,
      checkedKeys: [],
      selectedKeys: [],
      rightClickSelectedKey: '',
      rightClickSelectedOrgCode: '',
      dropTrigger: '',
      ruleForm: {
        pname: '',
        name: '',
        budgetAmount: 0,
        isLast: '0',
        isEqp: '0'
      },
      visible1: false,
      gData: [],
      expandedKeys: [],
      tabKey: '0',
      userList: [],
      buyAmount: '',
      visible: false,
      width: '90%',
      childColumns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '项目子项',
          align: 'center',
          dataIndex: 'model_dictText',
          width: 160
        },
        {
          title: '执行金额',
          dataIndex: 'budgetAmount',
          width: 120,
          customRender:function (t,r,index) {
            let icon = "";
            icon = '¥';
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
          title: '形象进度(%)',
          dataIndex: 'iprogress',
          align: 'right',
          width: 120,
          scopedSlots: { customRender: 'iprogress' }
          // customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
          //   const obj = {
          //     children: isNullOrEmpty(value) ? 0 : value + '%',
          //     attrs: {},
          //   };
          //   obj.attrs.align = 'right';//控制表体内容居右
          //   return obj;
          // }
        },
        {
          title: '规划产能(万片/月)',
          dataIndex: 'capacity',
          align: 'center',
          width: 120,
          scopedSlots: { customRender: 'capacity' }
          // customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
          //   const obj = {
          //     children: value,
          //     attrs: {},
          //   };
          //   obj.attrs.align = 'right';//控制表体内容居右
          //   return obj;
          // }
        },
        {
          title: '实际产能(万片/月)',
          dataIndex: 'actCapacity',
          align: 'center',
          width: 120,
          scopedSlots: { customRender: 'actCapacity' }
          // customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
          //   const obj = {
          //     children: value,
          //     attrs: {},
          //   };
          //   obj.attrs.align = 'right';//控制表体内容居右
          //   return obj;
          // }
        }
      ],
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '物料编码',
          dataIndex: 'code',
          align: 'center',
          width: 140
        },
        {
          title: '物料名称',
          dataIndex: 'name',
          align: 'center',
          width: 200
        },
        {
          title: '设备产能(万片/月)',
          dataIndex: 'capacity',
          width: 160,
          align: 'center',
          scopedSlots: { customRender: 'capacity' }
        },
        {
          title: '规格型号',
          dataIndex: 'speType',
          align: 'center',
          width: 200
        },
        {
          title: '单位',
          align: 'center',
          dataIndex: 'unitId_dictText',
          width: 120
        },
        {
          title: '立项数量',
          dataIndex: 'projQty',
          width: 120,
          scopedSlots: { customRender: 'projQty' }
        },
        {
          title: '立项单价(元)',
          dataIndex: 'projPrice',
          width: 120,
          scopedSlots: { customRender: 'projPrice' }
        },
        {
          title: '执行数量',
          dataIndex: 'qty',
          width: 120,
          scopedSlots: { customRender: 'qty' }
        },
        {
          title: '执行单价(元)',
          dataIndex: 'budgetPrice',
          width: 120,
          scopedSlots: { customRender: 'budgetPrice' }
        },
        {
          title: '立项总额(元)',
          dataIndex: 'projAmount',
          width: 120,
          customRender:function (t,r,index) {
            let icon = "";
            icon = '¥';
            let amount = 0;
            if(isNotNullOrEmpty(r.projQty) && isNotNullOrEmpty(r.projPrice)){
              amount = Number(r.projQty) * Number(r.projPrice);
            }
            const obj = {
              children: icon + iegAmount(amount,'total'),
              attrs: {},
            };
            obj.attrs.align = 'right';//控制表体内容居右
            return obj;
          }
        },
        {
          title: '执行总额(元)',
          dataIndex: 'budgetAmount',
          width: 120,
          customRender:function (t,r,index) {
            let icon = "";
            icon = '¥';
            let amount = 0;
            if(isNotNullOrEmpty(r.qty) && isNotNullOrEmpty(r.budgetPrice)){
              amount = Number(r.qty) * Number(r.budgetPrice);
            }
            const obj = {
              children: icon + iegAmount(amount,'total'),
              attrs: {},
            };
            obj.attrs.align = 'right';//控制表体内容居右
            return obj;
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataSource: [],
      model: {},
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 6
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 16
        }
      },
      confirmLoading: false,
      validatorRules: {
        projAmount:[
          {
            required: true,
            message: '请输入立项金额!'
          }
        ],
        subject: [
          {
            required: true,
            message: '请输入主体!'
          }
        ],
        projCapacity: [{
          required: true,
          message: '请输入项目产能!'
        }],
        projInitiationDate: [{
          required: true,
          message: '请输入项目立项日期!'
        }],
        projCode: [{
          required: true,
          message: '请输入项目编码!'
        }],
        projName: [{
          required: true,
          message: '请输入项目名称!'
        }],
        applyUserId: [{
          required: true,
          message: '请选择申请人!'
        }],
        applyOrgId: [{
          required: true,
          message: '请选择申请部门!'
        }],
        budgetAmount: [{
          required: true,
          message: '请输入执行金额!'
        }],
        projType:[{
          required: true,
          message: '请选择项目类型!'
        }],
      },
      url: {
        add: '/srm/projBase/add',
        edit: '/srm/projBase/edit',
        queryById: '/srm/projBase/queryById',
        importExcelUrl: 'srm/projBase/importExcel'
      }
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    },
    tokenHeader() {
      let head = { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) }
      let tenantid = Vue.ls.get(TENANT_ID)
      if (tenantid) {
        head['tenant-id'] = tenantid
      }
      return head
    },
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  methods: {
    submitPay(){
      let that = this;
      let payAmount = that.payForm.payAmount;
      if(isNullOrEmpty(payAmount) && payAmount <= 0){
        that.$message.error("请输入本次维护金额");
        return;
      }
      let budgetAmount = that.payForm.budgetAmount;
      let hasPayAmountTax = that.payForm.hasPayAmountTax;
      if(Number(payAmount)  > Number(budgetAmount)){
        that.$message.error("本次维护金额不能大于分类预算");
        return;
      }
      let url = "/srm/projBase/submitCategoryPay";
      that.$confirm({
        content: `是否确认提交`,
        onOk: () => {
          postAction(url,that.payForm).then(res => {
            if(res.success){
              that.$message.success("提交成功");
              that.closeVis();
            }else{
              that.$message.error('提交失败');
            }
          })
        }
      })
    },
    closeVis(){
      this.visible2 = false;
    },
    handlePay(item,type){
      this.visible2 = true;
      this.payForm = item;
      this.payForm.hasPayAmountTax = 0;
      this.payForm.type = type;
      //加载已付
      this.fetchHasPayByCategoryId(item.id,type);
    },
    fetchHasPayByCategoryId(id,type){
      let url = "/srm/projBase/fetchHasPayByCategoryId";
      getAction(url,{id:id,type:type}).then(res => {
        if(res.success){
          this.payForm.hasPayAmountTax = res.result.hasPayAmountTax;
          this.$forceUpdate();
        }

      })
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
      that.param.table = "proj_base";
      that.$refs.cfn.initData(that.param);
    },
    setValue() {
      this.form.title = this.form.name
    },
    setCapacity(record){
      this.map1.set(record.model, record.capacity)
    },
    setIprogress(record) {
      this.map.set(record.model, record.iprogress)
      console.log(this.map)
    },
    delRate(index) {
      this.rateList.splice(index, 1)
    },
    addRate() {
      let row = {
        currencyA: 'RMB',
        valueA: '1',
        currencyB: '',
        valueB: ''
      }
      this.rateList.push(row)
    },
    clearData(type) {
      let that = this
      that.dataSource = []
      if (this.form.isLast == '0') {
        this.form.isEqp = 0
      }
      that.clearObj(this.form.id, this.gData, type)
      setTimeout(() => {
        that.childList = []
        that.doChildList(this.gData)
      }, 300)
    },
    clearObj(id, dataList, type) {
      for (let i = 0; i < dataList.length; i++) {
        let row = dataList[i]
        let flag = false
        if (id == row.id) {
          row.prodList = []
          if (type == 'isLast' && row.isLast == '0') {
            row.isEqp = '0'
          }
        }
        if (flag) {
          break
        } else {
          this.clearObj(id, row.children)
        }
      }
    },
    setVal() {
      this.$forceUpdate()
    },
    open(expanded, row) {
      if (expanded) {
        this.expandedRowKeys = []
        this.expandedRowKeys.push(row.id)
      } else {
        this.expandedRowKeys = []
      }
    },

    delTree(record) {
      let that = this
      that.form = record
      that.$confirm({
        content: `是否确认删除?`,
        onOk: () => {
          that.delObj(record.id, this.gData)
          that.dataSource = []
          that.form = {}
          setTimeout(() => {
            that.childList = []
            that.doChildList(this.gData)
            that.doAmount(this.gData,record.parentId);
            //计算总预算
            that.setBudgetAmount()
          }, 300)
          that.selectedKeys = []
        }
      })
    },
    delObj(id, dataList) {
      for (let i = 0; i < dataList.length; i++) {
        let row = dataList[i]
        let flag = false
        if (id == row.id) {
          dataList.splice(i, 1)
          flag = true
        }
        if (flag) {
          break
        } else {
          this.delObj(id, row.children)
        }
      }
    },
    onExpand(expandedKeys) {
      console.log('onExpand', expandedKeys)
      this.iExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    // 右键操作方法
    rightHandle(node) {
      this.dropTrigger = 'contextmenu'
      this.rightClickSelectedKey = node.node.eventKey
      this.rightClickSelectedOrgCode = node.node.dataRef.orgCode
    },
    onCheck(checkedKeys, info) {
      if (this.checkStrictly) {
        this.checkedKeys = checkedKeys.checked
      } else {
        this.checkedKeys = checkedKeys
      }
    },
    setTotalAmount(){
      //计算总额
      this.createAmount = 0;
      this.executeAmount = 0;

      let createAmount = 0;
      let executeAmount = 0;
      if(this.dataSource != null && this.dataSource.length > 0){
        this.dataSource.filter(item => {
          let projQty = item.projQty;
          if(isNullOrEmpty(projQty)){
            projQty = Number(0);
          }
          let qty = item.qty;
          if(isNullOrEmpty(qty)){
            qty = Number(0);
          }
          let budgetPrice = item.budgetPrice;
          let projPrice = item.projPrice;
          if(isNullOrEmpty(budgetPrice)){
            budgetPrice = Number(0);
          }
          if(isNullOrEmpty(projPrice)){
            projPrice = Number(0);
          }
          let amount = Number(projQty) * Number(projPrice);
          let amount1 = Number(qty) * Number(budgetPrice);

          createAmount = Number(createAmount) + Number(amount);
          executeAmount = Number(executeAmount) + Number(amount1);
        })
        this.createAmount = createAmount;
        this.executeAmount = executeAmount;
      }

    },
    onSelect(selectedKeys, e) {
      let record = e.node.dataRef
      this.form = record
      this.form.isLast = Number(record.isLast)
      this.form.isEqp = Number(record.isEqp)
      this.selectedKeys = [record.key]
      this.dataSource = []
      this.dataSource = record.prodList;

      this.setTotalAmount();
    },
    // 右键点击下拉框改变事件
    dropStatus(visible) {
      if (visible == false) {
        this.dropTrigger = ''
      }
    },
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    },
    toSumbit() {
      let name = this.ruleForm.name
      if (isNullOrEmpty(name)) {
        this.$message.error('请输入分类名称!')
        return
      }
      let budgetAmount = this.ruleForm.budgetAmount
      if ((isNullOrEmpty(budgetAmount) || Number(budgetAmount) <= 0) && this.ruleForm.isLast == '1') {
        this.$message.error('请输入执行金额!')
        return
      }
      if(this.ruleForm.isLast == '0'){
        budgetAmount = 0;
      }
      let id = this.guid()
      let pid = this.form.id
      let level = 0
      if (isNotNullOrEmpty(pid)) {
        level = 1 + Number(this.form.level)
      }

      let row = {
        title: name,
        key: id,
        pname: this.form.name,
        id: id,
        parentId:pid,
        name: name,
        budgetAmount: this.ruleForm.budgetAmount,
        isLast: this.ruleForm.isLast,
        isEqp: this.ruleForm.isEqp,
        level: level,
        children: [],
        scopedSlots: { title: 'custom' },
        prodList: []
      }
      if (level == 0) {
        this.gData.push(row)
      } else {
        this.doObj(pid, row, this.gData)
      }

      this.doAmount(this.gData,pid);
      this.iExpandedKeys.push(id)
      this.close()
      //计算总预算
      this.setBudgetAmount()
    },
    doAmount(dataList,id){
      try{
        if(isNotNullOrEmpty(id)){
          let forFn = function(arr,id){
            for(let i = 0; i < arr.length;i++){
              let item = arr[i];
              if(item.id == id){
                // if(item.parentId == 0){
                //   return;
                // }
                let childList = item.children
                let budgetAmount = 0
                childList.filter(item => {
                  budgetAmount = Number(budgetAmount) + Number(item.budgetAmount)
                })
                item.budgetAmount = budgetAmount;
                forFn(dataList, item.parentId)
                break
              }else{
                if (item.children) {
                  forFn(item.children, id)
                }
              }
            }
          }
          forFn(dataList, id);
        }
      }catch (e) {
        return;
      }
    },
    setBudgetAmount() {
      let budgetAmount = 0
      this.model.budgetAmount = budgetAmount
      this.gData.filter(item => {
        budgetAmount = Number(budgetAmount) + Number(item.budgetAmount)
      })
      budgetAmount = Number(preciseNum(budgetAmount, 2))
      this.model.budgetAmount = budgetAmount
    },
    doObj(pid, record, dataList) {
      for (let i = 0; i < dataList.length; i++) {
        let row = dataList[i]
        let flag = false
        if (pid == row.id) {
          //判断预算金额
          // let childList = row.children
          // let budgetAmount = 0
          // childList.filter(item => {
          //   budgetAmount = Number(budgetAmount) + Number(item.budgetAmount)
          // })
          // budgetAmount = preciseNum(Number(budgetAmount) + Number(record.budgetAmount), 2)
          // if (Number(row.budgetAmount) < Number(budgetAmount)) {
          //   this.$message.warning('子级执行金额相加不能大于父层执行金额')
          //   return
          // }
          // if(budgetAmount > 0){
          //   row.budgetAmount = budgetAmount;
          // }
          row.children.push(record);
          flag = true;
        }
        if (flag) {
          break
        } else {
          this.doObj(pid, record, row.children)
        }
      }
    },
    close() {
      this.visible1 = false
    },
    addChildCategory1(item) {
      this.visible1 = true
      this.ruleForm = {
        pname: item.name,
        name: '',
        budgetAmount: 0,
        isLast: '0',
        isEqp: '0'
      }
    },
    addChildCategory() {
      if (this.selectedKeys == null || this.selectedKeys.length == 0) {
        this.$message.error('请选择需要父层')
        return
      }
      let isLast = this.form.isLast
      if (isLast == '1') {
        this.$message.error('已是最末级,不能添加子项')
        return
      }
      let level = this.form.level
      if (level >= 4) {
        this.$message.error('最多只能维护五级分类')
        return
      }
      this.visible1 = true
      this.ruleForm = {
        pname: this.form.name,
        name: '',
        budgetAmount: 0,
        isLast: '0',
        isEqp: '0'
      }
    },
    addCategory() {
      this.visible1 = true
      this.form.id = null
      this.ruleForm = {
        pname: '',
        name: '',
        budgetAmount: 0,
        isLast: '0',
        isEqp: '0'
      }
    },
    handleChange(tabKey) {

    },
    handleImport(info) {
      let that = this
      that.loading = true
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        that.loading = false
        if (info.file.response.success) {
          // that.$message.success(`${info.file.name} 文件上传成功`);
          if (info.file.response.code === 201) {
            let { message, result: { msg, fileUrl, fileName } } = info.file.response
            let href = window._CONFIG['domianURL'] + fileUrl
            that.$warning({
              title: message,
              content: (<div>
                  <span>{msg}</span><br />
                  <span>具体详情请 <a href={href} target="_blank" download={fileName}>点击下载</a> </span>
                </div>
              )
            })
          } else {
            that.$message.success(info.file.response.message || `${info.file.name} 文件上传成功`)
          }
          let childList = this.childList
          if (childList == null || childList.length == 0) {
            childList = []
          }

          let dataList = info.file.response.result
          if (that.dataSource == null || that.dataSource.length == 0) {
            that.dataSource = []
          }
          dataList.filter(item => {
            item.materialId = item.id
            let flag = false
            let idx = 0
            that.dataSource.filter(function(child, index) {
              if (item.id == child.id) {
                flag = true
                idx = index
                return
              }
            })
            if (!flag) {
              item.type = 'add';
              that.dataSource.push(item)
              that.$forceUpdate()
            } else {
              that.dataSource[idx].qty = item.qty;
              that.dataSource[idx].projQty = item.projQty;
              that.dataSource[idx].projPrice = item.projPrice;
              that.dataSource[idx].budgetPrice = item.budgetPrice;
              that.dataSource[idx].budgetAmount = item.budgetAmount;
              that.dataSource[idx].projAmount = item.projAmount;
              that.dataSource[idx].capacity = item.capacity;
              that.$forceUpdate()
            }
          })
          setTimeout(() => {
            that.doProd(that.form.id, that.dataSource, that.gData);
            that.setTotalAmount();
          }, 300)
          setTimeout(() => {
            that.childList = []
            that.doChildList(this.gData)
          }, 300)
        } else {
          that.$message.error(`${info.file.name} ${info.file.response.message}.`)
        }
      } else if (info.file.status === 'error') {
        that.loading = false
        if (info.file.response.status === 500) {
          let data = info.file.response
          const token = Vue.ls.get(ACCESS_TOKEN)
          if (token && data.message.includes('Token失效')) {
            that.$error({
              title: '登录已过期',
              content: '很抱歉，登录已过期，请重新登录',
              okText: '重新登录',
              mask: false,
              onOk: () => {
                store.dispatch('Logout').then(() => {
                  Vue.ls.remove(ACCESS_TOKEN)
                  window.location.reload()
                })
              }
            })
          }
        } else {
          that.$message.error(`文件上传失败: ${info.file.msg} `)
        }
      }
    },
    // handleExport(fileName) {
    //   window.location = '/设备清单.xls'
    // },
    handleExport(fileName){
      if(!fileName || typeof fileName != "string"){
        fileName = "导出文件"
      }
      let param = this.form;
      console.log("==============",param)
      let url = "/srm/projBase/exportXls";
      downFile(url,{id:param.id}).then((data)=>{
        if (!data) {
          this.$message.warning("文件下载失败")
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data],{type: 'application/vnd.ms-excel'}), fileName+'.xls')
        }else{
          let url = window.URL.createObjectURL(new Blob([data],{type: 'application/vnd.ms-excel'}))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName+'.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(url); //释放掉blob对象
        }
      })
    },
    backUser(ids, rows) {
      this.model.applyUserId = rows[0].username;
      this.model.applyOrgId = rows[0].departIds
      this.$forceUpdate();
    },
    toBack(str, rows) {
      this.model.applyOrgName = rows[0].departName
      let orgId = rows[0].id
      this.userList = []
      this.model.applyUserId = null
      this.getUserByOrgId(orgId)
    },
    getUserByOrgId(orgId) {
      let url = '/sys/user/getUserByOrgId'
      getAction(url, { departIds: orgId }).then(res => {
        this.userList = res.result
      })
    },
    setAmount(record) {
      let qty = record.qty
      record.budgetAmount = 0
      let budgetPrice = record.budgetPrice

      if (isNotNullOrEmpty(qty) && isNotNullOrEmpty(budgetPrice)) {
        let amount = preciseNum(Number(qty) * Number(budgetPrice), 2)
        record.budgetAmount = Number(amount);

        this.childList = []
        //重新加载项目子项
        this.doChildList(this.gData)
        this.$forceUpdate()
      }

      this.setTotalAmount();
    },
    delRow(index) {
      let that = this;
      that.$confirm({
        content: `是否确认删除?`,
        onOk: () => {
          that.dataSource.splice(index, 1)
          that.childList = []
          //重新加载项目子项
          that.doChildList(this.gData);

          that.setTotalAmount();
        }
      })
    },
    doChildList(dataList) {
      for (let i = 0; i < dataList.length; i++) {
        let row = dataList[i]
        let flag = false
        let prodList = row.prodList
        if (row.isLast == '1' && row.isEqp == '1' && prodList != null && prodList.length > 0) {
          prodList.filter(item => {
            let exist = false
            this.childList.filter(child => {
              if (item.model == child.model) {
                exist = true
                if (isNotNullOrEmpty(item.budgetAmount)) {
                  let budgetAmount = preciseNum(Number(child.budgetAmount) + Number(item.budgetAmount), 2)
                  child.budgetAmount = Number(budgetAmount)
                }
                return
              }
            })
            if (!exist) {
              let iprogress = this.map.get(item.model);
              let capacity = this.map1.get(item.model);
              let child = {
                model: item.model,
                model_dictText: item.model_dictText,
                budgetAmount: item.budgetAmount,
                iprogress: iprogress,
                capacity:capacity
              }
              this.childList.push(child)
            }
          })
          flag = true
        }
        if (!flag) {
          this.doChildList(row.children)
        }
      }
    },
    back(selectionRows) {
      let dataSource = this.dataSource
      if (dataSource == null || dataSource.length == 0) {
        dataSource = []
      }
      let childList = this.childList
      if (childList == null || childList.length == 0) {
        childList = []
      }
      for (let i = 0; i < selectionRows.length; i++) {
        let row = selectionRows[i]
        let flag = false
        //设备清单
        dataSource.filter(item => {
          if (row.id == item.id) {
            flag = true
            return
          }
        })
        if (!flag) {
          row.materialId = row.id;
          row.qty = 0;
          row.projQty = 0;
          row.projPrice = 0;
          row.budgetPrice = 0;
          row.budgetAmount = 0;
          row.type = 'add';
          dataSource.push(row)
        }
        //项目子项
        let exist = false
        childList.filter(child => {
          if (child.model == row.model) {
            exist = true
            return
          }
        })
        if (!exist) {
          let child = {
            model: row.model,
            model_dictText: row.model_dictText,
            budgetAmount: 0
          }
          childList.push(child)
        }
      }
      this.childList = childList
      this.dataSource = dataSource
      this.doProd(this.form.id, dataSource, this.gData)
      this.$message.success('添加成功')
    },
    doProd(id, prodList, dataList) {
      for (let i = 0; i < dataList.length; i++) {
        let row = dataList[i]
        let flag = false
        if (id == row.id) {
          row.prodList = prodList
          flag = true
        }
        if (flag) {
          break
        } else {
          this.doProd(id, prodList, row.children)
        }
      }
    },
    handleCancel() {
      this.visible = false
    },
    openDialog() {
      this.visible = true
      setTimeout(() => {
        this.$refs.eqpList.initData()
      }, 300)
    },
    add() {
      this.edit(this.modelDefault)
    },
    edit(record, type) {
      this.dataSource = []
      this.gData = []
      this.childList = []
      this.rateList = []
      this.map = new Map()
      this.model = Object.assign({}, record);
      this.tab = type;
      if(this.ptype == 'edit'){
        if(type == '0'){
          this.tabKey = '0';
        }else{
          this.tabKey = '1';
        }
      }
      if (this.model.id) {
        this.buyAmount = this.model.buyAmount
        this.getUserByOrgId(record.applyOrgId)
        this.fetchBomChild(this.model.id)
        this.fetchCategory(this.model.id)
        this.fetchExchangeRate(this.model.id)
      } else {
        this.model.applyUserId = this.$store.getters.userInfo.username
        this.model.applyOrgId = this.$store.getters.userInfo.departIds
      }
    },
    fetchExchangeRate(projectId) {
      let url = '/srm/projBase/fetchExchangeRate'
      let param = {
        projectId: projectId
      }
      getAction(url, param).then(res => {
        this.rateList = res.result
      })
    },
    fetchCategory(projectId) {
      let url = '/srm/projBase/fetchCategory'
      let param = {
        projectId: projectId
      }
      getAction(url, param).then(res => {
        this.gData = res.result
      })
    },
    fetchBomChild(projectId) {
      let url = '/srm/projBase/fetchBomChild'
      let param = {
        projectId: projectId
      }
      getAction(url, param).then(res => {
        this.childList = res.result
        if (this.childList != null && this.childList.length > 0) {
          this.childList.filter(item => {
            this.map.set(item.model, item.iprogress);
            this.map1.set(item.model, item.capacity)
          })
        }
      })
    },
    checkCategory(gData) {
      let that = this
      let totalAmount = 0
      let msg = null
      for (let i = 0; i < gData.length; i++) {
        let row = gData[i]
        if (isNullOrEmpty(row.name)) {
          msg = '请维护分类名称'
          that.$message.error(msg)
          throw msg
        }
        if (isNullOrEmpty(row.budgetAmount)) {
          msg = '分类:' + row.name + ',请输入执行金额'
          that.$message.error(msg)
          throw msg
        }
        if (row.isLast == '1' && row.isEqp == '1' && (row.prodList == null || row.prodList.length == 0)) {
          msg = '分类:' + row.name + ',请选择设备'
          that.$message.error(msg)
          throw msg
        }
        if (row.prodList != null && row.prodList.length > 0) {
          let budgetAmount = 0
          row.prodList.filter(item => {
            // if (isNullOrEmpty(item.capacity)) {
            //   msg = '分类:' + row.name + ',下级设备:' + item.name + ',产能为空'
            //   that.$message.error(msg)
            //   throw msg
            // }
            if (isNullOrEmpty(item.projQty)) {
              msg = '分类:' + row.name + ',下级设备:' + item.name + ',立项数量为空'
              that.$message.error(msg)
              throw msg
            }
            if (isNullOrEmpty(item.projPrice)) {
              msg = '分类:' + row.name + ',下级设备:' + item.name + ',立项单价为空'
              that.$message.error(msg)
              throw msg
            }
            if (isNullOrEmpty(item.qty)) {
              msg = '分类:' + row.name + ',下级设备:' + item.name + ',执行数量为空'
              that.$message.error(msg)
              throw msg
            }

            if (isNullOrEmpty(item.budgetPrice)) {
              msg = '分类:' + row.name + ',下级设备:' + item.name + ',执行单价为空'
              that.$message.error(msg)
              throw msg
            }
            budgetAmount = Number(budgetAmount) + Number(item.budgetAmount)
          })
          // alert(budgetAmount);
          // alert(row.budgetAmount);
          if (Number(preciseNum(budgetAmount, 2)) > row.budgetAmount) {
            msg = '分类:' + row.name + ',下级设备执行总额大于该分类所设执行金额'
            that.$message.error(msg)
            throw msg
          }
        }
        if (row.level == '0') {
          totalAmount = Number(totalAmount) + Number(row.budgetAmount)
          totalAmount = Number(preciseNum(totalAmount, 2))
        }

        let children = row.children
        that.checkCategory(children)

        //比较下级分类预算总额与上级分类预算
        // setTimeout(() => {
        let budgetAmount = 0
        children.filter(item => {
          budgetAmount = Number(budgetAmount) + Number(item.budgetAmount)
        })
        if (Number(preciseNum(budgetAmount, 2)) > row.budgetAmount) {
          msg = '分类:' + row.name + ',下级分类预算总额大于该分类所设执行金额'
          that.$message.error(msg)
          throw msg
        }
        // }, 100)
      }
      return totalAmount
    },
    submitForm() {
      const that = this
      // 触发表单验证
      if (!that.model.id) {
        that.$refs.form.validate(valid => {
          if (valid) {
            let httpurl = ''
            let method = ''
            if (!that.model.id) {
              httpurl += this.url.add
              method = 'post'
            } else {
              httpurl += this.url.edit
              method = 'put'
            }
            // if(that.rateList == null || that.rateList.length == 0){
            //   that.$message.error('请维护汇率!')
            //   return;
            // }
            //判断汇率是否重复维护
            if (that.rateList != null && that.rateList.length > 0) {
              let set = new Set()
              for (let i = 0; i < that.rateList.length; i++) {
                if (isNullOrEmpty(that.rateList[i].currencyB)) {
                  that.$message.error('第' + (i + 1) + '行,目标币种为空')
                  return
                }
                if (isNullOrEmpty(that.rateList[i].valueB)) {
                  that.$message.error('第' + (i + 1) + '行,汇率为空')
                  return
                }
                set.add(that.rateList[i].currencyB)
              }
              if (set.size != that.rateList.length) {
                that.$message.error('汇率维护存在重复币种!')
                return
              }
            }

            // let outAttahcment = that.model.outAttachment
            // if (isNullOrEmpty(outAttahcment)) {
            //   that.$message.error('请上传外部文件!')
            //   return
            // }
            let inAttachment = that.model.inAttachment
            if (isNullOrEmpty(inAttachment)) {
              that.$message.error('请上传内部文件!')
              return
            }
            // let otherAttachment = that.model.otherAttachment;
            // if(isNullOrEmpty(otherAttachment)){
            //   that.$message.error('请上传其他文件!')
            //   return;
            // }

            if (that.gData == null || that.gData.length == 0) {
              that.$message.error('请选择项目费用分类!')
              return
            }
            let budgetAmount = that.model.budgetAmount
            //判断 顶层分类预算 是否 超过项目预算
            that.checkCategory(that.gData)
            // if(Number(budgetAmount) < Number(totalAmount)){
            //   that.$message.error("费用分类预算不能大于项目预算");
            //   return;
            // }
            that.model.rateList = that.rateList
            that.model.categoryList = that.gData
            that.model.childList = that.childList
            that.$confirm({
              content: `是否确认提交`,
              onOk: () => {
                that.confirmLoading = true
                httpAction(httpurl, that.model, method).then((res) => {
                  if (res.success) {
                    that.$message.success(res.message)
                    that.$emit('ok')
                  } else {
                    that.$message.warning(res.message)
                  }
                }).finally(() => {
                  that.confirmLoading = false
                })
              }
            })
          } else {
            that.$message.error('项目详情 - 基本信息检查必填项!')
          }
        })
      }else{
        if(that.tab == '0'){
          that.$refs.form.validate(valid => {
            if (valid) {
              let httpurl = ''
              let method = ''
              if (!that.model.id) {
                httpurl += this.url.add
                method = 'post'
              } else {
                httpurl += this.url.edit
                method = 'put'
              }
              // if(that.rateList == null || that.rateList.length == 0){
              //   that.$message.error('请维护汇率!')
              //   return;
              // }
              //判断汇率是否重复维护
              if (that.rateList != null && that.rateList.length > 0) {
                let set = new Set()
                for (let i = 0; i < that.rateList.length; i++) {
                  if (isNullOrEmpty(that.rateList[i].currencyB)) {
                    that.$message.error('第' + (i + 1) + '行,目标币种为空')
                    return
                  }
                  if (isNullOrEmpty(that.rateList[i].valueB)) {
                    that.$message.error('第' + (i + 1) + '行,汇率为空')
                    return
                  }
                  set.add(that.rateList[i].currencyB)
                }
                if (set.size != that.rateList.length) {
                  that.$message.error('汇率维护存在重复币种!')
                  return
                }
              }

              // let outAttahcment = that.model.outAttachment
              // if (isNullOrEmpty(outAttahcment)) {
              //   that.$message.error('请上传外部文件!')
              //   return
              // }
              let inAttachment = that.model.inAttachment
              if (isNullOrEmpty(inAttachment)) {
                that.$message.error('请上传内部文件!')
                return
              }
              // let otherAttachment = that.model.otherAttachment;
              // if(isNullOrEmpty(otherAttachment)){
              //   that.$message.error('请上传其他文件!')
              //   return;
              // }

              // if (that.gData == null || that.gData.length == 0) {
              //   that.$message.error('请选择项目费用分类!')
              //   return
              // }
              // let budgetAmount = that.model.budgetAmount
              //判断 顶层分类预算 是否 超过项目预算
              // that.checkCategory(that.gData)
              // if(Number(budgetAmount) < Number(totalAmount)){
              //   that.$message.error("费用分类预算不能大于项目预算");
              //   return;
              // }
              that.model.rateList = that.rateList;
              that.model.categoryList = that.gData;
              that.model.childList = that.childList;
              that.model.tab = that.tab;
              that.$confirm({
                content: `是否确认提交`,
                onOk: () => {
                  that.confirmLoading = true
                  httpAction(httpurl, that.model, method).then((res) => {
                    if (res.success) {
                      that.$message.success(res.message)
                      that.$emit('ok')
                    } else {
                      that.$message.warning(res.message)
                    }
                  }).finally(() => {
                    that.confirmLoading = false
                  })
                }
              })
            } else {
              that.$message.error('项目详情 - 基本信息检查必填项!')
            }
          })
        }else{
          that.$refs.form.validate(valid => {
            if (true) {
              let httpurl = ''
              let method = ''
              if (!that.model.id) {
                httpurl += this.url.add
                method = 'post'
              } else {
                httpurl += this.url.edit
                method = 'put'
              }
              // if(that.rateList == null || that.rateList.length == 0){
              //   that.$message.error('请维护汇率!')
              //   return;
              // }
              //判断汇率是否重复维护
              // if (that.rateList != null && that.rateList.length > 0) {
              //   let set = new Set()
              //   for (let i = 0; i < that.rateList.length; i++) {
              //     if (isNullOrEmpty(that.rateList[i].currencyB)) {
              //       that.$message.error('第' + (i + 1) + '行,目标币种为空')
              //       return
              //     }
              //     if (isNullOrEmpty(that.rateList[i].valueB)) {
              //       that.$message.error('第' + (i + 1) + '行,汇率为空')
              //       return
              //     }
              //     set.add(that.rateList[i].currencyB)
              //   }
              //   if (set.size != that.rateList.length) {
              //     that.$message.error('汇率维护存在重复币种!')
              //     return
              //   }
              // }

              // let outAttahcment = that.model.outAttachment
              // if (isNullOrEmpty(outAttahcment)) {
              //   that.$message.error('请上传外部文件!')
              //   return
              // }
              // let inAttachment = that.model.inAttachment
              // if (isNullOrEmpty(inAttachment)) {
              //   that.$message.error('请上传内部文件!')
              //   return
              // }
              // let otherAttachment = that.model.otherAttachment;
              // if(isNullOrEmpty(otherAttachment)){
              //   that.$message.error('请上传其他文件!')
              //   return;
              // }

              if (that.gData == null || that.gData.length == 0) {
                that.$message.error('请选择项目费用分类!')
                return
              }
              let budgetAmount = that.model.budgetAmount
              //判断 顶层分类预算 是否 超过项目预算
              that.checkCategory(that.gData)
              // if(Number(budgetAmount) < Number(totalAmount)){
              //   that.$message.error("费用分类预算不能大于项目预算");
              //   return;
              // }
              that.model.rateList = that.rateList;
              that.model.categoryList = that.gData;
              that.model.childList = that.childList;
              that.model.tab = that.tab;
              that.$confirm({
                content: `是否确认提交`,
                onOk: () => {
                  that.confirmLoading = true
                  httpAction(httpurl, that.model, method).then((res) => {
                    if (res.success) {
                      that.$message.success(res.message)
                      that.$emit('ok')
                    } else {
                      that.$message.warning(res.message)
                    }
                  }).finally(() => {
                    that.confirmLoading = false
                  })
                }
              })
            } else {
              that.$message.error('项目详情 - 基本信息检查必填项!')
            }
          })
        }
      }
    }
  }
}
</script>
<style>
.none-none-one {
  clear: both;
  margin-top: -38px;
}

.none-none-two {
  clear: both;
  margin-top: -38px;
}
</style>
<style lang="less" scoped>
.ant-row.ant-form-item {
  margin-bottom: 12px;
}

.tree-data {

  .custom-item {
    display: flex;
    align-items: center;
  }

  .tree-title {
    width: 160px;
    white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
  }
}
</style>