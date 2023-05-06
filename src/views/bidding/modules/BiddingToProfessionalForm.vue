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
<!--        <a-row>-->
<!--          <a-col :span="6">-->
<!--            标的编码:{{model.prodCode}}-->
<!--          </a-col>-->
<!--          <a-col :span="6">-->
<!--            标的名称:{{model.prodName}}-->
<!--          </a-col>-->
<!--        </a-row>-->
        <a-table
          style="margin-top: 20px"
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :scroll="{x:true}"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false">
          <template slot="isRecommend" slot-scope="text,record">
            <a-checkbox v-model="record.isRecommend" @change="changeCheck(record)" value="1" :disabled="!show">
            </a-checkbox>
          </template>

          <template slot="attachment" slot-scope="text,record">
            <j-upload v-model="record.attachment" :trigger-change="true" :disabled="true"></j-upload>
          </template>

          <template slot="otherAttachment" slot-scope="text,record">
            <j-upload v-model="record.otherAttachment" :trigger-change="true" :disabled="true"></j-upload>
          </template>

          <template v-for="(item,index) in ids" :slot="'itemText' + item" slot-scope="text,record">

            <div>
              <a-input-number v-model="record.itemScores[index]" style="width: 100%" placeholder="请打分" @blur="changeScore(record)" :disabled="!show"></a-input-number>
            </div>
            <div>
              <a-input v-model="record.itemTexts[index]" type="textarea" placeholder="填写评分内容" :disabled="!show"></a-input>
            </div>

          </template>
        </a-table>
        <div>
          评分意见:
        </div>
        <a-input type="textarea" v-model="comment" :disabled="!show">

        </a-input>
      </a-spin>
      <div class="drawer-footer" style="text-align: center;margin-top:15px;">
        <a-button  @click="close" style="margin-left:10px;" type="primary" >返回</a-button>
        <a-button  @click="draft" style="margin-left:10px;" type="primary"  v-if="show">保存</a-button>
        <a-button  @click="submit" style="margin-left:10px;" type="primary" v-if="show">提交评标</a-button>
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
import { formatDate, isNullOrEmpty } from '@/utils/util'
import { SYS_BUTTON_AUTH, USER_AUTH } from '@/store/mutation-types'
import {
  iegAmount
} from '@/utils/util'
export default {
		name: 'BiddingToProfessionalForm',
		mixins: [JVxeTableModelMixin,billListMixin, billModalMixin],
		components: {
			JFormContainer,
      JSelectSupplierModal,
      BasTemplate,
      BasExpert
		},
		data() {
			return {
        templateList:[],
        iegAmount,
        comment:'',
			  show:false,
			  ids:[],
        title:'评标现场',
        width:'80%',
        visible:false,
        columns:[


        ],
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

				},
        allPermissionList:[],
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
		created() {
      let allAuthList = JSON.parse(sessionStorage.getItem(USER_AUTH) || "[]");
      for (let gauth of allAuthList) {
        if(gauth.type != '2') {
          this.allPermissionList.push(gauth.action);
        }
      }
      console.log(this.allPermissionList);
    },
		methods: {
      submit(){
        let that = this;
        let dataSource = this.dataSource;
        if(dataSource == null || dataSource.length == 0){
          that.$message.error("请选择需要提交的数据");
          return;
        }
        let isRecommend = false;
        for(let i = 0; i < dataSource.length; i++){
          if(dataSource[i].isRecommend){
            isRecommend = true;
          }
          if(dataSource[i].itemScores == null || dataSource[i].itemScores.length == 0){
            that.$message.error("第"+ (i + 1) +"行,请检查评分");
            return;
          }
          let itemScores = dataSource[i].itemScores;
          for(let j = 0; j < itemScores.length; j++){
            if(isNullOrEmpty(itemScores[j])){
              that.$message.error("第"+ (i + 1) +"行,请检查评分");
              return;
            }
            let maxScore = this.templateList[j].itemScore;
            let score = itemScores[j];
            if(score < 0 || Number(score) > Number(maxScore)){
              that.$message.error("第"+ (i + 1) +"行,存在打分值大于评分项设定的分值");
              return;
            }
          }
          if(dataSource[i].itemTexts == null || dataSource[i].itemTexts.length == 0){
            that.$message.error("第"+ (i + 1) +"行,请检查评分内容");
            return;
          }
          let itemTexts = dataSource[i].itemTexts;
          for(let j = 0; j < itemTexts.length; j++){
            if(isNullOrEmpty(itemTexts[j])){
              that.$message.error("第"+ (i + 1) +"行,请检查评分内容");
              return;
            }
          }
          if(dataSource[i].itemScores.length != that.ids.length){
            that.$message.error("第"+ (i + 1) +"行,请检查评分");
            return;
          }
          if(dataSource[i].itemTexts.length != that.ids.length){
            that.$message.error("第"+ (i + 1) +"行,请检查评分内容");
            return;
          }
        }
        // if(!isRecommend){
        //   that.$message.error("请选择推荐的供应商");
        //   return;
        // }
        let url = "/srm/biddingMain/submitTemplate";
        let param = {
          ids:that.ids,
          detaiList : dataSource,
          comment:that.comment,
          professionalId:that.model.professionalId
        }
        that.$confirm({
          content: `是否确认提交?`,
          onOk: () => {
            putAction(url,param).then(res => {
              if(res.success){
                that.$message.success('提交成功');
                that.close();
                that.$emit('back');
              }else {
                that.$message.error('提交失败');
              }
            })
          }
        })
      },
      draft(){
        let that = this;
        let dataSource = this.dataSource;
        if(dataSource == null || dataSource.length == 0){
          that.$message.error("请选择需要提交的数据");
          return;
        }
        //判断 分值 是否 大于 招标设置分值
        for(let i = 0; i < dataSource.length; i++){
          let itemScores = dataSource[i].itemScores;
          if(itemScores != null && itemScores.length > 0){
            for(let j = 0; j < itemScores.length; j++){
              let maxScore = this.templateList[j].itemScore;
              let score = itemScores[j];
              if(score < 0 || Number(score) > Number(maxScore)){
                that.$message.error("第"+ (i + 1) +"行,存在打分值大于评分项设定的分值");
                return;
              }
            }
          }
        }
        let url = "/srm/biddingMain/draftTemplate";
        let param = {
          ids:that.ids,
          detaiList : dataSource,
          comment:that.comment,
          professionalId:that.model.professionalId
        }
        that.$confirm({
          content: `是否确认提交?`,
          onOk: () => {
            putAction(url,param).then(res => {
              if(res.success){
                that.$message.success('提交成功');
                that.close();
                that.$emit('back');
              }else {
                that.$message.error('提交失败');
              }
            })
          }
        })
      },
      changeScore(record){
        setTimeout(() => {
          let totalScore = 0;
          if(record.itemScores != null && record.itemScores.length > 0){
            record.itemScores.filter(item => {
              totalScore = Number(totalScore) + Number(item);
            })
            record.itemTotal = Number(totalScore);
            this.$forceUpdate();
          }
        }, 100)
      },
      changeCheck(record){
        // console.log(record.isRecommend);
        // this.dataSource.filter(item => {
        //   item.isRecommend = false;
        //   if(item.id == record.id){
        //     item.isRecommend = true;
        //   }
        // })
      },
      close(){
        this.visible = false;
      },
      setColums(record) {
        let columns = [
          {
            title: '是否推荐',
            dataIndex: 'isRecommend',
            width:120,
            align: 'center',
            scopedSlots: { customRender: 'isRecommend' }
          },
          {
            title: '供应商名称',
            dataIndex: 'name',
            align: 'center',
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
              dataIndex: 'currency_dictText',
              align: 'center',
              width:120,
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

        //判断价格是否可见
        // if(this.allPermissionList != null && this.allPermissionList.indexOf("price:show") > -1){
        //   columns.push(
        //     {
        //     title: '币种',
        //     dataIndex: 'currency_dictText',
        //       align: 'center',
        //     width:120,
        //   }
        //   );
        //   columns.push(
        //     {
        //       title: '报价价格',
        //       dataIndex: 'amountTax',
        //       width: 120,
        //       customRender:function (t,r,index) {
        //         let icon = "";
        //         if(r.currency == 'RMB'){
        //           icon = '¥';
        //         }else if(r.currency == 'JPY'){
        //           icon = 'Ұ';
        //         }else if(r.currency == 'USD'){
        //           icon = '$';
        //         }else if(r.currency == 'EUR'){
        //           icon = '€';
        //         }
        //         // return icon + iegAmount(t,'total')
        //         const obj = {
        //           children: icon + iegAmount(t,'total'),
        //           attrs: {},
        //         };
        //         obj.attrs.align = 'right';//控制表体内容居右
        //         return obj;
        //       }
        //     }
        //   );
        // }
        let templateList = record.templateList;
        this.templateList = templateList;
        let totalScore = 0;
        templateList.filter(item => {
          let obj = {
            // title: item.itemName + item.itemStandard,
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
          this.ids.push(item.id);
          totalScore = Number(totalScore) + Number(item.itemScore)
        });
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
          align:"center",
          dataIndex: 'itemTotal',
          width:120,
          customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
            const obj = {
              children: value,
              attrs: {},
            };
            obj.attrs.align = 'right';//控制表体内容居右
            return obj;
          }
        };
        columns.push(obj);
        this.columns = columns;
        this.visible = true;
        this.dataSource = [];
        this.model = Object.assign({}, record);
        if(this.model.id){
          this.fetchHasBiddingSuppList(this.model.id,this.ids);
        }
      },
      editTwo(record){
        this.show = false;
        this.ids = [];
        this.comment = '';
        this.setColums(record);
      },
      edit(record) {
        this.comment = '';
        this.ids = [];
        this.show = true;
        this.setColums(record);
      },

      fetchHasBiddingSuppList(id,ids){
        let url = "/srm/biddingMain/fetchHasBiddingSuppList";
        let param = {
          id:id,
          ids:ids.join(",")
        }
        getAction(url,param).then(res => {
          this.dataSource = res.result;
          if(this.dataSource != null && this.dataSource.length > 0){
            this.comment = this.dataSource[0].comment;
            for(let i = 0; i < this.dataSource.length; i++){
              if(this.dataSource[i].isRecommend == '1'){
                this.dataSource[i].isRecommend = true;
              }else{
                this.dataSource[i].isRecommend = false;
              }
            }
          }
        })
      },
		}
	}
</script>

<style lang="less" scoped>
	.ant-row.ant-form-item {
		margin-bottom: 12px;
	}
  .multi-ellipsis {
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; // 超出两行则以...形式隐藏
    -webkit-box-orient: vertical;
    cursor: pointer;
  }

</style>
