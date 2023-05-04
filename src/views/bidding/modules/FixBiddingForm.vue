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
      <a-card :bordered="false">
        <!-- 查询区域 -->
        <div>
          <h2>定标现场 {{model.biddingNo}}</h2>
        </div>
        <a-row style="margin-top: 10px;z-index: 999" v-for="(item,index) in recordList">
          <a-col :span="6">
            标的:{{item.prodCode}}
          </a-col>
          <a-col :span="6">
            标的名称:{{item.prodName}}
          </a-col>
          <a-col :span="6">
            标的数量:{{item.qty}}
          </a-col>
          <!--        <a-col :span="6">-->
          <!--          <a @click="handleChild(item)">查看配套产品</a>-->
          <!--        </a-col>-->

          <a-table
            :ref="'table' + index"
            size="middle"
            bordered
            rowKey="id"
            :scroll="{x:1800}"
            :columns="columns"
            :dataSource="item.childList"
            :pagination="false">
            <template slot="attachment" slot-scope="text,record">
              <j-upload v-model="record.attachment" :trigger-change="true" disabled></j-upload>
            </template>

            <template slot="amount" slot-scope="text,record">
              <a @click="handleChild(record)">{{text}}</a>
            </template>

            <template slot="comment" slot-scope="text,record">
              <a @click="handleEdit(record)">查看评标详情</a>
            </template>

            <template slot="biddingQty" slot-scope="text,record,idx">
              <a-input-number v-model="record.biddingQty" style="width: 100%"
                              :disabled="record.isRecommend != '1' || ptype == 'view'"></a-input-number>
            </template>

            <template slot="supBrandName" slot-scope="text,record,idx">
              <a-input v-model="record.supBrandName" style="width: 100%"
                       :disabled="ptype == 'view'" v-if="record.quoteRecordId != null && record.quoteRecordId != undefined"></a-input>
            </template>

            <template slot="supSpeType" slot-scope="text,record,idx">
              <a-input v-model="record.supSpeType" style="width: 100%"
                       :disabled="ptype == 'view'" v-if="record.quoteRecordId != null && record.quoteRecordId != undefined"></a-input>
            </template>
          <template slot="supSpeType" slot-scope="text,record,idx">
            <a-input v-model="record.supSpeType" style="width: 100%"
                            :disabled="ptype == 'view'" v-if="record.quoteRecordId != null && record.quoteRecordId != undefined"></a-input>
          </template>
          <template slot="isZb" slot-scope="text,record,idx">
            <a-checkbox v-model="record.isRecommend" @change="checkRadio(record)" :disabled="ptype == 'view'"></a-checkbox>
          </template>

            <template slot="action" slot-scope="text,record">

<!--
              <a-checkbox v-model="record.isRecommend" @change="checkRadio(record)" :disabled="ptype == 'view'"></a-checkbox>

              <span v-if="record.isContract != '1' && record.isBargin == '1' && record.isRecommend == '1' && model.biddingStatus == '3'" style="color: red">
 -->           <span v-if="record.isContract != '1' && record.isBargin == '1' && record.isRecommend == '1' && model.biddingStatus == '3'" style="color: red">
              议价中
            </span>
              <span v-if="record.isContract != '1' && record.isBargin == '2' && record.isRecommend == '1' && model.biddingStatus == '3'" style="color: red">
              已回复
            </span>
              <a v-if="record.isContract != '1' && (record.isBargin == '0' || record.isBargin == '2') && record.isRecommend == '1' && model.biddingStatus == '3'" @click="toBargin(record,item)">再次议价</a>

              <div>
                <a @click="openHistory(record)">历史报价</a>
              </div>
            </template>
          </a-table>
        </a-row>


      </a-card>
      <div class="drawer-footer" style="text-align: center;" >
        <a-button  @click="close" style="margin-left:10px;"  type="primary" ghost>关闭</a-button>
        <a-button  @click="giveUp" style="margin-left:10px;"  type="primary" v-if="ptype == 'open'">整体废标</a-button>
        <a-button  @click="toSubmit" style="margin-left:10px;"  type="primary" v-if="ptype == 'open'">确认定标</a-button>
        <!--      <a-button  style="margin-left:10px;"  type="primary" v-if="ptype == 'view'">生成合同</a-button>-->
      </div>
    </a-spin>

    <bidding-main-to-professional-form ref="modalForm"></bidding-main-to-professional-form>
    <quote-child-form ref="quoteForm"></quote-child-form>
    <bargain-one-form ref="oneForm" @ok="toBack"></bargain-one-form>
    <price-history-form ref="pForm"></price-history-form>

    <a-modal
      title="废标原因"
      width="30%"
      :visible="toFail"
      @ok="submitToFail"
      @cancel="cancelToFail">
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
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import VueDraggableResizable from 'vue-draggable-resizable'
import Sortable from 'sortablejs'
import ListColumnsSetter from '@views/components/ListColumnsSetter'
import { getAction, putAction } from '@api/manage'
import BiddingMainToProfessionalForm from '@views/bidding/modules/BiddingMainToProfessionalForm'
import { isNullOrEmpty, preciseNum } from '@/utils/util'
import { filterDictTextByCache } from '@comp/dict/JDictSelectUtil'
import QuoteChildForm from '@views/bidding/modules/QuoteChildForm'
import {
  iegAmount
} from '@/utils/util'
import BargainOneForm from '@views/bidding/modules/BargainOneForm'
import PriceHistoryForm from '@views/bidding/modules/PriceHistoryForm'
export default {
    name: 'FixBiddingForm',
    mixins:[ mixinDevice],
    props:['userCategory','record'],
    components: {
      VueDraggableResizable,
      Sortable,
      ListColumnsSetter,
      BiddingMainToProfessionalForm,
      QuoteChildForm,
      BargainOneForm,
      PriceHistoryForm
    },
    data () {
      return {
        confirmLoading:false,
        ptype:'',
        toFail:false,
        model:{},
        recordList:[],
        dataSource:[],
        labelCol3: {span: 6},
        wrapperCol3: {span: 18},
        visible:false,
        width:'90%',
        title:'定标现场',
        columns : [
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
            title:'供应商名称',
            align:"center",
            dataIndex: 'name',
            width:180,
          },
          {
            title:'单价',
            dataIndex: 'priceTax',
            width:120,
            // scopedSlots: { customRender: 'amount' }
            customRender:(t,r,index) => {
              let _this = this
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
              const child = _this.$createElement('a', {
                domProps: {
                  innerHTML: icon + iegAmount(t,'total')
                },
                on: {
                  click: function() {
                    _this.handleChild(r)
                  }
                }
              })

              const obj = {
                children: child,
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
          {
            title:'总额',
            dataIndex: 'amount',
            width:120,
            // scopedSlots: { customRender: 'amount' }
            customRender:(t,r,index) => {
              let _this = this
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
              const child = _this.$createElement('a', {
                domProps: {
                  innerHTML: icon + iegAmount(t,'total')
                },
                on: {
                  click: function() {
                    _this.handleChild(r)
                  }
                }
              })

              const obj = {
                children: child,
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
          {
            title:'币种',
            align:"center",
            dataIndex: 'currency',
            customRender: (text) => {
              //字典值替换通用方法
              return filterDictTextByCache('currency_type', text);
            },
            width:140,
          },
          {
            title:'报价及规格配置附件',
            align:"center",
            dataIndex: 'attachment',
            width:160,
            scopedSlots: { customRender: 'attachment' },
          },
          {
            title:'报价明细行备注',
            align:"center",
            dataIndex: 'comment',
            width:160,
            ellipsis:true,
          },
          {
            title:'评分',
            align:"center",
            dataIndex: 'itemTotal',
            width:100,
          },
          {
            title:'联系人',
            align:"center",
            dataIndex: 'contacter',
            width:120,
          },
          {
            title:'联系电话',
            align:"center",
            dataIndex: 'contacterTel',
            width:120,
          },
          {
            title:'报价时间',
            align:"center",
            dataIndex: 'offerTime',
            width:120,
          },
          {
            title:'专家评分意见',
            align:"center",
            dataIndex: 'comment',
            width:120,
            scopedSlots: { customRender: 'comment' }
          },
          {
            title:'中标数量',
            align:"center",
            dataIndex: 'biddingQty',
            width:120,
            scopedSlots: { customRender: 'biddingQty' }
          },
          {
            title:'报价品牌',
            align:"center",
            dataIndex: 'supBrandName',
            width:120,
            scopedSlots: { customRender: 'supBrandName' }
          },
          {
            title:'报价规格',
            align:"center",
            dataIndex: 'supSpeType',
            width:120,
            scopedSlots: { customRender: 'supSpeType' }
          },
          {
            title:'是否中标',
            align:"center",
            dataIndex: 'isRecommend',
            width:120,
            scopedSlots: { customRender: 'isZb' }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        key: 0,
        options:[],
        isorter:{
          column: 'createTime',
          order: 'asc',
        },
        description: '选择专家',
        url: {
          list: "/srm/basProfessionals/list",
        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {

    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    mounted() {

    },
    methods: {
      openHistory(record){
        record.suppId = record.supplierId
        this.$refs.pForm.edit(record);
      },
      toBack(){
        this.fetchDetailList(this.model.id);
      },
      toBargin(record,item){
        record.prodCode = item.prodCode;
        record.prodName = item.prodName;
        record.categoryName = item.categoryName;
        record.speType = item.speType;
        record.qty = record.biddingQty;
        this.$refs.oneForm.edit(record);
      },
      handleChild(item){
        let recordId = item.quoteRecordId;
        this.$refs.quoteForm.edit({recordId:recordId});
      },
      toSubmit(){
        let that = this;
        let url = "/srm/biddingMain/fixBidding";
        let recommendList = [];
        let recordList = that.recordList;
        for(let i = 0; i < recordList.length; i++){
          let row = recordList[i];
          let childList = recordList[i].childList;
          let flag = false;
          let qty = 0;
          for(let j = 0; j < childList.length; j++){
            if(childList[j].isRecommend == '1'){
              flag = true;

              if((isNullOrEmpty(childList[j].biddingQty) ||  childList[j].biddingQty == 0)){
                that.$message.error("标的名称:" + row.prodName + "，中标供应商需要输入中标数量");
                return;
              }
              qty = Number(qty) + Number(childList[j].biddingQty);

              recommendList.push(childList[j]);
            }
          }
          if(!flag){
            that.$message.error("标的名称:" + row.prodName + "，请选择中标供应商");
            return;
          }
          qty = Number(preciseNum(qty,2));
          if(Number(row.qty) < qty){
            that.$message.error("标的名称:" + row.prodName +"，中标数量不能大于标的数量");
            return;
          }
        }

        let param = {
          biddingId:that.model.id,
          recommendList:recommendList
        }
        that.$confirm({
          content: `是否确认提交`,
          onOk: () => {
            that.confirmLoading = true;
            putAction(url,param).then(res => {
              that.$message.success("提交成功");
              that.confirmLoading = false;
              that.close();
              that.$emit('ok');
            }).finally(e => {
              that.confirmLoading = false;
            })
          }
        })
      },
      submitToFail(){
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
              that.cancelToFail();
              that.$emit('ok');
            })
          }
        })
      },
      cancelToFail(){
        this.toFail = false;
      },
      giveUp(){
        this.toFail = true;
        this.model.reason = '';
      },
      checkRadio(record){
        record.biddingQty = null;
        // this.dataSource.filter(item => {
        //   item.isRecommend = 0;
        //   if(record.id == item.id){
        //     item.isRecommend = 1;
        //   }
        // })
      },
      handleEdit(record){
        this.$refs.modalForm.edit(record);
      },
      close(){
        this.visible = false;
      },
      edit(record,type){
        this.visible = true;
        this.ptype = type;
        this.dataSource = [];
        this.recordList = [];
        this.model = Object.assign({}, record);
        this.fetchDetailList(this.model.id);
      },
      fetchDetailList(id){
        let url = "/srm/biddingMain/fetchFixBiddingList";
        let param = {
          id:id
        }
        getAction(url,param).then(res => {
          this.recordList = res.result;
          // if(this.dataSource != null && this.dataSource.length > 0){
          //   this.model.prodCode = this.dataSource[0].prodCode;
          //   this.model.prodName = this.dataSource[0].prodName;
          //   this.model.qty = this.dataSource[0].qty;
          // }
        })
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>
<style>
.resize-table-th {
  position: relative;
}
.table-draggable-handle {
  height: 100% !important;
  bottom: 0;
  left: auto !important;
  right: -5px;
  cursor: col-resize;
  touch-action: none;
  position: absolute;
  top: 0px;
  z-index: 1;
  user-select: auto;
  width: 10px;
  transform: none !important;
}
.resize-table-th .ant-table-header-column .ant-table-column-title .ant-table-selection .ant-checkbox-wrapper .ant-checkbox {
  margin-left: 20px;
}
</style>