<template>
        <div
            id="pieChart"
            class="pieChart"
            style="background: unset !important"
            ref="myChart"
        ></div>
</template>

<script>
import * as echarts from "echarts";
import { getAction } from '@api/manage'
import { iegAmount, numberWithCommas } from '@/utils/util'

export default {
  data() {
    return {
      iegAmount,
      id: "pieChart",
      myChart: null,
    };
  },
  created(){

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
  methods: {
    async loadChart() {
      //
      let resData = []
      const params = {
        subject: '',
        month:'twelve'
      }
      let url = '/srm/report/fetchProjAmountRound'
      await getAction(url, params)
        .then((res) => {
          resData = res.result
        })
        .catch((err) => {})

      this.$nextTick(() => {
        this.myChart = echarts.init(document.getElementById("pieChart"));
        this.myChart.setOption(this.initOption(resData));
      });
    },
    initOption(option) {
      let line = [];
      let number = [];
    let myData = option || []
      let data = {
        title: {
          text: "",
          top: "10px",
          textStyle: {
            color: "rgb(255,255,255)", // 更改坐标轴文字颜色
            fontSize: 16, // 更改坐标轴文字大小
          },
        },
        tooltip: {
          trigger: "item",
        //   formatter: '{a} <br/>{b} : {c} ({d}%)'
        //   formatter: "{b}: <br/>￥{c}万元 <br/>{d}%",
          formatter: function(data){
            let a = data.value;
            let b = data.name;
            let c = data.percent;
            return "项目名称:" + b + "<br/>" + '投资金额:¥'+ iegAmount(Math.trunc(a),'total') + "元<br/>占比:" + c +"%"
          },
          position: 'right'
        },

        legend: {
          orient: "vertical",
          type: 'scroll',
          pageButtonItemGap: 0,
          right: "4%",
          // bottom: '11%',
          height:'170',
          top: "14%",
          show: true,
          data: myData,
          textStyle: {
            color: "#192883",
            fontSize: 16, // 更改坐标轴文字大小
          },
          itemWidth: 10,  // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 14 ,// 设置间距，
            formatter: function (name) {
                let total = 0
                let tarValue
                for (let i = 0; i < myData.length; i++) {
                    total += myData[i].value
                    if (myData[i].name == name) {
                    tarValue = myData[i].value
                    }
                }
                //计算出百分比
                let p = Math.round((tarValue / total) * 100) + '%'
                // return `${name.length > 6?name.slice(0, 5)+'...':name} ￥${tarValue}万元 ${p}`
              return `${name.length > 6?name.slice(0, 5)+'...':name} ${p}`
            },
          tooltip: {
            show: true,//这个为true的话悬停到legend上会出现tooltip
            position: 'right',
            formatter: function (name) {
                let total = 0
                let tarValue
                for (let i = 0; i < myData.length; i++) {
                    total += myData[i].value
                      // console.log(myData[i].name,name);

                    if (myData[i].name == name.name) {
                     tarValue = myData[i].value
                    }
                }
                //计算出百分比
                let p = Math.round((tarValue / total) * 100) + '%'
                console.log(tarValue,'----------',p);
                tarValue = iegAmount(Math.trunc(tarValue),'total');

                return `项目名称:${name.name}:<br /> 投资金额:￥${tarValue}万元 <br /> 占比:${p}`
            },
          },

        //   icon: "circle",
        },
         grid: {
        left: '3%',
        right: '4%',
        bottom: '7%',
        containLabel: true
    },
        textStyle: {
            rich: {
              a: {
                color: "#192883",
                width: 80,
                align: "left"
              },
              b: {
                width: 50,
                align: "left",
                color: "#192883"
              },
              x: {
                width: 30,
                align: "left",
                color: "#192883"
              }
            }
          },

        series: [
          {
            name: "",
            type: "pie",
            // minAngle: 30,
            radius: ["30%", "65%"],
            center: ["30%", "50%"],
            label: {
                show: false,
                position: 'left'
            },
            emphasis: {
                label: {
                show: false,
                fontSize: 40,
                fontWeight: 'bold'
                }
            },

            labelLine: {
                show: false
            },
                data: myData,

          },
        ],
      };
      return data;
    },
  },

};
</script>

<style lang="less" scoped>
.pieChart {
  background: unset !important;
  height: 95%;
  margin-top: 10px;
}
</style>

