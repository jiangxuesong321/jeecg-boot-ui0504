<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
<!--    <a-timeline>-->
<!--      <a-timeline-item v-for="(item,index) in dataSource">-->
<!--          <div v-if="item.name != null && item.name != '' && item.name != undefined">-->
<!--            <div v-for="(it,idx) in item.name.split(',')">-->
<!--              {{it}}-->
<!--            </div>-->
<!--          </div>-->
<!--      </a-timeline-item>-->
<!--    </a-timeline>-->
    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      class="j-table-force-nowrap"
      :scroll="{x:true,y:500}"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loading">
      <template slot="name" slot-scope="text,record">
        <div v-if="text != null && text != '' && text != undefined">
          <div v-for="(item,index) in text.split(',')">
            {{item}}
          </div>
        </div>
      </template>
    </a-table>
    <template slot="footer">
      <a-button @click="handleCancel" type="primary">取消</a-button>
    </template>
  </a-modal>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction } from '@api/manage'
  export default {
    name: 'BasSupplierContractModal',
    mixins:[JeecgListMixin],
    props:['type'],
    components: {

    },
    data () {
      return {
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
            title:'审批节点',
            align:"center",
            dataIndex: 'name',
            scopedSlots: {
              customRender: 'name'
            }
          },
          // {
          //   title:'审批人',
          //   align:"center",
          //   dataIndex: 'approver',
          // },
          // {
          //   title:'审批状态',
          //   align:"center",
          //   dataIndex: 'status',
          //   customRender:function (text) {
          //     if(text == '4' || text == '2'){
          //       return '通过';
          //     }else if(text == '5' || text == '1'){
          //       return '驳回';
          //     }else if(text == '8' || text == '0'){
          //       return '审批中';
          //     }
          //   }
          // },
          // {
          //   title:'审批时间',
          //   align:"center",
          //   dataIndex: 'updateTime',
          //   customRender:function (text) {
          //     return !text?"":(text.length>10?text.substr(0,10):text)
          //   }
          // },
        ],
        title:'',
        width:600,
        visible: false,
        disableSubmit: false
      }
    },
    methods: {
      loadData(businessId) {
        var params = this.getQueryParams();//查询条件
        this.loading = true;
        let url = "/srm/contractBase/fetchApproveList";
        params.type = this.type;
        params.businessId = businessId;
        getAction(url, params).then((res) => {
          if (res.success) {
            //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
            this.dataSource = res.result.records||res.result;
          }else{
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        this.$refs.realForm.submitForm();
      },
      submitCallback(){
        this.$emit('ok');
        this.visible = false;
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>