<template>
<!--  <j-modal-->
<!--    :width="modalWidth"-->
<!--    :visible="visible"-->
<!--    :title="title"-->
<!--    switchFullscreen-->
<!--    wrapClassName="j-user-select-modal"-->
<!--    @ok="handleSubmit"-->
<!--    @cancel="close"-->
<!--    style="top:50px"-->
<!--    cancelText="关闭"-->
<!--  >-->
  <div>
    <a-drawer
      :title="title"
      :width="modalWidth"
      placement="right"
      :closable="false"
      @close="close"
      destroyOnClose
      :visible="visible">
      <a-card :bordered="false">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row>
              <a-col :xl="5" :lg="7" :md="8" :sm="24">
                <a-form-item label="供应商编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input  placeholder="供应商编码" v-model="queryParam.code"></a-input>
                </a-form-item>
              </a-col>
              <a-col :xl="5" :lg="7" :md="8" :sm="24">
                <a-form-item label="供应商名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input  placeholder="供应商名称" v-model="queryParam.name"></a-input>
                </a-form-item>
              </a-col>
              <a-col :xl="5" :lg="7" :md="8" :sm="24">
                <a-form-item label="联系人电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input  placeholder="联系人电话" v-model="queryParam.contacterTel"></a-input>
                </a-form-item>
              </a-col>

              <a-col :span="6" style="margin-left: 5px;margin-top: 0px">
                <a-button @click="onSearch(1)" icon="search" style="margin-right: 10px" type="primary">查询</a-button>
                <a-button @click="searchReset(1)" icon="redo" type="primary">重置</a-button>
              </a-col>
            </a-row>

          </a-form>
        </div>

        <!--用户列表-->
        <a-table
          ref="table"
          :scroll="{x:1000,y:500}"
          size="middle"
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type: getType}"
          :loading="loading"
          @change="handleTableChange">
          <template slot="isActive" slot-scope="text,record">
            <a v-if="record.num != null && record.num != '' && record.num > 0" @click="openContract(record)">
              是
            </a>
            <span v-else>
              否
            </span>
          </template>
        </a-table>
      </a-card>
      <div class="drawer-footer" style="text-align: center;margin-top:15px;">
        <a-button key="approved" @click="handleSubmit" type="primary">确认</a-button>
        <a-button key="cancel" @click="close" style="margin-left:10px;" type="primary" ghost>关闭</a-button>
      </div>
    </a-drawer>
    <a-drawer
      title="合同清单"
      :width="width"
      placement="right"
      :closable="false"
      @close="close1"
      destroyOnClose
      :visible="visible1">
        <bas-supplier-contract-list ref="contract" :suppId="suppId"></bas-supplier-contract-list>
        <div class="drawer-footer" style="text-align: center;margin-top:15px;">
          <a-button key="cancel" @click="close1" style="margin-left:10px;" type="primary" ghost>关闭</a-button>
        </div>
    </a-drawer>
  </div>


<!--  </j-modal>-->
</template>

<script>
import { filterObj, pushIfNotExist } from '@/utils/util'
import { getAction } from '@/api/manage'
import BasSupplierContractList from '@views/contract/BasSupplierContractList'

export default {
    name: 'JSelectSupplierModal',
    components: {
      BasSupplierContractList
    },
    props: ['modalWidth', 'multi', 'userIds', 'store', 'text'],
    data() {
      return {
        suppId:'',
        visible1:false,
        width:'90%',
        queryParam: {
          username: "",
        },
        columns: [
          {
            title: '供应商编码',
            align: 'center',
            dataIndex: 'code'
          },
          {
            title: '供应商名称',
            align: 'center',
            dataIndex: 'name'
          },
          {
            title: '联系人',
            align: 'center',
            dataIndex: 'contacter'
          },
          {
            title: '联系人电话',
            align: 'center',
            dataIndex: 'contacterTel'
          },
          {
            title: '联系人邮箱',
            align: 'center',
            dataIndex: 'contacterEmail'
          },
          {
            title: '是否活跃供应商',
            align: 'center',
            dataIndex: 'isActive',
            scopedSlots: { customRender: 'isActive' }
          },
        ],
        scrollTrigger: {},
        dataSource: [],
        selectionRows: [],
        selectedRowKeys: [],
        selectUserRows: [],
        selectUserIds: [],
        title: '选择供应商',
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
        labelCol: {span: 6},
        wrapperCol: {span: 18},
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
      close1(){
        this.visible1 = false;
      },
      openContract(record){
        this.visible1 = true;
        this.suppId = record.id;
        this.$refs.contreact.loadData();
      },
      initUserNames() {
        if (this.userIds) {
          // 这里最后加一个 , 的原因是因为无论如何都要使用 in 查询，防止后台进行了模糊匹配，导致查询结果不准确
          let values = this.userIds.split(',') + ','
          let param = {[this.store]: values}
          getAction('/srm/basSupplier/getMultiSupp', param).then((list)=>{
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
        this.loading = true;
        params.status = '6';
        params.source = 'public';
        getAction('/srm/basSupplier/list', params).then(res=>{
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
        param.status = '6';
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
        if(that.selectionRows == null || that.selectionRows.length == 0){
          that.$message.warning("请选择供应商");
          return;
        }
        that.getSelectUserRows();
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
