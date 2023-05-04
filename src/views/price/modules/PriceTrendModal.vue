<template>
  <a-drawer
    :title="title"
    :width="width"
    placement="right"
    :closable="false"
	:headerStyle="{ textAlign: 'center'}"
    @close="close"
    destroyOnClose
    :visible="visible">
		<div>
			<a-row>
				<a-col :span="12">
					<bar-and-line :title="chartTitle" :dataSource="visitInfo"></bar-and-line>
				</a-col>
				<a-col :span="12">
					<a-table ref="table" size="middle" :scroll="{x:true}" rowKey="id" 
						:columns="columns"
						:dataSource="dataSource" :pagination="ipagination" 
						class="j-table-force-nowrap">
						<template slot="htmlSlot" slot-scope="text">
							<div v-html="text"></div>
						</template>
						<template slot="imgSlot" slot-scope="text,record">
							<span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
							<img v-else :src="getImgView(text)" :preview="record.id" height="25px" alt=""
								style="max-width:80px;font-size: 12px;font-style: italic;" />
						</template>
						<template slot="fileSlot" slot-scope="text">
							<span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
							<a-button v-else :ghost="true" type="primary" icon="download" size="small"
								@click="downloadFile(text)">
								下载
							</a-button>
						</template>
					</a-table>
				</a-col>
			</a-row>
		</div>
		<div class="drawer-footer" style="text-align: center;margin-top:15px;">
			<a-button key="cancel" @click="handleCancel" style="margin-left:10px;" type="primary" ghost>关闭</a-button>
		</div>
	</a-drawer>
</template>

<script>
  import LineChartMultid from '@/components/chart/LineChartMultid'
  import BarAndLine from '@/components/chart/BarAndLine'
  
  export default {
    name: 'PriceTrendModal',
    components: {
		LineChartMultid,
		BarAndLine
    },
    data() {
      return {
        title:'历史价格',
        width: '90%',
		chartTitle: '设备历史价格曲线',
        visible: false,
        disableSubmit: false,
		visitFields:['日期','价格'],
		visitInfo:[
			{
			  "type": "2021-06-16",
			  "bar": 1000,
			  "line":1000
			},
			{
			  "type": "2021-09-18",
			  "bar": 1200,
			  "line":1200
			},
			{
			  "type": "2021-12-10",
			  "bar": 900,
			  "line":900
			},
			{
			  "type": "2022-01-02",
			  "bar": 1500,
			  "line":1500
			},
			{
			  "type": "2022-02-10",
			  "bar": 1100,
			  "line":1100
			},
			{
			  "type": "2022-03-16",
			  "bar": 900,
			  "line":900
			},
			{
			  "type": "2022-04-12",
			  "bar": 1200,
			  "line":1200
			},
			{
			  "type": "2022-05-08",
			  "bar": 1400,
			  "line":1400
			},
			{
			  "type": "2022-06-16",
			  "bar": 1800,
			  "line":1800
			}
		],
		columns: [{
				title: '#',
				dataIndex: '',
				key: 'rowIndex',
				width: 60,
				align: "center",
				customRender: function(t, r, index) {
					return parseInt(index) + 1;
				}
			},
			{
				title: '物料编码',
				align: "center",
				dataIndex: 'productCode'
			},
			{
				title: '物料名称',
				//align: "center",
				dataIndex: 'productName',
				customRender: (value, row, index) => { //表体的数据列样式
					const obj = {
				  children: value,
						attrs: {},
					};
					obj.attrs.align = 'left';
					return obj;
				}
			},
			{
				title: '成交日期',
				align: "center",
				dataIndex: 'dealDate'
			},
			{
				title: '成交价(元)',
				align: "center",
				dataIndex: 'price'
			},
		],
		dataSource: [
			{
			  "dealDate": "2021-06-16",
			  "price": 1000,
			  "productCode":'2021031018',
			  "productName":'火炉'
			},
			{
			  "dealDate": "2021-09-18",
			  "price": 1200,
			  "productName":'火炉',
			  "productCode":'2021031018',
			},
			{
			  "dealDate": "2021-12-10",
			  "price": 900,
			  "productName":'火炉',
			  "productCode":'2021031018',
			},
			{
			  "dealDate": "2022-01-02",
			  "price": 1500,
			  "productName":'火炉',
			  "productCode":'2021031018',
			},
			{
			  "dealDate": "2022-02-10",
			  "price": 1100,
			  "productName":'火炉',
			  "productCode":'2021031018',
			},
			{
			  "dealDate": "2022-03-16",
			  "price": 900,
			  "productName":'火炉',
			  "productCode":'2021031018',
			},
			{
			  "dealDate": "2022-04-12",
			  "price": 1200,
			  "productName":'火炉',
			  "productCode":'2021031018',
			},
			{
			  "dealDate": "2022-05-08",
			  "price": 1400,
			  "productName":'火炉',
			  "productCode":'2021031018',
			},
			{
			  "dealDate": "2022-06-16",
			  "price": 1800,
			  "productName":'火炉',
			  "productCode":'2021031018',
			}
		]
      }
    },
    methods:{
      add () {
        this.visible=true
/*        this.$nextTick(()=>{
          this.$refs.realForm.add();
        }) */
      },
      edit (record) {
        this.visible=true
        // this.$nextTick(()=>{
        //   this.$refs.realForm.edit(record);
        // })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        this.$refs.realForm.handleOk();
      },
      submitCallback(){
        this.$emit('ok');
        this.visible = false;
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>

<style scoped>
</style>