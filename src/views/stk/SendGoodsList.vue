<template>
  <a-card :bordered="false">
    <div class="card-title">
      收货管理
    </div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="申请单号" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input placeholder="请输入申请编号" v-model="queryParam.billNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="合同名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input placeholder="请输入合同名称" v-model="queryParam.contractName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="合同编码" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input placeholder="请输入合同编码" v-model="queryParam.contractNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="供应商" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input placeholder="请输入供应商" v-model="queryParam.suppName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="申请状态" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-select v-model='queryParam.sendStatus'>
                <a-select-option value='0'>待审核</a-select-option>
                <a-select-option value='1'>驳回</a-select-option>
                <a-select-option value='2'>审核通过</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
          </a-col>
          <a-col :span="6">
          </a-col>

          <a-col :span="6">
            <span style='float: right;overflow: hidden;' class='table-page-search-submitButtons'>
							<a-button type='primary' @click='searchQuery' icon='search'>查询</a-button>
							<a-button type='primary' @click='searchReset' icon='reload' style='margin-left: 8px'>重置</a-button>
               <a-button type="primary" icon="download" @click="handleExportXls('收货管理')" style='margin-left: 8px'>导出</a-button>
						</span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <list-columns-setter v-model="columns" :def-columns="columns" style="float: right;z-index:999" />
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        :scroll="{x:1800,y:500}"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange">
        <template slot="deviceName" slot-scope="text,record">
          <div v-for="item in companyCut(text)">
            {{item}}<br>
          </div>
        </template>

        <template slot="deviceSerialNumber" slot-scope="text,record">
          <div v-for="item in companyCut(text)">
            {{item}}<br>
          </div>
        </template>

        <template slot="qty" slot-scope="text,record">
          <div v-for="item in companyCut(text)">
            {{iegAmount(item, 'total')}}
            <br>
          </div>
        </template>

        <template slot="contractName" slot-scope="text,record">
          <div style="width: 180px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;text-align: center" :title="text">
            {{text}}
          </div>
        </template>

        <template slot="projectName" slot-scope="text,record">
          <div style="width: 180px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;text-align: center" :title="text">
            {{text}}
          </div>
        </template>

        <template slot="billNo" slot-scope="text, record">
          <a @click="handleDetail(record)">{{text}}</a>
        </template>
        <span slot="action" slot-scope="text, record">

          <!--项目中心-->
          <span v-if="roleCode.indexOf('project_center') > -1">
            <a v-if="record.sendStatus == '0'" @click="openUser(record)">指定审核人</a>

            <a-divider type="vertical" v-if="record.sendStatus == '0' && record.roleCode.indexOf('project_center') == -1
                                          && record.approverUser != null && record.approverUser != '' && record.approverUser != undefined"/>

            <a @click="handleApprove(record,'project_center')" v-if="record.sendStatus == '0' && record.roleCode.indexOf('project_center') == -1
                                          && record.approverUser != null && record.approverUser != '' && record.approverUser != undefined">审核</a>
          </span>
          <!--使用部门-->
           <span v-if="$store.getters.userInfo.username == record.approverUser">
            <a @click="handleApprove(record,'prod_line')" v-if="record.sendStatus == '0' && record.roleCode.indexOf('prod_line') == -1">审核</a>
          </span>
        </span>

      </a-table>
    </div>

    <a-drawer
      :title="title"
      width=30%
      placement="right"
      :closable="false"
      :headerStyle="{ textAlign: 'center'}"
      @close="close"
      destroyOnClose
      :visible="visible">
      <j-select-user-by-dep :multi="false" v-model="model.approverUser" @change="toBack"></j-select-user-by-dep>
      <div style="text-align: center;margin-top: 10px">
        <a-button key="approved"  @click="handleOk" type="primary" >提交</a-button>
        <a-button key="cancel" @click="close" style="margin-left:10px;"  type="primary" ghost>取消</a-button>
      </div>
    </a-drawer>

    <send-goods-modal ref="modalForm" @ok="modalFormOk" :roleKey="roleCode"></send-goods-modal>
  </a-card>
</template>

<script>
  import ListColumnsSetter from '@views/components/ListColumnsSetter'
  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { billListMixin } from '../mixins/billListMixin'
  import { billModalMixin } from '../mixins/billModalMixin'
  import SendGoodsModal from './modules/SendGoodsModal'
  import { getAction,postAction } from '@api/manage'
  import { formatDate, iegAmount, isNullOrEmpty } from '@/utils/util'
  export default {
    name: 'SendGoodsList',
    mixins:[JeecgListMixin, mixinDevice,billListMixin, billModalMixin],
    components: {
      SendGoodsModal,
      ListColumnsSetter
    },
    data () {
      return {
        model:{},
        title:'指定审核人',
        visible:false,
        iegAmount,
        roleCode:'',
        description: 'SendGoodsList',
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
            title:'发货申请单号',
            align:"center",
            dataIndex: 'billNo',
            width:130,
            sorter: true,
            scopedSlots: { customRender: 'billNo' }
          },
          {
            title:'项目名称',
            align:"center",
            dataIndex: 'projectName',
            width:180,
            sorter: true,
            scopedSlots: { customRender: 'projectName' }
          },
          {
            title:'供应商',
            align:"center",
            dataIndex: 'suppName',
            sorter: true,
            width:140,
          },
          {
            title:'合同名称',
            align:"center",
            dataIndex: 'contractName',
            sorter: true,
            width:180,
            scopedSlots: { customRender: 'contractName' }
          },
          {
            title:'合同编码',
            align:"center",
            width:140,
            sorter: true,
            dataIndex: 'contractNumber'
          },
          {
            title:'设备名称',
            align:"center",
            dataIndex: 'deviceName',
            width:150,
            scopedSlots: { customRender: 'deviceName' }
          },
          {
            title:'设备序号',
            align:"center",
            dataIndex: 'deviceSerialNumber',
            width:150,
            scopedSlots: { customRender: 'deviceSerialNumber' }
          },
          {
            title:'数量',
            align:"center",
            dataIndex: 'qty',
            width:120,
            scopedSlots: { customRender: 'qty' }
          },
          {
            title:'发货日期',
            align:"center",
            dataIndex: 'sendTime',
            sorter: true,
            width:120,
          },
          {
            title:'申请状态',
            align:"center",
            sorter: true,
            dataIndex: 'sendStatus',
            width:120,
            customRender:function (t,r,index) {
               if(t == '0'){
                 return '待审核';
               }else if(t == '1'){
                 return '驳回';
               }else if(t == '2'){
                 return '审批通过';
               }
            }
          },

          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:100,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/srm/stkIoBill/list",
          delete: "/srm/stkIoBill/delete",
          deleteBatch: "/srm/stkIoBill/deleteBatch",
          exportXlsUrl: "/srm/stkIoBill/exportXls1",
          importExcelUrl: "srm/stkIoBill/importExcel",

        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
      this.getSuperFieldList();
      this.getRoleCode();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      toBack(usernames,rows){

      },
      handleOk(){
        let that = this;
        that.$confirm({
          title:"提交",
          content:"是否确认提交?",
          onOk: function(){
            let url = "/srm/stkIoBill/toApproverUser";
            postAction(url,that.model).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.close();
                that.loadData();
              }else{
                that.$message.warning(res.message);
              }
            });
          }
        });
      },
      close(){
        this.visible = false;
      },
      openUser(record){
        let model = JSON.parse(JSON.stringify(record));
        this.model = model;
        this.visible = true;
      },
      companyCut(name){
        let company=name.split(";")
        return company
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
        if(isNullOrEmpty(params.sendStatus)){
          params.sendStatus = '0,1,2'
        }
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
      handleDetail:function(record){
        this.$refs.modalForm.action = 'detail';
        this.$refs.modalForm.edit(record);
        this.$refs.modalForm.title="详情";
        this.$refs.modalForm.disableSubmit = true;
      },
      handleApprove:function(record,roleCode){
        this.$refs.modalForm.action = 'approve';
        this.$refs.modalForm.roleCode = roleCode;
        this.$refs.modalForm.edit(record);
        this.$refs.modalForm.title="详情";
        this.$refs.modalForm.disableSubmit = true;
      },
      getRoleCode(){
        let url = "/sys/user/getRoleCodeByUserId";
        getAction(url,{}).then(res => {
          this.roleCode = res.result.roleCode;
        })
      },
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'invoiceId',text:'开票ID'})
        fieldList.push({type:'string',value:'applyId',text:'付款申请单号'})
        fieldList.push({type:'number',value:'invoiceAmount',text:'开票金额（未税）'})
        fieldList.push({type:'number',value:'invoiceAmountTax',text:'开票金额（含税）'})
        fieldList.push({type:'number',value:'invoiceAmountLocal',text:'开票金额（未税）'})
        fieldList.push({type:'number',value:'invoiceAmountTaxLocal',text:'开票金额（含税）'})
        fieldList.push({type:'string',value:'delFlag',text:'删除标志'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>