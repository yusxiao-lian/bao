<template>
  <div id="paySelect">
    <div class="wx">
      <div class="left">
        <i class="i1"></i>
        <div>
          <p>微信支付</p>
        </div>
      </div>
      <div class="right">
        <input id="wx" type="checkbox" v-model="payActive" value="2" @change="checkboxChange(2)">
        <label :class="judge?'isAndroid':''" for="wx">
        </label>
      </div>
    </div>
    <div class="wx" v-if="this.$route.params.fromApp">
      <div class="left">
        <i class="i2"></i>
        <div>
          <p>支付宝支付</p>
        </div>
      </div>
      <div class="right">
        <input id="zfb" type="checkbox" v-model="payActive" value="1" @change="checkboxChange(1)">
        <label :class="judge?'isAndroid':''" for="zfb">
        </label>
      </div>
    </div>
  </div>
</template>

<script>
  import {judge, is_Weixn} from "../../unit/unit.js";

  export default {
    name: "paySelect",
    data() {
      return {
        payActive: [],
        active: null,
        judge: false
      }
    },
    watch: {},
    methods: {
      checkboxChange(index) {
        this.judge = true
        if (index == this.active) {
          this.payActive = []
          this.active = null
        } else {
          this.payActive = [index]
          this.active = index
        }
        console.log(this.payActive, '#@#@#@@#@#');
        this.$emit('getPayType', this.active)
      }
    },
    created() {
      // if (is_Weixn()) {
      this.active = 2
      this.payActive = ['2']
      this.$emit('getPayType', this.active)
      // }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  #paySelect {
    background-color: white;
    width: 100%;
    .zfb, .wx {
      height: 88px;
      // line-height: 88px;
    }
    .zfb {
      border-bottom: 1Px solid #dcdcdc; /*no*/
    }
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: left;
      .left {
        display: flex;
        align-items: center;
        line-height: 20px; /*no*/
        p {
          font-size: 28px;
        }
      }
      .right {
        width: 40px;
        height: 40px;
        border-radius: 100%;
        border: 1Px solid #dcdcdc; /*no*/
        box-sizing: content-box;
        position: relative;
        overflow: hidden;
        label {
          position: absolute;
          left: 0;
          top: 0;
          display: block;
          width: 100%;
          height: 100%;
        }
        .isiOS {
          position: absolute;
          left: 0;
          top: 0;
        }
        .isAndroid {
          position: absolute;
          left: 0;
          top: 0px;
        }
        input {
          width: 100%;
          height: 100%;
          opacity: 0;
          background-color: transparent;
        }
        input:checked + label {
          transition: all .4s;
          background-color: #C777C9;
        }
        input:checked + label:before {
          transition: all .3s;
          position: absolute;
          left: 52%;
          top: 43%;
          content: '';
          width: 28px;
          height: 13px;
          border-left: 2Px solid white; /*no*/
          border-bottom: 2Px solid white; /*no*/
          transform: translate(-50%, -50%) rotate(-50deg);
        }
      }
      i {
        width: 54px;
        height: 54px;
        display: inline-block;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        margin-right: 20px;
      }
    }

    .i1 {
      background-image: url("../../assets/img/weixin.png");
    }

    /*border-bottom: none;*/
    .i2 {
      background-image: url("../../assets/ad_pay_ico_zfb.png");

    }

  }
</style>
