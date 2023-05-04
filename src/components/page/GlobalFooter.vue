<template>
  <div class="footer">
<!--    <div class="links">
      <a href="http://www.jeecg.com" target="_blank">JEECG 首页</a>
      <a href="https://github.com/zhangdaiscott/jeecg-boot" target="_blank">
        <a-icon type="github"/>
      </a>
      <a href="https://ant.design/">Ant Design</a>
      <a href="https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn/">Vue Antd</a>
    </div>-->
<!--    <div class="copyright">-->
<!--      当前系统版本:{{number}}-->
<!--    </div>-->
    <div id="show1">

    </div>
<!--    <div class="copyright">-->
<!--      Copyright-->
<!--      <a-icon type="copyright"/>-->
<!--      2022-->
<!--    </div>-->
  </div>
</template>

<script>
import { ajaxGetDictItems, getDictItemsFromCache } from '@api/api'
import watermark from '@/utils/watermark'
import { getAction } from '@api/manage'
import { isNotNullOrEmpty } from '@/utils/util'

export default {
    name: "LayoutFooter",
    data() {
      return {
        number:'1.0.0',
      }
    },

    created() {
      //获取字典数据
      this.initDictData();
    },
  mounted() {
    //领导不需要水印
    let url = "/sys/user/getRoleCodeByUserId";
    getAction(url,{}).then(res => {
      let roleCode = res.result.roleCode;
      if(isNotNullOrEmpty(roleCode) && roleCode.indexOf('watermark') > -1){

      }else{
        watermark.set(this.$store.getters.userInfo.realname,this.$store.getters.userInfo.username)
      }
    })

  },

    methods : {

      initDictData() {
        //优先从缓存中读取字典配置
        if(getDictItemsFromCache('system_no')){
          let dictOptions = getDictItemsFromCache('system_no');
          if(dictOptions != null){
            this.number = dictOptions[0].label || dictOptions[0].text;
          }
          return
        }

        //根据字典Code, 初始化字典数组
        ajaxGetDictItems('system_no', null).then((res) => {
          if (res.success) {
//                console.log(res.result);
            let dictOptions = res.result;
            if(dictOptions != null){
              this.number = dictOptions[0].label || dictOptions[0].text;
            }
          }
        })
      },
    }
  }
</script>

<style>

</style>
<style lang="less" scoped>
  .footer {
    padding: 0 16px;
    margin: 48px 0 24px;
    text-align: center;

    .links {
      margin-bottom: 8px;

      a {
        color: rgba(0, 0, 0, .45);

        &:hover {
          color: rgba(0, 0, 0, .65);
        }

        &:not(:last-child) {
          margin-right: 40px;
        }
      }
    }
    .copyright {
      color: rgba(0, 0, 0, .45);
      font-size: 14px;
    }
  }

</style>