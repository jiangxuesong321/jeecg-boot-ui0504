<template>
	<a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="物料名称">
              <a-input placeholder="请输入物料名称" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="设备编码">
              <a-input placeholder="请输入设备编码" v-model="queryParam.code"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="产品类型">
<!--              <a-input placeholder="请输入产品类型" v-model="queryParam.model"></a-input>-->
              <j-dict-select-tag  v-model="queryParam.model" placeholder="请输入产品类型" dictCode="model"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
<!--      <a-row :gutter="24">-->
<!--        <a-col :span="3">设备预算总金额(元)：</a-col><a-col :span="2"><span style="color:coral;font-weight: bold;font-size:18px;">{{budgetAmount}}</span></a-col>-->
<!--        <a-col :span="3">设备剩余可用金额(元)：</a-col><a-col :span="2"><span style="color:coral;font-weight: bold;font-size:18px;">{{remainAmount}}</span></a-col>-->
<!--      </a-row>-->
    </div>
    <a-row>
      <a-col :span="11" style="color: red">
        <span style="margin-left: 15px">合计:</span>
      </a-col>
      <a-col :span="5" >
        <span style="margin-left: 20px">
          {{total.qty}}
        </span>
      </a-col>
      <a-col :span="8">
        <a-col :span="3" style="margin-left: 40px">
          {{total.hasReqQty}}
        </a-col>
        <a-col :span="3" style="margin-left: 40px">
          {{total.hasBuyQty}}
        </a-col>
        <a-col :span="3" style="margin-left: 40px">
          {{total.onRoadQty}}
        </a-col>
        <a-col :span="3" style="margin-left: 40px">
          {{total.stockQty}}
        </a-col>
        <a-col :span="3" style="margin-left: 40px">
          {{total.remainQty}}
        </a-col>
      </a-col>
    </a-row>
    <a-table ref="tableSet"
             size="middle"
             rowKey="id"
             :scroll="{x:1200,y:500}"
             :columns="columns"
             :dataSource="dataSource"
             :pagination="ipagination"
             :loading="loading"
             @change="handleTableChange"
          >
    </a-table>
	</a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@api/manage'
import {
  iegAmount
} from '@/utils/util'
export default {
		name: 'BasEqpModal',
		mixins: [JeecgListMixin],
    props:['projId','categoryId'],
		components: {

		},
		data() {
			return {
			  total:{
          qty:0,
          hasReqQty:0,
          hasBuyQty:0,
          stockQty:0,
          onRoadQty:0,
          remainQty:0
        },
			  budgetAmount:0,
        remainAmount:0,
				description: 'proj_base管理页面',
				// 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function(t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '物料编码',
            align: "center",
            dataIndex: 'code',
            width: 120,
          },
          {
            title: '物料名称',
            align: "center",
            dataIndex: 'name',
            width: 180,
          },
          {
            title: '产品类型',
            align: "center",
            dataIndex: 'model_dictText',
            width: 120,
          },
          {
            title: '产地',
            align: "center",
            dataIndex: 'country',
            width: 120,
          },
          {
            title: '设备产能',
            align: "center",
            dataIndex: 'capacity',
            width: 120,
          },
          {
            title: '执行数量',
            align: "center",
            dataIndex: 'qty',
            width: 120,
          },
          {
            title: '预算单价(元)',
            align: "center",
            dataIndex: 'budgetPrice',
            width: 120,
            customRender:function (t,r,index) {
              let icon = "";
              icon = '¥';
              return icon + iegAmount(t,'total')
            }
          },
          {
            title: '预算小计(元)',
            align: "center",
            dataIndex: 'budgetAmount',
            width: 120,
            customRender:function (t,r,index) {
              let icon = "";
              icon = '¥';
              return icon + iegAmount(t,'total')
            }
          },
          {
            title: '已提交需求数量',
            align: "center",
            dataIndex: 'hasReqQty'
          },
          {
            title: '已买数量',
            align: "center",
            dataIndex: 'hasBuyQty'
          },
          {
            title: '在途数量',
            align: "center",
            dataIndex: 'onRoadQty'

          },
          {
            title: '到场数量',
            align: "center",
            dataIndex: 'stockQty'

          },
          {
            title: '剩余可采购数量',
            align: "center",
            dataIndex: 'remainQty'

          },
        ],
				url: {
					list: "/srm/projBase/fetchEqpPageList",
				},
				dictOptions: {},
				superFieldList: [],
			}
		},
		created() {
      // this.fetchTotalEqp();
		},
		computed: {
			importExcelUrl: function() {
				return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
			},
		},
		methods: {
		  // fetchTotalEqp(){
      //   var params = {};
      //   params.projId = this.projId;
      //   params.categoryId = this.categoryId;
		  //   let url = "/srm/projBase/fetchTotalEqp";
		  //   getAction(url,params).then(res => {
      //     if(res.result != null){
      //       this.budgetAmount = res.result.budgetAmount;
      //       this.remainAmount = res.result.remainAmount;
      //     }
      //   })
      // },
      searchReset() {
        this.queryParam = {}
        this.loadData(1);
        this.fetchTotalQty();
      },
      searchQuery() {
        this.loadData(1);
        this.fetchTotalQty();
      },
      fetchTotalQty(){
        var params = this.getQueryParams();//查询条件
        params.projId = this.projId;
        params.categoryId = this.categoryId;
        let url = "/srm/projBase/fetchTotalQty";

        getAction(url,params).then(res => {
          this.total = res.result;
        })
      },
      loadData(arg) {
        if(!this.url.list){
          this.$message.error("请设置url.list属性!")
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        var params = this.getQueryParams();//查询条件
        this.loading = true;
        params.projId = this.projId;
        params.categoryId = this.categoryId;
        getAction(this.url.list, params).then((res) => {
          if (res.success) {
            //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
            this.dataSource = res.result.records||res.result;
            if(res.result.total)
            {
              this.ipagination.total = res.result.total;
            }else{
              this.ipagination.total = 0;
            }
            //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
          }else{
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.loading = false
        })
      },
		}
	}
</script>
<style scoped>
	@import '~@assets/less/common.less';
</style>
<style lang="less" scoped>
  .ant-row.ant-form-item {
    margin-bottom: 12px;
  }
</style>