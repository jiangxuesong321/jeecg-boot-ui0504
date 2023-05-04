<template>
  <div>
	  <div class="top-main-bg">
		  <div class="top-main-bg-div">
		  		欢迎回来，{{ nickname() }}
		  </div>
	  </div>
    <!--领导-->
    <div v-if="roleCode != null && roleCode.indexOf('lead') > -1">
      <index-chart></index-chart>
	  <!-- <indexPage ref="indexPage" /> -->
    </div>

    <!--项目中心-->
    <div v-else>
      <index-chart-by-proj-center></index-chart-by-proj-center>
    </div>

    <!--使用部门-->
<!--    <div v-else-if="roleCode != null && roleCode.indexOf('use_dept') > -1">-->
<!--      <index-chart-by-use-dept></index-chart-by-use-dept>-->
<!--    </div>-->

<!--    <div v-else>-->
<!--      <index-chart-by-use-dept></index-chart-by-use-dept>-->
<!--    </div>-->

<!--    <div style="width: 100%;text-align: right;margin-top: 20px">
      请选择首页样式：
      <a-radio-group v-model="indexStyle">
        <a-radio :value="1">统计图表</a-radio>
        <a-radio :value="2">统计图表2</a-radio>
        <a-radio :value="3">任务表格</a-radio>
      </a-radio-group>
    </div> -->
  </div>
</template>

<script>
  import IndexChart from './IndexChart'

//   import indexPage from './dataScreen/index.vue'

  import IndexTask from "./IndexTask"
  import IndexBdc from './IndexBdc'
  import { mapGetters } from 'vuex'
  import { getAction } from '@api/manage'
  import IndexChartByProjCenter from '@views/dashboard/IndexChartByProjCenter'
  import IndexChartByUseDept from '@views/dashboard/IndexChartByUseDept'

  export default {
    name: "Analysis",
    components: {
      IndexChart,
      IndexTask,
      IndexBdc,
      IndexChartByProjCenter,
      IndexChartByUseDept,
	  
    },
    data() {
      return {
        indexStyle:1,
        roleCode:'',
      }
    },
    created() {
	  let isShowScreen = localStorage.getItem('isShow')
      this.getRoleCode(isShowScreen-0);
    },
    methods: {
      ...mapGetters(["nickname", "avatar","userInfo"]),

      getRoleCode(show){
        let url = "/sys/user/getRoleCodeByUserId";
        getAction(url,{}).then(res => {
          this.roleCode = res.result.roleCode;
		//   console.log(res.result.roleCode,'res.result.roleCode');
        //   localStorage.setItem('isLead',res.result.roleCode)
		  if(this.roleCode != null && this.roleCode.indexOf('lead') > -1){
			// console.log(123);
			if(!show) return
			this.$router.push({
				path: '/dataScreen/index',
				params:{
				id: 0
				}
			})
		  }
        })
      },
    }
  }
</script>
<style>
	.top-main-bg{
		z-index: 2;
		height: 59px;
		transition: background 300ms;
		background-image: url(../../assets/login_images/image2.jpg);
		background-repeat: no-repeat;
		background-size: 100% auto;
		background-position: center -28vw;
		width: calc(100% + 24px);
		margin-left: -12px;
		margin-top: -12px;
		margin-bottom: 15px;
	}
	.hascollapsed .top-main-bg{
		z-index: 2;
		height: 65px;
		transition: background 300ms;
		background-image: url(../../assets/login_images/image2.jpg);
		background-repeat: no-repeat;
		background-size: 100% auto;
		background-position: center -29.8vw;
		width: calc(100% + 24px);
		margin-left: -12px;
		margin-top: -12px;
		margin-bottom: 15px;
	}
	.top-main-bg-div{
		width: 100%;
		background-color: rgba(0, 0, 0, 0.3);
		height: 100%;
		line-height: 65px;
		color: #FFF;
		padding-left: 1rem;
		font-size: 20px;
	}
	@media only screen and (max-width: 1000px) and (min-width: 800px) {
		.top-main-bg{
			z-index: 2;
			height: 59px;
			transition: background 300ms;
			background-image: url(../../assets/login_images/image2.jpg);
			background-repeat: no-repeat;
			background-size: 100% auto;
			background-position: center -33.2vw;
			width: calc(100% + 24px);
			margin-left: -12px;
			margin-top: -12px;
			margin-bottom: 15px;
		}
		.hascollapsed .top-main-bg{
			z-index: 2;
			height: 65px;
			transition: background 300ms;
			background-image: url(../../assets/login_images/image2.jpg);
			background-repeat: no-repeat;
			background-size: 100% auto;
			background-position: center -33.2vw;
			width: calc(100% + 24px);
			margin-left: -12px;
			margin-top: -12px;
			margin-bottom: 15px;
		}
		.top-main-bg-div{
			width: 100%;
			background-color: rgba(0, 0, 0, 0.3);
			height: 100%;
			line-height: 65px;
			color: #FFF;
			padding-left: 1rem;
			font-size: 20px;
		}
	}
	@media only screen and (max-width: 1300px) and (min-width: 1000px) {
		.top-main-bg{
			z-index: 2;
			height: 59px;
			transition: background 300ms;
			background-image: url(../../assets/login_images/image2.jpg);
			background-repeat: no-repeat;
			background-size: 100% auto;
			background-position: center -18.5vw;
			width: calc(100% + 24px);
			margin-left: -12px;
			margin-top: -12px;
			margin-bottom: 15px;
		}
		.hascollapsed .top-main-bg{
			z-index: 2;
			height: 65px;
			transition: background 300ms;
			background-image: url(../../assets/login_images/image2.jpg);
			background-repeat: no-repeat;
			background-size: 100% auto;
			background-position: center -29.8vw;
			width: calc(100% + 24px);
			margin-left: -12px;
			margin-top: -12px;
			margin-bottom: 15px;
		}
		.top-main-bg-div{
			width: 100%;
			background-color: rgba(0, 0, 0, 0.3);
			height: 100%;
			line-height: 65px;
			color: #FFF;
			padding-left: 1rem;
			font-size: 20px;
		}
	}
	@media only screen and (max-width: 1500px) and (min-width: 1300px) {
		.top-main-bg{
			z-index: 2;
			height: 59px;
			transition: background 300ms;
			background-image: url(../../assets/login_images/image2.jpg);
			background-repeat: no-repeat;
			background-size: 100% auto;
			background-position: center -19.5vw;
			width: calc(100% + 24px);
			margin-left: -12px;
			margin-top: -12px;
			margin-bottom: 15px;
		}
		.hascollapsed .top-main-bg{
			z-index: 2;
			height: 65px;
			transition: background 300ms;
			background-image: url(../../assets/login_images/image2.jpg);
			background-repeat: no-repeat;
			background-size: 100% auto;
			background-position: center -30vw;
			width: calc(100% + 24px);
			margin-left: -12px;
			margin-top: -12px;
			margin-bottom: 15px;
		}
		.top-main-bg-div{
			width: 100%;
			background-color: rgba(0, 0, 0, 0.3);
			height: 100%;
			line-height: 65px;
			color: #FFF;
			padding-left: 1rem;
			font-size: 20px;
		}
	}

	@media only screen and (max-width: 1800px) and (min-width: 1500px) {
		body {
		    background: #162887;
		}
		.top-main-bg{
			z-index: 2;
			height: 59px;
			transition: background 300ms;
			background-image: url(../../assets/login_images/image2.jpg);
			background-repeat: no-repeat;
			background-size: 100% auto;
			background-position: center -18.2vw;
			width: calc(100% + 24px);
			margin-left: -12px;
			margin-top: -12px;
			margin-bottom: 15px;
		}
		.hascollapsed .top-main-bg{
			z-index: 2;
			height: 65px;
			transition: background 300ms;
			background-image: url(../../assets/login_images/image2.jpg);
			background-repeat: no-repeat;
			background-size: 100% auto;
			background-position: center -29.8vw;
			width: calc(100% + 24px);
			margin-left: -12px;
			margin-top: -12px;
			margin-bottom: 15px;
		}
		.top-main-bg-div{
			width: 100%;
			background-color: rgba(0, 0, 0, 0.3);
			height: 100%;
			line-height: 65px;
			color: #FFF;
			padding-left: 1rem;
			font-size: 20px;
		}
	}
	@media only screen and (max-width: 2200px) and (min-width: 1800px) {
		.top-main-bg{
			z-index: 2;
			height: 59px;
			transition: background 300ms;
			background-image: url(../../assets/login_images/image2.jpg);
			background-repeat: no-repeat;
			background-size: 100% auto;
			background-position: center -18.2vw;
			width: calc(100% + 24px);
			margin-left: -12px;
			margin-top: -12px;
			margin-bottom: 15px;
		}
		.hascollapsed .top-main-bg{
			z-index: 2;
			height: 65px;
			transition: background 300ms;
			background-image: url(../../assets/login_images/image2.jpg);
			background-repeat: no-repeat;
			background-size: 100% auto;
			background-position: center -29.8vw;
			width: calc(100% + 24px);
			margin-left: -12px;
			margin-top: -12px;
			margin-bottom: 15px;
		}
		.top-main-bg-div{
			width: 100%;
			background-color: rgba(0, 0, 0, 0.3);
			height: 100%;
			line-height: 65px;
			color: #FFF;
			padding-left: 1rem;
			font-size: 20px;
		}
	}
	@media only screen and (min-width: 2200px) {
		.top-main-bg{
			z-index: 2;
			height: 59px;
			transition: background 300ms;
			background-image: url(../../assets/login_images/image2.jpg);
			background-repeat: no-repeat;
			background-size: 100% auto;
			background-position: center -19.2vw;
			width: calc(100% + 24px);
			margin-left: -12px;
			margin-top: -12px;
			margin-bottom: 15px;
		}
		.hascollapsed .top-main-bg{
			z-index: 2;
			height: 65px;
			transition: background 300ms;
			background-image: url(../../assets/login_images/image2.jpg);
			background-repeat: no-repeat;
			background-size: 100% auto;
			background-position: center -30.8vw;
			width: calc(100% + 24px);
			margin-left: -12px;
			margin-top: -12px;
			margin-bottom: 15px;
		}
		.top-main-bg-div{
			width: 100%;
			background-color: rgba(0, 0, 0, 0.3);
			height: 100%;
			line-height: 65px;
			color: #FFF;
			padding-left: 1rem;
			font-size: 20px;
		}
	}
</style>
