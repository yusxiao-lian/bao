<template>
  <div id="paySelect">
    <div class="type">支付方式</div>
    <div class="item zfb" id="alipay">
      <div class="left">
        <i></i>
        <div class="text">支付宝支付</div>
      </div>
      <div class="right">
        <input id="zhf" type="checkbox" v-model="payActive" value="1" @change="checkboxChange(1)" />
        <label for="zhf"></label>
      </div>
    </div>
    <div class="item wx" id="wechat">
      <div class="left">
        <i></i>
        <div class="text">微信支付</div>
      </div>
      <div class="right">
        <input id="wx" type="checkbox" v-model="payActive" value="2" @change="checkboxChange(2)" />
        <label for="wx"></label>
      </div>
    </div>
  </div>
</template>

<script>
import zfb from "../../assets/ad_pay_ico_zfb.png";
import wx from "../../assets/ad_pay_ico_wx.png";
export default {
  name: "paySelect",
  data() {
    return {
      payActive: [],
      active: ""
    };
  },
  watch: {},
  methods: {
    checkboxChange(index) {
      if (index == this.active) {
        this.payActive = [];
        this.active = "";
      } else {
        this.payActive = [index];
        this.active = index;
      }
      this.$emit("getPayType", this.active);
    }
  }
};
</script>

<style lang="scss" scoped>
#paySelect {
  padding: 0 35px;
  background-color: white;
  width: 100%;
  .type {
    height: 80px;
    line-height: 80px;
    font-size: 24px;
    color: rgba(51, 51, 51, 1);
    border-bottom: 1px solid #f7f5f6;
  }
  .item {
    padding: 17px 0;
    height: 88px;
    line-height: 88px;
    border-bottom: 1px solid #f7f5f6;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .left {
      width: 290px;
      display: flex;
      align-items: center;
      height: 54px;
      .text {
        font-size: 28px;
        color: rgba(51, 51, 51, 1);
      }
    }
    .right {
      width: 44px;
      height: 44px;
      border-radius: 100%;
      border: 1px solid #dcdcdc; /*no*/
      box-sizing: content-box;
      position: relative;
      
      label {
        position: absolute;
        left: 0;
        top: 0;
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
      input {
        width: 100%;
        height: 100%;
        opacity: 0;
        display: block;
        background-color: transparent;
      }
      input:checked + label {
       top: 0px;
        background-color: #a35fa5;
      }
      input:checked + label:before {
        transition: all 0.3s;
        position: absolute;
        left: 54%;
        top: 43%;
        content: "";
        width: 28px;
        height: 13px;
        border-left: 2px solid white; /*no*/
        border-bottom: 2px solid white; /*no*/
        transform: translate(-50%, -50%) rotate(-45deg);
      }
    }
    i {
      width: 54px;
      height: 54px;
      display: inline-block;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 54px;
      margin-right: 20px;
    }
  }
  div:first-of-type {
    i {
      background-image: url("../../assets/ad_pay_ico_zfb.png");
    }
  }
  div:last-of-type {
    border-bottom: none;
    i {
      background-image: url("../../assets/ad_pay_ico_wx.png");
    }
  }
}
</style>
