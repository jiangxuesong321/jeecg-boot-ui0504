<template>
	<a-card :bordered="false">
    <div class="card-title">
      项目列表
    </div>
		<div class="table-page-search-wrapper">
			<a-form layout="inline" @keyup.enter.native="searchQuery">
				<a-row :gutter="24">
					<a-col :span="6">
						<a-form-item label="项目编码" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
							<a-input placeholder="请输入编码" v-model="queryParam.projCode"></a-input>
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="项目名称" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
							<a-input placeholder="请输入项目名称" v-model="queryParam.projName"></a-input>
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="项目状态" :labelCol="spans.labelCol3" :wrapperCol="spans.wrapperCol3">
              <j-dict-select-tag v-model="queryParam.projStatus" placeholder="请选择项目状态" dictCode="approve_status"/>
						</a-form-item>
					</a-col>
          <a-col :span="6">
            <a-button type='primary' @click='searchQuery' icon='search'>查询</a-button>
            <a-button type='primary' @click='searchReset' icon='reload' style='margin-left: 8px'>重置</a-button>
            <a-button type="primary" icon="download" @click="handleExportXls('项目列表')" style='margin-left: 8px'>导出</a-button>
          </a-col>
				</a-row>
			</a-form>
		</div>
		<!-- 操作按钮区域 -->
		<div class="table-operator">
      <list-columns-setter v-model="columns" :def-columns="columns" style="float: right;"/>
		</div>

		<div>
      <!--
       @change="handleTableChange"
        @expand="open"
      -->
			<a-table
        ref="table"
        size="middle"
        :scroll="{x:true,y:500}"
        bordered
        rowKey="id"
        :columns="columns"
				:dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
        @expand="open"
        :customRow="customRow"
        :expandedRowKeys="expandedRowKeys">

        <template slot="contractPercent" slot-scope="text,record">
            <span v-if="text > 100" style="color: red">
              {{text}}%
            </span>
            <span v-else>
              {{text}}%
            </span>
        </template>
        <template slot="budgetPercent" slot-scope="text,record">
            <span v-if="text > 100" style="color: red">
              {{text}}%
            </span>
            <span v-else>
              {{text}}%
            </span>
        </template>

        <template slot="projName" slot-scope="text,record">
<!--          <div style="width: 180px;height: auto;word-wrap: break-word;overflow: hidden; text-overflow: ellipsis;white-space: nowrap;"-->
<!--               :title="text">-->
            {{text}}
<!--          </div>-->
        </template>

        <div slot="expandedRowRender" slot-scope="text">
          <div class="rfq-content rfq-content2" style="width: 80%">
            <table>
              <thead>
              <tr>
                <th width="100px">序号</th>
                <th width="120px">项目子项</th>
                <th width="120px">产能</th>
                <th width="120px">执行金额</th>
<!--                <th width="10%">冻结金额</th>-->
                <th width="120px">已签合同金额</th>
                <th width="120px">剩余金额</th>
                <th width="120px">合同已付金额</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in childList">
                <td style="text-align: center">{{index + 1}}</td>
                <td style="text-align: center">{{item.model_dictText}}</td>
                <td style="text-align: right">{{item.capacity}}</td>
                <td style="text-align: right">¥{{iegAmount(Math.trunc(item.budgetAmount),'total') }}</td>
<!--                <td>{{item.reqAmount}}</td>-->
                <td style="text-align: right">¥{{iegAmount(Math.trunc(item.contractAmount),'total')}}</td>
                <td style="text-align: right">
                  ¥{{iegAmount(Math.trunc(item.usedAmount),'total')}}
                </td>
                <td style="text-align: right">
                  ¥{{iegAmount(Math.trunc(item.payAmount),'total')}}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

				<span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record,'0')" v-if="record.isDisabled == '1'">基本信息编辑</a>
          <a-divider type="vertical" v-if="record.isDisabled == '1'"/>
          <a @click="handleEdit(record,'1')" v-if="record.isDisabled == '1'">资金分类编辑</a>
          <a-divider type="vertical" v-if="record.isDisabled == '1'"/>
					<a @click="handleDetail(record)">详情</a>

          <a-divider type="vertical" v-has="'proj:neck'"/>
					<a @click="handleNeck(record)" v-has="'proj:neck'">Neck产能维护</a>
          <a-divider type="vertical" v-has="'proj:mangeSubkeyPerson'"/>
          <a @click="handleSubkey(record)" v-has="'proj:mangeSubkeyPerson'">配置子项产线人员</a>

				</span>

			</a-table>
      <div :style="dataSource != null && dataSource.length > 0 ? 'z-index:99;margin-top:-43px;' : 'z-index:99;margin-top:10px;'">
        <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
        <a-button @click="handleRate" type="primary" icon="plus" style="margin-left: 10px">批量汇率维护</a-button>
      </div>
		</div>
    <a-drawer title="产能维护" :width="width" placement="right" :closable="false" :headerStyle="{ textAlign: 'center'}"
              @close="close" destroyOnClose :visible="visible">
      <a-table
        ref="table"
        size="middle"
        bordered
        :scroll="{x:true,y:300}"
        :columns="childColumns"
        :dataSource="modelList"
        :pagination="false">
        <template slot="neck" slot-scope="text,record">
          <a-input-number v-model="record.neck" style="width:100%"></a-input-number>
        </template>
      </a-table>
      <div  style="text-align: center;margin-top:15px;">
        <a-button @click="close" type="primary" ghost>关闭</a-button>
        <a-button @click="handleOk" type="primary" style="margin-left:10px">提交</a-button>
      </div>
    </a-drawer>

    <a-drawer title="子项产线人员配置" :width="width" placement="right" :closable="false" :headerStyle="{ textAlign: 'center'}"
              @close="closeSubkey" destroyOnClose :visible="subkeyVisible">
      <a-table
        ref="table"
        size="middle"
        bordered
        :scroll="{x:true,y:300}"
        :columns="subkeyColumns"
        :dataSource="subkeyList"
        :pagination="false">
        <template slot="subkey" slot-scope="text,record">
          <j-select-user-by-dep v-model="record.productionLiner" />
        </template>
      </a-table>
      <div  style="text-align: center;margin-top:15px;">
        <a-button @click="closeSubkey" type="primary" ghost>关闭</a-button>
        <a-button @click="handleProductLinerOk" type="primary" style="margin-left:10px">提交</a-button>
      </div>
    </a-drawer>


		<proj-base-modal ref="modalForm" @ok="modalFormOk"></proj-base-modal>
    <proj-rate-modal ref="rateForm" @ok="modalFormOk"></proj-rate-modal>
	</a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ProjBaseModal from './modules/ProjBaseModal'
import { iegAmount, isNullOrEmpty } from '@/utils/util'
import { billListMixin } from '../mixins/billListMixin'
import { billModalMixin } from '../mixins/billModalMixin'
import ListColumnsSetter from '@views/components/ListColumnsSetter'
import Vue from 'vue'
import Sortable from 'sortablejs'
import ProjRateModal from '@views/project/modules/ProjRateModal'
import { getAction, postAction } from '@/api/manage'

let columns = [
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
    		title: '项目编码',
    		align: "center",
    		dataIndex: 'projCode',
        width: 120,
        sorter: true,
    	},
    	{
    		title: '项目名称',
    		dataIndex: 'projName',
        align: "center",
        width: 320,
        sorter: true,
        scopedSlots: {
          customRender: 'projName'
        }
    	},
    	// {
    	// 	title: '项目产能',
    	// 	align: "center",
    	// 	dataIndex: 'projCapacity',
      //   width: 120,
    	// },
      {
        title: '立项人',
        align: "center",
        dataIndex: 'applyUserId_dictText',
        width: 120,
        sorter: true,
      },
      {
        title: '立项人部门',
        align: "center",
        dataIndex: 'applyOrgId_dictText',
        width: 120,
        sorter: true,
      },
    	{
    		title: '立项时间',
    		align: "center",
    		dataIndex: 'projInitiationDate',
        width: 120,
        sorter: true,
    	},
      {
        title: '立项金额(元)',
        dataIndex: 'projAmount',
        sorter: true,
        customRender:function (t,r,index) {
          let icon = "";
          icon = '¥';

          const obj = {
            children: icon + iegAmount(Math.trunc(t),'total'),
            attrs: {},
          };
          obj.attrs.align = 'right';//控制表体内容居右
          return obj;
        },
        width: 120,
      },
    	{
    		title: '执行金额(元)',
    		dataIndex: 'budgetAmount',
        sorter: true,
        customRender:function (t,r,index) {
          let icon = "";
          icon = '¥';

          const obj = {
            children: icon + iegAmount(Math.trunc(t),'total'),
            attrs: {},
          };
          obj.attrs.align = 'right';//控制表体内容居右
          return obj;
        },
        width: 120,
    	},

      {
        title: '执行与立项占比(%)',
        dataIndex: 'budgetPercent',
        align: "center",
        sorter: true,
        // customRender:function (t,r,index) {
        //   return t + "%";
        // },
        scopedSlots: {
          customRender: 'budgetPercent'
        },
        width: 120,
      },

    	// {
    	// 	title: '冻结金额(元)',
    	// 	align: "center",
    	// 	dataIndex: 'freezeAmount',
    	// 	customRender: function(text) {
    	// 		return iegAmount(text, 'total')
    	// 	},
      //   width: 120,
    	// },
    	{
    		title: '合同金额(元)',
    		dataIndex: 'usedAmount',
        sorter: true,
        customRender:function (t,r,index) {
          let icon = "";
          icon = '¥';

          const obj = {
            children: icon + iegAmount(Math.trunc(t),'total'),
            attrs: {},
          };
          obj.attrs.align = 'right';//控制表体内容居右
          return obj;
        },
        width: 120,
    	},
      {
        title: '合同与执行占比(%)',
        dataIndex: 'contractPercent',
        align: "center",
        sorter: true,
        scopedSlots: {
          customRender: 'contractPercent'
        },
        width: 120,
      },
      {
        title: '剩余金额(元)',
        dataIndex: 'remainAmount',
        sorter: true,
        customRender:function (t,r,index) {
          let icon = "";
          icon = '¥';

          const obj = {
            children: icon + iegAmount(Math.trunc(t),'total'),
            attrs: {},
          };
          obj.attrs.align = 'right';//控制表体内容居右
          return obj;
        },
        width: 120,
      },
      {
        title: '合同已付金额(元)',
        dataIndex: 'payAmount',
        sorter: true,
        customRender:function (t,r,index) {
          let icon = "";
          icon = '¥';

          const obj = {
            children: icon + iegAmount(Math.trunc(t),'total'),
            attrs: {},
          };
          obj.attrs.align = 'right';//控制表体内容居右
          return obj;
        },
        width: 120,
      },
      {
        title: '变更次数',
        align: "center",
        dataIndex: 'sort',
        sorter: true,
        width: 120,
      },
    	{
    		title: '操作',
    		dataIndex: 'action',
    		align: "center",
    		width: 260,
    		scopedSlots: {
    			customRender: 'action'
    		}
    	}
  ];
  const draggingMap = {};
  columns.forEach(col => {
    draggingMap[col.key] = col.width;
  });
  const draggingState = Vue.observable(draggingMap);
  const ResizeableTitle = (h, props, children) => {
    let thDom = null;
    const {key, ...restProps} = props;
    let col = null;
    // if (key === 'selection-column') {
    //   //支持复选框
    //   col = {
    //     dataIndex: 'selection-column',
    //     key: 'selection-column',
    //     width: 60
    //   }
    //
    // }else if(key === 'rc-table-expand-icon-cell'){
    //   col = {
    //     dataIndex: 'rc-table-expand-icon-cell',
    //     key: 'rc-table-expand-icon-cell',
    //     width: 60
    //   }
    // }
    // else {
      col = columns.find(col => {
        const k = col.dataIndex || col.key
        return k === key
      })
    // }
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
		name: 'ProjBaseList',
		mixins: [JeecgListMixin, mixinDevice, billListMixin, billModalMixin],
		components: {
			ProjBaseModal,
      ListColumnsSetter,
      ProjRateModal
		},
		data() {
      this.components = {
        header: {
          cell: ResizeableTitle,
        },
      };
			return {
        isorter:{
          column: 'projCode',
          order: 'asc',
        },
			  modelList:[],
        childColumns:[
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
            dataIndex: 'model_dictText',
            width:160,
          },
          {
            title: '执行金额',
            dataIndex: 'budgetAmount',
            width:120,
            customRender:function (t,r,index) {
              return iegAmount(t,'total')
            }
          },
          {
            title: '形象进度',
            dataIndex: 'iprogress',
            width:120,
          },
          {
            title: '产能',
            dataIndex: 'neck',
            width:120,
            scopedSlots: { customRender: 'neck' },
          },
        ],
        subkeyColumns:[
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
            dataIndex: 'model_dictText',
            width:260,
          },
          {
            title: '产线人员',
            dataIndex: 'productionLiner',
            scopedSlots: { customRender: 'subkey' },
          },
        ],
        width:'50%',
        visible:false,
        subkeyVisible: false,
        iegAmount,
        isDisabled:false,
			  childList:[],
        expandedRowKeys:[],
        subkeyList:[],
        key: 0,
        columns,
				description: 'proj_base管理页面',
				url: {
					list: "/srm/projBase/list",
					delete: "/srm/projBase/delete",
					deleteBatch: "/srm/projBase/deleteBatch",
					exportXlsUrl: "/srm/projBase/exportXlsByList",
					importExcelUrl: "srm/projBase/importExcel",

				},
				dictOptions: {},
				superFieldList: [],
			}
		},
		created() {

		},
    mounted() {
      this.columnsDrop()
      // this.checkApprove()
    },
		computed: {
			importExcelUrl: function() {
				return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
			},
		},
		methods: {
      customRow(record, index) {
        return {
          style: {
            // 行背景色
            'background-color': index % 2 == 0 ? '#EEEEEE' : '#FFFFFF',
            height:'100px'
          }
        }
      },
      handleOk(){
        let that = this;
        let modelList = that.modelList;
        if(modelList == null || modelList.length == 0){
          that.$message.error('当前没有可维护的Neck产能');
          return;
        }
        for(let i = 0; i < modelList.length; i++){
          if(isNullOrEmpty(modelList[i].neck)){
            that.$message.error('第' + (i+1) + '行,请输入Neck产能');
            return;
          }
        }
        let url = "/srm/projBase/updateNeck";
        postAction(url,modelList).then(res => {
          if(res.success){
            that.$message.success('提交成功');
            that.close();
          }else{
            that.$message.error('提交失败');
          }
        })
      },
      handleProductLinerOk(){
        let that = this;
        let modelList = that.subkeyList;
        /* if(modelList == null || modelList.length == 0){
          that.$message.error('当前没有可维护的Neck产能');
          return;
        }
        for(let i = 0; i < modelList.length; i++){
          if(isNullOrEmpty(modelList[i].neck)){
            that.$message.error('第' + (i+1) + '行,请输入Neck产能');
            return;
          }
        } */
        let url = "/srm/projBase/updateNeck";
        postAction(url,modelList).then(res => {
          if(res.success){
            that.$message.success('提交成功');
            that.closeSubkey();
          }else{
            that.$message.error('提交失败');
          }
        })
      },
      fetchBomChild(projectId){
        let url = "/srm/projBase/fetchBomChild";
        let param = {
          projectId:projectId
        }
        getAction(url,param).then(res => {
          this.modelList = res.result;
        })
      },
      fetchSubkeyChild(projectId){
        let url = "/srm/projBase/fetchBomChild";
        let param = {
          projectId:projectId
        }
        getAction(url,param).then(res => {
          this.subkeyList = res.result;
        })
      },
      close(){
        this.visible = false;
      },
      closeSubkey(){
        this.subkeyVisible = false;
      },
      handleNeck(record){
        this.visible = true;
        this.modelList = [];
        this.fetchBomChild(record.id);
      },
      handleSubkey(record){
        this.subkeyVisible = true;
        this.subkeyList = [];
        this.fetchSubkeyChild(record.id);
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
        params.source = 'pageList';

        let url = location.search; //获取url中"?"符后的字串
        if (url.indexOf("?") != -1) {
          let str = url.substr(1);
          let subject = str.split("=")[1];
          params.subject = subject;
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
      checkApprove() {
        let url = "/srm/approveSetting/checkApprove";
        getAction(url, {type:'project'}).then(res => {
          if(res.success){
            this.isDisabled = res.result;
          }
        })
      },
      handleRate(){
        this.$refs.rateForm.add();
      },
      open(expanded, row) {
        this.childList = []
        if (expanded) {
          let url = '/srm/projBase/fetchChildAmount'
          let param = {
            projectId: row.id
          }
          getAction(url, param).then(res => {
            this.childList = res.result
          })
          this.expandedRowKeys = []
          this.expandedRowKeys.push(row.id)
        } else {
          this.expandedRowKeys = []
        }
      },
      handleEdit: function (record,type) {
        this.$refs.modalForm.edit(record,type);
        this.$refs.modalForm.title = "编辑";
        this.$refs.modalForm.disableSubmit = false;
      },
      handleDetail:function(record){
        this.$refs.modalForm.view(record);
        this.$refs.modalForm.title="详情";
        this.$refs.modalForm.disableSubmit = true;
      },
      getFilterOptions() {
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
            // const oldItem = this.columns[evt.oldIndex]
            // this.columns.splice(evt.oldIndex, 1)
            // this.columns.splice(evt.newIndex, 0, oldItem)
            const oldItem = this.columns[evt.oldIndex - 1]
            this.columns.splice(evt.oldIndex - 1, 1)
            this.columns.splice(evt.newIndex - 1, 0, oldItem)
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
/*设置奇数行颜色*/
table tr:nth-child(odd)
{
  background: #EEEEEE;
}

</style>