<template>
  <div>
    <div id="main3" style="width: 90%;height:400px;"></div>
  </div>
</template>

<script>
  import { preciseNum } from '@/utils/util'

  export default {
    name: 'LineChart',
    mixins: [],
    props:['monthList','dataList','text','y','x','data1List'],
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
        let myChart = that.$echarts.init(document.getElementById("main3"));
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
          },
          legend: {
            data: ['计划金额', '完成金额']
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            name:this.x,
            type: 'category',
            data: that.monthList
          },
          yAxis: {
            name:this.y,
            type: 'value'
          },
          series: [
            {
              name: '计划金额',
              data: that.data1List,
              type: 'bar',
            },
            {
              name: '完成金额',
              data: that.dataList,
              type: 'bar',
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