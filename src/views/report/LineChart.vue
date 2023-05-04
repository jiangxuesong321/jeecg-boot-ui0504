<template>
  <div>
    <div id="main1" style="width: 90%;height:400px;"></div>
  </div>
</template>

<script>
  import { preciseNum } from '@/utils/util'

  export default {
    name: 'LineChart',
    mixins: [],
    props:['monthList','dataList','text'],
    data() {
      return {

      }
    },
    computed: {

    },
    mounted() {
      let that = this;
      setTimeout(() => {
        that.drawChart();
      }, 500)
    },
    methods:{
      drawChart() {
        // 基于准备好的dom，初始化echarts实例
        let that = this;
        let myChart = that.$echarts.init(document.getElementById("main1"));
        let data1 = [];
        let data2 = [];
        let data3 = [];
        if(that.dataList != null && that.dataList.length > 0){
          data1 = that.dataList[0].data;
          data2 = that.dataList[1].data;
          data3 = that.dataList[2].data;
        }


        let option = {
          legend: {
            data: [],
            // data:that.monthList,
            left: '10%'
          },
          // brush: {
          //   toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
          //   xAxisIndex: 0
          // },
          // toolbox: {
          //   feature: {
          //     magicType: {
          //       type: ['stack']
          //     },
          //     dataView: {}
          //   }
          // },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {//提示内容
              let val1 = Number(params[1].value);
              let val0 = Number(params[0].value);
              let rate = preciseNum(val1 / val0 * 100 ,2);
              let relVal = params[0].name;
              relVal +=
                "<br/>" +
                params[0].marker +
                "目标 : " +
                params[0].value.toLocaleString()
                + "<br/>" +
                params[1].marker +
                "完成 : " +
                params[1].value.toLocaleString()
                + "<br/>" +
                "完成率 : " + rate + '%';
              return relVal;
            },
          },
          xAxis: {
            data: that.monthList,
            name: '',
            // axisLine: { onZero: true },
            // splitLine: { show: false },
            // splitArea: { show: false }
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, 1]
          },
          grid: {
            bottom: 100
          },
          series:
          // that.dataList
            [
              {//里层的柱子
                name: '目标',
                type: 'pictorialBar',//象形柱状图
                barWidth:50,//柱子的宽度
                data: data1,//柱子的数据
                symbol:'bar',//柱子的形状
                symbolRepeat:true,//是否重复
                symbolOffset: [4, 0],//柱子的位置
                symbolBoundingData:1,//图形的个数
                itemStyle:{}
              },
              { //外层的柱子
                name: "完成",
                type: "pictorialBar",
                barWidth:30,
                //symbolSize: [40, 18], //调整截面形状
                symbolOffset: [15, 0],
                symbol:'bar',
                symbolRepeat:true,
                symbolBoundingData:1,
                data: data2,
                z:12//柱子的层级
              },
          ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      }
    }
  }
</script>

<style scoped>

</style>