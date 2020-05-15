<template>
  <div class="paymentCompletion">
    <div class="payFinish">
      <div class="ico">
        <img src="../../assets/correct.png" alt />
      </div>
      <p>支付成功</p>
      <div class="money">{{this.$route.query.totalFee}}</div>
    </div>
    <ul class="list">
      <li>
        <span>缴费类型：</span>
        <span>{{this.$route.query.stopType}}</span>
      </li>
      <li>
        <span>停车时长：</span>
        <span>{{this.$route.query.duration}}</span>
      </li>
      <li>
        <span>付款方式：</span>
        <span>{{this.$route.query.payType}}</span>
      </li>
    </ul>
    <!-- <bottomButton @click="$router.push('/personalCenter')" :bgColor="'white'">订单完成</bottomButton> -->
    <commodityFooter>
      <div @click="$router.push('/personalCenter')" class="instructions_determine">订单完成</div>
    </commodityFooter>    
  </div>
</template>

<script>
import { commodityFooter } from "../../components/index";
export default {
  name: "paymentCompletion",
  data() {
    return {};
  },
  components: {
    commodityFooter
  }
};
</script>

<style lang="scss" scoped>
.paymentCompletion {
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  background-color: white;
  padding: 0 60px;
  color: #000;
  .payFinish {
    color: #000;
    text-align: center;
    .ico {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 120px;
      img {
        width: 170px;
        height: 170px;
      }
    }
    > p {
      font-size: 18px; /*no*/
      margin: 30px 0;
      font-weight: 700;
    }
    .money {
      margin-bottom: 120px;
      font-size: 30px; /*no*/
      font-weight: 700;
    }
  }
  .list {
    border-bottom: 1px solid #dcdcdc; /*no*/
    border-top: 1px solid #dcdcdc; /*no*/
    li {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px; /*no*/
    }
  }
  .instructions_determine {
    margin: 0 auto;
    width: 690px;
    height: 88px;
    line-height: 88px;
    color: #fff;
    font-size: 32px;
    text-align: center;
    background: linear-gradient(
      90deg,
      rgba(162, 96, 164, 1),
      rgba(199, 119, 201, 1)
    );
    border-radius: 44px;
  }
}
</style>
