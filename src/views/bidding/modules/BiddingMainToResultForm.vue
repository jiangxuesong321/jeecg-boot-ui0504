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
        </a-table>
      </a-spin>
      <div class="drawer-footer" style="text-align: center;margin-top:15px;">
        <a-button  @click="close" style="margin-left:10px;" type="primary" ghost>返回</a-button>
      </div>
  </a-drawer>
</template>

<script>
import { getAction } from '@/api/manage'
import { JVxeTableModelMixin } from '@/mixins/JVxeTableModelMixin.js'
import JFormContainer from '@/components/jeecg/JFormContainer'
import { billListMixin } from '../../mixins/billListMixin'
import { billModalMixin } from '../../mixins/billModalMixin'

export default {
		name: 'BiddingMainToResultForm',
		mixins: [JVxeTableModelMixin,billListMixin, billModalMixin],
		components: {
			JFormContainer,
		},
		data() {
			return {
        title:'评标现场',
        width:'80%',
        visible:false,
        columns:[
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 120,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '供应商名称',
            align: "center",
            dataIndex: 'name',
            width:180,
          },
          {
            title: '技术标总评分',
            dataIndex: 'totalScore',
            width:120,
            customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
              const obj = {
                children: value,
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          },
          // {
          //   title: '技术标平均分',
          //   dataIndex: 'score',
          //   width:120,
          //   customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
          //     const obj = {
          //       children: value,
          //       attrs: {},
          //     };
          //     obj.attrs.align = 'right';//控制表体内容居右
          //     return obj;
          //   }
          // },
          {
            title: '商务标总评分',
            dataIndex: 'totalScore1',
            width:120,
            customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
              const obj = {
                children: value,
                attrs: {},
              };
              obj.attrs.align = 'right';//控制表体内容居右
              return obj;
            }
          },
          // {
          //   title: '商务标平均分',
          //   dataIndex: 'score1',
          //   width:120,
          //   customRender:(value, row, index) => {//本列的值,所有行数据包括本列,第几列。表体的数据列样式
          //     const obj = {
          //       children: value,
          //       attrs: {},
          //     };
          //     obj.attrs.align = 'right';//控制表体内容居右
          //     return obj;
          //   }
          // },
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

      close(){
        this.visible = false;
      },
      editTwo(record){
        this.visible = true;
        this.dataSource = [];
        this.model = Object.assign({}, record);
        this.fetchResult(this.model.id);
      },
      fetchResult(id){
        let url = "/srm/biddingMain/fetchResult";
        let param = {
          id:id
        }
        getAction(url,param).then(res => {
          this.dataSource = res.result;
        })
      },
		}
	}
</script>

<style lang="less" scoped>
	.ant-row.ant-form-item {
		margin-bottom: 12px;
	}
</style>
