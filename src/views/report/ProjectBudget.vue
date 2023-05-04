<template>
    <div>
      <a-card>
        <div class="card-title">
          设备立项预算与实际预算对比
        </div>
        <div class="table-page-search-wrapper">
          <a-form layout="inline" @keyup.enter.native="searchQuery">
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item label="项目名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                    <j-multi-select-tag style="width: 100%;" v-model="queryParam.projectId"
                                       @change="changeModel"
                                       placeholder="请选择项目" dictCode="proj_base,proj_name,id,del_flag = '0' order by create_time desc"/>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="物料名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                  <a-input v-model="queryParam.prodName"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="设备产地" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                  <a-input v-model="queryParam.country"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="设备供应商" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
                  <a-input v-model="queryParam.suppName"></a-input>
                </a-form-item>
              </a-col>
<!--              <a-col :span="6">-->
<!--                <a-form-item label="代理" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">-->
<!--                  <a-input v-model="queryParam.agent"></a-input>-->
<!--                </a-form-item>-->
<!--              </a-col>-->
              <a-col :span="6">
                <a-form-item label="项目子类" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
<!--                  <j-dict-select-tag  v-model="queryParam.model" placeholder="请选择模块" dictCode="model"/>-->
                  <a-select v-model="queryParam.model"  placeholder="请选择项目子项" @change="setVal">
                    <a-select-option
                      v-for="item in modelList"
                      :key="item.value"
                      :value="item.value">
                      {{ item.text }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :span="10">
                <a-button type='primary' @click='searchQuery' icon='search'>查询</a-button>
                <a-button type='primary' @click='searchReset' icon='reload' style='margin-left: 8px'>重置</a-button>
                <a-button type="primary" icon="download" @click="handleExportXls('项目设备购置费预算与实际对比表')" style='margin-left: 8px'>导出</a-button>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <list-columns-setter v-model="columns" :def-columns="columns" style="float: right;"/>
        </div>

        <div>
          <div v-if="model != null" class="card-title">
            <a-tag color="orange" style="font-size: 18px">
              立项预算:{{iegAmount(Math.trunc(model.budgetAmount),'total')}}
            </a-tag>
            <a-tag color="green" style="font-size: 18px">
              执行预算:{{iegAmount(Math.trunc(model.executeAmount),'total')}}
            </a-tag>
            <a-tag color="blue" style="font-size: 18px">
              占比:{{model.percent}}%
            </a-tag>
          </div>
          <!--
          :components="components"
          :customRow="rowClick"
          -->
          <a-table
            style="margin-top: -30px"
            ref="table"
            size="middle"
            :scroll="{x:1000,y:550}"
            bordered
            rowKey="id"
            :key="key"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            @change="handleTableChange">
            <template slot="suppName" slot-scope="text,record">
              <div style="width: 180px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="text">
                {{text}}
              </div>
            </template>
            <template slot="prodName" slot-scope="text,record">
              <div style="width: 180px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="text">
                {{text}}
              </div>
            </template>
          </a-table>
        </div>

        <a-modal v-model="visible" :maskClosable="false">
          <a-row>
            <h3>{{nowRow.prodName}}(实际金额与执行金额占比)</h3>
          </a-row>
          <a-row>
            <newRateChart2 :percentNum="percent" :title="'预算占比'" ref="chart2" style="margin-left: 130px"></newRateChart2>
          </a-row>
          <template slot="footer">
            <a-button @click="closeModal">关闭</a-button>
          </template>
        </a-modal>
      </a-card>
    </div>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { iegAmount, isNullOrEmpty } from '@/utils/util'
import { billListMixin } from '../mixins/billListMixin'
import { billModalMixin } from '../mixins/billModalMixin'
import ListColumnsSetter from '@views/components/ListColumnsSetter'
import Vue from 'vue'
import Sortable from 'sortablejs'
import { getAction } from '@/api/manage'
import newRateChart2 from '@/components/chart/newRateChart2'
import { preciseNum } from '@/utils/util'

// let columns = [
//       {
//     		title: '序号',
//     		dataIndex: '',
//     		key: 'rowIndex',
//     		width: 60,
//     		align: "center",
//     		customRender: function(t, r, index) {
//     			return parseInt(index) + 1;
//     		}
//     	},
//       {
//         title: '物料名称',
//         align: "center",
//         dataIndex: 'prodName',
//         width: 180,
//         sorter: true,
//       },
//       {
//         title: '设备产地',
//         align: "center",
//         dataIndex: 'country',
//         width: 120,
//         sorter: true,
//       },
//     	{
//     		title: '设备供应商',
//     		align: "center",
//     		dataIndex: 'suppName',
//         width: 180,
//         sorter: true,
//     	},
//     	{
//     		title: '项目子类',
//     		align: "center",
//     		dataIndex: 'model_dictText',
//         width: 120,
//         sorter: true,
//     	},
//       {
//         title: '立项',
//         align: "center",
//         children: [
//           {
//           	title: '数量',
//           	dataIndex: 'projQty',
//             sorter: true,
//             width: 120,
//             customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
//               const obj = {
//                 children: value,
//                 attrs: {},
//               };
//               obj.attrs.align = 'right';//控制表体内容居右
//               return obj;
//             }
//           },
//           {
//             title: '单价',
//             dataIndex: 'budgetPrice',
//             sorter: true,
//             width: 120,
//             customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
//               const obj = {
//                 children: value,
//                 attrs: {},
//               };
//               obj.attrs.align = 'right';//控制表体内容居右
//               return obj;
//             }
//           },
//           {
//             title: '总价',
//             dataIndex: 'budgetAmount',
//             sorter: true,
//             width: 120,
//             customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
//               const obj = {
//                 children: value,
//                 attrs: {},
//               };
//               obj.attrs.align = 'right';//控制表体内容居右
//               return obj;
//             }
//           },
//         ]
//
//       },
//       {
//         title: '执行',
//         align: "center",
//         children: [
//           {
//             title: '数量',
//             dataIndex: 'executeQty',
//             sorter: true,
//             width: 120,
//             customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
//               const obj = {
//                 children: value,
//                 attrs: {},
//               };
//               obj.attrs.align = 'right';//控制表体内容居右
//               return obj;
//             }
//           },
//           {
//             title: '单价',
//             dataIndex: 'budgetPrice',
//             sorter: true,
//             width: 120,
//             customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
//               const obj = {
//                 children: value,
//                 attrs: {},
//               };
//               obj.attrs.align = 'right';//控制表体内容居右
//               return obj;
//             }
//           },
//           {
//             title: '总价',
//             dataIndex: 'executeAmount',
//             sorter: true,
//             width: 120,
//             customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
//               const obj = {
//                 children: value,
//                 attrs: {},
//               };
//               obj.attrs.align = 'right';//控制表体内容居右
//               return obj;
//             }
//           },
//         ]
//
//       },
//       {
//         title: '合同',
//         align: "center",
//         children: [
//           {
//             title: '数量',
//             dataIndex: 'contractQty',
//             sorter: true,
//             width: 120,
//             customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
//               const obj = {
//                 children: value,
//                 attrs: {},
//               };
//               obj.attrs.align = 'right';//控制表体内容居右
//               return obj;
//             }
//           },
//           {
//             title: '单价',
//             dataIndex: 'contractPriceTaxLocal',
//             sorter: true,
//             width: 120,
//             customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
//               const obj = {
//                 children: value,
//                 attrs: {},
//               };
//               obj.attrs.align = 'right';//控制表体内容居右
//               return obj;
//             }
//           },
//           {
//             title: '总价',
//             dataIndex: 'contractAmountTaxLocal',
//             sorter: true,
//             width: 120,
//             customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
//               const obj = {
//                 children: value,
//                 attrs: {},
//               };
//               obj.attrs.align = 'right';//控制表体内容居右
//               return obj;
//             }
//           },
//         ]
//
//       },
//   ];
//   const draggingMap = {};
//   columns.forEach(col => {
//     draggingMap[col.key] = col.width;
//   });
//   const draggingState = Vue.observable(draggingMap);
//   const ResizeableTitle = (h, props, children) => {
//     let thDom = null;
//     const {key, ...restProps} = props;
//     let col = null;
//     if (key === 'selection-column') {
//       //支持复选框
//       col = {
//         dataIndex: 'selection-column',
//         key: 'selection-column',
//         width: 40
//       }
//
//     }
//     else if(key === 'rc-table-expand-icon-cell'){
//       col = {
//         dataIndex: 'rc-table-expand-icon-cell',
//         key: 'rc-table-expand-icon-cell',
//         width: 40
//       }
//     }
//     else {
//       col = columns.find(col => {
//         const k = col.dataIndex || col.key
//         return k === key
//       })
//     }
//     if (!col.width) {
//       return h('th', {
//         ...restProps
//       }, [
//         children
//       ])
//     }
//     const onDrag = x => {
//       draggingState[key] = 0;
//       col.width = Math.max(x, 1);
//     };
//     const onDragstop = () => {
//       draggingState[key] = thDom.getBoundingClientRect().width;
//     };
//     return (
//       h('th', {
//         ...restProps,
//         attrs: {
//           width: col.width,
//         },
//         'v-ant-ref': r => (thDom = r),
//         class: 'resize-table-th'
//       }, [
//         children,
//         h('vue-draggable-resizable', {
//           class: 'table-draggable-handle',
//           on: {
//             dragging: onDrag,
//             dragstop: onDragstop
//           },
//           key: col.key,
//           props: {
//             w: 10,
//             x: draggingState[key] || col.width,
//             z: 1000,
//             axis: 'x',
//             resizable: false,
//           }
//         })
//       ])
//     );
//   };

	export default {
		name: 'ProjectBudget',
		mixins: [JeecgListMixin, mixinDevice, billListMixin, billModalMixin],
		components: {
      ListColumnsSetter,
      newRateChart2
		},
		data() {
      // this.components = {
      //   header: {
      //     cell: ResizeableTitle,
      //   },
      // };
			return {
			  modelList:[],
        isorter:{
          column: 'prodName',
          order: 'desc',
        },
        iegAmount,
			  model:{
          budgetAmount:0,
          actBudgetAmount:0,
          percent:0
        },
			  nowRow:{},
        percent:0,
        visible:false,
        key: 0,
        // columns,
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
            title: '设备名称',
            align: "center",
            dataIndex: 'prodName',
            width: 180,
            sorter: true,
            scopedSlots: {
              customRender: 'prodName'
            },
          },
          {
            title: '设备产地',
            align: "center",
            dataIndex: 'country',
            width: 120,
            sorter: true,
          },
          {
            title: '设备供应商',
            align: "center",
            dataIndex: 'suppName',
            width: 180,
            sorter: true,
            scopedSlots: {
              customRender: 'suppName'
            },
          },
          {
            title: '项目子类',
            align: "center",
            dataIndex: 'model_dictText',
            width: 120,
            sorter: true,
            // customCell: (record, rowIndex) => {
            //   return {
            //     style: {
            //       'background-color': 'red'
            //     }
            //   }
            // }
          },
          {
            title: '立项',
            align: "center",
            dataIndex: 'column1',
            className:'column-orange',
            children: [
              {
                title: '数量',
                dataIndex: 'projQty',
                // sorter: true,
                width: 120,
                className:'column-orange',
                customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
                  const obj = {
                    children:  value,
                    attrs: {},
                  };
                  obj.attrs.align = 'center';//控制表体内容居右
                  return obj;
                },
                // customCell: (record, rowIndex) => {
                //   return {
                //     style: {
                //       'background-color': 'orange'
                //     }
                //   }
                // }
              },
              {
                title: '单价',
                dataIndex: 'budgetPrice',
                // sorter: true,
                width: 120,
                className:'column-orange',
                customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
                  const obj = {
                    children: '¥' + iegAmount(value,'total'),
                    attrs: {},
                  };
                  obj.attrs.align = 'right';//控制表体内容居右
                  return obj;
                },
                // customCell: (record, rowIndex) => {
                //   return {
                //     style: {
                //       'background-color': 'orange'
                //     }
                //   }
                // }
              },
              {
                title: '总价',
                dataIndex: 'budgetAmount',
                // sorter: true,
                width: 120,
                className:'column-orange',
                customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
                  const obj = {
                    children: '¥' + iegAmount(value,'total'),
                    attrs: {},
                  };
                  obj.attrs.align = 'right';//控制表体内容居右
                  return obj;
                },
                // customCell: (record, rowIndex) => {
                //   return {
                //     style: {
                //       'background-color': 'orange'
                //     }
                //   }
                // }
              },
            ]

          },
          {
            title: '执行',
            align: "center",
            className:'column-green',
            dataIndex: 'column2',
            children: [
              {
                title: '数量',
                dataIndex: 'executeQty',
                // sorter: true,
                width: 120,
                className:'column-green',
                customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
                  const obj = {
                    children: value,
                    attrs: {},
                  };
                  obj.attrs.align = 'center';//控制表体内容居右
                  return obj;
                },
                // customCell: (record, rowIndex) => {
                //   return {
                //     style: {
                //       'background-color': '#CCFF99'
                //     }
                //   }
                // }
              },
              {
                title: '单价',
                dataIndex: 'executePrice',
                // sorter: true,
                width: 120,
                className:'column-green',
                customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
                  const obj = {
                    children: '¥' + iegAmount(value,'total'),
                    attrs: {},
                  };
                  obj.attrs.align = 'right';//控制表体内容居右
                  return obj;
                },
                // customCell: (record, rowIndex) => {
                //   return {
                //     style: {
                //       'background-color': '#CCFF99'
                //     }
                //   }
                // }
              },
              {
                title: '总价',
                dataIndex: 'executeAmount',
                // sorter: true,
                width: 120,
                className:'column-green',
                customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
                  const obj = {
                    children: '¥' + iegAmount(value,'total'),
                    attrs: {},
                  };
                  obj.attrs.align = 'right';//控制表体内容居右
                  return obj;
                },
                // customCell: (record, rowIndex) => {
                //   return {
                //     style: {
                //       'background-color': '#CCFF99'
                //     }
                //   }
                // }
              },
            ]

          },
          {
            title: '合同',
            align: "center",
            dataIndex: 'column3',
            className:'column-blue',
            children: [
              {
                title: '数量',
                dataIndex: 'contractQty',
                // sorter: true,
                width: 120,
                className:'column-blue',
                customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
                  const obj = {
                    children: value,
                    attrs: {},
                  };
                  obj.attrs.align = 'center';//控制表体内容居右
                  return obj;
                },
                // customCell: (record, rowIndex) => {
                //   return {
                //     style: {
                //       'background-color': '#AAFFEE'
                //     }
                //   }
                // }
              },
              {
                title: '单价',
                dataIndex: 'contractPriceTaxLocal',
                // sorter: true,
                width: 120,
                className:'column-blue',
                customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
                  const obj = {
                    children: '¥' + iegAmount(value,'total'),
                    attrs: {},
                  };
                  obj.attrs.align = 'right';//控制表体内容居右
                  return obj;
                },
                // customCell: (record, rowIndex) => {
                //   return {
                //     style: {
                //       'background-color': '#AAFFEE'
                //     }
                //   }
                // }
              },
              {
                title: '总价',
                dataIndex: 'contractAmountTaxLocal',
                // sorter: true,
                width: 120,
                className:'column-blue',
                customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
                  const obj = {
                    children: '¥' + iegAmount(value,'total'),
                    attrs: {},
                  };
                  obj.attrs.align = 'right';//控制表体内容居右
                  return obj;
                },
                // customCell: (record, rowIndex) => {
                //   return {
                //     style: {
                //       'background-color': '#AAFFEE'
                //     }
                //   }
                // }
              },
            ]

          },
        ],
				description: 'proj_base管理页面',
				url: {
					list: "/srm/report/fetchProjBudgetPageList",
          exportXlsUrl: "/srm/report/exportProjBudgetPageList",
				},
				dictOptions: {},
				superFieldList: [],
			}
		},
		created() {
      this.initTotal();
		},
    mounted() {
      // this.columnsDrop()
    },
		computed: {
			importExcelUrl: function() {
				return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
			},
		},
		methods: {
      setVal(){
        this.$forceUpdate();
      },
      fetchModelByProjId(){
        this.modelList = [];
        this.queryParam.model = "";
        let url = "/srm/projBase/fetchModelByProjId";
        let param = {
          id:this.queryParam.projectId
        };
        getAction(url,param).then(res => {
          this.modelList = res.result;
        })
      },
		  changeModel(){
        this.fetchModelByProjId();
		    this.searchQuery();
      },
      searchQuery() {
        this.loadData(1);
        this.initTotal();
      },
      searchReset() {
        this.queryParam = {}
        this.loadData(1);
        this.initTotal();
      },
		  initTotal(){
        this.model = {
          budgetAmount:0,
          executeAmount:0,
          percent:0
        };
		    let url = "/srm/report/fetchTotalProjBudgetPageList";
		    let param = this.queryParam;
        getAction(url,param).then(res => {
          this.model = res.result;
          if(this.model != null){
            if(this.model.budgetAmount != null && this.model.budgetAmount > 0){
              let percent = preciseNum(Number(this.model.executeAmount) / Number(this.model.budgetAmount) * 100,2);
              this.model.percent = percent;
            }else{
              this.model.percent = 0;
            }
          }
        })
      },
      closeModal(){
        this.visible = false;
      },
      rowClick(record, index){
        return {
          on: {
            click: () => {
              this.visible = true;
              this.nowRow = {};
              this.nowRow = record;
              this.percent = 0;
              let percent = preciseNum(Number(record.actBudgetAmount) / Number(record.budgetAmount) * 100,2);
              this.percent = percent;
              setTimeout(() => {
                console.log("=============",percent);
                this.$refs.chart2.initData(percent);
              }, 400)

            },

            // dblclick: () => {
            //   alert('双击了我')
            // },
          }
        }
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
      //       this.key += 1;
      //       this.$nextTick(() => {
      //         this.columnsDrop();
      //       });
      //     }
      //   })
      // },
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
.ant-table-thead > tr > th.column-orange{
  background-color: #facd91 !important;
}
.ant-table-thead > tr > th.column-green{
  background-color: #CCFF99 !important;
}
.ant-table-thead > tr > th.column-blue{
  background-color: #AAFFEE !important;
}
</style>