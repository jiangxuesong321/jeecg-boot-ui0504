<template>
<!--  <j-modal-->
<!--    :width="modalWidth"-->
<!--    :visible="visible"-->
<!--    :title="title"-->
<!--    switchFullscreen-->
<!--    :fullscreen="true"-->
<!--    wrapClassName="j-user-select-modal"-->
<!--    @ok="handleSubmit"-->
<!--    @cancel="close"-->
<!--    style="top:50px"-->
<!--    cancelText="关闭"-->
<!--  >-->
  <a-drawer title="选择入库单" :width="width" placement="right" :closable="false" :headerStyle="{ textAlign: 'center'}"
            @close="close" destroyOnClose :visible="visible">
    <a-card :bordered="false">
      <a-form-model>
        <a-row>
          <a-col :span='6'>
            <a-form-model-item label="入库单编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-model='queryParam.billNo'></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span='6'>
            <span style='float: right;overflow: hidden;' class='table-page-search-submitButtons'>
							<a-button type='primary' @click='onSearch' icon='search'>查询</a-button>
							<a-button type='primary' @click='searchReset' icon='reload' style='margin-left: 8px'>重置</a-button>
						</span>
          </a-col>
        </a-row>



      </a-form-model>
      <!--用户列表-->
      <a-table
        ref="table"
        :scroll="scrollTrigger"
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type: getType}"
        :loading="loading"
        @change="handleTableChange">
      </a-table>
    </a-card>
    <div class="drawer-footer" style="text-align: center;margin-top:15px;">
      <a-button key="cancel" @click="close" style="margin-left:10px;" type="primary" ghost>取消</a-button>
      <a-button  @click="handleSubmit" style="margin-left:10px;" type="primary" ghost>确定</a-button>
    </div>
  </a-drawer>

</template>

<script>
import { filterObj, pushIfNotExist } from '@/utils/util'
import { getAction } from '@/api/manage'
import { isNullOrEmpty, preciseNum } from '@/utils/util'

export default {
    name: 'JSelectContractModal',
    components: {},
    props: ['modalWidth', 'multi', 'userIds', 'store', 'text'],
    data() {
      return {
        width:'80%',
        queryParam: {
          username: "",
        },
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
            title:'单据编号',
            align:"center",
            dataIndex: 'billNo',
            width:120,
          },
          {
            title:'出入库类型',
            align:"center",
            dataIndex: 'stockIoType_dictText',
            width:120,
          },
          {
            title:'单据日期',
            align:"center",
            dataIndex: 'billDate',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            },
            width:120,
          },
          {
            title:'供应商名称',
            align:"center",
            dataIndex: 'suppName',
            width:120,
          },
          {
            title:'合同名称',
            align:"center",
            dataIndex: 'contractName',
            width:120,
          },
          {
            title:'项目名称',
            align:"center",
            dataIndex: 'projectName',
            width:120,
          },
          {
            title:'业务员',
            align:"center",
            dataIndex: 'createBy_dictText',
            width:120,
          },
          {
            title:'入库状态',
            align:"center",
            dataIndex: 'status_dictText',
            width:120,
          },
          // {
          //   title:'附件',
          //   align:"center",
          //   dataIndex: 'attachment',
          //   scopedSlots: { customRender: 'attachment' },
          //   width:200,
          // },
          {
            title:'备注',
            align:"center",
            dataIndex: 'remark',
            width:200,
          },
        ],
        scrollTrigger: {},
        dataSource: [],
        selectionRows: [],
        selectedRowKeys: [],
        selectUserRows: [],
        selectUserIds: [],
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + ' 共' + total + '条'
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        isorter: {
          column: 'createTime',
          order: 'desc'
        },
        visible: false,
        form: this.$form.createForm(this),
        loading: false,
        expandedKeys: [],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      }
    },
    computed: {
      // 计算属性的 getter
      getType: function () {
        return this.multi == true ? 'checkbox' : 'radio';
      }
    },
    watch: {
      userIds: {
        immediate: true,
        handler() {
          this.initUserNames()
        }
      },
    },
    created() {
      // 该方法触发屏幕自适应
      this.resetScreenSize();
      this.loadData()
    },
    methods: {
      initUserNames() {
        if (this.userIds) {
          // 这里最后加一个 , 的原因是因为无论如何都要使用 in 查询，防止后台进行了模糊匹配，导致查询结果不准确
          let values = this.userIds.split(',') + ','
          let param = {[this.store]: values}
          getAction('/srm/stkIoBill/getMultiContract', param).then((list)=>{
            this.selectionRows = []
            let selectedRowKeys = []
            let textArray = []
            if(list && list.length>0){
              for(let user of list){
                textArray.push(user[this.text])
                selectedRowKeys.push(user['id'])
                this.selectionRows.push(user)
              }
            }
            this.selectedRowKeys = selectedRowKeys
            this.$emit('initComp', textArray.join(','))
          })

        } else {
          // JSelectUserByDep组件bug issues/I16634
          this.$emit('initComp', '')
          // 前端用户选择单选无法置空的问题 #2610
          this.selectedRowKeys = []
        }
      },
      async loadData(arg) {
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        let params = this.getQueryParams()//查询条件
        params.stockIoType = '0'
        params.status = '1';
        this.loading = true
        getAction('/srm/stkIoBill/list', params).then(res=>{
          if (res.success) {
            this.dataSource = res.result.records
            this.ipagination.total = res.result.total
          }
        }).finally(() => {
          this.loading = false
        })
      },
      // 触发屏幕自适应
      resetScreenSize() {
        let screenWidth = document.body.clientWidth;
        if (screenWidth < 500) {
          this.scrollTrigger = {x: 800};
        } else {
          this.scrollTrigger = {};
        }
      },
      showModal() {
        this.visible = true;
        this.initUserNames()
        this.loadData();
        this.form.resetFields();
      },
      getQueryParams() {
        let param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        param.status = '1';
        return filterObj(param);
      },
      getQueryField() {
        let str = 'id,';
        for (let a = 0; a < this.columns.length; a++) {
          str += ',' + this.columns[a].dataIndex;
        }
        return str;
      },
      searchReset(num) {
        let that = this;
        that.selectedRowKeys = [];
        that.selectUserIds = [];
        if (num !== 0) {
          that.queryParam = {};
          that.loadData(1);
        }
      },
      close() {
        this.searchReset(0);
        this.visible = false;
      },
      handleTableChange(pagination, filters, sorter) {
        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = 'ascend' === sorter.order ? 'asc' : 'desc';
        }
        this.ipagination = pagination;
        this.loadData();
      },
      handleSubmit() {
        let that = this;
        this.getSelectUserRows();
        that.$emit('ok', that.selectUserRows);
        that.searchReset(0)
        that.close();
      },
      //获取选择用户信息
      getSelectUserRows() {
        this.selectUserRows = []
        for (let row of this.selectionRows) {
          if (this.selectedRowKeys.includes(row.id)) {
            this.selectUserRows.push(row)
          }
        }
        this.selectUserIds = this.selectUserRows.map(row => row.id).join(',')
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        selectionRows.forEach(row => pushIfNotExist(this.selectionRows, row, 'id'))
      },
      onSearch() {
        this.loadData(1);
      },
      modalFormOk() {
        this.loadData();
      }
    }
  }
</script>

<style scoped>
  .ant-table-tbody .ant-table-row td {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  #components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color .3s;
  }
</style>
