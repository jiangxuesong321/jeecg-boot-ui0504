<template>
  <a-drawer
    :title="title"
    :width="width"
    placement="right"
    :closable="false"
    :headerStyle="{ textAlign: 'center'}"
    @close="close"
    destroyOnClose
    :visible="visible">
      <a-spin :spinning="confirmLoading">
        <j-form-container >
          <!-- 主表单区域 -->
          <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
              <a-row>
                <a-col :span="8">
                  <a-form-model-item label="招标编码" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3" prop="biddingNo">
                    {{model.biddingNo}}
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="招标名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                     prop="biddingName">
                    {{model.biddingName}}
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="项目名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                    {{model.projName}}
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="招标类型" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3"
                                     prop="biddingType">
                    {{model.biddingType_dictText}}
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="项目状态" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                    {{model.biddingStatus_dictText}}
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="发布时间" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                    {{model.createTime}}
                  </a-form-model-item>
                </a-col>
              </a-row>

              <a-table
                ref="table"
                size="middle"
                bordered
                rowKey="id"
                class="j-table-force-nowrap"
                :scroll="{x:true}"
                :columns="columns"
                :dataSource="dataSource"
                :pagination="false">
                <template slot="attachment" slot-scope="text,record">
                  <j-upload v-model="record.attachment" :trigger-change="true" disabled></j-upload>
                </template>
              </a-table>
          </a-form-model>
        </j-form-container>
      </a-spin>
      <div class="drawer-footer" style="text-align: center;margin-top:15px;">
        <a-button  @click="close" style="margin-left:10px;" type="primary" >返回</a-button>
        <a-button  @click="refresh" style="margin-left:10px;" type="primary"  v-if="isShow">刷新</a-button>
        <a-button  @click="giveUp" style="margin-left:10px;" type="primary"  v-if="isShow">整体废标</a-button>
        <a-button  @click="handleSubmit" style="margin-left:10px;" type="primary"  v-if="isShow">确认开标</a-button>
      </div>

    <a-modal
      title=""
      width="30%"
      :visible="toVisible"
      @ok="handleSubmit"
      @cancel="handleCancel">
        <div class="visible-item" style="padding-top: 30px;">
          编号为：<span>{{model.biddingNo}}</span> 的开标现场
        </div>
        <div class="visible-item">
          开标时间：{{this.model.openBiddingDate}}
        </div>
<!--        <div style="text-align: center">-->
<!--          验证码:<a-input v-model="model.verCode" style="width: 20%"></a-input>-->
<!--        </div>-->
    </a-modal>

    <a-modal
      title="废标原因"
      width="30%"
      :visible="toFail"
      @ok="toSubmit"
      @cancel="toCancel">
      <div>
        <span style="float: left">
          废标原因:
        </span>
        <a-input type="textarea" v-model="model.reason" style="width: 70%"></a-input>
      </div>
    </a-modal>
  </a-drawer>
</template>

<script>
import { putAction,getAction } from '@/api/manage'
import { JVxeTableModelMixin } from '@/mixins/JVxeTableModelMixin.js'
import JFormContainer from '@/components/jeecg/JFormContainer'
import { billListMixin } from '../../mixins/billListMixin'
import { billModalMixin } from '../../mixins/billModalMixin'
import JSelectSupplierModal from '@comp/jeecgbiz/modal/JSelectSupplierModal'
import BasTemplate from '@views/bidding/modules/BasTemplate'
import BasExpert from '@views/bidding/modules/BasExpert'
import { formatDate, isNullOrEmpty } from '@/utils/util'
import {
  iegAmount
} from '@/utils/util'
export default {
		name: 'BiddingMainForm',
		mixins: [JVxeTableModelMixin,billListMixin, billModalMixin],
		components: {
			JFormContainer,
      JSelectSupplierModal,
      BasTemplate,
      BasExpert
		},
		data() {
			return {
			  isShow:false,
        toFail:false,
        toVisible:false,
        title:'开标',
        width:'80%',
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
            title: '投标方名称',
            dataIndex: 'suppName',
            align:"center",
            width:120,
          },
          {
            title: '投标类型',
            dataIndex: 'biddingType_dictText',
            align:"center",
            width:200,
          },
          {
            title: '投标状态',
            dataIndex: 'status',
            align:"center",
            width:120,
            customRender: function(text) {
              if(text == '0'){
                return "待受理"
              }else if(text == '1'){
                return "已放弃";
              }else if(text == "2"){
                return "已受理";
              }else if(text == "3"){
                return "已报价";
              }else if(text == "01"){
                return "已开标";
              }else if(text == "04"){
                return "已废标";
              }else if(text == '4'){
                return "已结束";
              }
            },
          },
          // {
          //   title: '投标币种',
          //   dataIndex: 'biddingCurrency_dictText',
          //   align:"center",
          //   width:120,
          // },
          // {
          //   title: '投标金额',
          //   dataIndex: 'amountTax',
          //   width:120,
          //   customRender:function (t,r,index) {
          //     let icon = "";
          //     if(r.biddingCurrency == 'RMB'){
          //       icon = '¥';
          //     }else if(r.biddingCurrency == 'JPY'){
          //       icon = 'Ұ';
          //     }else if(r.biddingCurrency == 'USD'){
          //       icon = '$';
          //     }else if(r.biddingCurrency == 'EUR'){
          //       icon = '€';
          //     }
          //     // return icon + iegAmount(t,'total')
          //     const obj = {
          //       children: icon + iegAmount(t,'total'),
          //       attrs: {},
          //     };
          //     obj.attrs.align = 'right';//控制表体内容居右
          //     return obj;
          //   }
          // },
          {
            title: '目前排名',
            dataIndex: 'priceRank',
            align:"center",
            width:120,
          },
          {
            title: '最晚交期',
            align:"center",
            dataIndex: 'leadTime',
            width:120,
          },
          {
            title: '交期排名',
            align:"center",
            dataIndex: 'leadTimeRank',
            width:120,
          },
          // {
          //   title: '报价附件',
          //   dataIndex: 'attachment',
          //   align:"center",
          //   width:200,
          //   scopedSlots: { customRender: 'attachment' },
          // },
          {
            title: '报价备注',
            dataIndex: 'comment',
            align:"center",
            width:200,
            ellipsis:true,
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
				model: {},
				// 新增时子表默认添加几行空数据
				validatorRules: {

        },
				activeKey: '0',
				url: {

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
			},
		},
		created() {},
		methods: {
      toSubmit(){
        let that = this;
        let reason = that.model.reason;
        if(isNullOrEmpty(reason)){
          that.$message.error("请输入废标原因");
          return;
        }
        let url = "/srm/biddingMain/editEntity";
        let param = {
          id:that.model.id,
          biddingStatus:'4',
          reason:reason
        }
        that.$confirm({
          content: `是否确认提交`,
          onOk: () => {
            putAction(url,param).then(res => {
              that.$message.success("提交成功");
              that.close();
              that.toCancel();
              that.$emit('ok');
            })
          }
        })
      },
      toCancel(){
        this.toFail = false;
      },
      handleSubmit(){
        let that = this;
        let url = "/srm/biddingMain/editEntity";
        let param = {
          id:that.model.id,
          biddingStatus:'1',
          openBiddingDate:that.model.openBiddingDate
        }
        that.$confirm({
          content: `是否确认提交`,
          onOk: () => {
            that.confirmLoading = true;
            putAction(url,param).then(res => {
              that.confirmLoading = false;
              that.$message.success("提交成功");
              that.handleCancel();
              that.close();
              that.$emit('ok');
            }).finally(e => {
              console.log(e);
              that.confirmLoading = false;
            })
          }
        })
      },
      handleCancel(){
        this.toVisible = false;
      },
      toOpen(){
        this.toVisible = true;
        this.model.openBiddingDate = this.formatDate(new Date(),'yyyy-MM-dd');
      },
      giveUp(){
        this.toFail = true;
      },
      refresh(){
        this.fetchQuote(this.model.id);
      },
      close(){
        this.visible = false;
      },
      view(record){
        this.visible = true;
        this.isShow = false;
        this.dataSource = [];
        this.model = Object.assign({}, record);
        //报价信息
        this.fetchQuote(record.id);
      },
      edit(record) {
        this.visible = true;
        this.isShow = true;
        this.dataSource = [];
        this.model = Object.assign({}, record);
        //报价信息
        this.fetchQuote(record.id);
      },
      fetchQuote(id){
        let url = "/srm/biddingMain/fetchQuote";
        let param = {
          id:id
        }
        getAction(url,param).then(res => {
          this.dataSource = res.result;
        })
      },
		}
	}
</script>
<style>
	.visible-item {
		text-align: center;
		font-size: 15px;
		line-height: 40px;
	}
	.visible-item span{
		font-size: 20px;
		color: #0000C0;
	}
</style>
<style lang="less" scoped>
	.ant-row.ant-form-item {
		margin-bottom: 12px;
	}
</style>
