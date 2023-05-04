<template>
  <j-select-biz-component :width="1000" v-bind="configs" v-on="$listeners"/>
</template>

<script>
  import JSelectBizComponent from './JSelectBizComponent'

  export default {
    name: 'JSelectProject',
    components: { JSelectBizComponent },
    props: ['value'],
    data() {
      return {
        settings: {
          name: '项目',
          displayKey: 'projName',
          returnKeys: ['id', 'projCode'],
          listUrl: '/srm/projBase/list',
          queryParamCode: ['projCode','projName'],
          queryParamText: ['项目编码','项目名称'],
          columns: [
            { title: '项目名称', dataIndex: 'projName', align: 'center', width: '30%', widthRight: '70%' },
            { title: '项目编码', dataIndex: 'projCode', align: 'center', width: '35%' },
            { title: '项目类型', dataIndex: 'projType_dictText', align: 'center', width: '25%' }
          ]
        }
      }
    },
    computed: {
      configs() {
        return Object.assign({ value: this.value }, this.settings, this.$attrs)
      }
    }
  }
</script>

<style lang="less" scoped></style>