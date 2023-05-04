<template>
  <div class="conten">
    <ul>
      <li>
        <img src="../images/曲线图合同总额图标.png" alt="" />
        <div class="name">
          <span class="number">{{contractNum}}</span>
          <span>合同数量</span>
        </div>
      </li>
      <li>
        <img src="../images/本月事项-合同金额图标.png" alt="" />
        <div class="name">
          <span class="number">{{contractAmountTaxLocal}}</span>
          <span>合同金额</span>
        </div>
      </li>
      <li>
        <img src="../images/本月事项-合同金额图标.png" alt="" />
        <div class="name">
          <span class="number">{{planPayAmountCope}}</span>
          <span>计划付款</span>
        </div>
      </li>
      <li>
        <img src="../images/本月事项-合同金额图标.png" alt="" />
        <div class="name">
          <span class="number">{{alPayAmountCope}}</span>
          <span>已付金额</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getAction } from '@api/manage'
import { numberWithCommas } from '@/utils/util'

export default {
  name: 'current',
  components: {},
  props:['area'],
  data() {
    return {
      contractNum:0,
      contractAmountTaxLocal:0,
      planPayAmountCope:0,
      alPayAmountCope:0,

    }
  },
    watch:{
    area:{
      handler(value){
        this.getData()
        this.getData2()
        this.getData1()
        this.getData3()
      },
      deep:true,
      immediate:true
    }
  },
  mounted() {
    this.getData()
    this.getData2()
    this.getData1()
    this.getData3()

  },
  methods: {
    // 本月合同数量
    async getData() {
      const params = {
        subject: this.area,
        source:'benyue',
      }
      let url = '/srm/contractBase/fetchContractNum'
      await getAction(url, params)
        .then((res) => {
          this.contractNum = res.result.num || 0
        })
        .catch((err) => {
          this.contractNum = 0
        })
    },
    // 本月合同金额
    async getData1() {
      const params = {
        subject: this.area,
        source:'benyue',
        unit: 'wy'
      }
      let url = '/srm/contractBase/fetchContractByProjId'
      await getAction(url, params)
        .then((res) => {
          this.contractAmountTaxLocal = numberWithCommas(res.result.contractAmountTaxLocal.toFixed()) || 0
        })
        .catch((err) => {
          this.contractAmountTaxLocal = 0
        })
    },
    // 计划付款
    async getData2() {
      const params = {
        subject: this.area,
        source:'benyue',
        unit: 'wy'
      }
      let url = '/srm/purPayPlan/fetchPayAmountByProjId'
      await getAction(url, params)
        .then((res) => {
          this.planPayAmountCope = numberWithCommas(res.result.payAmountCope.toFixed()) || 0
        })
        .catch((err) => {
          this.planPayAmountCope = 0
        })
    },
    // 已经付款
    async getData3() {
      const params = {
        subject: this.area,
        source:'benyue',
        unit: 'wy',
        payStatus:'2'
      }
      let url = '/srm/purPayPlan/fetchPayAmountByProjId'
      await getAction(url, params)
        .then((res) => {
          this.alPayAmountCope = numberWithCommas(res.result.payAmountCope.toFixed()) || 0
        })
        .catch((err) => {
          this.alPayAmountCope = 0
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.conten {
  width: 100%;
  height: 100%;

  ul {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    li {
      width: 50%;
      height: 128px;
      padding: 30px 15px;
      display: flex;
      align-items: center;
      img {
        width: 70px;
      }
      .name {
        display: flex;
        flex-direction: column;

        span {
          color: #4d5266;
          font-size: 16px;
        }

        .number {
          font-size: 20px;
          font-weight: 700;
        }
      }
    }

    li:nth-child(3) {
      padding-top: 0;
    }
    li:nth-child(4) {
      padding-top: 0;
    }
  }
}
</style>
