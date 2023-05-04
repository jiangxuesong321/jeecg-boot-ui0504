<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container>
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-card class="card" title="基本信息" :bordered="false" style="margin-top: 15px;">
          <a-row>
            <a-col :span="8">
              <a-form-model-item label="询价单号" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                <a-input v-model="model.inquiryCode" placeholder="自动生成" disabled></a-input>
              </a-form-model-item>
            </a-col>

            <a-col :span="8">
              <a-form-model-item label="询报价名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                 prop="inquiryName">
                <a-input v-model="model.inquiryName" placeholder="询报价名称" :disabled="formDisabled"></a-input>
              </a-form-model-item>
            </a-col>

            <a-col :span="8">
              <a-form-model-item label="邀请方式" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                 prop="invitationMethod">
                <j-dict-select-tag placeholder="请输入邀请方式" v-model="model.invitationMethod" dictCode="invitation_method" :disabled="formDisabled"/>
              </a-form-model-item>
            </a-col>

            <!--            <a-col :span="8">-->
            <!--              <a-form-model-item label="采购员" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"-->
            <!--                                 prop="inquirer">-->
            <!--                <j-dict-select-tag v-model="model.inquirer" placeholder="请输入采购员" dictCode="sys_user,realname,username" @change="getPhone" disabled/>-->
            <!--              </a-form-model-item>-->
            <!--            </a-col>-->

            <!--            <a-col :span="8">-->
            <!--              <a-form-model-item label="联系电话" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"-->
            <!--                                 prop="inquirerTel">-->
            <!--                <a-input v-model="model.inquirerTel" placeholder="请输入联系电话" :disabled="formDisabled" @change="setVal"></a-input>-->
            <!--              </a-form-model-item>-->
            <!--            </a-col>-->

            <!--            <a-col :span="8">-->
            <!--              <a-form-model-item label="币种" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">-->
            <!--                <j-dict-select-tag placeholder="请输入币种" v-model="model.currency" dictCode="currency_type" :disabled="formDisabled"/>-->
            <!--              </a-form-model-item>-->
            <!--            </a-col>-->

            <a-col :span="8">
              <a-form-model-item label="报价截止日期" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                 prop="quotationDeadline">
                <j-date placeholder="请选择报价截止日期" v-model="model.quotationDeadline" style="width: 100%"/>
              </a-form-model-item>
            </a-col>

            <!--            <a-col :span="8">-->
            <!--              <a-form-model-item label="中标公告" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"-->
            <!--                                 prop="isNotice">-->
            <!--                <a-radio-group v-model="model.isNotice" name="isNotice" @change="setVal" :disabled="formDisabled">-->
            <!--                  <a-radio value="1">自动发布</a-radio>-->
            <!--                  <a-radio value="0">手动发布</a-radio>-->
            <!--                </a-radio-group>-->
            <!--              </a-form-model-item>-->
            <!--            </a-col>-->

            <a-col :span="8">
              <a-form-model-item label="是否单一供应商" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                 prop="isOne">
                <j-dict-select-tag placeholder="是否单一供应商" v-model="model.isOne" dictCode="is_one" :disabled="formDisabled" @change="clearAttachment" :style="model.isOne == '1' ? 'width:80%' : 'width:100%'"/>
                <a @click="openDrawer" :disabled="formDisabled" v-if="model.isOne == '1'">选择供应商</a>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="盲标" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="isMangbiao">
                <a-radio-group v-model="model.isMangbiao" name="isMangbiao" :disabled="formDisabled" >
                  <a-radio value="1">是</a-radio>
                  <a-radio value="0">否</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row v-if="model.isOne == '1'">
            <a-col :span="8" >
              <a-form-model-item label="单一供应商说明" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="otherComment">
                <a-input type="textarea" v-model="model.otherComment" placeholder="单一供应商说明" :disabled="formDisabled"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row v-if="model.isOne == '1'">
            <a-col :span="8" >
              <a-form-model-item label="单一供应商附件" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="otherAttachment">
                <j-upload v-model="model.otherAttachment" :trigger-change="true" :disabled="formDisabled"></j-upload>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card class="card" title="询价明细" :bordered="false" style="margin-top: 15px;">
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            class="j-table-force-nowrap"
            :scroll="{x:true}"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="false"
          >
            <template slot="action" slot-scope="text,record">
              <a @click="openDrawer(record)" :disabled="formDisabled" v-if="model.isOne == '0'">选择供应商</a>
            </template>

            <template slot="qty" slot-scope="text,record">
              <a-input-number v-model="record.qty" :disabled="formDisabled" :max="record.maxQty - record.purcQty">></a-input-number>
            </template>

            <template slot="suppIds" slot-scope="text,record">
              <div v-if="record.suppIds != null && record.suppIds != '' && record.suppIds != undefined">
                <div v-for="(item,idx) in record.suppNames">
                  <a-tag color="#2db7f5">{{item}}<a-icon type="close" @click="delChild(record,idx)" v-if="!formDisabled"/></a-tag>
                </div>
              </div>
            </template>

            <template slot="leadTime" slot-scope="text,record">
              <a-date-picker v-model="record.leadTime" style="width: 100%" :disabled="formDisabled"/>
            </template>
          </a-table>
          <!--          <a-table-->
          <!--            v-if="model.reqType != '0'"-->
          <!--            ref="table"-->
          <!--            size="middle"-->
          <!--            bordered-->
          <!--            rowKey="id"-->
          <!--            class="j-table-force-nowrap"-->
          <!--            :scroll="{x:true}"-->
          <!--            :columns="columns1"-->
          <!--            :dataSource="dataSource"-->
          <!--            :pagination="false"-->
          <!--          >-->
          <!--            <template slot="action" slot-scope="text,record">-->
          <!--              <a @click="openDrawer(record)" :disabled="formDisabled" v-if="model.isOne == '0'">选择供应商</a>-->
          <!--            </template>-->

          <!--            <template slot="qty" slot-scope="text,record">-->
          <!--              <a-input-number v-model="record.qty" :disabled="formDisabled" :max="record.maxQty - record.purcQty">></a-input-number>-->
          <!--            </template>-->

          <!--            <template slot="leadTime" slot-scope="text,record">-->
          <!--              <a-date-picker v-model="record.leadTime" style="width: 100%" :disabled="formDisabled"/>-->
          <!--            </template>-->

          <!--            <template slot="suppIds" slot-scope="text,record">-->
          <!--              <div v-if="record.suppIds != null && record.suppIds != '' && record.suppIds != undefined">-->
          <!--                <div v-for="(item,idx) in record.suppNames">-->
          <!--                  <a-tag color="#2db7f5">{{item}}<a-icon type="close" @click="delChild(record,idx)" v-if="!formDisabled"/></a-tag>-->
          <!--                </div>-->
          <!--              </div>-->
          <!--            </template>-->
          <!--          </a-table>-->
        </a-card>
        <a-card class="card" title="附件" :bordered="false" style="margin-top: 15px;">
          <a-row>
            <a-col :span="24">
              <a-button type="primary" style="float: left;z-index: 999;margin-top: -55px;margin-left: 90px;"
                        size="small" @click="changeFileName(model.id,model.attachment,'attachment','attachment')" v-if="model.attachment != null && model.attachment != ''">修改文件名</a-button>
              <a-form-item label="附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
                <j-upload v-model="model.attachment" :trigger-change="true" :disabled="formDisabled"></j-upload>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <!--        <a-card class="card" title="备注" :bordered="false" style="margin-top: 15px;">-->
        <!--          <a-row>-->
        <!--            <a-col :span="24">-->
        <!--              <a-form-item label="采购说明" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">-->
        <!--                <a-input v-model="model.remark" placeholder="请输入采购说明" :rows="3" type="textarea" :disabled="formDisabled">-->
        <!--                </a-input>-->
        <!--              </a-form-item>-->
        <!--            </a-col>-->
        <!--          </a-row>-->
        <!--          <a-row>-->
        <!--            <a-col :span="24">-->
        <!--              <a-form-item label="投标须知" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">-->
        <!--                <a-input v-model="model.comment" placeholder="请输入投标须知" :rows="3" type="textarea" :disabled="formDisabled">-->
        <!--                </a-input>-->
        <!--              </a-form-item>-->
        <!--            </a-col>-->
        <!--          </a-row>-->
        <!--        </a-card>-->
        <!--        <a-card class="card" title="需求附件" :bordered="false" style="margin-top: 15px;">-->
        <!--          <a-row>-->
        <!--            <a-col :span="24">-->
        <!--              <a-form-item label="需求附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">-->
        <!--                <j-upload v-model="model.purOtherAttachment" :trigger-change="true" :disabled="true">-->
        <!--                </j-upload>-->
        <!--              </a-form-item>-->
        <!--            </a-col>-->
        <!--          </a-row>-->
        <!--        </a-card>-->
        <!--        <a-card class="card" title="规格配置附件" :bordered="false" style="margin-top: 15px;">-->
        <!--          <a-row>-->
        <!--            <a-col :span="24">-->
        <!--              <a-form-item label="规格配置附件" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">-->
        <!--                <j-upload v-model="model.purAttachment" :trigger-change="true" :disabled="true">-->
        <!--                </j-upload>-->
        <!--              </a-form-item>-->
        <!--            </a-col>-->
        <!--          </a-row>-->
        <!--        </a-card>-->
        <!--        <a-card class="card" title="规格配置说明" :bordered="false" style="margin-top: 15px;">-->
        <!--          <a-row>-->
        <!--            <a-col :span="24">-->
        <!--              <a-form-item label="规格配置说明" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">-->
        <!--                <a-input v-model="model.comment" placeholder="" :rows="3" type='textarea' :disabled="true">-->
        <!--                </a-input>-->
        <!--              </a-form-item>-->
        <!--            </a-col>-->
        <!--          </a-row>-->
        <!--        </a-card>-->
      </a-form-model>
    </j-form-container>
    <j-select-supplier-modal ref="ruleModal" modalWidth="80%" :multi="true" @ok="back" :nowRow="nowRow"></j-select-supplier-modal>
    <change-file-name ref="cfn" @back="toSetUrl"></change-file-name>
  </a-spin>
</template>

<script>

import { getAction,httpAction } from '@/api/manage'
import { JVxeTableModelMixin } from '@/mixins/JVxeTableModelMixin.js'
import JFormContainer from '@/components/jeecg/JFormContainer'
import { billListMixin } from '../../mixins/billListMixin'
import { billModalMixin } from '../../mixins/billModalMixin'
import JSelectSupplierModal from '@comp/jeecgbiz/modal/JSelectSupplierModal'
import { isNotNullOrEmpty, isNullOrEmpty } from '@/utils/util'
import ChangeFileName from '@comp/jeecgbiz/ChangeFileName'
export default {
  name: 'InquiryListForm',
  mixins: [JVxeTableModelMixin, billListMixin, billModalMixin],
  components: {
    JFormContainer,
    JSelectSupplierModal,
    ChangeFileName
  },
  data() {
    return {
      param:{},
      nowRow:{},
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
        },

        {
          title: '采购申请数量',
          dataIndex: 'maxQty',
          width:120,
        },
        {
          title: '询价数量',
          dataIndex: 'qty',
          width:120,
          scopedSlots: { customRender: 'qty' },
        },
        {
          title: '已处理数量',
          dataIndex: 'purcQty',
          width:120,
        },
        {
          title: '交货日期',
          dataIndex: 'leadTime',
          scopedSlots: { customRender: 'leadTime' },
          width:120,
        },
        {
          title: '供应商名称',
          dataIndex: 'suppIds',
          width:120,
          scopedSlots: { customRender: 'suppIds' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 100,
          scopedSlots: {
            customRender: 'action'
          },
        }
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
          title: '购置设备名称',
          dataIndex: 'prodName',
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
          width:120,
        },
        {
          title: '采购申请数量',
          dataIndex: 'maxQty',
          width:120,
        },
        // {
        //   title: '模块规划产能(万片/月)',
        //   dataIndex: 'capacity',
        //   width:120,
        //   align:"center",
        // },
        // {
        //   title: '单台产能(万片/月)',
        //   dataIndex: 'singleCapacity',
        //   width:120,
        //   align:"center",
        // },
        {
          title: '询价数量',
          dataIndex: 'qty',
          width:120,
          scopedSlots: { customRender: 'qty' },
        },
        // {
        //   title: '合计产能(万片/月)',
        //   dataIndex: 'totalCapacity',
        //   width:120,
        //   align:"center",
        //   customRender:function (t,r,index) {
        //     if(isNotNullOrEmpty(r.qty) && isNotNullOrEmpty(r.singleCapacity)){
        //       return r.qty * r.singleCapacity;
        //     }else{
        //       return 0;
        //     }
        //   }
        // },
        {
          title: '已处理数量',
          dataIndex: 'purcQty',
          width:120,
        },
        {
          title: '计量单位',
          dataIndex: 'unitId_dictText',
          width:120,
        },
        {
          title: '交货日期',
          dataIndex: 'leadTime',
          width:120,
          scopedSlots: { customRender: 'leadTime' },
        },
        {
          title: '供应商名称',
          dataIndex: 'suppIds',
          width:120,
          scopedSlots: { customRender: 'suppIds' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 100,
          scopedSlots: {
            customRender: 'action'
          },
        }
      ],
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
        inquirer:'',
        inquirerTel:'',
        inquiryName:'',
        invitationMethod:'',
        currency:'',
        quotationDeadline:'',
        isNotice:'',
        isOne:''
      },
      validatorRules: {
        otherAttachment:[
          { required: true, message: '如果是单一供应商需要上传附件!' }
        ],
        otherComment:[
          { required: true, message: '如果是单一供应商请填写单一供应商说明!' }
        ],
        inquiryName: [
          { required: true, message: '请输入询报价名称!' }
        ],
        invitationMethod:[
          { required: true, message: '请选择邀请方式!' }
        ],
        inquirer:[
          { required: true, message: '请选择采购员!' }
        ],
        inquirerTel:[
          { required: true, message: '请输入联系方式!' }
        ],
        currency:[
          { required: true, message: '请选择币种!' }
        ],
        isOne:[
          { required: true, message: '请选择是否单一供应商!' }
        ],
        quotationDeadline:[
          { required: true, message: '请输入报价截止日期!' }
        ],
        isNotice:[
          { required: true, message: '请选择中标公告!' }
        ]
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
    clearAttachment(){
      let that = this;
      if(that.model.isOne == '1'){
        that.$message.warning("如果是单一供应商,则需要上传单一供应商附件和备注");
      }else if(that.model.isOne == '2'){
        let url = "/srm/basSupplier/fetchList";
        getAction(url,{}).then(res => {
          let dataSource = res.result;
          for(let i = 0; i < that.dataSource.length; i++){
            let suppIds = [];
            let suppNames = [];
            dataSource.filter(item => {
              suppIds.push(item.id);
              suppNames.push(item.name);
            })
            that.dataSource[i].suppIds = suppIds;
            that.dataSource[i].suppNames = suppNames;
            that.$forceUpdate();
          }
        })
      }
      that.model.otherAttachment == '';
      that.model.otherComment == '';
    },
    setVal(){
      this.$forceUpdate();
    },
    getPhone(){
      setTimeout(()=>{
        this.getUser(this.model.inquirer);
        this.$forceUpdate();
      },200)
    },
    toEdit(){
      let that = this;
      let quotationDeadline = that.model.quotationDeadline;
      if(isNullOrEmpty(quotationDeadline)){
        that.$message.warning("请输入报价截止日期");
        return;
      }
      let post = 'post';
      let url = "/srm/inquiryList/editEntity";
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
    handleOk(){
      const that = this
      // 触发表单验证
      that.$refs.form.validate(valid => {
        if (valid) {
          let post = "";
          let url = "";
          post = 'post';
          url = this.url.add;
          let dataSource = that.dataSource;
          if(dataSource == null || dataSource.length == 0){
            that.$message.warning("询价明细不能为空");
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
            if(dataSource[i].suppIds == null || dataSource[i].suppIds.length == 0){
              that.$message.warning("第" + (i+1) + "行,请选择供应商");
              return;
            }
            //如果 选择多家供应商,则判断最少两家
            if(that.model.isOne == '0' && dataSource[i].suppIds.length < 2){
              that.$message.warning("第" + (i+1) + "行,如果 选择多家供应商,则最少选择两家");
              return
            }
          }
          that.model.recordList = dataSource;
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
    delChild(item,index){
      if(this.model.isOne == '1'){
        for(let i = 0; i < this.dataSource.length; i++){
          this.dataSource[i].suppIds.splice(index,1);
          this.dataSource[i].suppNames.splice(index,1);
          this.$forceUpdate();
        }
      }else{
        item.suppIds.splice(index,1);
        item.suppNames.splice(index,1);
        this.$forceUpdate();
      }

    },
    back(rows){
      let that = this;
      let suppNames = [];
      let suppIds = [];
      let isOne = that.model.isOne;
      if(isOne == '1'){
        for(let i = 0; i < that.dataSource.length; i++){
          let suppNames = [];
          let suppIds = [];
          // if(that.dataSource[i].suppIds != null && that.dataSource[i].suppIds.length > 0){
          //   suppIds = that.dataSource[i].suppIds;
          // }
          // if(that.dataSource[i].suppNames != null && that.dataSource[i].suppNames.length > 0){
          //   suppNames = that.dataSource[i].suppNames;
          // }
          //如果是单一供应商
          if(that.model.isOne == '1' && rows != null && rows.length > 1){
            this.$message.error('只能选择一个供应商');
            return;
          }

          rows.filter(item => {
            if(suppIds.indexOf(item.id) == -1){
              suppNames.push(item.name);
              suppIds.push(item.id);
            }
          })
          setTimeout(() => {
            that.dataSource[i].suppIds = suppIds;
            that.dataSource[i].suppNames = suppNames;
            that.$forceUpdate();
          }, 200);
        }
      }else{
        if(that.nowRow.suppIds != null && that.nowRow.suppIds.length > 0){
          suppIds = that.nowRow.suppIds;
        }
        if(that.nowRow.suppNames != null && that.nowRow.suppNames.length > 0){
          suppNames = that.nowRow.suppNames;
        }
        //如果是单一供应商
        if(that.model.isOne == '1' && rows != null && rows.length > 1){
          this.$message.error('只能选择一个供应商');
          return;
        }

        rows.filter(item => {
          if(suppIds.indexOf(item.id) == -1){
            suppNames.push(item.name);
            suppIds.push(item.id);
          }
        })
        setTimeout(() => {
          that.nowRow.suppIds = suppIds;
          that.nowRow.suppNames = suppNames;
          that.$forceUpdate();
        }, 200);
      }

    },
    openDrawer(record){
      this.nowRow = record;
      this.$refs.ruleModal.showModal(record);
    },
    add() {
      this.edit(this.modelDefault)
    },
    editList(recordIds) {
      this.dataSource = []
      this.model.isNotice = '0'
      this.model.attachment = ''
      this.fetchBatchRecordList(recordIds);
    },
    fetchBatchRecordList(recordIds){
      let url = "/srm/purchaseRequestMain/fetchBatchRecordList";
      let param = {
        id:recordIds.join(",")
      }
      getAction(url,param).then(res => {
        this.dataSource = res.result;
      })
    },
    edit(record) {
      this.dataSource = []
      this.model = Object.assign({}, record)
      this.model.isNotice = '0'
      this.model.attachment = ''
      this.model.purAttachment = record.attachment;
      this.model.purOtherAttachment = record.otherAttachment;
      // this.model.purComment = record.comment;
      if (this.model.id) {
        this.getDetailList(this.model.id);
        if(isNullOrEmpty(this.model.inquirer)){
          this.model.inquirer = this.model.buyerId;
          this.getUser(this.model.inquirer);
        }
      }
    },
    editTime(record) {
      this.dataSource = []
      this.model = Object.assign({}, record)
      if (this.model.id) {
        this.queryRecordList(this.model.id);
        this.getUser(this.model.inquirer);
      }
    },
    queryRecordList(id) {
      let url = '/srm/inquiryList/queryRecordList'
      getAction(url, { id: id }).then(res => {
        this.dataSource = res.result;
      })
    },
    getUser(username){
      let url = '/sys/user/queryByUsername'
      getAction(url, { username: username }).then(res => {
        if(res.result != null && res.result != undefined){
          this.model.inquirerTel = res.result.phone;
          this.$forceUpdate();
        }
      })
    },
    getDetailList(id) {
      let url = '/srm/purchaseRequestMain/queryPurchaseRequestDetail'
      getAction(url, { id: id }).then(res => {
        this.dataSource = res
      })
    }

  }
}
</script>

<style lang="less" scoped>
.ant-row.ant-form-item {
  margin-bottom: 12px;
}
</style>