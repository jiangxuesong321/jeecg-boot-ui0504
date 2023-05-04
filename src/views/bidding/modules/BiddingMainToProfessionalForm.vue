<template>
  <a-drawer
    :title="title"
    :width="width"
    placement="right"
    :closable="false"
    @close="close"
    destroyOnClose
    :visible="visible">
      <a-spin :spinning="confirmLoading">
<!--        <div v-if="supMap != null && supMap != undefined">-->
<!--          <div v-for="(key,val) in supMap">-->
<!--            <span style="font-size: 20px">-->
<!--              {{key[1].name}}-->
<!--            </span>-->
<!--            <span style="margin-left: 20px;font-size: 20px">-->
<!--              {{key[1].score}}分-->
<!--            </span>-->
<!--          </div>-->
<!--        </div>-->
      <div>
        <a-table
          ref="fixedTb1"
          size="middle"
          bordered
          rowKey="id"
          :scroll="{x:true}"
          :columns="columns1"
          :dataSource="dataSource1"
          :pagination="false">
        </a-table>
      </div>

      <div>
        <a-table
          ref="fixedTb2"
          size="middle"
          bordered
          rowKey="id"
          :scroll="{x:true}"
          :columns="columns2"
          :dataSource="dataSource2"
          :pagination="false">
        </a-table>
      </div>

      <div>
        <a-table
          ref="fixedTb2"
          size="middle"
          bordered
          rowKey="id"
          :scroll="{x:true}"
          :columns="columns3"
          :dataSource="dataSource3"
          :pagination="false">
        </a-table>
      </div>

       <div ref="orderForm1" style="margin-top: 20px">
        <div v-for="(rw,index) in expertList">
          <a-row style="margin-top: 10px">
            评标人员:{{rw.professionalName}}
          </a-row>
          <a-row>
            <a-table
              :ref="'table'+index"
              size="middle"
              bordered
              rowKey="id"
              :scroll="{x:true}"
              :columns="rw.columns"
              :dataSource="rw.suppList"
              :pagination="false">
              <template slot="isRecommend" slot-scope="text,record">
                <a-checkbox v-model="record.isRecommend" value="1" disabled>
                </a-checkbox>
              </template>

              <template slot="attachment" slot-scope="text,record">
                <j-upload v-model="record.attachment" :trigger-change="true" :disabled="true"></j-upload>
              </template>

              <template slot="otherAttachment" slot-scope="text,record">
                <j-upload v-model="record.otherAttachment" :trigger-change="true" :disabled="true"></j-upload>
              </template>

              <template v-for="(item,index) in rw.ids" :slot="'itemText' + item" slot-scope="text,record">
                <div>
                  <a-input-number v-model="record.itemScores[index]" style="width: 100%" placeholder="请打分" disabled></a-input-number>
                </div>
                <div>
                  <a-input v-model="record.itemTexts[index]" type="textarea" placeholder="填写评分内容" disabled></a-input>
                </div>
              </template>
            </a-table>
            <div>
              评分意见:
            </div>
            <a-input type="textarea" v-model="rw.suppList[0].comment" :disabled="!show">

            </a-input>
          </a-row>
        </div>
       </div>

      </a-spin>
      <div class="drawer-footer" style="text-align: center;margin-top:15px;">
        <a-button  @click="close" style="margin-left:10px;" type="primary" ghost>返回</a-button>
        <a-button  @click="pdfDownload" style="margin-left:10px;" type="primary" ghost>下载PDF</a-button>
      </div>
  </a-drawer>
</template>

<script>
import { putAction,getAction } from '@/api/manage'
import { JVxeTableModelMixin } from '@/mixins/JVxeTableModelMixin.js'
import JFormContainer from '@/components/jeecg/JFormContainer'
import { billListMixin } from '../../mixins/billListMixin'
import { billModalMixin } from '../../mixins/billModalMixin'
import JSelectSupplierModal from '@comp/jeecgbiz/modal/JSelectSupplierModal'
import BasTemplate from '@views/bidding/modules/BasTemplate'
import BasExpert from '@views/bidding/modules/BasExpert'
import { formatDate, iegAmount, isNullOrEmpty } from '@/utils/util'
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'

export default {
		name: 'BiddingMainToProfessionalForm',
		mixins: [JVxeTableModelMixin,billListMixin, billModalMixin],
		components: {
			JFormContainer,
      JSelectSupplierModal,
      BasTemplate,
      BasExpert
		},
		data() {
			return {
			  supMap:new Map(),
        htmlTitle: "评分详情", //这是定义导出的名字，不写这个默认下载的名字是undefinded
        comment:'',
        expertList:[],
        tabKey:0,
			  show:false,
			  ids:[],
        title:'评标现场',
        width:'80%',
        visible:false,
        dataSource1:[],
        columns1 : [
          {
            title: '供应商名称',
            dataIndex: 'name',
            align:'center',
            width:140,
          },
          {
            title: '物料名称',
            dataIndex: 'prodName',
            align:'center',
            width:140,
          },
          {
            title: '技术分小计',
            dataIndex: 'jsScore',
            align:'center',
            width:120,
          },
          {
            title: '商务分小计',
            dataIndex: 'swScore',
            align:'center',
            width:120,
          },
          {
            title: '总分',
            dataIndex: 'score',
            align:'center',
            width:120,
          },
          {
            title: '平均分',
            dataIndex: 'avgScore',
            align:'center',
            width:120,
          },
        ],
        dataSource2:[],
        columns2 : [],
        dataSource3:[],
        columns3 : [ ],
        columns:[],
        dataSource:[],
				labelCol: {
					xs: {
						span: 24
					},
					sm: {
						span: 5
					},
				},
				wrapperCol: {
					xs: {
						span: 24
					},
					sm: {
						span: 16
					},
				},
				model: {},
				// 新增时子表默认添加几行空数据
				validatorRules: {

        },
				activeKey: '0',
				url: {

				}
			}
		},
		props: {
			//表单禁用
			disabled: {
				type: Boolean,
				default: false,
				required: false
			}
		},
		computed: {
			formDisabled() {
				return this.disabled
			},
		},
		created() {},
		methods: {
      handleChange(tabKey){
        this.ids = [];
        this.setColums(this.expertList[tabKey]);
      },
      close(){
        this.visible = false;
      },
      editTwo(record){
        this.tabKey = 0;
        this.visible = true;
        this.expertList = [];
        this.dataSource = [];
        this.ids = [];
        this.model = Object.assign({}, record);
        let param = {
          biddingId:record.id
        }
        this.fetchBiddingExpertList(param);
        this.fetchBiddingExpertListByCount(param);
        this.fetchBiddingExpertListByJsCount(param);
        this.fetchBiddingExpertListBySwCount(param);
      },
      edit(record){
        this.tabKey = 0;
        this.visible = true;
        this.expertList = [];
        this.dataSource = [];
        this.ids = [];
        this.model = Object.assign({}, record);
        let param = {
          biddingId:record.biddingId,
          supplierId:record.supplierId
        }
        this.fetchBiddingExpertList(param);
        this.fetchBiddingExpertListByCount(param);
        this.fetchBiddingExpertListByJsCount(param);
        this.fetchBiddingExpertListBySwCount(param);
      },
      fetchBiddingExpertListBySwCount(pm){
        let param = JSON.parse(JSON.stringify(pm))
        let columns = [
          {
            title: '供应商名称',
            dataIndex: 'name',
            align:'center',
            width:120,
          },
          {
            title: '物料名称',
            dataIndex: 'prodName',
            align:'center',
            width:120,
          },

        ];
        let url = "/srm/biddingMain/fetchBiddingExpertListByJsCount";
        param.type = '1';
        getAction(url,param).then(res => {
          if(res.result != null){
            let dataList = res.result.dataList;
            let userList = res.result.users;

            dataList.filter(item => {
              let index = 0;
              userList.filter(rw => {
                item['swScore'+index] = rw.itemScore;
                index++;
              })
            })
            this.$forceUpdate();
            let index = 0;
            let parent = {
              title: '商务部分',
              children: [
              ],
            };
            let children = [];
            userList.filter(item => {
              let row = {
                title: item.name,
                dataIndex: 'swScore'+index,
                align:'center',
                width:120,
              }
              children.push(row);
              index++;
            })
            this.dataSource3 = dataList;
            if(children != null && children.length > 0){
              parent.children = children;
              columns.push(parent);

              columns.push(
                {
                  title: '商务总分',
                  dataIndex: 'jsScore',
                  align:'center',
                  width:120,
                },
                {
                  title: '商务平均分',
                  dataIndex: 'avgScore',
                  align:'center',
                  width:120,
                },
              );
            }


            this.columns3 = columns;
          }
        })
      },
      fetchBiddingExpertListByJsCount(pm){
        let param = JSON.parse(JSON.stringify(pm))
        let columns = [
          {
            title: '供应商名称',
            dataIndex: 'name',
            align:'center',
            width:120,
          },
          {
            title: '物料名称',
            dataIndex: 'prodName',
            align:'center',
            width:120,
          },

        ];
        let url = "/srm/biddingMain/fetchBiddingExpertListByJsCount";
        param.type = 0;
        getAction(url,param).then(res => {
          if(res.result != null){
            let dataList = res.result.dataList;
            let userList = res.result.users;

            dataList.filter(item => {
              let index = 0;
              userList.filter(rw => {
                item['jsScore'+index] = rw.itemScore;
                index++;
              })
            })
            this.$forceUpdate();
            let index = 0;
            let parent = {
                title: '技术部分',
                children: [
                ],
            };
            let children = [];
            userList.filter(item => {
              let row = {
                title: item.name,
                dataIndex: 'jsScore'+index,
                align:'center',
                width:120,
              }
              children.push(row);
              index++;
            })
            this.dataSource2 = dataList;
            if(children != null && children.length > 0){
              parent.children = children;
              columns.push(parent);

              columns.push(
                {
                  title: '技术总分',
                  dataIndex: 'jsScore',
                  align:'center',
                  width:120,
                },
                {
                  title: '技术平均分',
                  dataIndex: 'avgScore',
                  align:'center',
                  width:120,
                },
              );
            }

            this.columns2 = columns;
          }
        })
      },
      fetchBiddingExpertListByCount(param){
        let url = "/srm/biddingMain/fetchBiddingExpertListByCount";
        getAction(url,param).then(res => {
          if(res.result != null && res.result.length > 0){
            this.dataSource1 = res.result;
          }
        })
      },
      setColums(record){
        let columns = [
          {
            title: '是否推荐',
            dataIndex: 'isRecommend',
            width:120,
            scopedSlots: { customRender: 'isRecommend' }
          },
          {
            title: '供应商名称',
            dataIndex: 'name',
            width:180,
          },
        ];

        //技术
        if(record.biddingEvaluateType == '0'){
          let obj2 = {
            title: '规格配置附件',
            dataIndex: 'otherAttachment',
            align: 'center',
            width:140,
            scopedSlots: { customRender: 'otherAttachment' }
          };
          columns.push(obj2);
        }
        //商务
        else{
          let obj1 =
            {
              title: '报价附件',
              dataIndex: 'name',
              align: 'attachment',
              width:140,
              scopedSlots: { customRender: 'attachment' }
            };
          columns.push(obj1);

          columns.push(
            {
              title: '交期',
              dataIndex: 'leadTime',
              align: 'center',
              width:120,
            }
          );

          columns.push(
            {
              title: '币种',
              dataIndex: 'currency',
              align: 'center',
              width:120,
              customRender:function (t,r,index) {
                if(r.currency == 'RMB'){
                  return '人民币';
                }else if(r.currency == 'JPY'){
                  return '日元';
                }else if(r.currency == 'USD'){
                  return '美元';
                }else if(r.currency == 'EUR'){
                  return '欧元';
                }
              }
            }
          );
          columns.push(
            {
              title: '报价价格',
              dataIndex: 'amountTax',
              width: 120,
              align:"center",
              customRender:function (t,r,index) {
                let icon = "";
                if(r.currency == 'RMB'){
                  icon = '¥';
                }else if(r.currency == 'JPY'){
                  icon = 'Ұ';
                }else if(r.currency == 'USD'){
                  icon = '$';
                }else if(r.currency == 'EUR'){
                  icon = '€';
                }
                // return icon + iegAmount(t,'total')
                const obj = {
                  children: icon + iegAmount(t,'total'),
                  attrs: {},
                };
                obj.attrs.align = 'right';//控制表体内容居右
                return obj;
              }
            }
          );
        }


        let templateList = record.templateList;
        let ids = [];
        let totalScore = 0;

        templateList.filter(item => {
          let obj = {
            // title: item.itemName,
            title: () => {
              return (
                <div>
                  <div title={item.itemName} style="text-align:left;width: 300px;display: -webkit-box;-webkit-line-clamp: 3;-webkit-box-orient: vertical;overflow: hidden;text-overflow: ellipsis;" >
                    评分项: {item.itemName}
                  </div>
                  <br/>
                  <div title={item.itemStandard} style="text-align:left;width: 300px;display: -webkit-box;-webkit-line-clamp: 3;-webkit-box-orient: vertical;overflow: hidden;text-overflow: ellipsis;" >
                    评分标准: {item.itemStandard}
                  </div>
                  <br/>
                  <div style="text-align:left">满分: {parseFloat(item.itemScore)}</div>
                </div>
              )
            },
            dataIndex: 'itemText' + item.id,
            width:180,
            scopedSlots: { customRender: 'itemText' + item.id }
          };
          columns.push(obj);
          ids.push(item.id);
          totalScore = Number(totalScore) + Number(item.itemScore)
        });
        record.ids = ids;
        let obj = {
          // title: "总分",
          title: () => {
            return (
              <div>
                <div style="text-align:center">总分</div>
                <div style="text-align:center">满分:{totalScore}</div>
              </div>
            )
          },
          dataIndex: 'itemTotal',
          width:120,
        };
        columns.push(obj);
        record.columns = columns;
        // this.columns = columns;
        // this.dataSource = record.suppList;

        //按照供应商汇总总分

        if(record.suppList != null && record.suppList.length > 0){
          // this.comment = this.dataSource[0].comment;
          for(let i = 0; i < record.suppList.length; i++){
            let row = record.suppList[i];
            // let sup = this.supMap.get(row.supplierId);
            // if(sup == null || sup == undefined){
            //   sup = {
            //     name:row.name,
            //     score:row.itemTotal
            //   }
            //   this.supMap.set(row.supplierId,sup);
            // }else{
            //   let score = sup.score;
            //   score = Number(score) + Number(row.itemTotal);
            //   sup.score = score;
            //   this.supMap.set(row.supplierId,sup);
            // }

            if(record.suppList[i].isRecommend == '1'){
              record.suppList[i].isRecommend = true;
            }else{
              record.suppList[i].isRecommend = false;
            }
          }
        }
      },
      fetchBiddingExpertList(param){
        let url = "/srm/biddingMain/fetchBiddingExpertList";
        // this.supMap = new Map();
        getAction(url,param).then(res => {
          if(res.result != null && res.result.length > 0){
            this.expertList = res.result;
            for(let i = 0; i < this.expertList.length; i++){
              let record = this.expertList[i];
              this.setColums(record);
            }
          }
        })
      },
      // 下载pdf
      pdfDownload() {
        let _this = this
        let myBox = this.$refs.orderForm1; //获取ref里面的内容
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
          PDF.save('评分详情.pdf')//下载标题
        });
      },

    }
	}
</script>

<style lang="less" scoped>
	.ant-row.ant-form-item {
		margin-bottom: 12px;
	}
</style>
