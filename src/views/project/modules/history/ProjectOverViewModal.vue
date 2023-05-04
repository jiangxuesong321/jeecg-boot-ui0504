<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '0px',paddingRight: '0px',marginTop: '-1px'   }">
        <a-card class="card-main-index">
          <div class="right-content blue-money">
            <div style="display: inline-block;">
              <div class="intu">立项金额</div>
              <div class="cont-data">{{iegAmount(Math.trunc(model.projAmount),'total')}}</div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '0px',paddingLeft: '0px', paddingRight: '0px',marginTop: '-1px',marginLeft: '-1px' }">
        <a-card class="card-main-index">
          <div class="right-content orange-money">
            <div style="display: inline-block;">
              <div class="intu">执行金额</div>
              <div class="cont-data">{{iegAmount(Math.trunc(model.budgetAmount),'total')}}</div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '0px',paddingRight: '0px',marginTop: '-1px'   }">
        <a-card class="card-main-index">
          <div class="right-content green-money">
            <div style="display: inline-block;">
              <div class="intu">已签合同金额</div>
              <div class="cont-data">{{iegAmount(Math.trunc(model.contractAmountTaxLocal),'total')}}</div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '0px',paddingLeft: '0px', paddingRight: '0px',marginTop: '-1px',marginLeft: '-1px' }">
        <a-card class="card-main-index">
          <div class="right-content pink-money">
            <div style="display: inline-block;">
              <div class="intu">已支付金额</div>
              <div class="cont-data">{{iegAmount(Math.trunc(model.payAmount),'total')}}</div>
            </div>
          </div>
        </a-card>
      </a-col>
<!--      <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '0px' ,paddingLeft: '0px', paddingRight: '0px',marginTop: '-1px' ,marginLeft: '-1px' }">-->
<!--        <a-card class="card-main-index">-->
<!--          <div class="right-content blue-money">-->
<!--            <div style="display: inline-block;">-->
<!--              <div class="intu">已开票金额</div>-->
<!--              <div class="cont-data">{{iegAmount(Math.trunc(model.invoiceAmount),'total')}}</div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </a-card>-->
<!--      </a-col>-->
    </a-row>
    <a-row :gutter="24">
<!--      <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '24px' }">-->
<!--        <a-card class="card-main-index">-->
<!--          <div class="right-content">-->
<!--            <div style="display: inline-block;">-->
<!--              <div class="intu">项目总产能</div>-->
<!--              <span v-if="capacityList != null && capacityList.length > 0">-->
<!--                <div v-for="(item,index) in capacityList">-->
<!--                  <span style="width: 200px;text-align: left">-->
<!--                    {{ item.model_dictText }}-->
<!--                  </span>-->
<!--                  <a-progress :percent="item.capacity" style="width: 300px" />-->
<!--                </div>-->
<!--              </span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </a-card>-->
<!--      </a-col>-->

      <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '0px',paddingRight: '0px',marginTop: '-1px'   }">
        <a-card class="card-main-index card-main-index2">
          <div class="right-content" style="margin-top: -10px;">
            <div style="display: inline-block;">
              <div class="intu">
              <span style="    display: block;  font-weight: bold;">
                设备到场数量统计(台套数)
              </span></div>
              <div style="float: left;margin-top: -45px;margin-left: 150px; margin-top: 10px; padding-top: 10px;">
               <!-- <a-progress type="circle" :percent="model.arrival" /> -->
				       <newRateChart2 :percentNum="model.arrival" :title="'设备到场数量统计'" ref="chart2"></newRateChart2>
              </div>
            </div>
            <div style="display: inline-block;">
              <div class="intu">
              <span style="    display: block;  font-weight: bold;">
                设备签署合同数量统计(台套数)
              </span></div>
              <div style="float: left;margin-top: -45px;margin-left: 150px; margin-top: 10px; padding-top: 10px;">
                <!-- <a-progress type="circle" :percent="model.arrival" /> -->
                <newRateChart2 :percentNum="model.cpercent" :title="'设备签署合同数量统计'" ref="chart3"></newRateChart2>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '0px',paddingLeft: '0px', paddingRight: '0px',marginTop: '-1px',marginLeft: '-1px' }">
        <a-card class="card-main-index new-card-main  card-main-index2">
          <div class="right-content" style="display: block;width: 100%;">
            <div style="display: block;">
              <div class="intu">
                <span style="    display: block; margin-top: -10px; font-weight: bold;">
                  子项目进度
                </span>
                <a-select v-model="model.model" size="small" placeholder="请选择项目子项"
                          style="width:40%;position: absolute; right: 10px;    top: 16px;font-size: 16px" @change="fetchChildProgress">
                  <a-select-option
                    v-for="item in childList"
                    :key="item.model"
                    :value="item.model">
                    {{ item.model_dictText }}
                  </a-select-option>
                </a-select>
              </div>
            <a-carousel arrows class="new-card-main" style="margin-top: 10px; padding-top: 20px;">
			  <div style="line-height: 30px; background-color: #FFF!important;" v-if="childList != null && childList.length > 0" >
			    <div style="  font-size: 16px;    text-align: left;    padding-left: 15px; height: 40px;" class="item-concel-iii">
			      产能进度(%):<a-progress :percent="model.prodCapacity" style="width: 65%" strokeColor="#8A38F5"/>
			    </div>
			    <div style="  font-size: 16px;    text-align: left;    padding-left: 15px; height: 40px;" class="item-concel-iii">
			      形象进度(%):<a-progress :percent="model.imageCapacity" style="width: 65%" strokeColor="#00BBFF"/>
			    </div>
			    <div style="  font-size: 16px;    text-align: left;    padding-left: 15px; height: 40px;" class="item-concel-iii">
			      资金进度(%):<a-progress :percent="model.moneyCapacity" style="width: 65%" strokeColor="#00B578"/>
			    </div>
			  </div>
            </a-carousel>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="24" v-if="loading">
      <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '24px',paddingRight: '0px',marginTop: '-1px'  }">
        <a-card>
          <div class="intu">
			  <span style="    display: block; font-size: 16px;font-weight: bold;">
			    已签合同分类(金额)
			  </span>
			</div>
          <div style="padding-top: 20px;">
<!--            <pie ref="pie" :dataSource="contractData"></pie>-->
            <bas-round1 ref="pie1" :dataList="contractData" :id="'pie1'"></bas-round1>
          </div>
        </a-card>
      </a-col>

      <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '24px',paddingLeft: '0px', paddingRight: '0px',marginTop: '-1px',marginLeft: '-1px'  }">
        <a-card>
          <div class="intu">
			  <span style="    display: block; font-size: 16px; font-weight: bold;">
			    已付金额分类(金额)
			  </span>
			</div>
          <div style="padding-top: 20px;">
<!--            <pie1 ref="pie1" :dataSource="payData"></pie1>-->
            <bas-round2 ref="pie2" :dataList="payData" :id="'pie2'"></bas-round2>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="24" v-if="loading">
      <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '24px',paddingRight: '0px',marginTop: '-25px'  }">
        <a-card>
          <div class="intu">
			  <span style="display: block; font-size: 16px;font-weight: bold;">
			    执行金额分类(金额)
			  </span>
          </div>
          <div style="padding-top: 20px;">
<!--            <pie ref="pie" :dataSource="budgetData"></pie>-->
            <bas-round3 ref="pie3" :dataList="budgetData" :id="'pie3'"></bas-round3>
          </div>
        </a-card>
      </a-col>
    </a-row>


  </div>
</template>

<script>
import { getAction } from '@api/manage'
import newRateChart2 from '@comp/chart/newRateChart2'
import pie from '@comp/chart/Pie'
import pie1 from '@comp/chart/Pie'
import { isNullOrEmpty,isNotNullOrEmpty } from '@/utils/util'
import {
  iegAmount
} from '@/utils/util'
import BasRound1 from '@views/report/BasRound'
import BasRound2 from '@views/report/BasRound'
import BasRound3 from '@views/report/BasRound'
export default {
  name: "ProjectOverViewModal",
  components: {
    pie,
    pie1,
	  newRateChart2,
    BasRound1,
    BasRound2,
    BasRound3
  },
  data() {
    return {
      iegAmount,
      capacityList:[],
      childList:[],
      loading:false,
      contractData:[],
      payData:[],
      budgetData:[],
      pieData:[
        { item: 'A', count: 40 },
        { item: 'B', count: 21 },
        { item: 'C', count: 17 },
        { item: 'D', count: 13 },
        { item: 'E', count: 9 }
      ],
      model:{},
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    fetchBomChild(projectId) {
      let url = "/srm/projBase/fetchBomChild";
      let param = {
        projectId:projectId
      }
      getAction(url,param).then(res => {
        this.childList = res.result;
        if(isNullOrEmpty(this.model.model) && this.childList != null && this.childList.length > 0){
          this.model.model = this.childList[0].model
        }
      })
    },
    edit (record) {
      this.model = record;
      this.model.contractAmountTaxLocal = 0;
      this.model.payAmount = 0;
      this.model.invoiceAmount = 0;
      this.model.capacity = 0;
      this.model.arrival = 0;
      this.model.cpercent = 0;
      this.contractData = [];
      this.budgetData = [];
      this.payData = [];
      //项目已投
      this.fetchContractByProjId(record.id);
      //项目已付款
      this.fetchPayAmountByProjId(record.id);
      //项目已开票
      this.fetchInvoiceByProjId(record.id);
      //项目总产能
      this.fetchCapacityByProjId(record.id);
      //资金类型饼图
      this.fetchCategoryAmount(record.id);
      //设备到厂数统计
      this.fetchArrivalQty(record.id);
      //签署合同数量
      this.fetchContractQty(record.id);
      //项目子项
      this.fetchBomChild(record.id);

      setTimeout(() => {
        //记载子项进度
        this.fetchChildProgress();
        //加载饼图
        this.loading = true

        this.$refs.chart2.initData(this.model.arrival);
        this.$refs.chart3.initData(this.model.cpercent);
      }, 1000)
    },
    fetchInvoiceByProjId(projectId){
      let url = "/srm/purchasePayInovice/fetchInvoiceByProjId";
      let param = {
        projectId:projectId
      }
      getAction(url,param).then(res => {
        if(res.result != null && res.result.length > 0){
          this.model.invoiceAmount = res.result[0].invoiceAmountTaxLocal;
        }else{
          this.model.invoiceAmount = 0;
        }
        this.$forceUpdate();
      })
    },
    fetchChildProgress(){
      let that = this;
      setTimeout(() => {
        let url = "/srm/projBase/fetchChildProgress";
        let param = {
          model:that.model.model,
          projectId:that.model.id
        }
        getAction(url,param).then(res => {
          if(res.result != null){
            let data = res.result[0];
            if(data == null){
              that.model.prodCapacity = 0;
              that.model.imageCapacity = 0;
              that.model.moneyCapacity = 0;
            }else{
              that.model.prodCapacity = data.prodCapacity;
              that.model.imageCapacity = data.imageCapacity;
              that.model.moneyCapacity = data.moneyCapacity;
            }

            that.$forceUpdate();
          }
        })
      }, 100)
    },
    fetchContractQty(projectId){
      let url = '/srm/contractBase/fetchContractQty'
      let param = {
        projectId: projectId
      }
      getAction(url, param).then(res => {
        if (res.result != null) {
          this.model.cpercent = res.result.qty
          this.$forceUpdate()
        }
      })
    },
    fetchArrivalQty(projectId){
      let url = "/srm/stkIoBill/fetchArrivalQty";
      let param = {
        projectId:projectId
      }
      getAction(url,param).then(res => {
        if(res.result != null){
          this.model.arrival = res.result.qty;
          this.$forceUpdate();
        }
      })
    },
    fetchCategoryAmount(projectId){
      let url = "/srm/projBase/fetchCategoryAmount";
      let param = {
        id:projectId
      }
      getAction(url,param).then(res => {
        if(res.result != null){
          this.contractData = res.result.contract;
          this.payData = res.result.pay;
          this.budgetData = res.result.budget;
          this.$forceUpdate();
        }
      })
    },
    fetchCapacityByProjId(projectId){
      // let url = "/srm/projBase/fetchCapacityByProjId";
      // let param = {
      //   id:projectId
      // }
      // getAction(url,param).then(res => {
      //   if(res.result != null && isNotNullOrEmpty(res.result.capacity)){
      //     this.model.capacity = Number(res.result.capacity);
      //     this.$forceUpdate();
      //   }
      // })
      this.capacityList = [];
      let url = '/srm/projBase/fetchCapacity'
      let param = {
        id: projectId
      }
      getAction(url, param).then(res => {
        if (res != null) {
          this.capacityList = res
          this.$forceUpdate()
        }
      })
    },
    fetchPayAmountByProjId(projectId){
      let url = "/srm/purPayPlan/fetchPayAmountByProjId";
      let param = {
        projectId:projectId
      }
      getAction(url,param).then(res => {
        if(res.result != null){
          this.model.payAmount = res.result.payAmountCope;
          this.$forceUpdate();
        }
      })
    },
    fetchContractByProjId(projectId){
      let url = "/srm/contractBase/fetchContractByProjId";
      let param = {
        projectId:projectId
      }
      getAction(url,param).then(res => {
        if(res.result != null){
          this.model.contractAmountTaxLocal = res.result.contractAmountTaxLocal;
          this.$forceUpdate();
        }
      })
    }
  }
}
</script>
<style>
	.new-card-main .ant-progress.ant-progress-line{
		margin-left: 30px;
	}
	.new-card-main .ant-carousel .slick-initialized .slick-slide {
		background: #FFF!important;
	}
	.item-concel-iii{

	}
	.item-concel-iii .ant-progress .ant-progress-outer .ant-progress-inner{
		height: 20px!important;
		border-radius: 0!important;
	}
	.item-concel-iii .ant-progress .ant-progress-outer .ant-progress-inner .ant-progress-bg{
		height: 20px!important;
		border-radius: 0!important;
	}
	.new-card-main .ant-progress.ant-progress-line{
		margin-left: 30px;
	}
	.new-card-main .ant-carousel .slick-initialized .slick-slide {
		background: #FFF!important;
	}
	.card-main-index2{
		height: 280px;
	}
.point-div{
  line-height: 50px;
}
.orange-point::before{
  content: " ";
  width: 8px;
  height: 8px;
  background: orange;
  border-radius: 4px;
  display: inline-block;
}
.bule-point::before{
  content: " ";
  width: 8px;
  height: 8px;
  background: #3662EC;
  border-radius: 4px;
  display: inline-block;
}
.gray-point::before{
  content: " ";
  width: 8px;
  height: 8px;
  background: #D8D8D8;
  border-radius: 4px;
  display: inline-block;
}
/* #E8EAF2 */
</style>
<style lang="less" scoped>
.circle-cust{
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