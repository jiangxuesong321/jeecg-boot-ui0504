<template>
	<a-spin :spinning="confirmLoading" >
		<j-form-container>
			<!-- 主表单区域 -->
			<a-form-model ref="form"  :model="model" :rules="validatorRules" slot="detail">
				<img class="pass-img" v-if="model.reqStatus == '2' && formDisabled" src="../../../assets/images/pass.png" />
				  <a-tag color="red" style="line-height: 30px;padding: 5px 10px;font-size: 14px;"v-if="model.reqStatus == '3' && formDisabled">
					  {{model.updateUser_dictText}}意见：<span>{{model.approveComment}}</span>
				  </a-tag>
        <a-card class="card" title="基本信息" :bordered="false">
          <a-row>
            <a-col :span="8">
              <a-form-model-item label="项目编号" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="projectId">
                <j-select-project-by-catalog v-model="model.projectId" :value="model.projectId"
                                             :param="{auther:$store.getters.userInfo.relTenantIds,auth:'subject'}"
                                             placeholder="请输入项目" :multi="false" @change="toBack" text="projCode" :disabled="formDisabled"></j-select-project-by-catalog>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="项目名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                <a-input v-model="model.projectName" placeholder="请输入项目名称" disabled></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="立项时间" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                <a-input v-model="model.projInitiationDate" placeholder="请输入立项时间" disabled></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="立项人" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                <j-select-user-by-dep v-model="model.projectUser" :multi="false" disabled></j-select-user-by-dep>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="立项部门" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
<!--                <a-input v-model="model.projectOrg" placeholder="请输入立项部门" disabled></a-input>-->
                <j-dict-select-tag v-model="model.projectOrg" placeholder="请输入立项部门"
                                   dictCode="sys_depart,depart_name,id" disabled />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="费用分类" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" required>
                <a-tree-select
                  tree-default-expand-all
                  @select="onSelect"
                  :allowClear="false"
                  style="width: 100%"
                  :disabled="disabled"
                  :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                  v-model="model.categoryId"
                  :treeData="treeData"
                  :multiple="multiple">
                </a-tree-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="预算金额(元)" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                <a-input-number v-model="model.budgetAmount" placeholder="请输入预算金额" disabled style="width: 100%"
                                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\$\s?|(,*)/g, '')"></a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="使用金额(元)" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                <a-input-number v-model="model.usedAmount" placeholder="请输入使用金额" style="width: 100%" disabled
                                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\$\s?|(,*)/g, '')"></a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="剩余金额(元)" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                <a-input-number v-model="model.remainAmount" placeholder="请输入剩余金额" disabled style="width: 100%"
                                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\$\s?|(,*)/g, '')"></a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="采购标题" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="reqTitle">
                <a-input v-model="model.reqTitle" placeholder="请输入采购标题" :disabled="formDisabled"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="申请人" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="applyUserId">
                <j-select-user-by-dep v-model="model.applyUserId" :multi="false" @change="backUser" :disabled="formDisabled"></j-select-user-by-dep>
              </a-form-model-item>
            </a-col>

            <a-col :span="8">
              <a-form-model-item label="申请人部门" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="reqOrgName">
                <j-dict-select-tag v-model="model.reqOrgId" placeholder="请输入申请人部门" dictCode="sys_depart,depart_name,id" disabled/>
              </a-form-model-item>
            </a-col>

          </a-row>
        </a-card>
				<!-- 子表单区域 -->
        <a-card class="card" title="寻源清单" :bordered="false" v-if="model.reqType == '0'">
          <a-button type="primary" :disabled="formDisabled" style="float: right;overflow: hidden;margin-bottom: 10px;z-index: 99999" @click="openDialog">添加设备</a-button>
          <a-table
            ref="table"
            size="middle"
            bordered
            :scroll="{x:1200,y:500}"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="false">
            <template slot="buyerId" slot-scope="text,record">
              <j-dict-select-tag placeholder="请选择采购员" v-model="record.buyerId" dictCode="sys_user,realname,username,status = '1'"
                                 :getPopupContainer='getPopupContainer' :disabled="ptype == 'hasdo'"/>
            </template>

            <template slot="speType" slot-scope="text,record,index">
              <a-input v-model="record.speType" :disabled="formDisabled" @change="setVal"></a-input>
            </template>
            <template slot="brandName" slot-scope="text,record,index">
              <a-input v-model="record.brandName" :disabled="formDisabled" @change="setVal"></a-input>
            </template>

            <template slot="singleCapacity" slot-scope="text,record,index">
              <a-input-number v-model="record.singleCapacity" :disabled="formDisabled"></a-input-number>
            </template>
            <template slot="capacity" slot-scope="text,record,index">
              <a-input v-model="record.capacity" :disabled="formDisabled"></a-input>
            </template>
            <template slot="qty" slot-scope="text,record,index">
              <a-input-number v-model="record.qty" style="width: 100%" @change="setAmount(record)" :max="record.maxQty" :disabled="formDisabled"></a-input-number>
            </template>
            <template slot="leadTime" slot-scope="text,record,index">
              <a-date-picker v-model="record.leadTime" style="width: 100%" :disabled="formDisabled"/>
            </template>
            <template slot="orgId" slot-scope="text,record,index">
              <j-select-depart v-model="record.orgId" :multi="false" :disabled="formDisabled"></j-select-depart>
            </template>

            <template slot="action" slot-scope="text,record,index">
              <a @click="delRow(index)" :disabled="formDisabled">删除</a>
            </template>
          </a-table>
        </a-card>
        <a-card class="card" title="明细项" :bordered="false" v-if="model.reqType == '1'">
          <a-button type="primary" :disabled="formDisabled" style="float: right;overflow: hidden;margin-bottom: 10px;z-index: 99999" @click="addRow">添加行</a-button>
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="prodId"
            :scroll="{x:1000,y:500}"
            :columns="columns1"
            :dataSource="dataSource"
            :pagination="false">

            <template slot="unitId" slot-scope="text,record">
              <j-dict-select-tag placeholder="请选择单位名称" v-model="record.unitId" dictCode="unit" :disabled="formDisabled" :getPopupContainer="getParentContainer"/>
            </template>

            <template slot="prodName" slot-scope="text,record,index">
              <a-input v-model="record.prodName" :maxLength="200" :disabled="formDisabled"></a-input>
            </template>
            <template slot="qty" slot-scope="text,record,index">
              <a-input-number v-model="record.qty" @change="setAmount(record)" style="width: 100%" :disabled="formDisabled"></a-input-number>
            </template>
            <template slot="orderPrice" slot-scope="text,record,index">
              <a-input-number v-model="record.orderPrice" @change="setAmount(record)" style="width: 100%" :disabled="formDisabled"></a-input-number>
            </template>
            <template slot="orderAmount" slot-scope="text,record,index">
              <a-input-number v-model="record.orderAmount" disabled style="width: 100%" :disabled="formDisabled"></a-input-number>
            </template>

            <template slot="leadTime" slot-scope="text,record,index">
              <a-date-picker v-model="record.leadTime" style="width: 100%" :disabled="formDisabled"/>
            </template>
            <template slot="orgId" slot-scope="text,record,index">
              <j-select-depart v-model="record.orgId" :multi="false" :disabled="formDisabled"></j-select-depart>
            </template>

            <template slot="action" slot-scope="text,record,index">
              <a @click="delRow(index)" :disabled="formDisabled">删除</a>
            </template>

          </a-table>
        </a-card>
        <a-card class="card" title="需求附件" :bordered="false">
          <a-row>
            <a-col :span="24">
              <a-button type="primary" style="float: right;z-index: 999;margin-top: -55px;" size="small"
                        @click="changeFileName(model.id,model.otherAttachment,'other_attachment','otherAttachment')" v-if="model.otherAttachment != null">修改文件名</a-button>
              <a-form-item label="需求附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
                <j-upload v-model="model.otherAttachment" :trigger-change="true" :disabled="formDisabled"></j-upload>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card class="card" title="规格配置附件" :bordered="false">
          <a-row>
            <a-col :span="24">
              <a-button type="primary" style="float: right;z-index: 999;margin-top: -55px;" size="small"
                        @click="changeFileName(model.id,model.attachment,'attachment','attachment')" v-if="model.attachment != null">修改文件名</a-button>
              <a-form-item label="规格配置附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
                <j-upload v-model="model.attachment" :trigger-change="true" :disabled="formDisabled"></j-upload>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card class="card" title="规格配置说明" :bordered="false">
          <a-row>
            <a-col :span="24">
              <a-form-item label="规格配置说明" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
                <a-input v-model="model.comment" placeholder="规格配置说明" :rows="3" type='textarea' :disabled="formDisabled">
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card class="card" title="审批" :bordered="false" v-if="ptype == 'approve'">
<!--          <a-row>-->
<!--            <a-col :span="12">-->
<!--              <a-form-item label="分配采购" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">-->
<!--                <a-select v-model="model.buyerId" placeholder="请选择分配采购" style="width: 64%">-->
<!--                  <a-select-option-->
<!--                    v-for="item in userList"-->
<!--                    :key="item.username"-->
<!--                    :value="item.username">-->
<!--                    {{ item.realname }}-->
<!--                  </a-select-option>-->
<!--                </a-select>-->
<!--              </a-form-item>-->
<!--            </a-col>-->
<!--          </a-row>-->
          <a-row>
            <a-col :span="12">
              <a-form-item label="审核理由" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
                <a-input v-model="model.approveComment" placeholder="请输入审核理由" :rows="3" type='textarea' style="width: 64%"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

			</a-form-model>
		</j-form-container>

    <a-drawer
      title="设备列表"
      width=90%
      placement="right"
      :closable="false"
      @close="handleCancel"
      destroyOnClose
      :visible="visible">
      <bas-eqp-list ref="eqpList" @back="back" ptype="req" :projId="model.projectId" :reqId="model.id" :categoryId="model.categoryId"></bas-eqp-list>
      <div style="text-align: center;margin-top: 10px">
        <a-button key="cancel" @click="handleCancel" style="margin-left:10px;"  type="primary" ghost>取消</a-button>
      </div>
    </a-drawer>
    <change-file-name ref="cfn" @back="toSetUrl"></change-file-name>
	</a-spin>
</template>

<script>
import { httpAction,getAction,postAction } from '@/api/manage'
import { JVxeTableModelMixin } from '@/mixins/JVxeTableModelMixin.js'
import { isNotNullOrEmpty, isNullOrEmpty,preciseNum } from '@/utils/util'
import JFormContainer from '@/components/jeecg/JFormContainer'
import JSelectProject from '@/components/jeecgbiz/JSelectProject'
import JSelectProjectByCatalog from '@/components/jeecgbiz/JSelectProjectByCatalog'
import { billListMixin } from '../../mixins/billListMixin'
import { billModalMixin } from '../../mixins/billModalMixin'
import BasEqpList from '@views/project/modules/BasEqpList'
import ChangeFileName from '@comp/jeecgbiz/ChangeFileName'
export default {
		name: 'PurchaseRequestMainForm',
		mixins: [JVxeTableModelMixin, billListMixin, billModalMixin],
		components: {
			JFormContainer,
			JSelectProject,
			JSelectProjectByCatalog,
      BasEqpList,
      ChangeFileName
		},
		data() {
			return {
        param:{},
        multiple:false,
        treeData:[],
        userList:[],
        visible:false,
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
            title: '物料标识',
            dataIndex: 'prodCode',
            align:"center",
            width:140,
          },
          {
            title: '物料名称',
            dataIndex: 'prodName',
            width:180,
            align:"center",
            ellipsis:true,
          },
          {
            title: '意向品牌',
            dataIndex: 'brandName',
            width:200,
            align:"center",
            scopedSlots: { customRender: 'brandName' },
          },
          {
            title: '意向型号',
            dataIndex: 'speType',
            width:200,
            align:"center",
            scopedSlots: { customRender: 'speType' },
          },
          {
            title: '物料类型',
            dataIndex: 'model_dictText',
            width:120,
            align:"center",
          },
          {
            title: '计量单位',
            dataIndex: 'unitId_dictText',
            width:120,
            align:"center",
          },
          {
            title: '采购数量',
            dataIndex: 'qty',
            width:120,
            align:"center",
            scopedSlots: { customRender: 'qty' },
          },
          {
            title: '意向交期',
            dataIndex: 'leadTime',
            width:180,
            align:"center",
            scopedSlots: { customRender: 'leadTime' },
          },
          {
            title: '使用部门',
            dataIndex: 'orgId',
            width:180,
            align:"center",
            scopedSlots: { customRender: 'orgId' },
          },
          {
            title: '采购员',
            dataIndex: 'buyerId',
            width:120,
            align:"center",
            scopedSlots: { customRender: 'buyerId' },
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
            title: '名称',
            dataIndex: 'prodName',
            width:200,
            align:"center",
            scopedSlots: { customRender: 'prodName' },
            ellipsis:true,
          },
          {
            title: '数量',
            dataIndex: 'qty',
            width:120,
            align:"center",
            scopedSlots: { customRender: 'qty' },
          },
          {
            title: '单位',
            dataIndex: 'unitId',
            width:120,
            align:"center",
            scopedSlots: { customRender: 'unitId' },
          },
          {
            title: '单价',
            dataIndex: 'orderPrice',
            width:120,
            align:"center",
            scopedSlots: { customRender: 'orderPrice' },
          },
          {
            title: '金额',
            dataIndex: 'orderAmount',
            width:120,
            align:"center",
            scopedSlots: { customRender: 'orderAmount' },
          },
          {
            title: '意向交期',
            dataIndex: 'leadTime',
            width:180,
            align:"center",
            scopedSlots: { customRender: 'leadTime' },
          },
          {
            title: '使用部门',
            dataIndex: 'orgId',
            width:180,
            align:"center",
            scopedSlots: { customRender: 'orgId' },
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:100,
            scopedSlots: { customRender: 'action' },
          }
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
          categoryId:'',
          reqCategory:'0',
        },

				validatorRules: {
          categoryId:[
            {required: true,message: '请选择费用分类!'},
          ],
          projectId: [
            {required: true,message: '请选择项目!'},
          ],
          usedAmount:[
            {required: true,message: '请输入使用金额!'},
          ],
          reqTitle:[
            {required: true,message: '请输入采购标题!'},
          ],
          reqType:[
            {required: true,message: '请选择采购类型!'},
          ],
          applyUserId:[
            {required: true,message: '请选择申请人!'},
          ],
				},
				url: {
					add: "/srm/purchaseRequestMain/add",
					edit: "/srm/purchaseRequestMain/edit",
					queryById: "/srm/purchaseRequestMain/queryById",
					purchaseRequestDetail: {
						list: '/srm/purchaseRequestMain/queryPurchaseRequestDetailByMainId'
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
      ptype : {
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
		created() {

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
        if(that.ptype == 'hasdo'){
          that.param.table = "purchase_request_main_approve";
        }else{
          that.param.table = "purchase_request_main";
        }
        that.$refs.cfn.initData(that.param);
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
      onSelect(value,node){
        let record = node.dataRef;
        if(record.isEqp == '1'){
          this.model.reqType = '0'
        }else{
          this.model.reqType = '1'
        }
        //该分类最大预算
        // this.model.maxBudgetAmount = record.budgetAmount;
        this.model.budgetAmount = record.budgetAmount;
        this.model.usedAmount = 0;
        this.model.remainAmount = 0;
        //获取该分类最大可用值
        this.fetchMaxAmount(value,record.budgetAmount);
        this.$forceUpdate();
      },
      fetchMaxAmount(categoryId,budgetAmount){
        let url = "/srm/purchaseRequestMain/fetchMaxAmount";
        getAction(url,{categoryId:categoryId,id:this.model.id}).then(res => {
          if(res.result != null){
            let orderTotalAmountTax = res.result.orderTotalAmountTax;
            this.model.maxBudgetAmount = Number(preciseNum(Number(budgetAmount) - Number(orderTotalAmountTax),2));

            this.model.usedAmount = orderTotalAmountTax;
          }else{
            this.model.maxBudgetAmount = Number(budgetAmount);
            this.model.usedAmount = 0;
          }
          this.model.remainAmount = this.model.maxBudgetAmount;
          this.$forceUpdate();
        })
      },
      submitAgree(){
        let that = this;
        //let buyerId = that.model.buyerId;
        // if(isNullOrEmpty(buyerId)){
        //   that.$message.error("请选择采购员");
        //   return false
        // }
        let dataSource = that.dataSource;
        for(let i = 0; i < dataSource.length; i++){
          if(isNullOrEmpty(dataSource[i].buyerId)){
            that.$message.error("第"+(i+1) + "行,请选择采购员");
            return;
          }
        }
        that.model.detailList = dataSource;
        that.$confirm({
          content: `是否确认提交?`,
          onOk: () => {
            let url = "/srm/purchaseRequestMain/toAgree";
            postAction(url,that.model).then(res => {
              that.$message.success("提交成功");
              that.$emit('ok');
            })
          }
        })
      },
      submitReject(){
        let that = this;
        let approveComment = that.model.approveComment;
        if(isNullOrEmpty(approveComment)){
          that.$message.error("请输入审核理由");
          return false
        }
        that.$confirm({
          content: `是否确认提交?`,
          onOk: () => {
            let url = "/srm/purchaseRequestMain/toReject";
            postAction(url,that.model).then(res => {
              that.$message.success("提交成功");
              that.$emit('ok');
            })
          }
        })
      },
		  initBuyerList(){
		    let url = "/sys/user/getUserByRoleCode";
        getAction(url,{roleCode:"buyer",subject:this.model.subject}).then(res => {
          this.userList = res.result;
        })
      },
      setAmount(record){
        let qty = record.qty;
        let orderPrice = record.orderPrice;
        record.orderAmount = 0;
        if(isNotNullOrEmpty(qty) && isNotNullOrEmpty(orderPrice)){
          let orderAmount = preciseNum(Number(qty) * Number(orderPrice),2);
          record.orderPriceTax = Number(record.orderPrice);
          record.orderAmount = Number(orderAmount);
          record.orderAmountTax = Number(orderAmount);
          this.$forceUpdate()
        }
        this.setUsedAmount();
      },
      delRow(index){
        this.dataSource.splice(index,1);
      },
      clearData(){
        this.dataSource = [];
      },
      back(selectionRows){
        let dataSource = this.dataSource;
        if(dataSource == null || dataSource.length == 0){
          dataSource = [];
        }
        for(let i = 0; i < selectionRows.length; i++){
          let row = selectionRows[i];
          let flag = false;
          dataSource.filter(item => {
            if(row.materialId == item.materialId || row.materialId == item.prodId){
              flag = true;
              return;
            }
          })
          if(!flag){
            let budgetAmount = Number(preciseNum(Number(row.budgetPrice) * Number(row.maxQty),2));
            row.prodCode = row.code;
            row.prodName = row.name;
            row.orderPrice = row.budgetPrice;
            row.orderAmount = budgetAmount;
            row.orderPriceTax = row.budgetPrice;
            row.orderAmountTax = budgetAmount;
            row.speType = '';
            row.brandName = '';
            row.prodId = row.id;
            row.qty = row.qty - row.hasReqQty;
            row.id = null;
            dataSource.push(row);
          }
        }
        this.dataSource = dataSource;
        this.$message.success("添加成功");
        setTimeout(() => {
          this.setUsedAmount();
        }, 400)
      },
      submitDraft(){
        const that = this;
        let httpurl = '';
        let method = '';
        httpurl += "/srm/purchaseRequestMain/draft";
        method = 'post';

        let dataSource = this.dataSource;
        let budgetAmount = 0;
        for(let i = 0 ;i < dataSource.length; i++){
          if(isNotNullOrEmpty(dataSource[i].orderAmount)){
            budgetAmount = preciseNum(Number(budgetAmount) + Number(dataSource[i].orderAmount),2);
          }
        }
        that.model.reqCategory ='0';
        that.model.purchaseRequestDetailList = dataSource;
        that.$confirm({
          content: `是否确认提交?`,
          onOk: () => {
            that.confirmLoading = true;
            httpAction(httpurl, that.model, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
        })
      },
      submitForm() {
        const that = this;
        // 触发表单验证
        that.$refs.form.validate(valid => {
          if (valid) {
            let httpurl = '';
            let method = '';
            if (!that.model.id) {
              httpurl += that.url.add;
              method = 'post';
            } else {
              httpurl += that.url.edit;
              method = 'put';
            }

            let dataSource = that.dataSource;

            if(dataSource == null || dataSource.length == 0){
              that.$message.error("请选择明细");
              return false;
            }
            let budgetAmount = 0;
            for(let i = 0 ;i < dataSource.length; i++){
              if(isNullOrEmpty(dataSource[i].prodName)){
                that.$message.error("第" + (i+1) + "行,请输入名称");
                return false;
              }
              if(isNullOrEmpty(dataSource[i].qty)){
                that.$message.error("第" + (i+1) + "行,请输入数量");
                return false;
              }
              if(isNullOrEmpty(dataSource[i].orderPrice)){
                that.$message.error("第" + (i+1) + "行,请输入单价");
                return false;
              }
              // if(that.model.reqType == '0' && isNullOrEmpty(dataSource[i].singleCapacity)){
              //   that.$message.error("第" + (i+1) + "行,请输入单台产能");
              //   return false;
              // }

             // budgetAmount = preciseNum(Number(budgetAmount) + Number(dataSource[i].orderAmount),2);
            }
            //比较各个预算金额
            // if(that.model.reqType == '1' && Number(budgetAmount) > that.model.maxBudgetAmount){
            //   that.$message.error("需求金额大于原项目分类金额");
            //   return false;
            // }

            that.model.reqCategory ='0';
            that.model.purchaseRequestDetailList = dataSource;
            console.log(dataSource);
            that.$confirm({
              content: `是否确认提交?`,
              onOk: () => {
                that.confirmLoading = true;
                httpAction(httpurl, that.model, method).then((res) => {
                  if (res.success) {
                    that.$message.success(res.message);
                    that.$emit('ok');
                  } else {
                    that.$message.warning(res.message);
                  }
                }).finally(() => {
                  that.confirmLoading = false;
                })
              }
            })
          }

        })
      },
      toBack(ids,rows){
        let row = rows[0];
        this.model.projectName = row.projName;
        this.model.projInitiationDate = row.projInitiationDate;
        this.model.projectUser = row.applyUserId;
        this.model.projectOrg = row.applyOrgId;
        // this.model.budgetAmount = row.budgetAmount;
        // this.model.usedAmount = row.freezeAmount;
        // this.model.fixedUsedAmount = row.freezeAmount;
        // this.model.remainAmount = row.remainAmount;
        this.$forceUpdate();
        this.dataSource = [];
        // this.getProjById(row.id);

        this.model.reqType = '';
        this.model.categoryId = '';

        //加载分类树
        this.fetchCategory(this.model.projectId);
      },
      fetchCategory(projectId){
        this.treeData = [];
        let url = "/srm/projBase/fetchLastCategory";
        let param = {
          projectId:projectId,
          disabled:true,
        }
        getAction(url,param).then(res => {
          this.treeData = res.result;
        })
      },
      backUser(ids,rows){
        this.model.applyUserId = ids;
        this.model.reqOrgId = rows[0].departIds;
        this.$forceUpdate();
      },
      add() {
        this.edit(this.modelDefault);
      },
      hasdo(record) {
        this.dataSource = [];
        this.model = Object.assign({}, record);
        if(this.model.id){
          this.getProjById(this.model.projectId);
          this.getApproveDetailList(this.model.id);
          //加载分类树
          this.fetchCategory(this.model.projectId);
          //加载分类金额
          if(isNotNullOrEmpty(this.model.categoryId)){
            this.fetchCategoryById(this.model.categoryId);
          }
          this.initBuyerList();
        }
      },
      getApproveDetailList(id){
        let url = "/srm/purchaseRequestMainApprove/queryPurchaseRequestDetailByMainId";
        getAction(url,{id:id}).then(res => {
          this.dataSource = res;
        })
      },
      edit(record) {
        this.dataSource = [];
        this.model = Object.assign({}, record);
        if(this.ptype == 'approve' || this.ptype == 'hasdo' || this.ptype == 'pur'){
          this.columns = [
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
              title: '物料标识',
              dataIndex: 'prodCode',
              align:"center",
              width:140,
            },
            {
              title: '物料名称',
              dataIndex: 'prodName',
              width:180,
              align:"center",
              ellipsis:true,
            },
            {
              title: '意向品牌',
              dataIndex: 'brandName',
              width:200,
              align:"center",
              scopedSlots: { customRender: 'brandName' },
            },
            {
              title: '意向型号',
              dataIndex: 'speType',
              width:200,
              align:"center",
              scopedSlots: { customRender: 'speType' },
            },
            {
              title: '物料类型',
              dataIndex: 'model_dictText',
              width:120,
              align:"center",
            },
            {
              title: '计量单位',
              dataIndex: 'unitId_dictText',
              width:120,
              align:"center",
            },
            {
              title: '采购数量',
              dataIndex: 'qty',
              width:120,
              align:"center",
              scopedSlots: { customRender: 'qty' },
            },
            {
              title: '意向交期',
              dataIndex: 'leadTime',
              width:180,
              align:"center",
              scopedSlots: { customRender: 'leadTime' },
            },
            {
              title: '使用部门',
              dataIndex: 'orgId',
              width:180,
              align:"center",
              scopedSlots: { customRender: 'orgId' },
            },
            {
              title: '采购员',
              dataIndex: 'buyerId',
              width:120,
              align:"center",
              scopedSlots: { customRender: 'buyerId' },
            },
            {
              title: '操作',
              dataIndex: 'action',
              align:"center",
              width:100,
              scopedSlots: { customRender: 'action' },
            }
          ];
        }else{
          this.columns = [
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
              title: '物料标识',
              dataIndex: 'prodCode',
              align:"center",
              width:140,
            },
            {
              title: '物料名称',
              dataIndex: 'prodName',
              width:180,
              align:"center",
              ellipsis:true,
            },
            {
              title: '意向品牌',
              dataIndex: 'brandName',
              width:200,
              align:"center",
              scopedSlots: { customRender: 'brandName' },
            },
            {
              title: '意向型号',
              dataIndex: 'speType',
              width:200,
              align:"center",
              scopedSlots: { customRender: 'speType' },
            },
            {
              title: '物料类型',
              dataIndex: 'model_dictText',
              width:120,
              align:"center",
            },
            {
              title: '计量单位',
              dataIndex: 'unitId_dictText',
              width:120,
              align:"center",
            },
            {
              title: '采购数量',
              dataIndex: 'qty',
              width:120,
              align:"center",
              scopedSlots: { customRender: 'qty' },
            },
            {
              title: '意向交期',
              dataIndex: 'leadTime',
              width:180,
              align:"center",
              scopedSlots: { customRender: 'leadTime' },
            },
            {
              title: '使用部门',
              dataIndex: 'orgId',
              width:180,
              align:"center",
              scopedSlots: { customRender: 'orgId' },
            },
            {
              title: '操作',
              dataIndex: 'action',
              align:"center",
              width:100,
              scopedSlots: { customRender: 'action' },
            }
          ];
        }
        if(this.model.id){
          this.getProjById(this.model.projectId);
          this.getDetailList(this.model.id);
          //加载分类树
          this.fetchCategory(this.model.projectId);
          //加载分类金额
          if(isNotNullOrEmpty(this.model.categoryId)){
            this.fetchCategoryById(this.model.categoryId);
          }
        }else{
          this.model.applyUserId = this.$store.getters.userInfo.username;
          this.model.reqOrgId = this.$store.getters.userInfo.departIds;
        }
        this.initBuyerList();
      },
      fetchCategoryById(categoryId){
        let url = "/srm/projBase/fetchCategoryById";
        getAction(url,{id:categoryId}).then(res => {
          let data = res.result;
          if(data != null){
            let budgetAmount = data.budgetAmount;
            this.model.budgetAmount = budgetAmount;
            this.fetchMaxAmount(this.model.categoryId,budgetAmount);
          }
        })
      },
      getProjById(projId){
        let url = "/srm/projBase/queryById";
        getAction(url,{id:projId}).then(res => {
          let row = res.result;
          this.model.projectName = row.projName;
          this.model.projInitiationDate = row.projInitiationDate;
          this.model.projectUser = row.applyUserId;
          this.model.projectOrg = row.applyOrgName;
          // this.model.budgetAmount = row.budgetAmount;
          // this.model.usedAmount = row.usedAmount;
          // this.model.fixedUsedAmount = row.usedAmount;
          // this.model.remainAmount = row.remainAmount;
          this.$forceUpdate();
        })
      },
      getDetailList(id){
        let url = "/srm/purchaseRequestMain/queryPurchaseRequestDetailByMainId";
        getAction(url,{id:id}).then(res => {
          this.dataSource = res;
        })
      },
      addRow(){
        if(isNullOrEmpty(this.model.projectId)){
          this.$message.error("请先选择项目");
          return false
        }
        if(this.dataSource == null){
          this.dataSource = [];
        }
        let row = {
          prodName:'',
          qty:'',
          orderPrice:0,
          orderAmount:0,
          orderPriceTax:0,
          orderAmountTax:0,
        }
        this.dataSource.push(row);
        //计算已用金额
        this.setUsedAmount();
      },
      setUsedAmount(){
        let usedAmount = isNullOrEmpty(this.model.fixedUsedAmount) ? 0 : this.model.fixedUsedAmount;
        let reqAmount = isNullOrEmpty(this.model.orderTotalAmountTax) ? 0 : this.model.orderTotalAmountTax;
        let budgetAmount = 0;
        this.dataSource.filter(item => {
          if(isNotNullOrEmpty(item.orderAmountTax)){
            budgetAmount = Number(budgetAmount) + Number(item.orderAmountTax);
          }
        })
        budgetAmount = Number(preciseNum(budgetAmount,2));
        usedAmount = Number(preciseNum(Number(usedAmount) + Number(budgetAmount) - Number(reqAmount),2));
        this.model.usedAmount = usedAmount;
        this.model.remainAmount = Number(this.model.budgetAmount) - Number(usedAmount);
      },
      openDialog(){
        if(isNullOrEmpty(this.model.projectId)){
          this.$message.error("请先选择项目");
          return false
        }
        if(isNullOrEmpty(this.model.categoryId)){
          this.$message.error("请先选择费用类型");
          return false
        }
        this.visible = true;
        setTimeout(()=>{
          this.$refs.eqpList.initDataTwo();
        },300)
      },


		}
	}
</script>

<style lang="less" scoped>
  .ant-row.ant-form-item {
    margin-bottom: 12px;
  }
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
	.nopass-div{
		position: absolute;
		z-index: 99;
		right: 0px;
		top: -60px;
		width: 100px;
		height: 100px;
		border: 1px red solid;
		padding: 10px;
		background: #fff;
		border-radius: 50%;
		text-align: center;
	}
	.nopass-div .title{
		font-size: 15px;
		font-weight: bold;
		color: red;
		padding-top: 5px;
		padding-bottom: 5px;
	}
	.nopass-div .content{
		font-size: 13px;
		color: red;
		display: -webkit-box;
		 -webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
</style>