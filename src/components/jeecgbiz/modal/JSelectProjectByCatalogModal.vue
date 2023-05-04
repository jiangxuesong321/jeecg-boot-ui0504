<template>
  <j-modal
    :width="modalWidth"
    :visible="visible"
    :title="title"
    switchFullscreen
    wrapClassName="j-user-select-modal"
    @ok="handleSubmit"
    @cancel="close"
    style="top:50px"
    cancelText="关闭"
  >
    <a-card :bordered="false">
      <a-form>
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="项目编码" :labelCol="labelCol3" :wrapperCol="wrapperCol3">
              <a-input placeholder="请输入项目编码" v-model="queryParam.projCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="项目名称" :labelCol="labelCol3" :wrapperCol="wrapperCol3">
              <a-input placeholder="请输入项目名称" v-model="queryParam.projName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
             <a-button @click="onSearch(1)" icon="search" style="margin-right: 10px" type="primary">查询</a-button>
             <a-button @click="searchReset(1)" icon="redo" type="primary">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
        <!--用户列表-->
      <a-table
        ref="table"
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
  </j-modal>
</template>

<script>
import { pushIfNotExist, filterObj } from '@/utils/util'
import {getBasProject} from '@/api/api'
import { getAction } from '@/api/manage'
export default {
  name: 'JSelectUserByDepModal',
  components: {},
  props: ['modalWidth', 'multi', 'ids', 'store', 'text','param'],
  data() {
    return {
      labelCol3: {span: 6},
      wrapperCol3: {span: 18},
      queryParam: {
        projCode: "",
        projName:"",
      },
      columns: [
        {
          title: '项目编码',
          align: 'center',
          dataIndex: 'projCode'
        },
        {
          title: '项目名称',
          align: 'center',
          dataIndex: 'projName',
        },
        // {
        //   title: '项目类型',
        //   align: 'center',
        //   dataIndex: 'projType_dictText'
        // },
      ],
      scrollTrigger: {},
      dataSource: [],
      selectionRows: [],
      selectedRowKeys: [],
      selectUserRows: [],
      selectUserIds: [],
      title: '选择项目',
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
      selectedDepIds: [],
      departTree: [],
      visible: false,
      form: this.$form.createForm(this),
      loading: false,
      expandedKeys: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
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
    ids: {
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
      if (this.ids) {
        // 这里最后加一个 , 的原因是因为无论如何都要使用 in 查询，防止后台进行了模糊匹配，导致查询结果不准确
        let values = this.ids.split(',') + ','
        let param = {[this.store]: values}
        let url = "/srm/projBase/queryNoPageList";
        getAction(url,param).then((list)=>{
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
      params.auth = this.param.auth;
      params.auther = this.param.auther;
      this.loading = true
      getBasProject(params).then(res=>{
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
      that.selectedDepIds = [];
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
      this.selectUserIds = this.selectUserRows.map(row => row.username).join(',')
    },
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys;
      selectionRows.forEach(row => pushIfNotExist(this.selectionRows, row, 'id'))
    },
    onSearch() {
      this.loadData(1);
    },
    //update-end-author:taoyan date:20211202 for: 异步加载部门树 https://github.com/jeecgboot/jeecg-boot/issues/3196
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
