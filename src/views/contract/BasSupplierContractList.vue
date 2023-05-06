<template >
  <a-card :bordered="false" id="show">
    <div class="card-title">
      合同列表
    </div>
    <div>
      <a-tabs defaultActiveKey="all" v-model="tabKey" @change="handleChange">
        <a-tab-pane tab="招投标" key="1">
          <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter.native="searchQuery">
              <a-row :gutter="24">
                <a-col :xl="6" :lg="7" :md="8" :sm="24">
                  <a-form-item label="合同编号">
                    <a-input placeholder="请输入合同编号" v-model="queryParam.contractNumber"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :xl="6" :lg="7" :md="8" :sm="24">
                  <a-form-item label="项目名称">
                    <a-input placeholder="请输入项目名称" v-model="queryParam.projName"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :xl="6" :lg="7" :md="8" :sm="24">
                  <a-form-item label="标的名称">
                    <a-input placeholder="请输入标的名称" v-model="queryParam.prodName"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :xl="6" :lg="7" :md="8" :sm="24">
                  <a-form-item label="供应商">
                    <a-input placeholder="请输入供应商" v-model="queryParam.contractSecondParty"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a-button type="primary" icon="download" @click="handleExportXls('合同列表')" style='margin-left: 8px'>导出</a-button>
            </span>
                </a-col>
              </a-row>
            </a-form>
          </div>

          <div class="table-operator">
            <list-columns-setter v-model="columns1" :def-columns="columns1" style="float: right;z-index:999" />
          </div>
          <!-- table区域-begin -->
          <div>
            <a-row>
              <a-col :span="4">
                台套数统计:{{total.qtyNum}}
              </a-col>
              <a-col :span="4">
                合同金额:{{total.contractAmountTaxLocal}}
              </a-col>
              <a-col :span="4">
                已付款金额:{{total.payAmountTaxLocal}}
              </a-col>
              <a-col :span="4">
                已开票金额:{{total.invoiceAmountTaxLocal}}
              </a-col>
            </a-row>
            <a-table
              ref="table"
              size="middle"
              :scroll="{x:1800,y:500}"
              bordered
              rowKey="id"
              :customRow="customRow"
              :columns="columns1"
              :dataSource="dataSource"
              :pagination="ipagination"
              :loading="loading"
              @change="handleTableChange">

              <template slot="contractNumber" slot-scope="text,record">
                <a @click="handleDetail(record)">{{text}}</a>
              </template>

              <template slot="projName" slot-scope="text,record">
                <div style="width: 160px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="text">
                  {{text}}
                </div>
              </template>

              <template slot="prodName" slot-scope="text,record">
                <div style="width: 160px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="text">
                  {{text}}
                </div>
              </template>

              <template slot="prodBrand" slot-scope="text,record">
                <div style="width: 160px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="text">
                  {{text}}
                </div>
              </template>

              <template slot="contractSecondParty" slot-scope="text,record">
                <div style="width: 160px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="text">
                  {{text}}
                </div>
              </template>

              <template slot="contractStatus_dictText" slot-scope="text,record">
                <a v-if="record.contractStatus > 3" @click="openRecord(record)">{{text}}</a>
                <span v-else>{{text}}</span>
              </template>
              <span slot="action" slot-scope="text, record">
              <a v-if="record.contractStatus == '4'"  @click='uploadFile(record)'>OA附件回传</a>
              <a-divider type="vertical" v-if="record.contractStatus == '4'"/>
                    <!--草稿的编辑-->
              <a @click="handleEdit(record)" v-if="record.contractStatus == '0'">编辑</a>
              <a-divider type="vertical" v-if="record.contractStatus == '0'"/>
                    <!--供应商编辑-->
              <a @click="handleEdit(record)" v-if="(record.contractStatus == '5') && record.isDisabled == '1'">编辑</a>
              <a-divider type="vertical" v-if="(record.contractStatus == '5') && record.isDisabled == '1'"/>

              <a @click="handleAp(record)" v-if="record.contractStatus == '2' && record.isDisabled == '1'">审核</a>
              <a-divider type="vertical" v-if="record.contractStatus == '2'  && record.isDisabled == '1'"/>

              <a @click="handleDetail(record)">查看合同</a>
              <a-divider type="vertical" v-if="record.contractStatus == '8' || record.contractStatus == '3'"/>
              <a @click="handleApprove(record)" v-if="record.contractStatus == '8' || record.contractStatus == '3'">手工录入OA节点</a>

              <a-divider type="vertical" v-if="record.contractStatus == '4' && record.reqType == '0' && (record.mainId == null || record.mainId == '' || record.mainId == undefined)"/>
              <a @click="createChildContract(record)" v-if="record.contractStatus == '4' && record.reqType == '0' && (record.mainId == null || record.mainId == '' || record.mainId == undefined)">生成子合同</a>
            </span>

                </a-table>
              </div>
        </a-tab-pane>
        <a-tab-pane tab="询比价" key="0">
          <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter.native="searchQuery">
              <a-row :gutter="24">
                <a-col :xl="6" :lg="7" :md="8" :sm="24">
                  <a-form-item label="合同编号">
                    <a-input placeholder="请输入合同编号" v-model="queryParam.contractNumber"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :xl="6" :lg="7" :md="8" :sm="24">
                  <a-form-item label="合同名称">
                    <a-input placeholder="请输入合同名称" v-model="queryParam.contractName"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a-button type="primary" icon="download" @click="handleExportXls('合同列表')" style='margin-left: 8px'>导出</a-button>
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
            <a-row>
              <a-col :span="4">
                台套数统计:{{total.qtyNum}}
              </a-col>
              <a-col :span="4">
                金额统计:{{total.contractAmountTaxLocal}}
              </a-col>
              <a-col :span="4">
                已付款统计:{{total.payAmountTaxLocal}}
              </a-col>
              <a-col :span="4">
                已开票统计:{{total.invoiceAmountTaxLocal}}
              </a-col>
            </a-row>
            <a-table
              ref="table"
              size="middle"
              :scroll="{x:1800,y:500}"
              bordered
              :customRow="customRow"
              rowKey="id"
              :columns="columns"
              :dataSource="dataSource"
              :pagination="ipagination"
              :loading="loading"
              @change="handleTableChange">

              <template slot="contractNumber" slot-scope="text,record">
                <a @click="handleDetail(record)">{{text}}</a>
              </template>

              <template slot="projName" slot-scope="text,record">
                <div style="width: 160px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="text">
                  {{text}}
                </div>
              </template>

              <template slot="prodName" slot-scope="text,record">
                <div style="width: 160px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="text">
                  {{text}}
                </div>
              </template>

              <template slot="prodBrand" slot-scope="text,record">
                <div style="width: 160px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="text">
                  {{text}}
                </div>
              </template>

              <template slot="contractSecondParty" slot-scope="text,record">
                <div style="width: 160px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="text">
                  {{text}}
                </div>
              </template>

              <template slot="contractStatus_dictText" slot-scope="text,record">
                <a v-if="record.contractStatus > 3" @click="openRecord(record)">{{text}}</a>
                <span v-else>{{text}}</span>
              </template>
              <span slot="action" slot-scope="text, record">
                <a v-if="record.contractStatus == '4'"  @click='uploadFile(record)'>OA附件回传</a>
                <a-divider type="vertical" v-if="record.contractStatus == '4'"/>
                      <!--草稿的编辑-->
                <a @click="handleEdit(record)" v-if="record.contractStatus == '0'">编辑</a>
                <a-divider type="vertical" v-if="record.contractStatus == '0'"/>
                      <!--供应商编辑-->
                <a @click="handleEdit(record)" v-if="(record.contractStatus == '5') && record.isDisabled == '1'">编辑</a>
                <a-divider type="vertical" v-if="(record.contractStatus == '5') && record.isDisabled == '1'"/>

                <a @click="handleAp(record)" v-if="record.contractStatus == '2' && record.isDisabled == '1'">审核</a>
                <a-divider type="vertical" v-if="record.contractStatus == '2'  && record.isDisabled == '1'"/>

                <a @click="handleDetail(record)">查看合同</a>
                <a-divider type="vertical" v-if="record.contractStatus == '8' || record.contractStatus == '3'"/>
                <a @click="handleApprove(record)" v-if="record.contractStatus == '8' || record.contractStatus == '3'">手工录入OA节点</a>

                <a-divider type="vertical" v-if="record.contractStatus == '4' && record.reqType == '0' && (record.mainId == null || record.mainId == '' || record.mainId == undefined)"/>
                <a @click="createChildContract(record)" v-if="record.contractStatus == '4' && record.reqType == '0' && (record.mainId == null || record.mainId == '' || record.mainId == undefined)">生成子合同</a>
              </span>

            </a-table>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <!-- 查询区域 -->

    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->

    <contract-base-modal ref="modalForm" @ok="modalFormOk"/>
    <approve-modal ref="approveModal" type="OA"></approve-modal>
    <contract-base-child-modal ref="childForm" @ok="modalFormOk"></contract-base-child-modal>

    <a-drawer
      title="OA审批"
      width=40%
      placement="right"
      :closable="false"
      :headerStyle="{ textAlign: 'center'}"
      @close="handleCancel"
      destroyOnClose
      :visible="visible">
      <a-form-model ref="form" :model="model">
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="审核节点" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
              <a-input v-model="model.name"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="审核人" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
              <a-input v-model="model.approver"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="泛微单号" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
              <a-input v-model="model.processCode"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="审核状态" :labelCol="spans.labelCol1" :wrapperCol="spans.wrapperCol1">
              <j-dict-select-tag v-model="model.contractStatus" placeholder="请选择审核状态" dictCode="oa_status"/>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <div style="text-align: left;">
          <a-button key="cancel" @click="handleCancel"  type="primary" ghost>取消</a-button>
          <a-button  @click="handleOk" type="primary" style="margin-left:10px;" >提交</a-button>
      </div>
    </a-drawer>


    <j-modal
      title="附件管理"
      width="30%"
      :visible="visible1"
      :maskClosable="false"
      switchFullscreen
      :fullscreen="false"
      @cancel="handleClose">
      <template slot="footer">
        <a-button key="submit" @click="handleClose" type="primary" >取消</a-button>
        <a-button key="submit" @click="handleSubmit" type="primary" >提交</a-button>
      </template>
      <j-upload v-model="ruleForm.oaAttachment" :trigger-change="true" ></j-upload>
    </j-modal>

  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { downFile, getAction, putAction } from '@api/manage'
  import ContractBaseModal from './modules/ContractBaseModal'
  import ListColumnsSetter from '@views/components/ListColumnsSetter'
  import Vue from 'vue'
  import Sortable from 'sortablejs'
  import ApproveModal from '@views/contract/modules/ApproveModal'
  import {
    iegAmount
  } from '@/utils/util'
  import ContractBaseChildModal from '@views/contract/modules/ContractBaseChildModal'

  let columns = [
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
      title:'合同编号',
      align:"center",
      dataIndex: 'contractNumber',
      sorter: true,
      width:150,
      scopedSlots: { customRender: 'contractNumber' }
    },
    // {
    //   title:'合同名称',
    //   align:"center",
    //   dataIndex: 'contractName',
    //   sorter: true,
    //   width:160,
    // },
    // {
    //   title:'项目名称',
    //   align:"center",
    //   sorter: true,
    //   dataIndex: 'projName',
    //   width:160,
    //   scopedSlots: { customRender: 'projName' }
    // },
    {
      title:'标的名称',
      align:"center",
      sorter: true,
      dataIndex: 'prodName',
      width:160,
      scopedSlots: { customRender: 'prodName' }
    },
    {
      title:'设备单价',
      align:"center",
      sorter: true,
      dataIndex: 'prodName',
      width:120,
    },
    {
      title:'设备数量',
      align:"center",
      sorter: true,
      dataIndex: 'qtyNum',
      width:120,
    },
    // {
    //   title:'品牌',
    //   align:"center",
    //   sorter: true,
    //   dataIndex: 'brandName',
    //   width:160,
    //   scopedSlots: { customRender: 'brandName' }
    // },
    {
      title:'供应商名称',
      align:"center",
      sorter: true,
      dataIndex: 'contractSecondParty',
      width:160,
      scopedSlots: { customRender: 'contractSecondParty' }
    },
    // {
    //   title:'询报价编号',
    //   align:"center",
    //   dataIndex: 'inquiryCode',
    //   sorter: true,
    //   width:150,
    // },
    // {
    //   title:'项目标题',
    //   align:"center",
    //   dataIndex: 'projName',
    //   sorter: true,
    //   width:160,
    // },
    // {
    //   title:'合同类型',
    //   align:"center",
    //   dataIndex: 'contractType_dictText',
    //   width:120,
    // },
    {
      title:'合同币种',
      align:"center",
      dataIndex: 'contractCurrency_dictText',
      sorter: true,
      width:120,
    },
    {
      title:'合同金额(原币)',
      dataIndex: 'contractAmountTax',
      sorter: true,
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
      title:'合同金额(本币)',
      dataIndex: 'contractAmountTaxLocal',
      sorter: true,
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
      title:'合同状态',
      align:"center",
      dataIndex: 'contractStatus_dictText',
      sorter: true,
      width:120,
      scopedSlots: { customRender: 'contractStatus_dictText' }
    },
    // {
    //   title:'已付总金额(原币)',
    //   dataIndex: 'payAmountOther',
    //   sorter: true,
    //   width:120,
    //   customRender:function (t,r,index) {
    //     let icon = "";
    //     if(r.contractCurrency == 'RMB'){
    //       icon = '¥';
    //     }else if(r.contractCurrency == 'JPY'){
    //       icon = 'Ұ';
    //     }else if(r.contractCurrency == 'USD'){
    //       icon = '$';
    //     }else if(r.contractCurrency == 'EUR'){
    //       icon = '€';
    //     }
    //     // return icon + iegAmount(t,'total')
    //     const obj = {
    //       children: icon + iegAmount(Math.trunc(t),'total'),
    //       attrs: {},
    //     };
    //     obj.attrs.align = 'right';//控制表体内容居右
    //     return obj;
    //   }
    // },
    // {
    //   title:'已付总金额(本币)',
    //   dataIndex: 'payAmount',
    //   sorter: true,
    //   width:120,
    //   customRender:function (t,r,index) {
    //     let icon = "";
    //     icon = '¥';
    //     // return icon + iegAmount(t,'total')
    //     const obj = {
    //       children: icon + iegAmount(Math.trunc(t),'total'),
    //       attrs: {},
    //     };
    //     obj.attrs.align = 'right';//控制表体内容居右
    //     return obj;
    //   }
    // },
    // {
    //   title:'已开发票',
    //   dataIndex: 'invoiceAmount',
    //   sorter: true,
    //   width:120,
    //   customRender:function (t,r,index) {
    //     let icon = "";
    //     if(r.contractCurrency == 'RMB'){
    //       icon = '¥';
    //     }else if(r.contractCurrency == 'JPY'){
    //       icon = 'Ұ';
    //     }else if(r.contractCurrency == 'USD'){
    //       icon = '$';
    //     }else if(r.contractCurrency == 'EUR'){
    //       icon = '€';
    //     }
    //     // return icon + iegAmount(t,'total')
    //     const obj = {
    //       children: icon + iegAmount(Math.trunc(t),'total'),
    //       attrs: {},
    //     };
    //     obj.attrs.align = 'right';//控制表体内容居右
    //     return obj;
    //   }
    // },
    // {
    //   title:'生效时间',
    //   align:"center",
    //   sorter: true,
    //   dataIndex: 'contractValidDate',
    //   width:120,
    // },
    {
      title: '操作',
      dataIndex: 'action',
      align:"center",
      width:170,
      scopedSlots: { customRender: 'action' }
    }
  ];
  const draggingMap = {};
  columns.forEach(col => {
    draggingMap[col.key] = col.width;
  });
  const draggingState = Vue.observable(draggingMap);
  const ResizeableTitle = (h, props, children) => {
    let thDom = null;
    const {
      key,
      ...restProps
    } = props;
    const col = columns.find(col => {
      const k = col.dataIndex || col.key;
      return k === key;
    });
    if (!col.width) {
      return h('th', {
        ...restProps
      }, [
        children
      ])
    }
    const onDrag = x => {
      draggingState[key] = 0;
      col.width = Math.max(x, 1);
    };
    const onDragstop = () => {
      draggingState[key] = thDom.getBoundingClientRect().width;
    };
    return (
      h('th', {
        ...restProps,
        attrs: {
          width: col.width,
        },
        'v-ant-ref': r => (thDom = r),
        class: 'resize-table-th'
      }, [
        children,
        h('vue-draggable-resizable', {
          class: 'table-draggable-handle',
          on: {
            dragging: onDrag,
            dragstop: onDragstop
          },
          key: col.key,
          props: {
            w: 10,
            x: draggingState[key] || col.width,
            z: 1000,
            axis: 'x',
            resizable: false,
          }
        })
      ])
    );
  };

  export default {
    name: 'BasSupplierContractList',
    mixins:[JeecgListMixin, mixinDevice],
    props:['suppId'],
    components: {
      ContractBaseModal,
      ListColumnsSetter,
      ApproveModal,
      ContractBaseChildModal
    },
    data () {
      return {
        total:{
          qtyNum:0,
          contractAmountTaxLocal:0,
          payAmountTaxLocal:0,
          invoiceAmountTaxLocal:0
        },
        spans: {
          labelCol1: {span: 3},
          wrapperCol1: {span: 21},
        },
        visible1:false,
        ruleForm:{},
        isorter:{
          column: 'createTime',
          order: 'desc',
        },
        isDisabled:false,
        model:{},
        visible:false,
        columns,
        tabKey:'1',
        description: '供应商合同管理页面',
        // 表头
        columns1: [
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
            title:'合同编号',
            align:"center",
            sorter: true,
            dataIndex: 'contractNumber',
            width:150,
            scopedSlots: { customRender: 'contractNumber' }
          },
          // {
          //   title:'合同名称',
          //   align:"center",
          //   sorter: true,
          //   dataIndex: 'contractName',
          //   width:160,
          // },
          // {
          //   title:'项目名称',
          //   align:"center",
          //   sorter: true,
          //   dataIndex: 'projName',
          //   width:160,
          //   scopedSlots: { customRender: 'projName' }
          // },
          {
            title:'标的名称',
            align:"center",
            sorter: true,
            dataIndex: 'prodName',
            width:160,
            scopedSlots: { customRender: 'prodName' }
          },
          {
            title:'供应商名称',
            align:"center",
            sorter: true,
            dataIndex: 'contractSecondParty',
            width:160,
            scopedSlots: { customRender: 'contractSecondParty' }
          },
          // {
          //   title:'招投标编号',
          //   align:"center",
          //   sorter: true,
          //   dataIndex: 'biddingNo',
          //   width:150,
          // },

          // {
          //   title:'合同类型',
          //   align:"center",
          //   dataIndex: 'contractType_dictText',
          //   width:120,
          // },
          {
            title:'合同币种',
            align:"center",
            sorter: true,
            dataIndex: 'contractCurrency_dictText',
            width:120,
          },
          {
            title:'合同金额(原币)',
            sorter: true,
            dataIndex: 'contractAmountTax',
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
            title:'合同金额(本币)',
            sorter: true,
            dataIndex: 'contractAmountTaxLocal',
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
            title:'合同状态',
            align:"center",
            sorter: true,
            dataIndex: 'contractStatus_dictText',
            width:120,
            scopedSlots: { customRender: 'contractStatus_dictText' }
          },
          // {
          //   title:'已付总金额(原币)',
          //   dataIndex: 'payAmountOther',
          //   sorter: true,
          //   width:120,
          //   customRender:function (t,r,index) {
          //     let icon = "";
          //     if(r.contractCurrency == 'RMB'){
          //       icon = '¥';
          //     }else if(r.contractCurrency == 'JPY'){
          //       icon = 'Ұ';
          //     }else if(r.contractCurrency == 'USD'){
          //       icon = '$';
          //     }else if(r.contractCurrency == 'EUR'){
          //       icon = '€';
          //     }
          //     // return icon + iegAmount(t,'total')
          //     const obj = {
          //       children: icon + iegAmount(Math.trunc(t),'total'),
          //       attrs: {},
          //     };
          //     obj.attrs.align = 'right';//控制表体内容居右
          //     return obj;
          //   }
          // },
          // {
          //   title:'已付总金额(本币)',
          //   dataIndex: 'payAmount',
          //   sorter: true,
          //   width:120,
          //   customRender:function (t,r,index) {
          //     let icon = "";
          //     icon = '¥';
          //     // return icon + iegAmount(t,'total')
          //     const obj = {
          //       children: icon + iegAmount(Math.trunc(t),'total'),
          //       attrs: {},
          //     };
          //     obj.attrs.align = 'right';//控制表体内容居右
          //     return obj;
          //   }
          // },
          // {
          //   title:'已开发票',
          //   dataIndex: 'invoiceAmount',
          //   sorter: true,
          //   width:120,
          //   customRender:function (t,r,index) {
          //     let icon = "";
          //     if(r.contractCurrency == 'RMB'){
          //       icon = '¥';
          //     }else if(r.contractCurrency == 'JPY'){
          //       icon = 'Ұ';
          //     }else if(r.contractCurrency == 'USD'){
          //       icon = '$';
          //     }else if(r.contractCurrency == 'EUR'){
          //       icon = '€';
          //     }
          //     // return icon + iegAmount(t,'total')
          //     const obj = {
          //       children: icon + iegAmount(Math.trunc(t),'total'),
          //       attrs: {},
          //     };
          //     obj.attrs.align = 'right';//控制表体内容居右
          //     return obj;
          //   }
          // },
          // {
          //   title:'生效时间',
          //   align:"center",
          //   dataIndex: 'contractValidDate',
          //   sorter: true,
          //   width:120,
          // },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:170,
            scopedSlots: { customRender: 'action' }
          }
        ],

        url: {
          list: "/srm/contractBase/list",
          delete: "/srm/basSupplierContract/delete",
          deleteBatch: "/srm/basSupplierContract/deleteBatch",
          exportXlsUrl: "/srm/contractBase/exportXls",
          importExcelUrl: "srm/basSupplierContract/importExcel",

        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
      this.fetchTotal();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    mounted() {
      this.columnsDrop()
      // watermark.set(this.$store.getters.userInfo.realname,this.$store.getters.userInfo.username)
      // this.checkApprove()
    },
    methods: {
      searchReset() {
        this.queryParam = {}
        this.loadData(1);
        this.fetchTotal();
      },
      searchQuery() {
        this.loadData(1);
        this.fetchTotal();
      },
      fetchTotal(){
        this.total = {
          qtyNum:0,
          contractAmountTaxLocal:0,
          payAmountTaxLocal:0,
          invoiceAmountTaxLocal: 0,
        }
        var params = this.getQueryParams();//查询条件
        params.source = this.tabKey;
        params.contractSecondPartyId = this.suppId;

        //台套数统计
        let url = "/srm/contractBase/fetchQtyNum";
        getAction(url,params).then(res => {
          if(res.result != null){
            this.total.qtyNum = res.result.qtyNum;
          }
        })
        //金额统计
        url = "/srm/contractBase/fetchContractAmountTaxLocal";
        getAction(url,params).then(res => {
          if(res.result != null){
            this.total.contractAmountTaxLocal = res.result.contractAmountTaxLocal;
          }
        })

        //付款统计
        url = "/srm/contractBase/fetchPayAmountTaxLocal";
        getAction(url,params).then(res => {
          if(res.result != null){
            this.total.payAmountTaxLocal = res.result.payAmountTaxLocal;
          }
        })

        //开票统计
        url = "/srm/contractBase/fetchInvoiceAmountTaxLocal";
        getAction(url,params).then(res => {
          if(res.result != null){
            this.total.invoiceAmountTaxLocal = res.result.invoiceAmountTaxLocal;
          }
        })
      },
      customRow(record, index) {
        return {
          style: {
            // 行背景色
            'background-color': index % 2 == 0 ? '#EEEEEE' : '#FFFFFF',
          }
        }
      },
      handleExportXls(fileName){
        if(!fileName || typeof fileName != "string"){
          fileName = "导出文件"
        }
        let param = this.getQueryParams();
        param.source = this.tabKey;
        downFile(this.url.exportXlsUrl,param).then((data)=>{
          if (!data) {
            this.$message.warning("文件下载失败")
            return
          }
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data],{type: 'application/vnd.ms-excel'}), fileName+'.xls')
          }else{
            let url = window.URL.createObjectURL(new Blob([data],{type: 'application/vnd.ms-excel'}))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName+'.xls')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link); //下载完成移除元素
            window.URL.revokeObjectURL(url); //释放掉blob对象
          }
        })
      },
      handleSubmit(){
        let url = "/srm/contractBase/uploadOaAttachment";
        let that = this;
        that.$confirm({
          content: `是否确认提交?`,
          onOk: () => {
            putAction(url,that.ruleForm).then(res => {
              if(res.success){
                that.$message.success("提交成功");
                that.handleClose();
              }else{
                that.$message.error("提交失败");
              }
            })
          }
        })
      },
      handleClose(){
        this.visible1 = false;
      },
      uploadFile(record){
        this.ruleForm = {};
        this.visible1 = true;

        this.ruleForm =  JSON.parse(JSON.stringify(record));
      },
      createChildContract(record){
        this.$refs.childForm.edit(record);
      },
      checkApprove() {
        let url = "/srm/approveSetting/checkApprove";
        getAction(url, {type:'contract'}).then(res => {
          if(res.success){
            this.isDisabled = res.result;
          }
        })
      },
      openRecord(record){
        this.$refs.approveModal.visible = true;
        this.$refs.approveModal.loadData(record.id);
      },
      handleCancel(){
        this.visible = false;
      },
      handleOk(){
        let that = this;
        let url = "/srm/contractBase/toApprove";
        putAction(url,that.model).then(res => {
          that.$message.success("提交成功");
          that.handleCancel();
          that.searchQuery();
        })
      },
      handleApprove(record){
        this.model = JSON.parse(JSON.stringify(record));
        // this.model.contractStatus = null;
        // this.model.isLast = 0;
        this.model.approver = null;
        this.visible = true;
      },
      columnsDrop() {
        const wrapperTr = document.querySelector('.ant-table-thead tr')
        this.sortable = Sortable.create(wrapperTr, {
          animation: 180,
          delay: 0,
          handle: '.ant-table-header-column', //~~可进行拖拽对应的类名~~~~~~
          onEnd: evt => {
            const oldItem = this.columns[evt.oldIndex]
            this.columns.splice(evt.oldIndex, 1)
            this.columns.splice(evt.newIndex, 0, oldItem)
            console.log(this.columns)
            /**
             此处是因为在拖拽后，内容排序正常，表头错乱的问题 ---强制进行了重新渲染
             **/
            this.key += 1;
            this.$nextTick(() => {
              this.columnsDrop();
            });
          }
        })
      },
      handleDetail(record){
        this.$refs.modalForm.detail(record);
      },
      handleAp(record){
        this.$refs.modalForm.editThree(record);
      },
      handleEdit(record){
        this.$refs.modalForm.editTwo(record);
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
        params.source = this.tabKey;
        params.contractSecondPartyId = this.suppId;
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
      handleChange(tabKey){
        this.searchReset();
      },

    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>
<style>
#show{
  position: relative;
  z-index: 99;
  overflow: hidden;
}
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

.ant-table {
  margin-top: 40px;
}
</style>