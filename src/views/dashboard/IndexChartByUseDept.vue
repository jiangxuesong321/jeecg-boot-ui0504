<template>
  <div class="page-header-index-wide">
    <a-row>
        <j-dict-select-tag v-model="queryParam.projId" placeholder="请选择项目"
                           :allow-clear="true"
                           style="width: 220px;    position: absolute;    top: -65px;-index: 99999999; right: 10px;float: right;    margin-right: 10px;"
                           dictCode="proj_base,proj_name,id,del_flag = '0' order by create_time desc"
                           @change="searchQuery()" />
    </a-row>
    <a-row v-if="queryParam.projId != null && queryParam.projId != '' && queryParam.projId != undefined">
      <div class="card-title" style="margin-left: 13px">
        {{queryParam.projName}}
      </div>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="9" style="margin-left: 0px">
        <a-card style="padding: 25px 20px 30px 30px; height: 380px;" :loading="loading" :bordered="false" :body-style="{padding: '0'}">
          <a-row>
            <a-col :span="12">
              <div class="card-title">
                设备采购情况
              </div>
            </a-col>

          </a-row>
          <a-row>
            <a-col :span="16">
              <div style="padding-left: 2rem;">
                <newRateChart2 :percentNum="model.percent" :title="'采购完成率'"></newRateChart2>
              </div>
            </a-col>
            <a-col :span="8" style="padding-top: 1rem;">
              <div class="orange-point point-div">
                计划采购设备数量：<span style="color: red;">{{model.budgetQty}}</span>
              </div>
              <div class="bule-point point-div">
                签署合同设备数量：<span style="color: red;">{{model.contractQty}}</span>
              </div>
              <div class="gray-point point-div">
                剩余数量：<span style="color: red;">{{model.remainQty}}</span>
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :span="9">
        <a-card style="padding: 25px 20px 30px 30px; height: 380px;" :loading="loading" :bordered="false" :body-style="{padding: '0'}">
          <a-row>
            <a-col :span="12">
              <div class="card-title">
                金额支出情况
              </div>
            </a-col>
<!--            <a-col :span="12">-->
<!--              <j-dict-select-tag v-model="queryParam.projId" placeholder="请选择项目" style="width: 220px; float: right;margin-right: 10px; margin-top: 10px;"-->
<!--                                 dictCode="proj_base,proj_name,id,del_flag = '0' order by create_time desc" @change="searchQuery()"/>-->
<!--            </a-col>-->
          </a-row>
          <a-row>
            <a-col :span="16">
              <div style="padding-left: 2rem;">
                <newRateChart :percentNum="model.percentNum" :title="'支出率'"></newRateChart>
              </div>
            </a-col>
            <a-col :span="8" style="padding-top: 1rem; padding-left: 10px;">
              <div class="orange-point point-div" style="margin-left: -50px">
                <span title="总预算：" style="padding-left: 10px;">总预算：</span><span style="color: red;">{{iegAmount(Math.trunc(model.budgetAmount),'total')}}</span>
              </div>
              <div class="bule-point point-div" style="margin-left: -50px">
                <span title="实际签署合同金额：" style="padding-left: 10px;">实际合同金额：</span><span style="color: red;">{{iegAmount(Math.trunc(model.contractAmount),'total')}}</span>
              </div>
              <div class="gray-point point-div" style="margin-left: -50px">
                <span title="剩余金额：" style="padding-left: 10px;">剩余金额：</span><span style="color: red;">{{iegAmount(Math.trunc(model.remainAmount),'total')}}</span>
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>

      <a-col :span="6">
        <a-card style="padding: 10px 20px 30px 30px;height: 380px" :loading="loading" :bordered="false" :body-style="{padding: '0'}">
          <a-row>
            <a-col :span="12">
              <div class="card-title">
                快捷入口
              </div>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8" style="text-align: center;">
              <router-link :to="`/project/ProjBaseList`">
                <a-card :bordered="false" style="width: 100%;height:60px;">
                  <img slot="cover" alt="项目管理" src="~@/assets/svg/xiangmuguanli.svg"
                       height="29px" width="27px" />
                  <p style="text-align: center;margin-top:6px;">项目管理</p>
                </a-card>
              </router-link>
            </a-col>
            <a-col :span="8" style="text-align: center;">
              <router-link :to="`/base/BasMaterialList`">
                <a-card :bordered="false" style="width: 100%;height:60px;">
                  <img slot="cover" alt="物料管理" src="~@/assets/svg/report_manage.svg"
                       height="29px" width="27px" />
                  <p style="text-align: center;margin-top:6px;">物料管理</p>
                </a-card>
              </router-link>
            </a-col>
            <a-col :span="8" style="text-align: center;">
              <router-link :to="`/srm/purchaseRequestList`">
                <a-card :bordered="false" style="width: 100%;height:60px;">
                  <img slot="cover" alt="采购管理" src="~@/assets/svg/caigouguanli.svg"
                       height="29px" width="27px" />
                  <p style="text-align: center;margin-top:6px;">采购管理</p>
                </a-card>
              </router-link>
            </a-col>
          </a-row>
          <a-row style="margin-top: 20px">
            <a-col :span="8" style="text-align: center;">
              <router-link :to="`/srm/inquiryList`">
                <a-card :bordered="false" style="width: 100%;height:60px;">
                  <img slot="cover" alt="询比价管理" src="~@/assets/svg/xunbijia.svg"
                       height="29px" width="27px" />
                  <p style="text-align: center;margin-top:6px;">询比价管理</p>
                </a-card>
              </router-link>
            </a-col>
            <a-col :span="8" style="text-align: center;">
              <router-link :to="`/srm/biddingList`">
                <a-card :bordered="false" style="width: 100%;height:60px;">
                  <img slot="cover" alt="招投标管理" src="~@/assets/svg/zhaotoubiaoguanli.svg"
                       height="29px" width="27px" />
                  <p style="text-align: center;margin-top:6px;">招投标管理</p>
                </a-card>
              </router-link>
            </a-col>
            <a-col :span="8" style="text-align: center;">
              <router-link :to="`/base/BasSupplierList`">
                <a-card :bordered="false" style="width: 100%;height:60px;">
                  <img slot="cover" alt="供应商管理" src="~@/assets/svg/Username.svg"
                       height="29px" width="27px" />
                  <p style="text-align: center;margin-top:6px;">供应商管理</p>
                </a-card>
              </router-link>
            </a-col>
          </a-row>
          <a-row style="margin-top: 20px">
            <a-row>
              <a-col :span="12">
                <div class="card-title">
                  最近访问
                </div>
              </a-col>
            </a-row>
            <a-row>
              <template v-if="menuList != null && menuList.length > 0">
              <a-col :span="8" style="text-align: center;" v-for="(item,index) in menuList" :key="index">
                <router-link :to="item.url">
                  <a-card :bordered="false" style="width: 100%;height:60px;">
                    <img slot="cover" :alt="item.name" src="~@/assets/svg/contract.svg"
                         height="29px" width="27px" />
                    <p style="text-align: center;margin-top:6px;">{{item.name}}</p>
                  </a-card>
                </router-link>
              </a-col>
              </template>
            </a-row>
          </a-row>
        </a-card>
      </a-col>
    </a-row>

    <a-row style="margin-top: 1rem;" :gutter="24">
      <a-col :span="18">
        <a-card style="padding: 10px 20px 30px 30px;width: 100%" :loading="loading" :bordered="false" :body-style="{padding: '0'}">
          <a-row>
            <a-col :span="6">
              <div class="card-title">
                资金计划 近7个月
              </div>
            </a-col>
<!--            <a-col :span="6">-->
<!--              <j-dict-select-tag v-model="queryParam.projId" placeholder="请选择项目" style="width: 220px; float: right;margin-right: 10px; margin-top: 10px;"-->
<!--                                 dictCode="proj_base,proj_name,id,del_flag = '0' order by create_time desc"/>-->
<!--            </a-col>-->
            <a-col :span="8" style="margin-top: 10px">
              <a-month-picker v-model="queryParam.startMonth" placeholder="请输入开始日期" style="width: 45%"  valueFormat="YYYY-MM"/>
              --
              <a-month-picker v-model="queryParam.endMonth" placeholder="请输入结束日期" style="width: 45%"  valueFormat="YYYY-MM"/>
            </a-col>
            <a-col :span="4" style="margin-top: 10px">
              <a-button type="primary" ghost @click="searchQuery()">查询</a-button>
              <a-button type="primary" ghost @click="clearQuery()">重置</a-button>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
<!--              <bar :dataSource="barData" />-->
              <area-chart-ty title="" :dataSource="barData" x="月份" y="金额" :height="height"/>
            </a-col>

          </a-row>
        </a-card>
      </a-col>
<!--      <a-col :span="6" style="margin-left: -20px">-->
<!--        <a-card style="padding: 10px 20px 30px 30px;" :bordered="false" :body-style="{padding: '0'}">-->
<!--          <a-row>-->
<!--            <a-col :span="12">-->
<!--              <div class="card-title">-->
<!--                公告-->
<!--              </div>-->
<!--            </a-col>-->
<!--          </a-row>-->
<!--        </a-card>-->
<!--      </a-col>-->

    </a-row>
  </div>
</template>

<script>

import AreaChartTy from '@comp/chart/AreaChartTy'
import { getAction } from '@api/manage'
import newRateChart from '@/components/chart/newRateChart'
import newRateChart2 from '@/components/chart/newRateChart'
import {
  iegAmount, isNotNullOrEmpty
} from '@/utils/util'
// const rankList = []
// for (let i = 0; i < 7; i++) {
//   rankList.push({
//     name: '白鹭岛 ' + (i + 1) + ' 号店',
//     total: 1234.56 - i * 100
//   })
// }
// for (let i = 0; i < 12; i += 1) {
//   barData.push({
//     x: `${i + 1}月`,
//     y: Math.floor(Math.random() * 1000) + 200
//   })
// }
export default {
  name: 'IndexChartByUseDept',
  components: {
    AreaChartTy,
    newRateChart,
    newRateChart2
  },
  data() {
    return {
      iegAmount,
      queryParam:{},
      barData:[],
      height:420,
      menuList:[],
      model:{
        projId:null,
        percentNum:0,
        percent:0,
        remainQty:0,
        contractQty:0,
        budgetQty:0,
        budgetAmount:0,
        contractAmount:0,
        remainAmount:0
      },
      loading: true,
      center: null,
      indicator: <a-icon type="loading" style="font-size: 24px" spin />
    }
  },
  created() {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
    this.fetchHistory();
    this.fetchAmount();
    this.fetchQty();
    this.fetchPlanAmount();
  },
  mounted() {

  },
  methods: {
    clearQuery(){
      this.queryParam = {

      };
      this.searchQuery();
    },
    searchQuery(){
      if(isNotNullOrEmpty(this.queryParam.projId)){
        this.fetchProjById();
      }
      this.fetchAmount();
      this.fetchQty();
      this.fetchPlanAmount();
    },
    fetchProjById(){
      let url = "/srm/projBase/queryById";
      getAction(url,{id:this.queryParam.projId}).then(res => {
        if(res.result != null){
          this.queryParam.projName = res.result.projName;
          this.$forceUpdate();
        }
      })
    },
    fetchPlanAmount(){
      let barData = [];
      let url = "/srm/purPayPlan/fetchPlanAmount";
      getAction(url,{id:this.queryParam.projId,startMonth:this.queryParam.startMonth,endMonth:this.queryParam.endMonth,source:'dept'}).then(res => {
        if(res.result != null){
          this.barData = res.result;
        }
      })

    },
    fetchQty(){
      let url = "/srm/projBase/fetchQty";
      getAction(url,{id:this.queryParam.projId,source:'dept'}).then(res => {
        if(res!= null){
          this.model.percent = res.percent;
          this.model.budgetQty = res.budgetQty;
          this.model.contractQty = res.contractQty;
          this.model.remainQty = res.remainQty;
        }
      })
    },
    fetchAmount(){
      let url = "/srm/projBase/fetchAmount";
      getAction(url,{id:this.queryParam.projId,source:'dept'}).then(res => {
        if(res!= null){
          this.model.percentNum = res.percentNum;
          this.model.budgetAmount = res.budgetAmount;
          this.model.contractAmount = res.contractAmount;
          this.model.remainAmount = res.remainAmount;
        }
      })
    },
    fetchHistory(){
      let url = "/srm/clickMenuHistory/list";
      getAction(url,{}).then(res => {
        this.menuList = res.result;
      })
    },
    jump(path){
      this.$router.push({
        path: path,
        // query:{mrCode:record.code,accountingMode:record.accountingMode}
      })
    },

    // drawChart() {
    //   // 基于准备好的dom，初始化echarts实例
    //   let myChart = this.$echarts.init(document.getElementById('main'))
    //   // 指定图表的配置项和数据
    //   let option = {
    //     series: [
    //       {
    //         name: '',
    //         type: 'pie',
    //         radius: ['40%', '70%'],
    //         avoidLabelOverlap: false,
    //         label: {
    //           show: false,
    //           position: 'center'
    //         },
    //         emphasis: {
    //           label: {
    //             show: false,
    //             fontSize: '40',
    //             fontWeight: 'bold'
    //           }
    //         },
    //         labelLine: {
    //           show: false
    //         },
    //         data: [
    //           { value: 1048, name: '支持率', itemStyle: { color: '#3662EC' } },
    //           { value: 735, name: '', itemStyle: { color: '#E0EAFF' } }
    //         ]
    //       }
    //     ]
    //   }
    //   // 使用刚指定的配置项和数据显示图表。
    //   myChart.setOption(option)
    // },
    // initLogInfo() {
    //   getLoginfo(null).then((res) => {
    //     if (res.success) {
    //       Object.keys(res.result).forEach(key => {
    //         res.result[key] = res.result[key] + ''
    //       })
    //       this.loginfo = res.result
    //     }
    //   })
    //   getVisitInfo().then(res => {
    //     if (res.success) {
    //       this.visitInfo = res.result
    //     }
    //   })
    // }
  }
}
</script>
<style>
.point-div {
  line-height: 50px;
  padding-left: 10px!important;
}

.orange-point::before {
  content: " ";
  width: 8px;
  height: 8px;
  background: orange;
  border-radius: 4px;
  display: inline-block;
}

.bule-point::before {
  content: " ";
  width: 8px;
  height: 8px;
  background: #3662EC;
  border-radius: 4px;
  display: inline-block;
}

.gray-point::before {
  content: " ";
  width: 8px;
  height: 8px;
  background: #D8D8D8;
  border-radius: 4px;
  display: inline-block;
}

.tttext{
  text-align: center;
  font-size: 30px;
}
.tttext img {
  width: 30px;
  margin-top: -10px;
}
.name-title {
  text-align: center;
}
.name-title a{
  color: #999!important;
}
/* #E8EAF2 */
</style>
<style lang="less" scoped>
.circle-cust {
  position: relative;
  top: 28px;
  left: -100%;
}

.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

/* 首页访问量统计 */
.head-info {
  position: relative;
  text-align: left;
  padding: 0 32px 0 0;
  min-width: 125px;

  &.center {
    text-align: center;
    padding: 0 32px;
  }

  span {
    color: rgba(0, 0, 0, .45);
    display: inline-block;
    font-size: .95rem;
    line-height: 42px;
    margin-bottom: 4px;
  }

  p {
    line-height: 42px;
    margin: 0;

    a {
      font-weight: 600;
      font-size: 1rem;
    }
  }
}
</style>