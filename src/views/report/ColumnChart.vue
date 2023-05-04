<template>
  <div>
    <div id="main" style="width: 100%;height:400px;"></div>
  </div>
</template>

<script>
  export default {
    name: 'ColumnChart',
    mixins: [],
    props:['monthList','dataList','text','y','x'],
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
        let myChart = that.$echarts.init(document.getElementById("main"));

        let data1 = [];
        let data2 = [];
        let data3 = [];
        if(that.dataList != null && that.dataList.length > 0){
          data1 = that.dataList[0].data;
          data2 = that.dataList[1].data;
          data3 = that.dataList[2].data;
        }
        var emphasisStyle = {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)'
          }
        };
        let option = {
          legend: {
            data: ['目标', '完成', '差额'],
            left: '10%'
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            data: that.monthList,
            name: this.x,
            // axisLine: { onZero: true },
            // splitLine: { show: false },
            // splitArea: { show: false }
          },
          yAxis: {
            name:this.y
          },
          grid: {
            bottom: 100
          },
          series: [
            {
              name: '目标',
              type: 'bar',
              stack: 'one',
              emphasis: emphasisStyle,
              data: data1
            },
            {
              name: '完成',
              type: 'bar',
              stack: 'two',
              emphasis: emphasisStyle,
              data: data2
            },
            {
              name: '差额',
              type: 'bar',
              stack: 'three',
              emphasis: emphasisStyle,
              data: data3
            },
            // {
            //   name: 'bar4',
            //   type: 'bar',
            //   stack: 'two',
            //   emphasis: emphasisStyle,
            //   data: data4
            // }
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