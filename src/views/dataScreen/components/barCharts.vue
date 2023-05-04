<template>
        <div
            id="barChart"
            class="barChart"
            style="background: unset !important"
            ref="myChart"
        ></div>
</template>

<script>
import * as echarts from "echarts";
import { getAction } from '@api/manage'

export default {
  props:['area'],
  data() {
    return {
      id: "lineChart",
      myChart: null,
    };
  },
  mounted() {
    this.loadChart();
  },
  beforeDestroy() {
    if (!this.myChart) {
      return;
    }
    this.myChart.dispose();
    this.myChart = null;
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
        unit: 'wy'
      }
      let lineData = null
      let url = '/srm/purPayPlan/fetchPayAmountByProjId'
      await getAction(url, params)
        .then((res) => {
          this.$emit('getBarNumber', res.result.payAmountCope)
        })
        .catch((err) => {
          this.$emit('getBarNumber', '0')
        })
      let url1 = '/srm/purPayPlan/fetchPayAmountByMonth'
      await getAction(url1, params)
        .then((res) => {
          lineData = res.result
        })
        .catch((err) => {})

      this.$nextTick(() => {
        this.myChart = echarts.init(document.getElementById("barChart"));
        this.myChart.setOption(this.initOption(lineData));
      });
    },
    initOption(option) {

      let data = {
        title: {
          text: "",
        },
        tooltip: {
          trigger: "axis",
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
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            splitLine: {
              show: false,
              lineStyle: {
                type: "dashed",
                color: "#192883",
              },
            },
            axisLabel: {
            show: true,
            textStyle: {
              color: "rgb(167,169,173)", // 更改坐标轴文字颜色
              fontSize: 14, // 更改坐标轴文字大小
            },
          },
            // boundaryGap: false,
            data: option.monthList,
          },
        ],
        yAxis: [
          {
            type: "value",
            splitNumber: 5,
            // boundaryGap: [0, '150%'],
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
                color: "#192883",
              },
            },
            axisLabel: {
            show: true,
            textStyle: {
              color: "rgb(167,169,173)", // 更改坐标轴文字颜色
              fontSize: 14, // 更改坐标轴文字大小
            },
          },
            axisLine: {
              show: true, // 不显示坐标轴刻度线
            },
          },
        ],
        series: [
         {
            name: "支出金额（万元）",
            type: "bar",
            barWidth: "20%",
            itemStyle: {
              // 柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
              normal: {
                // 柱形图圆角，初始化效果
                barBorderRadius: [6, 6, 0, 0],
                 color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                // 四个数字分别对应 数组中颜色的开始位置，分别为 右，下，左，上。例如（1,0,0,0 ）代表从右边开始渐
                // 变。offset取值为0~1，0代表开始时的颜色，1代表结束时的颜色，柱子表现为这两种颜色的渐变。
                offset: 0.01,
                color: '#192883'
                }, {
                offset: 1,
                color: '#f1f4fc'
                }]),
              },

            },
            data: option.dataList,
          },
        ],
      };
      return data;
    },
  },

};
</script>

<style lang="less" scoped>
.barChart {
  background: unset !important;
  height: 95%;
  margin-top: 10px;
}
</style>

