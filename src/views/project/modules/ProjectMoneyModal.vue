<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24" style="margin-left: -8px">
      <a-col :span="6">
        <h2 style="font-size: 18px;font-weight:bold">图例:</h2>
      </a-col>
      <a-col :span="6"></a-col>
      <a-col :span="6">
        <a-tag color="blue" style="font-size: 18px;margin-top: 3px;font-weight:bold" >合同金额与执行金额占比</a-tag>
      </a-col>
      <a-col :span="6">
        <a-tag color="purple" style="font-size: 18px;margin-top: 3px;font-weight:bold" >已付金额与合同金额占比</a-tag>
      </a-col>
<!--      <a-col :span="6">-->
<!--        <a-tag color="green" style="font-size: 18px;margin-top: 3px;font-weight:bold" >开票金额与合同金额占比</a-tag>-->
<!--      </a-col>-->
<!--      <a-col :span="5">-->
<!--        <a-tag color="cyan" style="font-size: 18px;margin-top: 3px;font-weight:bold" >列占比</a-tag>-->
<!--      </a-col>-->
    </a-row>

    <a-row :gutter="24" style="margin-top: 20px">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <a-card class="card-main-index">
          <div class="right-content green-money">
            <div style="display: inline-block;">
              <div class="intu">立项金额</div>
              <div class="cont-data">
                <div>
                  {{iegAmount(Math.trunc(model.projAmount),'total')}}
                </div>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <a-card class="card-main-index">
          <div class="right-content orange-money">
            <div style="display: inline-block;">
              <div class="intu">执行金额</div>
              <div class="cont-data">{{iegAmount(Math.trunc(model.budgetAmount),'total')}}</div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <a-card class="card-main-index">
          <div class="right-content blue-money">
            <div style="display: inline-block;">
              <div class="intu">已签合同金额</div>
              <div class="cont-data">
                <div>
                  {{iegAmount(Math.trunc(model.contractAmountTaxLocal),'total')}}
                </div>
                <div v-if="isNotNullOrEmpty(model.budgetAmount) && model.budgetAmount > 0 && isNotNullOrEmpty(model.contractAmountTaxLocal)">
                  <a-tag color="blue">
                    {{preciseNum(model.contractAmountTaxLocal / model.budgetAmount * 100,2)}}%
                  </a-tag>
                </div>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <a-card class="card-main-index">
          <div class="right-content pink-money">
            <div style="display: inline-block;">
              <div class="intu">已支付金额</div>
              <div class="cont-data">
                <div>
                  {{iegAmount(Math.trunc(model.payAmount),'total')}}
                </div>
                <div v-if="isNotNullOrEmpty(model.contractAmountTaxLocal) && model.contractAmountTaxLocal > 0 && isNotNullOrEmpty(model.payAmount)">
                  <a-tag color="purple">
                    {{preciseNum(model.payAmount / model.contractAmountTaxLocal * 100,2)}}%
                  </a-tag>
                </div>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
<!--      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">-->
<!--        <a-card class="card-main-index">-->
<!--          <div class="right-content green-money">-->
<!--            <div style="display: inline-block;">-->
<!--              <div class="intu">已开票金额</div>-->
<!--              <div class="cont-data">-->
<!--                <div>-->
<!--                  {{iegAmount(Math.trunc(model.invoiceAmount),'total')}}-->
<!--                </div>-->
<!--                <div v-if="isNotNullOrEmpty(model.contractAmountTaxLocal) && model.contractAmountTaxLocal > 0 && isNotNullOrEmpty(model.invoiceAmount)">-->
<!--                  <a-tag color="green">-->
<!--                    {{preciseNum(model.invoiceAmount / model.contractAmountTaxLocal * 100,2)}}%-->
<!--                  </a-tag>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </a-card>-->
<!--      </a-col>-->
    </a-row>
    <a-row :gutter="20">
      <a-divider orientation="left" style="color: #00A0E9">
        项目子类
      </a-divider>
      <a-table
        style="clear:both"
        ref="table"
        size="middle"
        bordered
        :scroll="{x:true,y:300}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false">
      </a-table>
    </a-row>

    <a-row :gutter="24">
      <a-divider orientation="left" style="color: #00A0E9">
        费用类型统计
      </a-divider>
      <a-checkbox-group @change="onChange" style="float: right;margin-right: 10px">
        <a-row>
          <a-col :span="12">
            <a-checkbox value="l">
              列占比
            </a-checkbox>
          </a-col>
          <a-col :span="12">
            <a-checkbox value="h">
              行占比
            </a-checkbox>
          </a-col>
        </a-row>
      </a-checkbox-group>
      <a-table ref="table" size="middle" :scroll="{x:true, y:500}"
               style="margin-left: 15px" bordered
               :columns="columns1" :dataSource="dataSource1" :pagination="false"
               :expandedRowKeys="expandedRowKeys" @expand="handleExpand"
               >

        <template slot="budgetAmount" slot-scope="text,record">
          <div style="text-align: right">
            ¥{{iegAmount(Math.trunc(record.budgetAmount),'total')}}
          </div>
          <div style="float: right" v-if="lf">
            <a-tag color="cyan">
              {{record.budgetAmountLPercent}}%
            </a-tag>
          </div>
        </template>

        <template slot="contractAmount" slot-scope="text,record">
          <div style="text-align: right">
            ¥{{iegAmount(Math.trunc(record.contractAmount),'total')}}
          </div>
          <div style="float: right" v-if="lf">
            <a-tag color="cyan">
              {{record.contractAmountLPercent}}%
            </a-tag>
          </div>
          <div style="float: right" v-if="hf">
            <a-tag color="blue">
              {{record.contractAmountHPercent}}%
            </a-tag>
          </div>
        </template>

        <template slot="payAmount" slot-scope="text,record">
          <div style="text-align: right">
            ¥{{iegAmount(Math.trunc(record.payAmount),'total')}}
          </div>
          <div style="float: right" v-if="lf">
            <a-tag color="cyan">
              {{record.payAmountLPercent}}%
            </a-tag>
          </div>
          <div style="float: right" v-if="hf">
            <a-tag color="purple">
              {{record.payAmountHPercent}}%
            </a-tag>
          </div>
        </template>

        <template slot="invoiceAmount" slot-scope="text,record">
          <div style="text-align: right">
            ¥{{iegAmount(Math.trunc(record.invoiceAmount),'total')}}
          </div>
          <div style="float: right" v-if="lf">
            <a-tag color="cyan">
              {{record.invoiceAmountLPercent}}%
            </a-tag>
          </div>
          <div style="float: right" v-if="hf">
            <a-tag color="green">
              {{record.invoiceAmountHPercent}}%
            </a-tag>
          </div>
        </template>

        <template slot="action" slot-scope="text,record">
          <a v-if="record.isLast == '1'" @click="openList(record)">关联清单</a>
        </template>
      </a-table>
    </a-row>

    <a-drawer
      title="关联清单"
      width=90%
      placement="right"
      :closable="false"
      @close="handleCancel"
      destroyOnClose
      :visible="visible">

      <bas-eqp-modal ref="eqpModal" v-show="isEqp" :projId="nowRow.projectId" :categoryId="nowRow.id"></bas-eqp-modal>
      <bas-not-eqp-modal ref="notEqpModal" v-show="!isEqp" :projId="nowRow.projectId" :categoryId="nowRow.id"></bas-not-eqp-modal>

      <div style="text-align: center;margin-top: 10px">
        <a-button key="cancel" @click="handleCancel" style="margin-left:10px;"  type="primary" ghost>取消</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { getAction } from '@api/manage'
import {
  iegAmount,
  isNullOrEmpty,
  isNotNullOrEmpty,
  preciseNum
} from '@/utils/util'
import BasEqpModal from '@views/project/modules/BasEqpModal'
import BasNotEqpModal from '@views/project/modules/BasNotEqpModal'
export default {
  name: "ProjectMoneyModal",
  components: {
    BasEqpModal,
    BasNotEqpModal
  },
  data() {
    return {
      lf:false,
      hf:false,
      isEqp:false,
      visible:false,
      nowRow:{},
      isNullOrEmpty,
      isNotNullOrEmpty,
      iegAmount,
      preciseNum,
      expandedRowKeys: [],
      columns1:[
        {
          title: '分类名称',
          dataIndex: 'title',
          width:120,
          align:'left',
        },
        {
          title: '执行金额',
          dataIndex: 'budgetAmount',
          width:120,
          scopedSlots: { customRender: 'budgetAmount' }
          // customRender:function (t,r,index) {
          //   let icon = "";
          //   icon = '¥';
          //   const obj = {
          //     children: icon + iegAmount(t,'total'),
          //     attrs: {},
          //   };
          //   obj.attrs.align = 'right';//控制表体内容居右
          //   return obj;
          // }
        },
        {
          title: '合同金额',
          dataIndex: 'contractAmount',
          width:120,
          // customRender:function (t,r,index) {
          //   let icon = "";
          //   icon = '¥';
          //   const obj = {
          //     children: icon + iegAmount(t,'total'),
          //     attrs: {},
          //   };
          //   obj.attrs.align = 'right';//控制表体内容居右
          //   return obj;
          // }
          scopedSlots: { customRender: 'contractAmount' }
        },
        {
          title: '已付金额',
          dataIndex: 'payAmount',
          width:120,
          // customRender:function (t,r,index) {
          //   let icon = "";
          //   icon = '¥';
          //   const obj = {
          //     children: icon + iegAmount(t,'total'),
          //     attrs: {},
          //   };
          //   obj.attrs.align = 'right';//控制表体内容居右
          //   return obj;
          // }
          scopedSlots: { customRender: 'payAmount' }
        },
        {
          title: '已开票金额',
          dataIndex: 'invoiceAmount',
          width:120,
          // customRender:function (t,r,index) {
          //   let icon = "";
          //   icon = '¥';
          //   const obj = {
          //     children: icon + iegAmount(t,'total'),
          //     attrs: {},
          //   };
          //   obj.attrs.align = 'right';//控制表体内容居右
          //   return obj;
          // }
          scopedSlots: { customRender: 'invoiceAmount' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align:'center',
          width:100,
          scopedSlots: { customRender: 'action' },
        },
      ],
      dataSource1:[],
      model:{},
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
          title: '项目子项',
          align:"center",
          dataIndex: 'model_dictText',
          width:160,
        },
        {
          title: '执行金额',
          dataIndex: 'budgetAmount',
          width:120,
          customRender:function (t,r,index) {
            let icon = "";
            icon = '¥';
            // return icon + iegAmount(t,'total')
            const obj = {
              children: icon + iegAmount(Math.trunc(t),'total'),
              attrs: {},
            };
            obj.attrs.align = 'right';//控制表体内容居右
            return obj;
          }
        },
        // {
        //   title: '执行预算',
        //   dataIndex: 'reqAmount',
        //   width:120,
        //   customRender:function (t,r,index) {
        //     return iegAmount(t,'total')
        //   }
        // },
        {
          title: '合同金额',
          dataIndex: 'contractAmount',
          width:120,
          customRender:function (t,r,index) {
            let icon = "";
            icon = '¥';
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
          title: '已付金额',
          dataIndex: 'payAmount',
          width:120,
          customRender:function (t,r,index) {
            let icon = "";
            icon = '¥';
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
          title: '已开票金额',
          dataIndex: 'invoiceAmount',
          width:120,
          customRender:function (t,r,index) {
            let icon = "";
            icon = '¥';
            // return icon + iegAmount(t,'total')
            const obj = {
              children: icon + iegAmount(Math.trunc(t),'total'),
              attrs: {},
            };
            obj.attrs.align = 'right';//控制表体内容居右
            return obj;
          }
        },
      ],
      dataSource:[],
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    onChange(checkedValues) {
      console.log('checked = ', checkedValues);
      this.lf = false;
      this.hf = false;
      if(checkedValues != null && checkedValues.length > 0){
        if(checkedValues.indexOf('l') > -1){
          this.lf = true;
        }else{
          this.lf = false;
        }
        if(checkedValues.indexOf('h') > -1){
          this.hf = true;
        }else{
          this.hf = false;
        }
      }
    },
    handleCancel(){
      this.visible = false;
    },
    openList(record){
      let that = this;
      that.nowRow = record;
      that.visible = true;
      if(record.isEqp == '1'){
        this.isEqp = true;
        setTimeout(() => {
          that.$refs.eqpModal.searchQuery(1);
        }, 300)
      }else{
        this.isEqp = false;
        setTimeout(() => {
          that.$refs.notEqpModal.loadData(1);
        }, 300)
      }
    },
    tableProps() {
      let _this = this
      return {
        // 列表项是否可选择
        /* 					rowSelection: {
                    selectedRowKeys: _this.selectedRowKeys,
                    onChange: (selectedRowKeys) => _this.selectedRowKeys = selectedRowKeys
                  } */
      }
    },
    handleExpand(expanded, record) {
      // 判断是否是展开状态
      if (expanded) {
        //计算列占比
        let childList = record.children;
        if(childList != null && childList.length > 0){
          let budgetAmount = record.budgetAmount;
          let contractAmount = record.budgetAmount;
          let payAmount = record.budgetAmount;
          let invoiceAmount = record.budgetAmount;

          childList.filter(item => {
            if(isNotNullOrEmpty(item.budgetAmount) && isNotNullOrEmpty(budgetAmount) && budgetAmount > 0) {
              let budgetAmountLPercent = preciseNum(Number(item.budgetAmount) / Number(budgetAmount) * 100, 2);
              item.budgetAmountLPercent = budgetAmountLPercent;
            }

            if(isNotNullOrEmpty(item.contractAmount) && isNotNullOrEmpty(contractAmount) && contractAmount > 0) {
              let contractAmountLPercent = preciseNum(Number(item.contractAmount) / Number(contractAmount) * 100, 2);
              item.contractAmountLPercent = contractAmountLPercent;
            }

            if(isNotNullOrEmpty(item.payAmount) && isNotNullOrEmpty(payAmount) && payAmount > 0) {
              let payAmountLPercent = preciseNum(Number(item.payAmount) / Number(payAmount) * 100, 2);
              item.payAmountLPercent = payAmountLPercent;
            }

            if(isNotNullOrEmpty(item.invoiceAmount) && isNotNullOrEmpty(invoiceAmount) && invoiceAmount > 0) {
              let invoiceAmountLPercent = preciseNum(Number(item.invoiceAmount) / Number(invoiceAmount) * 100, 2);
              item.invoiceAmountLPercent = invoiceAmountLPercent;
            }

            if(isNotNullOrEmpty(item.contractAmount) && isNotNullOrEmpty(item.budgetAmount) && item.budgetAmount > 0) {
              let contractAmountHPercent = preciseNum(Number(item.contractAmount) / Number(item.budgetAmount) * 100, 2);
              item.contractAmountHPercent = contractAmountHPercent;
            }

            if(isNotNullOrEmpty(item.payAmount) && isNotNullOrEmpty(item.contractAmount) && item.contractAmount > 0) {
              let payAmountHPercent = preciseNum(Number(item.payAmount) / Number(item.contractAmount) * 100, 2);
              item.payAmountHPercent = payAmountHPercent;
            }

            if(isNotNullOrEmpty(item.invoiceAmount) && isNotNullOrEmpty(item.contractAmount) && item.contractAmount > 0) {
              let invoiceAmountHPercent = preciseNum(Number(item.invoiceAmount) / Number(item.contractAmount) * 100, 2);
              item.invoiceAmountHPercent = invoiceAmountHPercent;
            }

            this.$forceUpdate();
          })
        }
        this.expandedRowKeys.push(record.id)
      } else {
        let keyIndex = this.expandedRowKeys.indexOf(record.id)
        if (keyIndex >= 0) {
          this.expandedRowKeys.splice(keyIndex, 1);
        }
      }
    },
    edit (record) {
      this.model = record;
      this.model.contractAmountTaxLocal = 0;
      this.model.payAmount = 0;
      this.model.reqAmount = 0;
      this.model.invoiceAmount = 0;
      this.lf = false;
      this.hf = false;
      //执行预算
      this.fetchRequestByProjId(record.id);
      //项目合同金额
      this.fetchContractByProjId(record.id);
      //项目已付款
      this.fetchPayAmountByProjId(record.id);
      //项目已开票金额
      this.fetchInvoiceByProjId(record.id);
      //项目子类汇总
      this.fetchChildAmount(record.id);
      //费用类型统计
      this.fetchCategory(record.id);
    },
    fetchCategory(projectId){
      let url = "/srm/projBase/fetchCategoryToAmount";
      let param = {
        projectId:projectId
      }
      getAction(url,param).then(res => {
        this.dataSource1 = res.result;
      })
    },
    fetchChildAmount(projectId){
      let url = "/srm/projBase/fetchChildAmount";
      let param = {
        projectId:projectId
      }
      getAction(url,param).then(res => {
        if(res.result != null){
          this.dataSource = res.result;
          this.$forceUpdate();
        }
      })
    },
    fetchRequestByProjId(projectId){
      let url = "/srm/purchaseRequestMain/fetchRequestByProjId";
      let param = {
        projectId:projectId
      }
      getAction(url,param).then(res => {
        if(res.result != null){
          this.model.reqAmount = res.result.orderTotalAmountTax;
          this.$forceUpdate();
        }
      })
    },
    fetchPayAmountByProjId(projectId){
      let url = "/srm/purPayPlan/fetchPayAmountByProjId";
      let param = {
        projectId:projectId
      }
      getAction(url,param).then(res => {
        if(res.result != null){
          this.model.payAmount = res.result.payAmountCope;
          this.$forceUpdate();
        }
      })
    },
    fetchInvoiceByProjId(projectId){
      let url = "/srm/purchasePayInovice/fetchInvoiceByProjId";
      let param = {
        projectId:projectId
      }
      getAction(url,param).then(res => {
        if(res.result != null && res.result.length > 0){
          this.model.invoiceAmount = res.result[0].invoiceAmountTaxLocal;
        }else{
          this.model.invoiceAmount = 0;
        }
        this.$forceUpdate();
      })
    },
    fetchContractByProjId(projectId){
      let url = "/srm/contractBase/fetchContractByProjId";
      let param = {
        projectId:projectId
      }
      getAction(url,param).then(res => {
        if(res.result != null){
          this.model.contractAmountTaxLocal = res.result.contractAmountTaxLocal;
          this.$forceUpdate();
        }
      })
    }
  }
}
</script>
<style>
.point-div{
  line-height: 50px;
}
.orange-point::before{
  content: " ";
  width: 8px;
  height: 8px;
  background: orange;
  border-radius: 4px;
  display: inline-block;
}
.bule-point::before{
  content: " ";
  width: 8px;
  height: 8px;
  background: #3662EC;
  border-radius: 4px;
  display: inline-block;
}
.gray-point::before{
  content: " ";
  width: 8px;
  height: 8px;
  background: #D8D8D8;
  border-radius: 4px;
  display: inline-block;
}
/* #E8EAF2 */
</style>
<style lang="less" scoped>
.circle-cust{
  position: relative;
  top: 28px;
  left: -100%;
}
.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

/* 首页访问量统计 */
.head-info {
  position: relative;
  text-align: left;
  padding: 0 32px 0 0;
  min-width: 125px;

  &.center {
    text-align: center;
    padding: 0 32px;
  }

  span {
    color: rgba(0, 0, 0, .45);
    display: inline-block;
    font-size: .95rem;
    line-height: 42px;
    margin-bottom: 4px;
  }
  p {
    line-height: 42px;
    margin: 0;
    a {
      font-weight: 600;
      font-size: 1rem;
    }
  }
}

</style>