<template>
  <div id="lineChart" class="lineChartArea" style="background: unset !important" ref="myChart"></div>
</template>

<script>
import * as echarts from 'echarts'
import { getAction } from '@api/manage'

export default {
  props:['area'],
  data() {
    return {
      id: 'lineChart',
      myChart: null,
      totalNumber: 0,
      lineData: [],
    }
  },
  mounted() {
    this.loadChart()
  },
  beforeDestroy() {
    if (!this.myChart) {
      return
    }
    this.myChart.dispose()
    this.myChart = null
  },
  watch:{
    area:{
      handler(value){
        this.loadChart()
      },
      deep:true,
      immediate:true
    }
  },
  methods: {
    async loadChart() {
      const params = {
        subject: this.area,
        source: 'twelve',
      }
      let lineData = null
      let url = '/srm/contractBase/fetchContractNum'
      await getAction(url, params)
        .then((res) => {
          this.$emit('getNumber', res.result.num)
        })
        .catch((err) => {})
      let url1 = '/srm/contractBase/fetchContractNumByMonth'
      await getAction(url1, params)
        .then((res) => {
          lineData = res.result
        })
        .catch((err) => {})

      //
      this.$nextTick(() => {
        this.myChart = echarts.init(document.getElementById('lineChart'))
        this.myChart.setOption(this.initOption(lineData))
      })
    },
    initOption(option) {
      let data = {
        title: {
          text: '',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // type: "cross",
            // label: {
            //   backgroundColor: "#4196ff",
            // },
          },
        },
        legend: {
          show: false,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: '#192883',
              },
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgb(167,169,173)', // 更改坐标轴文字颜色
                fontSize: 14, // 更改坐标轴文字大小
              },
            },
            boundaryGap: false,
            data: option.monthList,
          },
        ],
        yAxis: [
          {
            type: 'value',
            splitNumber: 5,
            boundaryGap: [0, '150%'],
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: 'rgba(255, 255, 255,0.9)',
              },
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgb(167,169,173)', // 更改坐标轴文字颜色
                fontSize: 14, // 更改坐标轴文字大小
              },
            },
            axisLine: {
              show: false, // 不显示坐标轴刻度线
            },
          },
        ],
        series: [
          {
            name: '合同数',
            type: 'line',
            areaStyle: {
              // color:'#192883',
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#a0b8f5',
                },
                {
                  offset: 1,
                  color: '#f1f4fc',
                },
              ]),
            },
            lineStyle: {
              shadowOffsetX: 0, // 折线的X偏移
              shadowOffsetY: 9, // 折线的Y偏移
              shadowBlur: 8, // 折线模糊
              shadowColor: 'rgba(145, 132, 132, 1)', //折线颜色

              normal: {
                width: 3,
                color: '#192883',
              },
            },
            smooth: true,
            data: option.dataList,
          },
        ],
      }
      return data
    },
  },
}
</script>

<style lang="less" scoped>
.lineChartArea {
  background: unset !important;
  height: 95%;
  margin-top: 10px;
}
</style>

