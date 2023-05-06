<template>
	<a-drawer title="入库单" :width="width" placement="right" :closable="false" :headerStyle="{ textAlign: 'center'}"
		@close="handleCancel" destroyOnClose :visible="visible">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="设备编码" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input placeholder="设备编码" v-model="queryParam.prodCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="设备名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input placeholder="请输入合同名称" v-model="queryParam.prodName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="规格型号" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input placeholder="请输入规格型号" v-model="queryParam.prodSpecType"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="序号" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input v-model='queryParam.sort' style='width: 47%'></a-input> - <a-input v-model='queryParam.sort1' style='width: 47%'></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <span style='float: right;overflow: hidden;' class='table-page-search-submitButtons'>
							<a-button type='primary' @click='searchQuery' icon='search'>查询</a-button>
							<a-button type='primary' @click='searchReset' icon='reload' style='margin-left: 8px'>重置</a-button>
              <a-button type='primary' @click='batchAdd' icon='plus' style='margin-left: 8px'>批量添加</a-button>
						</span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :rowSelection="{selectedRowKeys, onChange: onSelectChange, type: multiple ? 'checkbox':'radio'}"
      :scroll="{x:1200,y:500}"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      @change="handleTableChange">
      <template slot='qty' slot-scope='text,record'>
        {{record.qty}}
      </template>
    </a-table>
		<div class="drawer-footer" style="text-align: center;margin-top:15px;">
			<a-button key="cancel" @click="handleCancel" style="margin-left:10px;" type="primary" ghost>取消</a-button>
		</div>
	</a-drawer>
</template>

<script>

import { iegAmount, preciseNum } from '@/utils/util'
import { getAction } from '@api/manage'

  export default {
		name: 'DeliveryObjectModal',
    props:['suppId','currency','ids'],
		components: {

		},
		data() {
			return {
        multiple:true,
        /* table选中keys*/
        selectedRowKeys: [],
        /* table选中records*/
        selectionRows: [],
        ipagination:{
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        queryParam:{},
        spans: {
          labelCol3: {span: 6},
          wrapperCol3: {span: 18},
        },
        dataSource:[],
        columns:[
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
            title: '合同编码',
            dataIndex: 'contractNumber',
            align:"center",
            width:120,
            ellipsis:true,
          },
          {
            title: '合同名称',
            dataIndex: 'contractName',
            align:"center",
            width:120,
            ellipsis:true,
          },
          {
            title: '设备名称',
            dataIndex: 'prodName',
            align:"center",
            width:180,
            ellipsis:true,
          },
          {
            title: '入库数量',
            dataIndex: 'qty',
            align:"center",
            width:120,
          },
          {
            title: '单价',
            dataIndex: 'contractPriceTax',
            width:120,
            align:"center",
            customRender:function (t,r,index) {
              let icon = "";
              if(r.contractCurrency == 'RMB'){
                icon = '¥';
              }else if(r.contractCurrency == 'JPY'){
                icon = 'Ұ';
              }else if(r.contractCurrency == 'USD'){
                icon = '$';
              }else if(r.contractCurrency == 'EUR'){
                icon = '€';
              }
              // return icon + iegAmount(t,'total')
              const obj = {
                children: icon + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              return obj;
            }
          },
          {
            title: '金额',
            dataIndex: 'contractAmountTax',
            align:"center",
            width:120,
            customRender:function (t,r,index) {
              let icon = "";
              if(r.contractCurrency == 'RMB'){
                icon = '¥';
              }else if(r.contractCurrency == 'JPY'){
                icon = 'Ұ';
              }else if(r.contractCurrency == 'USD'){
                icon = '$';
              }else if(r.contractCurrency == 'EUR'){
                icon = '€';
              }
              // return icon + iegAmount(t,'total')
              const obj = {
                children: icon + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          },
          {
            title: '税率(%)',
            dataIndex: 'contractTaxRate',
            width:120,
            align:"center",
          },
          {
            title: '税额',
            dataIndex: 'tax',
            width:120,
            align:"center",
            customRender:function (t,r,index) {
              let icon = "";
              if(r.contractCurrency == 'RMB'){
                icon = '¥';
              }else if(r.contractCurrency == 'JPY'){
                icon = 'Ұ';
              }else if(r.contractCurrency == 'USD'){
                icon = '$';
              }else if(r.contractCurrency == 'EUR'){
                icon = '€';
              }
              // return icon + iegAmount(t,'total')
              let amount = preciseNum(Number(r.contractAmountTax) - Number(r.contractAmount),2);
              const obj = {
                children: icon + iegAmount(Math.trunc(amount),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          },
          // {
          //   title: '已付金额',
          //   dataIndex: 'payRate',
          //   align:"center",
          //   width:120,
          // },
          {
            title: '已开票比例(%)',
            dataIndex: 'invoiceRate',
            align:"center",
            width:120,
          },
          // {
          //   title: '交期',
          //   dataIndex: 'planDeliveryDate',
          //   align:"center",
          //   width:120,
          // },
        ],
				width: '90%',
				visible: false,
				disableSubmit: false
			}
		},
		methods: {
      handleTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        //TODO 筛选
        console.log(pagination)
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        this.ipagination = pagination;
        this.loadData();
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
      },
      batchAdd(){
        let selectedRowKeys = this.selectedRowKeys;
        if(selectedRowKeys == null || selectedRowKeys.length == 0){
          this.$message.error("请选择需要添加的设备");
          return;
        }
        this.$emit('ok', this.selectionRows);
      },
      searchQuery() {
        this.loadData(1);
      },
      searchReset() {
        this.queryParam = {}
        this.loadData(1);
      },
      loadData(arg) {
        this.visible = true;
        this.selectedRowKeys = [];
        this.selectionRows = [];
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }

        let url = "/srm/stkIoBill/fetchDetailPageList";
        var param = this.queryParam;
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        param.suppId = this.suppId;
        param.currency = this.currency;
        getAction(url, param).then((res) => {
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
      handleCancel() {
				this.visible = false;
			},
		}
	}
</script>

<style scoped>
</style>
