<template>
  <div>
    <div id="main4" style="width: 90%;height:400px;"></div>
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
        let myChart = that.$echarts.init(document.getElementById("main4"));
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
          },
          xAxis: {
            type: 'category',
            data: that.monthList
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: that.dataList,
              type: 'line',
              // showBackground: true,
              // backgroundStyle: {
              //   color: 'rgba(180, 180, 180, 0.2)'
              // }
            }
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