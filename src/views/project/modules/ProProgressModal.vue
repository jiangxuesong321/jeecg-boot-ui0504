<template>
	<a-drawer title="项目进展" :width="width" placement="right" :closable="false" :headerStyle="{ textAlign: 'center'}"
		@close="close" destroyOnClose :visible="visible">
    <div class="table-page-search-wrapper">
			<a-form layout="inline" @keyup.enter.native="searchQuery">
				<a-row :gutter="24">
					<a-col :span="12">
						<a-form-item label="项目编码" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
							<a-input placeholder="请输入编码" v-model="record.projCode" ></a-input>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="项目名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
							<a-input placeholder="请输入项目名称" v-model="record.projName"></a-input>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</div>
    <a-form-model ref="form" :model="model">

      <a-row>
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
     
        </a-table>
      </a-row>
    </a-form-model>

	</a-drawer>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { billModalMixin } from '../../mixins/billModalMixin'
import { isNullOrEmpty } from '@/utils/util'
import { putAction,getAction } from '@api/manage'

export default {
		name: 'ProjRateModal',
		mixins: [billModalMixin],
		components: {
      
		},
		data() {
			return {
        modalWidth:'60%',
        columns:[
          {
            title: '阶段',
            dataIndex: 'projjd',
            align:"center",
            width:160,
          },
          {
            title: '功能',
            dataIndex: 'projgn',
            align:"center",
            width:160,
          },
          {
            title: '概况',
            dataIndex: 'projgk',
            align:"center",
            width:160,
          },
          {
            title: '状态',
            dataIndex: 'currencyB',
            align:"center",
            width:120,
      
          },
          
        ],
        dataSource:[
          {
            "projjd":"需求阶段",
            "projgn":"提出需求",
            "projgk":"天津市文光集团有限公司",
            "currencyB":"已投标"
          }
        ],
        record:{},
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
			add(record) {
				this.visible = true;
				this.model = {};
				// this.dataSource = [];
        this.record = record;
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
