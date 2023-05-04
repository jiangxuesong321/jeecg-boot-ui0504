<template>
  <a-card :bordered="false">
    <div>
      <table width="100%" style="border: 1px solid black; border-collapse:collapse;">
        <tr>
          <th style="background-color:#fafafa; border: 1px solid black;">项目编码</th>
          <td style="border: 1px solid black;">{{detailItem.projCode}}</td>
          <th style="background-color:#fafafa; border: 1px solid black;">项目名称</th>
          <td style="border: 1px solid black;">{{ detailItem.projName }}</td>
          <th style="background-color:#fafafa; border: 1px solid black;">项目类别</th>
          <td style="border: 1px solid black;">{{ detailItem.projType=='1'?'寻源清单': detailItem.projType=='2'?'工艺配套':detailItem.projType=='3'?'自动化及信息化配套':'基建配套'}}</td>
          <th style="background-color:#fafafa; border: 1px solid black;">项目立项日期</th>
          <td style="border: 1px solid black;">{{ detailItem.projInitiationDate }}</td>
        </tr>
        <tr>
          <th style="background-color:#fafafa; border: 1px solid black;">申请部门名称</th>
          <td style="border: 1px solid black;">{{detailItem.applyOrgName}}</td>
          <th style="background-color:#fafafa; border: 1px solid black;">申请人名称</th>
          <td style="border: 1px solid black;">{{detailItem.applyUserName}}</td>
          <th style="background-color:#fafafa; border: 1px solid black;">执行金额</th>
          <td style="border: 1px solid black;">{{detailItem.budgetAmount}}</td>
          <th style="background-color:#fafafa; border: 1px solid black;">冻结金额</th>
          <td style="border: 1px solid black;">{{ detailItem.freezeAmount }}</td>
        </tr>
        <tr>
          <th style="background-color:#fafafa; border: 1px solid black;">已用金额</th>
          <td style="border: 1px solid black;" colspan="3">{{ detailItem.usedAmount }}</td>
          <th style="background-color:#fafafa; border: 1px solid black;">备注</th>
          <td style="border: 1px solid black;" colspan="3">{{ detailItem.remark }}</td>
        </tr>
        <tr>
          <th style="background-color:#fafafa; border: 1px solid black;">附件</th>
          <td style="border: 1px solid black;" colspan="7">
            <j-upload v-model="detailItem.attachment" :trigger-change="true" :disabled="true"></j-upload>
          </td>
        </tr>
      </table>
    </div>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import store from '@/store'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JDictSelectTag from '@comp/dict/JDictSelectTag.vue'
  import JDate from '@comp/jeecg/JDate.vue'
  import { filterObj, iegAmount, isNotNullOrEmpty, isNullOrEmpty} from '@/utils/util'
  import { getAction, httpAction } from '@api/manage'
  import { billListMixin } from '../../../mixins/billListMixin'
  import { billModalMixin } from '../../../mixins/billModalMixin'

  export default {
    name: "DeliveryNoteList",
    mixins:[JeecgListMixin, billListMixin, billModalMixin],
    components: {
      JDictSelectTag,
      JDate
    },

    data () {
      return {
        idx: '0',
        detailItem: {},
        visible: false,
        disableMixinCreated: true,
        iegAmount,
        isNotNullOrEmpty,
        isNullOrEmpty,
        filterObj,
        description: '项目基本信息',
        url: {
          list: "/sale/saleDeliveryNoteDetail/getCanDeliveryDetail"
        },
        dictOptions:{},
        updateCustomerAddress: false
      }
    },
    mounted() {
    },
    methods: {
      moment,
	  edit(record) {
	  	this.detailItem = Object.assign({}, record);
	  },
      initDictConfig() {},
      customRow(record, index) {
        return {
          // 这个style就是我自定义的属性，也就是官方文档中的props
          style: {
            // 行背景色
            'background-color': index%2!==0 ? '#fafafa' : '#fefefe',
            // 字体类型
            'font-family':'Microsoft YaHei',
          },
        }
      },
      handleCancel() {
        this.visible = false
      }
    }

  }
</script>

<style lang="less" scoped>
  @import '~@assets/less/common.less';
/*
  .table-page-search-wrapper {
    margin-bottom: 8px;
  } */

/* .table-page-search-wrapper
  .table-page-search-wrapper .table-page-search-submitButtons {
    margin-top: 12px;
    margin-bottom: 12px;
  } */
</style>
<style lang="less" scoped>
  .ant-row.ant-form-item {
    margin-bottom: 12px;
  }
</style>