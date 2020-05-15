<template>
  <div class="payResults results">
    <headerTab></headerTab>
    <div class="results_content">
      <div class="results_content_top">
              <p class="txt2">{{this.$route.query.amount}}元</p>
        <p class="txt3">交易成功</p>
      </div>
      <ul class="results_content_bottom">
        <li>
          <span class="span_left">车牌号</span>
          <span class="span_right">{{this.$route.query.plateNumber}}</span>
        </li>
        <li>
          <span class="span_left">入场时间</span>
          <span class="span_right">{{this.$route.query.inTime | filterTime2}}</span>
        </li>
        <li>
          <span class="span_left">出场时间</span>
          <span class="span_right">{{this.$route.query.OrderTimes | filterTime}}</span>
        </li>
        <li>
          <span class="span_left">停车时长</span>
          <span class="span_right">{{this.$route.query.duration | filterTime3}}</span>
        </li>
        <li>
          <span class="span_left">缴费时间</span>
          <span class="span_right">{{getDate()}}</span>
        </li>
        <li>
          <span class="span_left">缴费方式</span>
          <span class="span_right">微信支付</span>
        </li>
        <!-- <li>
          <span class="span_left">缴费订单号</span>
          <span class="span_right">{{$route.query.orderNo}}</span>
        </li> -->
      </ul>
      <div class="results_content_remind">温馨提示：请在缴费完成后15分钟离场。</div>
    </div>
  </div>
</template>

<script>
import { headerTab } from "../../components";
import { is_Weixn } from "../../unit/unit.js";

export default {
  name: "payResults",
  components: {
    headerTab
  },
  data() {
    return {
      arrList: "",
      payWay: "" //支付方式
    };
  },
  filters:{
    filterTime(str){
      let value = str||''
      return value?(value.slice(0,4)+'-'+value.slice(4,6)+'-'+value.slice(6,8)+' '+value.slice(8,10)+'：'+value.slice(10,12)+'：'+value.slice(12,14)):''
    },
    filterTime2(str){
      let value = str||''
      return value.replace(/:/g,'：')
    },
    filterTime3(str){
      let arr = str.split(':')
      let hour='',minuth='',second='',day=''
      second= (arr.length-1)>=0?Number(arr[arr.length-1])+'秒':''
      minuth= (arr.length-2)>=0?Number(arr[arr.length-2])+'分钟':''
      hour= (arr.length-3)>=0?Number(arr[arr.length-3])+'小时':''
      day= (arr.length-4)>=0?Number(arr[arr.length-4])+'天':''
      return day+hour+minuth+second
    }
  },
  methods: {
    // 判断是否是微信支付
    is_Weixn() {
      if (this.route.query.payWay) {
        this.payWay = this.route.query.payWay;
      } else {
        this.payWay = "微信支付";
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
        "：" +
        this.conver(m) +
        "：" +
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
      height: 250px;
      background-image: url("../../assets/img/addcheliang2.png");
      background-size: cover;
      font-size: 48px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      // padding-left: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      align-content: center;
      flex-wrap: wrap;

      p {
        text-align: center;
        width: 100%;
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
      .txt1 {
        line-height: 40px;
        margin-bottom: 20px;
        font-size: 36px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
      }

      .txt2 {
        padding-top:60px;
        font-size: 60px;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        line-height: 60px;
        margin-bottom: 20px;
      }

      .txt3 {
        font-size: 26px;
        color: rgba(255, 255, 255, 1);
      }
    }

    .results_content_bottom {
      background-color: #fff;
      padding: 20px 40px;

      li {
        height: 70px;
        line-height: 70px;
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
<style lang="scss">
.payResults {
  .back-arrow {
    display: none;
  }
}
</style>
