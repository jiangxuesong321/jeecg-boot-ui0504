<template>
	<a-drawer title="汇率修改" :width="width" placement="right" :closable="false" :headerStyle="{ textAlign: 'center'}"
		@close="close" destroyOnClose :visible="visible">
    <a-form-model ref="form" :model="model">
      <a-row>
        <a-col :span="8">
          <a-form-model-item label="目标币种" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
            <j-dict-select-tag v-model="model.currencyB" placeholder="请选择目标币种" dictCode="currency_type" @change="getExchangeRate"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="汇率值" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
            <a-input-number v-model="model.valueB" style="width: 100%" @change="setValueB"></a-input-number>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-button @click="handleAdd" type="primary" icon="plus" style="float: right;z-index: 999">新增</a-button>
        <a-table
          style="clear:both"
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :scroll="{x:true,y:500}"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false">
          <template slot="action" slot-scope="text,record,index">
            <a @click="delRow(index)">删除</a>
          </template>
        </a-table>
      </a-row>
    </a-form-model>
		<div  style="text-align: center;margin-top:15px;">
			<a-button @click="handleCancel" type="primary" ghost>关闭</a-button>
      <a-button @click="handleOk" type="primary" style="margin-left:10px" >提交</a-button>
		</div>

    <j-select-project-by-catalog-modal ref="modal" :multi="true" :modalWidth="modalWidth" :param="{}" @ok="back"></j-select-project-by-catalog-modal>
	</a-drawer>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { billModalMixin } from '../../mixins/billModalMixin'
import { isNullOrEmpty } from '@/utils/util'
import JSelectProjectByCatalogModal from '@comp/jeecgbiz/modal/JSelectProjectByCatalogModal'
import { putAction,getAction } from '@api/manage'

export default {
		name: 'ProjRateModal',
		mixins: [billModalMixin],
		components: {
      JSelectProjectByCatalogModal
		},
		data() {
			return {
        modalWidth:'80%',
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
            title: '项目名称',
            dataIndex: 'projName',
            width:160,
          },
          {
            title: '项目编码',
            dataIndex: 'projCode',
            width:160,
          },
          {
            title: '目标币种',
            dataIndex: 'currencyB',
            width:120,
            customRender:function (t,r,index) {
              if(t == 'RMB'){
                return '人民币';
              }else if(t == 'USD'){
                return '美元';
              }else if(t == 'EUR'){
                return '欧元';
              }else if(t == 'JPY'){
                return '日元';
              }
            }
          },
          {
            title: '汇率值',
            dataIndex: 'valueB',
            width:120,
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
			  model:{},
				title: "操作",
				width: '90%',
				visible: false,
				disableSubmit: false,
				loading: false,
			}
		},
		methods: {
      getExchangeRate(){
        let currencyB = this.model.currencyB;
        if("RMB" == currencyB){
          this.model.valueB = 1;
          this.$forceUpdate();
        }else{
          let url = "/srm/basRateMain/queryExchangeRateByCurrency";
          let param = {
            currencyB:currencyB
          }
          getAction(url,param).then(res => {
            if(res.success && res.result != null){
              this.model.valueB = res.result.valueB;
              this.$forceUpdate();
            }
          })
        }
      },
      setValueB(){
        this.dataSource.filter(item => {
          item.valueB = this.model.valueB;
        })
      },
      back(rows){
        console.log("===========",rows);
        rows.filter(item => {
          let flag = false;
          this.dataSource.filter(child => {
            if(item.id == child.id){
              flag = true;
              return;
            }
          })
          if(!flag){
            let row = {
              id:item.id,
              projName:item.projName,
              projCode:item.projCode,
              currencyB:this.model.currencyB,
              valueB:this.model.valueB
            }
            this.dataSource.push(row);
          }
        })
      },
      delRow(index){
        this.dataSource.splice(index,1);
      },
      handleAdd(){
        let currencyB = this.model.currencyB;
        if(isNullOrEmpty(currencyB)){
          this.$message.error("请选择目标币种");
          return;
        }
        let valueB = this.model.valueB;
        if(isNullOrEmpty(valueB)){
          this.$message.error("请输入汇率值");
          return;
        }
        this.$refs.modal.showModal();
      },
			add() {
				this.visible = true;
				this.model = {};
				this.dataSource = [];
			},
			close() {
				this.$emit('close');
				this.visible = false;
			},
			handleOk() {
        let that = this;
        let currencyB = that.model.currencyB;
        if(isNullOrEmpty(currencyB)){
          that.$message.error("请选择目标币种");
          return;
        }
        let valueB = that.model.valueB;
        if(isNullOrEmpty(valueB)){
          that.$message.error("请输入汇率值");
          return;
        }
        let dataSource = that.dataSource;
        if(dataSource == null || dataSource.length == 0){
          that.$message.error("请选择需要维护汇率的项目");
          return;
        }
        that.$confirm({
          title: '',
          content: `是否确认提交`,
          centered: true,
          onOk: () => {
            let url = "/srm/projBase/updateRate";
            putAction(url,that.dataSource).then(res => {
              if(res.success){
                that.$message.success("提交成功");
                that.visible = false;
                that.$emit('ok');
              }else{
                that.$message.error("提交失败");
              }
            })
          }
        })
			},
			handleCancel() {
				this.close()
			}
		}
	}
</script>

<style lang="less" scoped>
	/** Button按钮间距 */

	  .ant-row.ant-form-item {
		margin-bottom: 12px;
	  }

	.drawer-footer {
		position: absolute;
		bottom: -8px;
		width: 100%;
		border-top: 1px solid #e8e8e8;
		padding: 10px 16px;
		text-align: center;
		left: 0;
		background: #fff;
		border-radius: 0 0 2px 2px;
	}
</style>
