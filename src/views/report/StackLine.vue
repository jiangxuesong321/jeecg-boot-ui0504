<template>
  <div>
    <div id="main2" style="width: 90%;height:400px;"></div>
  </div>
</template>

<script>
  export default {
    name: 'LineChart',
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
        let myChart = that.$echarts.init(document.getElementById("main2"));
        let option = {
          title: {
            text: this.text
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['完成率']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            name:this.x,
            type: 'category',
            boundaryGap: false,
            data: that.monthList
          },
          yAxis: {
            name:this.y,
            type: 'value'
          },
          series: that.dataList
            // [
            // {
            //   name: 'Email',
            //   type: 'line',
            //   stack: 'Total',
            //   data: [120, 132, 101, 134, 90, 230, 210]
            // },
            // {
            //   name: 'Union Ads',
            //   type: 'line',
            //   stack: 'Total',
            //   data: [220, 182, 191, 234, 290, 330, 310]
            // },
            // {
            //   name: 'Video Ads',
            //   type: 'line',
            //   stack: 'Total',
            //   data: [150, 232, 201, 154, 190, 330, 410]
            // },
            // {
            //   name: 'Direct',
            //   type: 'line',
            //   stack: 'Total',
            //   data: [320, 332, 301, 334, 390, 330, 320]
            // },
            // {
            //   name: 'Search Engine',
            //   type: 'line',
            //   stack: 'Total',
            //   data: [820, 932, 901, 934, 1290, 1330, 1320]
            // }
          // ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      }
    }
  }
</script>

<style scoped>

</style>