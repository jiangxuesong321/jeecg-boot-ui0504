<template>
  <div>
    <div :id="id" style="width: 90%;height:400px;"></div>

    <a-drawer
      title="合同列表"
      width=90%
      placement="right"
      :closable="false"
      :headerStyle="{ textAlign: 'center'}"
      @close="close"
      destroyOnClose
      :visible="visible">
      <bas-contract-modal ref="contractModal" :categoryId="model.categoryId" :disabled="true"></bas-contract-modal>
    </a-drawer>

    <a-drawer
      title="付款列表"
      width=90%
      placement="right"
      :closable="false"
      :headerStyle="{ textAlign: 'center'}"
      @close="close1"
      destroyOnClose
      :visible="visible1">
      <public-pur-pay-apply-list ref="pppa" :categoryId="model.categoryId"></public-pur-pay-apply-list>
    </a-drawer>
  </div>
</template>

<script>
import BasContractModal from '@views/project/modules/BasContractModal'
import PublicPurPayApplyList from '@views/pay/PublicPurPayApplyList'
import {
  iegAmount
} from '@/utils/util'
export default {
    name: 'LineChart',
    mixins: [],
    components: {
      BasContractModal,
      PublicPurPayApplyList
    },
    props:['monthList','dataList','text','id'],
    data() {
      return {
        iegAmount,
        visible1:false,
        visible:false,
        model:{
          categoryId:'',
        },
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
      close1(){
        this.visible1 = false;
      },
      close(){
        this.visible = false;
      },
      drawChart() {
        // 基于准备好的dom，初始化echarts实例
        let that = this;
        let myChart = that.$echarts.init(document.getElementById(this.id));
        let option = {
          tooltip: {
            trigger: 'item',
            formatter: function(data){
              let value = data.value;
              let name = data.name;
              let percent = data.percent;
              return name + ":" + '¥'+ iegAmount(value,'total') + "元<br/>[" + percent +"%]"
            }
          },
          legend: {
            // top: '5%',
            // left: 'center'
            type: 'scroll',
            orient: 'vertical',
            right: 20,
            top: 20,
            bottom: 20,
            left:-25
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: true,
              itemStyle: {
                // borderRadius: 10,
                // borderColor: '#C1EBDD',
                // borderWidth: 2
                normal: {
                  color: function(colors) {
                    var colorList = [
                      '#45C2E0', '#C1EBDD', '#FFC851', '#5A5476', '#1869A0', '#FF9393','#33FFFF','#77FFCC','#FFAA33','#FF7744','#FF8888','#E38EFF','#D28EFF','#B088FF','#CCCCFF'
                      ,'#99FFFF','#99FF99','#EEFFBB','#FF69B4'
                    ];
                    return colorList[colors.dataIndex]
                  }
                }
              },
              label: {
                show:true
                // normal: {
                //   show: true,
                //   formatter: '{b}: {d}%' //自定义显示格式(b:name, c:value, d:百分比)
                // }
              },
              emphasis: {
                label: {
                  show: true,
                }
              },
              labelLine: {
                show: true
              },
              data: that.dataList
              //   [
              //   { value: 1048, name: 'Search Engine' },
              //   { value: 735, name: 'Direct' },
              //   { value: 580, name: 'Email' },
              //   { value: 484, name: 'Union Ads' },
              //   { value: 300, name: 'Video Ads' }
              // ]
            }
          ]
        };
        myChart.on('click', function (event) {
          if (event.data) {
            //合同分类
            that.model.categoryId = event.data.id;
            if(that.id == 'pie1'){
              that.visible = true;
              setTimeout(() => {
                that.$refs.contractModal.queryParam.categoryId = event.data.id;
                that.$refs.contractModal.edit({});
              }, 300)
            }else if(that.id == 'pie2'){
              that.visible1 = true;
              setTimeout(() => {
                that.$refs.pppa.queryParam.categoryId = event.data.id;
                that.$refs.pppa.loadData();
              }, 300)
            }
            console.log(event.data)
          }
        });
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      }
    }
  }
</script>

<style scoped>

</style>