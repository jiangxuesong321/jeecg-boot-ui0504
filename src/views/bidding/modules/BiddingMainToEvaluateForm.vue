<template>
  <a-drawer
    :title="title"
    :width="width"
    placement="right"
    :closable="false"
    @close="close"
    destroyOnClose
    :visible="visible">
      <a-spin :spinning="confirmLoading">
		<div style="display: flex; margin-bottom: 10px;">
		  <h2 style="color: #0000CC; font-size: 20px;">{{model.biddingNo}}</h2>
		  <span style="display: inline-block;line-height: 30px;padding-left: 10px;">评标现场</span>
		</div>
        <div>
          评标时间:{{model.biddingStartTime}} 至 {{model.biddingEndTime}}
        </div>
		<hr style="margin-top: 10px; margin-bottom: 10px;border: none;border-bottom: 1px #efefef solid;" />
        <h2 class="zhaobiao-title" style="margin-top: 20px">评分标的</h2>
		<div style="margin-top: -30px;">
			<a-button type="primary" style="float: right;z-index: 9999;margin-bottom: 20px" @click="handleResult">评标结果</a-button>
			<a-button type="primary" style="float: right;z-index: 9999;margin-bottom: 20px;margin-right: 10px" @click="handleDetail">评分详情</a-button>
			<a-button type="primary" style="float: right;z-index: 9999;margin-bottom: 20px;margin-right: 10px" @click="handleEdit">查看招标详情</a-button>
		</div>
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

        </a-table>
      </a-spin>
      <div class="drawer-footer" style="text-align: center;margin-top:15px;">
        <a-button  @click="close" style="margin-left:10px;" type="primary" ghost>返回</a-button>
<!--        <a-button  @click="refresh" style="margin-left:10px;" type="primary" ghost>刷新</a-button>-->
        <a-button  @click="handleEnd" style="margin-left:10px;" type="primary"  v-if="model.biddingStatus != '3' && model.biddingStatus != '8'">结束评标</a-button>
      </div>

      <bidding-main-modal ref="modalForm" />
      <bidding-main-to-professional-form ref="mainForm"></bidding-main-to-professional-form>
      <bidding-main-to-result-form ref="resultForm"></bidding-main-to-result-form>
  </a-drawer>
</template>

<script>
import { getAction, putAction } from '@/api/manage'
import { JVxeTableModelMixin } from '@/mixins/JVxeTableModelMixin.js'
import JFormContainer from '@/components/jeecg/JFormContainer'
import { billListMixin } from '../../mixins/billListMixin'
import { billModalMixin } from '../../mixins/billModalMixin'
import BiddingMainModal from '@views/bidding/modules/BiddingMainModal'
import BiddingMainToProfessionalForm from '@views/bidding/modules/BiddingMainToProfessionalForm'
import BiddingMainToResultForm from '@views/bidding/modules/BiddingMainToResultForm'
import { isNullOrEmpty } from '@/utils/util'

export default {
		name: 'BiddingMainToEvaluateForm',
		mixins: [JVxeTableModelMixin,billListMixin, billModalMixin],
		components: {
			JFormContainer,
      BiddingMainModal,
      BiddingMainToProfessionalForm,
      BiddingMainToResultForm
		},
		data() {
			return {
        title:'评标现场',
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
            title: '标的编码',
            align:"center",
            dataIndex: 'prodCode',
            width:120,
          },
          {
            title: '标的名称',
            align:"center",
            dataIndex: 'prodName',
            width:200,
          },
          {
            title: '采购数量',
            customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
              const obj = {
                children: value,
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            },
            dataIndex: 'qty',
            width:120,
          },
          {
            title: '计量单位',
            align:"center",
            dataIndex: 'unitId_dictText',
            width:120,
          },
          {
            title: '邀标供应商数量',
            customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
              const obj = {
                children: value,
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            },
            dataIndex: 'num',
            width:120,
          },
          {
            title: '投标供应商数量',
            dataIndex: 'actNum',
            width:120,
            customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
              const obj = {
                children: value,
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          },
          // {
          //   title: '状态',
          //   dataIndex: 'status',
          //   width:120,
          //   customRender:function (t,r,index) {
          //     if(t == '0'){
          //       return "未完成";
          //     }else if(t == "1"){
          //       return "已完成";
          //     }else if(t == "2"){
          //       return "部分完成";
          //     }
          //   }
          // },
          // {
          //   title: '操作',
          //   dataIndex: 'action',
          //   align: 'center',
          //   width: 100,
          //   scopedSlots: { customRender: 'action' }
          // }
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
      handleEnd(){
        let that = this;
        let url = "/srm/biddingMain/editEntity";
        let param = {
          id:that.model.id,
          biddingStatus:'8',
        }
        that.$confirm({
          content: `是否确认提交`,
          onOk: () => {
            putAction(url,param).then(res => {
              that.$message.success("提交成功");
              that.close();
              that.$emit('ok');
            })
          }
        })
      },
      handleResult(){
        this.$refs.resultForm.editTwo(this.model);
      },
      handleDetail(){
        this.$refs.mainForm.editTwo(this.model);
      },
      handleEdit () {
        this.$refs.modalForm.editTwo(this.model);
        this.$refs.modalForm.title = "编辑";
        this.$refs.modalForm.disableSubmit = true;
      },
      close(){
        this.visible = false;
      },

      edit(record) {
        this.visible = true;
        this.dataSource = [];
        this.model = Object.assign({}, record);
        if(this.model.id){
          this.fetchRecordList(this.model.id);
        }
      },
      fetchRecordList(id){
        let url = "/srm/biddingMain/fetchRecordTwoList";
        let param = {
          id:id
        }
        getAction(url,param).then(res => {
          this.dataSource = res.result;
        })
      }
		}
	}
</script>
<style>
	.zhaobiao-title {
		margin-top: 20px;
		font-size: 18px;
		line-height: 40px;
	}
</style>
<style lang="less" scoped>
	.ant-row.ant-form-item {
		margin-bottom: 12px;
	}
</style>
