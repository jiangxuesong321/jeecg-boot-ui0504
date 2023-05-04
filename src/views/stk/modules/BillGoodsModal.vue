<template>
	<a-drawer title="入库明细" :width="width" placement="right" :closable="false" :headerStyle="{ textAlign: 'center'}"
		@close="handleCancel" destroyOnClose :visible="visible">
    <div class="table-page-search-wrapper">

    </div>
    <a-button type='primary' @click='batchAdd' icon='plus' style='margin-left: 8px'>批量添加</a-button>
    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      class="j-table-force-nowrap"
      :rowSelection="{selectedRowKeys, onChange: onSelectChange, type: multiple ? 'checkbox':'radio'}"
      :scroll="{x:true,y:500}"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false">

    </a-table>
		<div class="drawer-footer" style="text-align: center;margin-top:15px;">
			<a-button key="cancel" @click="handleCancel" style="margin-left:10px;" type="primary" ghost>取消</a-button>
		</div>
	</a-drawer>
</template>

<script>

	import { preciseNum } from '@/utils/util'
  import { getAction } from '@api/manage'

  export default {
		name: 'BillGoodsModal',
    props:['id'],
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
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title: '物料编码',
            dataIndex: 'prodCode',
            width:140,
          },
          {
            title: '物料名称',
            dataIndex: 'prodName',
            width:180,
          },
          {
            title: '规格型号',
            dataIndex: 'prodSpecType',
            width:120,
          },
          {
            title: '计量单位',
            dataIndex: 'unitId_dictText',
            width:120,
          },
          {
            title: '入库数量',
            dataIndex: 'hasInQty',
            width:120,
          },
          {
            title: '已退货数量',
            dataIndex: 'hasReturnQty',
            width:120,
          },
        ],
				width: '90%',
				visible: false,
				disableSubmit: false
			}
		},
		methods: {
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

        let url = "/srm/stkIoBill/queryDetailListByMainId";
        var param = this.queryParam;
        param.id = this.id;
        getAction(url, param).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records||res.result;
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
