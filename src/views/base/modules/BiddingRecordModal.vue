<template>
<!--
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <bas-professionals-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></bas-professionals-form>
  </j-modal>
-->

  <a-drawer
    :title="title"
    width=80%
    placement="right"
    :closable="false"
    :headerStyle="{ textAlign: 'center'}"
    @close="close"
    destroyOnClose
    :visible="visible">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="项目名称">
              <a-input placeholder="请输入项目名称" v-model="queryParam.projectName" style="width: 100%"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="采购需求名">
              <a-input placeholder="请输入采购需求名" v-model="queryParam.reqTitle" style="width: 100%"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="供应商名">
              <a-input placeholder="请输入供应商名" v-model="queryParam.suppName" style="width: 100%"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
						<span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
							<a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
							<a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置
							</a-button>
						</span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-table
      ref="table"
      size="middle"
      bordered
      :scroll="{x:true,y:500}"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      @change="handleTableChange"
    >
    </a-table>
    <div class="drawer-footer" style="text-align: center;">
      <a-button key="cancel" @click="handleCancel" style="margin-left:10px;"  type="primary" ghost>取消</a-button>
    </div>
  </a-drawer>
</template>

<script>
import {
  JeecgListMixin
} from '@/mixins/JeecgListMixin'
import { getAction } from '@api/manage'

  export default {
    name: 'BiddingRecordModal',
    mixins: [JeecgListMixin],
    props: {

    },
    components: {

    },
    data () {
      return {
        queryParam:{},
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
            title: '项目名称',
            dataIndex: 'projectName',
            width:160,
            align: "center",
          },
          {
            title: '采购需求名',
            dataIndex: 'reqTitle',
            width:160,
            align: "center",
          },
          {
            title: '供应商',
            dataIndex: 'suppName',
            width:160,
            align: "center",
          },
          {
            title: '评标时间',
            dataIndex: 'createTime',
            width:120,
            align: "center",
          },
          {
            title: '评分',
            dataIndex: 'itemScore',
            width:100,
            align: "center",
          },
        ],
        dataSource:[],
        title:'参与评标记录',
        width:800,
        visible: false,
        disableSubmit: false
      }
    },
    methods: {
      searchReset(){
        this.queryParam.projectName = "";
        this.queryParam.reqTitle = "";
        this.queryParam.suppName = "";
        this.loadData(1);
      },
      searchQuery(){
        this.loadData(1);
      },
      edit (record) {
        this.visible = true;
        this.queryParam.professionalId = record.code;
        this.searchReset();
      },
      loadData(arg) {
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        var params = this.getQueryParams();//查询条件
        this.loading = true;
        let url = "/srm/biddingMain/fetchBidEvaluation";
        getAction(url, params).then((res) => {
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
      close () {
        this.visible = false;
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: center;
}
.drawer-footer{
  position: absolute;
  bottom: -8px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>