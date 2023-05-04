<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container>
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="模板名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="templateName">
              <a-input v-model="model.templateName" placeholder="请输入模板名称" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="总分数" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="totalScore">
              <a-input-number v-model="model.totalScore" placeholder="请输入总分数" style="width: 100%" :disabled="formDisabled"></a-input-number>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="模板状态" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="templateStatus">
              <a-radio-group v-model:value="model.templateStatus" name="templateStatus" @change="setVal" :disabled="formDisabled">
                <a-radio value="1">启用</a-radio>
                <a-radio value="0">停用</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>

          <a-col :span="24">
            <a-form-model-item label="模板说明" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1" prop="comment">
              <a-textarea v-model="model.comment" rows="4" placeholder="请输入备注" :disabled="formDisabled"/>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
    <a-tabs v-model="activeKey">
      <a-tab-pane tab="评分项" key="0">
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            class="j-table-force-nowrap"
            :scroll="{x:true,y:400}"
            :columns="biddingEvaluateTemplateItemTable.columns"
            :dataSource="biddingEvaluateTemplateItemTable.dataSource"
            :pagination="false">
            <template slot="action" slot-scope="text,record,index">
              <a @click="delRow(record,index)" :disabled="formDisabled">删除</a>
            </template>

            <template slot="itemName" slot-scope="text,record,index">
              <a-input v-model="record.itemName" :maxLength="50" :disabled="formDisabled"></a-input>
            </template>

            <template slot="itemStandard" slot-scope="text,record,index">
              <a-input v-model="record.itemStandard" :maxLength="250" :disabled="formDisabled"></a-input>
            </template>

            <template slot="itemScore" slot-scope="text,record,index">
              <a-input-number v-model="record.itemScore" style="width: 100%" :disabled="formDisabled"></a-input-number>
            </template>
          </a-table>
		  <a-button style="margin-bottom: 20px" type="primary" @click="addRow" :disabled="formDisabled" ghost>追加评分项</a-button>
      </a-tab-pane>
    </a-tabs>

  </a-spin>
</template>

<script>

import { isNullOrEmpty } from '@/utils/util'
import { billModalMixin } from '../../mixins/billModalMixin'
import { JVxeTableModelMixin } from '@/mixins/JVxeTableModelMixin'
import { httpAction,getAction } from '@api/manage'

export default {
  name: 'BasWarehouseForm',
  components: {
  },
  mixins: [JVxeTableModelMixin,billModalMixin],
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    templateType: {
      type: String,
      default: false,
      required: false
    }
  },
  data () {
    return {
      activeKey:'0',
      confirmLoading:false,
      model: {
        templateName:'',
        totalScore:0,
        templateStatus:'',
        comment:'',
        templateType:'',

      },
      validatorRules: {
        templateName: [
          { required: true, message: '请输入模板名称!'},
        ],
        totalScore: [
          { required: true, message: '请输入总分数!'},
        ],
        templateStatus: [
          { required: true, message: '请选择模板状态!'},
        ],
      },
      // 评标模板评分项表
      biddingEvaluateTemplateItemTable: {
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
            title: '评分项',
            dataIndex: 'itemName',
            width:140,
            scopedSlots: { customRender: 'itemName' },
          },
          {
            title: '评分标准',
            dataIndex: 'itemStandard',
            width:200,
            scopedSlots: { customRender: 'itemStandard' },
          },
          {
            title: '分值',
            dataIndex: 'itemScore',
            width:120,
            scopedSlots: { customRender: 'itemScore' },
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
        add: "/srm/biddingEvaluateTemplate/add",
        edit: "/srm/biddingEvaluateTemplate/edit",
        queryById: "/srm/biddingEvaluateTemplate/queryById",
        biddingEvaluateTemplateItem: {
          list: '/srm/biddingEvaluateTemplate/queryBiddingEvaluateTemplateItemByMainId'
        },
      }
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
          let itemList = this.biddingEvaluateTemplateItemTable.dataSource;
          let itemScore = 0;
          if(itemList == null || itemList.length == 0){
            that.$message.warning("请选择评分项");
            return;
          }
          for(let i = 0; i < itemList.length; i++){
            if(isNullOrEmpty(itemList[i].itemName)){
              that.$message.warning("第" + (i+1) + "行,请输入评分项");
              return;
            }
            if(isNullOrEmpty(itemList[i].itemStandard)){
              that.$message.warning("第" + (i+1) + "行,请输入评分标准");
              return;
            }
            if(isNullOrEmpty(itemList[i].itemScore) || itemList[i].itemScore == 0){
              that.$message.warning("第" + (i+1) + "行,请输入分值");
              return;
            }
            itemScore = Number(itemScore) + Number(itemList[i].itemScore);
          }

          if(itemScore != that.model.totalScore){
            that.$message.warning("分值不相等");
            return;
          }

          that.model.biddingEvaluateTemplateItemList = itemList;
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
    delRow(record,index){
      this.biddingEvaluateTemplateItemTable.dataSource.splice(index,1);
    },
    addRow(){
      let row = {
        itemName : '',
        itemStandard : '',
        itemScore : '',
      }
      this.biddingEvaluateTemplateItemTable.dataSource.push(row);
    },
    edit (record) {
      this.biddingEvaluateTemplateItemTable.dataSource = [];
      this.model = Object.assign({}, record);
      if(isNullOrEmpty(this.model.templateStatus)){
        this.model.templateStatus = '1';
      }
      if(isNullOrEmpty(this.model.templateType)){
        this.model.templateType = this.templateType;
      }
      if(this.model.id){
        this.fetchItemList(this.model.id);
      }
      this.visible = true;
    },
    fetchItemList(id){
      let url = "/srm/biddingEvaluateTemplate/queryBiddingEvaluateTemplateItemByMainId";
      this.biddingEvaluateTemplateItemTable.dataSource = [];
      getAction(url,{id:id}).then(res => {
        this.biddingEvaluateTemplateItemTable.dataSource = res.result;
      })
    },
    add () {
      this.edit();
    },
  }
}
</script>