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

      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :span='6'>
              <a-form-item label="申请单号">
                <a-input placeholder="请输入申请单号" v-model="queryParam.applyCode"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span='6'>
              <a-form-item label="付款类型">
                <j-dict-select-tag style="width:100%;" v-model="queryParam.payType" placeholder="付款类型" dictCode="payType" />
              </a-form-item>
            </a-col>
            <a-col :span='6'>
              <a-form-item label="合同">
                <j-dict-select-tag v-model="queryParam.contractId" placeholder="合同" dictCode="contract_base,contract_name,id,del_flag = '0'" style="width: 300px"/>
              </a-form-item>
            </a-col>
            <a-col :span='6'>
              <a-form-item label="项目">
                <j-dict-select-tag v-model="queryParam.projectId" placeholder="项目" dictCode="proj_base,proj_name,id,del_flag = '0'" style="width: 300px"/>
              </a-form-item>
            </a-col>
            <a-col :span='6'>
              <a-form-item label="供应商名称">
                <a-input placeholder="请输入供应商名称" v-model="queryParam.suppName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span='6'>
              <a-form-item label="支付方式">
                <j-dict-select-tag style="width:100%;" v-model="queryParam.payMethod" placeholder="支付方式" dictCode="payMethod" />
              </a-form-item>
            </a-col>
            <a-col :span='6'>
              <a-form-item label="币种">
                <j-dict-select-tag style="width:100%;" v-model="queryParam.currency" placeholder="币种" dictCode="currency_type" />
              </a-form-item>
            </a-col>
            <a-col :span='6'>
              <a-form-item label="时间">
                <a-range-picker v-model="queryParam.dateTime" @change="onChange" format="YYYY-MM-DD"/>
              </a-form-item>
            </a-col>

            <a-col :span='6'>
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a-button type="primary" @click="batchRow" icon="plus" style="margin-left: 8px">批量选择</a-button>
            </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div>
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :scroll="{x:true,y:500}"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :rowSelection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange}"
          @change="handleTableChange">
        </a-table>
      </div>
      <div class="drawer-footer" style="text-align: center;">
        <a-button key="cancel" @click="close" style="margin-left:10px;"  type="primary" ghost>关闭</a-button>
      </div>
  </a-drawer>
</template>

<script>

import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import '@/assets/less/TableExpand.less'
import { filterObj } from '@/utils/util'
import { getAction } from '@/api/manage'
import {
  iegAmount
} from '@/utils/util'
export default {
    name: "PurPayModal",
    mixins:[JeecgListMixin],
    components: {
    },
    data () {
      return {
        width:'80%',
        title:'应付记录',
        visible:false,
        totalList:[],
        description: '付款申请管理页面',
        // 表头
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
            title:'付款申请单号',
            align:"center",
            dataIndex: 'applyCode',
            width:180,
          },
          {
            title:'供应商名称',
            align:"center",
            dataIndex: 'suppName',
            width:180,
          },
          {
            title:'项目名称',
            align:"center",
            dataIndex: 'projectName',
            width:160,
          },
          {
            title:'合同名称',
            align:"center",
            dataIndex: 'contractName',
            width:160,
          },
          {
            title:'申请时间',
            align:"center",
            dataIndex: 'createTime',
            width:120,
          },
          {
            title:'币种',
            align:"center",
            dataIndex: 'currency_dictText',
            width:120,
          },
          {
            title:'付款类型',
            align:"center",
            dataIndex: 'payType_dictText',
            width:120,
          },
          {
            title:'支付方式',
            align:"center",
            dataIndex: 'payMethod_dictText',
            width:120,
          },
          {
            title:'付款比例(%)',
            dataIndex: 'payRate',
            width:120,
            customRender:function (t,r,index) {
              const obj = {
                children: t + '%',
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
          {
            title:'付款金额原币',
            dataIndex: 'payAmountOther',
            width:120,
            // customRender:function (t,r,index) {
            //   return iegAmount(t,'total')
            // }
            customRender:function (t,r,index) {
              let icon = "";
              if(r.currency == 'RMB'){
                icon = '¥';
              }else if(r.currency == 'JPY'){
                icon = 'Ұ';
              }else if(r.currency == 'USD'){
                icon = '$';
              }else if(r.currency == 'EUR'){
                icon = '€';
              }
              const obj = {
                children: icon + iegAmount(t,'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
          {
            title:'付款金额本币',
            dataIndex: 'payAmount',
            width:120,
            // customRender:function (t,r,index) {
            //   return iegAmount(t,'total')
            // }
            customRender:function (t,r,index) {
              let icon = "";
              icon = '¥';

              const obj = {
                children: icon + iegAmount(t,'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
          {
            title:'备注',
            align:"center",
            dataIndex: 'comment',
            width:200,
          },
        ],
        url: {
          list: "/srm/purPayApply/list",
          delete: "/srm/purPayApply/delete",
          deleteBatch: "/srm/purPayApply/deleteBatch",
          exportXlsUrl: "/srm/purPayApply/exportXls",
          importExcelUrl: "srm/purPayApply/importExcel",

        },
        dictOptions:{},
        superFieldList:[],
        queryParam:{
          applyStatus:'30'
        },
      }
    },
    created() {

    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      batchRow(){
        let that = this;
        let selectionRows = that.selectionRows;
        if(selectionRows == null || selectionRows.length == 0){
          that.$message.error("请选择需要添加的数据");
          return;
        }
        //判断是否存在不同合同的数据
        let contractId = selectionRows[0].contractId;
        let payMethod = selectionRows[0].payMethod;
        for(let i = 0;i < selectionRows.length; i++){
          if(selectionRows[i].contractId != contractId){
            that.$message.error("同一个付款计划只能是一个合同!");
            return;
          }
          if(selectionRows[i].payMethod != payMethod){
            that.$message.error("同一个付款计划只能是一种支付方式!");
            return;
          }
        }
        that.$emit('back', selectionRows);
      },
      initData(){
        this.visible = true;
        this.searchReset();
      },
      close(){
        this.visible = false;
      },
      searchReset() {
        this.queryParam = {};
        this.selectedRowKeys = [];
        this.selectionRows = [];
        this.loadData(1);
      },
      searchQuery() {
        this.loadData(1);
      },
      onChange(date, dateString) {
        this.queryParam.startTime = dateString[0] + " 00:00:00";
        this.queryParam.endTime = dateString[1] + " 23:59:59";
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
        params.applyStatus = '30';
        params.source = 'actPay';
        params.isPlan = '0';
        this.loading = true;
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