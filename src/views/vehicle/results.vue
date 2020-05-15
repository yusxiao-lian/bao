<template>
  <div class="results">
    <headerTab :fn="clickBack"></headerTab>
    <div class="results_content">
      <div class="results_content_top">
        <p>
          <i></i>
          {{this.$route.query.parkingName}}
        </p>
        <p>{{this.$route.query.amount}}元</p>
        <p>交易成功</p>
      </div>
      <ul class="results_content_bottom">
        <li>
          <span class="span_left">车牌号</span>
          <span class="span_right">{{this.$route.query.numberPlate}}</span>
        </li>
        <li>
          <span class="span_left">缴费房间号</span>
          <span class="span_right">{{this.$route.query.buildingName}}</span>
        </li>
        <li>
          <span class="span_left">续卡月数</span>
          <span class="span_right">{{this.$route.query.num}}</span>
        </li>
        <li>
          <span class="span_left">月卡有效期</span>
          <span class="span_right">{{this.$route.query.validity}}</span>
        </li>
        <li>
          <span class="span_left">缴费时间</span>
          <span class="span_right">{{getDate()}}</span>
        </li>
        <li>
          <span class="span_left">缴费方式</span>
          <span class="span_right">{{is_Weixn()}}</span>
        </li>
        <li>
          <span class="span_left">收款方</span>
          <span class="span_right">吉祥E+</span>
        </li>
      </ul>
      <!-- <div class="results_content_remind">温馨提示：请在缴费完成后15分钟内离场</div> -->
    </div>
  </div>
</template>

<script>
import { headerTab } from "../../components";
import { is_Weixn } from "../../unit/unit.js";

export default {
  name: "results",
  components: {
    headerTab
  },
  data() {
    return {
      arrList: ""
    };
  },
  methods: {
    // 后退
    clickBack() {
      this.$router.push("/myVehicle");
    },
    // 判断是否是微信支付
    is_Weixn() {
      if (this.$route.query.payWay) {
        return this.$route.query.payWay;
      } else {
        return "微信公众号支付";
      }
    },
    getDate() {
      let myDate = new Date();
      //获取当前年
      let year = myDate.getFullYear();
      //获取当前月
      let month = myDate.getMonth() + 1;
      //获取当前日
      let date = myDate.getDate();
      let h = myDate.getHours(); //获取当前小时数(0-23)
      let m = myDate.getMinutes(); //获取当前分钟数(0-59)
      let s = myDate.getSeconds();
      //获取当前时间
      return (
        year +
        "-" +
        this.conver(month) +
        "-" +
        this.conver(date) +
        " " +
        this.conver(h) +
        ":" +
        this.conver(m) +
        ":" +
        this.conver(s)
      );
    },
    //日期时间处理
    conver(s) {
      return s < 10 ? "0" + s : s;
    }
  }
};
</script>

<style lang="scss" scoped>
.results {
  height: 100%;
  background-color: #f1f1f1;
  padding-top: 100px;

  .results_content {
    .results_content_top {
      padding-top: 30px;
      height: 250px;
      background-image: url("../../assets/img/addcheliang.png");
      background-size: cover;
      font-size: 48px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      p {
        font-size: 36px;
        text-align: center;

        i {
          width: 40px;
          height: 40px;
          display: inline-block;
          background-image: url("../../assets/img/location.png");
          background-size: cover;
          vertical-align: top;
          margin-right: 10px;
        }
      }

      p:nth-child(1) {        
        line-height: 40px;
        margin-bottom: 20px;
      }

      p:nth-child(2) {
        font-weight: 600;
        font-size: 46px;
        line-height: 40px;
        margin-bottom: 20px;
      }

      p:nth-child(3) {
        font-size: 30px;
        line-height: 50px;
        font-size: 26px;
      }
    }

    .results_content_bottom {
      background-color: #fff;
      padding: 10px 40px;

      li {
        height: 70px;
        line-height: 70px;
        font-size: 30px;
        // border-bottom: 1px solid rgba(240, 242, 245, 1);
        position: relative;
        &:last-child {
          border-bottom: 0;
        }

        .span_left {
          float: left;
          color: #a0a0a0;
        }

        .span_right {
          float: right;
          color: #333333;
        }
      }
    }

    .results_content_remind {
      padding: 0 30px;
      line-height: 88px;
      font-size: 26px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: rgba(26, 26, 26, 1);
    }
  }
}
</style>
