<template>
  <div>
	  <div style="position: absolute;left: 8%;top: 38%;">
		  <img style="width: 480px;" src="../../../assets/login_images/banner.png" />
	  </div>
<!--	  <div class="main" style="padding-bottom: 70px;">-->
<!--	    <a-form :form="form" class="user-layout-login" ref="formLogin" id="formLogin">-->
<!--			<div class="log-form-t">-->
<!--				<a style="width: 70px; padding-top: 8px;">-->
<!--					<img style="width: 100%;" src="../../../assets/login_images/left.png" />-->
<!--				</a>-->
<!--				<a class="log-form-title">项目采购管理系统</a>-->
<!--				<a style="width: 70px; padding-top: 8px;">-->
<!--					<img style="width: 100%;" src="../../../assets/login_images/right.png" />-->
<!--				</a>-->
<!--			</div>-->
<!--	    </a-form>-->

<!--	  	<div class="has-line">-->
<!--	  	德莱维-->
<!--	  	</div>-->


<!--	  </div>-->
  </div>
</template>

<script>
//import md5 from "md5"
import { timeFix, welcome } from '@/utils/util'
import Vue from 'vue'
import { ACCESS_TOKEN, ENCRYPTED_STRING, UI_CACHE_DB_DICT_DATA, USER_INFO, USER_NAME } from '@/store/mutation-types'
import { getAction } from '@api/manage'
import { getEncryptedString } from '@/utils/encryption/aesEncrypt'

export default {
    components: {

    },
    data () {
      return {

      }
    },
    created () {
      Vue.ls.remove(ACCESS_TOKEN)
      this.initSso();
    },
    methods: {

      initSso(){
        let that = this;
        let token = null;
        let geturl = window.location.href;
        let param = geturl.split('?')[1];
        token = param.split("=")[1];
        let url = "/sys/cas/client/validateLoginToZhlx";

        return new Promise((resolve, reject) => {
          getAction(url,{token:token}).then(response => {
            console.log("----cas 登录--------",response);
            if(response.success){
              const result = response.result
              const userInfo = result.userInfo
              Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
              Vue.ls.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
              Vue.ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
              let commit = this.$store.commit;
              commit('SET_TOKEN', result.token)
              commit('SET_INFO', userInfo)
              commit('SET_NAME', { username: userInfo.username,realname: userInfo.realname, welcome: welcome() })
              commit('SET_AVATAR', userInfo.avatar)
              resolve(response)
              that.loginSuccess();
            }else{
              that.$message.error(res.message);
              resolve(response)
            }
          }).catch(error => {
            reject(error)
          })
        })
      },
      loginSuccess () {
        this.$router.push({ path: "/dashboard/analysis" }).catch(()=>{
          console.log('登录跳转首页出错,这个错误从哪里来的')
        })
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`,
        });
      },
    }
  }
</script>
<style>
	.log-form-t{
	    display: flex;
	    width: 100%;
	    text-align: center;
	    padding-bottom: 2rem;
	    margin-top: 1rem;
	}
	/* .ant-tabs-nav .ant-tabs-tab{
		margin-right: 0!important;
	} */
	.log-form-title{
		width: 180px;
		text-align: center;
		height: 33px;
		font-size: 20px;
		font-family: Microsoft YaHei-Bold, Microsoft YaHei;
		font-weight: bold;
		color: #3662EC;
		line-height: 33px;
	}
	.item-div-padding{
		padding-bottom: 1rem;
	}
	.has-line{
		position: absolute;
		line-height: 50px;
		margin-top: 1rem;
		border-top: 1px #ccc solid;
		width: 100%;
		left: 0;
		text-align: center;
		color: #767676;
		font-size: 14px;
	}
	.ant-tabs-nav-container{
		font-size: 16px;
	}
	.main .user-layout-login .ant-tabs-nav .ant-tabs-tab{
		margin-left: 20px!important;
		margin-right: 20px!important;
	}
	.getCaptcha {
		position: absolute!important;
		width: 60px!important;
		font-size: 13px!important;
		right: 12px!important;
		top: -12px!important;
		background: none!important;
		color: #3662EC!important;
		height: 40px!important;
	}
</style>
<style lang="less" scoped>
.main{
  width: 400px;
  box-sizing: border-box;
  padding: 20px 40px;
  padding-bottom: 40px;
  margin: 0 auto;
  background: #fff;
  position: absolute;
  right: 15%;
  top: 25%;
  box-shadow: 3px 4px 5px rgb(0 0 0 / 10%);
  border-radius: 0px;
  .login-logo{
      text-align: center;
      padding: 30px 0;
      img{
        height: 70px;
      }

	}

  .user-layout-login {
    label {
      font-size: 14px;
      color: red;
    }

::v-deep .ant-tabs-nav .ant-tabs-tab-active{
  /* font-size: 20px; */
  color: #3662EC !important;
  border-bottom: 3px #3662EC solid;
}
::v-deep .ant-tabs-nav .ant-tabs-ink-bar{
  display: none !important;
}

    .forge-password {
      font-size: 14px;
    }
    ::v-deep .ant-input:-webkit-autofill , ::v-deep textarea:-webkit-autofill , ::v-deep select:-webkit-autofill {
			-webkit-box-shadow: 0 0 0px 1000px transparent  inset !important;
			 background-color:transparent;
			 background-image: none;
			 transition: background-color 50000s ease-in-out 0s;
    }
    .login-input{
			height: 48px;
			width: 100%;
			box-sizing: border-box;
			padding: 0 10px;
			padding-left: 35px;
			border-radius:0;
			border: 1px solid #ddd;
			outline:none;
			font-size: 16px;
      ::v-deep .ant-input{
        background:none;
        padding-top: 10px;
        padding-left: 0px;
        // padding: 0px;
        // background: olive;
        border: none;
        &:hover{
          border: none;
          box-shadow: none;
        }
        &:focus{
          border: none;
          box-shadow: none;
        }
      }
    }

		button{
			height: 60px;
			width: 100%;
			background: linear-gradient(0deg,#3662EC,#5672FD);
			border:0;
			color: #fff;
			cursor: pointer;
			font-size: 16px;
      border-radius: 30px;
			&:hover{
				background: linear-gradient(0deg,#3662EC,#5672FD);
				opacity:0.8;
			}
		}

    .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;

      .item-icon {
        font-size: 24px;
        color: rgba(0,0,0,.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color .3s;
        &:hover {
          color: #152887;
        }
      }

      .register {
        float: right;
      }
    }

  }

}

</style>
<style lang="less" scoped>

  .user-layout-login {
    label {
      font-size: 14px;
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

    .forge-password {
      font-size: 14px;
    }

    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
    }

    .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;

      .item-icon {
        font-size: 24px;
        color: rgba(0,0,0,.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color .3s;

        &:hover {
          color: #3562EC;
        }
      }

      .register {
        float: right;
      }
    }
  }

</style>
<style>
  .valid-error .ant-select-selection__placeholder{
    color: #f5222d;
  }
</style>