<template>
  <a-card :bordered="false">
    <div class="card-title">
      资金计划报表
    </div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="计划月份" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-month-picker v-model="queryParam.month" placeholder="请输入月份" style="width: 100%"  valueFormat="YYYY-MM"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="项目名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
<!--              <a-input v-model="queryParam.projName"></a-input>-->
              <j-multi-select-tag style="width: 100%;" v-model="queryParam.projectId"
                                 @change="fetchModelByProjId"
                                 placeholder="请选择项目" dictCode="proj_base,proj_name,id,del_flag = '0' order by create_time desc"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所属地区" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input v-model="queryParam.subject"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="供应商全称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <a-input v-model="queryParam.suppName" style="margin-left: 13px;width: 97%"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="产品模块名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <j-dict-select-tag v-model="queryParam.model" placeholder="请选择产品模块名称" dictCode="model"
                                 v-if="queryParam.projectId == undefined || queryParam.projectId == null || queryParam.projectId == ''"/>

              <a-select v-model="queryParam.model"  placeholder="请选择项目子项"
                        v-if="queryParam.projectId != undefined && queryParam.projectId != null && queryParam.projectId != ''">
                <a-select-option
                  v-for="item in modelList"
                  :key="item.value"
                  :value="item.value">
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="6">
            <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
            <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            <a-button type="primary" icon="download" @click="handleExportXls('资金计划报表')" style='margin-left: 8px'>导出</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <list-columns-setter v-model="columns" :def-columns="columns" style="float: right;" />
    </div>

    <div>
      <div class="card-title">
        <a style="font-size: 18px" @click="openDrawer('currency')">
          币种汇总
        </a>
        <a style="font-size: 18px;color: orange;margin-left: 20px" @click="openDrawer('payMethod')">
          支付方式汇总
        </a>
        <a  style="font-size: 18px;color: #00DB00;margin-left: 20px" @click="openDrawer('area')">
          地区汇总
        </a>
      </div>

      <a-table
        style="margin-top: -30px"
        ref="table"
        size="middle"
        :scroll="{x:true}"
        bordered
        rowKey="id"
        :key="key"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange">
        <template slot="leadTime" slot-scope="text,record">
          <div v-if="text != null && text != '' && text != undefined">
            <div v-for="(item,index) in text.split(';')">
              {{item}}
            </div>
          </div>
        </template>

        <template slot="payMethod" slot-scope="text,record">
          <div v-if="text != null && text != '' && text != undefined">
            <div v-for="(item,index) in text.split(';')">
              {{item}}
            </div>
          </div>
        </template>

        <template slot="payType" slot-scope="text,record">
          <div v-if="text != null && text != '' && text != undefined">
            <div v-for="(item,index) in text.split(';')">
              {{item}}
            </div>
          </div>
        </template>

        <template slot="payRate" slot-scope="text,record">
          <div v-if="text != null && text != '' && text != undefined">
            <div v-for="(item,index) in text.split(';')">
              {{item}}
            </div>
          </div>
        </template>

        <template slot="sort" slot-scope="text,record">
          <div v-if="text != null && text != '' && text != undefined">
            <div v-for="(item,index) in text.split(';')" style="width: 100px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="text">
              {{item}}
            </div>
          </div>
        </template>


        <template slot="isContract" slot-scope="text,record">
          <div v-if="text != null && text != '' && text != undefined">
            <div v-for="(item,index) in text.split(';')">
              <a-checkbox default-checked disabled v-if="item == '1'">
              </a-checkbox>
            </div>
          </div>
        </template>

        <template slot="isReceive" slot-scope="text,record">
          <div v-if="text != null && text != '' && text != undefined">
            <div v-for="(item,index) in text.split(';')">
              <a-checkbox default-checked disabled v-if="item == '1'">
              </a-checkbox>
            </div>
          </div>
        </template>
        <template slot="isSend" slot-scope="text,record">
          <div v-if="text != null && text != '' && text != undefined">
            <div v-for="(item,index) in text.split(';')">
              <a-checkbox default-checked disabled v-if="item == '1'">
              </a-checkbox>
            </div>
          </div>
        </template>
        <template slot="isQa" slot-scope="text,record">
          <div v-if="text != null && text != '' && text != undefined">
            <div v-for="(item,index) in text.split(';')">
              <a-checkbox default-checked disabled v-if="item == '1'">
              </a-checkbox>
            </div>
          </div>
        </template>
        <template slot="isSettle" slot-scope="text,record">
          <div v-if="text != null && text != '' && text != undefined">
            <div v-for="(item,index) in text.split(';')">
              <a-checkbox default-checked disabled v-if="item == '1'">
              </a-checkbox>
            </div>
          </div>
        </template>
        <template slot="isQaDue" slot-scope="text,record">
          <div v-if="text != null && text != '' && text != undefined">
            <div v-for="(item,index) in text.split(';')">
              <a-checkbox default-checked disabled v-if="item == '1'">
              </a-checkbox>
            </div>
          </div>
        </template>
        <template slot="isInvoice" slot-scope="text,record">
          <div v-if="text != null && text != '' && text != undefined">
            <div v-for="(item,index) in text.split(';')">
              <a-checkbox default-checked disabled v-if="item == '1'">
              </a-checkbox>
            </div>
          </div>
        </template>
        <template slot="isCheck" slot-scope="text,record">
          <div v-if="text != null && text != '' && text != undefined">
            <div v-for="(item,index) in text.split(';')">
              <a-checkbox default-checked disabled v-if="item == '1'">
              </a-checkbox>
            </div>
          </div>
        </template>
        <template slot="isProgress" slot-scope="text,record">
          <div v-if="text != null && text != '' && text != undefined">
            <div v-for="(item,index) in text.split(';')">
              <a-checkbox default-checked disabled v-if="item == '1'">
              </a-checkbox>
            </div>
          </div>
        </template>

      </a-table>
    </div>

    <a-drawer
      :title="title"
      :width = 'width'
      placement="right"
      :closable="false"
      :headerStyle="{ textAlign: 'center'}"
      @close="handleCancel"
      destroyOnClose
      :visible="visible">
      <a-table
        ref="table1"
        size="middle"
        :scroll="{x:true}"
        bordered
        :columns="columns1"
        :dataSource="childList"
        :pagination="false">
      </a-table>
      <div style="text-align: left;">
        <a-button key="cancel" @click="handleCancel"  type="primary" ghost>取消</a-button>
      </div>
    </a-drawer>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { iegAmount } from '@/utils/util'
import { billListMixin } from '../mixins/billListMixin'
import { billModalMixin } from '../mixins/billModalMixin'
import ListColumnsSetter from '@views/components/ListColumnsSetter'
import Vue from 'vue'
import Sortable from 'sortablejs'
import { getAction } from '@/api/manage'

// let columns = [
//   {
//     title: '序号',
//     dataIndex: '',
//     key: 'rowIndex',
//     width: 60,
//     align: 'center',
//     customRender: function(t, r, index) {
//       return parseInt(index) + 1
//     }
//   },
//   // {
//   //   title: '资金分类',
//   //   align: 'center',
//   //   dataIndex: 'categoryName',
//   //   sorter: true,
//   //   width: 180
//   // },
//   {
//     title: '所属地区',
//     align: 'center',
//     dataIndex: 'subject',
//     sorter: true,
//     width: 120
//   },
//   {
//     title: '供应商全称',
//     align: 'center',
//     dataIndex: 'suppName',
//     sorter: true,
//     width: 180
//   },
//   {
//     title: '项目名称',
//     align: 'center',
//     dataIndex: 'projName',
//     sorter: true,
//     width: 180
//   },
//   {
//     title: '产品模块名称',
//     align: 'center',
//     dataIndex: 'model_dictText',
//     sorter: true,
//     width: 120
//   },
//
//   {
//     title: '合同号',
//     align: 'center',
//     dataIndex: 'contractNumber',
//     sorter: true,
//     width: 120
//   },
//   {
//     title: '物料名称',
//     align: 'center',
//     dataIndex: 'prodName',
//     sorter: true,
//     width: 120
//   },
//   {
//     title: '设备型号',
//     align: 'center',
//     dataIndex: 'speType',
//     sorter: true,
//     width: 120
//   },
//   // {
//   //   title: '设备产地',
//   //   align: 'center',
//   //   dataIndex: 'country',
//   //   sorter: true,
//   //   width: 120
//   // },
//   {
//     title: '合同数量',
//     dataIndex: 'qty',
//     width: 100,
//     sorter: true,
//     customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
//       const obj = {
//         children: value,
//         attrs: {},
//       };
//       obj.attrs.align = 'right';//控制表体内容居右
//       return obj;
//     }
//   },
//   {
//     title: '支付数量',
//     dataIndex: 'payQty',
//     sorter: true,
//     width: 100,
//     customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
//       const obj = {
//         children: value,
//         attrs: {},
//       };
//       obj.attrs.align = 'right';//控制表体内容居右
//       return obj;
//     }
//   },
//   {
//     title: '设备单价',
//     dataIndex: 'contractPriceTax',
//     sorter: true,
//     width: 100,
//     // customRender:function (t,r,index) {
//     //   return iegAmount(t,'total')
//     // }
//     customRender:function (t,r,index) {
//       let icon = "";
//       if(r.contractCurrency == 'RMB'){
//         icon = '¥';
//       }else if(r.contractCurrency == 'JPY'){
//         icon = '￥';
//       }else if(r.contractCurrency == 'USD'){
//         icon = '$';
//       }else if(r.contractCurrency == 'EUR'){
//         icon = '€';
//       }
//       const obj = {
//         children: icon + iegAmount(Math.trunc(t),'total'),
//         attrs: {},
//       };
//       obj.attrs.align = 'right';//控制表体内容居右
//       return obj;
//       // return icon + iegAmount(t,'total')
//     },
//   },
//   {
//     title: '合同总额',
//     dataIndex: 'contractAmountTax',
//     sorter: true,
//     width: 100,
//     customRender:function (t,r,index) {
//       let icon = "";
//       if(r.contractCurrency == 'RMB'){
//         icon = '¥';
//       }else if(r.contractCurrency == 'JPY'){
//         icon = '￥';
//       }else if(r.contractCurrency == 'USD'){
//         icon = '$';
//       }else if(r.contractCurrency == 'EUR'){
//         icon = '€';
//       }
//       const obj = {
//         children: icon + iegAmount(Math.trunc(t),'total'),
//         attrs: {},
//       };
//       obj.attrs.align = 'right';//控制表体内容居右
//       return obj;
//       // return icon + iegAmount(t,'total')
//     },
//   },
//   {
//     title: '货期',
//     align: 'center',
//     dataIndex: 'leadTime',
//     width: 120
//   },
//   {
//     title: '支付方式',
//     align: 'center',
//     dataIndex: 'payMethod_dictText',
//     sorter: true,
//     width: 120
//   },
//   {
//     title: '付款类型',
//     align: 'center',
//     dataIndex: 'payType_dictText',
//     sorter: true,
//     width: 120
//   },
//   {
//     title: '币种',
//     align: 'center',
//     dataIndex: 'contractCurrency',
//     sorter: true,
//     width: 120
//   },
//   {
//     title: '付款比例',
//     align: 'center',
//     dataIndex: 'payRate',
//     sorter: true,
//     width: 120
//   },
//   {
//     title: '本月计划付款(原币)',
//     dataIndex: 'payAmount',
//     sorter: true,
//     width: 120,
//     customRender:function (t,r,index) {
//       let icon = "";
//       if(r.contractCurrency == 'RMB'){
//         icon = '¥';
//       }else if(r.contractCurrency == 'JPY'){
//         icon = '￥';
//       }else if(r.contractCurrency == 'USD'){
//         icon = '$';
//       }else if(r.contractCurrency == 'EUR'){
//         icon = '€';
//       }
//       const obj = {
//         children: icon + iegAmount(Math.trunc(t),'total'),
//         attrs: {},
//       };
//       obj.attrs.align = 'right';//控制表体内容居右
//       return obj;
//     },
//   },
//   {
//     title: '本月计划付款(本币)',
//     dataIndex: 'payAmountLocal',
//     sorter: true,
//     width: 120,
//     customRender:function (t,r,index) {
//       let icon = "";
//       icon = '¥';
//       const obj = {
//         children: icon + iegAmount(Math.trunc(t),'total'),
//         attrs: {},
//       };
//       obj.attrs.align = 'right';//控制表体内容居右
//       return obj;
//     },
//   },
//   {
//     title: '资料',
//     align: 'center',
//     children:[
//       {
//         title: '合同',
//         dataIndex: 'contract',
//         width: 100,
//       },
//       {
//         title: '发货通知',
//         dataIndex: 'send',
//         width: 100,
//       },
//       {
//         title: '到货签收单',
//         dataIndex: 'receive',
//         width: 100,
//       },
//       {
//         title: '验收报告',
//         dataIndex: 'check',
//         width: 100,
//       },
//       {
//         title: '进度资料',
//         dataIndex: 'progress',
//         width: 100,
//       },
//       {
//         title: '质保函',
//         dataIndex: 'qa',
//         width: 100,
//       },
//       {
//         title: '结算资料',
//         dataIndex: 'settle',
//         width: 100,
//       },
//       {
//         title: '质保到期单',
//         dataIndex: 'qaDue',
//         width: 100,
//       },
//       {
//         title: '发票/形式发票',
//         dataIndex: 'invoice',
//         width: 100,
//       },
//     ]
//   }
// ]
// const draggingMap = {}
// columns.forEach(col => {
//   draggingMap[col.key] = col.width
// })
// const draggingState = Vue.observable(draggingMap)
// const ResizeableTitle = (h, props, children) => {
//   let thDom = null
//   const { key, ...restProps } = props
//   // const col = columns.find(col => {
//   //   const k = col.dataIndex || col.key;
//   //   return k === key;
//   // });
//   let col = null
//   if (key === 'selection-column') {
//     //支持复选框
//     col = {
//       dataIndex: 'selection-column',
//       key: 'selection-column',
//       width: 40
//     }
//
//   } else if (key === 'rc-table-expand-icon-cell') {
//     col = {
//       dataIndex: 'rc-table-expand-icon-cell',
//       key: 'rc-table-expand-icon-cell',
//       width: 40
//     }
//   } else {
//     col = columns.find(col => {
//       const k = col.dataIndex || col.key
//       return k === key
//     })
//   }
//   if (!col.width) {
//     return h('th', {
//       ...restProps
//     }, [
//       children
//     ])
//   }
//   const onDrag = x => {
//     draggingState[key] = 0
//     col.width = Math.max(x, 1)
//   }
//   const onDragstop = () => {
//     draggingState[key] = thDom.getBoundingClientRect().width
//   }
//   return (
//     h('th', {
//       ...restProps,
//       attrs: {
//         width: col.width
//       },
//       'v-ant-ref': r => (thDom = r),
//       class: 'resize-table-th'
//     }, [
//       children,
//       h('vue-draggable-resizable', {
//         class: 'table-draggable-handle',
//         on: {
//           dragging: onDrag,
//           dragstop: onDragstop
//         },
//         key: col.key,
//         props: {
//           w: 10,
//           x: draggingState[key] || col.width,
//           z: 1000,
//           axis: 'x',
//           resizable: false
//         }
//       })
//     ])
//   )
// }

export default {
  name: 'ProjectBudget',
  mixins: [JeecgListMixin, mixinDevice, billListMixin, billModalMixin],
  components: {
    ListColumnsSetter
  },
  data() {
    // this.components = {
    //   header: {
    //     cell: ResizeableTitle
    //   }
    // }
    return {
      modelList:[],
      width:'60%',
      columns1:[],
      childList:[],
      title:'',
      visible:false,
      iegAmount,
      model:{},
      isorter: {
        column: 'contractNumber',
        order: 'desc'
      },
      queryParam:{
        month:'',
      },
      multiple:false,
      treeData:[],
      key: 0,
      columns:[
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        // {
        //   title: '资金分类',
        //   align: 'center',
        //   dataIndex: 'categoryName',
        //   sorter: true,
        //   width: 180
        // },
        {
          title: '所属地区',
          align: 'center',
          dataIndex: 'subject',
          sorter: true,
          width: 120
        },
        {
          title: '供应商全称',
          align: 'center',
          dataIndex: 'suppName',
          sorter: true,
          width: 180
        },
        {
          title: '项目名称',
          align: 'center',
          dataIndex: 'projName',
          sorter: true,
          width: 180
        },
        {
          title: '产品模块名称',
          align: 'center',
          dataIndex: 'model_dictText',
          sorter: true,
          width: 125
        },

        {
          title: '合同号',
          align: 'center',
          dataIndex: 'contractNumber',
          sorter: true,
          width: 120
        },
        {
          title: '设备名称',
          align: 'center',
          dataIndex: 'prodName',
          sorter: true,
          width: 120
        },
        {
          title: '设备型号',
          align: 'center',
          dataIndex: 'speType',
          sorter: true,
          width: 120
        },
        // {
        //   title: '设备产地',
        //   align: 'center',
        //   dataIndex: 'country',
        //   sorter: true,
        //   width: 120
        // },
        {
          title: '合同数量',
          dataIndex: 'qty',
          width: 100,
          sorter: true,
          customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
            const obj = {
              children: value,
              attrs: {},
            };
            obj.attrs.align = 'center';//控制表体内容居右
            return obj;
          }
        },
        {
          title: '支付数量',
          dataIndex: 'payQty',
          sorter: true,
          width: 100,
          customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
            const obj = {
              children: value,
              attrs: {},
            };
            obj.attrs.align = 'center';//控制表体内容居右
            return obj;
          }
        },
        {
          title: '设备序号',
          dataIndex: 'sort',
          align: 'center',
          sorter: true,
          width: 120,
          scopedSlots: { customRender: 'sort' },
        },
        {
          title: '设备单价',
          dataIndex: 'contractPriceTax',
          sorter: true,
          width: 100,
          // customRender:function (t,r,index) {
          //   return iegAmount(t,'total')
          // }
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
            const obj = {
              children: icon + iegAmount(Math.trunc(t),'total'),
              attrs: {},
            };
            obj.attrs.align = 'right';//控制表体内容居右
            return obj;
            // return icon + iegAmount(t,'total')
          },
        },
        {
          title: '合同总额',
          dataIndex: 'contractAmountTax',
          sorter: true,
          width: 100,
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
            const obj = {
              children: icon + iegAmount(Math.trunc(t),'total'),
              attrs: {},
            };
            obj.attrs.align = 'right';//控制表体内容居右
            return obj;
            // return icon + iegAmount(t,'total')
          },
        },
        {
          title: '货期',
          align: 'center',
          dataIndex: 'leadTime',
          width: 140,
          scopedSlots: { customRender: 'leadTime' },
        },
        {
          title: '支付方式',
          align: 'center',
          dataIndex: 'payMethod',
          scopedSlots: { customRender: 'payMethod' },
          sorter: true,
          width: 120
        },
        {
          title: '付款类型',
          align: 'center',
          dataIndex: 'payType',
          sorter: true,
          width: 120,
          scopedSlots: { customRender: 'payType' },
        },
        {
          title: '币种',
          align: 'center',
          dataIndex: 'contractCurrency_dictText',
          sorter: true,
          width: 120
        },
        {
          title: '付款比例(%)',
          align: 'center',
          dataIndex: 'payRate',
          sorter: true,
          width: 120,
          scopedSlots: { customRender: 'payRate' },
        },
        {
          title: '本月计划付款(原币)',
          dataIndex: 'payAmount',
          sorter: true,
          width: 120,
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
            const obj = {
              children: icon + iegAmount(Math.trunc(t),'total'),
              attrs: {},
            };
            obj.attrs.align = 'right';//控制表体内容居右
            return obj;
            // return icon + iegAmount(t,'total')
          },
        },
        {
          title: '本月计划付款(本币)',
          dataIndex: 'payAmountLocal',
          sorter: true,
          width: 120,
          customRender:function (t,r,index) {
            let icon = "";
            icon = '¥';
            const obj = {
              children: icon + iegAmount(Math.trunc(t),'total'),
              attrs: {},
            };
            obj.attrs.align = 'right';//控制表体内容居右
            return obj;
            // return icon + iegAmount(t,'total')
          },
        },
        {
          title: '资料',
          align: 'center',
          dataIndex: 'otherColumn',
          children:[
            {
              title: '合同',
              dataIndex: 'isContract',
              width: 100,
              scopedSlots: { customRender: 'isContract' },
            },
            {
              title: '发货通知',
              dataIndex: 'isSend',
              width: 100,
              scopedSlots: { customRender: 'isSend' },
            },
            {
              title: '到货签收单',
              dataIndex: 'isReceive',
              width: 100,
              scopedSlots: { customRender: 'isReceive' },
            },
            {
              title: '验收报告',
              dataIndex: 'isCheck',
              width: 100,
              scopedSlots: { customRender: 'isCheck' },
            },
            {
              title: '进度资料',
              dataIndex: 'isProgress',
              width: 100,
              scopedSlots: { customRender: 'isProgress' },
            },
            {
              title: '保函',
              dataIndex: 'isQa',
              width: 100,
              scopedSlots: { customRender: 'isQa' },
            },
            {
              title: '结算资料',
              dataIndex: 'isSettle',
              width: 100,
              scopedSlots: { customRender: 'isSettle' },
            },
            {
              title: '质保到期单',
              dataIndex: 'isQaDue',
              width: 100,
              scopedSlots: { customRender: 'isQaDue' },
            },
            {
              title: '发票/形式发票',
              dataIndex: 'isInvoice',
              width: 100,
              scopedSlots: { customRender: 'isInvoice' },
            },
          ]
        }
      ],
      description: 'proj_base管理页面',
      url: {
        list: '/srm/report/fetchAmountPlanPageList',
        exportXlsUrl: "/srm/report/exportAmountPlanPageList",
      },
      dictOptions: {},
      superFieldList: []
    }
  },
  created() {
    this.getNowDate();
    this.initData();
    this.fetchTotalAmount();
  },
  mounted() {
    // this.columnsDrop()
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    fetchModelByProjId(){
      let url = "/srm/projBase/fetchModelByProjId";
      let param = {
        id:this.queryParam.projectId
      };
      getAction(url,param).then(res => {
        this.modelList = res.result;
      })
    },

    handleCancel(){
      this.visible = false;
    },
    openDrawer(type){
      this.width = '60%';
      if(type == 'currency'){
        this.title = "币种汇总";
        this.columns1 = [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: 'center',
            customRender: function(t, r, index) {
              return parseInt(index) + 1
            }
          },
          {
            title: '币种',
            align: 'center',
            dataIndex: 'contractCurrency_dictText',
            width: 120,
          },
          {
            title: '原币金额',
            align: 'center',
            dataIndex: 'payAmount',
            width: 120,
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
              const obj = {
                children: icon + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
          {
            title: '本币金额',
            align: 'center',
            dataIndex: 'payAmountLocal',
            width: 120,
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
              const obj = {
                children: icon + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },

          },
        ]
      }else if(type == 'payMethod'){
        this.title = "支付方式汇总";
        this.columns1 = [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: 'center',
            customRender: function(t, r, index) {
              return parseInt(index) + 1
            }
          },
          {
            title: '支付方式',
            align: 'center',
            dataIndex: 'payMethod_dictText',
            width: 120
          },
          {
            title: '本币金额',
            align: 'center',
            dataIndex: 'payAmountLocal',
            width: 120,
            customRender:function (t,r,index) {
              let icon = "";
              icon = '¥';
              const obj = {
                children: icon + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
        ]
      }else if(type == 'area'){
        this.width = '90%';
        this.title = "地区汇总";
        this.columns1 = [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: 'center',
            customRender: function(t, r, index) {
              return parseInt(index) + 1
            }
          },
          {
            title: '地区',
            align: 'center',
            dataIndex: 'subject_dictText',
            width: 120
          },
          {
            title: '项目名称',
            align: 'center',
            dataIndex: 'projName',
            width: 160
          },
          {
            title: '预付款',
            align: 'center',
            dataIndex: 'payAmount1',
            width: 120,
            customRender:function (t,r,index) {
              let icon = "";
              icon = '¥';
              const obj = {
                children: icon + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
          {
            title: '发货款',
            align: 'center',
            dataIndex: 'payAmount2',
            width: 120,
            customRender:function (t,r,index) {
              let icon = "";
              icon = '¥';
              const obj = {
                children: icon + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
          {
            title: '到货款',
            align: 'center',
            dataIndex: 'payAmount3',
            width: 120,
            customRender:function (t,r,index) {
              let icon = "";
              icon = '¥';
              const obj = {
                children: icon + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
          {
            title: '验收款',
            align: 'center',
            dataIndex: 'payAmount4',
            width: 120,
            customRender:function (t,r,index) {
              let icon = "";
              icon = '¥';
              const obj = {
                children: icon + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
          {
            title: '进度款',
            align: 'center',
            dataIndex: 'payAmount5',
            width: 120,
            customRender:function (t,r,index) {
              let icon = "";
              icon = '¥';
              const obj = {
                children: icon + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
          {
            title: '结算款',
            align: 'center',
            dataIndex: 'payAmount6',
            width: 120,
            customRender:function (t,r,index) {
              let icon = "";
              icon = '¥';
              const obj = {
                children: icon + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
          {
            title: '质保款',
            align: 'center',
            dataIndex: 'payAmount7',
            width: 120,
            customRender:function (t,r,index) {
              let icon = "";
              icon = '¥';
              const obj = {
                children: icon + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
          {
            title: '小计',
            align: 'center',
            dataIndex: 'totalAmount',
            width: 120,
            customRender:function (t,r,index) {
              let icon = "";
              icon = '¥';
              const obj = {
                children: icon + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
              // return icon + iegAmount(t,'total')
            },
          },
        ]
      }
      this.visible = true;
      this.childList = [];
      let url = "/srm/report/fetchAmountByTypePlanPageList";
      let param = this.queryParam;
      param.type = type;
      getAction(url,param).then(res => {
        this.childList = res.result;
      })
    },
    fetchTotalAmount(){
      let url = "/srm/report/fetchGroupAmountPlanPageList";
      getAction(url, this.queryParam).then((res) => {
        this.model = res.result;
      })
    },
    getNowDate(){
      let date = new Date();
      let year = date.getFullYear(); //获取完整的年份(4位)
      let month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      this.queryParam.month = year + '-' + month;
    },
    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      console.log(pagination)
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field;
        this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
      }
      this.ipagination = pagination;
      this.initData();
    },
    searchQuery() {
      this.initData(1);
      this.fetchTotalAmount();
      // 点击查询清空列表选中行
      this.selectedRowKeys = []
      this.selectionRows = []
    },
    searchReset() {
      this.queryParam = {}
      this.initData(1);
      this.fetchTotalAmount();
    },
    initData(arg){
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams()//查询条件
      this.loading = true
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
          this.dataSource = res.result.records || res.result
          if (res.result.total) {
            this.ipagination.total = res.result.total
          } else {
            this.ipagination.total = 0
          }
          //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    loadData(arg) {

    },
    // 列拖拽的初始化~~~~
    // columnsDrop() {
    //   const wrapperTr = document.querySelector('.ant-table-thead tr')
    //   this.sortable = Sortable.create(wrapperTr, {
    //     animation: 180,
    //     delay: 0,
    //     handle: '.ant-table-header-column', //~~可进行拖拽对应的类名~~~~~~
    //     onEnd: evt => {
    //       const oldItem = this.columns[evt.oldIndex - 1]
    //       this.columns.splice(evt.oldIndex - 1, 1)
    //       this.columns.splice(evt.newIndex - 1, 0, oldItem)
    //       console.log(this.columns)
    //       /**
    //        此处是因为在拖拽后，内容排序正常，表头错乱的问题 ---强制进行了重新渲染
    //        **/
    //       this.key += 1
    //       this.$nextTick(() => {
    //         this.columnsDrop()
    //       })
    //     }
    //   })
    // }
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
<style>
/*.resize-table-th {*/
/*  position: relative;*/
/*}*/

/*.table-draggable-handle {*/
/*  height: 100% !important;*/
/*  bottom: 0;*/
/*  left: auto !important;*/
/*  right: -5px;*/
/*  cursor: col-resize;*/
/*  touch-action: none;*/
/*  position: absolute;*/
/*  top: 0px;*/
/*  z-index: 1;*/
/*  user-select: auto;*/
/*  width: 10px;*/
/*  transform: none !important;*/
/*}*/

rfq-content {
  min-height: 50px;
  display: flex;
}

.rfq-content table {
  width: 100%;
  margin-left: 5px;
  margin-right: 5px;
  border: 1px #ccc solid;
}

.rfq-content table thead th {
  text-align: center;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  transition: background 0.3s ease;
}

.rfq-content table tbody tr td {
  font-size: 12px;
  border-right: 1px #ccc solid;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom: 1px #ccc solid;
}
</style>