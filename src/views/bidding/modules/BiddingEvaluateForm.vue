<template>
  <a-drawer
    :title="title"
    :width="width"
    placement="right"
    :closable="false"
    @close="close"
    destroyOnClose
    :maskClosable="false"
    :visible="visible">
    <a-spin :spinning="confirmLoading">
      <div style="display: flex; margin-bottom: 10px;">
        <h2 style="color: #0000CC; font-size: 20px;">{{ model.biddingNo }}</h2>
        <span style="display: inline-block;line-height: 30px;padding-left: 10px;">评标现场</span>
      </div>
      <div>
        评标时间:{{ model.biddingStartTime }} 至 {{ model.biddingEndTime }}
      </div>
      <h2 class="zhaobiao-title">
        招标方文件
      </h2>
      <div class="zhaobiao-item">
        招标方:德莱维SRM
      </div>
      <div class="zhaobiao-item">
        招标文件:
        <j-upload v-model="model.attachment" :trigger-change="true" disabled></j-upload>
      </div>
      <h2 style="position: absolute; right: 10px; top: 10px;">
        <span v-if="model.status == '1'" style="color: #00DB00">已评分</span>
        <span v-if="model.status == '0'" style="color: red">待评分</span>
      </h2>
      <hr style="margin-top: 10px; margin-bottom: 10px;border: none;border-bottom: 1px #efefef solid;" />
      <h2 class="zhaobiao-title" style="margin-top: 0px;">评分标的</h2>
      <a-button type="primary" @click="openBidding('0',model.biddingEvaluateType)" style="float: right;z-index: 9999;margin-top: -30px;"
                v-if="model.status == '0'">进入评分
      </a-button>
      <a-button type="primary" @click="openBidding('1',model.biddingEvaluateType)" style="float: right;z-index: 9999;margin-top: -30px;"
                v-if="model.status == '1'">查看评分
      </a-button>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        style="margin-top: -20px;"
        class="j-table-force-nowrap"
        :scroll="{x:true}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false">
      </a-table>
    </a-spin>
    <div class="drawer-footer" style="text-align: center;margin-top:15px;">
      <a-button @click="close" style="margin-left:10px;" type="primary" ghost>返回</a-button>
    </div>

    <bidding-to-professional-form ref="modalForm" @back="back"></bidding-to-professional-form>
  </a-drawer>
</template>

<script>
import { getAction } from '@/api/manage'
import { JVxeTableModelMixin } from '@/mixins/JVxeTableModelMixin.js'
import JFormContainer from '@/components/jeecg/JFormContainer'
import { billListMixin } from '../../mixins/billListMixin'
import { billModalMixin } from '../../mixins/billModalMixin'
import JSelectSupplierModal from '@comp/jeecgbiz/modal/JSelectSupplierModal'
import BasTemplate from '@views/bidding/modules/BasTemplate'
import BasExpert from '@views/bidding/modules/BasExpert'
import BiddingToProfessionalForm from '@views/bidding/modules/BiddingToProfessionalForm'

export default {
  name: 'BiddingEvaluateForm',
  mixins: [JVxeTableModelMixin, billListMixin, billModalMixin],
  components: {
    JFormContainer,
    JSelectSupplierModal,
    BasTemplate,
    BasExpert,
    BiddingToProfessionalForm
  },
  data() {
    return {
      title: '评标现场',
      width: '80%',
      visible: false,
      columns: [
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
          title: '标的编码',
          dataIndex: 'prodCode',
          align: 'center',
          width: 120
        },
        {
          title: '标的名称',
          dataIndex: 'prodName',
          align: 'center',
          width: 200
        },
        {
          title: '采购数量',
          dataIndex: 'qty',
          width: 120,
          customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
            const obj = {
              children: value,
              attrs: {},
            };
            obj.attrs.align = 'right';//控制表体内容居右
            return obj;
          }
        },
        {
          title: '计量单位',
          dataIndex: 'unitId_dictText',
          align: 'center',
          width: 120
        },
        {
          title: '邀标供应商数量',
          dataIndex: 'num',
          width: 120,
          customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
            const obj = {
              children: value,
              attrs: {},
            };
            obj.attrs.align = 'right';//控制表体内容居右
            return obj;
          }
        },
        {
          title: '投标供应商数量',
          dataIndex: 'actNum',
          width: 120,
          customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
            const obj = {
              children: value,
              attrs: {},
            };
            obj.attrs.align = 'right';//控制表体内容居右
            return obj;
          }
        }
        // {
        //   title: '状态',
        //   dataIndex: 'status',
        //   width:120,
        //   customRender:function (t,r,index) {
        //     return t == '1' ? '已评分' : '待评分';
        //   }
        // },
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   align: 'center',
        //   width: 100,
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      dataSource: [],
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 5
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 16
        }
      },
      model: {},
      // 新增时子表默认添加几行空数据
      validatorRules: {},
      activeKey: '0',
      url: {}
    }
  },
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    }
  },
  created() {
  },
  methods: {
    openBidding(type) {
      if (type == '0') {
        this.$refs.modalForm.edit(this.model)
      } else {
        this.$refs.modalForm.editTwo(this.model)
      }
    },
    close() {
      this.visible = false;
      this.$emit('backQuery');
    },
    back() {
      this.groupByTemplateList(this.model.id)
    },
    groupByTemplateList(id) {
      let url = '/srm/biddingMain/groupByTemplateList'
      let param = {
        id: id,
        professionalId:this.model.professionalId
      }
      getAction(url, param).then(res => {
        if (res.result != null && res.result.length > 0) {
          this.model.status = res.result[0].status
        }
      })
    },
    edit(record) {
      this.visible = true
      this.dataSource = []
      this.model = Object.assign({}, record)
      if (this.model.id) {
        this.fetchRecordList(this.model.id)
        this.fetchTemplateList(this.model.id)
      }
    },
    fetchTemplateList(id) {
      let url = '/srm/biddingMain/fetchTemplateList'
      let param = {
        id: id,
        professionalId: this.model.professionalId
      }
      getAction(url, param).then(res => {
        this.model.templateList = res.result
      })
    },
    fetchRecordList(id) {
      let url = '/srm/biddingMain/fetchRecordList'
      let param = {
        id: id,
        professionalId: this.model.professionalId
      }
      getAction(url, param).then(res => {
        this.dataSource = res.result
      })
    }
  }
}
</script>
<style>
.zhaobiao-title {
  margin-top: 20px;
  font-size: 18px;
  line-height: 40px;
}

.zhaobiao-item {
  line-height: 30px;
}
</style>
<style lang="less" scoped>
.ant-row.ant-form-item {
  margin-bottom: 12px;
}
</style>
