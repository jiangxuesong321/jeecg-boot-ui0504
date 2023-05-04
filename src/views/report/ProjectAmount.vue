<template>
  <a-spin :spinning="loading">
    <a-card :bordered="false" >
      <div class="card-title">
        项目费用统计
      </div>
      <a-card>
        <a-row>
          <a-col :span="12">
            <div class="card-title">

            </div>
          </a-col>
          <a-col :span="6" style="margin-top: 10px">
<!--              <a-date-picker-->
<!--              format="YYYY"-->
<!--              mode="year"-->
<!--              :value="queryParam.year"-->
<!--              :open="open"-->
<!--              @openChange="openChange"-->
<!--              @panelChange="panelChange"-->
<!--              :allowClear = 'false'-->
<!--            />-->
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
          <a-col :span="6" style="margin-top: 10px">
<!--            <j-dict-select-tag style="width: 80%;float: right" v-model="queryParam.projId"-->
<!--                               :allow-clear="true"-->
<!--                               @change="searchQuery"-->
<!--                               placeholder="请选择项目" dictCode="proj_base,proj_name,id,del_flag = '0' order by create_time desc"/>-->
            <j-multi-select-tag style="width: 80%;float: right" v-model="queryParam.projId" :allow-clear="true" @change="searchQuery"
                                placeholder="请选择项目" dictCode="proj_base,proj_name,id,del_flag = '0' order by create_time desc">

            </j-multi-select-tag>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-button type="primary" icon="download" @click="handleExportXls('年度项目费用明细表')" style='float:right;z-index: 99;margin-top: 10px'>导出</a-button>
            <a-table
              id="tableExport"
              ref="table"
              size="middle"
              :scroll="{x:true,y:500}"
              bordered
              :columns="columns"
              :dataSource="dataSource"
              :pagination="false">
            </a-table>
          </a-col>
        </a-row>
      </a-card>

      <a-card>
        <a-row>
          <a-col :span="12">
            <div class="card-title">
              项目费用统计
            </div>
          </a-col>
        </a-row>
        <a-row>
          <bas-bar ref="basBar" :dataList="dataList" :data1List="data1List" :monthList="monthList" :x="'月份'" :y="'金额(元)'"></bas-bar>
        </a-row>
      </a-card>

<!--      <a-card>-->
<!--        <a-row>-->
<!--          <a-col :span="12">-->
<!--            <div class="card-title">-->
<!--              个月项目合计分析-->
<!--            </div>-->
<!--          </a-col>-->
<!--        </a-row>-->
<!--        <a-row>-->
<!--          <bas-line-chart ref="basLineChart" :dataList="dataList" :monthList="monthList"></bas-line-chart>-->
<!--        </a-row>-->
<!--      </a-card>-->

      <a-card>
        <a-row>
          <a-col :span="12">
            <div class="card-title">
              项目支出占比
            </div>
          </a-col>
        </a-row>
        <a-row>
          <bas-round ref="basRound" :dataList="dataList1" :id="'main5'"></bas-round>
        </a-row>
      </a-card>
    </a-card>

    <a-drawer
      :headerStyle="{ textAlign: 'center'}"
      :closable="false"
      :title="title"
      :width="width"
      :visible="visible"
      >
      <a-table
        ref="table"
        size="middle"
        :scroll="{x:true,y:500}"
        bordered
        :columns="columns"
        :dataSource="childList"
        :pagination="false">
      </a-table>
      <div style="text-align: center;">
        <a-button  @click="handleCancel" style="margin-left:10px;"  type="primary" >取消</a-button>
      </div>

    </a-drawer>
  </a-spin>

</template>

<script>
import '@/assets/less/TableExpand.less'
import moment from 'moment'
import { downFile, getAction, putAction } from '@api/manage'
import BasBar from '@views/report/BasBar'
import BasLineChart from '@views/report/BasLineChart'
import BasRound from '@views/report/BasRound1'
import {
  iegAmount, isNotNullOrEmpty, isNullOrEmpty
} from '@/utils/util'
export default {
  name: 'CompleteRate',
  mixins: [],
  components: {
    moment,
    BasBar,
    BasLineChart,
    BasRound
  },
  data() {
    return {
      param:{},
      childList:[],
      visible:false,
      width:'80%',
      title:'项目子项费用统计',
      mode2: ['month', 'month'],
      value: [],
      dataList1:[],
      monthList:[],
      dataList:[],
      data1List:[],
      columns:[
        {
          title: '内容',
          dataIndex: 'title',
          width: 120,
          align: "center",
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {},
            };
            obj.attrs.rowSpan = row.rowSpan;
            return obj;
          },
        },
        {
          title: '1月',
          dataIndex: 'one',
          width: 120,
          customRender:(t, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
            if(row.type != 'rate'){
              const obj = {
                children: '¥' + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }else{
              const obj = {
                children: t + '%',
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          }
        },
        {
          title: '2月',
          dataIndex: 'two',
          width: 120,
          customRender:(t, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
            if(row.type != 'rate'){
              const obj = {
                children: '¥' + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }else{
              const obj = {
                children: t + '%',
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          }
        },
        {
          title: '3月',
          dataIndex: 'three',
          width: 120,
          customRender:(t, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
            if(row.type != 'rate'){
              const obj = {
                children: '¥' + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }else{
              const obj = {
                children: t + '%',
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          }
        },
        {
          title: '4月',
          dataIndex: 'four',
          width: 120,
          customRender:(t, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
            if(row.type != 'rate'){
              const obj = {
                children: '¥' + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }else{
              const obj = {
                children: t + '%',
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          }
        },
        {
          title: '5月',
          dataIndex: 'five',
          width: 120,
          customRender:(t, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
            if(row.type != 'rate'){
              const obj = {
                children: '¥' + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }else{
              const obj = {
                children: t + '%',
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          }
        },
        {
          title: '6月',
          dataIndex: 'six',
          width: 120,
          customRender:(t, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
            if(row.type != 'rate'){
              const obj = {
                children: '¥' + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }else{
              const obj = {
                children: t + '%',
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          }
        },
        {
          title: '7月',
          dataIndex: 'seven',
          width: 120,
          customRender:(t, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
            if(row.type != 'rate'){
              const obj = {
                children: '¥' + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }else{
              const obj = {
                children: t + '%',
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          }
        },
        {
          title: '8月',
          dataIndex: 'eight',
          width: 120,
          customRender:(t, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
            if(row.type != 'rate'){
              const obj = {
                children: '¥' + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }else{
              const obj = {
                children: t + '%',
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          }
        },
        {
          title: '9月',
          dataIndex: 'nine',
          width: 120,
          customRender:(t, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
            if(row.type != 'rate'){
              const obj = {
                children: '¥' + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }else{
              const obj = {
                children: t + '%',
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          }
        },
        {
          title: '10月',
          dataIndex: 'ten',
          width: 120,
          customRender:(t, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
            if(row.type != 'rate'){
              const obj = {
                children: '¥' + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }else{
              const obj = {
                children: t + '%',
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          }
        },
        {
          title: '11月',
          dataIndex: 'eleven',
          width: 120,
          customRender:(t, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
            if(row.type != 'rate'){
              const obj = {
                children: '¥' + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }else{
              const obj = {
                children: t + '%',
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          }
        },
        {
          title: '12月',
          dataIndex: 'twelve',
          width: 120,
          customRender:(t, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
            if(row.type != 'rate'){
              const obj = {
                children: '¥' + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }else{
              const obj = {
                children: t + '%',
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          }
        },
        {
          title: '合计',
          dataIndex: 'total',
          width: 120,
          customRender:(t, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
            if(row.type != 'rate'){
              const obj = {
                children: '¥' + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }else{
              const obj = {
                children: t + '%',
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          }
        },
      ],
      dataSource:[],
      loading:false,
      open: false,
      height: 420,
      queryParam:{
        monthList:[],
        projId:undefined
      },
      url: {
        exportXlsUrl: "/srm/report/exportProjAmountByMonth",
      },
    }
  },
  watch : {
    queryParam: {
      handler(newObj, oldName) {
        if(isNullOrEmpty(newObj.projId)){
          newObj.projId = undefined;
          this.queryParam.projId = undefined;
        }
        console.log("============",newObj)
      },
      immediate: true,
      deep: true
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

    this.fetchProjAmountByMonth();
    this.fetchProjAmountBar();
    this.fetchProjAmountRound();
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
    handleCancel(){
      this.visible = false;
    },
    handleChild(row){
      this.childList = [];
      let projId = row.projId;
      let param = JSON.parse(JSON.stringify(this.queryParam));
      param.projId = projId;
      this.visible = true;
      let url = "/srm/report/fetchProjChildAmountByMonth";
      getAction(url,param).then(res => {
        this.childList = res.result;
      })
    },
    handleExportXls(fileName){
      if(!fileName || typeof fileName != "string"){
        fileName = "导出文件"
      }
      let param = this.queryParam;
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
    fetchMonthList(){
      let columns = [
        {
          title: '内容',
          dataIndex: 'title',
          width: 120,
          align: "center",
          fixed:'left',
          customRender:(t,r,index) => {
            let _this = this
            const child = _this.$createElement('a', {
              domProps: {
                innerHTML: t
              },
              on: {
                click: function() {
                  _this.handleChild(r)
                }
              }
            })

            const obj = {
              children:child,
              attrs: {},
            };
            obj.attrs.rowSpan = r.rowSpan;
            return obj;
          },
        },
        {
          title: '说明',
          dataIndex: 'type',
          width: 100,
          align: "center",
          fixed:'left',
          customRender: (value, row, index) => {
            if(value == 'rate'){
              return '完成率';
            }else if(value == 'complete'){
              return '已付金额';
            }else if(value == 'plan'){
              return '计划金额';
            }
          }
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
            customRender:(t, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
              if(row.type != 'rate'){
                const obj = {
                  children: '¥' + iegAmount(Math.trunc(t),'total'),
                  attrs: {},
                };
                obj.attrs.align = 'right';//控制表体内容居右
                return obj;
              }else{
                const obj = {
                  children: t + '%',
                  attrs: {},
                };
                obj.attrs.align = 'right';//控制表体内容居右
                return obj;
              }
            }
          }
          i++;
          columns.push(row);
        })
        let row = {
          title: '合计',
          dataIndex: 'total',
          width: 120,
          customRender:(t, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
            if(row.type != 'rate'){
              const obj = {
                children: '¥' + iegAmount(Math.trunc(t),'total'),
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }else{
              const obj = {
                children: t + '%',
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          }
        }
        columns.push(row);
        this.columns = columns;
      })
    },
    getDistanceMonth(startTime, endTime) {
      startTime = new Date(startTime)
      endTime = new Date(endTime)

      let dateToMonth = 0
      const startDate = startTime.getDate() + startTime.getHours() / 24 + startTime.getMinutes() / 24 / 60
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
    fetchProjAmountRound(){
      this.dataList1 = [];
      let url = "/srm/report/fetchProjAmountRound";
      let param = this.queryParam;
      getAction(url,param).then(res => {
        this.dataList1 = res.result;
      })
    },
    fetchProjAmountBar(){
      this.monthList = [];
      this.dataList = [];
      this.data1List = [];
      let url = "/srm/report/fetchProjAmountBar";
      let param = this.queryParam;
      getAction(url,param).then(res => {
        this.monthList = res.result.monthList;
        this.dataList = res.result.dataList;
        this.data1List = res.result.data1List;
      })
    },
    fetchProjAmountByMonth(){
      this.dataSource = [];
      let url = "/srm/report/fetchProjAmountByMonth";
      let param = this.queryParam;
      getAction(url,param).then(res => {
        this.dataSource = res.result;
      })
    },
    moment,
    openChange(status) {
      if (status) {
        this.open = true;
      } else {
        this.open = false;
      }
    },
    panelChange(value){
      let that = this;
      that.queryParam.year = value;
      that.open = false;
      that.searchQuery();
    },
    searchQuery(){
      let that = this;
      that.loading = true;
      that.fetchProjAmountByMonth();
      that.fetchProjAmountBar();
      that.fetchProjAmountRound();
      that.fetchMonthList();

      setTimeout(() => {
        that.$refs.basBar.drawChart();

        // that.$refs.basLineChart.drawChart();

        that.$refs.basRound.drawChart();

        that.loading = false;
      }, 1000)
    },
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>

