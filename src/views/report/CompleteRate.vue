<template>
  <a-spin :spinning="loading">
    <a-card :bordered="false">
      <div class="card-title">
        资金计划完成率
      </div>
      <a-card>
        <a-row>
          <a-col :span="12">
            <div class="card-title">
              资金计划完成率(笔数)
            </div>
          </a-col>
          <a-col :span="6">
            <a-range-picker
              :placeholder="['开始月份', '结束月份']"
              format="YYYY-MM"
              valueFormat="YYYY-MM"
              :value="queryParam.monthList"
              :mode="mode2"
              @panelChange="handlePanelChange2"
              :allowClear="false"
            />
          </a-col>
          <a-col :span="6">
            <j-dict-select-tag style="width: 80%" v-model="queryParam.projId"
                               @change="searchQuery"
                               placeholder="请选择项目"
                               dictCode="proj_base,proj_name,id,del_flag = '0' order by create_time desc" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <stack-line :monthList="monthList" :dataList="dataList" ref="stackLine" :y="'百分比(%)'"
                        :x="'月份'"></stack-line>
          </a-col>
        </a-row>
      </a-card>
      <!--      <a-card>-->
      <!--        <a-row>-->
      <!--          <a-col :span="12">-->
      <!--            <div class="card-title">-->
      <!--              采购资金目标与完成分析-->
      <!--            </div>-->
      <!--          </a-col>-->
      <!--        </a-row>-->
      <!--        <a-row>-->
      <!--          <a-col :span="24">-->
      <!--            <line-chart :monthList="monthList1" :dataList="dataList1" ref="lineChart"></line-chart>-->
      <!--          </a-col>-->
      <!--        </a-row>-->
      <!--      </a-card>-->
      <a-card>
        <a-row>
          <a-col :span="12">
            <div class="card-title">
              计划完成与目标差额分析
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <column-chart :monthList="monthList2" :dataList="dataList2" ref="columnChart" :x="'月份'"
                          :y="'笔数(笔)'"></column-chart>
          </a-col>
        </a-row>
      </a-card>
      <a-card>
        <a-row>
          <a-col :span="12">
            <div class="card-title">
              目标完成情况数据
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-button type="primary" icon="download" @click="handleExportXls('目标完成情况数据')" style='float: right;z-index: 99'>导出</a-button>
          <a-table ref="table" size="middle" :scroll="{x:true, y:500}" bordered rowKey="id"
                   :columns="columns" :dataSource="dataSource" :pagination="false"
                   class="j-table-force-nowrap">
          </a-table>
        </a-row>
      </a-card>
    </a-card>
  </a-spin>

</template>

<script>
import '@/assets/less/TableExpand.less'
import { downFile, getAction } from '@api/manage'
import moment from 'moment'
import LineChartMultid from '@comp/chart/LineChartMultid'
import LineChart from '@views/report/LineChart'
import ColumnChart from '@views/report/ColumnChart'
import { isNotNullOrEmpty, isNullOrEmpty } from '@/utils/util'
import StackLine from '@views/report/StackLine'

export default {
  name: 'CompleteRate',
  mixins: [],
  components: {
    moment,
    LineChartMultid,
    LineChart,
    ColumnChart,
    StackLine
  },
  data() {

    return {
      url: {
        exportXlsUrl: "/srm/report/exportPlanAmountByYear",
      },
      mode2: ['month', 'month'],
      value: [],
      loading: false,
      monthList2: [],
      dataList2: [],
      monthList1: [],
      dataList1: [],
      monthList: [],
      dataList: [],
      aliases: [
        [{ field: 'rate', alias: '完成率' }, { field: 'prop', alias: '占比' }]
      ],
      fields: ['rate', 'prop'],
      data1: [
        // { type: 'Jan', rate: 7.0, prop: 3.9 },
        // { type: 'Feb', rate: 6.9, prop: 4.2 },
        // { type: 'Mar', rate: 9.5, prop: 5.7 },
        // { type: 'Apr', rate: 14.5, prop: 8.5 },
        // { type: 'May', rate: 18.4, prop: 11.9 },
        // { type: 'Jun', rate: 21.5, prop: 15.2 },
        // { type: 'Jul', rate: 25.2, prop: 17.0 },
        // { type: 'Aug', rate: 26.5, prop: 16.6 },
        // { type: 'Sep', rate: 23.3, prop: 14.2 },
        // { type: 'Oct', rate: 18.3, prop: 10.3 },
        // { type: 'Nov', rate: 13.9, prop: 6.6 },
        // { type: 'Dec', rate: 9.6, prop: 4.8 }
      ],
      open: false,
      height: 420,
      queryParam: {
        year: moment(),
        monthList: []
      },
      columns: [
        {
          title: '#',
          dataIndex: 'title',
          width: 120,
          align: 'center'
        },
        {
          title: '1月',
          dataIndex: 'one',
          width: 120,
          customRender: function(t, r, index) {
            let value = ''
            if (isNotNullOrEmpty(t) && (r.title == '占比' || r.title == '完成率')) {
              value = t + '%'
            } else {
              value = t
            }
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.align = 'center'//控制表体内容居右
            return obj
          }
        },
        {
          title: '2月',
          dataIndex: 'two',
          width: 120,
          customRender: function(t, r, index) {
            let value = ''
            if (isNotNullOrEmpty(t) && (r.title == '占比' || r.title == '完成率')) {
              value = t + '%'
            } else {
              value = t
            }
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.align = 'center'//控制表体内容居右
            return obj
          }
        },

        {
          title: '3月',
          dataIndex: 'three',
          width: 120,
          customRender: function(t, r, index) {
            let value = ''
            if (isNotNullOrEmpty(t) && (r.title == '占比' || r.title == '完成率')) {
              value = t + '%'
            } else {
              value = t
            }
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.align = 'center'//控制表体内容居右
            return obj
          }
        },
        {
          title: '4月',
          dataIndex: 'four',
          width: 120,
          customRender: function(t, r, index) {
            let value = ''
            if (isNotNullOrEmpty(t) && (r.title == '占比' || r.title == '完成率')) {
              value = t + '%'
            } else {
              value = t
            }
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.align = 'center'//控制表体内容居右
            return obj
          }
        },
        {
          title: '5月',
          dataIndex: 'five',
          width: 120,
          customRender: function(t, r, index) {
            let value = ''
            if (isNotNullOrEmpty(t) && (r.title == '占比' || r.title == '完成率')) {
              value = t + '%'
            } else {
              value = t
            }
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.align = 'center'//控制表体内容居右
            return obj
          }
        },
        {
          title: '6月',
          dataIndex: 'six',
          width: 120,
          customRender: function(t, r, index) {
            let value = ''
            if (isNotNullOrEmpty(t) && (r.title == '占比' || r.title == '完成率')) {
              value = t + '%'
            } else {
              value = t
            }
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.align = 'center'//控制表体内容居右
            return obj
          }
        },
        {
          title: '7月',
          dataIndex: 'seven',
          width: 120,
          customRender: function(t, r, index) {
            let value = ''
            if (isNotNullOrEmpty(t) && (r.title == '占比' || r.title == '完成率')) {
              value = t + '%'
            } else {
              value = t
            }
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.align = 'center'//控制表体内容居右
            return obj
          }
        },
        {
          title: '8月',
          dataIndex: 'eight',
          width: 120,
          customRender: function(t, r, index) {
            let value = ''
            if (isNotNullOrEmpty(t) && (r.title == '占比' || r.title == '完成率')) {
              value = t + '%'
            } else {
              value = t
            }
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.align = 'center'//控制表体内容居右
            return obj
          }
        },
        {
          title: '9月',
          dataIndex: 'nine',
          width: 120,
          customRender: function(t, r, index) {
            let value = ''
            if (isNotNullOrEmpty(t) && (r.title == '占比' || r.title == '完成率')) {
              value = t + '%'
            } else {
              value = t
            }
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.align = 'center'//控制表体内容居右
            return obj
          }
        },
        {
          title: '10月',
          dataIndex: 'ten',
          width: 120,
          customRender: function(t, r, index) {
            let value = ''
            if (isNotNullOrEmpty(t) && (r.title == '占比' || r.title == '完成率')) {
              value = t + '%'
            } else {
              value = t
            }
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.align = 'center'//控制表体内容居右
            return obj
          }
        },
        {
          title: '11月',
          dataIndex: 'eleven',
          width: 120,
          customRender: function(t, r, index) {
            let value = ''
            if (isNotNullOrEmpty(t) && (r.title == '占比' || r.title == '完成率')) {
              value = t + '%'
            } else {
              value = t
            }
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.align = 'center'//控制表体内容居右
            return obj
          }
        },
        {
          title: '12月',
          dataIndex: 'twelve',
          width: 120,
          customRender: function(t, r, index) {
            let value = ''
            if (isNotNullOrEmpty(t) && (r.title == '占比' || r.title == '完成率')) {
              value = t + '%'
            } else {
              value = t
            }
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.align = 'center'//控制表体内容居右
            return obj
          }
        },
        {
          title: '合计',
          dataIndex: 'total',
          width: 120,
          customRender: function(t, r, index) {
            let value = ''
            if (isNotNullOrEmpty(t) && (r.title == '占比' || r.title == '完成率')) {
              value = t + '%'
            } else {
              value = t
            }
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.align = 'center'//控制表体内容居右
            return obj
          }
        }
      ],
      dataSource: []
    }
  },
  created() {
    //获取当前年月
    let myDate = new Date()	//创建Date对象
    let year = myDate.getFullYear()   //获取当前完整年份
    let startMonth = year + '-01'
    let endMonth = year + '-12'
    this.queryParam.startMonth = startMonth
    this.queryParam.endMonth = endMonth
    this.queryParam.monthList.push(this.moment(startMonth))
    this.queryParam.monthList.push(this.moment(endMonth))

    //完成率&占比折线图
    this.fetchPlanAmountRate()
    //采购资金目标与完成分析
    // this.fetchPlanAmountProgress();
    //一季度完成与目标差额分析
    this.fetchPlanAmountDiff()
    //表格汇总
    this.fetchPlanAmountByYear()
    //月份
    this.fetchMonthList();
  },
  mounted() {

  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    },
  },
  methods: {
    handleExportXls(fileName){
      if(!fileName || typeof fileName != "string"){
        fileName = "导出文件"
      }
      let param = this.queryParam;
      if(this.selectedRowKeys && this.selectedRowKeys.length>0){
        param['selections'] = this.selectedRowKeys.join(",")
      }
      console.log("导出参数",param)
      downFile(this.url.exportXlsUrl,param).then((data)=>{
        if (!data) {
          this.$message.warning("文件下载失败")
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data],{type: 'application/vnd.ms-excel'}), fileName+'.xls')
        }else{
          let url = window.URL.createObjectURL(new Blob([data],{type: 'application/vnd.ms-excel'}))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName+'.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(url); //释放掉blob对象
        }
      })
    },
    getDistanceMonth(startTime, endTime) {
      startTime = new Date(startTime)
      endTime = new Date(endTime)

      let dateToMonth = 0
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const startDate = startTime.getDate() + startTime.getHours() / 24 + startTime.getMinutes() / 24 / 60
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const endDate = endTime.getDate() + endTime.getHours() / 24 + endTime.getMinutes() / 24 / 60

      if (endDate >= startDate) {
        dateToMonth = 0
      } else {
        dateToMonth = -1
      }

      const yearToMonth = (endTime.getYear() - startTime.getYear()) * 12
      const monthToMonth = endTime.getMonth() - startTime.getMonth()

      return yearToMonth + monthToMonth + dateToMonth + 1
    },
    handlePanelChange2(value, mode) {
      this.queryParam.monthList = value
      if (value != null && value.length > 0) {
        let startMonth = this.moment(value[0]).format('YYYY-MM')
        let endMonth = this.moment(value[1]).format('YYYY-MM')
        this.queryParam.startMonth = startMonth
        this.queryParam.endMonth = endMonth

        let days = this.getDistanceMonth(startMonth, endMonth)
        if (days > 24) {
          this.$message.error('只能选择近两年内的数据')
          return
        }
      }
      this.mode2 = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]]
      this.searchQuery()
    },
    fetchPlanAmountDiff() {
      this.monthList2 = []
      this.dataList2 = []
      let url = '/srm/report/fetchPlanAmountDiff'
      let param = this.queryParam
      getAction(url, param).then(res => {
        this.monthList2 = res.result.month
        this.dataList2 = res.result.data
        this.$forceUpdate()
      })
    },
    fetchPlanAmountProgress() {
      this.monthList1 = []
      this.dataList1 = []
      let url = '/srm/report/fetchPlanAmountProgress'
      let param = this.queryParam
      getAction(url, param).then(res => {
        this.monthList1 = res.result.month
        this.dataList1 = res.result.data
        this.$forceUpdate()
      })
    },
    fetchPlanAmountRate() {
      this.monthList = []
      this.dataList = []
      let url = '/srm/report/fetchPlanAmountRate'
      let param = this.queryParam
      getAction(url, param).then(res => {
        this.monthList = res.result.month
        this.dataList = res.result.data
        this.$forceUpdate()
      })
    },
    fetchMonthList(){
      let columns = [
        {
          title: '#',
          dataIndex: 'title',
          width: 120,
          align: 'center'
        },
      ];
      let url = '/srm/report/fetchMonthList'
      let month = ['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','ten3','ten4','ten5','ten6','ten7','ten8','ten9','ten10','ten11','ten12','ten13','ten14','total'];
      let param = this.queryParam
      getAction(url, param).then(res => {
        let dataList = res.result;
        let i = 0;
        dataList.filter(item =>{
          let row = {
            title: item,
            dataIndex: month[i],
            width: 120,
            customRender: function(t, r, index) {
              let value = ''
              if (isNotNullOrEmpty(t) && (r.title == '占比' || r.title == '完成率')) {
                value = t + '%'
              } else {
                value = t
              }
              const obj = {
                children: value,
                attrs: {}
              }
              obj.attrs.align = 'center'//控制表体内容居右
              return obj
            }
          }
          i++;
          columns.push(row);
        })
        let row = {
            title: '合计',
            dataIndex: 'total',
            width: 120,
            customRender: function(t, r, index) {
            let value = ''
            if (isNotNullOrEmpty(t) && (r.title == '占比' || r.title == '完成率')) {
              value = t + '%'
            } else {
              value = t
            }
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.align = 'center'//控制表体内容居右
            return obj
          }
        }
        columns.push(row);
        this.columns = columns;
      })
    },
    fetchPlanAmountByYear() {
      this.dataSource = []
      let url = '/srm/report/fetchPlanAmountByYear'
      let param = this.queryParam
      getAction(url, param).then(res => {
        this.dataSource = res.result
        this.$forceUpdate()
      })
    },
    moment,
    //Ant Design封装年份选择组件
    openChange(status) {
      if (status) {
        this.open = true
      } else {
        this.open = false
      }
    },
    panelChange(value) {
      let that = this
      that.queryParam.year = value
      that.open = false

      that.searchQuery()
    },
    searchQuery() {
      let that = this

      that.loading = true
      //完成率&占比折线图
      that.fetchPlanAmountRate()
      //采购资金目标与完成分析
      // that.fetchPlanAmountProgress();
      //一季度完成与目标差额分析
      that.fetchPlanAmountDiff()
      //表格汇总
      that.fetchPlanAmountByYear()
      //月份
      that.fetchMonthList();

      setTimeout(() => {
        that.$refs.stackLine.drawChart()

        // that.$refs.lineChart.drawChart();

        that.$refs.columnChart.drawChart()

        that.loading = false
      }, 1000)
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>

