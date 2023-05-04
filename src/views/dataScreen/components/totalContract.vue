<template>
  <div @mouseenter="handleEnter" @mouseleave="handleLeave">
    <a-table
      class="tableContract"
      size="middle"
      :columns="columns"
      :data-source="tableData"
      :pagination="false"
      :scroll="{ y: 200 }"
    >
      <template slot="contractAmountTaxLocal" slot-scope="text, record">
        {{ iegAmount(Math.trunc(text), "total") }}
      </template>
      <template slot="no" slot-scope="text, record, index">
        <span
          style="padding: 4px 8px; color: #fff; border-radius: 4px; background: #5e7ee1"
        >
          {{ index + 1 > 9 ? index + 1 : `0${index + 1}` }}
        </span>
      </template>
      <template slot="rate" slot-scope="text, record, index">
        <span>
          <!-- {{ record.contractAmountTaxLocal }} -->
          <!-- {{ totalAmount }} -->
          {{ (record.contractAmountTaxLocal / totalAmount).toFixed(2) * 100 + "%" }}
        </span>
      </template>
    </a-table>
  </div>
</template>

<script>
import { getAction } from "@api/manage";
import { numberWithCommas, iegAmount } from "@/utils/util";

export default {
  name: "totaltable",
  components: {},
  props: ["area"],
  data() {
    return {
      iegAmount,
      scrollTimer: null, // 滚动定时器
      scrollDirection: "down",
      totalAmount: 0,
      columns: [
        {
          title: "序号",
          // dataIndex: 'no',
          align: "center",
          scopedSlots: { customRender: "no" },
        },
        {
          title: "分类",
          dataIndex: "name",
          align: "center",
        },
        {
          title: "总额(万元)",
          align: "right",
          width: 140,
          dataIndex: "contractAmountTaxLocal",
          scopedSlots: { customRender: "contractAmountTaxLocal" },
        },
        {
          title: "占比",
          dataIndex: "rate",
          align: "right",
          width: 90,
          scopedSlots: { customRender: "rate" },
        },
      ],
      tableData: [],
    };
  },
  watch: {
    area: {
      handler(value) {
        this.getTableData();
      },
      deep: true,
      immediate: true,
    },
  },

  destroyed() {
    clearInterval(this.scrollTimer);
    this.scrollTimer = null;
  },

  // created(){
  // this.scrollTwoFunct()
  // },
  methods: {
    async getTableData() {
      const url = "/srm/contractBase/fetchContractAmountByType";
      await getAction(url, { unit: "wy", subject: this.area })
        .then((res) => {
          this.totalAmount = 0;
          res.result.map((item) => {
            this.totalAmount += item.contractAmountTaxLocal;
            // item.contractAmountTaxLocal = item.contractAmountTaxLocal
          });
          this.tableData = res.result;

          this.scrollTwoFunct();
        })
        .catch((err) => {});
    },
    //
    //
    //
    handleEnter() {
      clearInterval(this.scrollTimer);
      this.scrollTimer = null;
    },
    handleLeave() {
      this.scrollTwoFunct();
    },

    scrollTwoFunct() {
      // 如果定时器存在
      if (this.scrollTimer) {
        // 则先清除
        document.querySelectorAll(`.tableContract .ant-table-body`)[0].scrollTop = 0; // 滚动
        clearInterval(this.scrollTimer);
        this.scrollTimer = null;
      }
      this.scrollTimer = setInterval(() => {
        let that = this;
        const scrollHeight = document.querySelectorAll(
          `.tableContract .ant-table-body`
        )[0].scrollHeight;
        const clientHeight = document.querySelectorAll(
          `.tableContract .ant-table-body`
        )[0].clientHeight;
        const scroll = scrollHeight - clientHeight;
        // 获取当前滚动条距离顶部高度		tableRect是a-table标签名
        const scrollTop = document.querySelectorAll(`.tableContract .ant-table-body`)[0]
          .scrollTop;
        // 向下滚动
        if (this.scrollDirection === "down") {
          // 滚动速度
          const temp = scrollTop + 10;
          document.querySelectorAll(`.tableContract .ant-table-body`)[0].scrollTop = temp; // 滚动
          // 距离顶部高度  大于等于 滚动长度
          if (scroll <= temp) {
            // 滚动到底部 停止定时器
            document.querySelectorAll(`.tableContract .ant-table-body`)[0].scrollTop = 0; // 滚动
            // clearInterval(this.scrollTimer)
            // this.scrollTimer = null
            that.scrollTwoFunct();
          }
        }
      }, 1150);
    },
  },
  created() {
    this.getTableData();
  },
};
</script>

<style lang="scss" scoped>
.tableContract {
  /deep/ .ant-table {
    margin-top: 0;
  }
  /deep/ .ant-table-tbody {
    tr:nth-child(n) {
      color: #4d5266;
      background-color: #e5eafe;
      text-align: center;
    }
  }
  /deep/ .ant-table-tbody {
    tr:nth-child(n):hover > td {
      color: #4d5266;
      background-color: #dae0fa;
    }
  }
  /deep/ .ant-table-tbody {
    tr:nth-child(2n) {
      color: #4d5266;
      background-color: #dae0fa;
      text-align: center;
    }
  }

  /deep/ .ant-table-thead {
    tr {
      th {
        color: #4d5266;
        background-color: #dae0fa !important;
        font-size: 16px;
        // text-align: center;
      }
    }
  }
  /deep/ .ant-table-tbody {
    tr {
      td {
        padding: 10px !important;
        line-height: unset;
      }
    }
  }
}
</style>
