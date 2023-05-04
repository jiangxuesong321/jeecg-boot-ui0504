<template>
  <div class="dataScreen-container">
    <div class="dataScreen" ref="dataScreenRef">
      <div class="dataScreen-header">
        <div class="header-lf">
          <div class="back-index" @click="goIndex">
            <img src="./images/返回首页标.png" alt="" />
            <span class="header-screening">返回系统</span>
          </div>
        </div>
        <div class="header-ct">
          <div class="header-ct-title">
            <span>德莱维SRM</span>
          </div>
        </div>
        <div class="header-rg"></div>
      </div>
      <div class="dataScreen-main">
        <div class="dataScreen-lf">
          <div class="dataScreen-top">
            <div class="dataScreen-main-title">
              <span style="font-weight:bold">近12个月合同数量</span>
            </div>
            <!-- chart区域 -->
            <div class="dataScreen-main-chart">
              <div class="dataChart">
                <img src="./images/曲线图合同总额图标.png" alt="" />
                <div class="numer">
                  <p>{{ dataNum }}</p>
                  <span>合同总数</span>
                </div>
              </div>
              <span class="danwei">单位：份</span>
              <lineCharts ref="lineCharts" @getNumber="getNumber" :area='area' />
            </div>
          </div>
          <div class="dataScreen-center">
            <div class="dataScreen-main-title">
              <span style="font-weight:bold">近12个月支出金额</span>
            </div>
            <!-- chart区域 -->
            <div class="dataScreen-main-chart">
              <div class="dataChart">
                <img src="./images/曲线图支出总额图标.png" alt="" />
                <div class="numer">
                  <p>{{ totalBar }}</p>
                  <span>支出总额</span>
                </div>
              </div>
              <span class="danwei">单位：万元</span>
              <barCharts ref="barCharts" @getBarNumber="getBarNumber" :area='area'/>
            </div>
          </div>
          <div class="dataScreen-bottom">
            <div class="dataScreen-main-title">
              <span style="font-weight:bold">近12个月项目投资占比</span>
            </div>
            <!-- chart区域 -->
            <div class="dataScreen-main-chart addImg">
              <pieCharts ref="pieCharts" />
            </div>
          </div>
        </div>
        <div class="dataScreen-ct">
          <div class="middle-top-tip">
            <p>{{ timeWeekFormat() }} 欢迎来到德莱维SRM！</p>
            <!-- @change="handleArea(area)" -->
            <a-select style="min-width: 160px" placeholder="请选择地区" v-model="area" @change="handleArea(area)" allowClear>
              <a-select-option :value="e.value" v-for="e in areaOption" :key="e.key" :title="e.title"> {{e.title}} </a-select-option>
              <!-- <a-select-option value="female"> 华东 </a-select-option> -->
            </a-select>
            <!-- <j-dict-select-tag v-model="area" placeholder="请选择地区" class="areaCss"
              dictCode="sys_depart,depart_name,id,parent_id = '-1'"
            /> -->
          </div>
          <div class="cash-card">
            <div
              v-for="(item, index) in cardBg"
              :key="index"
              @click="goDetails(item)"
              :style="{ backgroundImage: 'url(' + item.url + ')' }"
              class="card-item"
            >
              <span class="number">{{ item.number }}</span>
              <span class="wei">{{ item.wei }}</span>
            </div>
          </div>
          <div class="dataScreen-map">
            <span
              v-for="(e, i) in position"
              @animationend="handleAnimate(e)"
              @click="handleClick(e)"
              :ref="`record${e.alis}`"
              :key="i"
              :style="{ backgroundImage: 'url(' + e.url + ')', right: e.right + '%', bottom: e.bottom + 'px' }"
            ></span>
          </div>
          <div class="tableRect dataScreen-main-title" @mouseenter="handleEnter"
              @mouseleave="handleLeave">
              <span style="font-weight:bold">产品类型与产能明细</span>
            <a-table
              class="tableData"
              size="middle"
              :columns="columns"
              :data-source="tableData"
              :pagination="false"
              :scroll="{ y: 217 }"
            />
          </div>
        </div>
        <div class="dataScreen-rg">
          <div class="dataScreen-top">
            <div class="dataScreen-main-title">
              <span style="font-weight:bold">本月事项</span>
            </div>
            <!-- chart区域 -->
            <div class="dataScreen-main-chart">
              <curentMon ref="curentMon"  :area='area' />
            </div>
          </div>
          <div class="dataScreen-center">
            <div class="dataScreen-main-title">
              <span style="font-weight:bold">各类合同总额</span>
            </div>
            <!-- chart区域 -->
            <div class="dataScreen-main-chart">
              <totalContract ref="totalContract"  :area='area' />
            </div>
          </div>
          <div class="dataScreen-bottom">
            <div class="dataScreen-main-title">
              <span style="font-weight:bold">各矿地投资额</span>
            </div>
            <!-- chart区域 -->
            <div class="dataScreen-main-chart">
              <baseInvestment ref="baseInvestment"  :area='area' />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import lineCharts from './components/lineCharts.vue'
import pieCharts from './components/pieCharts.vue'
import barCharts from './components/barCharts.vue'
import curentMon from './components/curentMon.vue'
import totalContract from './components/totalContract.vue'
import baseInvestment from './components/baseInvestment.vue'
import { getAction } from '@api/manage'
export default {
  name: 'dataScreen',
  components: {
    lineCharts,
    barCharts,
    pieCharts,
    curentMon,
    totalContract,
    baseInvestment,
  },
  data() {
    return {
      area: undefined,
      dataNum: 0,
      totalBar: 0,
      projectInfo: [],
      areaOption:[],
      //
      //
      //
      scrollTimer: null, // 滚动定时器
      scrollDirection: 'down',

      position: [
        {
          name: '澳大利亚铜金矿',
          alis: 'yi',
          url: require('./images/澳大利亚基地.png'),
          right: 22,
          bottom: 105,
        },
        // {
        //   name: '徐州基地',
        //   alis: 'xu',
        //   url: require('./images/徐州基地.png'),
        //   right: 32,
        //   bottom: 230,
        // },
        {
          name: '哈密东戈壁钼矿',
          alis: 'ti',
          url: require('./images/哈密基地.png'),
          right: 33.5,
          bottom: 300,
        },
        {
          name: '巴西铌磷矿',
          alis: 'ne',
          url: require('./images/巴西基地.png'),
          right: 59,
          bottom: 153,
        },
      ],
      cardBg: [
        {
          url: require('./images/card1.png'),
          id: 1,
          number: 0,
          wei: '项目总投（万元）',
        },
        {
          url: require('./images/card2.png'),
          id: 2,
          number: 0,
          wei: '合同金额（万元）',
        },
        {
          wei: '支出金额（万元）',
          url: require('./images/card3.png'),
          number: 0,
          id: 3,
        },
        {
          wei: '项目地区（个）',
          number: 0,
          url: require('./images/card4.png'),
          id: 4,
        },
      ],

      columns: [
        {
          title: '产品类型',
          dataIndex: 'model',
        },
        {
          title: '规划产能( 万片/月 )',
          dataIndex: 'capacity',
        },
        {
          title: '实际产能( 万片/月 )',
          dataIndex: 'actCapacity',
        },
        {
          title: '占比',
          dataIndex: 'rate',
        },
      ],
      tableData: [],
    }
  },
  watch:{
    area:{
      handler(){
        this.handleProInfo()
      },
      deep:true,
      immediate:true
    }
  },
  created() {
    this.getArea()
    this.scrollFun()
    this.getProjectInfo()
    this.handleProInfo()
  },

  destroyed(){
          clearInterval(this.scrollTimer)
        this.scrollTimer = null
  },

  methods: {
    goDetails(data){
      switch (data.id) {
        case 1:
          this.jumpProj()
          break;
       case 2:
          this.jumpContract()
          break;
        case 3:
          this.jumpPlan()
          break;
        default:
          break;
      }
    },

    jumpPlan(){
      this.$router.push({
        path: '/pay/PurPayPlanList',
        query:{}
      })
    },
    jumpContract(){
      this.$router.push({
        path: '/contract/BasSupplierContractList',
        query:{}
      })
    },
    jumpProj(){
      this.$router.push({
        path: '/project/ProjBaseList',
        query:{}
      })
    },

    goIndex(){
      // /dashboard/analysis
      this.$router.push('/dashboard/analysis',
				)
        localStorage.setItem('isShow',0)
    },
    timeWeekFormat(times) {
      var date=new Date();
      var day=date.getDay();
        var weeks=new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
        var week=weeks[day];

      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      month = (month > 9) ? month : ('0' + month);
      day = (day < 10) ? ('0' + day) : day;
      var today = year + '年' + month + '月' + day+ '日';
      return today + week
    },

    getNumber(data) {
      this.dataNum = data || 0
    },
    getBarNumber(data) {
      this.totalBar = this.numberWithCommas(Math.trunc(data)) || 0
    },

    async getArea(){
      let url = '/sys/sysDepart/fetchSubject'
      await getAction(url, { subject: '' })
        .then((res) => {
          this.areaOption = res.result
        })
        .catch((err) => {})
    },

    async handleProInfo(index) {
      const url = '/srm/projBase/fetchModelBySubject'
      await getAction(url, { subject: this.area })
        .then((res) => {
          this.tableData = res.result
          this.scrollFun()
        })
        .catch((err) => {})
    },

    async getProjectInfo() {
      this.getProjectInfo1()
      this.getProjectInfo2()
      this.getProjectInfo3()
      this.getProjectInfo4()
    },
    // 项目执行
    async getProjectInfo1() {
      const url = '/srm/projBase/fetchProjectAmount'
      await getAction(url, { subject: this.area,unit: 'wy' })
        .then((res) => {
          let budgetAmount
          if(res.result && res.result.budgetAmount) {
            budgetAmount = res.result.budgetAmount.toFixed()
          }else {
            budgetAmount =0
          }
          this.cardBg[0].number = this.numberWithCommas(budgetAmount)
        })
        .catch((err) => {})
    },
    // 合同总金额
    getProjectInfo2() {
      const url = '/srm/contractBase/fetchContractByProjId'
      getAction(url, { subject: this.area, source: 'total',unit: 'wy' })
        .then((res) => {
          let contractAmountTaxLocal
          if(res.result && res.result.contractAmountTaxLocal) {
            contractAmountTaxLocal = res.result.contractAmountTaxLocal.toFixed()
          }else {
            contractAmountTaxLocal =0
          }
          this.cardBg[1].number = this.numberWithCommas(contractAmountTaxLocal)
        })
        .catch((err) => {})
    },
    // 支出金额
    getProjectInfo3() {
      const url = '/srm/purPayPlan/fetchPayAmountByProjId'
      getAction(url, { subject: this.area, source: 'total',unit: 'wy' })
        .then((res) => {
          // const { payAmountCope } = res.result
          let payAmountCope
          if(res.result && res.result.payAmountCope) {
            payAmountCope = res.result.payAmountCope.toFixed()
          }else {
            payAmountCope =0
          }

          this.cardBg[2].number = this.numberWithCommas(payAmountCope)
        })
        .catch((err) => {})
    },
    // 项目地区
    getProjectInfo4() {
      const url = '/srm/projBase/fetchProjNum'
      getAction(url, { subject: this.area })
        .then((res) => {
          // const { projAreaNum } = res.result
          let projAreaNum
          if(res.result && res.result.projAreaNum) {
            projAreaNum = res.result.projAreaNum.toFixed()
          }else {
            projAreaNum =0
          }
          this.cardBg[3].number = this.numberWithCommas(projAreaNum)
        })
        .catch((err) => {})
    },

    // 千分位分隔符
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },

    handleEnter(){
      clearInterval(this.scrollTimer)
        this.scrollTimer = null
    },
    handleLeave(){
      this.scrollFun()
    },

    // ----------------------------------------------------------------
    scrollFun() {
      // 如果定时器存在
      if (this.scrollTimer) {
        // 则先清除
        document.querySelectorAll(`.tableRect .ant-table-body`)[0].scrollTop = 0 // 滚动
        clearInterval(this.scrollTimer)
        this.scrollTimer = null
      }
      this.scrollTimer = setInterval(() => {
        let that = this
        const scrollHeight = document.querySelectorAll(`.tableRect .ant-table-body`)[0].scrollHeight
        const clientHeight = document.querySelectorAll(`.tableRect .ant-table-body`)[0].clientHeight
        const scroll = scrollHeight - clientHeight
        // 获取当前滚动条距离顶部高度		tableRect是a-table标签名
        const scrollTop = document.querySelectorAll(`.tableRect .ant-table-body`)[0].scrollTop
        // 向下滚动
        if (this.scrollDirection === 'down') {
          // 滚动速度
          const temp = scrollTop + 10
          document.querySelectorAll(`.tableRect .ant-table-body`)[0].scrollTop += 30 // 滚动
          // 距离顶部高度  大于等于 滚动长度
          if (scroll <= temp) {
            // 滚动到底部 停止定时器
            document.querySelectorAll(`.tableRect .ant-table-body`)[0].scrollTop = 0 // 滚动
            // clearInterval(this.scrollTimer)
            // this.scrollTimer = null
            that.scrollFun()
          }
        }
      }, 1150)
    },

    handleClick(item) {
      let el = this.$refs[`record${item.alis}`][0]
      el.style.animation = 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both'

          switch (item.alis) {
              case 'yi':
                this.$router.push({
                  path: '/project/ProjBaseList?subject=1',
                  params:{
                    id:1
                  }
                })
                break
              case 'xu':
                this.$router.push({
                  path: '/project/ProjBaseList?subject=4',
                  params:{
                    id:4
                  }
                })
                break
              case 'ti':
                this.$router.push({path:'/project/ProjBaseList?subject=2',
                params:{
                    id:2
                  }})
                break
              default:
                this.$router.push({
                  path:'/project/ProjBaseList?subject=3',
                  params:{
                    id:3
                  }

                })
            }

    },

    handleArea(area){
      this.getProjectInfo()
    },
    handleAnimate(item) {
      let el = this.$refs[`record${item.alis}`][0]
      el.style.animation = ''
    },

    getScale(width = 1920, height = 1080) {
      let ww = window.innerWidth / width
      let wh = window.innerHeight / height
      return ww < wh ? ww : wh
    },

    listenResize() {
      const dataScreenRef = this.$refs['dataScreenRef']
      if (dataScreenRef) {
        dataScreenRef.style.transform = `scale(${this.getScale()}) translate(-50%, -50%)`
      }
    },
  },

  mounted() {
    window.addEventListener('resize', this.listenResize)

    const dataScreenRef = this.$refs['dataScreenRef']
    if (dataScreenRef) {
      dataScreenRef.style.transform = `scale(${this.getScale()}) translate(-50%, -50%)`
      dataScreenRef.style.width = `116%`
      dataScreenRef.style.height = `1080px`
    }
  },
}
</script>

<style lang="scss" scoped>
@import './index.scss';

.tableRect {
					// position: relative;
      &:before {
    left: 200px !important;

  }
  &:after {
    right: 200px !important;


  }
  span {
    margin-bottom: 0 !important;
    height: 60px;

  }
  /deep/ .ant-table {
    margin-top: 0px !important;
  }
  // /deep/ .ant-table-wrapper {
  //   margin-top: 60px;
  // }
  /deep/ .ant-table-tbody {
    tr:nth-child(n) {
      color: #4d5266;
      background-color: #e5eafe;
      text-align: center;
    }
  }
  /deep/ .ant-table-tbody {
    tr:nth-child(n):hover > td {
      color: #4d5266;
      background-color: #dae0fa;
    }
  }
  /deep/ .ant-table-tbody {
    tr:nth-child(2n) {
      color: #4d5266;
      background-color: #dae0fa;
      text-align: center;
    }
  }

  /deep/ .ant-table-thead {
    tr {
      th {
        color: #4d5266;
        background-color: #dae0fa !important;
        font-size: 16px;
        text-align: center;
      }

    }
  }
  /deep/ .ant-table-tbody {
    tr {
      td {
				padding: 10px !important;
				line-height: unset;
			}
    }
  }
}
</style>

