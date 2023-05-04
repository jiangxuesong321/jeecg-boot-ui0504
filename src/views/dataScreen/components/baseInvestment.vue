<template>
  <div class="content">
    <div class="left">
      <!-- <img src="../images/基地投资插图.png" alt=""> -->
    </div>
    <div class="right">
      <span class="wei">单位: 万元</span>
      <ul>
        <li v-for="(e, i) in tableData" :key="i">
          <a-popover>
            <template slot="content">
              <p>{{ e.subject }}</p>
            </template>
            <p class="compony" style="font-size: 17px; font-weight: bold">
              {{ e.subject.length > 5 ? e.subject.slice(0, 4) + "..." : e.subject }}
            </p>
          </a-popover>
          <img src="../images/基地投资-箭头图标.png" alt="" />
          <span class="div" style="text-align: right">
            {{ iegAmount(Math.trunc(e.budgetAmount), "total") }}
          </span>
          <p class="rate" style="margin-left: 10px; text-align: right">
            {{ (e.budgetAmount / totalAmount).toFixed(2) * 100 + "%" }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getAction } from "@api/manage";
import { iegAmount, numberWithCommas } from "@/utils/util";
export default {
  name: "demo",
  components: {},
  data() {
    return {
      iegAmount,
      tableData: [],
      totalAmount: 0,
    };
  },
  mounted() {
    this.getTableData();
  },

  filters: {
    commas(data) {
      return numberWithCommas(data);
    },
  },
  methods: {
    // /srm/projBase/fetchProjAmountBySubject
    async getTableData() {
      const url = "/srm/projBase/fetchProjAmountBySubject";
      await getAction(url, { subject: "", unit: "wy" })
        .then((res) => {
          this.tableData = res.result;
          this.totalAmount = 0;
          res.result.map((item) => {
            this.totalAmount += item.budgetAmount;
          });
        })
        .catch((err) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  .left {
    width: 40%;
    height: 100%;
  }
  .right {
    width: 60%;
    height: 100%;

    .wei {
      color: rgb(77, 82, 102);
      font-size: 16px;
      text-align: right;
      display: block;
      margin: 20px;
    }
    ul {
      li {
        // display: flex;
        // justify-content: space-between;
        // padding: 0 20px 0 10px;
        margin-bottom: 14px;
        align-items: center;
        margin-right: 10px;
        overflow: hidden;
        clear: both;
        cursor: pointer;
        .compony {
          // margin-right: 8px;
          color: #4d5266;
          font-size: 14px;
          width: 84px;
          // white-space: nowrap;
          // text-overflow: ellipsis;
          overflow: hidden;
          float: left;
        }
        img {
          margin: 0 10px 0 0;
          float: left;
        }

        .div {
          font-weight: 550;
          font-size: 20px;
          color: #192883;
          width: 110px;
          margin: 0;
          float: left;
        }
        .rate {
          width: 44px;
          float: left;
          margin-bottom: 0;
          margin-top: 4px;
        }
      }
    }
  }
}

.left {
  background: url("../images/基地投资插图.png") no-repeat;
  background-attachment: fixed;
  background-size: 1000%;
  background-position: right 104%;
}
</style>
