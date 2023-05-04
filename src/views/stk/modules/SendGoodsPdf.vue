<template>
<!--  <j-modal-->
<!--    :title="title"-->
<!--    :width="width"-->
<!--    :visible="visible"-->
<!--    switchFullscreen-->
<!--    @ok="handleOk"-->
<!--    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"-->
<!--    @cancel="handleCancel"-->
<!--    cancelText="关闭">-->
<!--    <send-goods-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></send-goods-form>-->
<!--  </j-modal>-->
  <a-drawer :title="title" :width="width" placement="right" :closable="false" :headerStyle="{ textAlign: 'center'}"
            @close="handleCancel" destroyOnClose :visible="visible">
    <div ref='orderForm1'>
      <h1 style='text-align: center'>发&nbsp;&nbsp;货&nbsp;&nbsp;单</h1>
      <a-row style='margin-top: 30px;font-weight:bold'>
        <a-col span='12'>
          合同编码:{{record.contractNumber}}
        </a-col>
        <a-col span='12'>
          发货单编号:{{record.billNo}}
        </a-col>
      </a-row>
      <a-row>
        <table style='width:100%'>
          <thead>
          </thead>
          <tbody>
            <tr>
              <th >卖&nbsp;&nbsp;方</th>
              <td colspan='3'>
                {{record.suppName}}
              </td>
            </tr>
            <tr>
              <th>联&nbsp;&nbsp;系&nbsp;&nbsp;人</th>
              <td>
                {{record.sendUser}}
              </td>
              <th>电&nbsp;&nbsp;话</th>
              <td>
                {{record.sendUserTel}}
              </td>
            </tr>
            <tr>
              <th>承&nbsp;&nbsp;运&nbsp;&nbsp;单&nbsp;&nbsp;位</th>
              <td colspan='3'>
                {{record.fastUnit}}
              </td>
            </tr>
            <tr>
              <th>承&nbsp;&nbsp;运&nbsp;&nbsp;联&nbsp;&nbsp;系&nbsp;&nbsp;人</th>
              <td>{{record.fastUser}}</td>
              <th>电&nbsp;&nbsp;话</th>
              <td>
                {{record.fastUserTel}}
              </td>
            </tr>
          </tbody>
        </table>
      </a-row>
      <a-row style='margin-top: 30px'>
        <table style='width:100%'>
          <thead>
          </thead>
          <tbody>
          <tr>
            <th >买&nbsp;&nbsp;方</th>
            <td colspan='3'>
              {{record.subject}}
            </td>
          </tr>
          <tr>
            <th>联&nbsp;&nbsp;系&nbsp;&nbsp;人</th>
            <td>
              {{record.receiveUser}}
            </td>
            <th>电&nbsp;&nbsp;话</th>
            <td>
              {{record.receiveUserTel}}
            </td>
          </tr>
          <tr>
            <th>收&nbsp;&nbsp;货&nbsp;&nbsp;地&nbsp;&nbsp;址</th>
            <td colspan='3'>
              {{record.address}}
            </td>
          </tr>
          </tbody>
        </table>
      </a-row>
      <a-row style='margin-top: 30px'>
        <table style='width:100%'>
          <thead>

          </thead>
          <tbody>
            <tr>
              <td>名称</td>
              <td>型号</td>
              <td>数量</td>
              <td>单位</td>
              <td>序号</td>
              <td>S/N</td>
              <td>信用证号</td>
              <td>箱单编号</td>
              <td>发货日期</td>
              <td>备注</td>
            </tr>
            <tr v-if='dataSource != null && dataSource.length > 0' v-for='(item,index) in dataSource'>
              <td>{{item.prodName}}</td>
              <td>{{item.prodSpecType}}</td>
              <td>{{item.qty}}</td>
              <td>台/套</td>
              <td>{{item.sort}}</td>
              <td>{{item.seqNo}}</td>
              <td>{{item.socialNo}}</td>
              <td>{{item.packNo}}</td>
              <td>{{item.sendTime}}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </a-row>
      <a-row style='margin-top: 30px'>
        <div style='border: 2px solid black;width:100%;height: 400px'>
          <div>
            货物签收栏
          </div>
          <br>
          <br>
          <br>
          <div style='text-align: center'>
            <div style='display: flex;width: 40%;justify-content: space-between;margin: 0 auto;'>
              <span>外包装完好</span>
              <div>
                <a-checkbox style=''>是</a-checkbox>
                <a-checkbox style=''>否</a-checkbox>
              </div>
            </div>

          </div>
          <div style='text-align: center'>
            <div style='display: flex;width: 40%;justify-content: space-between;margin: 0 auto;'>
              <span>到场货物型号、数量与上表一致</span>
              <div>
                <a-checkbox style=''>是</a-checkbox>
                <a-checkbox style=''>否</a-checkbox>
              </div>
            </div>
          </div>
          <br>
          <br>
          <br>
          <div style='margin-left: 20%'>
            备注:______________________________________________________________
          </div>
          <br>
          <br>
          <div style='margin-left: 20%'>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;______________________________________________________________
          </div>
          <div style='text-align: right;margin-right: 10%'>
            签收人签字：
          </div>
          <br>
          <br>
          <div style='text-align: right;margin-right: 10%'>
            日&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期：
          </div>
        </div>
      </a-row>
    </div>
    <div class="drawer-footer" style="text-align: center;margin-top:15px;">
      <a-button  @click="pdfDownload" style="margin-left:10px;" type="primary" ghost >下载PDF</a-button>
<!--      <a-button  @click="handleOk" type="primary" v-if="!disableSubmit" style="margin-left:10px;">提交</a-button>-->
      <a-button key="cancel" @click="handleCancel" style="margin-left:10px;" type="primary" ghost>取消</a-button>
    </div>
  </a-drawer>
</template>

<script>

  import SendGoodsForm from './SendGoodsForm'
  import html2canvas from 'html2canvas'
  import JsPDF from 'jspdf'
  import { getAction } from '@api/manage'
  export default {
    name: 'SendGoodsPdf',
    components: {
      SendGoodsForm
    },
    data () {
      return {
        dataSource:[],
        record:{},
        title:'',
        width:'90%',
        visible: false,
        disableSubmit: false
      }
    },
    methods: {
      pdfDownload() {
        let _this = this
        let myBox = _this.$refs.orderForm1; //获取ref里面的内容
        html2canvas(myBox, {
          useCORS: true, //是否尝试使用CORS从服务器加载图像
          allowTaint: true,
          dpi: 300, //解决生产图片模糊
          scale: 3, //清晰度--放大倍数
        }).then(function (canvas) {
          let contentWidth = canvas.width
          let contentHeight = canvas.height
          let pageHeight = contentWidth / 592.28 * 841.89 // 一页pdf显示html页面生成的canvas高度;
          let leftHeight = contentHeight //未生成pdf的html页面高度
          let position = 0 //pdf页面偏移
          //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
          // let imgWidth = 595.28
          let imgWidth = 560.28  //宽度
          let imgHeight = 592.28 / contentWidth * contentHeight
          let pageData = canvas.toDataURL('image/jpeg', 1.0)
          let PDF = new JsPDF('', 'pt', 'a4')

          // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
          //当内容未超过pdf一页显示的范围，无需分页
          if (leftHeight < pageHeight) {
            PDF.addImage(pageData, 'JPEG', 20, 20, imgWidth, imgHeight)
          } else {
            while (leftHeight > 0) {
              PDF.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight)
              leftHeight -= pageHeight
              position -= 841.89
              if (leftHeight > 0) {
                PDF.addPage()
              }
            }
          }
          PDF.save('发货单.pdf')//下载标题
        });
      },

      edit (record) {
        // let suppName = this.$store.getters.userInfo.realname;
        // record.suppName = suppName;
        this.record = record;
        this.visible=true;
        this.getContract(record.contractId);
        this.fetchDetailList(record.id);
      },
      getContract(contractId){
        let url = "/srm/contractBase/queryById";
        getAction(url,{id:contractId}).then(res => {
          this.record.subject = res.result.contractFirstParty;
          this.record.address = res.result.address;
          this.record.suppName = res.result.contractSecondParty;
          this.$forceUpdate();
        })
      },
      fetchDetailList(id){
        this.dataSource = [];
        let url = "/srm/stkIoBill/queryStkIoBillEntryByMainId";
        getAction(url,{id:id}).then(res => {
          let data = res.result;
          this.dataSource = data;
        })
      },
      close () {
        this.visible = false;
      },
      handleOk () {

      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>
<style lang="less" scoped>
thead,
tfoot {
  //background-color: #3f87a6;
  color: #fff;
}

tbody {
  //background-color: #e4f0f5;
}

caption {
  padding: 10px;
  caption-side: bottom;
}

table {
  border-collapse: collapse;
  border: 2px solid black;
  letter-spacing: 1px;
  font-family: sans-serif;
  font-size: 0.8rem;
}

td {
  border: 1px solid black;
  padding: 5px 10px;
}
th {
  border: 1px solid black;
  padding: 5px 10px;
  width: 10% !important;
}



</style>