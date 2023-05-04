<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="8" >
            <a-form-model-item label="模板名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="temName">
              <a-input v-model="model.temName" placeholder="请输入模板名称" :maxLength="50"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="合同模板编号" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="temNo">
              <a-input v-model="model.temNo" placeholder="请输入合同模板编号":maxLength="20" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="模板类型" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="temCategory">
<!--              <a-input v-model="model.temCategory" placeholder="请输入模板类型" ></a-input>-->
              <j-dict-select-tag  v-model="model.temCategory" placeholder="请输入模板类型" dictCode="tem_category"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8" >
            <a-form-model-item label="合同类型" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="contractCategory">
<!--              <a-input v-model="model.contractCategory" placeholder="请输入合同类型" ></a-input>-->
              <j-dict-select-tag  v-model="model.contractCategory" placeholder="请输入合同类型" dictCode="contract_category"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="状态" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="status">
              <a-radio-group v-model="model.status" @change="setVal">
                <a-radio value="1">启用</a-radio>
                <a-radio value="0">停用</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="合同背景描述" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="contractDescription">
              <a-input v-model="model.contractDescription" type="textarea" :maxLength="1000"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="合同内容" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="contractContent">
              <a-input v-model="model.contractContent" type="textarea" :maxLength="1000"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="附件" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <j-upload v-model="model.attachment" :trigger-change="true"></j-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="合同条款" :key="refKeys[0]" :forceRender="true">
        <a-button style="margin-bottom: 10px" type="primary" @click="addRow('article')" :disabled="formDisabled">新增</a-button>
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          class="j-table-force-nowrap"
          :scroll="{x:true,y:500}"
          :columns="basContractTemplateArticleTable.columns"
          :dataSource="basContractTemplateArticleTable.dataSource"
        >
          <template slot="action" slot-scope="text,record,index">
            <a @click="delRow(record,index,'article')" :disabled="formDisabled">删除</a>
          </template>

          <template slot-scope="text,record" slot="articleTitle">
            <a-input v-model="record.articleTitle" :maxLength="50"></a-input>
          </template>

          <template slot-scope="text,record" slot="articleContent">
            <a-input v-model="record.articleContent" :maxLength="1000" type="textarea"></a-input>
          </template>

          <template slot-scope="text,record" slot="lockTag">
            <a-radio-group v-model:value="record.lockTag">
              <a-radio value="1">是</a-radio>
              <a-radio value="0">否</a-radio>
            </a-radio-group>
          </template>

        </a-table>
      </a-tab-pane>
      <a-tab-pane tab="合同付款周期" :key="refKeys[1]" :forceRender="true">
        <a-button style="margin-bottom: 10px" type="primary" @click="addRow('pay')" :disabled="formDisabled">新增</a-button>
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          class="j-table-force-nowrap"
          :scroll="{x:true,y:500}"
          :columns="basContractTemplatePayTable.columns"
          :dataSource="basContractTemplatePayTable.dataSource"
          >
          <template slot="action" slot-scope="text,record,index">
            <a @click="delRow(record,index,'pay')" :disabled="formDisabled">删除</a>
          </template>

          <template slot-scope="text,record" slot="articleTitle">
            <a-input v-model="record.articleTitle" :maxLength="50"></a-input>
          </template>

          <template slot="payCategory" slot-scope="text,record">
            <j-dict-select-tag dictCode="payType" v-model="record.payCategory" style="width: 100%" :getPopupContainer="getParentContainer"/>
          </template>

          <template slot-scope="text,record" slot="payRate">
            <a-input-number v-model="record.payRate" style="width: 100%"></a-input-number>
          </template>

          <template slot="payType" slot-scope="text,record">
            <j-dict-select-tag dictCode="payMethod" v-model="record.payType" style="width: 100%" :getPopupContainer="getParentContainer"/>
          </template>

          <template slot-scope="text,record" slot="lockTag">
            <a-radio-group v-model:value="record.lockTag">
              <a-radio value="1">是</a-radio>
              <a-radio value="0">否</a-radio>
            </a-radio-group>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
  </a-spin>
</template>

<script>

import { getAction, httpAction } from '@/api/manage'
  import { JVxeTableModelMixin } from '@/mixins/JVxeTableModelMixin.js'
  import { JVXETypes } from '@/components/jeecg/JVxeTable'
  import { getRefPromise,VALIDATE_FAILED} from '@/components/jeecg/JVxeTable/utils/vxeUtils.js'
  import { isNullOrEmpty, validateDuplicateValue } from '@/utils/util'
  import JFormContainer from '@/components/jeecg/JFormContainer'
  import { billModalMixin } from '../../mixins/billModalMixin'
  export default {
    name: 'BasContractTemplateForm',
    mixins: [JVxeTableModelMixin,billModalMixin],
    components: {
      JFormContainer,
    },
    data() {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 2 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        model:{
          status:'1'
        },
        validatorRules: {
          temName: [
            { required: true, message: '请输入模板名称!'},
          ],
          temNo: [
            { required: true, message: '请输入合同模板编号!'},
          ],
          temCategory: [
            { required: true, message: '请选择模板类型!'},
          ],
          contractCategory: [
            { required: true, message: '请选择合同类型!'},
          ],
          status: [
            { required: true, message: '请选择状态!'},
          ],
        },
        refKeys: ['basContractTemplateArticle', 'basContractTemplatePay', ],
        activeKey: 'basContractTemplateArticle',
        // 合同条款表
        basContractTemplateArticleTable: {
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
              title: '条款名称',
              dataIndex: 'articleTitle',
              width:120,
              scopedSlots: { customRender: 'articleTitle' },
            },
            {
              title: '合同条款',
              dataIndex: 'articleContent',
              width:200,
              scopedSlots: { customRender: 'articleContent' },
            },
            {
              title: '是否可变',
              dataIndex: 'lockTag',
              width:120,
              scopedSlots: { customRender: 'lockTag' },
            },
            {
              title: '操作',
              dataIndex: 'action',
              align:"center",
              width:100,
              scopedSlots: { customRender: 'action' },
            }
          ]
        },
        // 合同付款周期
        basContractTemplatePayTable: {
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
              title: '付款周期名称',
              dataIndex: 'articleTitle',
              width:180,
              scopedSlots: { customRender: 'articleTitle' },
            },
            {
              title: '付款类型',
              dataIndex: 'payCategory',
              width:120,
              scopedSlots: { customRender: 'payCategory' },
            },
            {
              title: '付款比例(%)',
              dataIndex: 'payRate',
              width:120,
              scopedSlots: { customRender: 'payRate' },
            },
            {
              title: '支付方式',
              dataIndex: 'payType',
              width:120,
              scopedSlots: { customRender: 'payType' },
            },
            {
              title: '是否可变',
              dataIndex: 'lockTag',
              width:180,
              scopedSlots: { customRender: 'lockTag' },
            },
            {
              title: '操作',
              dataIndex: 'action',
              align:"center",
              width:100,
              scopedSlots: { customRender: 'action' },
            }
          ]
        },
        url: {
          add: "/srm/basContractTemplate/add",
          edit: "/srm/basContractTemplate/edit",
          queryById: "/srm/basContractTemplate/queryById",
          basContractTemplateArticle: {
            list: '/srm/basContractTemplate/queryBasContractTemplateArticleByMainId'
          },
          basContractTemplatePay: {
            list: '/srm/basContractTemplate/queryBasContractTemplatePayByMainId'
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
      setVal(){
        this.$forceUpdate();
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
            let articleList = that.basContractTemplateArticleTable.dataSource;
            // if(articleList == null || articleList.length == 0){
            //   that.$message.warning("请配置合同条款");
            //   return;
            // }
            for(let i = 0; i < articleList.length; i++){
              if(isNullOrEmpty(articleList[i].articleTitle)){
                that.$message.warning("第" + (i+1) + "行,请输入条款名称");
                return;
              }
              if(isNullOrEmpty(articleList[i].articleContent)){
                that.$message.warning("第" + (i+1) + "行,请输入合同条款");
                return;
              }
            }
            that.model.basContractTemplateArticleList = articleList;

            let payList = that.basContractTemplatePayTable.dataSource;
            // if(payList == null || payList.length == 0){
            //   this.$message.warning("请配置合同付款周期");
            //   return;
            // }
            for(let i = 0; i < payList.length; i++){
              if(isNullOrEmpty(payList[i].articleTitle)){
                that.$message.warning("第" + (i+1) + "行,请输入付款周期名称");
                return;
              }
              if(isNullOrEmpty(payList[i].payCategory)){
                that.$message.warning("第" + (i+1) + "行,请选择付款类型");
                return;
              }

              if(isNullOrEmpty(payList[i].payRate)){
                that.$message.warning("第" + (i+1) + "行,请输入付款比例");
                return;
              }

              if(isNullOrEmpty(payList[i].payType)){
                that.$message.warning("第" + (i+1) + "行,请选择支付方式");
                return;
              }
            }
            that.model.basContractTemplatePayList = payList;
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
      delRow(record,index,type){
        if(type == 'article'){
          this.basContractTemplateArticleTable.dataSource.splice(index,1);
        }else if(type == 'pay'){
          this.basContractTemplatePayTable.dataSource.splice(index,1);
        }
      },
      addRow(type){
        if(type == 'article'){
          let row = {
            articleTitle:'',
            articleContent:'',
            lockTag:'1'
          };
          this.basContractTemplateArticleTable.dataSource.push(row);
        }else if(type == 'pay'){
          let row = {
            articleTitle:'',
            payCategory:'',
            payRate:'',
            payType:'',
            lockTag:'1'
          };
          this.basContractTemplatePayTable.dataSource.push(row);
        }
      },
      edit (record) {
        this.basContractTemplateArticleTable.dataSource = [];
        this.basContractTemplatePayTable.dataSource = [];
        this.model = Object.assign({}, record);
        if(isNullOrEmpty(this.model.status)){
          this.model.status = '1';
        }else{
          this.model.status = record.status;
          this.$forceUpdate();
        }
        if(this.model.id){
          this.fetchArticleList(this.model.id);
          this.fetchPayList(this.model.id);
        }
        this.visible = true;
      },
      fetchArticleList(id){
        let url = "/srm/basContractTemplate/queryBasContractTemplateArticleByMainId";
        getAction(url,{id:id}).then(res => {
          this.basContractTemplateArticleTable.dataSource = res.result;
        })
      },
      fetchPayList(id){
        let url = "/srm/basContractTemplate/queryBasContractTemplatePayByMainId";
        getAction(url,{id:id}).then(res => {
          this.basContractTemplatePayTable.dataSource = res.result;
        })
      },
      add () {
        this.edit();
      },

    }
  }
</script>

<style scoped>
</style>